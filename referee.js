"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Referee {
    constructor(userButtle, enemyButtle) {
        this.userButtle = userButtle;
        this.enemyButtle = enemyButtle;
        this.initUserShut();
    }
    play() {
        this.enemyButtle.closeCurtain();
        //this.enemyButtle.lock();
    }
    initUserShut() {
        let self = this;
        let userShut = function (event) {
            let coords = event.coords;
            let row = coords[0] * 1;
            let col = coords[1] * 1;
            let cellStatus = self.enemyButtle.defaultShut(row, col);
        };
        this.enemyButtle.shut = userShut;
    }
}
exports.default = Referee;
