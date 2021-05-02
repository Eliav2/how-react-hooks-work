import { useEffect, useRef } from "react";

const timeDiff = (prevTime) =>
  Math.round((performance.now() - prevTime) * 1000) / 1000;

export const useLog = (componentName = "", effect = useEffect) => {
  // keep track of phase
  const render = useRef(0);
  const call = useRef(0);

  // keep track of how much time from update call to end of effect
  const execTime = useRef(performance.now());
  execTime.current = performance.now();

  const consoleState = () =>
    `{call:${call.current},render:${
      render.current
    }}(${componentName}) ${timeDiff(execTime.current)}ms`;
  const log = (...args) => console.log(...args, consoleState());

  effect(() => {
    render.current += 1;
    execTime.current = performance.now();
  });
  call.current += 1;

  return log;
};
