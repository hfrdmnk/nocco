# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Nocco**, a minimal Hugo theme for Micro.blog, based on the Pure theme. The theme emphasizes semantic HTML, readability without CSS/JavaScript, and simplistic styling. It's designed to be a good base for customization.

## Development

### Local Preview

```bash
cd exampleSite
hugo server
```

Site will be at http://localhost:1313/

### Code Formatting

- **Prettier** formats `*.js` and `*.md` files (runs automatically in GitHub Actions)
- **Super-Linter** validates code on PRs
- Uses **tabs** instead of spaces (configured in `.github/linters/`)

## Architecture

### Layout Structure

```
layouts/
├── _default/
│   ├── baseof.html     # Base template with head, header, nav, main, footer
│   ├── list.html       # List pages
│   └── single.html     # Individual post pages
├── partials/           # Reusable components (head, header, footer, navigation, etc.)
├── page/single.html    # Static page layout
├── section/replies.html
├── index.html          # Homepage with paginated posts
└── 404.html
```

### Key Patterns

- Templates use Hugo's `{{ partial }}` for component inclusion
- CSS uses CSS custom properties (`:root` variables) for theming
- Supports automatic dark mode via `prefers-color-scheme` media query
- Microformats2 classes (`h-entry`, `p-name`, `dt-published`, `u-url`) for IndieWeb compatibility
- Plugin support via `plugins_css`, `plugins_js`, and `plugins_html` site params

### Theme Variables

CSS color scheme defined in `static/css/style.css`:

- `--background`, `--background-alt`
- `--text`, `--text-alt`
- `--accent`, `--accent-alt`
