require("dotenv").config();

const { dummyData } = require("./utils/dummyData");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

const SmartyStreetsSDK = require("smartystreets-javascript-sdk");
const SmartyStreetsCore = SmartyStreetsSDK.core;
const Lookup = SmartyStreetsSDK.usStreet.Lookup;

let authId = process.env.AUTH_ID;
let authToken = process.env.AUTH_TOKEN;
const credentials = new SmartyStreetsCore.StaticCredentials(authId, authToken);

let client = SmartyStreetsCore.buildClient.usStreet(credentials);

// Needed to run production app where frontend is hosted on netlify
const corsOptions = {
  origin: "https://formal-letter-generator.netlify.app",
  optionsSuccessStatus: 200,
};

// Needed to run app on local development
// const corsOptions = {
//   origin: "http://localhost:3000",
//   optionsSuccessStatus: 200,
// };

app.options("/", cors(corsOptions));

app.get("/", cors(), async (req, res) => {
  res.send("Server running...");
});

// Backend validation could happen here.
app.post("/", cors(corsOptions), async (req, res) => {
  const body = req.body;

  try {
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
    //   // res.send({ some: 123 });
    // }, 3000);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
