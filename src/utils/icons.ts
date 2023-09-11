import { LabIcon } from '@jupyterlab/ui-components';
import tocIconStr from '../../style/icons/toc_icon_2.svg';
import { PLUGIN_ID } from './constants';

export const tocIcon = new LabIcon({
  name: `${PLUGIN_ID}:code-toc-icon`,
  svgstr: tocIconStr
});
