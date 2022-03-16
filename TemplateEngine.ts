import path from "path";
import { fileSystem } from "./Globals";


export abstract class TemplateEngine 
{
    protected static readonly ejs = require("ejs");
    protected static readonly viewEngine = "ejs";

    /**
     * bind all ejs views based on name to listener
     * @param listener websocket
     */
    public bindViewEngine(listener: any): void
    {
        listener.set("view engine", TemplateEngine.viewEngine);

        this.views.filter(n => !(/^[0-9]+$/.test(n)))
                  .forEach(p => listener.get(`/${p}`.replace("index", ""), 
                                            (req: any, res: any)=> res.render(p)));
        
        this.views.filter(n => /^[0-9]+$/.test(n)).forEach(n =>
            {
                listener.use((req: any, res: any) => {
                    res.status(n);
                    res.render(n);
                });
            })
    }

    /**
     * fetch all ejs templates from views folder
     */
    private get views(): string[]
    {
        let out: string[] = [];
        fileSystem.recurseSync(path.join(__dirname, "views"), (filepath: string, relative: string, name : string) => {
            if(name && name.endsWith("ejs"))
            {
                const filename = path.basename(filepath);
                const absName = filename.substring(0, filename.length-4);

                out.push(absName);
            }
        });
        return out;
    }
}