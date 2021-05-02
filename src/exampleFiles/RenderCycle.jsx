import React, { useEffect, useRef, useState } from "react";
import { useLog } from "../UseLog";
import { boxStyle } from "../App";

const RenderCycle = () => {
  const log = useLog("RenderCycle");
  const [, setState] = useState({});
  const forceRender = () => setState({});
  const renderCalls = useRef(0);

  const HandleClick = () => {
    renderCalls.current = 0;
    forceRender();
  };

  useEffect(() => {
    renderCalls.current += 1;
    if (renderCalls.current < 5) forceRender();
    log("render");
  });
  log("update");

  return (
    <div style={boxStyle} onClick={HandleClick}>
      RenderCycle
    </div>
  );
  /**
   * update {call:1,render:0}(BasicUnmount) 0.365ms
   * render {call:1,render:1}(BasicUnmount) 0.33ms
   * update {call:2,render:1}(BasicUnmount) 0.26ms
   * render {call:2,render:2}(BasicUnmount) 0.315ms
   * update {call:3,render:2}(BasicUnmount) 0.12ms
   * render {call:3,render:3}(BasicUnmount) 0.25ms
   * update {call:4,render:3}(BasicUnmount) 0.07ms
   * render {call:4,render:4}(BasicUnmount) 0.495ms
   * update {call:5,render:4}(BasicUnmount) 0.055ms
   * render {call:5,render:5}(BasicUnmount) 0.135ms
   */
};

export default RenderCycle;
