require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({ extended: false }));
const URL = require('url').URL;
// Your first API endpoint

const database = {}

app.post('/api/shorturl', function(req, res, next){
  const originalURL = req.body.url;
  const urlObject = new URL(originalURL);
dns.lookup(urlObject.hostname, (err, address, family) => {
  if (err) {
    res.json({error: 'invalid url'})
    
  } else {
    const shortUrl = Math.ceil(Math.random()*10000);
    database[shortUrl] = originalURL;
    res.json({ original_url : urlObject, short_url : shortUrl})
  }
});
 
});
app.get('/api/shorturl/:short', function(req,res){
  const short = req.params.short;
  const original = database[short];
  if(original){
    res.redirect(original);
  }else {
    res.json({ error: 'No short URL found for given input' });
  }
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
