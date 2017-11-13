import f1 from './mydefault';
import ButtleField from './table'; 
import Robot from './Robot';
import Referee from './referee';
import { CellStatus } from './contracts';

export module home{
    
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
          if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
          }
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }
          var list = Object(this);
          var length = list.length >>> 0;
          var thisArg = arguments[1];
          var value;
      
          for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
              return value;
            }
          }
          return undefined;
        };
      }

    f1();

    let t1 = new ButtleField();
    let t2 = new ButtleField();
    let referee = new Referee(t1, t2);

    t1.render();
    t2.render();

    referee.play();
    
    // console.log(t1.ships);
    // console.log(t2.ships);
}