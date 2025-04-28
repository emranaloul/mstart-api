const usersRoutes = require('./controllers/usersConrtoller');
const { httpMethods } = require('../utilities/constants');
const express = require('express');

const router = express.Router();

usersRoutes.forEach((route) => {
  const { handler, method, path, middlewares } = route;
  switch (method) {
    case httpMethods.GET:
      if (middlewares) {
        middlewares.forEach((middleware) => {
          router.get(path, middleware);
        });
      }
      router.get(path, handler);
      break;
    case httpMethods.POST:
      if (middlewares) {
        middlewares.forEach((middleware) => {
          router.post(path, middleware);
        });
      }
      router.post(path, handler);
      break;
    case httpMethods.PUT:
      if (middlewares) {
        middlewares.forEach((middleware) => {
          router.put(path, middleware);
        });
      }
      router.put(path, handler);
      break;
    case httpMethods.DELETE:
      if (middlewares) {
        middlewares.forEach((middleware) => {
          router.delete(path, middleware);
        });
      }
      router.delete(path, handler);
      break;
    default:
      break;
  }
});

module.exports = router;
