import Basic from "./Basic";
import BasicReverse from "./BasicReverse";
import BasicUnmount from "./BasicUnmount";
import EffectVsLayoutEffect from "./EffectVsLayoutEffect";
import UpdateCycle from "./UpdateCycle";
import RenderCycle from "./RenderCycle";
import CombinedCycle from "./CombinedCycle";
import HomePage from "./Home";
import MultipleComponents from "./MultipleComponents";

export const BasicExamples = {
  HomePage,
  Basic,
  BasicReverse,
  BasicUnmount: {
    component: BasicUnmount,
    description: "move to other page to see unmount effect",
  },
  EffectVsLayoutEffect,
};

export const InterestingExamples = {
  UpdateCycle: {
    component: UpdateCycle,
    description:
      "Each click on the button will trigger 10 update cycles and only then a render would be completed." +
      " only then the changes will be flushed to the browser DOM",
  },
  RenderCycle: {
    component: RenderCycle,
    description:
      "very similar to RenderCycle example, but this time we are setting state when we are in effect phases, which" +
      " will trigger not only another update call, but also another render.\nAt least one update cycle will occur in" +
      " render cycle. ",
  },
  CombinedCycle: {
    component: CombinedCycle,
    description: "combines the logic for UpdateCycle and RenderCycle.",
  },
};

export const ChallengingExamples = {
  MultipleComponents,
};
