"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mydefault_1 = require("./mydefault");
const table_1 = require("./table");
const referee_1 = require("./referee");
var home;
(function (home) {
    if (!Array.prototype.find) {
        Array.prototype.find = function (predicate) {
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
    mydefault_1.default();
    let t1 = new table_1.default();
    let t2 = new table_1.default();
    let referee = new referee_1.default(t1, t2);
    t1.render();
    t2.render();
    referee.play();
    // console.log(t1.ships);
    // console.log(t2.ships);
})(home = exports.home || (exports.home = {}));
