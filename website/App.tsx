import React, { useEffect } from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import { nginxStr } from './nginx.conf';
import './App.css';
import '../';

const App: React.FC = () => {
  const editor = React.useRef<MonacoEditor>();
  function resizeHandle(evn: UIEvent) {
    const { target } = evn;
    const width = (target as Window).innerWidth;
    const height = (target as Window).innerHeight;
    if (editor.current && editor.current.editor) {
      editor.current.editor.layout({ width, height })
    }
  }
  useEffect(() => {
    if (editor.current && editor.current.editor && window) {
      window.addEventListener('resize', resizeHandle, false);
    }
    return () => {
      window && window.removeEventListener('resize', resizeHandle, false);
    }
  }, []);
  return (
    <div className="App">
      <MonacoEditor
        ref={(instance) => {
          if (instance) {
            editor.current = instance;
          }
        }}
        theme="nginx-theme"
        language="nginx"
        value={nginxStr}
        height="100vh"

        options={{
          theme: 'vs-dark',
        }}
      />
    </div>
  );
};

export default App;
