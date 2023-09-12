// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IRenderMime } from '@jupyterlab/rendermime';
import { INumberedHeading } from '../../tokens';
import { generateNumbering } from '../../utils/generate_numbering';
import { INumberingDictionary } from '../../utils/numbering_dictionary';
import { sanitizerOptions } from '../../utils/sanitizer_options';

/**
 * Returns a "click" handler.
 *
 * @private
 * @param heading - heading element
 * @returns "click" handler
 */
function onClick(heading: Element) {
  return () => {
    heading.scrollIntoView();
  };
}

/**
 * Processes an HTML element containing rendered Markdown and returns a list of headings.
 *
 * @private
 * @param node - HTML element
 * @param sanitizer - HTML sanitizer
 * @param dict - numbering dictionary
 * @param numbering - boolean indicating whether to enable numbering
 * @param numberingH1 - whether first level header should be numbered
 * @returns list of headings
 */
function getRenderedHeadings(
  node: HTMLElement,
  sanitizer: IRenderMime.ISanitizer,
  dict: INumberingDictionary,
  numbering = true,
  numberingH1 = true
): INumberedHeading[] {
  const nodes = node.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headings: INumberedHeading[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const heading = nodes[i];
    let level = parseInt(heading.tagName[1], 10);
    const text = heading.textContent ? heading.textContent : '';
    const hide = !numbering;

    // Show/hide numbering DOM element based on user settings:
    if (
      heading.getElementsByClassName('jpcodetoc-numbering-entry').length > 0
    ) {
      heading.removeChild(
        heading.getElementsByClassName('jpcodetoc-numbering-entry')[0]
      );
    }
    let html = sanitizer.sanitize(heading.innerHTML, sanitizerOptions);
    html = html.replace('¶', ''); // remove the anchor symbol

    // Generate a numbering string:
    if (!numberingH1) {
      level -= 1;
    }
    const nstr = generateNumbering(dict, level);
    // Generate the numbering DOM element:
    let nhtml = '';
    if (!hide) {
      nhtml = '<span class="jpcodetoc-numbering-entry">' + nstr + '</span>';
    }
    // Append the numbering element to the document:
    heading.innerHTML = nhtml + html;

    headings.push({
      level,
      text: text.replace('¶', ''),
      numbering: nstr,
      html,
      onClick: onClick(heading)
    });
  }
  return headings;
}

/**
 * Exports.
 */
export { getRenderedHeadings };
