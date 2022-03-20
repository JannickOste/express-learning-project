"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewTemplates = void 0;
const path_1 = __importDefault(require("path"));
const Globals_1 = require("../misc/Globals");
const Logger_1 = require("../misc/Logger");
const WebServer_1 = require("./WebServer");
/**
 * psuedocode ViewTemplates
 * - The code exports a function called getViews() which returns an array of all the registered views.
 * - The code then exports a function called set() that sets an interface object to the view template stack.
 * - The code is a wrapper around the IViewTemplate interface.
 * - It has a readonly prototype property which returns the view implementation object itself.
 * - The set function takes an instance of the extended type of IViewTemplateModel and pushes it onto the viewImplementations array.
 */
var ViewTemplates;
(function (ViewTemplates) {
    const viewImplementations = [];
    /**
     * Get all registered views using the set attribute
     *
     * @returns IViewTemplateModel array
     */
    function getViewTypes() {
        return viewImplementations;
    }
    ViewTemplates.getViewTypes = getViewTypes;
    /**
     * sets an interface object to the views template stack
     *
     * @param ctor extended type of IViewTemplateModel
     * @returns IViewTemplateModel wrapper
     */
    function set(ctor) {
        viewImplementations.push(ctor);
        return ctor;
    }
    ViewTemplates.set = set;
    /**
     * Load all IViewTemplate extensions from src.net.views
     * @returns
     *
     * - The code starts by loading all the IViewTemplate extensions from src.net.views into the current namespace, and then iterates through each of them to see if it is a view that starts with "viewName".
     * - If so, it tries to import the file using await import (path.join(targetPath, interfaceFile)).
     * - If not, it logs an exception and continues on its way through the rest of the code.
     * - The outputViews are then pushed onto an array called outputViews which is returned as a promise in return outputViews;
     * - The code is a simple example of the getViewInterfaces() function.
     * - The getViewInterfaces() function returns a Promise that will return an IViewTemplate[] array.
     */
    ViewTemplates.loadViewInterfaces = () => __awaiter(this, void 0, void 0, function* () {
        (0, Logger_1.logMessage)("Loading interfaces into current namespace...");
        const targetPath = path_1.default.join(__dirname, "views");
        const viewInterfaces = Globals_1.fs.readdirSync(targetPath);
        const views = WebServer_1.WebServer.getViewNames.map(i => i.toLowerCase());
        const outputViews = [];
        for (let interfaceFile of viewInterfaces) {
            if (views.filter(viewName => interfaceFile.toLowerCase().startsWith(viewName)).length == 1) {
                try {
                    const f = yield Promise.resolve().then(() => __importStar(require(path_1.default.join(targetPath, interfaceFile))));
                    outputViews.push(f);
                }
                catch (ex) {
                    if (ex instanceof Error)
                        (0, Logger_1.logMessage)(ex.message);
                }
            }
        }
        return outputViews;
    });
})(ViewTemplates = exports.ViewTemplates || (exports.ViewTemplates = {}));
