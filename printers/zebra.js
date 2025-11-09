const net = require('net');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

async function printZebra(content) {
  const host = process.env.ZEBRA_HOST;
  const port = parseInt(process.env.ZEBRA_PORT || '9100', 10);

  // لو فيه إعدادات شبكة نستخدم ZPL عبر TCP
  if (host) {
    const zpl = `^XA\n^CF0,40\n^FO50,50^BY2\n^BCN,120,Y,N,N\n^FD${content}^FS\n^FO50,190^A0N,28,28^FD${content}^FS\n^XZ\n`;
    await new Promise((resolve, reject) => {
      const client = new net.Socket();
      client.connect(port, host, () => {
        client.write(zpl);
        client.end();
      });
      client.on('error', (err) => {
        reject(new Error(`فشل الاتصال بالطابعة Zebra على ${host}:${port} — ${err.message}`));
      });
      client.on('close', () => {
        console.log(`Zebra print sent to ${host}:${port}`);
        resolve();
      });
    });
    return { success: true, message: 'Printed to Zebra successfully (Network).' };
  }

  // بدون إعدادات شبكة: اطبع مباشرة عبر USB
  await new Promise((resolve, reject) => {
    try {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);
      device.open((err) => {
        if (err) return reject(new Error(`فشل فتح اتصال USB للطابعة: ${err.message || err}`));
        try {
          printer.text(content).cut().close();
          console.log('تم إرسال أمر الطباعة لطابعة Zebra عبر USB');
          resolve();
        } catch (e) {
          reject(new Error(`خطأ أثناء الطباعة: ${e.message || e}`));
        }
      });
    } catch (e) {
      reject(new Error(`تعذر تهيئة الطابعة عبر USB: ${e.message || e}`));
    }
  });
  return { success: true, message: 'Printed to Zebra successfully (USB).' };
}

module.exports = { printZebra };
