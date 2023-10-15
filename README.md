# Site Indicator

A tiny extension to help me learn more about AntD and how extensions work.

Boilerplate used to create this project: [Chrome Extension (MV3) Boilerplate with React 18 and Webpack 5][boilerplate].

## Installing and Running

1. Install dependencies with `npm ci`.
1. Run the local web server with `npm start`.
1. Load the extension on Brave/Chrome:
   1. Access the extensions page (e.g., `brave://extensions`, `chrome://extensions`).
   1. Check `Developer mode`.
   1. Click on `Load unpacked`.
   1. Select the `build` folder.

## Release process

In order to release a new version, follow these steps:

1. Update the `version` in `package.json`.
1. Run `npm install` (this will update the lock file).
1. Create a tag in GitHub with the pattern `v*` (use the same version declared in `package.json`).

[boilerplate]: https://github.com/lxieyang/chrome-extension-boilerplate-react
