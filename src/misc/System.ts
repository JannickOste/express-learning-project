import { ChildProcess, spawn } from 'child_process';
import { platform } from 'os';
import { Globals } from './Globals';
import { Logger } from './Logger';

export class System 
{
    public static get packageManager(): string | undefined
    {
        if(platform() == "linux")
        {
            const release = this.releaseInfoPath;
            const packageManager = [ 
                ["/etc/redhat-release", "yum"], 
                ["/etc/arch-release", "pacman"], 
                ["/etc/gentoo-release", "emerge"],
                ["/etc/SuSE-release", "zypp"], 
                ["/etc/debian_version", "apt-get"], 
                ["/etc/alpine-release", "apk"]
            ].filter(p => p[0] == release);
            
            if(packageManager.length)
                return packageManager[0][1];
        }

        return undefined;
    }

    public static get releaseInfoPath(): string | undefined
    {
        switch(platform())
        {
            case "linux":
                return [ 
                    "/etc/redhat-release", 
                    "/etc/arch-release", 
                    "/etc/gentoo-release",
                    "/etc/SuSE-release", 
                    "/etc/debian_version", 
                    "/etc/alpine-release",
                ].filter(i => Globals.fs.existsSync(i))[0];

            default: return undefined;
        }
    }

    public static get distribution(): string | undefined
    {
        switch(platform())
        {
            case "linux": return Globals.fs.readFileSync("/etc/lsb-release" , "utf-8")
                                    .split("\n")
                                    .filter((i: string) => i.startsWith("DISTRIB_ID="))
                                    .map((i: string) => i.replace("DISTRIB_ID=", ""))[0];

            default: return undefined;
        }
    }


    public static readonly shellCommand = (... commands: string[] ): Promise<string[]> =>
        new Promise((resolve, reject) => 
        { 
            if(commands.length >= 1)
            {
                const output: string[] = [];
                Logger.logMessage("Executing shell command: "+commands[0]);
                const proc: ChildProcess = spawn(commands[0], [], { shell: true });

                proc.stdout?.on("data", (data: any) => output.push(...(data.toString("utf8").split("\n"))));
                proc.on("error", (ex) => reject(ex)); //todo add error funnel

                // Handle processes synchronous. 
                proc.on("exit", commands.length > 1 ? async() => {
                    commands.shift();
                    await System.shellCommand(...commands);
                } : () => resolve(output.filter(i => i.length > 0)));
            } else resolve([]);
        });

}