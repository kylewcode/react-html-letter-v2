import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Display from "./Display";
import "./App.css";

function App() {
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const statesJSX = [];
  for (const [index, value] of states.entries()) {
    statesJSX.push(
      <option key={index} value={value}>
        {value}
      </option>
    );
  }

  const initState = {
    firstName: "",
    lastName: "",
    streetNumber: "",
    streetName: "",
    aptSuite: "",
    city: "",
    stateName: "",
    zipcode: "",
    date: "",
    isFemale: false,
    isMarried: false,
    status: "fillingOutForm",
    dataStore: {},
  };

  const [state, setState] = useState(() => initState);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Sending request...");
    // Make sure to trim() the whitespace from the inputs before inserting into the url
    const requestUrl = `${baseUrl}${state.streetNumber}%20${state.streetName}%20${state.stateName},%20${state.city}`;
    createRequest(requestUrl);
  }

  /* Address Validation */

  const baseUrl = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSSTACK_APIKEY}&query=`;

  // Server Request (This is going to be refactor as an async/await)
  const updateUISuccess = function (response) {
    const data = JSON.parse(response).data;
    setState({ ...state, dataStore: data, status: "formSubmitted" });
  };

  const updateUIError = function (error) {
    console.log(error);
  };

  const responseMethod = function (httpRequest) {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        updateUISuccess(httpRequest.responseText);
      } else {
        updateUIError(httpRequest.status + ": " + httpRequest.responseText);
      }
    }
  };

  const createRequest = function (url) {
    const httpRequest = new XMLHttpRequest(url);
    httpRequest.addEventListener("readystatechange", () => {
      responseMethod(httpRequest);
    });
    httpRequest.open("GET", url);
    httpRequest.send();
  };

  const formElement = (
    <div className="user-inputs">
      <h1>Formal Letter Generator</h1>
      <p className="required-field">All fields required except Apt/Suite #</p>
      <form onSubmit={handleSubmit}>
        <ul>
          <li className="bg-bright">
            <label htmlFor="user-first-name">Enter your first name</label>
            <input
              type="text"
              name="first-name"
              id="user-first-name"
              value={state.firstName}
              required
              onChange={(e) =>
                setState({ ...state, firstName: e.target.value })
              }
            />
          </li>
          <li className="bg-bright">
            <label htmlFor="user-last-name">Enter your last name</label>
            <input
              type="text"
              name="last-name"
              id="user-last-name"
              value={state.lastName}
              required
              onChange={(e) => setState({ ...state, lastName: e.target.value })}
            />
          </li>
          <li className="bg-light">
            <fieldset>
              <legend>Mailing address</legend>
              <div>
                <label htmlFor="user-street-number">Enter street number</label>
                <input
                  type="text"
                  name="street-number"
                  id="user-street-number"
                  value={state.streetNumber}
                  required
                  pattern="\d+"
                  onChange={(e) =>
                    setState({ ...state, streetNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="user-street-name">Enter street name</label>
                <input
                  type="text"
                  name="street-name"
                  id="user-street-name"
                  value={state.streetName}
                  required
                  onChange={(e) =>
                    setState({ ...state, streetName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="user-apt-suite">Enter Apt/Suite</label>
                <input
                  type="text"
                  name="apt-suite"
                  id="user-apt-suite"
                  value={state.aptSuite}
                  onChange={(e) =>
                    setState({ ...state, aptSuite: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="user-city">Enter city</label>
                <input
                  type="text"
                  name="city"
                  id="user-city"
                  value={state.city}
                  required
                  onChange={(e) => setState({ ...state, city: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="state-select">Select state</label>
                <select
                  name="state"
                  id="state-select"
                  required
                  onChange={(e) =>
                    setState({ ...state, stateName: e.currentTarget.value })
                  }
                >
                  <option>Select state</option>
                  {statesJSX}
                </select>
              </div>
              <div>
                <label htmlFor="user-zipcode">Enter zipcode</label>
                <input
                  type="text"
                  name="zipcode"
                  id="user-zipcode"
                  value={state.zipcode}
                  required
                  pattern="\d{5}"
                  onChange={(e) =>
                    setState({ ...state, zipcode: e.target.value })
                  }
                />
              </div>
            </fieldset>
          </li>
          <li className="bg-bright">
            <label htmlFor="date-input">Enter date</label>
            <input
              type="date"
              name="date"
              id="date-input"
              value={state.date}
              required
              onChange={(e) => setState({ ...state, date: e.target.value })}
            />
          </li>
          <li className="bg-light">
            <p>Select gender</p>
            <div>
              <input
                type="radio"
                name="gender"
                id="male"
                required
                onClick={(e) => setState({ ...state, isFemale: false })}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                name="gender"
                id="female"
                required
                onClick={(e) => setState({ ...state, isFemale: true })}
              />
              <label htmlFor="female">Female</label>
            </div>
          </li>
          <li className="bg-bright">
            <p>Are you married?</p>
            <div>
              <input
                type="radio"
                name="married"
                id="married-yes"
                required
                onClick={(e) => setState({ ...state, isMarried: true })}
              />
              <label htmlFor="married-yes">Yes</label>
            </div>
            <div>
              <input
                type="radio"
                name="married"
                id="married-no"
                required
                onClick={(e) => setState({ ...state, isMarried: false })}
              />
              <label htmlFor="married-no">No</label>
            </div>
          </li>
          <li>
            <input type="submit" value="Submit" />
          </li>
        </ul>
      </form>
    </div>
  );

  return (
    <div>
      {state.status === "fillingOutForm" ? formElement : null}
      {state.status === "formSubmitted" ? (
        <React.Fragment>
          <Modal modalState={state} modalSetState={setState} />
          {formElement}
        </React.Fragment>
      ) : null}
      {state.status === "formConfirmed" ? (
        <Display displayState={state} displaySetState={setState} />
      ) : null}
    </div>
  );
}

export default App;
