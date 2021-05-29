import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor, { RefEditorInstance } from '@uiw/react-monacoeditor';
import { nginxStr } from './nginx.conf';
import Header from './Header';
import './App.css';
import '../';

const App: React.FC = () => {
  const [content, setContent] = useState(nginxStr || '');
  const [contentDownload, setContentDownload] = useState(content || nginxStr || '');
  const editor = useRef<RefEditorInstance>(null);
  function resizeHandle(evn: UIEvent) {
    const { target } = evn;
    const width = (target as Window).innerWidth;
    const height = (target as Window).innerHeight;
    if (editor.current && editor.current.editor) {
      editor.current.editor.layout({ width, height: height - 36 });
    }
  }
  useEffect(() => {
    if (editor.current && window) {
      window.addEventListener('resize', resizeHandle, false);
    }
    return () => {
      window && window.removeEventListener('resize', resizeHandle, false);
    };
  }, []);
  return (
    <div className="App">
      <Header
        content={contentDownload}
        onLoadContent={(text) => {
          setContent(text);
        }}
      />
      <MonacoEditor
        ref={editor}
        onChange={(value) => {
          setContentDownload(value);
        }}
        theme="nginx-theme"
        language="nginx"
        value={content}
        height="calc(100vh - 36px)"
      />
    </div>
  );
};

export default App;
