import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'mecontratanex@nextar.com.br' },
    update: {},
    create: {
      email: 'mecontratanex@nextar.com.br',
      name: 'Me Contrata Nex',
      permission: 'admin',
      phone: '15998211270',
      password: await hash('nextar', 8),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
