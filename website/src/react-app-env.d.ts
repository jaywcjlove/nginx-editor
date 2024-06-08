////// <reference types="react-scripts" />
/// <reference path="../node_modules/kkt/node_modules/react-scripts/lib/react-app.d.ts" />

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.md' {
  const src: string;
  export default src;
}
