"use strict";
/**
 * Global required module imports.
 *
 * @author Oste Jannick
 * @created 2022/03/15
 * @lastUpdate 2022/03/19
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentationRoot = exports.projectRoot = exports.fileSystem = exports.fs = void 0;
const path_1 = __importDefault(require("path"));
/** TypeScript "fs" library */
exports.fs = require("fs");
/** npm file-system library */
exports.fileSystem = require("file-system");
/** Project root */
const root = __dirname.match(/^(.*?)(?=(\/|\\)(src))/);
exports.projectRoot = (root !== null ? root[0] : "");
exports.documentationRoot = path_1.default.join(exports.projectRoot, "public", "docs");
