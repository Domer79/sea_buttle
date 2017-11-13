"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Возможные состояния ячеек
 */
var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["None"] = 0] = "None";
    CellStatus[CellStatus["Temp"] = 1] = "Temp";
    CellStatus[CellStatus["Occupy"] = 2] = "Occupy";
    CellStatus[CellStatus["Past"] = 4] = "Past";
    CellStatus[CellStatus["Live"] = 8] = "Live";
    CellStatus[CellStatus["Got"] = 16] = "Got";
    CellStatus[CellStatus["Dead"] = 32] = "Dead";
})(CellStatus = exports.CellStatus || (exports.CellStatus = {}));
/**
 * ИНформация о об атаке на ячейку
 */
class AttackInfo {
    isNone() {
        return this.cellStatus === CellStatus.None;
    }
}
exports.AttackInfo = AttackInfo;
/**
 * Направление удара - используется роботом
 */
var Direction;
(function (Direction) {
    Direction[Direction["None"] = 0] = "None";
    Direction[Direction["Forward"] = 1] = "Forward";
    Direction[Direction["Backward"] = -1] = "Backward";
})(Direction = exports.Direction || (exports.Direction = {}));
class ArgumentNullException extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.ArgumentNullException = ArgumentNullException;
