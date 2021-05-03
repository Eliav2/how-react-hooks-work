import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLog } from "../UseLog";

const AllPhases = () => {
  const logUseLayoutEffect = useLog("useLayoutEffect", useLayoutEffect, "abs");
  const logUseEffect = useLog("useEffect", useEffect, "abs");

  const [, setState] = useState({});
  const forceRender = () => setState({});

  useEffect(() => {
    logUseEffect("useEffect");
    return () => logUseEffect("useEffect cleanup");
  });
  useLayoutEffect(() => {
    logUseLayoutEffect("useLayoutEffect");
    return () => logUseLayoutEffect("useLayoutEffect cleanup");
  });
  logUseEffect("update");

  // fire only on mount
  useEffect(() => {
    logUseEffect(
      "component fully mounted and render cycle ended. now scheduling another render..."
    );
    forceRender();
    return () => logUseEffect("unmount cleanup");
  }, []);

  return <div />;
  /**
   * expected logs:
   *  update {call:1,render:0}(useEffect) 513.565ms
   *  useLayoutEffect {call:1,render:1}(useLayoutEffect) 517.345ms
   *  useEffect {call:1,render:1}(useEffect) 527.335ms
   *  component fully mounted and render cycle ended. now scheduling another render... {call:1,render:1}(useEffect) 527.6ms
   *  update {call:2,render:1}(useEffect) 529.675ms
   *  useLayoutEffect cleanup {call:2,render:1}(useLayoutEffect) 530.935ms
   *  useLayoutEffect {call:2,render:2}(useLayoutEffect) 531.32ms
   *  useEffect cleanup {call:2,render:1}(useEffect) 531.75ms
   *  useEffect {call:2,render:2}(useEffect) 532.01ms
   */
};

export default AllPhases;
