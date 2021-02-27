import axios from "axios";
import React, { Fragment, useState } from "react";
import { stateList } from "./utils/stateList";
import Modal from "./Modal";
import Display from "./Display";
import Spinner from "./Spinner";
import "./App.css";

// The purpose of this component is to maintain the global state and determine the rendering of all other components.
function App() {
  const statesJSX = [];
  for (const [index, value] of stateList.entries()) {
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
    title: "",
    status: "fillingOutForm",
  };

  const [state, setState] = useState(() => initState);
  const [responseData, setResponseData] = useState(() => null);

  function setStateByObject(object) {
    setState({ ...state, ...object });
  }

  function setStateByKeyValue(key, value) {
    setState({ ...state, [key]: value });
  }

  async function handleSubmit(e) {
    // Purpose #1 Submit form data to API request
    e.preventDefault();

    setStateByKeyValue("status", "validatingData");

    // Front end handles validation and all form inputs except apt/suite are required
    const requestBody = {
      street: state.street,
      city: state.city,
      state: state.stateName,
      zipcode: state.zipcode,
    };

    if (state.aptSuite) requestBody.secondary = state.aptSuite;

    const dataValidated = await requestData(requestBody);

    // Purpose#2 Update the state to trigger Modal render with trimmed whitespace data otherwise the rendered letter will be formatted incorrectly. I don't currently know how I would keep onSubmit to a single purpose.
    const inputs = e.target.elements;
    const newState = trimTextInputs(inputs);

    // Modal needs to be displayed after form is submitted. After the modal appears the user should be able to close out the modal and return to the form if the data is invalid.
    if (dataValidated) newState.status = "formSubmitted";
    setStateByObject(newState);
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

  /* Address Validation */
  async function requestData(body) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // What backound route would I be posting to with Heroku?
      const res = await axios.post("http://localhost:5000", body, config);

      // Validate data
      const isValidated = validateData(res.data);

      // Because of how the data from the request is scoped here and invoked in handleSubmit, React state is the only option I can think of that can pass the data to the Modal component in the App render.
      if (isValidated) {
        setResponseData(res.data);
        return true;
      } else {
        setResponseData(null);
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function validateData(data) {
    if (Array.isArray(data) && data.length === 0) {
      window.alert(
        "You entered an invalid address. Please enter your address and submit the form again."
      );
      return false;
    }

    if (!Array.isArray(data)) {
      window.alert(
        "There has been a system error. Please try again at a later time."
      );
      return false;
    }
    return true;
  }

  const formElement = (
    <div className="user-inputs">
      <h1>Formal Letter Generator</h1>
      <p className="required-field">All fields required except Apt/Suite #</p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <ul>
          <li className="bg-bright">
            <label htmlFor="user-first-name">First name</label>
            <input
              type="text"
              name="firstName"
              id="user-first-name"
              value={state.firstName}
              required
              onChange={(e) => {
                const key = e.target.name;
                const value = e.target.value;
                setStateByKeyValue(key, value);
              }}
            />
          </li>
          <li className="bg-bright">
            <label htmlFor="user-last-name">Last name</label>
            <input
              type="text"
              name="lastName"
              id="user-last-name"
              value={state.lastName}
              required
              onChange={(e) => {
                const key = e.target.name;
                const value = e.target.value;
                setStateByKeyValue(key, value);
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
                    setStateByKeyValue(key, value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="user-apt-suite">Apt/Suite</label>
                <input
                  type="text"
                  name="aptSuite"
                  id="user-apt-suite"
                  value={state.aptSuite}
                  onChange={(e) => {
                    const key = e.target.name;
                    const value = e.target.value;
                    setStateByKeyValue(key, value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="user-city">City</label>
                <input
                  type="text"
                  name="city"
                  id="user-city"
                  value={state.city}
                  required
                  onChange={(e) => {
                    const key = e.target.name;
                    const value = e.target.value;
                    setStateByKeyValue(key, value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="state-select">State</label>
                <select
                  name="stateName"
                  id="state-select"
                  required
                  onChange={(e) => {
                    const key = e.currentTarget.name;
                    const value = e.currentTarget.value;
                    setStateByKeyValue(key, value);
                  }}
                >
                  <option>Select state</option>
                  {statesJSX}
                </select>
              </div>
              <div>
                <label htmlFor="user-zipcode">Zipcode</label>
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
                    setStateByKeyValue(key, value);
                  }}
                />
              </div>
            </fieldset>
          </li>
          <li className="bg-bright">
            <label htmlFor="date-input">Date</label>
            <input
              type="date"
              name="date"
              id="date-input"
              value={state.date}
              required
              onChange={(e) => {
                const key = e.target.name;
                const value = e.target.value;
                setStateByKeyValue(key, value);
              }}
            />
          </li>
          <li className="bg-light">
            <label htmlFor="user-title">What's your title?</label>
            <div>
              <input
                type="text"
                name="title"
                id="user-title"
                value={state.title}
                placeholder="Mr, Mrs, Ms, etc..."
                required
                onChange={(e) => {
                  const key = e.target.name;
                  const value = e.target.value;
                  setStateByKeyValue(key, value);
                }}
              />
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
      {state.status === "validatingData" ? (
        <Fragment>
          <div className="modal">
            <div className="modal-content">
              <Spinner>Confirming address...</Spinner>
            </div>
          </div>
          {formElement}
        </Fragment>
      ) : null}
      {state.status === "formSubmitted" ? (
        <Fragment>
          <Modal
            addressData={responseData}
            callParentState={(data) => setStateByObject(data)}
          />
          {formElement}
        </Fragment>
      ) : null}
      {state.status === "formConfirmed" ? (
        <Display
          formData={state}
          callParentState={(key, value) => setStateByKeyValue(key, value)}
        />
      ) : null}
    </div>
  );
}

export default App;
