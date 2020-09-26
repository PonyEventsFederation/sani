module.exports = {
   parser: "@typescript-eslint/parser",
   parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      ecmaFeatures: {
         globalReturn: false,
         impliedStrict: true,
         jsx: false
      }
   },
   extends: "plugin:@typescript-eslint/recommended",
   env: {
      node: true,
      es2021: true
   },
   rules: {
      // disable base eslint rules in favour of typescript-eslint rules
      "brace-style": "off",
      "comma-dangle": "off",
      "comma-spacing": "off",
      "dot-notation": "off",
      "func-call-spacing": "off",
      "indent": "off",
      "init-declarations": "off",
      "keyword-spacing": "off",
      "lines-between-class-members": "off",

      // regular eslint rules
      "no-trailing-spaces": ["error"],

      // typescript-eslint rules
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": ["error", {
         default: "generic",
         readonly: "generic"
      }],
      // "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/ban-ts-comment": ["error", {
         "ts-expect-error": true,
         "ts-ignore": true,
         "ts-nocheck": true,
         "ts-check": true
      }],
      "@typescript-eslint/ban-tslint-comment": "error",
      "@typescript-eslint/ban-types": ["error", {
         types: {
            String: {
               message: "use string (lowercase s) instead, because String bad bad",
               fixWith: "string"
            },
            Number: {
               message: "use number (lowercase n) instead, because Number bad bad",
               fixWith: "number"
            },
            Boolean: {
               message: "use boolean (lowercase b) instead, because Boolean bad bad",
               fixWith: "boolean"
            },
            Symbol: {
               message: "use symbol (lowercase s) instead, because Symbol bad bad",
               fixWith: "symbol"
            },
            Object: {
               message: "use object (lowercase o) instead, because Object bad bad",
               fixWith: "object"
            }
         }
      }],
      "@typescript-eslint/brace-style": ["error", "1tbs", {
         allowSingleLine: true
      }],
      "@typescript-eslint/class-literal-property-style": ["error", "fields"],
      "@typescript-eslint/comma-dangle": ["error", "never"],
      "@typescript-eslint/comma-spacing": ["error", {
         before: false,
         after: true
      }],
      "@typescript-eslint/consistent-type-assertions": ["error", {
         assertionStyle: "as",
         objectLiteralTypeAssertions: "never"
      }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": ["error", {
         prefer: "no-type-imports",
         disallowTypeAnnotations: true
      }],
      "@typescript-eslint/default-param-last": "error",
      // "@typescript-eslint/dot-notation": ["error", {
      //    allowKeywords: true,
      //    allowPrivateClassPropertyAccess: false
      // }],
      "@typescript-eslint/explicit-function-return-type": ["error", {
         allowExpressions: false,
         allowTypedFunctionExpressions: true,
         allowHigherOrderFunctions: true,
         allowConciseArrowFunctionExpressionsStartingWithVoid: false
      }],
      "@typescript-eslint/explicit-member-accessibility": ["error", {
         accessibility: "explicit"
      }],
      // "@typescript-eslint/explicit-module-boundary-types": ["error", {
      //    allowArgumentsExplicitlyTypedAsAny: true,
      //    allowDirectConstAssertionInArrowFunctions: false,
      //    allowHigherOrderFunctions: false,
      //    allowTypedFunctionExpressions: false
      // }],
      "@typescript-eslint/func-call-spacing": ["error", "never"],
      // indent: might want to read this issue https://github.com/typescript-eslint/typescript-eslint/issues/1824
      "@typescript-eslint/indent": ["error", 3],
      "@typescript-eslint/init-declarations": ["error", "always"],
      "@typescript-eslint/keyword-spacing": ["error", {
         before: true,
         after: true
      }],
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/member-delimiter-style": ["error", {
         multiline: {
            delimiter: "semi",
            requireLast: true
         },
         singleline: {
            delimiter: "semi",
            requireLast: true
         }
      }],
      "@typescript-eslint/member-ordering": "off",
      "@typescript-eslint/method-signature-style": ["error", "method"],
      "@typescript-eslint/naming-convention": ["error", {
         format: null,
         custom: {
            regex: "\\b[a-z0-9]{1,}\\b",
            match: true
         },
         selector: [
            "variable",
            "function",
            "parameter",
            "property",
            "parameterProperty",
            "method",
            "accessor",
            "enumMember",
            "class",
            "interface",
            "typeAlias",
            "enum",
            "typeParameter"
         ]
      }],
      // "@typescript-eslint/no-array-constructor": "",
      // "@typescript-eslint/no-base-to-string": "",
      // "@typescript-eslint/no-confusing-non-null-assertion": "",
      // "@typescript-eslint/no-dupe-class-members": "",
      // "@typescript-eslint/no-dynamic-delete": "",
      // "@typescript-eslint/no-empty-function": "",
      // "@typescript-eslint/no-empty-interface": "",
      // "@typescript-eslint/no-explicit-any": "",
      // "@typescript-eslint/no-extra-non-null-assertion": "",
      // "@typescript-eslint/no-extra-parens": "",
      // "@typescript-eslint/no-extra-semi": "",
      // "@typescript-eslint/no-extraneous-class": "",
      // "@typescript-eslint/no-floating-promises": "",
      // "@typescript-eslint/no-for-in-array": "",
      // "@typescript-eslint/no-implicit-any-catch": "",
      // "@typescript-eslint/no-implied-eval": "",
      "@typescript-eslint/no-inferrable-types": "off",
      // "@typescript-eslint/no-invalid-this": "",
      // "@typescript-eslint/no-invalid-void-type": "",
      // "@typescript-eslint/no-loop-func": "",
      // "@typescript-eslint/no-loss-of-precision": "",
      // "@typescript-eslint/no-magic-numbers": "",
      // "@typescript-eslint/no-misused-new": "",
      // "@typescript-eslint/no-misused-promises": "",
      // "@typescript-eslint/no-namespace": "",
      // "@typescript-eslint/no-non-null-asserted-optional-chain": "",
      // "@typescript-eslint/no-non-null-assertion": "",
      // "@typescript-eslint/no-parameter-properties": "",
      // "@typescript-eslint/no-redeclare": "",
      // "@typescript-eslint/no-require-imports": "",
      // "@typescript-eslint/no-shadow": "",
      // "@typescript-eslint/no-this-alias": "",
      // "@typescript-eslint/no-throw-literal": "",
      "@typescript-eslint/no-type-alias": ["error"],
      // "@typescript-eslint/no-unnecessary-boolean-literal-compare": "",
      // "@typescript-eslint/no-unnecessary-condition": "",
      // "@typescript-eslint/no-unnecessary-qualifier": "",
      // "@typescript-eslint/no-unnecessary-type-arguments": "",
      // "@typescript-eslint/no-unnecessary-type-assertion": "",
      // "@typescript-eslint/no-unsafe-assignment": "",
      // "@typescript-eslint/no-unsafe-call": "",
      // "@typescript-eslint/no-unsafe-member-access": "",
      // "@typescript-eslint/no-unsafe-return": "",
      // "@typescript-eslint/no-unused-expressions": "",
      // "@typescript-eslint/no-unused-vars-experimental": "",
      // "@typescript-eslint/no-unused-vars": "",
      // "@typescript-eslint/no-use-before-define": "",
      // "@typescript-eslint/no-useless-constructor": "",
      // "@typescript-eslint/no-var-requires": "",
      // "@typescript-eslint/prefer-as-const": "",
      // "@typescript-eslint/prefer-enum-initializers": "",
      // "@typescript-eslint/prefer-for-of": "",
      // "@typescript-eslint/prefer-function-type": "",
      // "@typescript-eslint/prefer-includes": "",
      // "@typescript-eslint/prefer-literal-enum-member": "",
      // "@typescript-eslint/prefer-namespace-keyword": "",
      // "@typescript-eslint/prefer-nullish-coalescing": "",
      // "@typescript-eslint/prefer-optional-chain": "",
      // "@typescript-eslint/prefer-readonly-parameter-types": "",
      // "@typescript-eslint/prefer-readonly": "",
      // "@typescript-eslint/prefer-reduce-type-parameter": "",
      // "@typescript-eslint/prefer-regexp-exec": "",
      // "@typescript-eslint/prefer-string-starts-ends-with": "",
      // "@typescript-eslint/prefer-ts-expect-error": "",
      // "@typescript-eslint/promise-function-async": "",
      // "@typescript-eslint/quotes": "",
      // "@typescript-eslint/require-array-sort-compare": "",
      // "@typescript-eslint/require-await": "",
      // "@typescript-eslint/restrict-plus-operands": "",
      // "@typescript-eslint/restrict-template-expressions": "",
      // "@typescript-eslint/return-await": "",
      // "@typescript-eslint/semi": "",
      // "@typescript-eslint/space-before-function-paren": "",
      // "@typescript-eslint/strict-boolean-expressions": "",
      // "@typescript-eslint/switch-exhaustiveness-check": "",
      // "@typescript-eslint/triple-slash-reference": "",
      // "@typescript-eslint/type-annotation-spacing": "",
      "@typescript-eslint/typedef": ["error", {
         arrayDestructing: true,
         arrowParameter: true,
         memberVariableDeclaration: true,
         objectDestructuring: true,
         parameter: true,
         propertyDeclaration: true,
         variableDeclaration: true,
         variableDeclarationIgnoreFunction: true
      }],
      // "@typescript-eslint/unbound-method": "",
      // "@typescript-eslint/unified-signatures": ""

      // old below
      // "@typescript-eslint/array-type": ["error", "generic"],
      // "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
      // "comma-dangle": ["error", "never"],
      // "comma-spacing": "error",
      // "comma-style": "error",
      // "dot-location": ["error", "property"],
      // "handle-callback-err": "off",
      // "indent": ["error", 3],
      // "max-nested-callbacks": ["error", { "max": 4 }],
      // "max-statements-per-line": ["error", { "max": 2 }],
      // "no-console": "off",
      // "no-floating-decimal": "error",
      // "no-inline-comments": "error",
      // "no-lonely-if": "error",
      // "no-multi-spaces": "error",
      // "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
      // "no-trailing-spaces": ["error"],
      // "no-unused-vars": "warn",
      // "object-curly-spacing": ["error", "always"],
      // "prefer-const": "error",
      // "quotes": ["error", "double"],
      // "semi": ["error", "always"],
      // "space-before-blocks": "error",
      // "space-before-function-paren": ["error", {
      //    "anonymous": "never",
      //    "named": "never",
      //    "asyncArrow": "always"
      // }],
      // "space-in-parens": "error",
      // "space-infix-ops": "error",
      // "space-unary-ops": "error",
      // "spaced-comment": "error",
      // "yoda": "error",
      // "@typescript-eslint/no-explicit-any": 0,
      // "@typescript-eslint/no-inferrable-types": 0,
      // "@typescript-eslint/explicit-module-boundary-types": 1,
      // "@typescript-eslint/no-var-requires": 1,
      // "@typescript-eslint/no-empty-function": 1
   }
};
