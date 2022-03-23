/**
 * @module net
 */

 import {
    platform
} from "os";
import {
    spawn,
    ChildProcess
} from 'child_process';
import path from "path";
import { Globals } from "../../misc/Globals";
import { Logger } from "../../misc/Logger";
import { WebClient } from "../../net/WebClient";
import { ISSLConfiguration } from './interfaces/ISSLConfiguration';
import { DefaultSSLConfiguration } from "./interfaces/DefaultSSLConfiguration";

export class OpenSSL {
    public static readonly keyName: string = "ejskey";

    public static async generateSSLCertificate() {
        const password: string = "test"; // Globals.rlSync.question("Enter a key");
        
        const keyPairPath: string = `"${path.join(Globals.configurationRoot, "{KEYNAME}{SUFFIX}").replace("{KEYNAME}", OpenSSL.keyName)}"`;

        switch (platform()) {
            case "linux":
                this.generateSSLConfiguration();
                await this.generateSSLCertLinux(password, keyPairPath);

                break;
            case "win32":
                await this.generateSSLCertWin(password, keyPairPath);
                break;
        }
        /**
         * https://www.namecheap.com/support/knowledgebTestkeyase/article.aspx/10161/14/generating-a-csr-on-windows-using-openssl/
         * https://dev.to/openlab/creating-opensslconf-for-windows-104g
        
        */

    }

    private static async generateSSLCertLinux(password: string, keyPairPath: string) {
        const linuxDistro = Globals.fs.readFileSync("/etc/lsb-release", "utf-8")
            .split("\n")
            .filter((i: string) => i.startsWith("DISTRIB_ID="))
            .map((i: string) => i.replace("DISTRIB_ID=", ""))[0];
        if (linuxDistro === undefined) throw new Error("Failed to fetch linux distribution...");

        const commandStack: string[] = [];
        switch (linuxDistro) {
            case "Ubuntu":
            case "LinuxMint":
                if ((await this.consoleCommand("sudo apt list --installed | grep ^openssl")).length == 0)
                    commandStack.unshift(...["sudo apt-get update", "sudo apt-get install openssl -y"]);


                // Install required packages.
                commandStack.push(...[
                    `openssl genrsa -des3 -passout pass:${password} -out ${keyPairPath.replace("{SUFFIX}", ".key")} 2048`,
                    `openssl rsa -passin pass:${password} -in ${keyPairPath.replace("{SUFFIX}", ".key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.key")}`,
                    `openssl req -newkey rsa:2048 -nodes -keyout ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.csr")} `,
                    `openssl x509 -req -days 365 -in ${keyPairPath.replace("{SUFFIX}", "_private.csr")} -signkey ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.crt")}`
                ]);
                break;
        }

        if (commandStack.length > 0) {
            await this.consoleCommand(...commandStack);
        }
    }

    private static async generateSSLCertWin(password: string, keyPairPath: string) {
        const instructions: string[] = [
            `{OPENSSL} genrsa -des3 -passout pass:${password} -out ${keyPairPath.replace("{SUFFIX}", ".key")} 2048`,
            `{OPENSSL} rsa -passin pass:${password} -in ${keyPairPath.replace("{SUFFIX}", ".key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.key")}`,
            `{OPENSSL} req -newkey rsa:2048 -nodes -keyout ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.csr")} ` + (platform() == "win32" ? `-config ${this.getOpenSSLConfigPath()}` : ""),
            `{OPENSSL} x509 -req -days 365 -in ${keyPairPath.replace("{SUFFIX}", "_private.csr")} -signkey ${keyPairPath.replace("{SUFFIX}", "_private.key")} -out ${keyPairPath.replace("{SUFFIX}", "_private.crt")}`
        ]

        let openssl: string = await this.getOpenSSLBinary();

        await this.consoleCommand(...instructions.map(i => i.replace("{OPENSSL}", openssl)));
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

    public static generateSSLConfiguration(config: ISSLConfiguration = new DefaultSSLConfiguration()): void 
    {
        const configMap: {[key:string]:any} = Object.assign({}, config);
        let template: string =  DefaultSSLConfiguration.templateString;

        for(const key in configMap)
            template = template.replace(`{${key.toUpperCase()}}`, configMap[key]);

        Globals.fs.writeFileSync(path.join(config.dir, "openssl.cnf"), template);

    }

    private static readonly consoleCommand = (...commands: string[]): Promise < string[] > =>
        new Promise((resolve, reject) => {
            if (commands.length >= 1) {
                const output: string[] = [];
                Logger.logMessage("Executing shell command: " + commands[0]);
                const proc: ChildProcess = spawn(commands[0], [], {
                    shell: true
                });
                proc.stdout?.on("data", (data: any) => output.push(...(data.toString("utf8").split("\n"))));
                proc.on("error", (ex) => reject(ex));


                proc.on("exit", commands.length > 1 ? async () => {
                    commands.shift();
                    await OpenSSL.consoleCommand(...commands);
                }: () => resolve(output.filter(i => i.length > 0)));
            } else resolve([]);
        });

    private static getOpenSSLConfigPath(): string {
        const sslRoot = Globals.configurationRoot;

        const sslBinaryPaths: string[] = [];
        Globals.fileSystem.recurseSync(sslRoot, (filepath: string, relative: string, filename: string) => {
            if (filepath.match(/openssl.cnf$/))
                sslBinaryPaths.push(filepath);
        });
        return sslBinaryPaths[0];
    }

    private static getOpenSSLBinary(): Promise < string > {
        return new Promise < string > (async (resolve, reject) => {
            switch (platform()) {
                case "win32":
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
                    break;

                case "linux":
                    if (process.getuid() !== 0)
                        reject(new Error("Elevated user permissions required"));
                    else {
                        // Breaks code currently need to look into
                        //await this.consoleCommand("sudo apt-get install openssl -y");
                        resolve("openssl");
                    }
                    break;
            }
        })
    }
}