"use strict";
const { getTokenRecord } = require("../models/jwt");
const { authenticateWithToken } = require("../models/helpers");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return _authError();
    }
    let token = req.headers.authorization.split(" ").pop();
    let tokenRecord = await getTokenRecord(token);;
  
    if (tokenRecord) {
      let validUser = await authenticateWithToken(token);
      delete validUser.password
      req.user = validUser;
    
      next();
    } else {
      res.json({
        status: 403,
        message: "Invalid token!",
      });
    }
  } catch (error) {
   res.send({message: error.message, status: 400})
  }
  function _authError() {
    res.send({message:"Header authorization is not provided", status:400});
  }
};
