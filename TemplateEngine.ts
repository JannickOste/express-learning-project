import { fs } from "./Globals";

export class TemplateEngine 
{
    private static ejs = require("ejs");

    constructor(listener: any)
    {
        listener.set("view engine", "ejs");
        
        this.getViewPaths("/views").forEach((value, key) => {
            listener.render(key)
        });
    }


    private getViewPaths(root:string): Map<string, {[key:string]:any}>
    {
        console.log(fs.readdir(root, (err: any, files: any) =>  err ? [] : files).map((p: string) => p));
        return new  Map<string, {[key:string]:any}>();
    }
}