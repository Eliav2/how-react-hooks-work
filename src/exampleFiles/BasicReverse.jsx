import React, { useEffect, useRef } from "react";

const BasicReverse = () => {
  // log function helper
  // this will help up follow the component phase cycle
  const render = useRef(0);
  const call = useRef(0);
  const consoleState = () => `{call:${call.current},render:${render.current}}`;
  const log = (...args) => console.log(...args, consoleState());
  // update phase counts
  call.current += 1;
  useEffect(() => {
    render.current += 1;
  });

  //logic
  useEffect(() => {
    log("render has finished");
  });
  useEffect(() => {
    log("mount has finished");
  }, []);
  log("update call");
  return <div />;
};

export default BasicReverse;
