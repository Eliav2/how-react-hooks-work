import React from "react";

import {
  BasicExamples,
  ChallengingExamples,
  InterestingExamples,
} from "./exampleFiles";

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

export const boxStyle = {
  position: "relative",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "150px",
  height: "30px",
  color: "black",
};

const Pages = ({ pages }) => {
  return (
    <>
      {Object.keys(pages).map((pageType) => {
        const pagesExamples = pages[pageType];
        return (
          <React.Fragment key={pageType}>
            <div style={{ textAlign: "center" }} key={pageType}>
              <h3>{pageType}</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {Object.keys(pagesExamples).map((exampleName) => (
                  <Link to={"/" + exampleName} key={exampleName}>
                    <button>{exampleName}</button>
                  </Link>
                ))}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <Switch key={"SWITCH"}>
        {Object.values(pages).map((examplesType) => {
          return Object.entries(examplesType).map(([name, component]) => {
            const Component = component.component ?? component;
            return (
              <Route path={"/" + name} key={name}>
                {/*<Component />*/}
                <React.Fragment key={name}>
                  <h3>
                    <u>{name}:</u>
                  </h3>
                  <p>{component?.description ?? Component.name}</p>
                  <div style={canvasStyle} id="canvas">
                    <Component />
                  </div>
                </React.Fragment>
              </Route>
            );
          });
        })}
      </Switch>
    </>
  );
};

const ExamplePage = () => {
  return (
    <div>
      <header style={titleStyle}>How React hooks work</header>
      <hr />
      <p style={{ textAlign: "center" }}>
        understand how React hooks really works!
        <br />
        <br />
        <a
          href="https://github.com/Eliav2/how-react-hooks-work"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Github
        </a>
        <br />
        <a
          href="https://dev.to/eliav2/how-react-hooks-work-in-depth-17o9"
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
      <div style={{ textAlign: "center" }}>
        <br />
        These example means nothing if you don't look in the code,
        <br />
        fork this sandbox and play with the examples below
        <br />
      </div>
      <Router>
        <Pages
          pages={{
            Basic: BasicExamples,
            Interesting: InterestingExamples,
            Challenging: ChallengingExamples,
          }}
        />
      </Router>
    </div>
  );
};

export default ExamplePage;
