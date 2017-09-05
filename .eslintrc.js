// http://eslint.org/docs/user-guide/configuring

module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "jquery": true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    "extends": "eslint:recommended",
    // required to lint *.vue files
    "globals": {
    "angular":true
    },
	// add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'eol-last': 0,
        'space-before-function-paren': 0,
        "no-alert": 0,//禁止使用alert confirm prompt
        "semi": [2, "always"],//语句强制分号结尾
        "no-multiple-empty-lines": [1, {"max": 2}],//空行最多不能超过2行
        "no-redeclare": 2,//禁止重复声明变量
        "indent": [2, 4],//缩进风格
        "no-console":0
    }
}
