'use strict';
const { getTokenRecord } = require('../models/jwt');
const { authenticateWithToken } = require('../models/helpers');

const bearer = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return _authError();
    }
    let token = req.headers.authorization.split(' ').pop();
    let tokenRecord = await getTokenRecord(token);

    if (tokenRecord) {
      let validUser = await authenticateWithToken(token);
      delete validUser.password;
      req.user = validUser;

      next();
    } else {
      res.json({
        status: 403,
        message: 'Invalid token!',
      });
    }
  } catch (error) {
    next({ message: error.message, statusCode: 500 });
  }
  function _authError() {
    res.send({ message: 'Header authorization is not provided', status: 400 });
  }
};

module.exports = bearer;
