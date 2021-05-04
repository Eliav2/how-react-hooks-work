# How React hooks work - in depth

![React hooks image](https://user-images.githubusercontent.com/47307889/116921331-826bbe80-ac5c-11eb-9f48-d8fbde144b04.png)

## Intro

In simple cases, React Hooks will magically do exactly what you meant for, but in other cases, their behavior can feel
inconsistent and unpredictable. the next article will try to deeply explain and demonstrate React hooks behavior.

The article consisted of four main sections:

- [Definitions](#definitions) - this section summarizes important terms in React and web development which necessary for
  the rest of the article.
- [React Hooks](#react-hooks) - explains what type of hooks exists, what the difference between them, and how they
  behave.
- [Examples](#examples) - examples that demonstrate everything explained in this article with an increasing difficulty
  rate.
- [Recap](#recap) - summary with the most important notes.

Which of you that will finish reading the article to the end, and will really understand the latest example, will no
longer be surprised by unexpected problems when using hooks in components with a complicated lifecycle.

The article is not for starters, and I will assume that you have some experience with React and React hooks.

#### Links

- [code sandbox of all examples](https://codesandbox.io/s/github/Eliav2/how-react-hooks-work)
- [examples page fullscreen](https://d47vv.csb.app/) (no code)
- [GitHub repo](https://github.com/Eliav2/how-react-hooks-work)
- have a question? open [discussion](https://github.com/Eliav2/how-react-hooks-work/discussions)
- something is wrong? open [issue](https://github.com/Eliav2/how-react-hooks-work/issues)
- you can fix it? submit a [pull request](https://github.com/Eliav2/how-react-hooks-work/pulls)

#### article mirrors

read in your preferred platform:

- [Home page](https://eliav2.github.io/how-react-hooks-work/)
- [medium](https://eliav2.medium.com/how-react-hooks-work-in-depth-61e74b2e169a)
- [React-dev-community](https://dev.to/eliav2/how-react-hooks-work-in-depth-17o9)
- [hashnode](https://eliav2.hashnode.dev/how-react-hooks-work-in-depth)
- [reddit](https://www.reddit.com/r/reactjs/comments/n3uijq/how_react_hooks_work_in_depth/)

For best readability and for most updated version I would strongly recommend read
from [Home page](https://eliav2.github.io/how-react-hooks-work/). Comments and questions can be left on your preferred
platform.

## Definitions

If you are not a React expert, It is strongly recommended to read the definitions section. You can start from the
example section and then return to this section later if something is not clear.

the more important definitions here are: **render**, **update**, **React hook** and **phase**.

- **browser DOM** - a tree of HTML elements. These elements make up everything the user sees in the browser, including
  this very page.
- **React** - A library for manipulating React components.
- **React component** - function(or class) that holds stateful logic managed by React lib, that component usually
  returns UI elements based on the stateful logic of the same component.  
  React have class components, and functional components(FC).
- **React tree** - a tree of React components(like the tree you can see in React devtools). this is not the same as the
  browser's DOM tree.
- **React renderer** - ReactDOM in web(or React-native in mobile) - a library that knows how to manipulate React tree
  and 'render' it into the browser's DOM in the desired location(in React apps usually to `root` element). The renderer
  managing a Virtual DOM (VDOM) which is created and updated based on the given React tree.
- **render** - this is the moment when React tree is created based on the current state.  
  then the tree is passed to the renderer that will update the VDOM, and then will flush the changes into the browser's
  DOM.  
  render cycle consists of few phases that will be [explained later](#render-cycle).
- **update** - on of the phases of a render, when we say that a component 'updates', we are saying that the function
  component body re-executed
  (with possibly different props). it is possible that more the one update cycle will occur before a render. examples of
  the difference between `update` and `render` later.
- **React hook** - A primitive that shares stateful logic with the parent Component. this is the reason hooks allowed
  only inside a body of a function component - hook is `hooked` to the parent component stateful logic. The hook and the
  parent component updates are triggers in the same phase, and the effects of the hook and the FC also fire in the same
  phase.
- **a component's _phase_** - this is not an official term, I'm using this term in this tutorial to describe a certain
  point of time in a React component. update:
  [also React calls this phase](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects).

Note - These definitions were summarized by me and may not be accurate, but they are sufficient to understand the rest
of the article.

## React Hooks

There 2 types of [React hooks](https://reactjs.org/docs/hooks-reference.html):

- [State hooks](https://reactjs.org/docs/hooks-overview.html#state-hook) - like `useState` or `useReducer`. these hooks
  use and possibly manipulates the parent component stateful logic.
- [Effect hooks](https://reactjs.org/docs/hooks-overview.html#effect-hook) - one of `useEffect` or `useLayoutEffect`.
  these hooks receive a callback function and usually a dependency array. the callback function will be scheduled by
  React to fire on a later _phase_(see definition above). the exact phase is dependent on the effect that was chosen.  
  **Effects from the same type will be executed in the order of declaration.**

### Render cycle

these are the phases of a render:

**FC body**:

- update call - the moment FC body is executed. this is always the first phase of a render. this phases can be repeated
  multiple times if state was updated using a state hook, before proceeding to the effects.

**effects**:

- [useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect) - it is triggered immediately
  (synchronously!) after all the scheduled update calls executed, just before flushing changes to the browser's DOM and
  before useEffect.
- [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) - it is triggered asynchronously after _all_
  scheduled updates has been executed. this is always the last phase of a render.

after these phases, the 'render' cycle is completed and then ReactDOM will do the 'commit' step which basically just
saying updating the browser's DOM based on the virtual DOM created by the render step. the 'commit' phase is not
relevant for the purpose of this article.

#### cleanup effects

**before** each effect is fired a cleanup function is fired(if scheduled). the cleanup effects are:

- useLayoutEffect cleanup
- useEffect cleanup

Note - cleanup effect will never fire on the first render(because there is no prior effect to cleanup from).

#### Render cycle summary:

per render cycle: Each effect fires the most 1 times, excluding update call which fires at least once.

The effects are fired in this order(excluding the first render), and only if was scheduled:

1. updateCall - may be called several times for a single render, and will occur one after another before any effect!
2. useLayoutEffect cleanup
3. useLayoutEffect
4. useEffect cleanup
5. useEffect

the [AllPhases example](#allphases) demonstrates this very well.

### Super Important Notes

- **Calling state hook from effect(like useEffect or useLayoutEffect) will cause React to schedule another render.**
  [see example](#updatecycle)
- **Calling state hook from FC body will cause React to schedule another update call.**   [see example](#rendercycle)

## Examples

important Note - each line of the code that will come next are part of the tutorial, even the comments. read them all to
follow along. these examples are self-explanatory.

Make sure looking at each example code sandbox(there is a link at the end of each example)!

### Basic

<details open>

OK enough words. see the next example.

```jsx
const Basic = () => {
    // log function helper
    // this will help up follow the component phase cycle
    const render = useRef(0);
    const call = useRef(0);
    const consoleState = () => `{call:${call.current},render:${render.current}}`;
    const log = (...args) => console.log(...args, consoleState());
    // update phase counts
    call.current += 1;
    useEffect(() => {
        render.current += 1;
    });

    //logic
    useEffect(() => {
        log('mount has finished');
    }, []);
    useEffect(() => {
        log('render has finished');
    });
    log('update call');
    return <div/>;
};

```

what order of logs would you expect when the component mounts? think for a second and replace the '?':

```jsx
/**
 * expected logs:
 *    update call           {call:?,render:?}
 *    mount has finished    {call:?,render:?}
 *    render has finished   {call:?,render:?}
 */
```

<details>

<summary>Reveal answer</summary>

well, the order is:

```jsx
/**
 * expected logs:
 *    update call {call:1,render:0}
 *    mount has finished {call:1,render:1}
 *    render has finished {call:1,render:1}
 */
```

as we explained earlier, the function body fire first and then the effects.

</details>


[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=basic&module=%2Fsrc%2FexampleFiles%2FBasic.jsx&theme=dark)

<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=basic&module=%2Fsrc%2FexampleFiles%2FBasic.jsx&theme=dark" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="example" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"/></iframe>

</details>

### BasicReverse

<details>

what will happen if we will replace the effects, does the order will change?

```jsx
const BasicReverse = () => {
    // log function helper 
    // ...
    // logic
    useEffect(() => {
        log("render has finished");
    });
    useEffect(() => {
        log("mount has finished");
    }, []);
    log("update call");
    return <div/>;
};
```

well, the order does change, and will be:

```jsx
/**
 * expected logs:
 *    update call {call:1,render:0}
 *    render has finished {call:1,render:1}
 *    mount has finished {call:1,render:1}
 */
```

this is because effect hooks from the same type(here `useEffect`) are scheduled by React for the same phase and will be
executed in the order of declaration, this is a common mistake to think that useEffect with an empty dependency array
will fire on the mount and on a different phase from useEffect with no dependency array.

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=basicreverse&module=%2Fsrc%2FexampleFiles%2FBasicReverse.jsx&theme=dark)

</details>

### useLog

<details>

now let's create a log helper hook `useLog` that will let us keep track of the component phase for later examples:

```jsx
const useLog = (componentName = '', effect = useEffect) => {
    // keep track of phase
    const render = useRef(0);
    const call = useRef(0);

    const consoleState = () =>
        `{call:${call.current},render:${render.current}}(${componentName})`;
    const log = (...args) => console.log(...args, consoleState());

    effect(() => {
        render.current += 1;
        callToEffectTime.current = Math.round((performance.now() - startTime) * 100) / 100;
    });
    call.current += 1;

    return log;
};
```

`render.current` and `call.current` will 'tick' at the same rate of the parent component because of hooks natures.\
This is simplified `useLog`, you will see different useLog hook in the `UseLog.js` file which includes some logic for
monitoring execution time.

and usage:

```jsx
const Basic = () => {
    const log = useLog();
    useEffect(() => {
        log('finished render');
    });
    return <div/>;
};

/**
 * expected logs:
 *    finished render {call:1,render:1}()
 */
```

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?fontsize=14&hidenavigation=1&module=%2Fsrc%2FUseLog.js&theme=dark&view=editor)

</details>

### unmount

<details>

if we will trigger unmount after mount the logs order will be:

```jsx
const BasicUnmount = () => {
    const log = useLog();
    useEffect(() => {
        log('mount');
        return () => log('unmount');
    }, []);
    useEffect(() => {
        log('render');
        return () => log('un-render');
    });
    log('update call');
    return <div>asd</div>;
    /**
     * expected logs:
     *    update call {call:1,render:0}
     *    mount {call:1,render:1}
     *    render {call:1,render:1}
     *    unmount {call:1,render:1}
     *    un-render {call:1,render:1}
     */
};
```

when a component goes through unmounting step - the update phase does not happen, only the effect fire, in the order of
declaration.

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=BasicUnmount&module=%2Fsrc%2FexampleFiles%2FBasicUnmount.jsx&theme=dark)

</details>

### Effect vs LayoutEffect

<details>

useLayoutEffect is executed, then useEffect:

```jsx
const EffectVsLayoutEffect = () => {
    const log = useLog("effects", undefined, "abs");
    useEffect(() => {
        log("useEffect!");
    });
    useLayoutEffect(() => {
        log("useLayoutEffect!");
    });
    return <div/>;
    /**
     * expected logs:
     * useLayoutEffect! {call:1,render:0}(effects) 164.565ms
     * useEffect! {call:1,render:1}(effects) 174.52ms
     */
};

```

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=EffectVsLayoutEffect&module=%2Fsrc%2FexampleFiles%2FEffectVsLayoutEffect.jsx&theme=dark)

</details>

### AllPhases

<details>

This demonstrates all the different phases combined. after mount another dumy re-render is scheduled, we will use
absolute timing for this example to see when each phase is executed:

```jsx
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

    return <div/>;
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

```

this example deeply demonstrates all the different possible phases while a component renders. make sure you understand
that before proceeding to the next examples.

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=AllPhases&module=%2Fsrc%2FexampleFiles%2FAllPhases.jsx&theme=dark)

</details>

### UpdateCycle

<details>

when you set a state while in the update phase another update phase will be scheduled by React. let's try to force React
to trigger 10 update calls before rendering.

```jsx
const UpdateCycle = () => {
    const log = useLog("UpdateCycle");
    const [, setState] = useState({});
    const forceUpdate = () => setState({});
    const updateCalls = useRef(0);

    const HandleClick = () => {
        updateCalls.current = 0;
        forceUpdate();
    };
    updateCalls.current += 1;
    if (updateCalls.current < 10) forceUpdate();

    useEffect(() => {
        log("render");
    });
    log("update");

    return (
        <div style={boxStyle} onClick={HandleClick}>
            click
        </div>
    );
    /**
     * update {call:1,render:0}(UpdateCycle) 0.33ms
     * update {call:2,render:0}(UpdateCycle) 0.17ms
     * update {call:3,render:0}(UpdateCycle) 0.03ms
     * update {call:4,render:0}(UpdateCycle) 0.025ms
     * update {call:5,render:0}(UpdateCycle) 0.045ms
     * update {call:6,render:0}(UpdateCycle) 0.04ms
     * update {call:7,render:0}(UpdateCycle) 0.03ms
     * update {call:8,render:0}(UpdateCycle) 0.02ms
     * update {call:9,render:0}(UpdateCycle) 0.03ms
     * update {call:10,render:0}(UpdateCycle) 0.015ms
     * render {call:10,render:1}(UpdateCycle) 0.245ms
     */
};
```

as we can see, we forced React to re-call the function body 10 times before performing the render. we can also notice
that the render phase occurred 0.245ms after the last update call.

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=UpdateCycle&module=%2Fsrc%2FexampleFiles%2FUpdateCycle.jsx&theme=dark)

</details>

### RenderCycle

<details>

Ok, so we saw what happens when we update the state while in the update phase, but what happens if we try to update the
state when we are no longer in the update phase? well, React will schedule an entire re-render cycle for the component.
each render cycle will also include at least one update call.  
let's force 5 render cycles:

```jsx
const RenderCycle = () => {
    const log = useLog("RenderCycle");
    const [, setState] = useState({});
    const forceRender = () => setState({});
    const renderCalls = useRef(0);

    const HandleClick = () => {
        renderCalls.current = 0;
        forceRender();
    };

    useEffect(() => {
        renderCalls.current += 1;
        if (renderCalls.current < 5) forceRender();
        log("render");
    });
    log("update");

    return (
        <div style={boxStyle} onClick={HandleClick}>
            click
        </div>
    );
    /**
     * update {call:1,render:0}(RenderCycle) 0.365ms
     * render {call:1,render:1}(RenderCycle) 0.33ms
     * update {call:2,render:1}(RenderCycle) 0.26ms
     * render {call:2,render:2}(RenderCycle) 0.315ms
     * update {call:3,render:2}(RenderCycle) 0.12ms
     * render {call:3,render:3}(RenderCycle) 0.25ms
     * update {call:4,render:3}(RenderCycle) 0.07ms
     * render {call:4,render:4}(RenderCycle) 0.495ms
     * update {call:5,render:4}(RenderCycle) 0.055ms
     * render {call:5,render:5}(RenderCycle) 0.135ms
     */
};


```

we can see that each render cycle comes with an update call.

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=RenderCycle&module=%2Fsrc%2FexampleFiles%2FRenderCycle.jsx&theme=dark)

</details>

### CombinedCycle

<details>

now lets say we want 5 update calls for each render. let's force 3 renders:

```jsx
const CombinedCycle = () => {
    const log = useLog("CombinedCycle");
    const [, setState] = useState({});
    const forceUpdate = () => setState({});
    const updateCalls = useRef(0);
    const renderCalls = useRef(0);

    const HandleClick = () => {
        updateCalls.current = 0;
        renderCalls.current = 0;
        forceUpdate();
    };
    updateCalls.current += 1;
    if (updateCalls.current < 5) forceUpdate();

    useEffect(() => {
        renderCalls.current += 1;
        if (renderCalls.current < 3) forceUpdate();
        updateCalls.current = 0;
        log("render");
    });
    log("update");

    return (
        <div style={boxStyle} onClick={HandleClick}>
            click
        </div>
    );
};
/**
 * update {call:1,render:0}(CombinedCycle) 0.085ms
 * update {call:2,render:0}(CombinedCycle) 0.17ms
 * update {call:3,render:0}(CombinedCycle) 0.03ms
 * update {call:4,render:0}(CombinedCycle) 0.025ms
 * update {call:5,render:0}(CombinedCycle) 0.03ms
 * render {call:5,render:1}(CombinedCycle) 0.29ms
 * update {call:6,render:1}(CombinedCycle) 0.03ms
 * update {call:7,render:1}(CombinedCycle) 0.095ms
 * update {call:8,render:1}(CombinedCycle) 0.02ms
 * update {call:9,render:1}(CombinedCycle) 0.04ms
 * update {call:10,render:1}(CombinedCycle) 0.025ms
 * render {call:10,render:2}(CombinedCycle) 0.08ms
 * update {call:11,render:2}(CombinedCycle) 0.055ms
 * update {call:12,render:2}(CombinedCycle) 0.085ms
 * update {call:13,render:2}(CombinedCycle) 0.025ms
 * update {call:14,render:2}(CombinedCycle) 0.03ms
 * update {call:15,render:2}(CombinedCycle) 0.03ms
 * render {call:15,render:3}(CombinedCycle) 0.085ms
 */
```

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=CombinedCycle&module=%2Fsrc%2FexampleFiles%2FCombinedCycle.jsx&theme=dark)


</details>

### MultipleComponents

<details>

Let's combine the last 3 examples into the common parent.

```jsx
import UpdateCycle from "./UpdateCycle";
import RenderCycle from "./RenderCycle";
import CombinedCycle from "./CombinedCycle";

const Example = () => (
    <>
        <UpdateCycle/>
        <RenderCycle/>
        <CombinedCycle/>
    </>
);

```

now stop. think. what would you expect? does each component will go through her own update-render phases or maybe the
update calls will occur one after another and then the effects one after another?

<details>

<summary>Reveal answer</summary>

the entire tree goes through the phase of the update, and only then the effects are fired.

```jsx
    /**
 * update {call:1,render:0}(UpdateCycle) 0.505ms
 * update {call:2,render:0}(UpdateCycle) 0.22ms
 * update {call:3,render:0}(UpdateCycle) 0.03ms
 * update {call:4,render:0}(UpdateCycle) 0.035ms
 * update {call:5,render:0}(UpdateCycle) 0.075ms
 * update {call:6,render:0}(UpdateCycle) 0.05ms
 * update {call:7,render:0}(UpdateCycle) 0.04ms
 * update {call:8,render:0}(UpdateCycle) 0.04ms
 * update {call:9,render:0}(UpdateCycle) 0.045ms
 * update {call:10,render:0}(UpdateCycle) 0.025ms
 * update {call:1,render:0}(RenderCycle) 0.035ms
 * update {call:1,render:0}(CombinedCycle) 0.065ms
 * update {call:2,render:0}(CombinedCycle) 0.06ms
 * update {call:3,render:0}(CombinedCycle) 0.065ms
 * update {call:4,render:0}(CombinedCycle) 0.045ms
 * update {call:5,render:0}(CombinedCycle) 0.04ms
 * render {call:10,render:1}(UpdateCycle) 0.15ms
 * render {call:1,render:1}(RenderCycle) 0.33ms
 * render {call:5,render:1}(CombinedCycle) 0.17ms
 * update {call:2,render:1}(RenderCycle) 0.295ms
 * update {call:6,render:1}(CombinedCycle) 0.045ms
 * update {call:7,render:1}(CombinedCycle) 0.045ms
 * update {call:8,render:1}(CombinedCycle) 0.04ms
 * update {call:9,render:1}(CombinedCycle) 0.06ms
 * update {call:10,render:1}(CombinedCycle) 0.04ms
 * render {call:2,render:2}(RenderCycle) 0.145ms
 * render {call:10,render:2}(CombinedCycle) 0.145ms
 * update {call:3,render:2}(RenderCycle) 0.055ms
 * update {call:11,render:2}(CombinedCycle) 0.05ms
 * update {call:12,render:2}(CombinedCycle) 0.085ms
 * update {call:13,render:2}(CombinedCycle) 0.03ms
 * update {call:14,render:2}(CombinedCycle) 0.015ms
 * update {call:15,render:2}(CombinedCycle) 0.02ms
 * render {call:3,render:3}(RenderCycle) 0.125ms
 * render {call:15,render:3}(CombinedCycle) 0.075ms
 * update {call:4,render:3}(RenderCycle) 0.06ms
 * render {call:4,render:4}(RenderCycle) 0.135ms
 * update {call:5,render:4}(RenderCycle) 0.025ms
 * render {call:5,render:5}(RenderCycle) 0.06ms
 */
```

</details>

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=MultipleComponents&module=%2Fsrc%2FexampleFiles%2FMultipleComponents.jsx&theme=dark)

</details>

phew! that was tough. if you read and understand everything to this point you can confidently say that you understand
React hook's nature.

## Component with complicated lifecycle

so why do we need to understand all of this? well, in simple cases you don't, but when dealing with a component with a
complicated lifecycle you can sometimes get confused by the component's behavior. an example of such component will
be [react-xarrow](https://github.com/Eliav2/react-xarrows) which needs to trigger callback on different phases to get
the right dimensions and activate animations callbacks on different phases, for that react-xarrows
using [react-use-call-onnext-render](https://github.com/Eliav2/react-use-call-onnext-render) to schedule callback for
later phases.

## Recap

- on each phase: An entire React Tree goes through [each phase](#render-cycle-summary) in a render cycle one after
  another, which means that if one component in the tree is in the useEffect phase for example, all the different
  components in the tree are currently also in the useEffect phase.
- for a React Tree: on the same phase, each Component on React tree will fire each phase in the same order of the
  declaration of the react component in the React tree. for example:
  ```jsx
  <>
    <Comp1/>
    <Comp2/>
  </>
  ```
  the useEffect if `Comp1` will fire and only then the useEffect `Comp2` will fire.
- On the same React component: on the same phase, each effect from the same type will fire in the order of declaration.

That's it! you now understand what really going on when you asks React to update some state in some component.

If you liked this tutorial make sure to like it and share it! thank you for reading until the end!
