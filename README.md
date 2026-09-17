# EECS 581 Project 1 - Minesweeper

The project uses TypeScript and runs in a web browser.

## Prerequisites

- Node.js installed from [nodejs.org](https://nodejs.org/). Use an active LTS release.
- Git installed

Check that Node.js and npm are available:

```bash
node --version
npm --version
```

## Initial setup

1. Clone the repository
2. Open the repository folder in VS Code (or any IDE).
3. Open a terminal at the repository root. The folder containing `package.json`.
4. Install the project dependencies:

   ```bash
   npm install
   ```

5. Compile the TypeScript source:

   ```bash
   npm run build
   ```

If the build completes without errors, the local TypeScript setup is working.

## Running the project

Start the local web server with:

```bash
npm run start
```

Open the localhost URL printed in the terminal, usually `http://localhost:XXXX`. Keep the server terminal open while using the game. Stop it with `Ctrl+C`.

The browser loads the compiled files from `dist/`, not the TypeScript files directly. *ALWAYS* run `npm run build` again after changing a file in `src/`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies from `package.json`. |
| `npm run build` | Compile `src/**/*.ts` into `dist/`. |
| `npm test` | Run the current project validation build. |
| `npm run watch` | Recompile automatically when source files change. |
| `npm run start` | Serve the project files locally in a browser. |

For an efficient development workflow, use two terminals: run `npm run watch` in one and `npm run start` in the other.

## Project structure

```text
index.html       Browser entry page
style.css        Page and board styling
package.json     Scripts and dependency definitions
tsconfig.json    TypeScript compiler configuration
src/types.ts     Shared board, cell, coordinate, and game-state types
src/game.ts      Game rules and board behavior
src/ui.ts        Browser UI and board rendering
src/main.ts      Application startup and event wiring
dist/            Generated JavaScript output; created by the build
```


## Working with Git

Before starting work, update your local branch:

```bash
git pull
```

Create a descriptive feature branch instead of working directly on `main`:

```bash
git switch -c feature/short-description
```

After making changes:

```bash
npm test
git status
git add <files-you-changed>
git commit -m "Describe the change"
git push -u origin feature/short-description
```

Open a pull request for review and explain what changed, how it was tested, and anything the next contributor should know. Avoid committing generated `dist/` files unless the group specifically decides that they belong in version control.

## Troubleshooting

### `npm` or `node` is not recognized

Install Node.js, restart VS Code, and verify the installation with `node --version` and `npm --version`.

### The build cannot find a package

Run `npm install` from the repository root, then run `npm run build` again. Make sure the terminal is not inside the `src/` folder.

### The browser shows an old version

Run `npm run build`, refresh the browser, and check that the server is serving this repository rather than a different folder.

### The page is blank or the board is missing

Open the browser developer console and check for errors. Confirm that `dist/` exists and that `npm run build` completed successfully. Also confirm that the page contains the expected `board` element in `index.html`.
