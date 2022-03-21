/**
 * Network/Request handeling module 
 * 
 * @module net
 */

import express from "express";
import { Logger } from '../misc/Logger';
import { IViewTemplate } from './interfaces/IViewTemplate';
import path, { resolve } from 'path';
import { Globals } from '../misc/Globals';
import { IWebRequest } from "./interfaces/IWebRequest";
import { NextFunction } from 'express';
import { IWebResponse } from './interfaces/IWebResponse';

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

        this.viewEngine = "ejs";
        this.setViews()
            .then(v => {
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
            .catch(e => console.log(`Failed to load endpoints...\n${e}`));
    }

    private static async setViews(): Promise<void> 
    {
        return new Promise(async(resolve, reject) => 
        {
            const viewDict: Map<string, IViewTemplate | undefined> = await this.viewInterfaceDict();
            const finalizingCallbacks: Function[] = [];
            viewDict.forEach((value: IViewTemplate | undefined, key: string) => {
                const modulePrototype = Object.assign({}, value);
                const interfaceName: string = Object.getOwnPropertyNames(modulePrototype)[0];
                
                const interfacePrototype: {[key: string]: any} = Object.assign({}, (modulePrototype as {[key: string]: any})[interfaceName])
                const endpoint: string = `/${key}`.replace("index", "");
                for(const requestType in interfacePrototype)
                {
                    const requestCallback = interfacePrototype[requestType];
                    if(requestCallback === undefined) continue;

                    const renderViewCallback = (req: any, res: any, next : any) => {
                        return (res as any).render(key, requestCallback(req, res));
                    }
                    let setter: Function | undefined;

                    switch(requestType)
                    {
                        case "get":      setter = () => this.listener.get(endpoint, renderViewCallback); break;
                        case "post":     setter = () => this.listener.post(endpoint, renderViewCallback); break;
                        case "put":      setter = () => this.listener.put(endpoint, renderViewCallback); break;
                        case "patch":    setter = () => this.listener.patch(endpoint,renderViewCallback); break;
                        case "delete":   setter = () => this.listener.delete(endpoint, renderViewCallback); break;
                        case "copy":     setter = () => this.listener.copy(endpoint, renderViewCallback); break;
                        case "head":     setter = () => this.listener.head(endpoint, renderViewCallback); break;
                        case "options":  setter = () => this.listener.options(endpoint, renderViewCallback); break;
                        case "purge":    setter = () => this.listener.purge(endpoint, renderViewCallback); break;
                        case "lock":     setter = () => this.listener.lock(endpoint, renderViewCallback); break;
                        case "unlock":   setter = () => this.listener.unlock(endpoint, renderViewCallback); break;
                        case "propfind": setter = () => this.listener.propfind(endpoint, renderViewCallback); break;
                    }
                    
                    if(setter)
                    {
                        if(/^[a-zA-Z]+$/.test(key))
                        {
                            setter();
                        } else finalizingCallbacks.push(setter);
                    } 
                }
            });


            finalizingCallbacks.forEach(clbk => clbk());
            resolve();
        })
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
}