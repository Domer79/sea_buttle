import * as $ from 'jquery';

export default abstract class Dom{
    private childs: Dom[] = new Array<Dom>();
    constructor(domElement:string|object){
        if (!domElement)
            throw new ArgumentNullException("domElement");

        if (typeof domElement === "string")
            this.jqueryElement = $(domElement);
        else
            this.jqueryElement = domElement;
    }

    protected render(): void{
        
    }

    jqueryElement: any;
    abstract addClasses():string;

    append(dom: Dom): Dom{
        this.childs.push(dom);
        return this;
    }

    text(text: string): Dom{
        this.jqueryElement.text(text);
        return this;
    }
}

export class ArgumentNullException extends Error{
    constructor(message: string){
        super();
        this.message = message;
    }
}