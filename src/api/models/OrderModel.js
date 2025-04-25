const prisma = require('../../prisma');
const { getSkipAndTakeByPage } = require('../../utilities/utils');

const createOrderModel = async ({
  userId,
  productId,
  quantity,
  totalAmount,
}) => {
  const order = await prisma.order.create({
    data: {
      userId,
      productId,
      quantity,
      totalAmount,
    },
  });
  return order;
};
const updateOrderStatusModel = async (id, status) => {
  return await prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

const getOrdersModel = async ({ pageNumber = 1, status, userId }) => {
  const { take, skip } = getSkipAndTakeByPage(pageNumber);
  const orders = await prisma.order.findMany({
    take,
    skip,
    where: {
      status,
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const count = await prisma.order.count({
    where: {
      status,
      userId,
    },
  });
  return { data: orders, totalCount: count };
};
module.exports = {
  createOrderModel,
  updateOrderStatusModel,
  getOrdersModel,
};
