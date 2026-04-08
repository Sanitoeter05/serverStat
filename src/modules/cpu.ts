import {exec} from 'child_process';
import {parseStringsToJson} from './parser';
import {promisify} from 'util';

const execPromis = promisify(exec);

export class CPU {
    public async getCpuInfoFromProcFileLinux(): Promise<Record<string, string[]> | null> {
        try {
            const {stdout, stderr} = await execPromis('cat /proc/cpuinfo');
            if (stderr) {
                console.error(`Error output: ${stderr}`);
                return null;
            }else if (!stdout) {
                console.warn('No output received from command.');
                return null;
            };

            const info: Record<string, string[]> = {};
            const lines = stdout.toString().split('\n');

            parseStringsToJson(lines, info);

            return info;
        } catch (error) {
            console.error(`Error executing command: ${error instanceof Error ? error.message : error}`);
            return null;
        }
    }

    public async getCpuUsageLinux(sampleIntervalMs: number = 100): Promise<number> {
        const readStatLine = async (): Promise<number[]> => {
            const {stdout} = await execPromis('cat /proc/stat');
            // First line: "cpu  user nice system idle iowait irq softirq steal guest guest_nice"
            const line = stdout.split('\n')[0];
            return line.split(/\s+/).slice(1).map(Number);
        };

        const [sample1] = await Promise.all([readStatLine()]);
        await new Promise<void>(resolve => setTimeout(resolve, sampleIntervalMs));
        const sample2 = await readStatLine();

        const total1 = sample1.reduce((a, b) => a + b, 0);
        const total2 = sample2.reduce((a, b) => a + b, 0);

        // idle is index 3, iowait is index 4 — both count as "not busy"
        const idle1 = sample1[3] + sample1[4];
        const idle2 = sample2[3] + sample2[4];

        const totalDiff = total2 - total1;
        const idleDiff = idle2 - idle1;

        if (totalDiff === 0) return 0;
        return ((totalDiff - idleDiff) / totalDiff) * 100;
    }
};

