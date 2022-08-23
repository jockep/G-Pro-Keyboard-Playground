import { devices, HID } from "node-hid";

class LogitechGPro {
    private device: HID;
    private package: Buffer = Buffer.alloc(20, 0x00);

    constructor() {
        const filterKeyboard = devices().filter(device => device.vendorId === 0x046d && device.productId === 0xc339 && device.usagePage === 65347);

        if (filterKeyboard.length === 0 || filterKeyboard[0].path === undefined) {
            throw new Error('Logitech G Pro keyboard found');
        }

        this.device = new HID(filterKeyboard[0].path);
        this.package[0] = 0x11;
        this.package[1] = 0xFF;
    }

    public async turnOffBacklight(): Promise<void> {
        const buffer: Buffer = this.package;

        //First payload
        buffer.writeUInt8(0x03, 2);
        buffer.writeUInt8(0x3B, 3);
        this.device.write(buffer);
        //Second payload
        buffer.writeUInt8(0x0F, 2);
        buffer.writeUInt8(0x2B, 3);
        this.device.write(buffer);
        //Third payload
        buffer.writeUInt8(0x03, 2);
        buffer.writeUInt8(0x1B, 3);
        this.device.write(buffer);
        //Fourth payload
        buffer.writeUInt8(0x0D, 2);
        buffer.writeUInt8(0x3B, 3);
        this.device.write(buffer);
        //Fifth payload
        buffer.writeUInt8(0x01, 4);
        this.device.write(buffer);
    }

    public async turnOnColorWave(): Promise<void> {
        let buffer: Buffer = this.package;

        //First payload
        buffer.writeUInt8(0x03, 2);
        buffer.writeUInt8(0x3F, 3);
        this.device.write(buffer);
        //Second payload
        buffer.writeUInt8(0x1F, 3);
        this.device.write(buffer);
        //Third payload
        buffer.writeUInt8(0x0D, 2);
        buffer.writeUInt8(0x3F, 3);
        buffer.writeUInt8(0x04, 5);
        buffer.writeUInt8(0x88, 12);
        buffer.writeUInt8(0x01, 13);
        buffer.writeUInt8(0x64, 14);
        buffer.writeUInt8(0x13, 15);
        this.device.write(buffer);
        //Fourth payload
        buffer.writeUInt8(0x01, 4);
        buffer.writeUInt8(0x03, 5);
        buffer.writeUInt8(0x13, 11);
        buffer.writeUInt8(0x88, 12);
        buffer.writeUInt8(0x64, 13);
        buffer.writeUInt8(0x00, 14);
        buffer.writeUInt8(0x00, 15);
        this.device.write(buffer);
        //Fifth payload
        buffer = this.package;
        buffer.writeUInt8(0x0F, 2);
        buffer.writeUInt8(0x2F, 3);
        this.device.write(buffer);
    }
}



async function main() {
    const logitech = new LogitechGPro();
    await logitech.turnOnColorWave();
    // await logitech.turnOffBacklight();
    // setTimeout(async () => {
    //     await logitech.turnOnColorWave();
    // }, 5000);
}

main();
