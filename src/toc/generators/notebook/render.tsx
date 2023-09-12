// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  MARKDOWN_HEADING_COLLAPSED,
  UNSYNC_MARKDOWN_HEADING_COLLAPSED
} from '../../../utils/constants';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { classes, ellipsesIcon } from '@jupyterlab/ui-components';
import { ElementExt } from '@lumino/domutils';
import * as React from 'react';
import { TableOfContents } from '../..';
import { INotebookHeading, RunningStatus } from '../../tokens';
import { sanitizerOptions } from '../../utils/sanitizer_options';
import { OptionsManager } from './options_manager';
import { CodeCellComponent } from './codecell';

/**
 * Class name of the toc item list.
 *
 * @private
 */
const TOC_TREE_CLASS = 'jpcodetoc-TableOfContents-content';

/**
 * Renders a notebook table of contents item.
 *
 * @param options - generator options
 * @param tracker - notebook tracker
 * @param item - notebook heading
 * @param toc - current list of notebook headings
 * @returns rendered item
 */
export function render(
  options: OptionsManager,
  tracker: INotebookTracker,
  widget: TableOfContents,
  item: INotebookHeading,
  toc: INotebookHeading[] = []
): JSX.Element | null {
  if (item.type === 'markdown' || item.type === 'header') {
    const fontSizeClass = `jpcodetoc-toc-level-size-${item.level}`;
    const numbering = item.numbering && options.numbering ? item.numbering : '';
    const cellCollapseMetadata = options.syncCollapseState
      ? MARKDOWN_HEADING_COLLAPSED
      : UNSYNC_MARKDOWN_HEADING_COLLAPSED;

    if (item.type === 'header' || options.showMarkdown) {
      const header = item.html ? (
        <span
          dangerouslySetInnerHTML={{
            __html:
              numbering +
              options.sanitizer.sanitize(item.html, sanitizerOptions)
          }}
          className={`jpcodetoc-${item.type}-cell jpcodetoc-toc-cell-item`}
        />
      ) : (
        <span className={`jpcodetoc-${item.type}-cell jpcodetoc-toc-cell-item`}>
          {numbering + item.text}
        </span>
      );

      if (item.type === 'header') {
        const button = (
          <div
            className="jp-Collapser p-Widget lm-Widget"
            onClick={(event: any) => {
              event.stopPropagation();
              onClick(tracker, cellCollapseMetadata, item);
            }}
          >
            <div className="jpcodetoc-toc-Collapser-child" />
          </div>
        );

        const collapsed = item.cellRef!.model.getMetadata(
          cellCollapseMetadata
        ) as boolean;

        const ellipseButton = collapsed ? (
          <div
            className="jpcodetoc-toc-Ellipses"
            onClick={(event: any) => {
              event.stopPropagation();
              onClick(tracker, cellCollapseMetadata, item);
            }}
          >
            <ellipsesIcon.react />
          </div>
        ) : null;

        return (
          <NotebookHeading
            isActive={
              tracker.activeCell === item.cellRef ||
              previousHeader(tracker, item, toc)
            }
            className={'jpcodetoc-toc-entry-holder ' + fontSizeClass}
            isRunning={item.isRunning}
            area={widget.node.querySelector(`.${TOC_TREE_CLASS}`)}
          >
            {button}
            {header}
            {ellipseButton}
          </NotebookHeading>
        );
      } else {
        // markdown
        return (
          <div className={'jpcodetoc-toc-entry-holder ' + fontSizeClass}>
            <span
              className={`jpcodetoc-${item.type}-cell jpcodetoc-toc-cell-item`}
            >
              {numbering + item.text}
            </span>
          </div>
        );
      }
    }
  }

  if (options.showCode && item.type === 'code') {
    // if undefined, display as text
    const languageMimetype =
      tracker.currentWidget?.model?.metadata.language_info?.mimetype || 'text';
    // Render code cells:
    return (
      <div className="jpcodetoc-toc-code-cell-div">
        <div className="jpcodetoc-toc-code-cell-prompt">{item.prompt}</div>
        <span className={'jpcodetoc-toc-code-span'}>
          <CodeCellComponent
            cellInput={item.text}
            languageMimetype={languageMimetype}
          />
          {/* <CodeComponent sanitizer={options.sanitizer} heading={item} /> */}
        </span>
      </div>
    );
  }

  return null;

  /**
   * Callback invoked upon encountering a "click" event.
   *
   * @private
   * @param heading - notebook heading that was clicked
   */

  function onClick(
    tracker: INotebookTracker,
    cellCollapseMetadata: string,
    heading?: INotebookHeading
  ) {
    let collapsed = false;
    const syncCollapseState = options.syncCollapseState;
    if (heading!.cellRef!.model.getMetadata(cellCollapseMetadata)) {
      collapsed = heading!.cellRef!.model.getMetadata(
        cellCollapseMetadata
      ) as boolean;
    }
    if (heading) {
      if (syncCollapseState) {
        // if collapse state is synced, update state here
        if (tracker.currentWidget) {
          NotebookActions.setHeadingCollapse(
            heading!.cellRef!,
            !collapsed,
            tracker.currentWidget.content
          );
        }
      } else {
        if (collapsed) {
          heading!.cellRef!.model.deleteMetadata(cellCollapseMetadata);
        } else {
          heading!.cellRef!.model.setMetadata(cellCollapseMetadata, true);
        }
      }
      options.updateAndCollapse({
        heading: heading,
        collapsedState: collapsed,
        tocType: 'notebook'
      });
    } else {
      options.updateWidget();
    }
  }
}

/**
 * Used to find the nearest above heading to an active notebook cell
 *
 * @private
 * @param tracker - notebook tracker
 * @param item - notebook heading
 * @param toc - current list of notebook headings
 * @returns true if heading is nearest above a selected cell, otherwise false
 */
function previousHeader(
  tracker: INotebookTracker,
  item: INotebookHeading,
  toc: INotebookHeading[]
) {
  if (item.index > -1 || toc?.length) {
    const activeCellIndex = tracker.currentWidget!.content.activeCellIndex;
    const headerIndex = item.index;
    // header index has to be less than the active cell index
    if (headerIndex < activeCellIndex) {
      const tocIndexOfNextHeader = toc.indexOf(item) + 1;
      // return true if header is the last header
      if (tocIndexOfNextHeader >= toc.length) {
        return true;
      }
      // return true if the next header cells index is greater than the active cells index
      const nextHeaderIndex = toc?.[tocIndexOfNextHeader].index;
      if (nextHeaderIndex > activeCellIndex) {
        return true;
      }
    }
  }
  return false;
}

type NotebookHeadingProps = React.PropsWithChildren<{
  isActive: boolean;
  className: string;
  area: Element | null;
  isRunning?: RunningStatus;
}>;

/**
 * React component for a single toc heading
 *
 * @private
 */
function NotebookHeading(props: NotebookHeadingProps): JSX.Element {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const isActive = props.isActive;
  React.useEffect(() => {
    if (isActive && itemRef.current && props.area) {
      ElementExt.scrollIntoViewIfNeeded(
        props.area,
        itemRef.current.parentElement as Element
      );
    }
  }, [isActive]);
  return (
    <div
      ref={itemRef}
      className={classes(
        props.className,
        isActive ? 'jpcodetoc-toc-active-cell' : ''
      )}
      data-running={props.isRunning}
    >
      {props.children}
    </div>
  );
}
