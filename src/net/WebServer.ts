import { ViewService } from './ViewService';
import express from "express";
import { Logger } from '../misc/Logger';

/**
 * @class WebServer
 * @author Oste Jannick.
 * @created 2022/03/15
 */
export class WebServer
{
    private static readonly instance: WebServer = new WebServer();

    private static readonly listener = express();

    /** Listening port for webrequests. */
    public static get serverPort(): Number  { return this.listener.get("port");}
    public static get viewEngine(): string { return this.listener.get("view engine");}
    public static set viewEngine(value: string) { this.listener.set("view engine", value);};

    public static get serverInfo(): object  { return this.listener.locals.info; }
    public static get serverName(): string { return this.listener.locals.info.title; }
    public static set serverName(value: string) { this.listener.locals.info.title = value;}

    /**
     * Setup listener configuration
     * 
     * @psuedocode setupListener
     * - Create accesibble server info object.
     * - Assign default serverName
     * - Set JSON based request processing with a cap of 1mb.
     * - Set url based endoding processing.
     * - Set asset folder to public
     * - Set port to default port
     */
    private static setupListener({assetsFolder = "public", port = 8080} = {}): void
    {
        this.listener.locals.info = {
            author: "Oste Jannick"
        } 

        this.serverName = "ExpressJS server";
        this.listener.use(express.json({limit: "1mb"}));
        this.listener.use(express.urlencoded({extended: true}));
        this.listener.use(express.static(assetsFolder));

        this.listener.set("port", port);
    }

    /**
     * Start listening for requests
     * 
     */
    public static start(): void
    {
        Logger.log("Starting WebServer...");
        this.setupListener();
        try
        {
            ViewService.setupViews().then(r =>
                {
                    this.listener.listen(this.serverPort, 
                        () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));

                });
        } catch(ex)
        {
            if(ex instanceof Error)
                console.log(ex.message);
        }

    }

    /**
     * Register a POST callback for a specific endpoint to the listener
     * 
     * @param endpoint absolute path on the server
     * @param event callback on POST request for endpoint
     */
    public static registerPostEndpoint(endpoint: string, event: Function): void 
    {
        Logger.log(`Attempting to assign POST callback to: ${endpoint}`);

        this.listener.post(endpoint, event as any);
    }

    /**
     * Register a GET callback for a specific endpoint to the listener
     * 
     * @param endpoint 
     * @param event 
     */
    public static registerGetEndpoint(endpoint: string, event: Function): void 
    {
        Logger.log(`Attempting to assign GET callback to: ${endpoint}`);

        this.listener.get(endpoint, event as any);
    }

    /**
     * SetMiddleware always running for all future assigned endpoint callbacks.
     * 
     * @param endpoint 
     * @param event 
     */
    public static setMiddleware(event: Function): void 
    {
        this.listener.use(event as any);
    }
}