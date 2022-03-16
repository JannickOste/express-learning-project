import path from "path";
import {
    fileSystem
} from "../misc/Globals";
import {
    IViewTemplate
} from './IViewTemplate';

/**
 * Class responsible for loading views
 * 
 * @author Oste Jannick
 * @created 2022/03/16
 */
export abstract class TemplateEngine {
    protected static readonly ejs = require("ejs");
    protected static readonly viewEngine = "ejs";

    /**
     * bind all ejs views based on name to listener foreach content and statuscode.
     * @param listener websocket
     */
    public bindViewEngine(listener: any): void {
        listener.set("view engine", TemplateEngine.viewEngine);


        // Content pages
        this.views.filter(n => !(/^[0-9]+$/.test(n)))
            .forEach(n => {
                const _interface = IViewTemplate.getViews().filter(i => i.name.toLowerCase() == n.toLowerCase());

                listener.get(`/${n}`.replace("index", ""),
                    (req: any, res: any) => {
                        res.render(n, _interface.length > 0 ? _interface[0].prototype.getDataObject(req) : {});

                    });

            });

        // Status pages.
        this.views.filter(n => /^[0-9]+$/.test(n)).forEach(n => {
            const _interface = IViewTemplate.getViews().filter(i => i.name.toLowerCase() == n.toLowerCase());

            listener.use((req: any, res: any) => {
                res.status(n);
                res.render(n, _interface.length > 0 ? _interface[0].prototype.getDataObject(req) : {})
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