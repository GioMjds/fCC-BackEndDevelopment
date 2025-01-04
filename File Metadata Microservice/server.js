require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('express-fileupload');

app.use(multer());
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res) => {
    if (!req.files || !req.files.upfile) return res.status(400).json({ error: "No file uploaded" })

    const file = req.files.upfile;
    res.json({
        name: file.name,
        type: file.mimetype,
        size: file.size
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
