const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {


  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://13.209.66.16:8080",
      changeOrigin: true,
    })
  );
};
