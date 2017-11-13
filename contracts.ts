import * as $ from 'jquery';
import {FieldCell} from './table';

/**
 * Возможные состояния ячеек
 */
export enum CellStatus{
    None = 0, //Автоматически устанавливается при инициализация
    Temp = 1, //Временный статус, используется при инициализации корабля
    Occupy = 2, //Устанавливается для ячеек вокруг корабля, при его инициализации
    Past = 4, //Устанавливается при непопадании по кораблю
    Live = 8, //Устанавливается при инициализации корабля
    Got = 16, //Устанавливается при попадании в корабль
    Dead = 32, //Устанавливается при полном уничтожении корабля
}

/**
 * Интерфейс, описывающий способ стрельбы для робота
 */
export interface IState{
    /**
     * Стрельба по ячейке
     */
    Shut(): AttackInfo;

    /**
     * Возвращает информацию о состоянии текущей ячейки, для атаки
     */
    getCurrentAttackInfo(): AttackInfo;
}

/**
 * ИНформация о об атаке на ячейку
 */
export class AttackInfo{
    direction: Direction;
    cellStatus: CellStatus;
    row: number;
    col: number;

    isNone(): boolean{
        return this.cellStatus === CellStatus.None;
    }
}

/**
 * Направление удара - используется роботом
 */
export enum Direction{
    None = 0,
    Forward = 1,
    Backward = -1,
}

export class ArgumentNullException extends Error{
    constructor(message: string){
        super();
        this.message = message;
    }
}