import axios from "axios";
import React, { useState } from "react";
import Modal from "./Modal";
import Display from "./Display";
import "./App.css";

function App() {
  // Consider storing these states as a module that gets imported. Purpose, improved navigation and readability.
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
    street: "",
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

    // Front end handles validation and all form inputs except apt/suite are required
    const requestBody = {
      street: state.street,
      city: state.city,
      state: state.stateName,
      zipcode: state.zipcode,
    };

    if (state.aptSuite) requestBody.secondary = state.aptSuite;

    // (The response should equal the address form input values in state)()
    requestData(requestBody);

    // I don't currently know how I would keep onSubmit to a single purpose.
    const inputs = e.target.elements;
    const trimmedText = trimTextInputs(inputs);

    setStateByObject(trimmedText);
  }

  function trimTextInputs(inputs) {
    let trimmed;
    let name;
    const result = {};
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].nodeName === "INPUT" && inputs[i].type === "text") {
        trimmed = inputs[i].value.trim();
        name = inputs[i].name;
      }
      // Object is needed in order to update state properly because the key/name matches the state prop.
      // Ex: name(firstName) state prop is firstName
      result[name] = trimmed;
    }
    return result;
  }

  function setStateByObject(object) {
    setState({ ...state, ...object });
  }

  function setStateByOnChange(key, value) {
    setState({ ...state, [key]: value });
  }

  /* Address Validation */
  async function requestData(body) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // What backound route would I be posting to with Heroku?
    const res = await axios.post("http://localhost:5000", body, config);
    console.log(res.data);
  }

  const formElement = (
    <div className="user-inputs">
      <h1>Formal Letter Generator</h1>
      <p className="required-field">All fields required except Apt/Suite #</p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <ul>
          <li className="bg-bright">
            <label htmlFor="user-first-name">Enter your first name</label>
            <input
              type="text"
              name="firstName"
              id="user-first-name"
              value={state.firstName}
              required
              onChange={(e) => {
                const key = e.target.name;
                const value = e.target.value;
                setStateByOnChange(key, value);
              }}
            />
          </li>
          <li className="bg-bright">
            <label htmlFor="user-last-name">Enter your last name</label>
            <input
              type="text"
              name="lastName"
              id="user-last-name"
              value={state.lastName}
              required
              onChange={(e) => {
                const key = e.target.name;
                const value = e.target.value;
                setStateByOnChange(key, value);
              }}
            />
          </li>
          <li className="bg-light">
            <fieldset>
              <legend>Mailing address</legend>
              <div>
                <label htmlFor="user-street">Street</label>
                <input
                  type="text"
                  name="street"
                  id="user-street"
                  value={state.street}
                  required
                  onChange={(e) => {
                    const key = e.target.name;
                    const value = e.target.value;
                    setStateByOnChange(key, value);
                  }}
                />
              </div>
              {/* <div>
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
              </div> */}
              <div>
                <label htmlFor="user-apt-suite">Enter Apt/Suite</label>
                <input
                  type="text"
                  name="aptSuite"
                  id="user-apt-suite"
                  value={state.aptSuite}
                  onChange={(e) => {
                    const key = e.target.name;
                    const value = e.target.value;
                    setStateByOnChange(key, value);
                  }}
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
                  onChange={(e) => {
                    const key = e.target.name;
                    const value = e.target.value;
                    setStateByOnChange(key, value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="state-select">Select state</label>
                <select
                  name="stateName"
                  id="state-select"
                  required
                  onChange={(e) => {
                    const key = e.currentTarget.name;
                    const value = e.currentTarget.value;
                    setStateByOnChange(key, value);
                  }}
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
                  onChange={(e) => {
                    const key = e.target.name;
                    const value = e.target.value;
                    setStateByOnChange(key, value);
                  }}
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
              onChange={(e) => {
                const key = e.target.name;
                const value = e.target.value;
                setStateByOnChange(key, value);
              }}
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
