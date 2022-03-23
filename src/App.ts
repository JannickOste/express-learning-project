/**
 * Automated ExpressJS implementation, using interfaces for Request callbacks and response handeling. 
 * 
 * @author Oste Jannick
 * @created 2022/03/15
 */

import { Logger } from "./misc/Logger";
import { WebServer } from "./net/WebServer";
import { Globals } from "./misc/Globals";
import { System } from './misc/System';
import { OpenSSL } from "./utils/openssl/OpenSSL";
import path from "path";

function init() 
{
    Array.from([Globals.configurationRoot, Globals.staticFolder, path.join(Globals.configurationRoot, "certs")]).forEach(p => {
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


OpenSSL.generateSSLCertificate();
//CertificateManager.generateSSLCertificate();
//main();
