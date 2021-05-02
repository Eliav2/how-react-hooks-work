import React from "react";

import examples from "./exampleFiles";

import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

const titleStyle = {
  fontSize: "40px",
  margin: "20px 0 0 20px",
};

const canvasStyle = {
  position: "relative",
  height: "20vh",
  background: "white",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
};

const ExamplePage = () => {
  return (
    <div>
      <header style={titleStyle}>how React hooks work</header>
      <hr />
      <p style={{ textAlign: "center" }}>
        understand how react hooks really works!
        <br />
        <br />
        <a
          href="https://github.com/Eliav2/react-use-call-onnext-render"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Github
        </a>
        <br />
        <a
          href="https://eliav2.github.io/react-use-call-onnext-render/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Article page
        </a>
        <br />
        <br />
        Just great react.
        <br />
      </p>
      <Router>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/">
              <button>home</button>
            </Link>
            {Object.keys(examples).map((exampleName) => (
              <Link to={"/" + exampleName} key={exampleName}>
                <button>{exampleName}</button>
              </Link>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <br />
          These example means nothing if you don't look in the code,
          <br />
          fork this sandbox and play with the examples below
          <br />
        </div>
        <Switch>
          <Route exact path="/">
            <div style={{ textAlign: "center" }}>
              <h2>choose any example</h2>
              <h5>
                see each example file at <code>/src/examplesFiles</code>{" "}
              </h5>
            </div>
          </Route>
          {Object.keys(examples).map((exampleName) => {
            const Component =
              examples[exampleName]?.component ?? examples[exampleName];
            return (
              <Route path={"/" + exampleName} key={exampleName}>
                {/*<Component />*/}
                <React.Fragment>
                  <h3>
                    <u>{exampleName}:</u>
                  </h3>
                  <p>{examples[exampleName]?.description ?? Component.name}</p>
                  <div style={canvasStyle} id="canvas">
                    <Component />
                  </div>
                </React.Fragment>
              </Route>
            );
          })}
        </Switch>
      </Router>
    </div>
  );
};

export default ExamplePage;
