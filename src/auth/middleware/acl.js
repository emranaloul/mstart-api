const checkAdmin = (req, res, next) => {
  if (req.user.role === 'admin') next();
  else throw { statusCode: 403, message: 'unauthorized' };
};

const checkActive = (req, res, next) => {
  if (req.user.status === 'active') next();
  else throw { statusCode: 403, message: 'your account is inactive' };
};

module.exports = {
  checkAdmin,
  checkActive,
};
