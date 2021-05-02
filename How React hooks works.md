# How React hooks work - in depth

In simple cases, React Hooks will magically do exactly what you meant for, but in other cases their behavior can feel
inconsistent and unpredictable. the next article will try to deeply explain and demonstrate React hooks behavior.

The article's focus is on hooks behavior, and I will assume that you have some experience with React and React hooks.

### Definitions

If you are not a React expert, It is strongly recommend reading the definitions section. You can start from the 
example section and then return to this section later if something is not clear.

the more important definitions here are: **render**, **update**, **react hook** and **phase**.

- **browser DOM** - a tree of HTML elements. These elements make up everything the user sees in the browser, including
  this very page.
- **React** - A library for manipulating React components.
- **React component** - function(or class) that holds stateful logic managed by React lib, that component usually
  returns UI elements based on the stateful logic of the same component.  
  React have class components, and functional components(FC).
- **React tree** - a tree of React components(like the tree you can see by the React devtools). this is not the same as
  browser's DOM tree.
- **react renderer** - ReactDOM in web(or react-native in mobile) - a library that knows how to manipulate React tree
  and 'render' it into the browser's DOM in the desired location(in react apps usually to `root` element) . The renderer
  managing a Virtual DOM (VDOM) which is created and updated based on the given React tree.
- **render** - this is the moment when React tree is created based on the current state.  
  then the tree is passed to the renderer that will update the VDOM, and then will flush the changes into the browser's
  DOM.
- **update** - when we say that a component 'updates', we are saying that the function component body re-executed
  (with possibly different props). it is possibly that more the one update cycles will occur before a render. examples
  of the difference between `update` and `render` later.
- **react hook** - A primitive that shares stateful logic with the parent Component. this is the reason hooks allowed
  only inside a body of a function component - hook is `hooked` to the parent component stateful logic. when the parent
  component updates, also the hook updates, and when the effects of the FC is fired also the effects of the hook is
  fired.
- **a component's _phase_** - this is not official term, I'm using this term in this tutorial to describe a different
  point of time in a React component.

Note - These definitions are my summary and may not be accurate, but they are sufficient to understand the rest of the
article.

## React Hooks

[React hooks](https://reactjs.org/docs/hooks-reference.html) are divided to two types:

- [State hooks](https://reactjs.org/docs/hooks-overview.html#state-hook) - like `useState` or `useReducer`. these hooks
  use and possibly manipulates the parent component stateful logic.
- [Effect hooks](https://reactjs.org/docs/hooks-overview.html#effect-hook) - one of `useEffect` or `useLayoutEffect`.
  these hooks receive a callback function and usually a dependency array. the callback function will be scheduled by
  React to fire on a later _phase_(see definition above). the exact phase is dependent on the effect that was chosen.  
  **Effects from the same type will be executed in the order of declaration.**

### Super Important Notes

- **Calling state hook from effect(like useEffect) will schedule another render.**
- **Calling state hook from FC body will schedule another update call.**

## The different phases of a React component

these are the phases of a render:

- update call - the moment FC body is executed.
- useLayoutEffect - it is triggered immediately after all the scheduled mutations has been flushed into to DOM, and
  before useEffect.  
  the docs say:
  > Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.
- useEffect - it is triggered after _all_ scheduled updates calls has been executed.

after these phases, the 'render' step is completed and then ReactDOM will do the 'commit' step which basically just
saying updating the browser's DOM based on the virtual DOM created by the render step.

## Examples

important Note - each line of the code that will come next are part of the tutorial, even the comments. read them all to
follow along. these examples are self-explanatory.

code sandbox of all examples: <https://codesandbox.io/s/github/Eliav2/how-react-hooks-work>   
webpage of sandbox(examples on full screen): <https://d47vv.csb.app/>  
GitHub repo: <https://github.com/Eliav2/how-react-hooks-work>

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
        log('mount has finished');
    }, []);
    useEffect(() => {
        log('render has finished');
    });
    log('update call');
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
executed in the order of declaration, this is common mistake to think that useEffect with empty dependency array will
fire on mount and on a different phase from useEffect with no dependency array.

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

    // keep track of how much time from update call to end of effect
    const startTime = performance.now();
    const callToEffectTime = useRef(0);

    const consoleState = () =>
        `{call:${call.current},render:${render.current}}(${componentName}) ${callToEffectTime.current}ms`;
    const log = (...args) => console.log(...args, consoleState());

    effect(() => {
        render.current += 1;
        callToEffectTime.current = Math.round((performance.now() - startTime) * 100) / 100;
    });
    call.current += 1;

    return log;
};
```

`render.current` and `call.current` will 'tick' in the same rate of the parent component because of hooks natures.

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

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=BasicUnmount&module=%2Fsrc%2FexampleFiles%2FBasicUnmount.jsx&theme=dark)

</details>

### Effect vs LayoutEffect

<details>

useLayoutEffect is executed before useEffect:

```jsx
const ReactComponent = () => {
    useEffect(() => {
        log('finished render');
        render.current += 1;
    });
    useEffect(() => {
        log('finished mount');
    }, []);
    log('update call');
    call.current += 1;
    return <div/>;
};

/**
 * expected logs:
 *    boom! {call:1,render:1}(useLayoutEffect) in 4.21ms
 *    boom! {call:1,render:1}(useEffect) in 13.37ms
 */

```

[code sandbox](https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=EffectVsLayoutEffect&module=%2Fsrc%2FexampleFiles%2FEffectVsLayoutEffect.jsx&theme=dark)

</details>

### UpdateCycle

<details>

when you set state while in the update phase another update phase will be scheduled by react. let's try force React to
trigger 10 update calls before rendering.

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

Ok, so we saw what happens when we update the state while in the update phase, but what happens if we try to update
the state when we are no longer in the update state? well, React will schedule an entire re-render cycle for the
component. each render cycle will also include at least one update call.  
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

we can see that each render cycles comes with update call.

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

Let's combine the last 3 examples into common parent.

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

the entire tree goes through the phase of update, and only then the effects are fired.

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


