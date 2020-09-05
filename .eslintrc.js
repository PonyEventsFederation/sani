module.exports = {
   parser: "@typescript-eslint/parser",
   parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module"
   },
   extends: "plugin:@typescript-eslint/recommended",
   env: {
      node: true,
      es6: true
   },
   rules: {
      "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
      "comma-dangle": ["error", "never"],
      "comma-spacing": "error",
      "comma-style": "error",
      "dot-location": ["error", "property"],
      "handle-callback-err": "off",
      "indent": ["error", 3],
      "max-nested-callbacks": ["error", { "max": 4 }],
      "max-statements-per-line": ["error", { "max": 2 }],
      "no-console": "off",
      "no-floating-decimal": "error",
      "no-inline-comments": "error",
      "no-lonely-if": "error",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
      "no-trailing-spaces": ["error"],
      "no-unused-vars": "warn",
      "object-curly-spacing": ["error", "always"],
      "prefer-const": "error",
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "space-before-blocks": "error",
      "space-before-function-paren": ["error", {
         "anonymous": "never",
         "named": "never",
         "asyncArrow": "always"
      }],
      "space-in-parens": "error",
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "spaced-comment": "error",
      "yoda": "error",
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-inferrable-types": 0,
      "@typescript-eslint/explicit-module-boundary-types": 1,
      "@typescript-eslint/no-var-requires": 1,
      "@typescript-eslint/no-empty-function": 1
   }
};
