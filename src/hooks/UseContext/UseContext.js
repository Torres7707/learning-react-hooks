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
