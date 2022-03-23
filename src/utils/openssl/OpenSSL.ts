/**
 * @module net
 */

 import {
    platform
} from "os";
import path from "path";
import { Globals } from "../../misc/Globals";
import { Logger } from "../../misc/Logger";
import { WebClient } from "../../net/WebClient";
import { ISSLConfiguration } from './interfaces/ISSLConfiguration';
import { DefaultSSLConfiguration } from "./interfaces/DefaultSSLConfiguration";
import { System } from "../../misc/System";

export class OpenSSL {
    public static readonly keyName: string = "ejskey";
    

    public static async generateSSLCertificate(): Promise<void> {
        const sslConfig: ISSLConfiguration = new DefaultSSLConfiguration();
        const sslBinary: string | undefined = await this.getOpenSSLBinary();
        if(sslBinary)
        {
            let check = false;
            if(((check = Globals.fs.existsSync(path.join(Globals.configurationRoot, "certs", "openssl.cnf")))
                && Globals.rlSync.keyInYN("OpenSSL configuration found, do you wish to overwrite current configuration?"))
                || !check)
                    this.generateSSLConfiguration(sslConfig);

            await this.generateSSLCertFromInterface(sslBinary, sslConfig);
        }
    }

    private static async generateSSLCertFromInterface(sslPath: string, config: ISSLConfiguration): Promise<void>
    {
        const password: string = "test"; // Globals.rlSync.question("Enter a key");
        const keyPairPath: string = `"${path.join(config.dir, "certs", "{KEYNAME}{SUFFIX}").replace("{KEYNAME}", OpenSSL.keyName)}"`;
        
        await System.shellCommand(... [ 
            `{OPENSSL} genrsa -des3 -passout pass:${password} -out ${keyPairPath.replace("{SUFFIX}", ".key")} 2048`,
            `{OPENSSL} rsa -passin pass:${password} -in ${keyPairPath.replace("{SUFFIX}", ".key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.key")}`,
            `{OPENSSL} req -newkey rsa:2048 -nodes -keyout ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.csr")} -config ${path.join(Globals.configurationRoot, "certs", "openssl.cnf")} -subj "/C=BE/ST=Brussels/O=Global Testing/OU=Noob Department/CN=localhost" `,
            `{OPENSSL} x509 -req -days 365 -in ${keyPairPath.replace("{SUFFIX}", "_private.csr")} -signkey ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.crt")}`   
        ].map(i => i.replace("{OPENSSL}", sslPath)));
    }

    public static get getKeyCertPair(): {
        key: string,
        cert: string,
        ciphers: string
    } {
        return {
            key: Globals.fs.readFileSync(path.join(Globals.configurationRoot, this.keyName + "_private.key"), "utf-8"),
            cert: Globals.fs.readFileSync(path.join(Globals.configurationRoot, this.keyName + "_private.crt"), "utf-8"),
            ciphers: "DEFAULT:!SSLv2:!RC4:!EXPORT:!LOW:!MEDIUM:!SHA1"
        };
    }

    private static generateSSLConfiguration(config: ISSLConfiguration = new DefaultSSLConfiguration()): void 
    {
        const configMap: {[key:string]:any} = Object.assign({}, config);
        let template: string =  DefaultSSLConfiguration.templateString;

        for(const key in configMap)
            template = template.replace(`{${key.toUpperCase()}}`, configMap[key]);

        Globals.fs.writeFileSync(path.join(config.dir, "certs", "openssl.cnf"), template);
    }

    private static getOpenSSLBinary(): Promise < string > {
        switch (platform()) {
            case "win32":
                return this.getOpenSSLBinaryWindows();
            case "linux": return this.getOpenSSLBinaryLinux();
        }

        return Promise.reject(new Error("Unsupported platform"));
    }

    private static getOpenSSLBinaryLinux(): Promise<string>
    {
        return new Promise<string>((resolve, reject) => {
            if (process.getuid() !== 0)
                reject(new Error("Elevated user permissions required"));
            else {
                // Breaks code currently need to look into
                //await this.consoleCommand("sudo apt-get install openssl -y");
                resolve("openssl");
            }
        });
    }

    private static getOpenSSLBinaryWindows(): Promise<string>
    {
        return new Promise<string>(async(resolve, reject) => {
            try {
                const url = "https://mirror.firedaemon.com/OpenSSL/openssl-1.1.1n.zip";
                const sslRoot = Globals.configurationRoot;
    
                const sslBinaryPaths: string[] = [];
                Globals.fileSystem.recurseSync(sslRoot, (filepath: string, relative: string, filename: string) => {
                    if (filepath.match(/bin(\\|\/)openssl(.*?).exe$/))
                        sslBinaryPaths.push(filepath);
                });
    
                let sslBinary: string | undefined = sslBinaryPaths.sort(i => i.includes(process.arch) ? -1 : 1)[0];
                if (sslBinary !== undefined) {
                    if (process.arch == "x86" && sslBinary.includes("x64"))
                        reject(new Error("Attempted to load invalid architecture executable for OpenSSL"));
                    if (sslBinary === undefined) reject(new Error("Failed to fetch openssl subfolder"));
                    else resolve(`"${sslBinary}"`);
                } else {
                    const zipFile: string = (url.match(/(?<=\/)([a-zA-Z0-9\-\.]+)(\.zip)$/) as any)[0];
                    if (!Globals.fs.existsSync(path.join(sslRoot, zipFile))) {
                        Logger.logMessage("OpenSSL not found, downloading library");
                        await WebClient.downloadFile(url, path.join(sslRoot, zipFile));
                    }
    
                    Logger.logMessage(`unzipping ${zipFile}...`);
                    await Globals.fs.createReadStream(path.join(sslRoot, zipFile))
                        .on("finish", async () => resolve(await this.getOpenSSLBinary()))
                        .on("error", (ex: any) => reject(ex))
                        .pipe(Globals.unzip.Extract({
                            path: Globals.configurationRoot
                        }));
    
                }
    
            } catch (ex) {
                reject(ex);
            }
        })
    }
}