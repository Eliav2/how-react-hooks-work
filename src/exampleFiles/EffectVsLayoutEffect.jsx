import React, { useEffect, useLayoutEffect } from "react";
import { useLog } from "../UseLog";

const EffectVsLayoutEffect = () => {
  const logUseLayoutEffect = useLog("useLayoutEffect", useLayoutEffect);
  const logUseEffect = useLog("useEffect", useEffect);
  useEffect(() => {
    logUseEffect("boom!");
  });
  useLayoutEffect(() => {
    logUseLayoutEffect("boom!");
  });
  return <div />;
  /**
   * expected logs:
   *    boom! {call:1,render:1}(useLayoutEffect) in 4.21ms
   *    boom! {call:1,render:1}(useEffect) in 13.37ms
   */
};

export default EffectVsLayoutEffect;
