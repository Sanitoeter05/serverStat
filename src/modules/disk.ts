import {exec} from 'child_process';
import {promisify} from 'util';

const execPromis = promisify(exec);


export class Disk {
    public async getDisksLinux (): Promise<Record<string, string[]>> {
        const {stdout} = await execPromis('lsblk -o NAME,SIZE,TYPE,ID,STATE -J');
        const data = JSON.parse(stdout);
        const disks: Record<string, string[]> = {};
        data.blockdevices.forEach((device: any) => {
            if (device.type === 'disk') {
                disks[device.name] = [device.size, device.state || 'Unknown State', device.id || 'No ID'];
            }
        });
        return disks;
    };

    public async getDiskFileSystemsLinux (diskName: string): Promise<Record<string, {fstype: string | null, fsused: string | null, fssize: string | null} >> {
        const {stdout} = await execPromis(`lsblk /dev/${diskName} -o NAME,TYPE,FSTYPE,FSUSED,FSSIZE -J`);
        const data = JSON.parse(stdout);
        const fileSystems: Record<string, {fstype: string | null, fsused: string | null, fssize: string | null}> = {};
        
        data.blockdevices.forEach((device: any) => {
            if (device.type === 'disk' && device.children) {
                device.children.forEach((partition: any) => {
                    fileSystems[partition.name] = {
                        fstype: partition.fstype || null,
                        fsused: partition.fsused || null,
                        fssize: partition.fssize || null
                    };
                });
            }
        });
        
        return fileSystems;
    };
};