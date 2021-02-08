import * as monaco from 'monaco-editor';
import { themeConfig, tokenConf } from './conf';
import suggestions from './suggestions';
import directives from './directives.json';

// Register a new language
monaco.languages.register({
  id: 'nginx'
});
monaco.languages.setLanguageConfiguration('nginx', {
	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '"', close: '"' },
	],
});
monaco.languages.setMonarchTokensProvider('nginx', tokenConf);
monaco.editor.defineTheme("nginx-theme", themeConfig);

monaco.languages.registerCompletionItemProvider('nginx', {
  provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
		const word = model.getWordUntilPosition(position);
		const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn
		};
		return { suggestions: suggestions(range) };
  },
});

monaco.languages.registerHoverProvider('nginx', {
	provideHover:  (model: monaco.editor.ITextModel, position: monaco.Position, token: monaco.CancellationToken) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;
		const data = directives.find(item => item.name === word.word);
		if (!data) return;
		const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn
		};
		console.log('data:', data)
		return {
			contents: [
				{ value: `**\`${data.name}\`** ${data.module}` },
				{ value: `${data.md}` },
			],
			range: range,
		}
	}
});