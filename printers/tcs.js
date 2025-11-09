const escpos = require('escpos');
escpos.USB = require('escpos-usb');

async function printTCS(content) {
  // Test بدون طابعة فعلية
  console.log('TCS Printer Test:', content);

  // لو عندك طابعة فعلية:
  // const device = new escpos.USB();
  // const printer = new escpos.Printer(device);
  // device.open(() => {
  //   printer.text(content).cut().close();
  // });
}

module.exports = { printTCS };
