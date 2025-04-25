'use strict';
const { createToken, deleteToken } = require('../models/jwt');
const base64 = require('base-64');
const { authenticateBasic } = require('../models/helpers');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return _authError();
  }
  const basic = req.headers.authorization.split(' ').pop();

  const [email, password] = base64.decode(basic).split(':');

  try {
    const userData = await authenticateBasic(email, password);
    await deleteToken(userData.id);
    const { token } = await createToken(userData.id);
    req.user = { ...userData };
    req.token = token;
    next();
  } catch (e) {
    res.send({ status: 400, message: 'Either email or password is wrong!' });
  }

  function _authError() {
    res.json({
      status: 403,
      message: 'authorization is not provided',
    });
  }
};
