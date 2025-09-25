# Electron Workspace Utilities

## App Icon Generation

The Electron workspace ships with a helper script that regenerates platform-specific app icons from a single PNG source. Drop a high-resolution PNG (512px or larger) into `packages/__electron/resources/app-icon.png` (or replace `resources/icon.png` directly) and run:

```bash
npm run icon:generate
```

The script will copy the source PNG to `resources/icon.png`, sync `build/icon.png`, and then use the bundled `app-builder` utility to produce the matching `build/icon.icns` and `build/icon.ico` files. If you want to try a one-off file without moving it into `resources/`, pass the path as an argument:

```bash
npm run icon:generate -- ./path/to/custom-icon.png
```

This keeps the build resources that Electron Builder relies on (`packages/__electron/build`) aligned with the latest PNG source before you run any packaging commands.
