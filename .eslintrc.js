module.exports = {
	extends: ["eslint:recommended"],
	env: {
		es6: true,
		node: true
	},
	parser: "babel-eslint",
	rules: {
		// These rules assume eslint recommended, if the rules is accepted from
		// eslint:recommended settings it is commented out and noted to the right of
		/*
		 * the rule. This is intended to not overwrite any accepted rules.
		 * 0 indicates no action, 1 is a warning, and 2 is an error.
		 */
		/* possible error section */
		/*
		 * 'for-direction': 0, // eslint:recommended
		 * 'getter-return': 2, // eslint:recommended
		 */
		"no-async-promise-executor": 2,
		"no-await-in-loops": 0,
		/*
		 * 'no-compare-neg-zero': 1, // eslint:recommended
		 * 'no-cond-assign': 0, // eslint:recommended
		 */
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-constant-condition": 2,
		// 'no-control-regex': 2, // eslint:recommended
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		/*
		 * 'no-dupe-args': 2, // eslint:recommended
		 * 'no-dupe-keys': 2 // eslint:recommended
		 * 'no-duplicate-case': 2, // eslint:recommended
		 * 'no-empty': 2, // eslint:recommended
		 * 'no-empty-character-class': 2, // eslint:recommended
		 * 'no-ex-assign': 2, // eslint:recommended
		 * 'no-extra-boolean-cast': 2, // eslint:recommended
		 * 'no-ex-assign': 2, // eslint:recommended
		 */
		"no-extra-parens": 2,
		"no-extra-semi": 2, // eslint:recommended
		/*
		 * 'no-function-assign': 2, // eslint:recommended
		 * 'no-invalid-regexp': 2, // eslint:recommended
		 */
		"no-inner-declarations": 0, // eslint:recommended
		"no-irregular-whitespace": 2, // eslint:recommended
		/*
		 * 'no-misleading-character-class': 0,
		 * 'no-object-calls': 2, // eslint:recommended
		 * 'no-protoype-bulletins': 0,
		 * 'no-regex-spaces': 2, // eslint:recommended
		 * 'no-sparse-arrays': 2, // eslint:recommended
		 * 'no-template-curly-in-string': 2, // eslint:recommended
		 * 'no-unexpected-multiline': 2, // eslint:recommended
		 * 'no-unreachable': 2, // eslint:recommended
		 * 'no-unsafe-funally': 2, // eslint:recommended
		 * 'require-atomic-updates': 2, // eslint:recommended
		 * 'use-isnan': 2, // eslint:recommended
		 * 'valid-typeof': 2, // eslint:recommended
		 */

		/** *** best practices *****/
		/*
		 * 'accessor-pairs': 0,
		 * 'array-callback-return': 0,
		 * 'blocked-scoped-var': 0,
		 * 'class-methods-use-this': 0,
		 * 'complexity': 0,
		 * 'consistent-return': 0,
		 * 'curly': 2,  // eslint: recommended
		 */
		"default-case": 2,
		/*
		 * 'dot-location': 2 // eslint: recommended
		 * 'dot-notation': 2 // eslint: recommended
		 * 'eqeqeq': 2 // eslint: recommended
		 * 'guard-for-in': 2, // ?? double check me - require for-in loops to include an if statement
		 * 'max-classes-per-file': 0,
		 * 'no-alert': 0,
		 */
		"no-caller": 2, // Notes: deprecated
		/*
		 * 'no-case-declarations': 2, // eslint: recommended
		 * 'no-div-regex': 0,
		 * 'no-else-return': 0,
		 * 'no-empty-function': 0,
		 * 'no-empty-pattern': 0, // eslint: recommended
		 * 'no-eq-null': 0,
		 */
		"no-eval": 1, // 5.8 Warning: Do not use the eval keyword without a really good reason.
		/*
		 * 'no-extend-native': 2,  // ?? double check - disallow extending native types
		 * 'no-extra-bind': 2,  // ?? double check - disallow unnecessary calls to .bind()
		 * 'no-extra-label': 0,
		 */
		"no-fallthrough": 1, // Set to warn: 5.7 allows fallthrough cases requires stated
		/*
		 * 'no-floating-decimal': 0,
		 * 'no-global-assign': 2, // eslint: recommended
		 * 'no-implicit-coercion': 0,
		 * 'no-implicit-globals': 0,
		 * 'no-implied-eval': 0,
		 * 'no-invalid-this': 2, // ?? double check - disallow this keywords outside of classes or class-like objects
		 * 'no-iterator': 0,
		 * 'no-labels': 0,
		 * 'no-lone-blocks': 0,
		 * 'no-loop-func: 0,
		 * 'no-magic-numbers': 0,
		 */
		"no-multi-spaces": 2, // Notes: disallow multiple spaces
		"no-multi-str": 2, // 4.6 Disallow Multiline Strings (no-multi-str)
		"no-redeclare": 0, // eslint: recommended
		"no-proto": 0,
		/*
		 *'no-new': 0,
		 * 'no-new-func': 0,
		 * 'no-new-wrappers': 2,  // 5.8 Dissalowed
		 * 'no-octal': 2, // eslint: recommended
		 * 'no-octal-escape': 0,
		 * 'no-param-reassign': 0,
		 *
		 *
		 * 'no-restricted-properties': 0,
		 * 'no-return-assign': 0,
		 * 'no-return-await': 0,
		 * 'no-script-url': 0,
		 * 'no-self-assign': 2, // eslint: recommended
		 * 'no-self-compare': 0,
		 * 'no-sequences': 0,
		 * 'no-throw-literal': 2, // notes: disallow throwing literals as exceptions
		 * 'no-unified-loop-condition': 0,
		 * 'no-unused-expressions': 0,
		 * 'no-unused-labels': 2, // eslint: recommended
		 * 'no-no-useless-call': 0,
		 * 'no-useless-catch': 0,
		 * 'no-useless-concat': 0,
		 * 'no-useless-escape': 2, // eslint: recommended
		 * 'no-useless-return': 0,
		 * 'no-void': 0,
		 * 'no-warning-comments': 0,
		 */
		"no-with": 2,
		/*
		 * 'no-prefer-promise-reject-errors': 2, notes: require using Error objects as Promise rejection reasons
		 * 'no-radix': 0,
		 * 'no-require-await': 0,
		 * 'no-require-unicode-regexp': 0,
		 * 'no-vars-on-top': 0,
		 * 'no-wrap-life': 0,
		 * 'no-yoda': 0,
		 */

		/** ** strict mode ****/
		// 'strict': 0,

		/** ** variables ****/
		/*
		 * 'init-declarations': 0,
		 * 'no-delete-var': 2,   // eslint: recommended
		 * 'no-label-var': 0,
		 * 'no-restricted-globals': 0,
		 * 'no-shadow': 0,
		 * 'no-shadow-restricted-names': 0,
		 *
		 * 'no-indef-init': 0,
		 * 'no-undefined': 0,
		 */
		"no-undef": 0, // eslint: recommended
		"require-default-prop": 0,
		"no-unused-vars": 1, // eslint: recommended --- check
		// 'no-use-before-define': 0,

		/* Node.js and CommonJS */
		/*
		 * 'callback-return': 0,
		 * 'global-require': 0,
		 * 'handle-callback-err': 0,
		 * 'no-buffer-constructor': 0,
		 * 'no-mixed-requires': 0,
		 * 'no-new-require': 0,
		 * 'no-path-concat': 0,
		 * 'no-process-env': 0,
		 * 'no-process-exit': 0,
		 * 'no-restricted-modules': 0,
		 * 'no-sync': ,
		 */

		/** ** stylistic ****/
		"array-bracket-newline": 2, // notes: 3.1
		/*
		 * 'array-bracket-spacing': 0, // no rule: enforce consistent spacing inside array brackets
		 * 'array-element-newline': 0, // no rule: enforce line breaks after each array element
		 * 'block-spacing': 0, // no rule
		 */
		"brace-style": 2, // Notes: The presumed 'one true brace style' seemds to fit  3.1
		camelcase: [
			1,
			{
				properties: "always"
			}
		], // notes: double check properties, not mentioned in 1.1
		// 'capitalized-comments': 0, // no rule
		"comma-dangle": [2, "never"], // 4.2
		"comma-spacing": [
			2,
			{
				before: false,
				after: true
			}
		], // 3.6.2
		"comma-style": [2, "last"], // 3.6.2
		"computed-property-spacing": [2, "never"], // double check 3.6.2
		// 'consistent-this': 0,
		"eol-last": 0, // double check me not explictely stated from what I can see
		"func-call-spacing": [2, "never"], // 3.6.2 trailing whitespace forbidden without exception
		/*
		 * 'func-name-matching': 0,
		 * 'func-names': 0,
		 * 'function-paren-newline': 0, // notes: dependant on case
		 * 'func-style': 0, // both allowed
		 * 'id-blacklist': 0, // none for now
		 * 'id-length': 0,
		 * 'id-match': 0,
		 */
		indent: 0,
		// 'jsx-quotes': 0, // depends
		"key-spacing": 2, // 3.6.2
		"keyword-spacing": 2, // 3.6.2
		/*
		 * 'line-comment-position': 0, // 3.6.2 above and below are accepted
		 * 'linebreak-style': 2,
		 * 'lines-around-comment': 0,
		 * 'lines-between-class-members': 0,
		 * 'max-depth': 0,
		 */
		"max-len": [
			2,
			{
				// should we ignore urls or anything here?
				code: 2400,
				tabWidth: 4
			}
		],
		/*
		 * 'max-lines': 0,
		 * 'max-lines-per-function': 0,
		 * 'max-nested-callbacks': 0,
		 * 'max-params': 0,
		 * 'max-statements': 0,
		 * 'max-statements-per-line': 0,
		 * 'multiline-comment-style': [2, 'starred-block'],
		 */
		/*
		 * 'multiline-ternary': 0,
		 * 'new-cap': 2, // use array declarative instead
		 * 'new-parens': 0, // same as above
		 * 'newline-per-chained-call': 0, // notes: we do this in cass with d3, but not explicitely stated
		 */
		"no-array-constructor": 2, // use array declarative instead
		/*
		 * 'no-bitwise': 0,
		 * 'no-continue': 0,
		 * 'no-inline-comments': 0,
		 * 'no-lonely-if': 0,
		 * 'no-mixed-operators': 0,
		 */
		"no-mixed-spaces-and-tabs": 2, // eslint:recommended
		// 'no-multi-assign': 0,
		"no-multiple-empty-lines": [
			1,
			{
				max: 2
			}
		], // 3.6.1 permitted but not encouraged set to warn
		/*
		 * 'no-negated-condition': 0,
		 * 'no-nested-ternary': 0,
		 */
		"no-new-object": 2, // 4.3
		/*
		 * 'no-plusplus': 0,
		 * 'no-restricted-syntax': 0,
		 */
		"no-tabs": 0,
		// 'no-ternary': 0,
		"no-trailing-spaces": 2,
		/*
		 * 'no-underscore-dangle': 0,
		 * 'no-unneeded-ternary': 0,
		 * 'no-whitespace-before-property': 0,
		 * 'nonblock-statement-body-position': 0,
		 * 'object-curly-newline': 0,
		 */
		"object-curly-spacing": [2, "never"], // 3.6.2 double check exceptions
		// 'object-property-newline': 0,
		"one-var": [
			2,
			{
				// 4.1
				var: "never",
				let: "never",
				const: "never"
			}
		],
		/*
		 * 'one-var-declaration-per-line': 2, // not required because of above rule
		 * 'operator-assignment': 0,
		 * 'operator-linebreak': 0,
		 */
		"padded-blocks": [2, "never"], // 3.6.1 implied?
		/*
		 * 'padding-line-between-statements': 0,
		 * 'prefer-object-spread': 0,
		 * 'quote-props': [2, 'consistent'],   // 4.3 should we make this consistent by object but not by file?
		 *
		 */
		quotes: [
			0,
			"single",
			{
				allowTemplateLiterals: true
			}
		], // not reinforced
		semi: [2, "always"], // require semicol
		"semi-spacing": 2, // 3.6.2
		/*
		 * 'semi-style': 0,
		 * 'sort-keys': 0,
		 * 'sort-vars': 0,
		 */
		"space-before-blocks": 2, // 3.6.2
		"space-before-function-paren": [
			0,
			{
				// double check 3.6.2
				asyncArrow: "never",
				anonymous: "never",
				named: "never"
			}
		],
		/*
		 * 'space-in-parens': 0,
		 * 'space-infix-ops': 0,
		 * 'space-unary-ops': 0,
		 */
		"spaced-comment": [2, "always"] // 2.3
		/*
		 * 'switch-colon-spacing': 2, // 5.7.2 no rule
		 * 'template-tag-spacing': 0,
		 * 'unicode-bom': 0,
		 * 'wrap-regex': 0,
		 */
	}
};
