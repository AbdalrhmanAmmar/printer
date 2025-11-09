require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { printZebra } = require('./printers/zebra');
const { printSato } = require('./printers/sato');
const { printTCS } = require('./printers/tcs');
const { printIntermec } = require('./printers/intermec');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Helper to generate a simple downloadable file content per printer type
function generateLabelFile(printerType, content) {
  let filename = `barcode_${printerType.toLowerCase()}.txt`;
  let data = '';
  switch (printerType) {
    case 'Zebra':
      // Minimal ZPL for CODE128 barcode
      filename = 'zebra_label.zpl';
      data = `^XA\n^CF0,40\n^FO50,50^BY2\n^BCN,120,Y,N,N\n^FD${content}^FS\n^XZ\n`;
      break;
    case 'Sato':
      // Placeholder SBPL-style content for SATO. Replace with real commands when available.
      filename = 'sato_label.txt';
      data = `Sato Printer Test:\n${content}\n`;
      break;
    case 'TCS':
      // ESC/POS-style placeholder content. Replace with real commands if needed.
      filename = 'tcs_label.txt';
      data = `TCS (ESC/POS) Printer Test:\n${content}\n`;
      break;
    case 'Intermec':
      // Intermec IPL placeholder content
      filename = 'intermec_label.txt';
      data = `Intermec Printer Test:\n${content}\n`;
      break;
    default:
      data = `Unknown printer type: ${printerType}\n${content}\n`;
  }
  return { filename, data, mimeType: 'text/plain' };
}

app.post('/print', async (req, res) => {
  const { printerType, content } = req.body;

  try {
    switch (printerType) {
      case 'Zebra':
        await printZebra(content);
        break;
      case 'Sato':
        await printSato(content);
        break;
      case 'TCS':
        await printTCS(content);
        break;
      case 'Intermec':
        await printIntermec(content);
        break;
      default:
        return res.status(400).json({ message: 'Unknown printer type' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate and return downloadable label file content (no writing to disk)
app.post('/generate', (req, res) => {
  const { printerType, content } = req.body;
  if (!printerType || typeof content !== 'string') {
    return res.status(400).json({ success: false, error: 'printerType and content are required' });
  }
  try {
    const file = generateLabelFile(printerType, content);
    res.json({ success: true, ...file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve test page to quickly verify printing from the browser
app.get('/test', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
