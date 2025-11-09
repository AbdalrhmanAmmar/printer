const fs = require('fs');
const path = require('path');

async function printIntermec(content) {
  // تأكد من وجود مجلد الإخراج
  const dir = path.resolve(__dirname, '../test_output');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'intermec_output.txt');
  fs.writeFileSync(filePath, `Intermec Printer Test:\n${content}`);
  console.log('Intermec print simulated.');
}

module.exports = { printIntermec };
