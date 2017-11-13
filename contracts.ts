import * as $ from 'jquery';
import {FieldCell} from './table';

export default abstract class Dom{
    private childs: Dom[] = new Array<Dom>();
    constructor(domElement:string|object){
        if (!domElement)
            throw new ArgumentNullException("domElement");

        if (typeof domElement === "string")
            this.jqueryElement = $(domElement);
        else
            this.jqueryElement = domElement;
    }

    protected render(): void{
        
    }

    jqueryElement: any;
    abstract addClasses():string;

    append(dom: Dom): Dom{
        this.childs.push(dom);
        return this;
    }

    text(text: string): Dom{
        this.jqueryElement.text(text);
        return this;
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

export interface IState{
    Shut(): AttackInfo;
    getCurrentAttackInfo(): AttackInfo;
}

export class AttackInfo{
    direction: Direction;
    cellStatus: CellStatus;
    row: number;
    col: number;

    isNone(): boolean{
        return this.cellStatus === CellStatus.None;
    }
}

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