require('dotenv').config();

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

let lookup = new Lookup();

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

// app.get('/', cors(corsOptions), (req, res) => {
//   res.send('GET request to proxy');
// });
app.get('/', (req, res) => {
  res.send('GET request to proxy');
});

// cors() passed as middleware does not fix cors error
// app.post('/', cors(corsOptions), (req, res) => {
//   console.log(req.body);
//   res.send('POST request to proxy');
// });
app.post('/', async (req, res) => {
  // Now I need to make a request to SmartyStreets. Can I invoke a request within a request?
  try {
    // const { streetNumber, streetName, city, stateName } = req.body;
    // lookup.street = streetNumber + ' ' + streetName;
    // lookup.city = city;
    // lookup.state = stateName;

    // const data = await client.send(lookup);
    // const results = data.lookups[0].result;

    // res.send(results);

    // Dummy data to save on API requests
    dummyData = [
      {
        inputIndex: 0,
        candidateIndex: 0,
        deliveryLine1: '10308 Kennebec Ct',
        lastLine: 'Orlando FL 32817-4801',
        deliveryPointBarcode: '328174801088',
        components: {
          primaryNumber: '10308',
          streetName: 'Kennebec',
          streetSuffix: 'Ct',
          cityName: 'Orlando',
          defaultCityName: 'Orlando',
          state: 'FL',
          zipCode: '32817',
          plus4Code: '4801',
          deliveryPoint: '08',
          deliveryPointCheckDigit: '8',
        },
        metadata: {
          recordType: 'S',
          zipType: 'Standard',
          countyFips: '12095',
          countyName: 'Orange',
          carrierRoute: 'C020',
          congressionalDistrict: '07',
          rdi: 'Residential',
          elotSequence: '0147',
          elotSort: 'A',
          latitude: 28.57544,
          longitude: -81.23714,
          precision: 'Zip9',
          timeZone: 'Eastern',
          utcOffset: -5,
          obeysDst: true,
        },
        analysis: {
          dpvMatchCode: 'Y',
          dpvFootnotes: 'AABB',
          cmra: 'N',
          vacant: 'N',
          active: 'Y',
        },
      },
    ];

    res.send(dummyData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
