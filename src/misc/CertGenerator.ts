import { platform } from "os";
import { spawn, ChildProcess } from 'child_process';
import { Globals } from './Globals';
import path from "path";

export class CertGenerator 
{
    public static async generateSSLCertificate(domain: string)
    {
        const password: string = "Testkey"; // Globals.rlSync.question("Enter a key");
        const keyPairPath: string = path.join(Globals.configurationRoot, "keypair.key");
        const keyPairPrivPath: string = path.join(Globals.configurationRoot, "keypairPriv.key");

        try
        {
            await Promise.all([
                this.generateKeyPair(password, keyPairPath),
                this.extractPrivateKey(password, keyPairPath, keyPairPrivPath),
                this.generateCsr(keyPairPrivPath),
                this.generateCertificate(keyPairPrivPath)
            ]);
        } catch(ex)
        {
            console.log("Error durring certificate generation...");
            console.log(ex);
        }
    }

    private static readonly consoleCommand = (command: string): Promise<void> =>
        new Promise((resolve, reject) => 
        { 
            const proc: ChildProcess = spawn(command, [], { shell: true, stdio: 'inherit' });

            proc.on("close", (c) => resolve());
            proc.on("error", (ex) => reject(ex));
        });

    private static generateKeyPair(password: string, path: string): Promise<void>
    {
        const command = platform() == "linux" ? `openssl genrsa -des3 -passout pass:${password} -out ${path} 2048` : "";
        return this.consoleCommand(command);
    }

    private static extractPrivateKey(password: string, inputPath: string, outputPath: string): Promise<void>
    {
        return this.consoleCommand(`openssl rsa -passin pass:${password} -in "${inputPath}" -out "${outputPath}" -y`);
    }

    private static generateCsr(privateKeyPath: string): Promise<void>
    {
        return this.consoleCommand(`openssl req -new -key ${privateKeyPath} -out ${privateKeyPath.replace(/key$/g, "csr")}`);
    }

    private static generateCertificate(privateKeyPath: string): Promise<void>
    {
        return this.consoleCommand(`openssl x509 -req -days 365 -in ${privateKeyPath.replace(/key$/g, "csr")} -signkey ${privateKeyPath} -out ${privateKeyPath.replace(/key$/g, "crt")}`)
    }

}