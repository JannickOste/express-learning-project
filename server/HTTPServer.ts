import { TemplateEngine } from './TemplateEngine';

/**
 * Webserver object
 * @author Oste Jannick.
 * @created 2022/03/15
 */
export class HTTPServer extends TemplateEngine
{
    public static readonly instance: HTTPServer = new HTTPServer();
    private readonly express = require("express");
    private readonly listener = this.express();

    /** Listening port for webrequests. */
    private get serverPort(): Number  { return this.listener.get("port");}

    /**
     * Initialization procedure of object
     */
    private constructor()
    {
        super();


        this.listener.use(this.express.json({limit: "1mb"}));
        this.listener.use(this.express.urlencoded({extended: true}));
        this.bindViewEngine(this.listener);
        this.listener.set("port", 80);
    }

    /**
     * Start listening for requests
     */
    public start(): void
    {
        try
        {
            this.listener.listen(this.serverPort, 
                () => console.log(`[${this.constructor.name}]: listening for requests on port ${this.serverPort}`));
        } catch(ex)
        {
            if(ex instanceof Error)
                console.log(ex.message);
        }
    }

    public setPostEvent(endpoint: string, event: Function): void 
    {
        this.listener.post(endpoint, event);
    }
}