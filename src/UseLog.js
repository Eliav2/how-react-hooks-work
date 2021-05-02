import { useEffect, useRef } from "react";

export const useLog = (componentName = "", effect = useEffect) => {
  // keep track of phase
  const render = useRef(0);
  const call = useRef(0);

  // keep track of how much time from update call to end of effect
  const startTime = performance.now();
  const callToEffectTime = useRef(0);

  const consoleState = () =>
    `{call:${call.current},render:${render.current}}(${componentName}) ${callToEffectTime.current}ms`;
  const log = (...args) => console.log(...args, consoleState());

  effect(() => {
    render.current += 1;
    callToEffectTime.current =
      Math.round((performance.now() - startTime) * 100) / 100;
  });
  call.current += 1;

  return log;
};
