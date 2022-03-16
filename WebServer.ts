import { appendFile } from "fs";
import { TemplateEngine } from './TemplateEngine';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * 
 * @author Oste Jannick.
 */
export class Webserver extends TemplateEngine
{
    public static readonly instance: Webserver = new Webserver();
    private readonly express = require("express");
    private readonly listener = this.express();

    /** Listening port for webrequests. */
    private get serverPort(): Number  { return this.listener.get("port");}

    /**
     * @summary Initialization procedure of object
     */
    private constructor()
    {
        super();
        //this.bindViewEngine(this.listener);
        this.listener.set("port", 80);
        this.bindViewEngine(this.listener);
        //this.loadTestFunctions();
    }

    /**
     * @summary Start listening for requests
     */
    public start(): void
    {
        try
        {
            this.listener.listen(this.serverPort, 
                () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));
        } catch(ex)
        {
            if(ex instanceof Error)
                console.log(ex.message);
        }
    }


}