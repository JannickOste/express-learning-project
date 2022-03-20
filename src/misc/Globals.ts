/**
 * Miscellaneous utilities.
 * 
 * @module misc
 */

import path from "path";

/** static data and required module imports.*/
export class Globals
{
    /** TypeScript "fs" library */
    public static readonly  fs = require("fs");
    /** npm file-system library */
    public static readonly fileSystem = require("file-system");

    /** Project root */
    public static get projectRoot(): string {
        const root = (__dirname.match(/^(.*?)(?=(\/|\\)(src))/) as any);
        return (root !== null ? root[0] : "");
    }

    /** Dump location for documentation. */
    public static get documentationRoot(): string {
        return path.join(this.projectRoot, this.staticFolder, "docs");
    }

    /**
     * public static assets folders. 
     */
    public static get staticFolder(): string {
        return "public static";
    }
}