# toolbox-template

Template for a pool of miscellaneous features with GUI

## for Developer

### Steps to add a new feature

```bash
npm run create:workspace -- <feature-name>
```

This automatically:

- Copies the template to `packages/<feature-name>`
- Updates `package.json` (name and bin)
- Adjusts GUI heading text
- Runs initial setup (npm install + CLI build)

---

# An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
