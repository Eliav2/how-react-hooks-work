import Basic from "./Basic";
import BasicReverse from "./BasicReverse";
import BasicUnmount from "./BasicUnmount";
import EffectVsLayoutEffect from "./EffectVsLayoutEffect";

const Pages = {
  Basic,
  BasicReverse,
  BasicUnmount: {
    component: BasicUnmount,
    description: "move to other page to see unmount effect",
  },
  EffectVsLayoutEffect,
};

export default Pages;
