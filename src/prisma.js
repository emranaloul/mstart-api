const { PrismaClient } = require('../prisma/app/generated/prisma/client');
const prisma = new PrismaClient({ log: ['query'] });

module.exports = prisma;
