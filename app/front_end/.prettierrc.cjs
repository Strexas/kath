module.exports = {
  printWidth: 120,                    // max 120 chars in line, code is easy to read
  useTabs: false,                     // use spaces instead of tabs
  tabWidth: 2,                        // "visual width" of of the "tab"
  trailingComma: 'es5',               // add trailing commas in objects, arrays, etc.
  semi: true,                         // add ; when needed
  singleQuote: true,                  // '' for strings instead of ""
  bracketSpacing: true,               // import { some } ... instead of import {some} ...
  arrowParens: 'always',              // braces even for single param in arrow functions (a) => { }
  jsxSingleQuote: true,               // '' for react props, like in html
  bracketSameLine: false,             // pretty JSX
  endOfLine: 'lf',                    // 'lf' for '\n'
  embeddedLanguageFormatting: 'auto', // Automatically formats embedded code.

  // Import-related plugins and configurations
  plugins: ['prettier-plugin-import-sort', 'prettier-plugin-organize-imports'],
  importOrder: ['^react', '^[^@]', '^@'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
