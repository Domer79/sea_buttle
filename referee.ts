import ButtleField, {CellStatus}  from './table';

export default class Referee{
    constructor(private userButtle: ButtleField, private enemyButtle: ButtleField){
        this.initUserShut();
        
    }

    play(){
        this.enemyButtle.closeCurtain();
        //this.enemyButtle.lock();
    }

    initUserShut(){
        let self = this;
        let userShut = function(event: any): void{
            let coords: Array<number> = event.coords;
            let row: number = coords[0] * 1;
            let col: number = coords[1] * 1;
            let cellStatus: CellStatus = self.enemyButtle.defaultShut(row, col);
        }

        this.enemyButtle.shut = userShut;    
    }
}