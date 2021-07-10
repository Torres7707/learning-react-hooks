import React, {useState,useCallback,useRef,createRef} from 'react';

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

// 在多次渲染之间共享数据
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

// 保存某个节点的引用
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
