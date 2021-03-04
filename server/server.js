require('dotenv').config();

const { dummyData } = require('./utils/dummyData');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const SmartyStreetsSDK = require('smartystreets-javascript-sdk');
const SmartyStreetsCore = SmartyStreetsSDK.core;
const Lookup = SmartyStreetsSDK.usStreet.Lookup;

let authId = process.env.AUTH_ID;
let authToken = process.env.AUTH_TOKEN;
const credentials = new SmartyStreetsCore.StaticCredentials(authId, authToken);

let client = SmartyStreetsCore.buildClient.usStreet(credentials);

// let whitelist = ['http://localhost:3000'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.options('/', cors(corsOptions));
app.options('*', cors());

app.get('/', async (req, res) => {
   res.send('Server running...');
});

// cors() passed as middleware does not fix cors error
// app.post('/', cors(corsOptions), (req, res) => {
//   console.log(req.body);
//   res.send('POST request to proxy');
// });

// Backend validation could happen here.
app.post('/', async (req, res) => {
  const body = req.body;

  try {
    // Trimming whitespace would be extra protection against search issues in the API by adding consistency in the data sent.
    for (const prop in body) {
      if (body.hasOwnProperty(prop)) {
        body[prop] = body[prop].trim();
      }
    }

    const { street, city, state, zipcode, secondary } = body;

    let lookup = new Lookup();
    lookup.street = street;
    lookup.city = city;
    lookup.state = state;
    lookup.zipCode = zipcode;
    secondary ? lookup.secondary : null;

    const data = await client.send(lookup);
    const results = data.lookups[0].result;

    res.send(results);

    // Dummy data to save on API requests and simulate time to fetch data.
    // setTimeout(() => {
    //   res.send(dummyData);
    //   // res.send([]);
    //   // res.send({some: 123});
    // }, 3000);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
