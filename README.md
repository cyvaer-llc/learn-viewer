# Learn Viewer
## Overview
This project is a browser app that loads and renders `.md` files created for the Learn platform.

As-is, these markdown files contain custom tags and are associated with YAML configuration that make them hard to navigate outside of the Learning Management System (LMS) they were created to be consumed by. This tool parses the metadata and renders the markdown so that it's possible to view open source curriculum created in this format without needing access to the full LMS. This means you're able to see the course content in a fashion similar to how it's intended to be presented, and that you can interact with any challenges that don't require integration with the LMS. If you use the viewer, you should note that course progress won't be persisted or shared (with you or with anyone else) outside of the browser itself.

To learn more about the Learn course format, see: [Curriculum Structure](./docs/curriculum-structure.md).

## Install and run locally
This is a Vite app. To run it on your computer, make sure you have `node` installed and that `node -v` is the same as the version in [.nvmrc](./.nvmrc). Then, you can `git clone` this repo to a local folder and run these commands from the new folder it creates:

```sh
npm ci
npm run dev
```

This should open http://localhost:5173/ automatically and you should see the app running.

## Testing
To run the automated tests in watch mode:

```sh
npm test:watch
```

We're using [vitest](https://vitest.dev/guide/) as the test runner. It's configured to find tests in any `.test.ts` or `.test.tsx` file, so you only need to add one of these files next to your source code in order to add tests.

## Contributing
Contributions are welcome to this project.
- If you are outside of the organization, you may fork the repository to create branches and submit a PR based on a branch from your fork.
- If you wish to make more frequent contributions or help administer the project, please contact one of the [contributors](https://github.com/cyvaer-llc/learn-viewer/graphs/contributors).

## Deployment
CICD is being handled by AWS Amplify.
- When you create a PR, AWS Amplify will build your code and deploy a preview build. This is a great place to manually test that your changes work in a production-like environment.
- After a change is merged, Amplify will build the `main` branch and automatically deploy it.

## Documentation
Some of the design and architecture decisions are explained in the docs folder. Note: The documentation does not explain how to *use* the app. If you'd like to [contribute](#contributing) that documentation, you are welcome!

See: [docs](./docs/)

## Leftover project setup / TODOs:

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
