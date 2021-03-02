import axios from "axios";
import React, { Fragment, useState } from "react";
import { stateList } from "./utils/stateList";
import Modal from "./Modal";
import Display from "./Display";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ModalContainer from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

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
  const [showInvalidError, setShowInvalidError] = useState(false);
  const [showSystemError, setShowSystemError] = useState(false);

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

    // Modal needs to be displayed after form is submitted.
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
      // If SmartyStreets gets an invalid address it sends back an empty array. This triggers an error to notify the user.
      setShowInvalidError(true);
      return false;
    }

    if (!Array.isArray(data)) {
      // This error is just in case the API sends data that's completely wrong and notifies user.
      setShowSystemError(true);
      return false;
    }
    return true;
  }

  const formElement = (
    <Fragment>
      <Row className="justify-content-center">
        <Col sm="auto">
          <h1 className="text-center">Formal Letter Generator</h1>
          <p className="text-center">All fields required except Apt/Suite #</p>
          {showSystemError ? (
            <Alert
              variant="danger"
              onClose={() => setShowSystemError(false)}
              dismissible
            >
              <p>
                There has been a system error. Please try again at a later time.
              </p>
            </Alert>
          ) : null}
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col sm="auto">
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Row>
              <Col sm="auto">
                <Form.Group>
                  <Form.Label htmlFor="user-first-name">First name</Form.Label>
                  <Form.Control
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
                </Form.Group>
              </Col>
              <Col sm="auto">
                <Form.Group>
                  <Form.Label htmlFor="user-last-name">Last name</Form.Label>
                  <Form.Control
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
                </Form.Group>
              </Col>
            </Form.Row>

            <Row className="p-3 border border-1 my-3 shadow-sm rounded">
              <fieldset>
                <legend>Mailing address</legend>
                {showInvalidError ? (
                  <Alert
                    variant="danger"
                    onClose={() => setShowInvalidError(false)}
                    dismissible
                  >
                    <p>
                      You entered an invalid address. Please enter your address
                      and submit the form again.
                    </p>
                  </Alert>
                ) : null}
                <Form.Row>
                  <Form.Group as={Col} sm="6">
                    <Form.Label htmlFor="user-street">Street</Form.Label>
                    <Form.Control
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
                  </Form.Group>

                  <Form.Group as={Col} sm="2">
                    <Form.Label htmlFor="user-apt-suite">Apt/Suite</Form.Label>
                    <Form.Control
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
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} sm="auto">
                    <Form.Label htmlFor="user-city">City</Form.Label>
                    <Form.Control
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
                  </Form.Group>

                  <Form.Group as={Col} sm="auto">
                    <Form.Label htmlFor="state-select">State</Form.Label>
                    <Form.Control
                      as="select"
                      name="stateName"
                      id="state-select"
                      value={state.stateName}
                      required
                      onChange={(e) => {
                        const key = e.currentTarget.name;
                        const value = e.currentTarget.value;
                        setStateByKeyValue(key, value);
                      }}
                    >
                      <option>Select state</option>
                      {statesJSX}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} sm="2">
                    <Form.Label htmlFor="user-zipcode">Zipcode</Form.Label>
                    <Form.Control
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
                    <Form.Text>Zipcodes must be 5 numbers.</Form.Text>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} sm="auto">
                    <Form.Label htmlFor="date-input">Date</Form.Label>
                    <Form.Control
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
                  </Form.Group>
                </Form.Row>
              </fieldset>
            </Row>

            <Form.Row>
              <Form.Group as={Col} sm="auto">
                <Form.Label htmlFor="user-title">What's your title?</Form.Label>
                <Form.Control
                  htmlSize="1"
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
              </Form.Group>
            </Form.Row>

            <Form.Row
              as={Col}
              sm="auto"
              className="justify-content-center mb-3"
            >
              <Button variant="dark" type="submit" size="lg">
                Submit
              </Button>
            </Form.Row>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );

  return (
    <Container className="my-md-3 border bg-light shadow rounded">
      {state.status === "fillingOutForm" ? formElement : null}
      {state.status === "validatingData" ? (
        <Fragment>
          <ModalContainer
            backdrop="static"
            centered
            show={state.status === "validatingData"}
          >
            <ModalContainer.Header>
              <ModalContainer.Title>Confirming address...</ModalContainer.Title>
            </ModalContainer.Header>
            <ModalContainer.Body>
              <Spinner animation="border" role="status">
                <span className="sr-only">Confirming address...</span>
              </Spinner>
            </ModalContainer.Body>
          </ModalContainer>
          {formElement}
        </Fragment>
      ) : null}
      {state.status === "formSubmitted" ? (
        <Fragment>
          <ModalContainer
            backdrop="static"
            centered
            show={state.status === "formSubmitted"}
          >
            <ModalContainer.Body>
              <Modal
                addressData={responseData}
                callParentState={(data) => setStateByObject(data)}
              />
            </ModalContainer.Body>
          </ModalContainer>
          {formElement}
        </Fragment>
      ) : null}
      {state.status === "formConfirmed" ? (
        <Display
          formData={state}
          callParentState={(key, value) => setStateByKeyValue(key, value)}
        />
      ) : null}
    </Container>
  );
}

export default App;
