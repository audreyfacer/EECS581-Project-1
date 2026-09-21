# EECS 581 Project 1 - Minesweeper

The project uses TypeScript and runs in a web browser.

## Directory structure:
```bash
└── audreyfacer-eecs581-project-1/
    ├── README.md
    ├── index.html
    ├── package.json
    ├── QA_test.md
    ├── style.css
    ├── tsconfig.json
    └── src/
        ├── game.test.ts
        ├── game.ts
        ├── main.ts
        ├── types.ts
        └── ui.ts
```

## Docs
For detailed documentation about the project management / hours accounting open tracker excel file. System design can be found in the Docs folder within the excel tracker. Prologue comments and inline comments explain every section of code in the project.

## Running The App Prerequisites

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
