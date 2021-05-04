import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLog } from "../UseLog";

const AllPhases = () => {
  const log = useLog("AllPhases", useEffect, "abs");

  const [, setState] = useState({});
  const forceRender = () => setState({});

  useEffect(() => {
    log("useEffect");
    return () => log("useEffect cleanup");
  });
  useLayoutEffect(() => {
    log("useLayoutEffect");
    return () => log("useLayoutEffect cleanup");
  });
  log("update");

  // fire only on mount
  useEffect(() => {
    log(
      "component fully mounted and render cycle ended. now scheduling another render..."
    );
    forceRender();
    return () => log("unmount cleanup");
  }, []);

  return <div />;
  /**
   * expected logs:
   *    update {call:1,render:0}(AllPhases) 146.36ms
   *    useLayoutEffect {call:1,render:0}(AllPhases) 150.345ms
   *    useEffect {call:1,render:1}(AllPhases) 159.425ms
   *    component fully mounted and render cycle ended. now scheduling another render... {call:1,render:1}(AllPhases) 159.71ms
   *    update {call:2,render:1}(AllPhases) 162.05ms
   *    useLayoutEffect cleanup {call:2,render:1}(AllPhases) 163.75ms
   *    useLayoutEffect {call:2,render:1}(AllPhases) 164.34ms
   *    useEffect cleanup {call:2,render:1}(AllPhases) 167.435ms
   *    useEffect {call:2,render:2}(AllPhases) 168.105ms
   *
   * when unmount(move to other page for example):
   *    useLayoutEffect cleanup {call:2,render:2}(AllPhases) 887.375ms
   *    useEffect cleanup {call:2,render:2}(AllPhases) 892.055ms
   *    unmount cleanup {call:2,render:2}(AllPhases) 892.31ms
   */
};

export default AllPhases;
