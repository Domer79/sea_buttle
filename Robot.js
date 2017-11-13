"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("./contracts");
class Robot {
    constructor(userButtleShut) {
        this.userButtleShut = userButtleShut;
        this._attackCells = new Array();
        this._ship = new Array();
        for (let i = 1; i <= 10; i++) {
            for (let j = 1; j <= 10; j++) {
                let attackInfo = new contracts_1.AttackInfo();
                attackInfo.cellStatus = contracts_1.CellStatus.None;
                attackInfo.row = i;
                attackInfo.col = j;
                attackInfo.direction = contracts_1.Direction.None;
                this._attackCells.push(attackInfo);
            }
        }
        this._currentState = new RandomState(userButtleShut, this._attackCells);
    }
    shut() {
        let attackInfo = this._currentState.Shut();
        if (attackInfo.cellStatus === contracts_1.CellStatus.Dead) {
            this._ship.push(this._currentState.getCurrentAttackInfo());
            this.shipDead();
            this._currentState = new RandomState(this.userButtleShut, this._attackCells);
        }
        if (attackInfo.cellStatus === contracts_1.CellStatus.Got) {
            this._ship.push(this._currentState.getCurrentAttackInfo());
            if (!(this._currentState instanceof GotState))
                this._currentState = new GotState(this.userButtleShut, this._attackCells, this._currentState.getCurrentAttackInfo());
        }
        return attackInfo.cellStatus;
    }
    shipDead() {
        this._ship.forEach(element => {
            element.cellStatus = contracts_1.CellStatus.Dead;
            this.attackCellOccupy(element);
        });
        this._ship = [];
    }
    attackCellOccupy(attackCell) {
        let state = this._currentState;
        let work = (fieldCells) => {
            fieldCells.forEach(element => {
                if (element && (element.cellStatus === contracts_1.CellStatus.None || element.cellStatus === contracts_1.CellStatus.Temp))
                    element.cellStatus = contracts_1.CellStatus.Occupy;
            });
        };
        let leftCell = state.getCell(attackCell.row, attackCell.col - 1);
        let leftTopCell = state.getCell(attackCell.row - 1, attackCell.col - 1);
        let leftBottomCell = state.getCell(attackCell.row + 1, attackCell.col - 1);
        let rightCell = state.getCell(attackCell.row, attackCell.col + 1);
        let rightTopCell = state.getCell(attackCell.row - 1, attackCell.col + 1);
        let rightBottomCell = state.getCell(attackCell.row + 1, attackCell.col + 1);
        let topCell = state.getCell(attackCell.row - 1, attackCell.col);
        let bottomCell = state.getCell(attackCell.row + 1, attackCell.col);
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
exports.default = Robot;
class State {
    constructor(buttleShut, _attackCells) {
        this.buttleShut = buttleShut;
        this._attackCells = _attackCells;
    }
    getCell(r, c) {
        return this._attackCells.find(function (element) {
            return element.row === r && element.col === c;
        });
    }
}
class RandomState extends State {
    constructor(buttleShut, _attackCells) {
        super(buttleShut, _attackCells);
        this.buttleShut = buttleShut;
        this._attackCells = _attackCells;
    }
    Shut() {
        let cells = this._attackCells.filter(function (element) {
            return element.cellStatus === contracts_1.CellStatus.None;
        });
        let randomIndex = Math.round(Math.random() * (cells.length - 1));
        this._currentAttackInfo = cells[randomIndex];
        this._currentAttackInfo.cellStatus = this.buttleShut(cells[randomIndex].row, cells[randomIndex].col);
        return this._currentAttackInfo;
    }
    getCurrentAttackInfo() {
        return this._currentAttackInfo;
    }
}
class GotState extends State {
    constructor(buttleShut, _attackCells, attackInfo) {
        super(buttleShut, _attackCells);
        this.buttleShut = buttleShut;
        this._attackCells = _attackCells;
        this._ship = new Array();
        this._firstAttackInfo = attackInfo;
        this._attackInfo = attackInfo;
        this._ship.push(attackInfo);
    }
    Shut() {
        let direction = this.getDirection();
        if (direction === contracts_1.Direction.None)
            throw new Error("Критическая ошибка! Робот не смог выбрать направление для атаки!");
        this._attackInfo = this.getCell(this._attackInfo.row, this._attackInfo.col + direction);
        if (!this._attackInfo) {
            console.log(this._attackInfo);
        }
        this._attackInfo.direction = direction;
        this._attackInfo.cellStatus = this.buttleShut(this._attackInfo.row, this._attackInfo.col);
        return this._attackInfo;
    }
    getDirection() {
        if (this._attackInfo.direction === contracts_1.Direction.None) {
            let randomBool = Math.round(Math.random());
            this._attackInfo.direction = Boolean(randomBool) ? contracts_1.Direction.Forward : contracts_1.Direction.Backward;
        }
        let attackCell = this.getCell(this._attackInfo.row, this._attackInfo.col + this._attackInfo.direction);
        if (!attackCell || !attackCell.isNone() || this._attackInfo.cellStatus === contracts_1.CellStatus.Past) {
            this._attackInfo = this._firstAttackInfo;
            return this._attackInfo.direction === contracts_1.Direction.Forward ? contracts_1.Direction.Backward : contracts_1.Direction.Forward;
        }
        return this._attackInfo.direction;
    }
    getCurrentAttackInfo() {
        return this._attackInfo;
    }
}
