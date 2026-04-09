import { ports } from "./modules/ports";
const portsIns = new ports();

async function main() {
    const openPorts = await portsIns.getOpenPortsLinux();
    console.log(openPorts);
}

main();