const { checkAdmin } = require('../../auth/middleware/acl');
const bearer = require('../../auth/middleware/bearer');
const { httpMethods } = require('../../utilities/constants');
const {
  addProductModel,
  getProductsModel,
  deleteProductModel,
} = require('../models/ProductModel');

const createProductHandler = async (req, res, next) => {
  try {
    const product = req.body;
    const newProduct = await addProductModel(product);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const getProductsHandler = async (req, res, next) => {
  try {
    const { pageNumber } = req.body;
    const products = await getProductsModel({ pageNumber });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductsForCustomerHandler = async (req, res, next) => {
  try {
    const { pageNumber } = req.body;
    const products = await getProductsModel({ pageNumber, status: 'active' });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const deleteProductHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProductModel(id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};
const routes = [
  {
    handler: createProductHandler,
    method: httpMethods.POST,
    path: '/product',
    middlewares: [bearer, checkAdmin],
  },
  {
    handler: getProductsHandler,
    method: httpMethods.POST,
    path: '/productsForAdmin',
    middlewares: [bearer, checkAdmin],
  },
  {
    handler: getProductsForCustomerHandler,
    method: httpMethods.POST,
    path: '/products',
  },
  {
    handler: deleteProductHandler,
    method: httpMethods.DELETE,
    path: '/product/:id',
    middlewares: [bearer, checkAdmin],
  },
];
module.exports = routes;
