import path from "path";
import { ViewTemplates } from "./templates/ViewTemplates";
import { Globals } from '../misc/Globals';


/**
 * Service responsible for loading view data and registering endpoints.
 * 
 * @author Oste Jannick
 * @created 2022/03/16
 */
export abstract class ViewService {
    protected static readonly ejs: any = require("ejs");

    /**
     * bind all ejs views based on name to listener foreach content and statuscode.
     * @param listener websocket
     */
    public bindViewEngine(listener: any): void {
        listener.set("view engine", "ejs");

        // Content pages
        this.views.filter((name: string) => !(/^[0-9]+$/.test(name)))
            .forEach((name: string) => {
                const _interface = ViewTemplates.getViews()
                    .filter(i => i.name.toLowerCase() == name.toLowerCase())[0];

                
                listener.get(`/${name}`.replace("index", ""),
                    (req: any, res: any) => {
                        const getCallack: Function | undefined = _interface.prototype.get;
                        res.render(name, _interface && getCallack ? getCallack(req, res) : {});
                });
                
                if (_interface) {
                    {
                        const postCallback = _interface.prototype.post;
                        if(name == "postExample")
                            console.dir(_interface.prototype);
                        if(postCallback !== undefined)
                        {
                            console.log("hello world");
                            listener.post(`/${name}`.replace("index", ""), (req: any, res: any, next: any) => {
                                Object.create(_interface.prototype).post(req, res);
                                res.render(name, _interface ? postCallback(req, res, next) : {});
                            });
                        }
                    }

                }

            });

        // Status pages.
        this.views.filter(n => /^[0-9]+$/.test(n)).forEach(n => {
            const _interface = ViewTemplates.getViews().filter(i => i.name.toLowerCase() == n.toLowerCase())[0];

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

        Globals.fileSystem.recurseSync(path.join(__dirname, "../../", "views"), (filepath: string, relative: string, name: string) => {
            if (name && name.endsWith("ejs")) {
                const filename = path.basename(filepath);
                const absName = filename.substring(0, filename.length - 4);

                out.push(absName);
            }
        });

        return out;
    }
}