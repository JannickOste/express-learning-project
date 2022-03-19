/**
 * Global required module imports.
 * 
 * @author Oste Jannick
 * @created 2022/03/15
 * @lastUpdate 2022/03/19
 */

    /** TypeScript "fs" library */
    export const fs = require("fs");

    /** npm file-system library */
    export const fileSystem = require("file-system");

    /** Project root */
    export const projectRoot: string = (__dirname.match(/^(.*?)(?=(\/|\\)(src))/) as any)[0];
