import ButtleField  from './table';
import Robot from './Robot';
import { CellStatus } from './contracts';
import * as $ from 'jquery';

export default class Referee{
    private _activePlayer: ActivePlayer;
    private _robot: Robot;
    private _cellStatus: CellStatus;
    private _timeoutId: number;
    private _banner: any;

    constructor(private userButtle: ButtleField, private enemyButtle: ButtleField){
        this.initUserShut();
        this._robot = new Robot(userButtle.getDefaultShut());
    }

    play(){
        this.userButtle.lock();
        this.enemyButtle.closeCurtain(true);
        this.userButtle.closeCurtain();

        this.activePlayer = ActivePlayer.User;
    }

    initUserShut(){
        let self = this;
        let userShut = function(event: any): void{
            let coords: Array<number> = event.coords;
            let row: number = coords[0] * 1;
            let col: number = coords[1] * 1;
            self.cellStatus = self.enemyButtle.getDefaultShut()(row, col);
        }

        this.enemyButtle.shut = userShut;
    }

    initEnemyShut(){
        let self = this;
    }

    private get cellStatus(): CellStatus{
        return this._cellStatus;
    }

    private set cellStatus(value: CellStatus){
        this.checkWin();
        this._cellStatus = value;
        this.cellStatusDispatch(value);
    }

    private get activePlayer(): ActivePlayer{
        return this._activePlayer;
    }

    private set activePlayer(value: ActivePlayer){
        this._activePlayer = value;

        if (value === ActivePlayer.User){
            this.enemyButtle.unLock();
            this.userButtle.fog();
            this.enemyButtle.clearFog()
        }
        else{
            this.enemyButtle.lock();
            this.enemyButtle.fog();
            this.userButtle.clearFog()

            this.robotActive();
        }
    }

    private checkWin(){
        if (this.userButtle.down() || this.enemyButtle.down()){
            clearInterval(this._timeoutId);
            this.userButtle.lock();
            this.enemyButtle.lock();
            this.displayWinBanner(`${ActivePlayer[this._activePlayer]} Win!!!`);
            console.log(`${ActivePlayer[this._activePlayer]} Win!!!`);
        }
    }

    private displayWinBanner(text: string){
        let textContainer = $("<span class='win-text'></span>").text(text);
        let banner = $("<div class='win-banner'></div>").append(textContainer);
        this._banner = $("<div class='win-banner-canvas'></div>").append(banner);

        $("body").append(this._banner);
    }

    private cellStatusDispatch(cellStatus: CellStatus): void {
        if (cellStatus === CellStatus.Past)
            this.activePlayer = this.activePlayer === ActivePlayer.User ? ActivePlayer.Robot : ActivePlayer.User;
    }

    private robotActive(){
        let self = this;
        this._timeoutId = setInterval(function(){
            self.cellStatus = self._robot.shut();
            if (self.cellStatus === CellStatus.Past){
                console.log(`CellStatus=${self.cellStatus}`);
                clearInterval(self._timeoutId);
            }
            
        }, 1000);
    }
}

enum ActivePlayer{
    User,
    Robot
}