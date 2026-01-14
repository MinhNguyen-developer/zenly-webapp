import "dotenv/config"
import * as bcrypt from 'bcrypt';
import prismaClient from "./client";

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prismaClient.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      username: 'alice',
      password: hashedPassword,
      name: 'Alice Johnson',
      location: {
        create: {
          latitude: 40.7489,
          longitude: -73.9680,
          status: 'At Central Park',
        },
      },
    },
  });

  const user2 = await prismaClient.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      username: 'bob',
      password: hashedPassword,
      name: 'Bob Smith',
      location: {
        create: {
          latitude: 40.7614,
          longitude: -73.9776,
          status: 'Times Square',
        },
      },
    },
  });

  const user3 = await prismaClient.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      email: 'charlie@example.com',
      username: 'charlie',
      password: hashedPassword,
      name: 'Charlie Brown',
      location: {
        create: {
          latitude: 40.7580,
          longitude: -73.9855,
          status: 'Near Columbus Circle',
        },
      },
    },
  });

  const user4 = await prismaClient.user.upsert({
    where: { email: 'diana@example.com' },
    update: {},
    create: {
      email: 'diana@example.com',
      username: 'diana',
      password: hashedPassword,
      name: 'Diana Prince',
      location: {
        create: {
          latitude: 40.7484,
          longitude: -73.9857,
          status: 'Chelsea Market',
        },
      },
    },
  });

  // Create friendships
  await prismaClient.friendship.createMany({
    data: [
      { userId: user1.id, friendId: user2.id },
      { userId: user2.id, friendId: user1.id },
      { userId: user1.id, friendId: user3.id },
      { userId: user3.id, friendId: user1.id },
      { userId: user2.id, friendId: user4.id },
      { userId: user4.id, friendId: user2.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Test Users:');
  console.log('  - alice@example.com / alice / password123');
  console.log('  - bob@example.com / bob / password123');
  console.log('  - charlie@example.com / charlie / password123');
  console.log('  - diana@example.com / diana / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });

