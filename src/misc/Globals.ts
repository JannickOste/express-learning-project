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

    public static readonly http = require("http");
    public static readonly https = require("https");

    /** Project root */
    public static get projectRoot(): string {
        const root = (__dirname.match(/^(.*?)(?=(\/|\\)(src))/) as any);
        return (root !== null ? root[0] : "");
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