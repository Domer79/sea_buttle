import ButtleField from './table';
import {IState, CellStatus, AttackInfo, Direction} from './contracts';

export default class Robot{
    private _currentState: IState;
    private _attackCells: Array<AttackInfo>;
    private _ship: Array<AttackInfo>;

    constructor(private userButtleShut: (row: number, col: number) => CellStatus){
        this._attackCells = new Array<AttackInfo>();
        this._ship = new Array<AttackInfo>();

        for (let i = 1; i <= 10; i++) {
            for (let j = 1; j <= 10; j++) {
                let attackInfo = new AttackInfo();
                attackInfo.cellStatus = CellStatus.None;
                attackInfo.row = i;
                attackInfo.col = j;
                attackInfo.direction = Direction.None;
                this._attackCells.push(attackInfo);
            }
        }

        this._currentState = new RandomState(userButtleShut, this._attackCells);
    }

    shut(): CellStatus{
        let attackInfo = this._currentState.Shut();
        if (attackInfo.cellStatus === CellStatus.Dead){
            this._ship.push(this._currentState.getCurrentAttackInfo());
            this.shipDead();
            this._currentState = new RandomState(this.userButtleShut, this._attackCells);
        }

        if (attackInfo.cellStatus === CellStatus.Got){
            this._ship.push(this._currentState.getCurrentAttackInfo());
            if (!(this._currentState instanceof GotState))
                this._currentState = new GotState(this.userButtleShut, this._attackCells, this._currentState.getCurrentAttackInfo());
        }

        return attackInfo.cellStatus;
    }

    shipDead(): void{
        this._ship.forEach(element => {
            element.cellStatus = CellStatus.Dead;
            this.attackCellOccupy(element);
        });

        this._ship = [];
    }

    private attackCellOccupy(attackCell: AttackInfo){
        let state = this._currentState as State;
        let work = (fieldCells: Array<AttackInfo>) => {
            fieldCells.forEach(element => {
                if (element && (element.cellStatus === CellStatus.None || element.cellStatus === CellStatus.Temp)) 
                    element.cellStatus = CellStatus.Occupy;
            });
        };

        let leftCell = state.getCell(attackCell.row, attackCell.col - 1);
        let leftTopCell = state.getCell(attackCell.row - 1, attackCell.col - 1);
        let leftBottomCell = state.getCell(attackCell.row + 1, attackCell.col - 1);

        let rightCell = state.getCell(attackCell.row, attackCell.col +1);
        let rightTopCell = state.getCell(attackCell.row - 1, attackCell.col + 1);
        let rightBottomCell = state.getCell(attackCell.row + 1, attackCell.col + 1);

        let topCell = state.getCell(attackCell.row - 1, attackCell.col);
        let bottomCell = state.getCell(attackCell.row + 1, attackCell.col);

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

abstract class State implements IState{
    constructor(protected buttleShut: (row: number, col: number) => CellStatus, protected _attackCells: Array<AttackInfo>){

    }

    getCell(r: number, c:number): AttackInfo{
        return this._attackCells.find(function(element:AttackInfo){
            return element.row === r && element.col === c;
        });
    }

    abstract Shut(): AttackInfo;

    abstract getCurrentAttackInfo(): AttackInfo;
    
}

class RandomState extends State{
    private _currentAttackInfo: AttackInfo;

    constructor(protected buttleShut: (row: number, col: number) => CellStatus, protected _attackCells: Array<AttackInfo>){
        super(buttleShut, _attackCells);
    }

    Shut(): AttackInfo {
        let cells = this._attackCells.filter(function(element: AttackInfo){
            return element.cellStatus === CellStatus.None;
        });

        let randomIndex = Math.round(Math.random() * (cells.length - 1));
        this._currentAttackInfo = cells[randomIndex];
        this._currentAttackInfo.cellStatus = this.buttleShut(cells[randomIndex].row, cells[randomIndex].col);

        return this._currentAttackInfo;
    }

    getCurrentAttackInfo(): AttackInfo {
        return this._currentAttackInfo;
    }
}

class GotState extends State{
    private _firstAttackInfo: AttackInfo;
    private _attackInfo: AttackInfo;
    private _ship: Array<AttackInfo> = new Array<AttackInfo>();

    constructor(protected buttleShut: (row: number, col: number) => CellStatus, protected _attackCells: Array<AttackInfo>, attackInfo: AttackInfo){
        super(buttleShut, _attackCells);
        this._firstAttackInfo = attackInfo;
        this._attackInfo = attackInfo;
        this._ship.push(attackInfo);
    }

    Shut(): AttackInfo {
        let direction = this.getDirection();
        if (direction === Direction.None)
            throw new Error("Критическая ошибка! Робот не смог выбрать направление для атаки!");

        this._attackInfo = this.getCell(this._attackInfo.row, this._attackInfo.col + direction);
        if (!this._attackInfo)
        {
            console.log(this._attackInfo);
        }

        this._attackInfo.direction = direction;
        this._attackInfo.cellStatus = this.buttleShut(this._attackInfo.row, this._attackInfo.col);
        return this._attackInfo;
    }

    private getDirection(): Direction{
        debugger;
        if (this._attackInfo.direction === Direction.None){
            let randomBool = Math.round(Math.random());
            this._attackInfo.direction = Boolean(randomBool) ? Direction.Forward : Direction.Backward;
        }

        let attackCell = this.getCell(this._attackInfo.row, this._attackInfo.col + this._attackInfo.direction);
        if (!attackCell || !attackCell.isNone() || this._attackInfo.cellStatus === CellStatus.Past){
            this._attackInfo = this._firstAttackInfo;
            return this._attackInfo.direction === Direction.Forward ? Direction.Backward : Direction.Forward;
        }

        return this._attackInfo.direction;
    }

    getCurrentAttackInfo(): AttackInfo {
        return this._attackInfo;
    }
}