// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import React, { useRef, useEffect } from 'react';
import { jupyterTheme, CodeMirrorEditor } from '@jupyterlab/codemirror';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { EditorView } from '@codemirror/view';
import { editorDefaultLanguages } from '../../utils/language';

/**
 * Interface describing code component properties.
 *
 * @private
 */
interface IProperties {
  /**
   * Code cell input.
   */
  cellInput: string;

  /**
   * Language mimetype.
   */
  languageMimetype: string;
}

/**
 * Functional component rendering a code component.
 */
const CodeCellComponent: React.FC<IProperties> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // clear the rendered HTML
      container.innerHTML = '';

      const model = new CodeEditor.Model();
      model.mimeType = props.languageMimetype;
      model.sharedModel.setSource(props.cellInput);
      // binds the editor to the host HTML element
      new CodeMirrorEditor({
        host: container,
        model: model,
        extensions: [
          jupyterTheme,
          EditorView.lineWrapping,
          EditorView.editable.of(false)
        ],
        languages: editorDefaultLanguages
      });
    }
  }, [props.cellInput, props.languageMimetype]);

  return <div ref={containerRef} className="jpcodetoc-toc-cell-input" />;
};

/**
 * Exports.
 */
export { CodeCellComponent };
