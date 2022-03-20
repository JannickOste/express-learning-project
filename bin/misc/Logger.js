"use strict";
/**
 * Current session log controller
 *
 * @author Oste Jannick
 * @created 2022/03/15
 * @lastUpdate 2022/03/19
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpDocumentation = exports.logMessage = void 0;
/** Currently not implemented, logs message to console only */
const logMessage = (message) => {
    console.log(`[LOGGER]: ${message}`);
};
exports.logMessage = logMessage;
/** Generate project documentation based on typedoc strings. */
const dumpDocumentation = () => __awaiter(void 0, void 0, void 0, function* () {
    const TypeDoc = require("typedoc");
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
exports.dumpDocumentation = dumpDocumentation;
