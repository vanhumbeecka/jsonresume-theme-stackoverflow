# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a JSON Resume theme called "stackoverflow" that renders resumes based on the [JSON Resume schema](https://jsonresume.org/schema/). The theme uses Handlebars templates to generate HTML resumes with a Stack Overflow-inspired design.

## Development Commands

### Running the development server
```bash
npm start
# Or directly:
npx resume-cli serve --theme .
```
This serves the resume at a local URL with hot-reloading.

### Running tests
```bash
npm test
```
Runs Jest tests with coverage and verbose output.

### Updating test snapshots
```bash
npm run updateTestSnapshots
# Or:
jest --updateSnapshot
```
Use this after intentionally changing the HTML output of the render function.

### Building for production
```bash
npx resume-cli export build/index.html --theme .
```
Exports the resume to a static HTML file. This is also used in the GitHub Pages deployment workflow.

### Exporting to Markdown
```bash
npm run exportMarkdown
```
Converts `resume.json` to `build/resume.md` in a clean markdown format optimized for AI parsing. The script is located in `scripts/jsonToMarkdown.js`.

## Architecture

### Main Entry Point (`index.js`)
The core module that exports:
- `render(resume)`: Main function that takes a JSON resume object and returns rendered HTML
- `pdfRenderOptions`: Configuration for PDF export (margin settings)

The render function:
1. Loads CSS from `style.css`
2. Loads the main template from `resume.hbs`
3. Registers all Handlebars helpers from `theme/hbs-helpers/`
4. Registers all partials from `theme/partials/`
5. Compiles and returns the final HTML

### Template System

**Main template**: `resume.hbs` - Simple HTML structure that includes CSS and renders partials

**Partials** (`theme/partials/`): Each section of the resume (basics, work, education, skills, etc.)

**Handlebars Helpers** (`theme/hbs-helpers/`):
- `birthDate`: Formats birth date with place and state
- `MY`: Formats dates as "Month Year" (e.g., "Jul 2020")
- `Y`: Formats dates as year only (e.g., "2020")
- `DMY`: Formats dates as "Day Month Year"
- `paragraphSplit`: Splits text on newlines, renders markdown, wraps in `<p>` tags
- `toLowerCase`: Converts text to lowercase
- `spaceToDash`: Replaces spaces with dashes (used for Font Awesome icon names)

All date helpers use `moment.js` for parsing and formatting.

### Testing

Tests are in the `test/` directory:

**`test/SimpleTests.test.js`**:
- Basic render functionality test
- HTML validation using `html-validate`
- Snapshot testing to catch unintentional HTML changes
- Test output is written to `test/TestOutput/` for inspection

**`test/JsonToMarkdown.test.js`**:
- Tests for the JSON to Markdown conversion script
- Validates proper formatting of all resume sections
- Tests edge cases (minimal data, date formatting, social profiles)

### Resume Data

The theme expects a `resume.json` file in the root directory following the [JSON Resume schema](https://jsonresume.org/schema/).

**Extended fields** (beyond standard schema):
- `keywords`: Can be added to 'work', 'publication', and 'volunteer' items
- `summary`: Can be added to 'interests' and 'education' items
- `birth`: Can be added to 'basics' with structure:
  ```json
  "birth": {
    "place": "New York",
    "state": "USA",
    "date": "1988"
  }
  ```

### Social Profile Icons

The theme uses Font Awesome 6.4.2 for social icons. All Font Awesome brand icons are supported, with custom colors defined in `style.css` for: github, stack-overflow, linkedin, dribbble, twitter, facebook, pinterest, instagram, soundcloud, wordpress, youtube, flickr, google plus, tumblr, foursquare.

The `network` field in the resume JSON is converted to Font Awesome icon names by lowercasing and replacing spaces with dashes.

### Scripts

**`scripts/jsonToMarkdown.js`**: Converts resume.json to markdown format.
- Exports `convertResumeToMarkdown(resume)` function for programmatic use
- Can be run directly via `npm run exportMarkdown`
- Outputs to `build/resume.md`
- Handles all JSON Resume schema sections with clean, hierarchical markdown formatting
- Optimized for AI parsing (clear structure, consistent formatting)

## Deployment

GitHub Actions workflow (`.github/workflows/static.yml`) automatically deploys to GitHub Pages on pushes to main branch. The workflow installs dependencies, builds the resume, and deploys to Pages.