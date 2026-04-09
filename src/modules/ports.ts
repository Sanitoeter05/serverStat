import {exec} from 'child_process';
import {promisify} from 'util';
import { parseStringsToJson } from './parser';
const execPromis = promisify(exec);


//#TODO : Fix parsing for ports with cleaning the wihtespace and converting this to JSON
export class ports{
    public async getOpenPortsLinux () {
        const {stdout} = await execPromis('ss -l | grep "LISTEN" | grep -v "* 0"');
        const lines = stdout.trim().split('\n');
        const ports: Record<string, string[]> = {};
        parseStringsToJson(lines, ports);
        return ports;
    }
};