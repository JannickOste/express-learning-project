/**
 * @module net
 */
import { HttpClient } from "typed-rest-client/HttpClient";
import { Globals } from "../misc/Globals";
import { Logger } from "../misc/Logger";

/**
 * Webclient for external scraping/downloading tasks.
 */
export class WebClient 
{
    /**
     * Download a file from a URL.
     * 
     * @param url the URL endpoints.
     * @param output Filepath to output location
     * @returns resolve(void) / reject(Error)
     */
    public static downloadFile(url: string, output: string): Promise<void>
    {
        return new Promise(async(resolve, reject) => {
            const client = new HttpClient("EJS WebClient");
            const response = await client.get(url);
            const file: NodeJS.WritableStream = Globals.fs.createWriteStream(output);
            
            if (response.message.statusCode !== 200) {
                const err: Error = new Error(`Unexpected HTTP response: ${response.message.statusCode}`);
                throw err;
            }

            return new Promise(() => {
                Logger.logMessage(`Downloading file from: ${url}`)
                
                file.on("error", (ex) => reject(ex));
                response.message.pipe(file).on("finish", () => {
                    try { 
                        Logger.logMessage(`Download completed, file saved at: ${output}`);
                        resolve();
                    } catch (err) {
                        reject((err as any).stack);
                    }
                });
            });
        });
    }
}