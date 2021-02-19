require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

let whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.options('/', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
  res.send('GET request to proxy');
});

// cors() passed as middleware does not fix cors error
app.post('/', cors(corsOptions), (req, res) => {
  console.log(req.body);
  res.send('POST request to proxy');
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

console.log(`Backend en var is ${process.env.TEST}`);
