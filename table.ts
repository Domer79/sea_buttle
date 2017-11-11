import * as $ from "jquery";
import * as jQuery from "jquery";

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
        let jqueryElement = $(`<table class="${this.addClasses()}"></table>`);
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
        
        $("body").append(jqueryElement);
    }

    // shut(event: any): any {
    //     let coords = $(this).attr("coords").split(',');
    //     $(this).addClass("got");
    // }

    defaultShut(row: number, col: number): CellStatus{
        let fieldCell = this.fieldCells.find(function(element: FieldCell){
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
                console.log(ship);
                console.log(ship.coords[index]);
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

    closeCurtain(): void {
        this.fieldCells.forEach(element => {
            element.addMask();
        });
    }
}

class FieldCell{
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

    getCell(r,c:number){
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

export enum CellStatus{
    None = 0, //Автоматически устанавливается при инициализация
    Temp = 1, //Временный статус, используется при инициализации корабля
    Occupy = 2, //Устанавливается для ячеек вокруг корабля, при его инициализации
    Past = 4, //Устанавливается при непопадании по кораблю
    Live = 8, //Устанавливается при инициализации корабля
    Got = 16, //Устанавливается при попадании в корабль
    Dead = 32, //Устанавливается при полном уничтожении корабля
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