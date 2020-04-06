import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const container = document.createElement("div");
document.body.appendChild(container);
container.style.height = "100%";
ReactDOM.render(<App />, container);
