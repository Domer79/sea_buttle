"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mydefault_1 = require("./mydefault");
const table_1 = require("./table");
const referee_1 = require("./referee");
var home;
(function (home) {
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
