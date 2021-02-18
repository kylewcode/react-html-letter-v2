require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('GET request to proxy');
});

app.post('/', (req, res) => {
  res.send('POST request to proxy');
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

console.log(`Backend en var is ${process.env.TEST}`);
