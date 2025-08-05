const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://2896f11e75d1.ngrok-free.app',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      }
    })
  );
};