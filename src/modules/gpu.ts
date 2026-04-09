import {exec} from 'child_process';
import {promisify} from 'util';

const execPromis = promisify(exec);

export class GPU {
    public async getGPUInfoLinux (): Promise<Record<string, string>> {
        const { stdout } = await execPromis('lshw -C display -json');
        return JSON.parse(stdout);
    };

    //#TODO add this stupid codeblock for getting GPU usage in AMD, NVIDIA and INTEL cards, maybe use some library for that, idk
};