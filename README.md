# ElectrOS

ElectrOS is the official desktop client application for [Elemento](https://elemento.cloud), designed to enhance your cloud computing experience with seamless integration and advanced features. Built with Electron, it offers a rich, native user interface that bridges the gap between cloud resources and desktop convenience.

## Features

- **Seamless Cloud Integration**: Directly manage your Elemento cloud resources without the need for a web browser.
- **Cross-Platform Support**: Available for Windows, macOS, and Linux.
- **Advanced Security**: Incorporates the latest security protocols to ensure your data and operations are safe.
- **Customizable Interface**: Tailor the app to your needs with customizable settings and themes.
- **Offline Capabilities**: Some features are available offline, providing flexibility in how and where you work.

## Getting Started

To get started with ElectrOS, follow these simple steps:

1. **Download the Application**: Visit the [releases page](https://github.com/Elemento-Modular-Cloud/electros/releases) to download the latest version of ElectrOS for your operating system.
2. **Install**: Open the downloaded file and follow the installation instructions.
3. **Launch ElectrOS**: Once installed, launch ElectrOS and log in with your Elemento credentials.

## Automate the build (on macos)

[useful link](https://hackmd.io/@fferrando/rkpHytli0)

## CI/CD
![Develop Branch](https://github.com/Elemento-Modular-Cloud/elemento-gui/actions/workflows/nightly.yml/badge.svg?branch=develop)

## Building from Source

If you prefer to build ElectrOS from source, ensure you have Node.js and Yarn installed, then follow these steps:

```sh
git clone https://github.com/Elemento-Modular-Cloud/electros.git
cd electros
yarn install
yarn build
```

## Branches and Versioning manager: git-flow 

This guide is intended to be used by every developer who wants to hanlde software develoment on elemento-gui web app in a smart and fashionable way.
First of all you have to install git-flow depending on your machine, so please follow this guide for installation references.
> https://danielkummer.github.io/git-flow-cheatsheet/

### Development

In order to enable git-flow inside the project, you must to run this simple command below and follow the steps.
```
git flow init
```

When you want to develop a new feature or simply work on some minor improvements all together, you can simply create a new feature branch like this:
```
git flow feature start MYFEATURE
```
and when you'll be done with your software, you can simply `finish` the branch merging it into `develop` branch

```
git flow feature finish MYFEATURE
```

Maybe, if you're working with someone else on the same `feature branch`, please publish your changes sometimes with this command
```
git flow feature publish MYFEATURE
```
then if you're working on a modified feature branch, update your branch running this command
```
git flow feature pull origin MYFEATURE
```

### Versioning

### TL;DR
> Run `sh ./tools/publish <version-number>` to execute the git-flow publish strategy all-in-one.
