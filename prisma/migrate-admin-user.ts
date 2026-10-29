import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const OLD_EMAIL = "admin@rodinanaturals.co.ke";
const NEW_EMAIL = "info@eloriabeauty.co.ke";
const NEW_NAME = "Eloria Admin";

async function main() {
  // Try to find and update the old account
  const oldUser = await prisma.user.findUnique({ where: { email: OLD_EMAIL } });

  if (oldUser) {
    await prisma.user.update({
      where: { email: OLD_EMAIL },
      data: { email: NEW_EMAIL, name: NEW_NAME },
    });
    console.log(`Admin user migrated: ${OLD_EMAIL} → ${NEW_EMAIL}`);
    return;
  }

  // Already migrated — ensure name is correct
  const newUser = await prisma.user.findUnique({ where: { email: NEW_EMAIL } });
  if (newUser) {
    if (newUser.name !== NEW_NAME) {
      await prisma.user.update({ where: { email: NEW_EMAIL }, data: { name: NEW_NAME } });
      console.log(`Admin name updated to "${NEW_NAME}"`);
    } else {
      console.log("Admin user already up to date — no changes needed.");
    }
    return;
  }

  console.warn("WARNING: Admin user not found at either email address. No changes made.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
