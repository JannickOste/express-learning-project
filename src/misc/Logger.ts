
/** @module misc */
/**  Current session log controller */
export class Logger
{
    private constructor() {}
    
    /** 
     * Currently not implemented, logs message to console only 
     *
     * @param message Message to log
    */
    public static readonly logMessage = (message: string): void => 
    {
        console.log(`[LOGGER]: ${message}`);
    }

    /** Generate project documentation based on typedoc strings. */
    public static readonly dumpDocumentation = async(): Promise<void> => {
        const TypeDoc = require("typedoc");
        const app = new TypeDoc.Application();

        app.options.addReader(new TypeDoc.TSConfigReader());
        app.options.addReader(new TypeDoc.TypeDocReader());

        app.bootstrap({
            entryPoints: ["src"],
            entryPointStrategy: "expand",
            mergeModulesRenameDefaults: true,
            mergeModulesMergeMode: "module"
        });

        const project = app.convert();

        if (project) {
            const outputDir = "./public/docs";


            await app.generateDocs(project, outputDir);
        }
    }
}