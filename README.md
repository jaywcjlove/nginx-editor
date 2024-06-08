<p align="center">
  <a href="https://jaywcjlove.github.io/nginx-editor">
    <img alt="nginx-editor" src="https://user-images.githubusercontent.com/1680273/107486617-37dc2800-6bc0-11eb-94ba-f715da69bbda.png">
  </a>
</p>

<p align="center">
  <a href="https://jaywcjlove.github.io/#/sponsor">
    <img alt="Buy me a coffee" src="https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee">
  </a>
  <a href="https://github.com/jaywcjlove/nginx-editor/actions/workflows/ci.yml">
    <img alt="Build & Deploy" src="https://github.com/jaywcjlove/nginx-editor/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://github.com/jaywcjlove/nginx-editor/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/jaywcjlove/nginx-editor.svg">
  </a>
  <a href="https://github.com/jaywcjlove/nginx-editor/network">
    <img alt="Forks" src="https://img.shields.io/github/forks/jaywcjlove/nginx-editor.svg">
  </a>
  <a href="https://github.com/jaywcjlove/nginx-editor/stargazers">
    <img alt="Stars" src="https://img.shields.io/github/stars/jaywcjlove/nginx-editor.svg">
  </a>
  <a href="https://uiwjs.github.io/npm-unpkg/#/pkg/monaco-editor-nginx/file/README.md">
    <img src="https://img.shields.io/badge/Open%20in-unpkg-blue" alt="Open in unpkg">
  </a>
  <a href="https://www.npmjs.com/package/monaco-editor-nginx">
    <img alt="npm version" src="https://img.shields.io/npm/v/monaco-editor-nginx.svg">
  </a>
</p>

Nginx language plugin for the [Monaco Editor](https://github.com/microsoft/monaco-editor). It provides the following features when editing [Nginx](https://nginx.org/) config files:

- Syntax highlighting

## Quick Start

```bash
npm install monaco-editor-nginx
```

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?logo=codesandbox)](https://codesandbox.io/s/github/jaywcjlove/nginx-editor)
[![Open in Github gh-pages](https://img.shields.io/badge/Open%20In-Github%20gh--pages-blue?logo=github)](https://jaywcjlove.github.io/nginx-editor/)

```jsx
import MonacoEditor from '@uiw/react-monacoeditor';
import 'monaco-editor-nginx';

<MonacoEditor
  ref={editor}
  theme={theme === 'vs-dark' ? 'nginx-theme-dark' : 'nginx-theme'}
  onChange={(value) => {
    setContentDownload(value);
  }}
  language="nginx"
  value={content}
  height="calc(100vh - 36px)"
/>
```

or, Integrating the ESM version of the Monaco Editor

```js
import * as monaco from 'monaco-editor';
import 'monaco-editor-nginx';

monaco.editor.create(document.getElementById("container"), {
  theme: 'nginx-theme',
  value: 'nginx code.....',
  language: 'nginx'
});
```

## Development

Runs the project in development mode.  

```bash
yarn install #
# Step 1, run first, listen to the component compile and output the .js file
# listen for compilation output type .d.ts file
npm run watch
# Step 2, development mode, listen to compile preview website instance
npm run start
```

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!


### Related

- [@uiw/react-monacoeditor](https://github.com/jaywcjlove/react-monacoeditor): Monaco Editor component for React.
- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror): CodeMirror component for React. @codemirror
- [@uiw/react-markdown-editor](https://github.com/uiwjs/react-markdown-editor): A markdown editor with preview, implemented with React.js and TypeScript.
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor): A simple markdown editor with preview, implemented with React.js and TypeScript.
- [@uiw/react-markdown-preview](https://github.com/jaywcjlove/react-monacoeditor): React component preview markdown text in web browser. 

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/nginx-editor/graphs/contributors">
  <img src="https://jaywcjlove.github.io/nginx-editor/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).
## License

Licensed under the MIT License.
