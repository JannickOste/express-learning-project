import { ViewService } from './views/ViewService';
import express from "express";
/**
 * Webserver object
 * @author Oste Jannick.
 * @created 2022/03/15
 */
export class WebServer extends ViewService
{
    public static readonly instance: WebServer = new WebServer();

    private readonly listener = express();

    /** Listening port for webrequests. */
    public get serverPort(): Number  { return this.listener.get("port");}
    public get viewEngine(): string { return this.listener.get("view engine");}
    public set viewEngine(value: string) { this.listener.set("view engine", value);};

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
        this.listener.use(express.json({limit: "1mb"}));
        this.listener.use(express.urlencoded({extended: true}));
        this.listener.use(express.static("public"));

    }

    /**
     * Start listening for requests
     */
    public start(): void
    {
        try
        {
            this.bindViewEngine();
            this.listener.listen(this.serverPort, 
                () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));
        } catch(ex)
        {
            if(ex instanceof Error)
                console.log(ex.message);
        }
    }

    public registerPostEndpoint(endpoint: string, event: Function): void 
    {
        this.listener.post(endpoint, event as any);
    }

    public registerGetEndpoint(endpoint: string, event: Function): void 
    {
        this.listener.get(endpoint, event as any);
    }

    public setMiddleware(event: Function): void 
    {
        this.listener.use(event as any);
    }
}