"use strict";
/**
 * Global required module imports.
 *
 * @author Oste Jannick
 * @created 2022/03/15
 * @lastUpdate 2022/03/19
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoot = exports.fileSystem = exports.fs = void 0;
/** TypeScript "fs" library */
exports.fs = require("fs");
/** npm file-system library */
exports.fileSystem = require("file-system");
/** Project root */
const root = __dirname.match(/^(.*?)(?=(\/|\\)(src))/);
exports.projectRoot = (root !== null ? root[0] : "");
