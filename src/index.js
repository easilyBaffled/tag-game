import React from "react";
import ReactDOM from "react-dom";
import decay from "./modules/decay";

import "./styles.css";

const extractLineNumber = stack =>
  /:(\d+)/.exec(Error().stack.split("\n")[2])[0];

console.ident = (v, opt = { label: "", lineNumber: false }) => (
  console.log(
    `%c${
      typeof opt === "string"
        ? opt
        : `${opt.label}${
            opt.lineNumber ? extractLineNumber(Error().stack) : ""
          }`
    }`,
    "background:black;color:white;border-radius:5px;padding:1px",
    v
  ),
  v
);

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
