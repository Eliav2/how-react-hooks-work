# How React Hooks Work - in depth + React Render Cycle Explained

_Last update: 11.3.22_

(please note few fixes were made - so if you came from another mirror note that all other mirrors contain inaccuracies, so please always read from [Home page](https://eliav2.github.io/how-react-hooks-work/))

![React hooks image](https://user-images.githubusercontent.com/47307889/116921331-826bbe80-ac5c-11eb-9f48-d8fbde144b04.png)

## TLDR;

have some experience with React and React Hooks, and prefer fewer words and more code?
jump over to the [Examples](#examples) section. if something is not clear you can come back and re-read the explanations.

if this is not the case - please continue from here.

## Intro

In simple cases, React Hooks will magically do exactly what you meant for, but in other cases, their behavior can feel
inconsistent and unpredictable. the next article will try to deeply explain and demonstrate React hooks behavior.

Note: this article does not aim to teach all the different hooks available in React, or how to use them - its main purpose is a deep understanding of what actually happens when you call React hook(like `useState` or `useEffect`).

This article consists of four main sections:

- [Definitions](#definitions) - this section summarizes important terms in React and web development which necessary to understand the rest of the article.
- [React Hooks](#react-hooks) - explains what type of hooks exists, what the difference between them, and how they behave.
- [Examples](#examples) - examples that demonstrate everything explained in this article with an increasing difficulty rate.
- [Recap](#recap) - summary with the most important notes.

This article is not for beginners, and I will assume that you have some experience with React and React hooks.

please feel free to re-read sections, and ask your best friend Google when it's needed. also, feel free to ask questions on [discussion](https://github.com/Eliav2/how-react-hooks-work/discussions) in the repo if you really feel stuck.

#### Links

- [code sandbox of all examples](https://codesandbox.io/s/github/Eliav2/how-react-hooks-work)
- [examples page fullscreen](https://d47vv.csb.app/) (no code)
- [GitHub repo](https://github.com/Eliav2/how-react-hooks-work)
- have a question? open [discussion](https://github.com/Eliav2/how-react-hooks-work/discussions)
- something is wrong? open [issue](https://github.com/Eliav2/how-react-hooks-work/issues)
- you can fix it? submit a [pull request](https://github.com/Eliav2/how-react-hooks-work/pulls)

#### article mirrors

All mirrors(at medium, Reddit, etc) are considered deprecated as I don't update them when needed. please read from the Home page

- [Home page](https://eliav2.github.io/how-react-hooks-work/)

## Definitions

the more important definitions here are: **render**, **update**, **React hook** and **phase**.

- **browser DOM** - a tree of HTML elements. These elements make up everything the user sees in the browser, including this very page.
- **React** - A library for manipulating React components.
- **React component** - function(or class) that holds stateful logic managed by React lib, that component usually returns a React Element based on the stateful logic of the same component.
  React have class components, and functional components(FC).
- **React Element** - React Element is what returned from React function component or from the render method of React class component.
- **React component VS React Element** - you can think of React component as a recipe for a cake, and the React element as the cake itself. 
in more technical terms, you can think of React element as instance of React Component, but the constructor would be the render method of class component, or the return statement of FC. 
- **Stateful logic/state** - variables that hold data of the current state of the component. this data can be changed over time based on events or usage. these variables are stored and managed by React lib(it means for example that when you wish to change the state you will ask React to do it by using setState and React would schedule this change, you cannot directly change these values).
- **React tree** - a tree of React Elements(like the tree you can see in React devtools), which is managed and used internally by React. this is not the same as the browser's DOM tree(however, it will later help React create and update the DOM tree on each render).
- **React renderer** - ReactDOM in web(or React-native in mobile) - a library that knows how to manipulate React tree and 'render' it into the browser's DOM in the desired location(in React apps usually to `root` element). The renderer
  manages a Virtual DOM (VDOM) which is created and updated based on the given React tree.
- **phase** - this is not an official term, I'm using this term in this tutorial to describe a certain point of time in a React component. update: [also React calls this phase](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects).
- **render** - Explained in detail later in [Render cycle](#render-cycle) section.
- **update phase** - in this article when we say that a component 'updates', we are saying that the function component body re-executed. this is a the first step of a render cycle.
- **Effect phase** - this is the name of the phase after the render ends and the UI is fully updated, React let as execute callbacks on this phase by using **`useEffect`**, **`useLayoutEffect`** on function components or `componentDidMount` and `componentDidUpdate` on class components.
- **React hook** - A primitive that shares stateful logic with the parent Component. The hook and the parent component updates are triggers in the same phase, and the effects of the hook and the FC also fire in the same phase(demonstrated [later](#uselog)).
  React hook is allowed to be called only at the [top level of FC](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level). the reason for that is because internally[ React relies on the order in which Hooks are called](https://reactjs.org/docs/hooks-rules.html#explanation).

Note - These definitions were summarized by me and may not be accurate, but they are sufficient to understand the rest of the article

## React Hooks

There 2 types of [React hooks](https://reactjs.org/docs/hooks-reference.html):

- [State hooks](https://reactjs.org/docs/hooks-overview.html#state-hook) - like `useState` or `useReducer`. these hooks
  use and possibly manipulates the parent component stateful logic.
- [Effect hooks](https://reactjs.org/docs/hooks-overview.html#effect-hook) - one of `useEffect` or `useLayoutEffect`.
  these hooks receive a callback function and usually a dependency array. the callback function will be scheduled by
  React to fire on a later _phase_(see definition above). the exact phase is dependent on the effect that was chosen.  
  **Effects from the same type will be executed in the order of declaration.**

### Render cycle

**So what is a render?**

- **when it happens** - a 'render' is triggered as a result of an event that changed the state of a React component. this trigger will propagate down to each child of this component and will trigger a `render` recursively on them as well.
  for example - `onClick` event which called `setState`.
  another example is the 'Mount' event, which will trigger a render on a component and any of his children recursively on the first render.
- **what it means** - when a 'render' is triggered on a React component - the Component body would be re-executed(or the component render method on class component), this will also execute the function body recursively on each child. At the end of these operations - we get an updated React-tree of this component and all of Its children. this React-tree is passed to the React renderer and the renderer would update the sub dom-tree of this component if needed.

#### phases of render

- **render**:
  - construction of sub React-tree by recursively calling the React component function body (or the render method on class components)- in this article we call this **update phase**.
  - passing this React-tree to the renderer that will figure out what's sections of the DOM needs to be updated.
- **commit**:
  - the renderer updates the DOM using [React’s “diffing” algorithm](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm).
  - now the browser DOM is fully updated in memory but the browser has not painted it to the UI(the event loop has not yet ended). means that any access to the DOM here will get the updated DOM properties(such location and dimensions), but changes has not flushed to the UI just yet.
  - <small><em> useLayoutEffect cleanup from previous render </em></small>
  - <small><em>useEffect cleanup from previous render</em></small>
  - **[useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)** is now called.
  - javascript event loop has ended, and the browser paints the updated DOM(the UI is fully updated).
  - **[useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)** is now called(asynchronously).

Note

- the cleanup effect will never fire on the first render(because there is no prior effect to cleanup from).
- when component unmount only the cleanup effect are fired.

#### Render cycle summary:

So to summer up, **there are 5 distinct phases in a render cycle of React**. Most of the time almost all of our code would be executed on the first phase(the update phase), and only small part in the effects phase. We, the developers, can ask React to execute code in each of these phases by providing callback functions and using the different effect hooks(demos later).


1. update - may be called several times for a single render, and will occur one after another before any effect!
2. useLayoutEffects cleanup
3. useLayoutEffects
4. useEffects cleanup
5. useEffects

the order on the first render:

1. update (possibly multiple times)
2. useLayoutEffects
3. useEffects

the order when component unmount(this is not exactly a 'render'):

1. useLayoutEffect cleanup
2. useEffect cleanup

the [AllPhases example](#allphases) demonstrates this very well.

### Setting State in different phases

- **setting the state from update phase(FC body) will cause React to schedule another update call.** [see example](#updatecycle)
Note: this means that the update phase can repeated multiple times before proceeding to the effects phase if you set the state at the top level of the FC (the function body) -  don't do it.
- **setting the state from effect(like useEffect or useLayoutEffect) will cause React to schedule another render cycle.**
  [see example](#rendercycle)

## Examples

The latest examples are the most interesting, but to understand them one has to understand the first examples
first, so make sure to follow the examples one after another.

important Note - each line of the code that will come next is part of the tutorial, even the comments. read them all to
follow along.

<details open>
<summary><h3>Basic</h3></summary>

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
    log("mount has finished");
  }, []);
  useEffect(() => {
    log("render has finished");
  });
  log("update call");
  return <div />;
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

<summary markdown='span'>Reveal answer</summary>

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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FBasic.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=basic&module=%2Fsrc%2FexampleFiles%2FBasic.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>BasicReverse</h3></summary>

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
  return <div />;
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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FBasicReverse.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=basicReverse&module=%2Fsrc%2FexampleFiles%2FBasicReverse.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>useLog</h3></summary>

now let's create a log helper hook `useLog` that will let us keep track of the component phase for later examples:

```jsx
const useLog = (componentName = "", effect = useEffect) => {
  // keep track of phase
  const render = useRef(0);
  const call = useRef(0);

  const consoleState = () => `{call:${call.current},render:${render.current}}(${componentName})`;
  const log = (...args) => console.log(...args, consoleState());

  effect(() => {
    render.current += 1;
  });
  call.current += 1;

  return log;
};
```

`render.current` and `call.current` will 'tick' at the same rate as the parent component because of hooks natures.\
This is simplified `useLog`, you will see different useLog hook in the `UseLog.js` file which includes some logic for
monitoring execution time.

and usage:

```jsx
const Basic = () => {
  const log = useLog();
  useEffect(() => {
    log("finished render");
  });
  return <div />;
};

/**
 * expected logs:
 *    finished render {call:1,render:1}()
 */
```

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?fontsize=14&hidenavigation=1&initialpath=BasicReverse&module=%2Fsrc%2FUseLog.js&theme=dark&view=editor">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?fontsize=14&hidenavigation=1&initialpath=BasicReverse&module=%2Fsrc%2FUseLog.js&theme=dark&view=editor&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>Unmount</h3></summary>

if we will trigger unmount after mount the order of the logs will be:

```jsx
const BasicUnmount = () => {
  const log = useLog();
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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FUnmount.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=Unmount&module=%2Fsrc%2FexampleFiles%2FUnmount.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>Effect vs LayoutEffect</h3></summary>

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
  return <div />;
  /**
   * expected logs:
   * useLayoutEffect! {call:1,render:0}(effects) 164.565ms
   * useEffect! {call:1,render:1}(effects) 174.52ms
   */
};
```

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FEffectVsLayoutEffect.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=EffectVsLayoutEffect&module=%2Fsrc%2FexampleFiles%2FEffectVsLayoutEffect.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>AllPhases</h3></summary>

This demonstrates all the different phases combined. after mount another dummy re-render is scheduled, we will use
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
    log("component fully mounted and render cycle ended. now scheduling another render...");
    forceRender();
    return () => log("unmount cleanup");
  }, []);

  return <div />;
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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FAllPhases.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=AllPhases&module=%2Fsrc%2FexampleFiles%2FAllPhases.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>UpdateCycle</h3></summary>

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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FUpdateCycle.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=UpdateCycle&module=%2Fsrc%2FexampleFiles%2FUpdateCycle.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>RenderCycle</h3></summary>

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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FRenderCycle.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=RenderCycle&module=%2Fsrc%2FexampleFiles%2FRenderCycle.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>CombinedCycle</h3></summary>

now let's say we want 5 update calls for each render. let's force 3 renders:

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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FCombinedCycle.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=CombinedCycle&module=%2Fsrc%2FexampleFiles%2FCombinedCycle.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

<details>

<summary><h3>MultipleComponents</h3></summary>

Let's combine the last 3 examples into the common parent.

```jsx
import UpdateCycle from "./UpdateCycle";
import RenderCycle from "./RenderCycle";
import CombinedCycle from "./CombinedCycle";

const Example = () => (
  <>
    <UpdateCycle />
    <RenderCycle />
    <CombinedCycle />
  </>
);
```

now stop. think. what would you expect? does each component will go through its own update-render phases or maybe the
update calls will occur one after another and then the effects one after another?

<details>

<summary markdown="span">Reveal answer</summary>

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

[comment]: <> (<details>)

<summary markdown="span"><a href="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=base&module=%2Fsrc%2FexampleFiles%2FMultipleComponents.jsx&theme=dark">Code Sandbox</a></summary>

[comment]: <> (<iframe src="https://codesandbox.io/embed/github/Eliav2/how-react-hooks-work/tree/master/?expanddevtools=1&fontsize=14&hidenavigation=1&initialpath=MultipleComponents&module=%2Fsrc%2FexampleFiles%2FMultipleComponents.jsx&theme=dark&runonclick=1")

[comment]: <> (style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;")

[comment]: <> (title="example")

[comment]: <> (allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking")

[comment]: <> (sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts")

[comment]: <> (></iframe>)

[comment]: <> (</details>)

</details>

phew! that was tough. if you read and understand everything to this point you can confidently say that you understand
React hook's nature.

## Component with complicated lifecycle

so why do we need to understand all of this? well, in simple cases you don't, but when dealing with a component with a
complicated lifecycle you can sometimes get confused by the component's behavior. an example of such a component will
be [react-xarrow](https://github.com/Eliav2/react-xarrows) which needs to trigger callback on different phases to get
the right dimensions and activate animations callbacks on different phases. by writing this lib I learned how hooks
really behave, so I could optimize the render cycle and improve performance by far.  
**Pro-tip**: with components with a complicated lifecycle you would probably want to use many times `useRef` and
not `useState`! this way you don't force re-renders during updates and this solves problems with state variables that
depend on other state variables which will be 'ready' only on the next render.

## Recap

- on each phase: An entire React Tree goes through [each phase](#render-cycle-summary) in a render cycle one after
  another, which means that if one component in the tree is in the useEffect phase, for example, all the different
  components in the tree are currently also in the useEffect phase.
- for a React Tree: on the same phase, each Component on React tree will fire each phase in the same order of the
  declaration of the react component in the React tree. for example:
  ```jsx
  <>
    <Comp1 />
    <Comp2 />
  </>
  ```
  the useEffect if `Comp1` will fire and only then the useEffect `Comp2` will fire.
- On the same React component: on the same phase, each effect from the same type will fire in the order of declaration.

That's it! you now understand what really going on when you ask React to update some state a React component.

If you liked this tutorial make sure to like it and share it! thank you for reading until the end!

<style>
details {
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: .5em .5em 0;
    margin: 1em 0;
}
</style>
