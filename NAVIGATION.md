# Navigation

Based on https://github.com/tobiascervin/spacerizr

Go to `doc/architecture`, then run `npm init`. It will create a default `package.json` file (go with all the defaults).


Install 'spacerizr` as a development package:

```
npm install spacerizr --save-dev
```

Update `package.json` with the scripts:

```
{
  "name": "architecture",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "commonjs",
  "main": "index.js",
  "scripts": {
    "arch": "spacerizr decisions/",
    "arch:workspace": "spacerizr ./",
    "arch:export": "spacerizr decisions/ --export svg",
    "arch:watch": "spacerizr decisions/ --watch",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "npx": "^10.2.2"
  },
  "devDependencies": {
    "spacerizr": "^1.0.0"
  }
}
```
package.json

**Note**: the version of spacerizr may differ.

## Interactive Viewer

```
spacerizr workspace.dsl # altenatively, npm run arch:workspace
```

```
spacerizr decisions/ --port 3000
```

```
spacerizr decisions/ --watch # altenatively, npm run arch:watch
```

## Headless SVG export (no browser needed)

```
spacerizr workspace.dsl --export svg
```

```
spacerizr workspace.dsl --export svg --output architecture.svg
```

```
spacerizr workspace.dsl --export svg --theme light
```

```
spacerizr decisions/ --export svg   # exports all files
```

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| ? | Show this help |
| P | Enter presentation mode |
| F | Zoom to fit |
| Backspace | Go up one level |
| Click | Drill into element |
| Scroll | Zoom in/out |
| Drag | Rotate (3D) / Pan (2D) |
| Ctrl+V | Paste DSL content |
| / | Search |
| | |

In Presentation Mode:

| Key | Action |
| --- | --- |
| ← → | Previous / Next slide |
| L or 1 | Toggle laser pointer |
| 2 | Toggle Spotlight |
| v | Toggle between 3D and 2D |
| Esc | Exit presentation |
| | |

In the floating menu when in Presentation Mode, you also have the option to:

- Export as HTML presentation
- Export as PowerPoint