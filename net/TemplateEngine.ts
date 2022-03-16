import path from "path";
import {
    fileSystem
} from "../misc/Globals";
import { IViewTemplates } from "./templates/IViewTemplates";


/**
 * Class responsible for loading views
 * 
 * @author Oste Jannick
 * @created 2022/03/16
 */
export abstract class TemplateEngine {
    protected static readonly ejs: any = require("ejs");
    protected static readonly viewEngine: string = "ejs";

    /**
     * bind all ejs views based on name to listener foreach content and statuscode.
     * @param listener websocket
     */
    public bindViewEngine(listener: any): void {
        listener.set("view engine", TemplateEngine.viewEngine);

        // Content pages
        this.views.filter((name: string) => !(/^[0-9]+$/.test(name)))
            .forEach((name: string) => {
                const _interface = IViewTemplates.getViews()
                    .filter(i => i.name.toLowerCase() == name.toLowerCase())[0];

                
                listener.get(`/${name}`.replace("index", ""),
                    (req: any, res: any) => {
                        const getCallack: Function | undefined = _interface.prototype.get;
                        res.render(name, _interface && getCallack ? getCallack(req, res) : {});
                });
                
                console.log(`/${name}`);
                if (_interface) {
                    const postCallback = _interface.prototype.post;
                    if(postCallback !== undefined)
                        listener.post(`/${name}`.replace("index", ""), (req: any, res: any) => {
                            Object.create(_interface.prototype).post(req, res);
                            res.render(name, _interface ? postCallback(req, res) : {});
                        });
                }

            });

        // Status pages.
        this.views.filter(n => /^[0-9]+$/.test(n)).forEach(n => {
            const _interface = IViewTemplates.getViews().filter(i => i.name.toLowerCase() == n.toLowerCase())[0];

            listener.use((req: any, res: any) => {
                res.status(n);

                const getCallback: Function | undefined = _interface?.prototype.get; 
                res.render(n, _interface && getCallback ? getCallback(req, res) : {})
            });
        })
    }

    /**
     * fetch all ejs templates from views folder
     */
    private get views(): string[] {
        let out: string[] = [];

        fileSystem.recurseSync(path.join(__dirname, "../", "views"), (filepath: string, relative: string, name: string) => {
            if (name && name.endsWith("ejs")) {
                const filename = path.basename(filepath);
                const absName = filename.substring(0, filename.length - 4);

                out.push(absName);
            }
        });

        return out;
    }
}