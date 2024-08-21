const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-nested'),
        purgecss({
            content: ['./html/**/*.html'], // Ajuste o caminho conforme necessário
            safelist: [], // Adicione classes que não devem ser removidas aqui, se necessário
        }),
    ],
};
