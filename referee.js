"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Robot_1 = require("./Robot");
const contracts_1 = require("./contracts");
const $ = require("jquery");
class Referee {
    constructor(userButtle, enemyButtle) {
        this.userButtle = userButtle;
        this.enemyButtle = enemyButtle;
        this.initUserShut();
        this._robot = new Robot_1.default(userButtle.getDefaultShut());
    }
    play() {
        this.userButtle.lock();
        this.enemyButtle.closeCurtain(true);
        this.userButtle.closeCurtain();
        this.activePlayer = ActivePlayer.User;
    }
    initUserShut() {
        let self = this;
        let userShut = function (event) {
            let coords = event.coords;
            let row = coords[0] * 1;
            let col = coords[1] * 1;
            self.cellStatus = self.enemyButtle.getDefaultShut()(row, col);
        };
        this.enemyButtle.shut = userShut;
    }
    initEnemyShut() {
        let self = this;
    }
    get cellStatus() {
        return this._cellStatus;
    }
    set cellStatus(value) {
        this.checkWin();
        this._cellStatus = value;
        this.cellStatusDispatch(value);
    }
    get activePlayer() {
        return this._activePlayer;
    }
    set activePlayer(value) {
        this._activePlayer = value;
        if (value === ActivePlayer.User) {
            this.enemyButtle.unLock();
            this.userButtle.fog();
            this.enemyButtle.clearFog();
        }
        else {
            this.enemyButtle.lock();
            this.enemyButtle.fog();
            this.userButtle.clearFog();
            this.robotActive();
        }
    }
    checkWin() {
        if (this.userButtle.down() || this.enemyButtle.down()) {
            clearInterval(this._timeoutId);
            this.userButtle.lock();
            this.enemyButtle.lock();
            this.displayWinBanner(`${ActivePlayer[this._activePlayer]} Win!!!`);
            console.log(`${ActivePlayer[this._activePlayer]} Win!!!`);
        }
    }
    displayWinBanner(text) {
        let textContainer = $("<span class='win-text'></span>").text(text);
        let banner = $("<div class='win-banner'></div>").append(textContainer);
        this._banner = $("<div class='win-banner-canvas'></div>").append(banner);
        $("body").append(this._banner);
    }
    cellStatusDispatch(cellStatus) {
        if (cellStatus === contracts_1.CellStatus.Past)
            this.activePlayer = this.activePlayer === ActivePlayer.User ? ActivePlayer.Robot : ActivePlayer.User;
    }
    robotActive() {
        let self = this;
        this._timeoutId = setInterval(function () {
            self.cellStatus = self._robot.shut();
            if (self.cellStatus === contracts_1.CellStatus.Past) {
                console.log(`CellStatus=${self.cellStatus}`);
                clearInterval(self._timeoutId);
            }
        }, 1000);
    }
}
exports.default = Referee;
var ActivePlayer;
(function (ActivePlayer) {
    ActivePlayer[ActivePlayer["User"] = 0] = "User";
    ActivePlayer[ActivePlayer["Robot"] = 1] = "Robot";
})(ActivePlayer || (ActivePlayer = {}));
