import * as $ from "jquery";
import * as jQuery from "jquery";
import {CellStatus} from './contracts';

class Row {
    static ColClasses: string[] = ['empty', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
}    


export default class ButtleField{
    constructor(){
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

    ships: Ship[] = new Array<Ship>();
    fieldCells: FieldCell[] = new Array<FieldCell>();
    jqueryFieldContainer: any;

    addHeadRow(): any {
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
                if (c === 0){
                    row.append($(`<th class="numbers">${r+1}</th>`));
                    continue;
                }

                let $td = $(`<td class="cell" coords="${r+1},${c}"></td>`).bind("shut", this.shut).on("click", function(event: any){
                    let coords = $(this).attr("coords").split(',');
                    $(this).trigger({type: "shut", "coords": coords});
                });
                row.append($td);

                let fieldCell = new FieldCell(r+1, c, this.fieldCells, $td);
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

    getDefaultShut(): (row: Number, col: Number) => CellStatus{
        var self = this;
        return function defaultShut(row: number, col: number): CellStatus{
            let fieldCell = self.fieldCells.find(function(element: FieldCell){
                return element.row === row && element.col === col;
            });
    
            fieldCell.removeMask();
    
            let ship = fieldCell.ship;
            if (!ship){
                fieldCell.cellStatus = CellStatus.Past;
                return CellStatus.Past;
            }
    
            fieldCell.cellStatus = CellStatus.Dead;
            if (ship.isDead()){
                ship.occupyRemoveMask();
                return CellStatus.Dead;
            }
    
            return CellStatus.Got;
        }
    }

    shut: (event: any) => void;

    addClasses(): string {
        return "field";
    }

    initShips(){
        for (var i = 0; i < this.ships.length; i++) {
            let ships = this.ships.filter(function(element){
                return !element.ready;
            });

            let nextRandomShipIndex = Math.round(ships.length * Math.random());
            nextRandomShipIndex = ships.length === nextRandomShipIndex ? nextRandomShipIndex - 1 : nextRandomShipIndex;
            let ship = ships[nextRandomShipIndex];

            this.initShip(ship);
        }
    }

    private initShip(ship: Ship){
        var freeCells = this.getFreeCells();
        let fieldCell: FieldCell = this.getFirstRandomCell(freeCells);
        let index = 0;

        while(true){
            if (!ship || !ship.coords[index]){
                // console.log(ship);
                // console.log(ship.coords[index]);
            }

            ship.coords[index] = fieldCell as FieldCell;
            ship.coords[index].cellStatus = CellStatus.Live;

            if (ship.ready)
                break;

            fieldCell = fieldCell.getNextCell();
            if (!fieldCell)
            {
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
            if (element.cellStatus === CellStatus.Temp){
                element.cellStatus = CellStatus.None;
            }
        });
    }

    private getFirstRandomCell(cells: Array<FieldCell>):FieldCell{
        let rand = Math.random();
        let index = Math.round(rand * (cells.length * 0.5));
        return cells[index === cells.length ? index - 1 : index];
    }

    private getFreeCells(): Array<FieldCell>{
        return this.fieldCells.filter(function(fieldCell: FieldCell){

            return fieldCell.cellStatus === CellStatus.None;
        });
    }

    closeCurtain(withShips?: boolean): void {
        this.fieldCells.forEach(element => {
            if (withShips){
                element.addMask();
                return;
            }
            
            if (!element.ship)
                element.addMask();
        });
    }

    lock(): any {
        let lock = $(".lock", this.jqueryFieldContainer);
        lock.css("display", "inline")
    }

    unLock(): any {
        let lock = $(".lock", this.jqueryFieldContainer);
        lock.css("display", "none")
    }

    down(): boolean{
        return this.ships.filter(function(element: Ship){
            return element.isDead();
        }).length == this.ships.length;
    }

    fog(){
        $(this.jqueryFieldContainer).css("opacity", "0.5");
    }

    clearFog(){
        $(this.jqueryFieldContainer).css("opacity", "");    
    }
}

export class FieldCell{
    ship: Ship;
    private _row: number;
    private _col: number;

    private _cellStatus: CellStatus;
    
    constructor(r,c:number, private allCells: Array<FieldCell>, private td: any){
        this._row = r;
        this._col = c;
        this.cellStatus = CellStatus.None;
    }

    public get row(): number{
        return this._row;
    }

    public get col(): number{
        return this._col;
    }

    public get cellStatus(){
        return this._cellStatus;
    }

    public set cellStatus(value: CellStatus){
        this._cellStatus = value;
        this.td
        .removeClass(Services.EnumToArray(CellStatus).join(' ').toLowerCase())
        .addClass(CellStatus[value].toLowerCase());
    }

    getNextCell(): FieldCell{
        var self = this;
        var nextCell = this.allCells.find(function(element: FieldCell){
            return element.row === self.row && element.col === (self.col + 1);
        })

        if (!nextCell)
            return nextCell;

        if (nextCell.cellStatus !== CellStatus.None)
            return undefined;

        return nextCell;
    }

    occupy(ship: Ship): any {
        this.ship = ship;

        this.workAround((fieldCells: Array<FieldCell>) => {
            fieldCells.forEach(element => {
                if (element && (element.cellStatus === CellStatus.None || element.cellStatus === CellStatus.Temp)) 
                    element.cellStatus = CellStatus.Occupy;
            });    
        });
    }

    private getCell(r: number, c:number): FieldCell{
        return this.allCells.find(function(element:FieldCell){
            return element.row === r && element.col === c;
        });
    }

    isDead(): boolean{
        return this.cellStatus === CellStatus.Dead;
    }

    addMask() {
        this.td.addClass("mask");
    }

    removeMask() {
        this.td.removeClass("mask");
    }

    private isMask(): boolean{
        return this.td.hasClass("mask");
    }

    occupyRemoveMask(){
        this.workAround((fieldCells: Array<FieldCell>) => {
            fieldCells.forEach(element => {
                if (element && (element.cellStatus === CellStatus.Occupy || element.cellStatus === CellStatus.Past))
                    element.td.removeClass("mask");
            });
        });
    }

    private workAround(work: (cells: Array<FieldCell>) => void){
        let leftCell = this.getCell(this.row, this.col - 1);
        let leftTopCell = this.getCell(this.row - 1, this.col - 1);
        let leftBottomCell = this.getCell(this.row + 1, this.col - 1);

        let rightCell = this.getCell(this.row, this.col +1);
        let rightTopCell = this.getCell(this.row - 1, this.col + 1);
        let rightBottomCell = this.getCell(this.row + 1, this.col + 1);

        let topCell = this.getCell(this.row - 1, this.col);
        let bottomCell = this.getCell(this.row + 1, this.col);

        work(
            [
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

class Ship{
    constructor(public length:number){
        this.coords = new Array<FieldCell>();
        for (var i = 0; i < length; i++) {
            this.coords.push(null);
        }
    }

    coords:Array<FieldCell>;

    clear(){
        this.coords.forEach(element => {
            element.cellStatus = CellStatus.None;
        });
    }

    SetTemp(){
        this.coords.forEach(element => {
            if (element)
                element.cellStatus = CellStatus.Temp;
        });
    }

    get ready(): boolean{
        return this.isReady();
    }

    private isReady():boolean{
        var result = !this.coords.some(function(element: FieldCell){
            return !element || (element.cellStatus !== CellStatus.Live)
        });

        return result;
    }

    occupy() {
        this.coords.forEach(element => {
            element.occupy(this);
        });
    }

    isDead(): boolean{
        return this.coords.filter(element => {
            return element.isDead();
        }).length === this.coords.length;
    }

    occupyRemoveMask(): any {
        this.coords.forEach(element => {
            element.occupyRemoveMask();
        });
    }
}

class Services{
    static EnumToArray(enumType: any): Array<any>{
        let enums = new Array<any>();
        for (let item in enumType) {
            if (isNaN(Number(item))) {
                enums.push(item);
            }
        }

        return enums;
    }
}