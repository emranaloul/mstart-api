const prisma = require('../../prisma');
const bcrypt = require('bcrypt');
const { getSkipAndTakeByPage } = require('../../utilities/utils');
const createUserModel = async ({
  password,
  name,
  email,
  gender,
  dateOfBirth,
}) => {
  const userPassword = await bcrypt.hash(password, 10);
  email = email.trim().toLowerCase();
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: userPassword,
      gender,
      dateOfBirth: new Date(dateOfBirth),
    },
  });
  return user;
};

const getUserByEmailOrName = async (data) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: data }, { name: data }],
    },
  });
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return user;
};

const getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return user;
};
const updateLastLogin = async (id) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      lastLogin: new Date(),
    },
  });
};

const getUsers = async (pageNumber = 1, status) => {
  const { take, skip } = getSkipAndTakeByPage(pageNumber);
  const users = await prisma.user.findMany({
    take,
    skip,
    include: {
      password: false,
    },
    where: {
      status,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const count = await prisma.user.count({
    where: {
      status,
    },
  });
  return { data: users, totalCount: count };
};

module.exports = {
  createUserModel,
  getUserByEmailOrName,
  getUser,
  updateLastLogin,
  getUsers,
};
