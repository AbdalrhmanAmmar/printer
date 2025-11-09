const fs = require('fs');
const path = require('path');

async function printSato(content) {
  // تأكد من وجود مجلد الإخراج
  const dir = path.resolve(__dirname, '../test_output');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'sato_output.txt');
  fs.writeFileSync(filePath, `Sato Printer Test:\n${content}`);
  console.log('Sato print simulated.');
}

module.exports = { printSato };
