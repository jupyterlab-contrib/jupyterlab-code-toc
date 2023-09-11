import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the jupyterlabcodetoc extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlabcodetoc:plugin',
  description: 'JupyterLab Table of Contents extension that includes code cells and markdown content other than headings.',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension jupyterlabcodetoc is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupyterlabcodetoc settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for jupyterlabcodetoc.', reason);
        });
    }
  }
};

export default plugin;
