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
      // "import/resolver": {
      //   // use <root>/path/to/folder/tsconfig.json
      //   "typescript": {
      //     "directory": "<root>/tsconfig.json"
      //   },
      // }
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
      "@typescript-eslint/explicit-function-return-type": "off",
      "class-methods-use-this": "off",
      "import/no-unresolved": "off",
      "import/prefer-default-export": "off",
      "import/extensions": "off",
      "no-param-reassign": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "consistent-return": "off",
      "no-unused-expressions": "off"
    }
}
