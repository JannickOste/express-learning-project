/**
 * Automated ExpressJS implementation, using interfaces for Request callbacks and response handeling. 
 * 
 * @author Oste Jannick
 * @created 2022/03/15
 */

import { Logger } from "./misc/Logger";
import { WebServer } from "./net/WebServer";
import { CertificateManager } from './net/CertificateManager';
import { platform } from "os";
import path from "path";
import { Globals } from "./misc/Globals";

function init() 
{
    Array.from([Globals.configurationRoot, Globals.staticFolder]).forEach(p => {
        if(!Globals.fs.existsSync(p))
        {
            console.log("Creating folder "+p)
            Globals.fs.mkdirSync(p, {recursive: true});
        }
    })
}

/**
 * Main application entrypoint
 */
function main() {
    // init();
    Logger.logMessage("Updating documentation...");
    Logger.dumpDocumentation()
        .then(r => console.log("succesfully updated documentation"))
        .catch(e => console.log(`Failed to update documentation\n${e}`));


    WebServer.start();
}

init();
CertificateManager.generateSSLCertificate();
//main();
