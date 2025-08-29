<h3 align='center'>ScribbleShot</h3>
<p align='center'>Chrome Extension</p>

<br />
<br />
<div align='center'>
   <img src='./assets/icon.png' width='64' />
</div>
<br />
<br />
<br />

**ScribbleShot** is a Chrome extension that allows you to draw annotations directly on web pages. With an intuitive drawing interface, you can highlight important content, add visual notes, and capture annotated screenshots for later reference or sharing.

![CSS Inspector Screenshot](assets/screenshot.png)

---

## Key Features

- **🎨 Drawing Tools**: Draw freehand annotations directly on any web page with customizable colors and brush sizes
- **🧽 Eraser Mode**: Easily remove unwanted annotations with the built-in eraser tool
- **🎨 Color Picker**: Choose from any color to match your annotation style or highlight different types of content
- **↩️ Undo/Redo**: Full history management with unlimited undo and redo capabilities for your drawings
- **📸 Screenshot Capture**: Take high-quality screenshots of the entire page including your annotations
- **🧹 Clear Canvas**: Quickly clear all annotations to start fresh

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/vscaperrotta/page-notes-chrome-extension
   ```
2. Install dependencies with Yarn:
   ```bash
   yarn install
   ```
3. Start the development environment:
   ```bash
   yarn dev
   ```
4. Create a production build:
   ```bash
   yarn build
   ```
5. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the generated `dist` folder.

---

## Available Scripts

Scripts can be run using Yarn:

- **Development**:
  ```bash
  yarn dev
  ```
  Starts the development environment with Vite.

- **Build**:
  ```bash
  yarn build
  ```
  Generates the production build.

- **Clear**:
  ```bash
  yarn clear
  ```
  Clean local dist folder.

---

## Project Structure

- **`assets/`**: Static resources such as images and icons.
- **`config/`**: Additional configuration files.
- **`public/`**: Static files not processed by the bundler.
- **`scripts/`**: Utility scripts for automation.
- **`src/`**: Source code for the extension.

---

## Main Dependencies

- **React** (`^19.0.0`) and **React DOM** (`^19.0.0`) for UI management.
- **Sass** (`^1.83.4`) for advanced styling.
- **webextension-polyfill** (`^0.12.0`) for cross-browser compatibility.
- **vite-plugin-static-copy** (`^2.2.0`) to manage static files.

---

## Requirements

- **Node.js**: >= 22.16.0
- **Package Manager**: Yarn (v4.5.0)

---

## License

This project is released under the [MIT](LICENSE.md) license. You are free to use, modify, and redistribute it under the terms of the license.

---

## Authors

Created by Vittorio Scaperrotta.

---

## Contributions

Contributions, bug reports, and suggestions are welcome! Open an issue or submit a pull request in the repository.

---

## Privacy

Refer to the [PRIVACY.md](PRIVACY.md) file for details on the privacy policy.

---

## Roadmap

Check the [TODO.md](TODO.md) file for a list of planned features and tasks.

