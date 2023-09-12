// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';
import { INumberedHeading } from '../../tokens';
import { sanitizerOptions } from '../../utils/sanitizer_options';
import { OptionsManager } from './options_manager';

/**
 * Renders a Markdown table of contents item.
 *
 * @private
 * @param options - generator options
 * @param item - numbered heading
 * @returns rendered item
 */
function render(options: OptionsManager, item: INumberedHeading): JSX.Element {
  const fontSizeClass = 'jpcodetoc-toc-level-size-' + item.level;

  // Render item numbering:
  const numbering = item.numbering && options.numbering ? item.numbering : '';

  // Render the item:
  let jsx;
  if (item.html) {
    const html = options.sanitizer.sanitize(item.html, sanitizerOptions);
    jsx = (
      <span
        dangerouslySetInnerHTML={{ __html: numbering + html }}
        className={'jpcodetoc-markdown-cell ' + fontSizeClass}
      />
    );
  } else {
    jsx = <span className={fontSizeClass}> {numbering + item.text}</span>;
  }
  return jsx;
}

/**
 * Exports.
 */
export { render };
