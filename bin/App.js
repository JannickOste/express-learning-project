"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const WebServer_1 = require("./net/WebServer");
const Logger_1 = require("./misc/Logger");
const TypeDoc = require("typedoc");
function generateDocumentation() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = new TypeDoc.Application();
        app.options.addReader(new TypeDoc.TSConfigReader());
        app.options.addReader(new TypeDoc.TypeDocReader());
        app.bootstrap({
            entryPoints: ["src"],
            entryPointStrategy: "expand"
        });
        const project = app.convert();
        if (project) {
            // Project may not have converted correctly
            const outputDir = "./public/docs";
            // Rendered docs
            yield app.generateDocs(project, outputDir);
            // Alternatively generate JSON output
            yield app.generateJson(project, outputDir + "/documentation.json");
        }
    });
}
function start() {
    (0, Logger_1.logMessage)("Updating documentation...");
    generateDocumentation().then(r => console.log("succesfully updated documentation"))
        .catch(e => console.log("Failed to update documentation"));
    WebServer_1.WebServer.start();
}
exports.start = start;
start();
