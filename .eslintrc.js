module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
      "airbnb-base",
      "plugin:@typescript-eslint/recommended",
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended",
      "import"
    ],
    "settings": {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"]
      },
      "import/resolver": {
        // use <root>/tsconfig.json
        "typescript": {
          "alwaysTryTypes": true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
        },

        // use <root>/path/to/folder/tsconfig.json
        "typescript": {
          "directory": "<root>/tsconfig.json"
        },

    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
      "@typescript-eslint/explicit-function-return-type": "off"
    }
};