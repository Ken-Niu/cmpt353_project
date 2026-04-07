const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      displayName: 'Admin',
      passwordHash: adminHash,
      role: 'admin',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      displayName: 'Test User',
      passwordHash: userHash,
      role: 'user',
    },
  })

  const channel = await prisma.channel.upsert({
    where: { name: 'General' },
    update: {},
    create: {
      name: 'General',
      description: 'General programming questions',
      createdBy: admin.id,
    },
  })

  await prisma.post.create({
    data: {
      title: 'Welcome to the forum!',
      body: 'This is the first post.',
      channelId: channel.id,
      authorId: admin.id,
    },
  })

  console.log('Seed done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
