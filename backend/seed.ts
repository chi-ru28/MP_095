import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'patelruchi2830@gmail.com',
      username: 'ruchi',
      provider: 'local',
      role: 'USER',
    },
  });
  console.log('User created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
