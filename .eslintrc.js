module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        eqeqeq: "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],
        "arrow-spacing": ["error", { before: true, after: true }],
        "no-console": 0,
    },
    ignorePatterns: ["dist/**", "node_modules/**", "mongo.js"],
};
