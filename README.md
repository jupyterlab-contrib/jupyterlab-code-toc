# Table of Contents Extension with Code & Markdown

[![PyPI version](https://img.shields.io/pypi/v/jupyterlabcodetoc.svg)](https://pypi.org/project/jupyterlabcodetoc/)
[![Github Actions Status](https://github.com/Rmarieta/jupyterlab-code-toc/workflows/Build/badge.svg)](https://github.com/Rmarieta/jupyterlab-code-toc/actions/workflows/build.yml)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/Rmarieta/jupyterlab-code-toc/main?urlpath=lab)

JupyterLab Table of Contents extension that includes code cells and markdown content other than headings.

## Demonstration

The code cell display can be toggled on/off, and so is the markdown cell content. Table of contents entries can also be filtered by cell metadata tags with the toolbar button on the right.

![demo_gif](https://github.com/Rmarieta/jupyterlab-code-toc/assets/33026272/994ca4b3-b0f5-4d9a-9b55-c6f927ac0206)

## Requirements

- JupyterLab >= 4.0.0

## Install

To install the extension, execute:

```bash
pip install jupyterlabcodetoc
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlabcodetoc
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlabcodetoc directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyterlabcodetoc
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlabcodetoc` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)
