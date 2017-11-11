"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Robot {
    constructor(enemyButtle) {
        this.enemyButtle = enemyButtle;
        enemyButtle.shut = this.shut;
    }
}
exports.default = Robot;
