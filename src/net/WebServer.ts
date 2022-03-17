import { ViewService } from './ViewService';
/**
 * Webserver object
 * @author Oste Jannick.
 * @created 2022/03/15
 */
export class HTTPServer extends ViewService
{
    public static readonly instance: HTTPServer = new HTTPServer();

    private readonly express = require("express");
    private readonly listener = this.express();

    /** Listening port for webrequests. */
    public get serverPort(): Number  { return this.listener.get("port");}
    public get viewEngine(): string { return this.listener.get("view engine");}

    public get serverInfo(): object  { return this.listener.locals.info; }

    public get serverName(): string { return this.listener.locals.info.title; }
    public set serverName(value: string) { this.listener.locals.info.title = value;}

    /**
     * Initialization procedure of object
     */
    private constructor()
    {
        super();
        this.setupListener();
        this.bindViewEngine(this.listener);
        this.listener.set("port", 8080);
    }

    /**
     * Setup listener configuration
     */
    private setupListener(): void
    {
        this.listener.locals.info = {
            author: "Oste Jannick"
        } 

        this.serverName = "ExpressJS server";
        this.listener.use(this.express.json({limit: "1mb"}));
        this.listener.use(this.express.urlencoded({extended: true}));
        this.listener.use(this.express.static("public"));

    }

    /**
     * Start listening for requests
     */
    public start(): void
    {
        console.dir(this.serverInfo)
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

    public setPostEvent(endpoint: string, event: Function): void 
    {
        this.listener.post(endpoint, event);
    }
}