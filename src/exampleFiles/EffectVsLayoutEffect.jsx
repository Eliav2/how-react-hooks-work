import React, { useEffect, useLayoutEffect } from "react";
import { useLog } from "../UseLog";

const EffectVsLayoutEffect = () => {
  const log = useLog("effects", undefined, "abs");
  useEffect(() => {
    log("useEffect!");
  });
  useLayoutEffect(() => {
    log("useLayoutEffect!");
  });
  return <div />;
  /**
   * expected logs:
   * useLayoutEffect! {call:1,render:0}(effects) 164.565ms
   * useEffect! {call:1,render:1}(effects) 174.52ms
   */
};

export default EffectVsLayoutEffect;
