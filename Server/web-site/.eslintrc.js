module.exports = {
    root: true,
    parser: 'Esprima',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
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
        // allow async-await
        'generator-star-spacing': 0,
    }
}