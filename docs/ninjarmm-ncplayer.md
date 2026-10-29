# Launching NCPlayer (`ninjarmm://`) from a Pake app

> **Disclaimer:** This is not an official NinjaOne feature but a workaround,
> provided "as is" without warranty, liability, or official support.

## Problem

NinjaOne starts NCPlayer for remote sessions through a hidden
`<iframe src="ninjarmm://...">`. Browsers hand that custom URL scheme to the
operating system. The system WebView used by Pake (WKWebView on macOS) does not,
so the page reports that NCPlayer is not installed even though it is.

## What this branch changes

- `src-tauri/tauri.conf.json`: extends the `plugins.shell.open` validation regex
  with `ninjarmm://`. The defaults (`http(s)`, `mailto`, `tel`) are unchanged.
- `scripts/ninjarmm-launch.js`: inject script that watches for iframes, embeds and
  links using `ninjarmm://` and passes them to `plugin:shell|open`.

## Build

```bash
pnpm install && pnpm run cli:build
node dist/cli.js https://your-instance.example/ --name "NinjaOne Demo" \
  --inject scripts/ninjarmm-launch.js --json
```

Status: macOS only, tested to build; the NCPlayer launch itself still has to be
confirmed against a real session.
