/**
 * Global required module imports.
 * 
 * @author Oste Jannick
 * @created 2022/03/15
 * @lastUpdate 2022/03/19
 */
 class Test
 {
     /** TypeScript "fs" library */
     public fs = require("fs");
 
     /** npm file-system library */
     public fileSystem = require("file-system");
 
     /** Project root */
     public projectRoot: string = (__dirname.match(/^(.*?)(?=(\/|\\)(src))/) as any)[0];
 }
 