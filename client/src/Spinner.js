import React, { Fragment } from "react";
import spinner from "./img/loader_178x178.gif";

export default function Spinner() {
  return (
    <Fragment>
      <p style={{ fontStyle: "italic" }}>Loading addresses...</p>
      <img
        src={spinner}
        alt="Loading addresses..."
        width="100"
        height="100"
        style={{ margin: "auto", display: "block" }}
      />
    </Fragment>
  );
}
