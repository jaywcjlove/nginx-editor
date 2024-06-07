import { getDirectives, Directive, Format } from '@nginx/reference-lib';

type autocomplete = {
  /** name of the NGINX module */
  m: string;
  /** name */
  n: string;
  /** markdown-formatted description */
  d: string;
  /** default value, as an unformatted string as if a human typed it into an
   * nginx config */
  v?: string;
  /** markdown CSV for valid contexts */
  c: string;
  /** markdown-formatted syntax specifications, including directive name.
   * Multiple syntaxes are seperated by newlines */
  s: string;
};

function toAutocomplete(d: Directive): autocomplete {
  const ret: autocomplete = {
    m: d.module,
    n: d.name,
    d: d.description,
    c: d.contexts.map((c) => '`' + c + '`').join(', '),
    s: d.syntax.map((s) => `**${d.name}** ${s};`).join('\n'),
  };

  if (d.default) {
    ret.v = `${d.name} ${d.default};`;
  }

  return ret;
}

export const directives = getDirectives(Format.Markdown).map(toAutocomplete);
