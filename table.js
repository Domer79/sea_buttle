"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const contracts_1 = require("./contracts");
class Row {
}
Row.ColClasses = ['empty', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
class ButtleField {
    constructor() {
        this.ships = new Array();
        this.fieldCells = new Array();
        this.ships.push(new Ship(4));
        this.ships.push(new Ship(3));
        this.ships.push(new Ship(3));
        this.ships.push(new Ship(2));
        this.ships.push(new Ship(2));
        this.ships.push(new Ship(2));
        this.ships.push(new Ship(1));
        this.ships.push(new Ship(1));
        this.ships.push(new Ship(1));
        this.ships.push(new Ship(1));
    }
    addHeadRow() {
        let row = $(`<tr class="headRow"></tr>`);
        for (var i = 0; i < 11; i++) {
            if (i === 0) {
                row.append($(`<th class="empty"></th>`));
                continue;
            }
            row.append($(`<th class="${Row.ColClasses[i]}"></th>`).text(Row.ColClasses[i].toUpperCase()));
        }
        return $("<thead></thead>").append(row);
    }
    render() {
        this.jqueryFieldContainer = $("<div class='container'></div>");
        this.jqueryFieldContainer.append($("<div class='lock'></div>"));
        let jqueryElement = $(`<table class="${this.addClasses()}"></table>`);
        this.jqueryFieldContainer.append(jqueryElement);
        jqueryElement.append(this.addHeadRow());
        let bodyTable = $("<tbody></tbody>");
        jqueryElement.append(bodyTable);
        for (var r = 0; r < 10; r++) {
            let row = $("<tr></tr>");
            for (var c = 0; c < 11; c++) {
                if (c === 0) {
                    row.append($(`<th class="numbers">${r + 1}</th>`));
                    continue;
                }
                let $td = $(`<td class="cell" coords="${r + 1},${c}"></td>`).bind("shut", this.shut).on("click", function (event) {
                    let coords = $(this).attr("coords").split(',');
                    $(this).trigger({ type: "shut", "coords": coords });
                });
                row.append($td);
                let fieldCell = new FieldCell(r + 1, c, this.fieldCells, $td);
                this.fieldCells.push(fieldCell);
            }
            bodyTable.append(row);
        }
        this.initShips();
        $("body").append(this.jqueryFieldContainer);
    }
    // shut(event: any): any {
    //     let coords = $(this).attr("coords").split(',');
    //     $(this).addClass("got");
    // }
    getDefaultShut() {
        var self = this;
        return function defaultShut(row, col) {
            let fieldCell = self.fieldCells.find(function (element) {
                return element.row === row && element.col === col;
            });
            fieldCell.removeMask();
            let ship = fieldCell.ship;
            if (!ship) {
                fieldCell.cellStatus = contracts_1.CellStatus.Past;
                return contracts_1.CellStatus.Past;
            }
            fieldCell.cellStatus = contracts_1.CellStatus.Dead;
            if (ship.isDead()) {
                ship.occupyRemoveMask();
                return contracts_1.CellStatus.Dead;
            }
            return contracts_1.CellStatus.Got;
        };
    }
    addClasses() {
        return "field";
    }
    initShips() {
        for (var i = 0; i < this.ships.length; i++) {
            let ships = this.ships.filter(function (element) {
                return !element.ready;
            });
            let nextRandomShipIndex = Math.round(ships.length * Math.random());
            nextRandomShipIndex = ships.length === nextRandomShipIndex ? nextRandomShipIndex - 1 : nextRandomShipIndex;
            let ship = ships[nextRandomShipIndex];
            this.initShip(ship);
        }
    }
    initShip(ship) {
        var freeCells = this.getFreeCells();
        let fieldCell = this.getFirstRandomCell(freeCells);
        let index = 0;
        while (true) {
            if (!ship || !ship.coords[index]) {
                // console.log(ship);
                // console.log(ship.coords[index]);
            }
            ship.coords[index] = fieldCell;
            ship.coords[index].cellStatus = contracts_1.CellStatus.Live;
            if (ship.ready)
                break;
            fieldCell = fieldCell.getNextCell();
            if (!fieldCell) {
                ship.SetTemp();
                freeCells = this.getFreeCells();
                fieldCell = this.getFirstRandomCell(freeCells);
                index = 0;
                continue;
            }
            index++;
        }
        ship.occupy();
        this.fieldCells.forEach(element => {
            if (element.cellStatus === contracts_1.CellStatus.Temp) {
                element.cellStatus = contracts_1.CellStatus.None;
            }
        });
    }
    getFirstRandomCell(cells) {
        let rand = Math.random();
        let index = Math.round(rand * (cells.length * 0.5));
        return cells[index === cells.length ? index - 1 : index];
    }
    getFreeCells() {
        return this.fieldCells.filter(function (fieldCell) {
            return fieldCell.cellStatus === contracts_1.CellStatus.None;
        });
    }
    closeCurtain(withShips) {
        this.fieldCells.forEach(element => {
            if (withShips) {
                element.addMask();
                return;
            }
            if (!element.ship)
                element.addMask();
        });
    }
    lock() {
        let lock = $(".lock", this.jqueryFieldContainer);
        lock.css("display", "inline");
    }
    unLock() {
        let lock = $(".lock", this.jqueryFieldContainer);
        lock.css("display", "none");
    }
    down() {
        return this.ships.filter(function (element) {
            return element.isDead();
        }).length == this.ships.length;
    }
    fog() {
        $(this.jqueryFieldContainer).css("opacity", "0.5");
    }
    clearFog() {
        $(this.jqueryFieldContainer).css("opacity", "");
    }
}
exports.default = ButtleField;
class FieldCell {
    constructor(r, c, allCells, td) {
        this.allCells = allCells;
        this.td = td;
        this._row = r;
        this._col = c;
        this.cellStatus = contracts_1.CellStatus.None;
    }
    get row() {
        return this._row;
    }
    get col() {
        return this._col;
    }
    get cellStatus() {
        return this._cellStatus;
    }
    set cellStatus(value) {
        this._cellStatus = value;
        this.td
            .removeClass(Services.EnumToArray(contracts_1.CellStatus).join(' ').toLowerCase())
            .addClass(contracts_1.CellStatus[value].toLowerCase());
    }
    getNextCell() {
        var self = this;
        var nextCell = this.allCells.find(function (element) {
            return element.row === self.row && element.col === (self.col + 1);
        });
        if (!nextCell)
            return nextCell;
        if (nextCell.cellStatus !== contracts_1.CellStatus.None)
            return undefined;
        return nextCell;
    }
    occupy(ship) {
        this.ship = ship;
        this.workAround((fieldCells) => {
            fieldCells.forEach(element => {
                if (element && (element.cellStatus === contracts_1.CellStatus.None || element.cellStatus === contracts_1.CellStatus.Temp))
                    element.cellStatus = contracts_1.CellStatus.Occupy;
            });
        });
    }
    getCell(r, c) {
        return this.allCells.find(function (element) {
            return element.row === r && element.col === c;
        });
    }
    isDead() {
        return this.cellStatus === contracts_1.CellStatus.Dead;
    }
    addMask() {
        this.td.addClass("mask");
    }
    removeMask() {
        this.td.removeClass("mask");
    }
    isMask() {
        return this.td.hasClass("mask");
    }
    occupyRemoveMask() {
        this.workAround((fieldCells) => {
            fieldCells.forEach(element => {
                if (element && (element.cellStatus === contracts_1.CellStatus.Occupy || element.cellStatus === contracts_1.CellStatus.Past))
                    element.td.removeClass("mask");
            });
        });
    }
    workAround(work) {
        let leftCell = this.getCell(this.row, this.col - 1);
        let leftTopCell = this.getCell(this.row - 1, this.col - 1);
        let leftBottomCell = this.getCell(this.row + 1, this.col - 1);
        let rightCell = this.getCell(this.row, this.col + 1);
        let rightTopCell = this.getCell(this.row - 1, this.col + 1);
        let rightBottomCell = this.getCell(this.row + 1, this.col + 1);
        let topCell = this.getCell(this.row - 1, this.col);
        let bottomCell = this.getCell(this.row + 1, this.col);
        work([
            leftCell,
            leftTopCell,
            leftBottomCell,
            rightCell,
            rightTopCell,
            rightBottomCell,
            topCell,
            bottomCell
        ]);
    }
}
exports.FieldCell = FieldCell;
class Ship {
    constructor(length) {
        this.length = length;
        this.coords = new Array();
        for (var i = 0; i < length; i++) {
            this.coords.push(null);
        }
    }
    clear() {
        this.coords.forEach(element => {
            element.cellStatus = contracts_1.CellStatus.None;
        });
    }
    SetTemp() {
        this.coords.forEach(element => {
            if (element)
                element.cellStatus = contracts_1.CellStatus.Temp;
        });
    }
    get ready() {
        return this.isReady();
    }
    isReady() {
        var result = !this.coords.some(function (element) {
            return !element || (element.cellStatus !== contracts_1.CellStatus.Live);
        });
        return result;
    }
    occupy() {
        this.coords.forEach(element => {
            element.occupy(this);
        });
    }
    isDead() {
        return this.coords.filter(element => {
            return element.isDead();
        }).length === this.coords.length;
    }
    occupyRemoveMask() {
        this.coords.forEach(element => {
            element.occupyRemoveMask();
        });
    }
}
class Services {
    static EnumToArray(enumType) {
        let enums = new Array();
        for (let item in enumType) {
            if (isNaN(Number(item))) {
                enums.push(item);
            }
        }
        return enums;
    }
}
