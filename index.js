const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('./uploads'));

app.get('/', (req, res) => {
  return res.json({ message: 'Hello world 🔥🇵🇹' });
});

app.post('/', upload.single('picture'), async (req, res) => {
  fs.access('./uploads', (error) => {
    if (error) {
      fs.mkdirSync('./uploads');
    }
  });
  const { buffer, originalname, size } = req.file;
  const timestamp = new Date().toISOString();
  const ref = `${timestamp}-${originalname}.webp`;
  const result = await sharp(buffer)
    .webp({ quality: 1 })
    .toFile('./uploads/' + ref);

  const link = `http://localhost:3000/${ref}`;
  return res.json({
    prevSize: size / 1024 / 1000,
    link,
    newSize: result.size / 1024 / 1000,
  });
});

app.listen(3000);
