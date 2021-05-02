import React, { useEffect } from "react";
import { useLog } from "../UseLog";

const BasicUnmount = () => {
  const log = useLog("BasicUnmount");
  useEffect(() => {
    log("mount");
    return () => log("unmount");
  }, []);
  useEffect(() => {
    log("render");
    return () => log("un-render");
  });
  log("update call");
  return <div>asd</div>;
  /**
   * expected logs:
   *    update call {call:1,render:0}() 0ms
   *    mount {call:1,render:1}() 2.58ms
   *    render {call:1,render:1}() 2.58ms
   *    unmount {call:1,render:1}() 2.58ms
   *    un-render {call:1,render:1}() 2.58ms
   */
};

export default BasicUnmount;
