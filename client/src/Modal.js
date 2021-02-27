import React, { Fragment } from "react";
import Spinner from "./Spinner";
import "./App.css";

// @purpose To allow the user to validate the address based off a list of choices and send the correct address back to App.
// @data SmartyStreets list of addresses
function Modal({ addressData, callParentState }) {
  const displayAddresses = (data) =>
    data.map((address, index) => {
      const fullAddress = `${address.deliveryLine1}, ${address.lastLine}`;
      const { cityName, state, zipCode } = address.components;
      return (
        <div key={index}>
          <div>
            <input
              type="radio"
              name="address-validate"
              id={`validate-${index}`}
              value={fullAddress}
              data-street={address.deliveryLine1}
              data-city={cityName}
              data-state={state}
              data-zipcode={zipCode}
            />
            <label htmlFor={`validate-${index}`}>{fullAddress}</label>
          </div>
        </div>
      );
    });

  return (
    <Fragment>
      <div className="modal">
        <div className="modal-content">
          {addressData === null ? (
            <Spinner />
          ) : (
            <Fragment>
              <p>
                These are the addresses in our records that match what you have
                entered. Note that apartment or suite numbers are disregarded.
                Please select one of the following:
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const inputs = e.target;
                  for (let i = 0; i < inputs.length; i++) {
                    const element = inputs[i];
                    if (
                      element.checked &&
                      element.computedRole === "radio" &&
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
                      callParentState(data);
                    }
                    if (
                      element.checked &&
                      element.computedRole === "radio" &&
                      element.value === "none"
                    ) {
                      // User needs to return to the form if they don't see their address.
                      const data = {
                        status: "fillingOutForm",
                      };
                      window.alert(
                        "Returning to form. Please reenter your address."
                      );
                      callParentState(data);
                    }
                  }
                }}
              >
                {addressData === null ? null : displayAddresses(addressData)}
                <div>
                  <input
                    type="radio"
                    name="address-validate"
                    id="validate-none"
                    value="none"
                  />
                  <label htmlFor="validate-none">
                    I do not see my address here.
                  </label>
                </div>
                <button type="submit">Submit</button>
              </form>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Modal;
