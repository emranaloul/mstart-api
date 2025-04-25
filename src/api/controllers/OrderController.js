const { checkActive, checkAdmin } = require('../../auth/middleware/acl');
const bearer = require('../../auth/middleware/bearer');
const { httpMethods } = require('../../utilities/constants');
const {
  createOrderModel,
  getOrdersModel,
  updateOrderStatusModel,
} = require('../models/OrderModel');

const createOrderHandler = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId, quantity, totalAmount } = req.body;
    const newOrder = await createOrderModel({
      userId: id,
      productId,
      quantity,
      totalAmount,
    });
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

const cancelOrderHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedOrder = await updateOrderStatusModel(id, 'canceled');
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
const getOrdersHandler = async (req, res, next) => {
  try {
    const { pageNumber } = req.body;
    const { id } = req.user;
    const orders = await getOrdersModel({ pageNumber, userId: id });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
const getOrdersForAdminHandler = async (req, res, next) => {
  try {
    const { pageNumber, userId, status } = req.body;
    const orders = await getOrdersModel({ pageNumber, userId, status });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
const deleteOrderHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await updateOrderStatusModel(id, 'deleted');
    res.status(200).json(deletedOrder);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatusHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await updateOrderStatusModel(id, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const routes = [
  {
    handler: createOrderHandler,
    method: httpMethods.POST,
    path: '/placeOrder',
    middlewares: [bearer, checkActive],
  },
  {
    handler: cancelOrderHandler,
    method: httpMethods.PUT,
    path: '/cancelOrder/:id',
    middlewares: [bearer, checkActive],
  },
  {
    handler: getOrdersHandler,
    method: httpMethods.POST,
    path: '/orders',
    middlewares: [bearer, checkActive],
  },
  {
    handler: getOrdersForAdminHandler,
    method: httpMethods.POST,
    path: '/ordersForAdmin',
    middlewares: [bearer, checkAdmin],
  },
  {
    handler: deleteOrderHandler,
    method: httpMethods.DELETE,
    path: '/order/:id',
    middlewares: [bearer, checkAdmin],
  },
  {
    handler: updateOrderStatusHandler,
    method: httpMethods.PUT,
    path: '/order/:id',
    middlewares: [bearer, checkAdmin],
  },
];
module.exports = routes;
