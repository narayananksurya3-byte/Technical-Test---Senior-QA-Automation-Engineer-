const globals = {
    Buffer: 'readonly',
    console: 'readonly',
    module: 'readonly',
    process: 'readonly',
    require: 'readonly',
};

module.exports = [
    {
        ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'k6/**'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals,
        },
        rules: {
            eqeqeq: 'error',
            'no-undef': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
];
