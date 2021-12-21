import axios from "axios";
import React, { Fragment, useState, useReducer } from "react";
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

  // const initState = {
  //   firstName: "",
  //   lastName: "",
  //   street: "",
  //   aptSuite: "",
  //   city: "",
  //   stateName: "",
  //   zipcode: "",
  //   date: "",
  //   title: "",
  //   status: "fillingOutForm",
  // };

  const initState = {
    firstName: "Kyle",
    lastName: "Williams",
    street: "10308 Kennebec CT",
    aptSuite: "",
    city: "Orlando",
    stateName: "Florida",
    zipcode: "32817",
    date: "2021-11-21",
    title: "Mr",
    status: "fillingOutForm",
    addresses: [],
  };

  function formReducer(state, action) {
    const { type, payload } = action;

    switch (type) {
      case "CHANGE_INPUT":
        return { ...state, [payload.field]: payload.value };
      case "ACTIVATE_MODAL":
        return { ...state, status: "validatingData" };
      case "DEACTIVATE_MODAL":
        return { ...state, status: "fillingOutForm" };
      case "TRIM_TEXT_INPUTS":
        const inputs = payload;
        let trimmed;
        let name;
        const result = {};
        for (let i = 0; i < inputs.length; i++) {
          if (inputs[i].nodeName === "INPUT" && inputs[i].type === "text") {
            trimmed = inputs[i].value.trim();
            name = inputs[i].name;
          }
          result[name] = trimmed;
        }
        return { ...state, ...result };
      case "UPDATE_ADDRESSES":
        return { ...state, addresses: payload };
      case "DISPLAY_ADDRESSES":
        return { ...state, status: "formSubmitted" };
      default:
        return state;
    }
  }

  const [formState, dispatch] = useReducer(formReducer, initState);

  const [showInvalidError, setShowInvalidError] = useState(false);
  const [showSystemError, setShowSystemError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    dispatch({ type: "ACTIVATE_MODAL", payload: null });

    const addresses = await getAddresses();

    // Since errors with fetching data are handled in getAddresses(), this code runs to stop any further action.
    if (addresses === null) {
      return;
    }

    dispatch({ type: "UPDATE_ADDRESSES", payload: addresses });

    const inputs = e.target.elements;
    dispatch({ type: "TRIM_TEXT_INPUTS", payload: inputs });
    dispatch({ type: "DISPLAY_ADDRESSES", payload: null });
  }

  async function getAddresses() {
    const body = {
      street: formState.street,
      city: formState.city,
      state: formState.stateName,
      zipcode: formState.zipcode,
    };

    if (formState.aptSuite) body.secondary = formState.aptSuite;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // const res = await axios.post("https://formal-letter-generator.herokuapp.com/", body, config);
      const res = await axios.post("http://localhost:5000", body, config);

      const isValidated = validateData(res.data);

      return isValidated ? res.data : null;
    } catch (err) {
      console.log(err);
    }
  }

  function validateData(data) {
    if (Array.isArray(data) && data.length === 0) {
      // If SmartyStreets gets an invalid address it sends back an empty array. This triggers an error to notify the user.
      setShowInvalidError(true);
      dispatch({ type: "DEACTIVATE_MODAL", payload: null });
      return false;
    }

    if (!Array.isArray(data)) {
      // This error is just in case the API sends data that's completely wrong and notifies user.
      setShowSystemError(true);
      dispatch({ type: "DEACTIVATE_MODAL", payload: null });
      return false;
    }
    return true;
  }

  const updateStateWithInputValue = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        value,
        field,
      },
    });
  };

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
                    value={formState.firstName}
                    required
                    onChange={(e) => {
                      updateStateWithInputValue(e);
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
                    value={formState.lastName}
                    required
                    onChange={(e) => {
                      updateStateWithInputValue(e);
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
                      value={formState.street}
                      required
                      onChange={(e) => {
                        updateStateWithInputValue(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm="2">
                    <Form.Label htmlFor="user-apt-suite">Apt/Suite</Form.Label>
                    <Form.Control
                      type="text"
                      name="aptSuite"
                      id="user-apt-suite"
                      value={formState.aptSuite}
                      onChange={(e) => {
                        updateStateWithInputValue(e);
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
                      value={formState.city}
                      required
                      onChange={(e) => {
                        updateStateWithInputValue(e);
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm="auto">
                    <Form.Label htmlFor="state-select">State</Form.Label>
                    <Form.Control
                      as="select"
                      name="stateName"
                      id="state-select"
                      value={formState.stateName}
                      required
                      onChange={(e) => {
                        updateStateWithInputValue(e);
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
                      value={formState.zipcode}
                      required
                      pattern="\d{5}"
                      onChange={(e) => {
                        updateStateWithInputValue(e);
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
                      value={formState.date}
                      required
                      onChange={(e) => {
                        updateStateWithInputValue(e);
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
                  value={formState.title}
                  placeholder="Mr, Mrs, Ms, etc..."
                  required
                  onChange={(e) => {
                    updateStateWithInputValue(e);
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
      {formState.status === "fillingOutForm" ? formElement : null}
      {formState.status === "validatingData" ? (
        <Fragment>
          <ModalContainer
            backdrop="static"
            centered
            show={formState.status === "validatingData"}
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
      {formState.status === "formSubmitted" ? (
        <Fragment>
          <ModalContainer
            backdrop="static"
            centered
            show={formState.status === "formSubmitted"}
          >
            <ModalContainer.Body>
              <Modal addresses={formState.addresses} />
            </ModalContainer.Body>
          </ModalContainer>
          {formElement}
        </Fragment>
      ) : null}
      {formState.status === "formConfirmed" ? (
        <Display
          formData={formState}
          // callParentState={(key, value) => setStateByKeyValue(key, value)}
        />
      ) : null}
    </Container>
  );
}

export default App;
