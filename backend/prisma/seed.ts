import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an initial Rank (to satisfy the relation if we need it)
  const rank = await prisma.rank.upsert({
    where: { name: 'Novice' },
    update: {},
    create: {
      name: 'Novice',
      min_score: 0,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
