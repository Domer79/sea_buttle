"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Animal {
    constructor(theName) { this.name = theName; }
    move() {
        console.log(`${this.name} moved m.`);
    }
}
exports.default = Animal;
class Snake extends Animal {
    constructor(name) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move();
    }
}
class Horse extends Animal {
    constructor(name) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move();
    }
}
let sam = new Snake("Sammy the Python");
let tom = new Horse("Tommy the Palomino");
sam.move();
tom.move();
