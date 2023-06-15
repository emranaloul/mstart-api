'use strict';
const { createToken, deleteToken } = require('../models/jwt');
const base64 = require('base-64');
const { authenticateBasic } = require('../models/helpers');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return _authError();
  }
  let basic = req.headers.authorization.split(' ').pop();

  let [email, password] = base64.decode(basic).split(':');

  try {
    let userData = await authenticateBasic(email, password);
    await deleteToken(userData.id);
    const userTokens = await createToken(userData.id);  
    delete userData.password
    delete userTokens.id;
    delete userTokens.user_id;
    req.user = {...userData};
    req.tokens = userTokens;
    next();
  } catch (e) {
    res.send({status: 400, message: 'Either email or password is wrong!'})
  }

  function _authError() {
    res.json({
      status: 403,
      message: 'authorization is not provided',
    });
  }
};
