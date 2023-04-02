import * as monaco from 'monaco-editor';

export const tokenConf: monaco.languages.IMonarchLanguage = {
  defaultToken: 'source',
  ignoreCase: true,

  keywords: [
    // 'http',
    // 'events',
    // 'upstream',
  ],

  // we include these common regular expressions
  // symbols: /[=><!~?:&|+\-*\/\^%]+/,
  brackets: [{ open: '{', close: '}', token: 'delimiter.bracket' }],
  tokenizer: {
    root: [
      [/^(\s*)(user|worker_processes|error_log|pid|worker_rlimit_nofile|events|http|server|location)\s/, 'keyword'],
      [/=/, 'delimiter'],
      [/\s+/, 'white'],
      // identifiers and keywords
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            '@keywords': { token: 'keyword.$0' },
            '@default': 'identifier',
          },
        },
      ],
      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],
      [/(")/, 'delimiter.bracket'],
      [/[{}]/, 'delimiter.bracket'],

      // strings: recover on non-terminated strings
      // [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/"/, 'string', '@string."'],
      [/'/, 'string', "@string.'"],

      [/#.*$/, 'comment'],

      // numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],
      [/".*?"/, 'string'],
    ],
    // string: [
    //   [/[^\\"]+/,  'string'],
    //   [/\\./,      'string.escape.invalid'],
    //   [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
    // ],
    string: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],
    // numbers: [
    //   ['-?(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?', { token: 'attribute.value.number', next: '@units' }],
    //   ['#[0-9a-fA-F_]+(?!\\w)', 'attribute.value.hex'],
    // ],
    // units: [['(M)?', 'attribute.value.unit', '@pop']],
  },
};

export const themeConfig: monaco.editor.IStandaloneThemeData = {
  colors: {},
  base: 'vs-dark',
  inherit: true,
  rules: [
    {
      token: 'module.main',
      foreground: '#c152e4',
      fontStyle: 'bold',
    },
    {
      token: 'module.log',
      foreground: '#4d6aab',
    },
  ],
};
