const { createHash, randomBytes, scryptSync } = require("node:crypto");

const { PrismaClient, UserRole, UserStatus, IntegrationProvider } = require("@prisma/client");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${derivedKey}`;
}

function createSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const clinicName = process.env.SEED_CLINIC_NAME ?? "Lumiere Dental";
  const clinicSlug = process.env.SEED_CLINIC_SLUG ?? createSlug(clinicName);
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@lumiere.dental";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";

  const clinic = await prisma.clinic.upsert({
    where: { slug: clinicSlug },
    update: {
      name: clinicName,
      email: adminEmail,
      phone: process.env.SEED_CLINIC_PHONE ?? "+91-9999999999",
      whatsappNumber: process.env.SEED_CLINIC_WHATSAPP ?? "+91-9999999999",
    },
    create: {
      name: clinicName,
      slug: clinicSlug,
      email: adminEmail,
      phone: process.env.SEED_CLINIC_PHONE ?? "+91-9999999999",
      whatsappNumber: process.env.SEED_CLINIC_WHATSAPP ?? "+91-9999999999",
      timezone: process.env.SEED_CLINIC_TIMEZONE ?? "Asia/Kolkata",
      currency: process.env.SEED_CLINIC_CURRENCY ?? "INR",
      countryCode: process.env.SEED_CLINIC_COUNTRY_CODE ?? "IN",
    },
  });

  await prisma.clinicSettings.upsert({
    where: { clinicId: clinic.id },
    update: {
      brandName: clinicName,
      aiAssistantName: "Aria",
    },
    create: {
      clinicId: clinic.id,
      brandName: clinicName,
      aiAssistantName: "Aria",
    },
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      clinicId: clinic.id,
      firstName: "Lumiere",
      lastName: "Admin",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: hashPassword(adminPassword),
    },
    create: {
      clinicId: clinic.id,
      firstName: "Lumiere",
      lastName: "Admin",
      email: adminEmail,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: hashPassword(adminPassword),
    },
  });

  for (const service of [
    { code: "CONSULT", name: "Consultation", durationMinutes: 30, priceCents: 150000 },
    { code: "CLEANING", name: "Teeth Cleaning", durationMinutes: 45, priceCents: 250000 },
    { code: "IMPLANT", name: "Dental Implant Consultation", durationMinutes: 60, priceCents: 500000 },
  ]) {
    await prisma.serviceCatalog.upsert({
      where: {
        clinicId_code: {
          clinicId: clinic.id,
          code: service.code,
        },
      },
      update: {
        name: service.name,
        durationMinutes: service.durationMinutes,
        priceCents: service.priceCents,
      },
      create: {
        clinicId: clinic.id,
        ...service,
      },
    });
  }

  const tokenHash = createHash("sha256")
    .update(`${clinic.id}:${adminEmail}:bootstrap`)
    .digest("hex");

  await prisma.integrationConnection.upsert({
    where: {
      clinicId_provider: {
        clinicId: clinic.id,
        provider: IntegrationProvider.OPENAI,
      },
    },
    update: {
      status: "DISCONNECTED",
    },
    create: {
      clinicId: clinic.id,
      provider: IntegrationProvider.OPENAI,
      status: "DISCONNECTED",
      config: {
        note: "Seeded placeholder integration record",
        bootstrapTokenHash: tokenHash,
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
