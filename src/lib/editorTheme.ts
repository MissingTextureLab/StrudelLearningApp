import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { settings as strudelThemeSettings, themes as strudelThemes } from '@strudel/codemirror';

const THEME_NAME = 'strudelSoft';

// Same mint/iris tones as the rest of the app (src/index.css), so the code
// editor reads as part of the same surface instead of a bundled theme with
// its own unrelated palette (pink/yellow/cyan, in Dracula's case).
const colors = {
  background: '#191a20',
  foreground: '#e6e5e2',
  comment: '#6b6d76',
  mint300: '#b7ecd2',
  mint400: '#82d9ac',
  iris300: '#ddd2f5',
  iris400: '#b7a3e3',
  invalid: '#e39aa6',
};

const settings = {
  background: colors.background,
  lineBackground: colors.background + '99',
  foreground: colors.foreground,
  caret: colors.mint400,
  selection: 'rgba(130, 217, 172, 0.2)',
  selectionMatch: 'rgba(130, 217, 172, 0.12)',
  gutterBackground: colors.background,
  gutterForeground: colors.comment,
  gutterBorder: 'transparent',
  lineHighlight: 'rgba(255, 255, 255, 0.035)',
};

const editorTheme = EditorView.theme(
  {
    '&': {
      color: settings.foreground,
      backgroundColor: settings.background,
    },
    '.cm-gutters': {
      backgroundColor: settings.gutterBackground,
      color: settings.gutterForeground,
    },
    '.cm-content': {
      caretColor: settings.caret,
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: settings.caret,
    },
    '.cm-activeLineGutter': {
      backgroundColor: settings.lineHighlight,
    },
    '.cm-activeLine': {
      backgroundColor: settings.lineHighlight,
    },
    '&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection':
      {
        background: settings.selection + ' !important',
      },
    '& .cm-selectionMatch': {
      backgroundColor: settings.selectionMatch,
    },
  },
  { dark: true },
);

const highlightStyle = HighlightStyle.define([
  { tag: t.comment, color: colors.comment },
  { tag: [t.string, t.regexp, t.special(t.string), t.url, t.escape, t.link], color: colors.mint300 },
  { tag: [t.function(t.variableName), t.propertyName], color: colors.mint400 },
  { tag: [t.number, t.atom, t.bool, t.special(t.variableName), t.className, t.typeName], color: colors.iris300 },
  { tag: [t.keyword, t.tagName, t.operator, t.operatorKeyword, t.arithmeticOperator], color: colors.iris400 },
  { tag: [t.name, t.variableName, t.labelName, t.meta, t.definition(t.name), t.separator], color: colors.foreground },
  { tag: t.invalid, color: colors.invalid },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.link, textDecoration: 'underline' },
]);

/**
 * Registers a custom CodeMirror theme (in Strudel's own `themes`/`settings`
 * registries, so `getTheme()` — used by .pianoroll()/.scope()/etc. for their
 * default stroke color — picks it up too) and returns its name so it can be
 * set via `codemirrorSettings`.
 */
export function registerSoftEditorTheme(): string {
  strudelThemes[THEME_NAME] = [editorTheme, syntaxHighlighting(highlightStyle)];
  strudelThemeSettings[THEME_NAME] = settings;
  return THEME_NAME;
}
