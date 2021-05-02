import React from "react";

import { BasicExamples, InterestingExamples } from "./exampleFiles";

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
  width: "100px",
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
      <div style={{ textAlign: "center" }}>
        <br />
        These example means nothing if you don't look in the code,
        <br />
        fork this sandbox and play with the examples below
        <br />
      </div>
      <Router>
        <Pages
          pages={{ Basic: BasicExamples, Interesting: InterestingExamples }}
        />
        {/*<div>*/}
        {/*  <div*/}
        {/*    style={{*/}
        {/*      display: "flex",*/}
        {/*      justifyContent: "center",*/}
        {/*      flexWrap: "wrap",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <Link to="/">*/}
        {/*      <button>home</button>*/}
        {/*    </Link>*/}
        {/*    {Object.keys(BasicExamples).map((exampleName) => (*/}
        {/*      <Link to={"/" + exampleName} key={exampleName}>*/}
        {/*        <button>{exampleName}</button>*/}
        {/*      </Link>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div style={{ textAlign: "center" }}>*/}
        {/*  <br />*/}
        {/*  These example means nothing if you don't look in the code,*/}
        {/*  <br />*/}
        {/*  fork this sandbox and play with the examples below*/}
        {/*  <br />*/}
        {/*</div>*/}
        {/*<Switch>*/}
        {/*  <Route exact path="/">*/}
        {/*    <div style={{ textAlign: "center" }}>*/}
        {/*      <h2>choose any example</h2>*/}
        {/*      <h5>*/}
        {/*        see each example file at <code>/src/examplesFiles</code>{" "}*/}
        {/*      </h5>*/}
        {/*    </div>*/}
        {/*  </Route>*/}
        {/*  {Object.keys(BasicExamples).map((exampleName) => {*/}
        {/*    const Component =*/}
        {/*      BasicExamples[exampleName]?.component ??*/}
        {/*      BasicExamples[exampleName];*/}
        {/*    return (*/}
        {/*      <Route path={"/" + exampleName} key={exampleName}>*/}
        {/*        /!*<Component />*!/*/}
        {/*        <React.Fragment>*/}
        {/*          <h3>*/}
        {/*            <u>{exampleName}:</u>*/}
        {/*          </h3>*/}
        {/*          <p>*/}
        {/*            {BasicExamples[exampleName]?.description ?? Component.name}*/}
        {/*          </p>*/}
        {/*          <div style={canvasStyle} id="canvas">*/}
        {/*            <Component />*/}
        {/*          </div>*/}
        {/*        </React.Fragment>*/}
        {/*      </Route>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</Switch>*/}
      </Router>
    </div>
  );
};

export default ExamplePage;
