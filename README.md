monaco-editor-nginx
===

![Build & Deploy](https://github.com/jaywcjlove/nginx-editor/workflows/Build%20&%20Deploy/badge.svg)
[![npm version](https://img.shields.io/npm/v/nginx-editor.svg)](https://www.npmjs.com/package/jaywcjlove/nginx-editor)

Nginx language plugin for the [Monaco Editor](https://github.com/microsoft/monaco-editor). It provides the following features when editing [Nginx](https://nginx.org/) config files:

- Syntax highlighting

## Quick Start

```bash
npm install monaco-editor-nginx
```

```jsx
import MonacoEditor from '@uiw/react-monacoeditor';
import 'monaco-editor-nginx';

<MonacoEditor
  theme="nginx-theme"
  language="nginx"
  value={nginxStr}
  height="100vh"
  options={{
    theme: 'vs-dark',
  }}
/>
```

## Development

Runs the project in development mode.  

```bash
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