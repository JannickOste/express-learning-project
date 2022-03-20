"use strict";
/**
 * Network/Request handeling module
 *
 * @module net
 */
var _a, _b, _c, _d;
var _this = this;
exports.__esModule = true;
exports.WebServer = void 0;
var express_1 = require("express");
var Logger_1 = require("../misc/Logger");
var path_1 = require("path");
var Globals_1 = require("../misc/Globals");
var ViewTemplates_1 = require("./ViewTemplates");
/**
 * ExpressJS server module extension class.
 */
var WebServer = /** @class */ (function () {
    /** No object construction allowed externaly + hide constructor from typedoc documentation generator */
    function WebServer() {
    }
    Object.defineProperty(WebServer, "serverPort", {
        /** Listening port for webrequests. */
        get: function () { return this.listener.get("port"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebServer, "_serverPort", {
        /** Internal setter for listening port. */
        set: function (value) { this.listener.set("port", value); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(WebServer, "viewEngine", {
        /** Get the current rendering engine for express-js (default: ejs) */
        get: function () { return this.listener.get("view engine"); },
        /**  Set the express-js "Views" engine  */
        set: function (value) { this.listener.set("view engine", value); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(WebServer, "ejsViewsRoot", {
        /** Get the rootpath to the ejs views directory. */
        get: function () { return this.listener.settings.views; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebServer, "ejsViewNames", {
        get: function () {
            return Globals_1.Globals.fs.readdirSync(this.ejsViewsRoot)
                .filter(function (i) { return i.endsWith("ejs"); })
                .map(function (i) { return i.substring(0, i.length - 4); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebServer, "viewInterfacesRoot", {
        get: function () { return path_1["default"].join(Globals_1.Globals.projectRoot, "net", "views"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebServer, "viewInterfaceNames", {
        get: function () { return Globals_1.Globals.fs.readdirSync(this.viewInterfacesRoot).filter(function (i) { return i.toLowerCase().endsWith(".ts"); }).map(function (i) { return i.substring(0, i.length - 3); }); },
        enumerable: false,
        configurable: true
    });
    /** ExpressJS server application for listening for webrequests */
    WebServer.listener = express_1["default"]();
    return WebServer;
}());
exports.WebServer = WebServer;
{
    var output_1 = new Map();
    this.ejsViewNames.forEach(function (ejsN) {
        var interfaceName = _this.viewInterfaceNames.filter(function (i) { return i.toLowerCase() == ejsN.toLowerCase(); })[0];
        if (interfaceName) {
            var _interface = yield Promise.resolve().then(function () { return require(path_1["default"].join(_this.viewInterfacesRoot, interfaceName + ".ts")); });
            output_1.set(ejsN);
        }
    });
    return {};
}
setupListener((_a = {}, _b = _a.assetsFolder, assetsFolder = _b === void 0 ? "public" : _b, _c = _a.port, port = _c === void 0 ? 8080 : _c, _a));
void {
    "this": .listener.use(express_1["default"].json({ limit: "1mb" })),
    "this": .listener.use(express_1["default"].urlencoded({ extended: true })),
    "this": .listener.use(express_1["default"].static(assetsFolder)),
    "this": ._serverPort = port
};
start();
void {
    Logger: Logger_1.Logger,
    : .logMessage("Starting WebServer..."),
    "this": .setupListener(),
    ViewTemplates: ViewTemplates_1.ViewTemplates, : .loadViewInterfaces().then(function (res) {
        _this.viewEngine = "ejs";
        _this.loadContentPages();
        _this.loadStatusPages();
        try {
            _this.listener.listen(_this.serverPort, function () { return console.log("[" + _this.constructor.name + "]: listening for requests on port " + _this.serverPort); });
        }
        catch (ex) {
            if (ex instanceof Error)
                console.log(ex.message);
        }
    })
};
registerPostEndpoint(endpoint, string, callback, IWebRequest);
void {
    Logger: Logger_1.Logger, : .logMessage("Attempting to assign POST callback to: " + endpoint),
    "this": .listener.post(endpoint, callback)
};
registerGetEndpoint(endpoint, string, callback, IWebRequest);
void {
    Logger: Logger_1.Logger, : .logMessage("Attempting to assign GET callback to: " + endpoint),
    "this": .listener.get(endpoint, callback)
};
registerMiddleware(callback, Function);
void {
    "this": .listener.use(callback)
};
loadStatusPages();
void (_d = {
        "const": views,
        string: string
    },
    _d[] =  = this.ejsViewNames,
    _d["const"] = viewModels,
    _d.ViewTemplates = ViewTemplates_1.ViewTemplates,
    _d. = .Wrapper < IViewTemplate > [],
    _d.ViewTemplates = ViewTemplates_1.ViewTemplates,
    _d. = .getViewTypes(),
    _d.views = views,
    _d. = .filter(function (n) { return /^[0-9]+$/.test(n); }).forEach(function (n) {
        var _interface = viewModels.filter(function (i) { return i.name.toLowerCase() == n.toLowerCase(); })[0];
        WebServer.registerMiddleware(function (req, res, next) {
            res.status(n);
            var getCallback = _interface === null || _interface === void 0 ? void 0 : _interface.prototype.get;
            res.render(n, _interface && getCallback ? getCallback(req, res) : {});
        });
    }),
    _d);
loadContentPages();
void {
    "const": views = this.ejsViewNames,
    "const": viewModels,
    ViewTemplates: ViewTemplates_1.ViewTemplates,
    : .Wrapper < IViewTemplate > [],
    ViewTemplates: ViewTemplates_1.ViewTemplates,
    : .getViewTypes(),
    views: views, : .filter(function (name) { return !(/^[0-9]+$/.test(name)); })
        .forEach(function (name) {
        var _interface = viewModels.filter(function (i) { return i.name.toLowerCase() == name.toLowerCase(); })[0];
        WebServer.registerGetEndpoint(("/" + name).replace("index", ""), function (req, res, next) {
            var getCallack = _interface.prototype.get;
            return res.render(name, _interface && getCallack ? getCallack(req, res) : {});
        });
        if (_interface) {
            {
                var postCallback_1 = _interface.prototype.post;
                if (postCallback_1 !== undefined) {
                    WebServer.registerPostEndpoint(("/" + name).replace("index", ""), function (req, res, next) {
                        return res.render(name, _interface ? postCallback_1(req, res, next) : {});
                    });
                }
            }
        }
    })
};
