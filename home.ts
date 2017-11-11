import f1 from './mydefault';
import ButtleField from './table'; 
import Robot from './Robot';
import Referee from './referee';

export module home{
    f1();

    let t1 = new ButtleField();
    let t2 = new ButtleField();
    let referee = new Referee(t1, t2);

    t1.render();
    t2.render();

    referee.play();
    
    console.log(t1.ships);
    console.log(t2.ships);
}