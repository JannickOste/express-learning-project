/**
 * Automated ExpressJS implementation, using interfaces for Request callbacks and response handeling. 
 * 
 * @author Oste Jannick
 * @created 2022/03/15
 */

import { Logger } from "./misc/Logger";
import { WebServer } from "./net/WebServer";


/**
 * Main application entrypoint
 */
function main() {
    Logger.logMessage("Updating documentation...");
    Logger.dumpDocumentation()
        .then(r => console.log("succesfully updated documentation"))
        .catch(e => console.log(`Failed to update documentation\n${e}`));


    WebServer.start();
}

main();
