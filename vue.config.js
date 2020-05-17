module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:7701',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}