import { appendFile } from "fs";
import { TemplateEngine } from './TemplateEngine';

/**
 * 
 * @author Oste Jannick.
 */
export class Webserver extends TemplateEngine
{
    private static express = require("express");
    private static listener = Webserver.express();

    /**
     * Port the server will listen on for webrequests
     */
    private get ServerPort(): Number 
    {
        return Webserver.listener.get("port");
    }

    /**
     * Initialization procedure of object
     */
    constructor()
    {
        Webserver.listener.set("port", 3000);
        
        super(Webserver.listener);
    }

    /**
     * Start listening for requests
     */
    public start(): void
    {
        /*
        new Map([
            ["404", this.sendHtmlContent]
        ]).forEach((value, key) => {
            //appendFile.use
        });
        */
        
        Webserver.listener.get("/", this.sendHtmlContent);
        Webserver.listener.get("/json", this.sendJsonContent);

        Webserver.listener.use((req: any, res: any) => 
        {
            res.type("text/html");
            res.status("404");
            res.send("Failed to load webpage...");
        })
        
        Webserver.listener.listen(this.ServerPort, 
            () => console.log("[server]: http://localhost:"+this.ServerPort));
    }

    private sendHtmlContent(req: any, res: any)
    {
        res.type("text/html");
        res.send("hello world");
    }

    private sendJsonContent(req: any, res: any)
    {
        res.type("application/json");
        res.json({});
    }


}