"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServer = void 0;
const express_1 = __importDefault(require("express"));
const Logger_1 = require("../misc/Logger");
const path_1 = __importDefault(require("path"));
const Globals_1 = require("../misc/Globals");
const ViewTemplates_1 = require("./ViewTemplates");
/**
 * @class WebServer
 * @author Oste Jannick.
 * @created 2022/03/15
 */
class WebServer {
    /** No object construction allowed externaly + hide constructor from typedoc documentation generator */
    constructor() { }
    /** Listening port for webrequests. */
    static get serverPort() { return this.listener.get("port"); }
    /** Get the current rendering engine for express-js (default: ejs) */
    static get viewEngine() { return this.listener.get("view engine"); }
    /**  Set the express-js "Views" engine  */
    static set viewEngine(value) { this.listener.set("view engine", value); }
    ;
    /**
     * fetch all ejs templates from views folder under root.
     *
     * @psuedocode views
     * - fetches the projectRoot from the Globals class.
     * - Scans recursivly over the views folder for .ejs files (View templates)
     * - if view found, sanitizes to its absolute name and adds the name to return stack.
     * - return found ejs views
     */
    static get getViewNames() {
        let out = [];
        Globals_1.fileSystem.recurseSync(path_1.default.join(Globals_1.projectRoot, "views"), (filepath, relative, name) => {
            if (name && name.endsWith("ejs")) {
                const filename = path_1.default.basename(filepath);
                const absName = filename.substring(0, filename.length - 4);
                out.push(absName);
            }
        });
        return out;
    }
    /**
     * Get public accessible server data assigned on the listener object
     *
     * @deprecated
     */
    static get serverInfo() { return this.listener.locals.info; }
    /**
     * Setup listener configuration
     *
     * @psuedocode setupListener
     * - The code starts by setting the serverInfo object
     * - Then it assigns middle ware for incomming json objects, url encoded objects and an accessor for access to the public files directory.
     * - Then it sets the port to the port argument (default:  8080)
     */
    static setupListener({ assetsFolder = "public", port = 8080 } = {}) {
        this.listener.locals.info = {
            author: "Oste Jannick"
        };
        this.listener.use(express_1.default.json({ limit: "1mb" }));
        this.listener.use(express_1.default.urlencoded({ extended: true }));
        this.listener.use(express_1.default.static(assetsFolder));
        this.listener.set("port", port);
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
    static start() {
        (0, Logger_1.logMessage)("Starting WebServer...");
        this.setupListener();
        ViewTemplates_1.ViewTemplates.loadViewInterfaces().then(res => {
            this.viewEngine = "ejs";
            this.loadContentPages();
            this.loadStatusPages();
            try {
                this.listener.listen(this.serverPort, () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));
            }
            catch (ex) {
                if (ex instanceof Error)
                    console.log(ex.message);
            }
        });
    }
    /**
     * Register a POST callback for a specific endpoint to the listener
     *
     * @param endpoint absolute path on the server
     * @param callback request event occured callback
     */
    static registerPostEndpoint(endpoint, callback) {
        (0, Logger_1.logMessage)(`Attempting to assign POST callback to: ${endpoint}`);
        this.listener.post(endpoint, callback);
    }
    /**
     * Register a GET callback for a specific endpoint to the listener
     *
     * @param endpoint absolute server path
     * @param callback request event occured callback
     */
    static registerGetEndpoint(endpoint, callback) {
        (0, Logger_1.logMessage)(`Attempting to assign GET callback to: ${endpoint}`);
        this.listener.get(endpoint, callback);
    }
    /**
     * SetMiddleware always running for all future assigned endpoint callbacks.
     *
     * @param callback middleware callback
     */
    static registerMiddleware(callback) {
        this.listener.use(callback);
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
    static loadStatusPages() {
        const views = this.getViewNames;
        const viewModels = ViewTemplates_1.ViewTemplates.getViewTypes();
        views.filter(n => /^[0-9]+$/.test(n)).forEach(n => {
            const _interface = viewModels.filter(i => i.name.toLowerCase() == n.toLowerCase())[0];
            WebServer.registerMiddleware((req, res, next) => {
                res.status(n);
                const getCallback = _interface === null || _interface === void 0 ? void 0 : _interface.prototype.get;
                res.render(n, _interface && getCallback ? getCallback(req, res) : {});
            });
        });
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
    static loadContentPages() {
        const views = this.getViewNames;
        const viewModels = ViewTemplates_1.ViewTemplates.getViewTypes();
        views.filter((name) => !(/^[0-9]+$/.test(name)))
            .forEach((name) => {
            const _interface = viewModels.filter(i => i.name.toLowerCase() == name.toLowerCase())[0];
            WebServer.registerGetEndpoint(`/${name}`.replace("index", ""), (req, res, next) => {
                const getCallack = _interface.prototype.get;
                return res.render(name, _interface && getCallack ? getCallack(req, res) : {});
            });
            if (_interface) {
                {
                    const postCallback = _interface.prototype.post;
                    if (postCallback !== undefined) {
                        WebServer.registerPostEndpoint(`/${name}`.replace("index", ""), (req, res, next) => {
                            return res.render(name, _interface ? postCallback(req, res, next) : {});
                        });
                    }
                }
            }
        });
    }
}
exports.WebServer = WebServer;
/** ExpressJS server application for listening for webrequests */
WebServer.listener = (0, express_1.default)();
