// import type { StorybookConfig } from '@storybook/react-vite';

// const config: StorybookConfig = {
//   "stories": [
//     "../src/**/*.mdx",
//     "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
//   ],
//   "addons": [
//     "@chromatic-com/storybook",
//     "@storybook/addon-vitest",
//     "@storybook/addon-a11y",
//     "@storybook/addon-docs",
//     "@storybook/addon-onboarding"
//   ],
//   "framework": "@storybook/react-vite"
// };
// export default config;

import { defineMain } from '@storybook/react-vite/node';
import addonA11y from '@storybook/addon-a11y';
import addonVitest from '@storybook/addon-vitest';
import addonChromatic from '@chromatic-com/storybook';
import addonDocs from '@storybook/addon-docs';

export default defineMain({
  stories: [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  framework: "@storybook/react-vite"
});
