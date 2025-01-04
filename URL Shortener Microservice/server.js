require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');
const { hostname } = require('os');

app.use(bodyParser.urlencoded({ extended: false }));

const urlDatabase = new Map();
let counter = 1;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
    const originalUrl = req.body.url;
    try {
        const parsedUrl = new URL(originalUrl);
        dns.lookup(parsedUrl.hostname, (err) => {
            if (err) res.json({ error: 'Invalid URL' });
            else {
                urlDatabase.set(counter, originalUrl);
                res.json({
                    original_url: originalUrl,
                    short_url: counter,
                });
                counter++;
            }
        });
    } catch (error) {
        res.json({ error: 'Invalid URL' });
    }
});

app.get('/api/shorturl/:short_url', (req, res) => {
    const shortUrl = parseInt(req.params.short_url);
    const originalUrl = urlDatabase.get(shortUrl);
    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).json({ error: 'No short URL found for the given input' });
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});