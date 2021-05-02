import React, { useEffect, useRef, useState } from "react";
import { useLog } from "../UseLog";
import { boxStyle } from "../App";

const UpdateCycle = () => {
  const log = useLog("UpdateCycle");
  const [, setState] = useState({});
  const forceUpdate = () => setState({});
  const updateCalls = useRef(0);

  const HandleClick = () => {
    updateCalls.current = 0;
    forceUpdate();
  };
  updateCalls.current += 1;
  if (updateCalls.current < 10) forceUpdate();

  useEffect(() => {
    log("render");
  });
  log("update");

  return (
    <div style={boxStyle} onClick={HandleClick}>
      UpdateCycle
    </div>
  );
  /**
   * update {call:1,render:0}(BasicUnmount) 0.33ms
   * update {call:2,render:0}(BasicUnmount) 0.17ms
   * update {call:3,render:0}(BasicUnmount) 0.03ms
   * update {call:4,render:0}(BasicUnmount) 0.025ms
   * update {call:5,render:0}(BasicUnmount) 0.045ms
   * update {call:6,render:0}(BasicUnmount) 0.04ms
   * update {call:7,render:0}(BasicUnmount) 0.03ms
   * update {call:8,render:0}(BasicUnmount) 0.02ms
   * update {call:9,render:0}(BasicUnmount) 0.03ms
   * update {call:10,render:0}(BasicUnmount) 0.015ms
   * render {call:10,render:1}(BasicUnmount) 0.245ms
   */
};

export default UpdateCycle;
