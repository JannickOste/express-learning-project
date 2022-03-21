"use strict";
/**
 * Network/Request handeling module
 *
 * @module net
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.WebServer = void 0;
var express_1 = require("express");
var Logger_1 = require("../misc/Logger");
var Globals_1 = require("../misc/Globals");
var path_1 = require("path");
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
        /** Get all absolute names of ejs files in ejs views directory. */
        get: function () {
            return Globals_1.Globals.fs.readdirSync(this.ejsViewsRoot)
                .filter(function (i) { return i.endsWith("ejs"); })
                .map(function (i) { return i.substring(0, i.length - 4); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebServer, "viewInterfacesRoot", {
        /** Get ejs view interfaces root */
        get: function () { return path_1["default"].join(Globals_1.Globals.projectRoot, "src", "net", "views"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebServer, "viewInterfaceNames", {
        /** Get names of all ejs view interfaces */
        get: function () { return Globals_1.Globals.fs.readdirSync(this.viewInterfacesRoot).filter(function (i) { return i.toLowerCase().endsWith(".ts"); }).map(function (i) { return i.substring(0, i.length - 3); }); },
        enumerable: false,
        configurable: true
    });
    /** Get all viewnames and there prototype if available  */
    WebServer.viewPrototypes = function () {
        return __awaiter(this, void 0, Promise, function () {
            var output, _loop_1, this_1, _i, _a, ejsN;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        output = new Map();
                        _loop_1 = function (ejsN) {
                            var interfaceName, _interface, modulePrototype, _a, _b, _c, objectName, e_1;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        interfaceName = this_1.viewInterfaceNames.filter(function (i) { return i.toLowerCase() == ejsN.toLowerCase(); })[0];
                                        _interface = undefined;
                                        if (!interfaceName) return [3 /*break*/, 4];
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 3, , 4]);
                                        _b = (_a = Object).assign;
                                        _c = [{}];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require(path_1["default"].join(this_1.viewInterfacesRoot, interfaceName + ".ts")); })];
                                    case 2:
                                        modulePrototype = _b.apply(_a, _c.concat([_d.sent()]));
                                        objectName = Object.getOwnPropertyNames(modulePrototype)[0];
                                        _interface = Object.assign({}, modulePrototype[objectName]);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_1 = _d.sent();
                                        return [3 /*break*/, 4];
                                    case 4:
                                        output.set(ejsN, _interface);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this.ejsViewNames;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        ejsN = _a[_i];
                        return [5 /*yield**/, _loop_1(ejsN)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, output];
                }
            });
        });
    };
    /**
     * Setup listener configuration
     *
     * @psuedocode setupListener
     * - Then it assigns middle ware for incomming json objects, url encoded objects and an accessor for access to the public files directory.
     * - Then it sets the port to the port argument (default:  8080)
     */
    WebServer.setupListener = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.assetsFolder, assetsFolder = _c === void 0 ? "public" : _c, _d = _b.port, port = _d === void 0 ? 8080 : _d;
        this.listener.use(express_1["default"].json({ limit: "1mb" }));
        this.listener.use(express_1["default"].urlencoded({ extended: true }));
        this.listener.use(express_1["default"].static(assetsFolder));
        this._serverPort = port;
    };
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
    WebServer.start = function () {
        var _this = this;
        Logger_1.Logger.logMessage("Starting WebServer...");
        this.setupListener();
        this.viewEngine = "ejs";
        this.setViews()
            .then(function (v) {
            try {
                _this.listener.listen(_this.serverPort, function () { return console.log("[" + _this.constructor.name + "]: listening for requests on port " + _this.serverPort); });
            }
            catch (ex) {
                if (ex instanceof Error)
                    console.log(ex.message);
            }
        })["catch"](function (e) { return console.log("Failed to load endpoints...\n" + e); });
    };
    /**
     *
      * - The code starts by creating an object called viewDict from the viewPrototypes output.
      * - This is a map of key-value pairs where the keys are strings and the values are IWebRequest objects.
      * - The code then iterates over all of the views in this map, sorting them by their names value (the numeric values last).
      * - The code then gets the key and the value from the current iteration pair.
      * - The code then parses the endpoint based on the name
      * - The code then starts iterating over all the IWebRequest interface properties
      * - it checks foreach property or it has been defined
      * - if not, it continues to the next value in the iteration
      * - if defined, it checks
     */
    WebServer.setViews = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var viewDict;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.viewPrototypes()];
                    case 1:
                        viewDict = _a.sent();
                        Array.from(viewDict).sort(function (i) { return /^[0-9]+$/.test(i[0]) ? 1 : -1; }).forEach(function (pair) {
                            var key = pair[0];
                            var value = pair[1];
                            var endpoint = ("/" + key).replace("index", "");
                            if (/^[0-9]{3}$/.test(key))
                                _this.listener.use(function (req, res, next) {
                                    res.status(Number.parseInt(key));
                                    return res.render(key, {});
                                });
                            else if (value) {
                                var _loop_2 = function (requestType) {
                                    if (value[requestType] === undefined)
                                        return "continue";
                                    var renderViewCallback = function (req, res, next) { return res.render(key, value[requestType](req, res)); };
                                    var setter = void 0;
                                    if (/^[a-zA-Z]+$/.test(key)) {
                                        switch (requestType) {
                                            case "get":
                                                setter = function () { return _this.listener.get(endpoint, renderViewCallback); };
                                                break;
                                            case "post":
                                                setter = function () { return _this.listener.post(endpoint, renderViewCallback); };
                                                break;
                                            case "put":
                                                setter = function () { return _this.listener.put(endpoint, renderViewCallback); };
                                                break;
                                            case "patch":
                                                setter = function () { return _this.listener.patch(endpoint, renderViewCallback); };
                                                break;
                                            case "delete":
                                                setter = function () { return _this.listener["delete"](endpoint, renderViewCallback); };
                                                break;
                                            case "copy":
                                                setter = function () { return _this.listener.copy(endpoint, renderViewCallback); };
                                                break;
                                            case "head":
                                                setter = function () { return _this.listener.head(endpoint, renderViewCallback); };
                                                break;
                                            case "options":
                                                setter = function () { return _this.listener.options(endpoint, renderViewCallback); };
                                                break;
                                            case "purge":
                                                setter = function () { return _this.listener.purge(endpoint, renderViewCallback); };
                                                break;
                                            case "lock":
                                                setter = function () { return _this.listener.lock(endpoint, renderViewCallback); };
                                                break;
                                            case "unlock":
                                                setter = function () { return _this.listener.unlock(endpoint, renderViewCallback); };
                                                break;
                                            case "propfind":
                                                setter = function () { return _this.listener.propfind(endpoint, renderViewCallback); };
                                                break;
                                        }
                                    }
                                    if (setter)
                                        setter();
                                };
                                for (var requestType in value) {
                                    _loop_2(requestType);
                                }
                            }
                        });
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /** ExpressJS server application for listening for webrequests */
    WebServer.listener = express_1["default"]();
    return WebServer;
}());
exports.WebServer = WebServer;
