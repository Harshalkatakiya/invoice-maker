/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
import baseConfig from '@harshalkatakiya/prettier-config';

const config = {
  ...baseConfig,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/globals.css',
  tailwindFunctions: ['cn']
};

export default config;
