## useRef & useContext

### useRef()

```js
const myRefContainer = useRef(initialValue);
```

#### useRef和createRef区别

官网的定义如下:

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

useRef 在 react hook 中的作用, 正如官网说的, 它像一个变量, 类似于 this , 它就像一个盒子, 你可以存放任何东西. **createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。**

``` jsx
import React, {useState,useRef,createRef} from 'react';

// useRef和createRef的区别
export function UseRefAndCreateRef(){
    const [renderIndex,setRenderIndex]=useState(1)
    const refFromUseRef=useRef();
    const refFromCreateRef = createRef()

    if(!refFromUseRef.current) {
        refFromUseRef.current=renderIndex;
    }

    if(!refFromCreateRef.current) {
        refFromCreateRef.current=renderIndex
    }

    return (
        <div>
            <p>Current render index:{renderIndex}</p>
            <p>
                <b>refFromUseRef:</b>{refFromUseRef.current}
            </p>
            <p>
                <b>refFromCreateRef:</b>{refFromCreateRef.current}
            </p>
            <button
                onClick={()=>setRenderIndex(prev=>prev+1)}
            >Cause re-render</button>
        </div>
    )
}


```

![Jul-10-2021 16-31-42](https://gitee.com/torres7707/blogimg/raw/master/img/20210710172540.gif)

#### useRef 在多次渲染之间共享数据

可以把 useRef 看作是在函数组件之外创建的一个容器空间。在这个容器上，我们可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。

假设要去做一个计时器组件，这个组件有开始和暂停两个功能。需要用 window.setInterval 来提供计时功能；而为了能够暂停，你就需要在某个地方保存这个 window.setInterval 返回的计数器的引用，确保在点击暂停按钮的同时，也能用 window.clearInterval 停止计时器。那么，这个保存计数器引用的最合适的地方，就是 useRef，因为它可以存储跨渲染的数据。

```jsx
export function Timer() {
  // 定义 time state 用于保存计时的累积时间
  const [time, setTime] = useState(0);
  const [disable,setDisable]=useState(false)

  // 定义 timer 这样一个容器用于在跨组件渲染之间保存一个变量
  const timer = useRef(null);

  // 开始计时的事件处理函数
  const handleStart = useCallback(() => {
    setDisable((disable)=>disable=true)
    // 使用 current 属性设置 ref 的值
    timer.current = window.setInterval(() => {
      setTime((time) => time + 1);
    }, 100);
  }, []);

  // 暂停计时的事件处理函数
  const handlePause = useCallback(() => {
    setDisable((disable)=>disable=false)

    // 使用 clearInterval 来停止计时
    window.clearInterval(timer.current);
    timer.current = null;
  }, []);

  return (
    <div>
      {time / 10} seconds.
      <br />
      <button onClick={handleStart} disabled={disable}>Start</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}
```

![Jul-10-2021 17-39-26](https://gitee.com/torres7707/blogimg/raw/master/img/20210710174128.gif)

使用 useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的，这也是 useRef 区别于 useState 的地方。

#### useRef 保存某个节点的引用

在 React 中，几乎不需要关心真实的 DOM 节点是如何渲染和修改的。但是在某些场景中，我们必须要获得真实 DOM 节点的引用，所以结合 React 的 ref 属性和 useRef 这个 Hook，我们就可以获得真实的 DOM 节点，并对这个节点进行操作。

比如说，你需要在点击某个按钮时让某个输入框获得焦点，可以通过下面的代码来实现：

```jsx

export function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // current 属性指向了真实的 input 这个 DOM 节点，从而可以调用 focus 方法
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

![Jul-10-2021 17-46-22](https://gitee.com/torres7707/blogimg/raw/master/img/20210710174634.gif)

### useContext()

React 组件之间的状态传递只有一种方式，那就是通过 props。这就意味着这种传递关系只能在父子组件之间进行。如果要跨层次，或者同层的组件之间要进行数据的共享，就涉及到一个新的命题：全局状态管理。

为了**能够进行数据的绑定**，React 提供了 Context 这样一个机制，能够让所有在某个组件开始的组件树上创建一个 Context。这样这个组件树上的所有组件，就都能访问和修改这个 Context 了。当这个 Context 的数据发生变化时，**使用这个数据的组件就能够自动刷新**。但如果没有 Context，而是使用一个简单的全局变量，就很难去实现了。

那么在函数组件里，我们就可以使用 useContext 这样一个 Hook 来管理 Context。

```js
const value = useContext(MyContext);
```

一个 Context 是从某个组件为根组件的组件树上可用的，所以我们需要有 API 能够创建一个 Context，这就是 React.createContext API，如下：

```js
const MyContext = React.createContext(initialValue);
```

这里的 MyContext 具有一个 Provider 的属性，一般是作为组件树的根组件。

实例：

```jsx
import React, { useState, useContext, useCallback } from 'react';
import './UseContext.css';
const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};
// 创建一个 Theme 的 Context
const ThemeContext = React.createContext(themes.light);

export default function UseContext() {
  // 使用 state 来保存 theme 从而可以动态修改
  const [theme, setTheme] = useState('light');

  // 切换 theme 的回调函数
  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  }, []);

  // 整个应用使用 ThemeContext.Provider 作为根组件
  return (
    // 使用 theme state 作为当前 Context
    <ThemeContext.Provider value={themes[theme]}>
      <div className="container">
        <div className="header">
          <div className="title">xxxxx</div>
          <button className="toggle-btn" onClick={toggleTheme}>
            Toggle Theme
          </button>
        </div>
        <div className="content">
          <Toolbar />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

// 在 Toolbar 组件中使用一个会使用 Theme 的 Button
function Toolbar(props) {
  return <ThemedButton />;
}

// 在 Theme Button 中使用 useContext 来获取当前的主题
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <div
      className="styled-context"
      style={{
        background: theme.background,
        color: theme.foreground,
      }}
    >
      <div className="styled-text">
        <span>I am styled by theme context!</span>
        <br />
        <span>I am styled by theme context!</span>
        <br />
        <span>I am styled by theme context!</span>
        <br />
        <span>I am styled by theme context!</span>
        <br />
        <span>I am styled by theme context!</span>
      </div>
    </div>
  );
}
```

![Jul-10-2021 18-44-01](https://gitee.com/torres7707/blogimg/raw/master/img/20210710185056.gif)

Context 提供了一个方便在多个组件之间共享数据的机制。不过需要注意的是，它的灵活性也是一柄双刃剑。Context 相当于提供了一个定义 React 世界中全局变量的机制，而全局变量则意味着两点：

1. 会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。
2. 让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。

