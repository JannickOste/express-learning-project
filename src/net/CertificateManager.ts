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
        const password: string = "test"; // Globals.rlSync.question("Enter a key");
        const keyPairPath: string = `"${path.join(Globals.configurationRoot, "{KEYNAME}{SUFFIX}").replace("{KEYNAME}", keyName)}"`;
        /**&
         * https://www.namecheap.com/support/knowledgebTestkeyase/article.aspx/10161/14/generating-a-csr-on-windows-using-openssl/
         * https://dev.to/openlab/creating-opensslconf-for-windows-104g
        
        */
       // Linux tested instructions
       /*
        const instructions: string[] = [
            `{OPENSSL} genrsa -des3 -passout pass:${password} -out ${keyPairPath.replace("{SUFFIX}", ".key")} 2048`,
            `{OPENSSL} rsa -passin pass:${password} -in ${keyPairPath.replace("{SUFFIX}", ".key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.key")}`,
            `{OPENSSL} req -newkey rsa:2048 -nodes -keyout ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.csr")}`,
            `{OPENSSL} x509 -req -days 365 -in ${keyPairPath.replace("{SUFFIX}", "_private.csr")} -signkey ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.crt")}`
        ]
        */

        // Windows tested instructions
        const instructions: string[] = [
            `{OPENSSL} genrsa -des3 -passout pass:${password} -out ${keyPairPath.replace("{SUFFIX}", ".key")} 2048`,
            `{OPENSSL} rsa -passin pass:${password} -in ${keyPairPath.replace("{SUFFIX}", ".key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.key")}`,
            `{OPENSSL} req -newkey rsa:2048 -nodes -keyout ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.csr")} `+(platform() == "win32" ? `-config ${this.getSSLConfigPath()}` : ""),
            `{OPENSSL} x509 -req -days 365 -in ${keyPairPath.replace("{SUFFIX}", "_private.csr")} -signkey ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.crt")}`
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
                    return CertificateManager.consoleCommand(...commands)
                } : () => resolve());
            } else resolve();
        });

        private static getSSLConfigPath(): string 
        {
            const sslRoot = Globals.configurationRoot;
                            
            const sslBinaryPaths: string[] = [];
            Globals.fileSystem.recurseSync(sslRoot, (filepath: string, relative: string, filename: string) => {
                if(filepath.match(/openssl.cnf$/))
                    sslBinaryPaths.push(filepath);
            });
            return sslBinaryPaths[0];
        }

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
                            if(process.getuid() !== 0)
                                reject(new Error("Elevated user permissions required"));
                            else 
                            {
                                // Breaks code currently need to look into
                                //await this.consoleCommand("sudo apt-get install openssl -y");
                                resolve("openssl");
                            }
                            break;
                }
            })
        }
}