import {exec} from 'child_process';
import {promisify} from 'util';
import { parseStringsToJson } from './parser';

const execPromis = promisify(exec);

export class memory {
    public async getMemoryInfoLinux(): Promise<Record<string, string[]> | void> {
        const {stdout} = await execPromis('cat /proc/meminfo');
        const info: Record<string, string[]> = {};
        const lines = stdout.toString().split('\n');
        parseStringsToJson(lines, info);
        return info;
    };

    public async getFreeMemoryLinux(): Promise<number> {
        const {stdout}=await execPromis('grep MemFree /proc/meminfo');
        const info: Record<string, string[]> = {};
        const lines = stdout.toString().split('\n');
        parseStringsToJson(lines, info);
        return parseInt(info['MemFree'][0], 10); // Convert from kB to MB
    };
    public async getUsedMemoryLinux(): Promise<number> {
        let {stdout}=await execPromis('grep -E "MemAvailable|MemTotal" /proc/meminfo');
        let info: Record<string, string[]> = {};
        let lines = stdout.toString().split('\n');
        parseStringsToJson(lines, info);
        
        return (parseInt(info['MemTotal'][0], 10) - parseInt(info['MemAvailable'][0], 10)); // Convert from kB to MB
    };
};