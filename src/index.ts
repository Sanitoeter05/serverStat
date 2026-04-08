import { Disk } from "./modules/disk";

const diskIns = new Disk();

async function main() {
    const disks = await diskIns.getDisksLinux();
    console.log(disks);
}

main();