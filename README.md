# Site Indicator

Tell production from staging at a glance: a ribbon on the page and a badge on the tab icon for the websites you choose.

Site Indicator draws a ribbon or a triangle on the pages that match your rules and adds a badge to the tab icon, so a production page never looks like a staging one again. Rules are yours to define: a domain, a word, a pattern or an IP range, each with its own label, colors and position.

Install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/site-indicator/jpipimaonfgahpepmjnhbbafgceikfal).

## Features

- Match rules: Exact, Contains words, Starts with, Ends with, Regular expression, CIDR v4 and CIDR v6.
- Indicator shapes: ribbon, triangle or frame, placed in any corner of the page, with a custom color, label color, size and opacity.
- An optional prefix before the page title, so the tab strip shows the environment too.
- A badge on the tab icon, so the indicator is visible even when the page is not.
- One switch to turn all indicators on or off, and one per rule to switch it off without deleting it.
- Clone a rule to start the next one from it.
- Import and export of the whole configuration as a JSON file.
- Search across labels, values and match rules, and a table sort that is remembered across sessions.
- The popup marks the rules that match the current page.
- Light and dark theme, following the system setting.

## Usage

1. Open the extension popup and click `Preferences`.
1. Click `Add site` and fill in the form:
   - `Label`: the text drawn on the indicator.
   - `Match Rule` and `Value`: what the page domain is compared against. The description below the field explains each rule.
   - `Shape`, `Placement`, `Color` and `Label Color`: how the indicator looks.
   - `Title prefix`, optional: text put before the page title, for example `[PROD]`.
1. Reload the pages you already had open.

Two details worth knowing:

- A value pasted as a URL is reduced to its domain before it is saved, so `https://www.example.com/path` becomes `www.example.com`.
- CIDR rules compare the address returned by the resolver, which can differ from the address the browser used. Prefer a domain rule when you can.

## Privacy

The extension does not collect or send any data, with one optional exception. CIDR rules need the IP address of the page, so when the page address is a hostname it must be resolved. Resolution uses DNS over HTTPS through Cloudflare or Google nameservers and sends the hostnames of the pages you visit to those providers. It is disabled by default and can be enabled with the "DNS over HTTPS" switch in Preferences.

Permissions: `storage` keeps your rules in Chrome sync storage, `tabs` opens the Preferences page, and the content script runs on every page to draw the indicator.

## Limits

Sites are stored in [Chrome sync storage](https://developer.chrome.com/docs/extensions/reference/api/storage#property-sync), which holds at most 512 items and 100 KB in total and accepts at most 120 writes per minute. Each site takes one item and about 250 bytes, so the practical limit is around 400 sites. Preferences shows the current usage, and Chrome reports an error when a limit is reached.

## Development

The Node version is pinned in `.tool-versions`, so `mise install` or `asdf install` gives you the right one.

1. Install dependencies with `npm ci`.
1. Run the development server with `npm start`. It writes a development build to `build/` and reloads the extension when a file changes.
1. Load the extension on Brave/Chrome:
   1. Access the extensions page (e.g., `brave://extensions`, `chrome://extensions`).
   1. Check `Developer mode`.
   1. Click on `Load unpacked`.
   1. Select the `build` folder.

| Script              | What it does                                                      |
| ------------------- | ----------------------------------------------------------------- |
| `npm start`         | Development server with auto reload.                              |
| `npm run build`     | Production build in `build/` and the store package in `zip/`.     |
| `npm run lint`      | ESLint.                                                           |
| `npm run typecheck` | TypeScript, without emitting files.                               |
| `npm run fmt`       | Prettier, rewriting the files.                                    |
| `npm run fmt:check` | Prettier, failing when a file is not formatted. CI runs this one. |

## Release process

1. Update the `version` in `package.json`.
1. Run `npm install` to update the lock file.
1. Create a tag with the pattern `v*`, using the version declared in `package.json`, and push it:
   - e.g., `git tag v<version> && git push origin v<version>`

CI then builds the extension, creates the GitHub release with the zip attached, and uploads it to the Chrome Web Store. The `publisher-id` in the release workflow belongs to this extension, so a fork needs its own, together with the `CLIENT_ID`, `CLIENT_SECRET` and `REFRESH_TOKEN` secrets.

## License

[Apache License 2.0](LICENSE).
