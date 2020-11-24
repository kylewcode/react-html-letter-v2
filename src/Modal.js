import React from "react";
import "./App.css";

function Modal({
  modalSetState,
  modalState: {
    firstName,
    lastName,
    streetNumber,
    streetName,
    aptSuite,
    city,
    stateName,
    zipcode,
    date,
    isFemale,
    isMarried,
    status,
    dataStore,
  },
}) {
  const childState = {
    firstName,
    lastName,
    streetNumber,
    streetName,
    aptSuite,
    city,
    stateName,
    zipcode,
    date,
    isFemale,
    isMarried,
    status,
    dataStore,
  };

  // Access dataStore to grab the possible addresses and construct some radio buttons from them
  // For every location that is returned
  // Take the address and make it into a radio button to select
  const addressJSX = [];
  dataStore.forEach((location, key) => {
    const address = `${location.number} ${location.street} ${location.locality} ${location.region_code} ${location.postal_code}`;
    // Don't push the radio button if any of the data needed returns null. If every data point is not null or undefined
    
    // Expects array of the values of the location object.
    const locationValues = [location.number, location.street, location.locality, location.region_code, location.postal_code];
    const checkNull = (arr) => {
      return arr.every(element => {
        return element !== null && element !== undefined;
      });
    };

    if (checkNull(locationValues)) {
      addressJSX.push(
        <div key={key}>
          <input
            type="radio"
            name="address-validate"
            id={`valid-${key}`}
            value={address}
            /* Data attributes reflect JSON data */
            data-address-number={location.number}
            data-address-street={location.street}
            data-address-locality={location.locality}
            data-address-region-code={location.region_code}
            data-address-zip-code={location.postal_code}
          />
          <label htmlFor={`valid-${key}`}>{address}</label>
        </div>
      );
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    // Prevents build error from having only one radio button.
    if (e.target.elements[0].id === 'valid-none') {
      alert("Please enter a correct address and submit again.");
      modalSetState({ ...childState, status: "fillingOutForm" });
      return;
    }

    const radioNodeList = e.target.elements["address-validate"];
    radioNodeList.forEach((node) => {
      if (node.checked === true && node.defaultValue === "N/A") {
        alert("Please enter a correct address and submit again.");
        modalSetState({ ...childState, status: "fillingOutForm" });
        return;
      }
      if (node.checked === true) {
        modalSetState({
          ...childState,
          streetNumber: node.dataset.addressNumber,
          streetName: node.dataset.addressStreet,
          city: node.dataset.addressLocality,
          stateName: node.dataset.addressRegionCode,
          zipcode: node.dataset.addressZipCode,
          status: "formConfirmed",
        });
      }
    });
  }

  return (
    <div>
      <div className="modal">
        <div className="modal-content">
          <p>
            These are the addresses in our records that match what you have
            entered. Note that apartment or suite numbers are disregarded.
            Please select one of the following:
          </p>
          <form onSubmit={handleSubmit}>
            {addressJSX}
            <div>
              <input
                type="radio"
                name="address-validate"
                id="valid-none"
                value="N/A" // Maybe the / will cause an issue?
              />
              <label htmlFor="valid-none">I do not see my address here.</label>
            </div>
            <button type="submit">Submit Button</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
