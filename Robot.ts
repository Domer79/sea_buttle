import ButtleField from './table';

export default class Robot{
    constructor(private enemyButtle: ButtleField){
        enemyButtle.shut = this.shut;
    }

    shut: (event: any) => {
        
    };
    
}