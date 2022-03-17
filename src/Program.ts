import { StringTools } from "./misc/StringTools";
import { HTTPServer } from "./net/HTTPServer";

console.log(StringTools.htmlspecialchars("&&&&&&&&&&"));

HTTPServer.instance.start();

