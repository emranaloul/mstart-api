const { httpMethods } = require('../../utilities/constants');
const { checkActive } = require('../middleware/acl');
const basic = require('../middleware/basic');
const bearer = require('../middleware/bearer');
const { logout } = require('../models/jwt');
const { createUserModel } = require('../models/usersModel');

const createUserController = async (req, res, next) => {
  try {
    const user = await createUserModel(req.body);
    res.status(201).json({ data: user, message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

const signInHandler = (req, res) => {
  res.send({
    message: 'logged in successfully',
    user: req.user,
    token: req.token,
    status: 200,
  });
};

const logoutHandler = async (req, res, next) => {
  try {
    await logout(req.user.id);
    res.status(200).json({
      status: 200,
      message: 'logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

const routes = [
  { handler: createUserController, method: httpMethods.POST, path: '/sign-up' },
  {
    handler: signInHandler,
    middlewares: [basic, checkActive],
    method: httpMethods.POST,
    path: '/signin',
  },
  {
    handler: logoutHandler,
    middlewares: [bearer],
    method: httpMethods.POST,
    path: '/logout',
  },
];

module.exports = routes;
