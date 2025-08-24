import type { Quiz } from '../types/models'
import BasicCode from '../../../src/exampleFiles/Basic.jsx?raw'
import BasicReverseCode from '../../../src/exampleFiles/BasicReverse.jsx?raw'
import BasicUnmountCode from '../../../src/exampleFiles/BasicUnmount.jsx?raw'
import EffectVsLayoutEffectCode from '../../../src/exampleFiles/EffectVsLayoutEffect.jsx?raw'
import AllPhasesCode from '../../../src/exampleFiles/AllPhases.jsx?raw'
import UpdateCycleCode from '../../../src/exampleFiles/UpdateCycle.jsx?raw'
import RenderCycleCode from '../../../src/exampleFiles/RenderCycle.jsx?raw'
import CombinedCycleCode from '../../../src/exampleFiles/CombinedCycle.jsx?raw'
import MultipleComponentsCode from '../../../src/exampleFiles/MultipleComponents.jsx?raw'

export const codeQuiz: Quiz = {
  id: 'code',
  title: 'Code Quiz',
  description: 'Predict outputs and phases from the article examples (production mode assumptions - react strict mode is off).',
  isOrdered: true,
  questions: [
    {
      sectionKey: 'Basic',
      promptText: 'Assume production (no Strict Mode). What is the first log when the component mounts?',
      code: { content: BasicCode },
      options: [
        'update call {call:1,render:0}',
        'mount has finished {call:1,render:1}',
        'render has finished {call:1,render:1}',
        'useLayoutEffect! {call:1,render:0}',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'BasicReverse',
      promptText: 'In BasicReverse, what is the second log on initial mount (production)?',
      code: { content: BasicReverseCode },
      options: [
        'render has finished {call:1,render:1}',
        'mount has finished {call:1,render:1}',
        'update call {call:1,render:0}',
        'useLayoutEffect! {call:1,render:0}',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Unmount',
      promptText: 'In BasicUnmount, when the component unmounts, which cleanup runs first?',
      code: { content: BasicUnmountCode },
      options: [
        'unmount {call:1,render:1}',
        'un-render {call:1,render:1}',
        'update call {call:1,render:0}',
        'render {call:1,render:1}',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Effect vs LayoutEffect',
      promptText: 'In EffectVsLayoutEffect, which log appears first?',
      code: { content: EffectVsLayoutEffectCode },
      options: [
        'useLayoutEffect! {call:1,render:0}',
        'useEffect! {call:1,render:1}',
        'update call {call:1,render:0}',
        'render has finished {call:1,render:1}',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'AllPhases',
      promptText: 'In AllPhases, just before the second useLayoutEffect runs, which log runs?',
      code: { content: AllPhasesCode },
      options: [
        'useLayoutEffect cleanup {call:2,render:1}',
        'useEffect cleanup {call:2,render:1}',
        'update {call:2,render:1}',
        'useEffect {call:2,render:2}',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'UpdateCycle',
      promptText: 'In UpdateCycle, how many update calls occur before the first render completes?',
      code: { content: UpdateCycleCode },
      options: [
        '10',
        '5',
        '1',
        '0',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'RenderCycle',
      promptText: 'In RenderCycle, each render cycle logs exactly one "update" before its "render". True or false?',
      code: { content: RenderCycleCode },
      options: [
        'True',
        'False',
        'Only on the first render',
        'Only in Strict Mode',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'CombinedCycle',
      promptText: 'In CombinedCycle, before the first render log, how many update logs are printed?',
      code: { content: CombinedCycleCode },
      options: [
        '5',
        '3',
        '10',
        '1',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'MultipleComponents',
      promptText: 'With MultipleComponents, does the React tree complete all updates before any effects run?',
      code: { content: MultipleComponentsCode },
      options: [
        'Yes, the entire tree finishes updates before effects begin',
        'No, each component runs its effects before the next component updates',
        'Only if components are memoized',
        'Only in Strict Mode',
      ],
      correctIndex: 0,
    },
  ],
}


