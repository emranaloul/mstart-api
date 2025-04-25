const prisma = require('../src/prisma');

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Emran',
        email: 'emran@admin.com',
        password:
          '$2b$10$IaDPMLDSvJvIbfPC5yXy4uNf4VCURt.UvQjlRCrcpYob83Fz1x2iq',
        gender: 'male',
        role: 'admin',
        dateOfBirth: new Date('1992-08-14'),
      },
      {
        name: 'Layla',
        email: 'layla@email.com',
        password:
          '$2b$10$IaDPMLDSvJvIbfPC5yXy4uNf4VCURt.UvQjlRCrcpYob83Fz1x2iq',
        gender: 'female',
        role: 'customer',
        dateOfBirth: new Date('1995-05-20'),
      },
    ],
  });

  console.log('✅ Seed data added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
