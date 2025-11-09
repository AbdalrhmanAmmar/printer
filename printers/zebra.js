const net = require('net');

async function printZebra(content) {
  const host = process.env.ZEBRA_HOST;
  const port = parseInt(process.env.ZEBRA_PORT || '9100', 10);
  if (!host) {
    throw new Error('ZEBRA_HOST غير مضبوط. من فضلك ضع عنوان IP للطابعة في ملف .env');
  }
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
  return { success: true, message: 'Printed to Zebra successfully.' };
}

module.exports = { printZebra };
