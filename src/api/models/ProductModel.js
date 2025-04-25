const prisma = require('../../prisma');
const { getSkipAndTakeByPage } = require('../../utilities/utils');

const addProductModel = async (data) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      amount: data.amount,
      description: data.description,
    },
  });
};

const deleteProductModel = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    throw { message: 'Product not found', statusCode: 404 };
  }
  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      status: 'deleted',
    },
  });
};

const updateOrderStatusModel = async (id, status) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!product) {
    throw { message: 'Product not found', statusCode: 404 };
  }
  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

const getProductsModel = async ({ pageNumber = 1, status }) => {
  const { take, skip } = getSkipAndTakeByPage(pageNumber);
  const products = await prisma.product.findMany({
    take,
    skip,
    where: {
      status,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalProducts = await prisma.product.count({ where: { status } });

  return { data: products, totalCount: totalProducts };
};

module.exports = {
  addProductModel,
  deleteProductModel,
  updateOrderStatusModel,
  getProductsModel,
};
