import React, { useEffect, useRef, useState } from "react";
import { useLog } from "../UseLog";
import { boxStyle } from "../App";

const CombinedCycle = () => {
  const log = useLog("BasicUnmount");
  const [, setState] = useState({});
  const forceUpdate = () => setState({});
  const updateCalls = useRef(0);
  const renderCalls = useRef(0);

  const HandleClick = () => {
    updateCalls.current = 0;
    renderCalls.current = 0;
    forceUpdate();
  };
  updateCalls.current += 1;
  if (updateCalls.current < 5) forceUpdate();

  useEffect(() => {
    renderCalls.current += 1;
    if (renderCalls.current < 3) forceUpdate();
    updateCalls.current = 0;
    log("render");
  });
  log("update");

  return (
    <div style={boxStyle} onClick={HandleClick}>
      click
    </div>
  );
};

export default CombinedCycle;
