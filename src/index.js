import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Nav from "./Nav";

ReactDOM.render(
  <div className="container">
    <Nav />
    <div className="container-fluid">
      <App />
    </div>
  </div>,
  document.getElementById("root")
);
