/**
 * Network/Request handeling module 
 * 
 * @module net
 */

import express from "express";
import { Logger } from '../misc/Logger';
import { IViewTemplate } from './interfaces/IViewTemplate';
import path from 'path';
import { Globals } from '../misc/Globals';
import { ViewTemplates } from './ViewTemplates';
import { IWebRequest } from "./interfaces/IWebRequest";
 
/**
 * ExpressJS server module extension class.
 */
export class WebServer
{
    /** No object construction allowed externaly + hide constructor from typedoc documentation generator */
    private constructor() { }

    /** ExpressJS server application for listening for webrequests */
    private static readonly listener = express();

    /** Listening port for webrequests. */
    public static get serverPort(): Number  { return this.listener.get("port");}
    /** Internal setter for listening port. */
    private static set _serverPort(value: Number) { this.listener.set("port", value);};

    /** Get the current rendering engine for express-js (default: ejs) */
    public static get viewEngine(): string { return this.listener.get("view engine");}

    /**  Set the express-js "Views" engine  */
    public static set viewEngine(value: string) { this.listener.set("view engine", value);};

    /** Get the rootpath to the ejs views directory. */
    public static get ejsViewsRoot(): string { return this.listener.settings.views; }

    public static get ejsViewNames(): string[] { return (Globals.fs.readdirSync(this.ejsViewsRoot) as string[])
                                                                .filter(i => i.endsWith("ejs"))
                                                                .map(i => i.substring(0, i.length-4));}

    public static get viewInterfacesRoot(): string { return path.join(Globals.projectRoot, "src", "net", "views"); }
    public static get viewInterfaceNames(): string[] { return (Globals.fs.readdirSync(this.viewInterfacesRoot) as string[]).filter(i => i.toLowerCase().endsWith(".ts")).map(i => i.substring(0, i.length-3));}
    
    public static async viewInterfaceDict() : Promise<Map<string, IViewTemplate | undefined>> 
    {
        let output: Map<string, IViewTemplate | undefined> = new Map<string, IViewTemplate>();
        for(const ejsN of this.ejsViewNames)
        {
            const interfaceName = this.viewInterfaceNames.filter(i => i.toLowerCase()==ejsN.toLowerCase())[0];
            let _interface: IViewTemplate | undefined = undefined;
            if(interfaceName)
            {
                try
                {
                    _interface = await import(path.join(this.viewInterfacesRoot, `${interfaceName}.ts`));
                } catch(e) {}
            }
            output.set(ejsN, _interface);
        }   

        return output;
    }
    /**
     * Setup listener configuration
     * 
     * @psuedocode setupListener
     * - Then it assigns middle ware for incomming json objects, url encoded objects and an accessor for access to the public files directory.
     * - Then it sets the port to the port argument (default:  8080)
     */
    private static setupListener({assetsFolder = "public", port = 8080} = {}): void
    {

        this.listener.use(express.json({limit: "1mb"}));
        this.listener.use(express.urlencoded({extended: true}));
        this.listener.use(express.static(assetsFolder));

        this._serverPort = port;
    }

    /**
     * Setup listener and start listening for requests.
     * 
     * psuedocode
     * - The code starts by logging "Starting WebServer...".
     * - Then it calls the setupListener() method, which is where the code starts listening for requests on port n.
     * - The ViewService is then called to start up all of its views and listen for requests on port n.
     * - If an error occurs during this process, it will catch that error and log it out in console.
     * - The code starts the server and listens for requests.
     */
    public static start(): void
    {
        Logger.logMessage("Starting WebServer...");
        this.setupListener();

        ViewTemplates.loadViewInterfaces().then(res => {
            this.viewEngine = "ejs";
            this.loadContentPages();
            this.loadStatusPages();
            

            this.viewInterfaceDict().then(set => {
                set.forEach((value: IViewTemplate | undefined, key: string) => {
                    if(value)
                        console.log(Object.getPrototypeOf(value));
                })
            });

            try
            {
                        this.listener.listen(this.serverPort, 
                            () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));

            } catch(ex)
            {
                if(ex instanceof Error)
                    console.log(ex.message);
            }
        })


    }

    /**
     * Register a POST callback for a specific endpoint to the listener
     * 
     * @param endpoint absolute path on the server
     * @param callback request event occured callback
     */
    public static registerPostEndpoint(endpoint: string, callback: IWebRequest): void 
    {
        Logger.logMessage(`Attempting to assign POST callback to: ${endpoint}`);

        this.listener.post(endpoint, callback as any);
    }

    /**
     * Register a GET callback for a specific endpoint to the listener
     * 
     * @param endpoint absolute server path
     * @param callback request event occured callback
     */
    public static registerGetEndpoint(endpoint: string, callback: IWebRequest): void 
    {
        Logger.logMessage(`Attempting to assign GET callback to: ${endpoint}`);

        this.listener.get(endpoint, callback as any);
    }

    /**
     * SetMiddleware always running for all future assigned endpoint callbacks.
     * 
     * @param callback middleware callback
     */
    public static registerMiddleware(callback: Function): void 
    {
        this.listener.use(callback as any);
    }

    /**
     * Load all status pages for non valid webresponse (ex: 401 access, 404 non existent, ...)
     * 
     *
     * psuedocode
     * - The code is loading the status pages.
     * - The code is iterating through all of the views and then for each view it will check if that view has a name that starts with 0-9, and if so, it will register a middleware function to render the page with an appropriate status code if required.
     * - The code is a snippet of code that is used to load the status pages.
     * - The code will return an array of ViewTemplates.
    */
    private static loadStatusPages(): void 
    {
        const views: string[] = this.ejsViewNames;
        const viewModels: ViewTemplates.Wrapper<IViewTemplate>[] = ViewTemplates.getViewTypes();

        views.filter(n => /^[0-9]+$/.test(n)).forEach(n => {
            const _interface = viewModels.filter(i => i.name.toLowerCase() == n.toLowerCase())[0];
            
            WebServer.registerMiddleware((req: any, res: any, next: any) => {
                res.status(n);

                const getCallback: Function | undefined = _interface?.prototype.get; 
                res.render(n, _interface && getCallback ? getCallback(req, res) : {})
            });
        })
    }

    /**
     * Loads all non numerical pages and assigns required requests to endpoint matching the filename.
     * 
     * psuedocode
     * - The code is trying to load all the content pages.
     * - It does this by filtering out any views that do not have a name starting with an alphabetical character and then iterating over each view model.
     * - For each view model, it registers a get endpoint for the view's name and posts a render function which will call back into the registered post endpoint if one exists.
     * - If there is no post callback, it will just return what was rendered from the get endpoint.
     * - The code first checks if there is an interface for that particular view model before registering both endpoints in order to make sure they are available when needed.
     * - The code is used to load content pages.
     */
    private static loadContentPages(): void 
    {
        const views = this.ejsViewNames;
        const viewModels: ViewTemplates.Wrapper<IViewTemplate>[] = ViewTemplates.getViewTypes();

        views.filter((name: string) => !(/^[0-9]+$/.test(name)))
            .forEach((name: string) => {
                const _interface = viewModels.filter(i => i.name.toLowerCase() == name.toLowerCase())[0];
                WebServer.registerGetEndpoint(`/${name}`.replace("index", ""),
                    (req, res, next) => {
                        const getCallack: Function | undefined = _interface.prototype.get;
                        return (res as any).render(name, _interface && getCallack ? getCallack(req, res) : {});
                });
                
                if (_interface) {

                    {
                        const postCallback = _interface.prototype.post;
                        if(postCallback !== undefined)
                        {
                            WebServer.registerPostEndpoint(`/${name}`.replace("index", ""),
                                (req, res, next) => {
                                    return (res as any).render(name, _interface ? postCallback(req, res, next) : {});
                                }
                            );
                        }
                    }
                }
            });
    }
}