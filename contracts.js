"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
class Dom {
    constructor(domElement) {
        this.childs = new Array();
        if (!domElement)
            throw new ArgumentNullException("domElement");
        if (typeof domElement === "string")
            this.jqueryElement = $(domElement);
        else
            this.jqueryElement = domElement;
    }
    render() {
    }
    append(dom) {
        this.childs.push(dom);
        return this;
    }
    text(text) {
        this.jqueryElement.text(text);
        return this;
    }
}
exports.default = Dom;
class ArgumentNullException extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.ArgumentNullException = ArgumentNullException;
