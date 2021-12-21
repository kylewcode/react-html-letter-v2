import React, { Fragment } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

function Modal({ addresses, dispatch }) {
  const displayAddresses = (addresses) =>
    addresses.map((address, index) => {
      const fullAddress = `${address.deliveryLine1}, ${address.lastLine}`;
      const { cityName, state, zipCode } = address.components;
      return (
        <ListGroup key={index}>
          <ListGroup.Item>
            <Form.Check
              type="radio"
              name="address-validate"
              id={`validate-${index}`}
              value={fullAddress}
              label={fullAddress}
              data-street={address.deliveryLine1}
              data-city={cityName}
              data-state={state}
              data-zipcode={zipCode}
            />
          </ListGroup.Item>
        </ListGroup>
      );
    });

  return (
    <Fragment>
      <p>
        These are the addresses in our records that match what you have entered.
        Note that apartment or suite numbers are disregarded. Please select one
        of the following:
      </p>
      <Form
        onSubmit={(e) => {
          e.preventDefault();

          const inputs = e.target;
          for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i];
            if (
              element.checked &&
              element.name === "address-validate" &&
              element.value !== "none"
            ) {
              const { street, city, state, zipcode } = element.dataset;
              const data = {
                street: street,
                city: city,
                stateName: state,
                zipcode: zipcode,
                status: "formConfirmed",
              };
              dispatch({ type: "DISPLAY_LETTER", payload: data });
            }
            if (
              element.checked &&
              element.id === "validate-none" &&
              element.value === "none"
            ) {
              window.alert("Returning to form. Please reenter your address.");
              dispatch({ type: "DISPLAY_FORM", payload: null });
            }
          }
        }}
      >
        {addresses === null ? null : displayAddresses(addresses)}
        <ListGroup>
          <ListGroup.Item>
            <Form.Check
              type="radio"
              name="address-validate"
              id="validate-none"
              value="none"
              label="I do not see my address here."
            />
          </ListGroup.Item>
        </ListGroup>
        <div className="text-center">
          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </div>
      </Form>
    </Fragment>
  );
}

export default Modal;
