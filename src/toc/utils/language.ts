import {
  EditorLanguageRegistry,
  parseMathIPython
} from '@jupyterlab/codemirror';
import { StreamLanguage } from '@codemirror/language';

export const editorDefaultLanguages = new EditorLanguageRegistry();
// register all the JupyterLab default languages
EditorLanguageRegistry.getDefaultLanguages().forEach(language => {
  editorDefaultLanguages.addLanguage(language);
});
editorDefaultLanguages.addLanguage({
  name: 'ipythongfm',
  mime: 'text/x-ipythongfm',
  load: async () => {
    const [m, tex] = await Promise.all([
      import('@codemirror/lang-markdown'),
      import('@codemirror/legacy-modes/mode/stex')
    ]);
    return m.markdown({
      base: m.markdownLanguage,
      codeLanguages: (info: string) =>
        editorDefaultLanguages.findBest(info) as any,
      extensions: [parseMathIPython(StreamLanguage.define(tex.stexMath).parser)]
    });
  }
});
