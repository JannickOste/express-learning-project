import { StringTools } from "./misc/StringTools";
import { HTTPServer } from "./net/WebServer";

console.log(StringTools.htmlspecialchars("&&&&&&&&&&"));

HTTPServer.instance.start();

