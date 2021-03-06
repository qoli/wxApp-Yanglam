module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.wpy files
    plugins: [
        'html'
    ],
    settings: {
        'html/html-extensions': ['.html', '.wpy']
    },
    'globals': {
        'wx': true
    },
    // add your custom rules here
    'rules': {
        // 禁止 call 和 apply 检查
        'no-useless-call': 0,
        "space-in-parens": 0,
        // 缩进检查关闭
        "indent": 0,
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'space-unary-ops': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'space-before-function-paren': 0
    }
}