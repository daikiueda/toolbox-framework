# Electron Workspace Utilities

## Mounting Workspace GUIs

The tab list that appears in the Electron shell is defined in `packages/__electron/entries.ts`. Add a new entry there to surface another workspace GUI. Typical flow:

1. Import the workspace root component (for example, `import { MyFeatureApp } from '@toolbox/my-feature';`).
2. Append an object to `entries` with a unique key, a `label` string, and the component reference.

```ts
import { MyFeatureApp } from '@toolbox/my-feature';

const entries = {
  ...,
  myFeature: {
    label: 'My Feature',
    App: MyFeatureApp,
  },
};
```

Restart (or reload) the Electron app and the new label will show up as a tab. Because each GUI is still bundled by Vite, you can keep `npm run dev` running alongside `npm run --workspace packages/<feature-name> gui` for hot reloading while the Electron shell hosts the mounted app.

## App Icon Generation

The Electron workspace ships with a helper script that regenerates platform-specific app icons from a single PNG source. Drop a high-resolution PNG (512px or larger; 1024px recommended) into `packages/__electron/resources/app-icon.png` (or replace `resources/icon.png` directly) and run:

```bash
npm run icon:generate
```

The script will copy the source PNG to `resources/icon.png`, automatically downscale it to 512px for `build/icon.png` (Linux builds), and then use the bundled `app-builder` utility to produce the matching `build/icon.icns` and `build/icon.ico` files. If you want to try a one-off file without moving it into `resources/`, pass the path as an argument:

```bash
npm run icon:generate -- ./path/to/custom-icon.png
```

This keeps the build resources that Electron Builder relies on (`packages/__electron/build`) aligned with the latest PNG source before you run any packaging commands.

- macOS specific artwork: place a square `icon-with-backdrop.png` (typically 1024px) alongside `icon.png` under `packages/__electron/resources/`. The generator prefers this file when producing `icon.icns`, and falls back to `icon.png` if it is absent.
