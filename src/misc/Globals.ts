/**
 * Miscellaneous utilities.
 * 
 * @module misc
 */

import path from "path";

/** static data and required module imports.*/
export class Globals
{
    /** Readline-Sync library */
    public static readonly rlSync = require("readline-sync")
    /** TypeScript "fs" library */
    public static readonly  fs = require("fs");
    /** unzip-stream library */
    public static readonly unzip = require("unzip-stream")

    /** npm file-system library */
    public static readonly fileSystem = require("file-system");

    /** Project root */
    public static get projectRoot(): string {
        return path.dirname(path.dirname(process.argv[1]));
    }

    /** Dump location for documentation. */
    public static get documentationRoot(): string {
        return path.join(this.projectRoot, this.staticFolder, "docs");
    }

    public static get configurationRoot(): string 
    {
        return path.join(this.projectRoot, "conf");
    }

    /**
     * public static assets folders. 
     */
    public static get staticFolder(): string {
        return "public";
    }

}