# Three.js Journey Course Exercises

This repository contains the exercises for the [Three.js Journey Course](https://threejs-journey.com/).

Great appreciation to Bruno Simon for the wonderful course.

## Features

- Type safety with [TypeScript](https://www.typescriptlang.org/).

- Uses [Vite](https://vitejs.dev/) for development and bundling.

- Uses `yarn workspace` to reduce redundant dependencies like `three` and `gsap`.

- Quality tools like [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) are configured. Check [@umijs/fabric](https://github.com/umijs/fabric/) for rules.

## Folder Structure

```
├── starter-packs       # Starter packs for the course.
│   ├── 04-local-server.zip
│   ├── ...
│
├── exercise            # Exercises for the course.
│   ├── 04-local-server
│   │   ├── src                     # Source code for the exercise.
│   │   ├── package.json            # Dependencies for the exercise.
│   │   └── vite.config.{js,ts}     # Vite configuration for the exercise.
│   ├── ...
│
├── final-projects      # Final projects zip files for the course.
│   ├── 04-local-server-final.zip
│   ├── ...
│
├── final               # Extracted from the final-projects folder. Contains the final projects for the course.
│   ├── 04-local-server-final
│   │   ├── src
│   │   ├── package.json
│   │   └── vite.config.{js,ts}
│   ├── ...
│
├── package.json & yarn.lock            # Dependencies for the whole project.
├── .eslintrc.cjs & .eslintignore       # ESLint configuration.
├── .prettierrc.cjs & .prettierignore   # Prettier configuration.
├── tsconfig.json                       # TypeScript configuration for the exercise.
├── r3f.d.ts                            # To make the intellisense for r3f's tags in IDE like Idea or WebStorm available.
└── README.md
```

## Getting Started

- Install dependencies

```bash
yarn
```

- Go to separate project folder and

```bash
yarn dev
```
