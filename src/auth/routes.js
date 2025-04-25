const usersRoutes = require('./controllers/usersConrtoller');
const { httpMethods } = require('../utilities/constants');
const express = require('express');

const router = express.Router();

usersRoutes.forEach((route) => {
  const { handler, method, path, middlewares } = route;
  switch (method) {
    case httpMethods.GET:
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
      router.put(path, handler);
      break;
    case httpMethods.DELETE:
      router.delete(path, handler);
      break;
    default:
      break;
  }
});

module.exports = router;
