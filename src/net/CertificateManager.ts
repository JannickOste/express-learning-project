/**
 * @module net
 */

import { platform } from "os";
import { spawn, ChildProcess } from 'child_process';
import { Globals } from '../misc/Globals';
import path from "path";
import { WebClient } from "./WebClient";
import { Logger } from "../misc/Logger";

export class CertificateManager 
{
    public static async generateSSLCertificate(keyName: string = "ejskey")
    {
        const password: string = "Testkey"; // Globals.rlSync.question("Enter a key");
        const keyPairPath: string = `${path.join(Globals.configurationRoot, "{KEYNAME}.key").replace("{KEYNAME}", keyName)}"`;
        const keyPairPrivPath: string = `"${path.join(Globals.configurationRoot, "{KEYNAME}_private.key".replace("{KEYNAME}", keyName))}"`;
        /**&
         * https://www.namecheap.com/support/knowledgebase/article.aspx/10161/14/generating-a-csr-on-windows-using-openssl/
         * https://dev.to/openlab/creating-opensslconf-for-windows-104g
        
        */
        const instructions: string[] = [
            `{OPENSSL} genrsa -des3 -passout pass:${password} -out ${keyPairPath} 2048`,
            `{OPENSSL} rsa -passin pass:${password} -in ${keyPairPath} -out ${keyPairPrivPath}`,
            `{OPENSSL} req -new -x509 -nodes -sha256 -days 365 -key ${keyPairPrivPath} -out ${keyPairPrivPath.replace(/key(?=\")/, "crt")}`
            //`{OPENSSL} req -newkey rsa:2048 -nodes -keyout ${keyPairPrivPath} -out ${keyPairPrivPath.replace(/key\"$/g, "csr")}`,
            //`{OPENSSL} req -new -key "${keyPairPrivPath}" -out "${keyPairPrivPath.replace(/key$/g, "csr")}"`,
            //`{OPENSSL} x509 -req -days 365 -in ${keyPairPrivPath.replace(/key$/g, "csr")} -signkey ${keyPairPrivPath} -out ${keyPairPrivPath.replace(/key$/g, "crt")}`
            //`{OPENSSL} x509 -in d:\apache\conf\server.csr -out d:\apache\conf\server.crt -req -signkey d:\apache\conf\server.key -days 365`

        ]
        
        let openssl: string = await this.getOpenSSLBinary();
        
        await this.consoleCommand(... instructions.map(i => i.replace("{OPENSSL}", openssl)));
    }

    private static readonly consoleCommand = (... commands: string[] ): Promise<void> =>
        new Promise((resolve, reject) => 
        { 
            if(commands.length >= 1)
            {
                Logger.logMessage("Executing shell command: "+commands[0]);
                const proc: ChildProcess = spawn(commands[0], [], { shell: true, stdio: 'inherit' });
    
                proc.on("error", (ex) => reject(ex));
                proc.on("exit", commands.length != 0 ? () => {
                    commands.shift();
                    this.consoleCommand(...commands)
                } : () => resolve());
            } else resolve();
        });

        private static getOpenSSLBinary(): Promise<string>
        {
            return new Promise<string>(async(resolve, reject) => 
            {
                switch(platform())
                {
                    case "win32":
                        try
                        {
                            const url = "https://mirror.firedaemon.com/OpenSSL/openssl-1.1.1n.zip";
                            const sslRoot = Globals.configurationRoot;
                            
                            const sslBinaryPaths: string[] = [];
                            Globals.fileSystem.recurseSync(sslRoot, (filepath: string, relative: string, filename: string) => {
                                if(filepath.match(/bin(\\|\/)openssl(.*?).exe$/))
                                    sslBinaryPaths.push(filepath);
                            });
                            
                            let sslBinary: string | undefined = sslBinaryPaths.sort(i => i.includes(process.arch) ? -1 : 1)[0];
                            if(sslBinary !== undefined)
                            {
                                if(process.arch == "x86" && sslBinary.includes("x64")) 
                                    reject(new Error("Attempted to load invalid architecture executable for OpenSSL"));
                                if(sslBinary === undefined) reject(new Error("Failed to fetch openssl subfolder"));
                                else resolve(`"${sslBinary}"`);
                            }
                            else
                            {
                                const zipFile: string = (url.match(/(?<=\/)([a-zA-Z0-9\-\.]+)(\.zip)$/) as any)[0];
                                if(!Globals.fs.existsSync(path.join(sslRoot, zipFile)))
                                {
                                    Logger.logMessage("OpenSSL not found, downloading library");
                                    await WebClient.downloadFile(url, path.join(sslRoot, zipFile));
                                } 

                                Logger.logMessage(`unzipping ${zipFile}...`);
                                await Globals.fs.createReadStream(path.join(sslRoot, zipFile))
                                    .on("finish", async() => resolve(await this.getOpenSSLBinary()))
                                    .on("error", (ex: any) => reject(ex))
                                    .pipe(Globals.unzip.Extract({path: Globals.configurationRoot}));
                                
                            }
        
                        }
                       catch(ex) 
                       {
                           reject(ex);
                       }
                        break;

                        case "linux":
                            resolve("openssl");
                            break;
                }
            })
        }
}