import {exec} from 'child_process';
import {promisify} from 'util';

const execPromis = promisify(exec);


export class Disk {
    public async getDisksLinux (): Promise<Record<string, string[]>> {
        const {stdout} = await execPromis('lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,ID,STATE, -J');
        const data = JSON.parse(stdout);
        const disks: Record<string, string[]> = {};
        data.blockdevices.forEach((device: any) => {
            if (device.type === 'disk') {
                disks[device.name] = [device.size, device.mountpoint || 'Not Mounted or MainPartition'
                ];
            }
        });
        return disks;
    };
};