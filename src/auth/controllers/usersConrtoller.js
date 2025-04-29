const { httpMethods } = require('../../utilities/constants');
const { checkActive } = require('../middleware/acl');
const basic = require('../middleware/basic');
const bearer = require('../middleware/bearer');
const { logout, createToken } = require('../models/jwt');
const { createUserModel, getUser, getUsers } = require('../models/usersModel');

const createUserController = async (req, res, next) => {
  try {
    const user = await createUserModel(req.body);
    const token = await createToken(user.id);
    res
      .status(201)
      .json({ data: user, message: 'User created successfully', token });
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

const getUserHandler = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await getUser(id);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
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

const getUsersHandler = async (req, res, next) => {
  try {
    const { pageNumber, status } = req.body;
    const response = await getUsers(pageNumber, status);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const createUserByAdmin = async (req, res, next) => {
  try {
    const user = await createUserModel(req.body);
    res.status(201).json({ data: user, message: 'User created successfully' });
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
  {
    handler: getUserHandler,
    middlewares: [bearer, checkActive],
    method: httpMethods.GET,
    path: '/my-profile',
  },
  {
    handler: getUsersHandler,
    middlewares: [bearer, checkActive],
    method: httpMethods.POST,
    path: '/usersForAdmin',
  },
  {
    handler: createUserByAdmin,
    middlewares: [bearer, checkActive],
    method: httpMethods.POST,
    path: '/createUserByAdmin',
  },
];

module.exports = routes;
