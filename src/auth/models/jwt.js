'use strict';

const prisma = require('../../prisma');
const { getToken } = require('./helpers');

const createToken = async (user_id) => {
  const accessToken = await getToken(user_id);
  return await prisma.jwt.create({
    data: {
      token: accessToken,
      userId: user_id,
    },
  });
};

const getTokenRecord = async (token) => {
  const tokenRecord = await prisma.jwt.findUnique({
    where: {
      token,
    },
  });
  if (!tokenRecord) {
    throw new Error('Token not found');
  }
  return tokenRecord;
};

const deleteToken = async (id) => {
  const tokenRecord = await prisma.jwt.findUnique({
    where: {
      userId: id,
    },
  });
  if (tokenRecord) {
    await prisma.jwt.delete({
      where: {
        id: tokenRecord.id,
      },
    });
  }
};

const logout = async (id) => {
  const tokenRecord = await prisma.jwt.findUnique({
    where: {
      userId: id,
    },
  });
  if (tokenRecord) {
    await prisma.jwt.delete({
      where: {
        id: tokenRecord.id,
      },
    });
  }
};

module.exports = {
  createToken,
  getTokenRecord,
  deleteToken,
  logout,
};
