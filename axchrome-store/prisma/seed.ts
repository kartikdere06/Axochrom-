import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const adminEmail = "admin@axochrome.com";
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("axochrome-admin", 10);
    await prisma.admin.create({ data: { email: adminEmail, passwordHash } });
    console.log(`Created admin: ${adminEmail} / axochrome-admin`);
  }

  // --- Categories (tote styles) ---
  const categories = [
    { name: "Everyday Totes", slug: "everyday" },
    { name: "Premium Totes", slug: "premium" },
    { name: "Custom & Bulk", slug: "custom-bulk" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  const everyday = await prisma.category.findUniqueOrThrow({ where: { slug: "everyday" } });
  const premium = await prisma.category.findUniqueOrThrow({ where: { slug: "premium" } });
  const customBulk = await prisma.category.findUniqueOrThrow({ where: { slug: "custom-bulk" } });

  // Prices are in paise (smallest INR unit), matching how Stripe expects amounts.
  const products = [
    {
      name: "Retro Bloom Canvas Tote",
      slug: "retro-bloom-canvas-tote",
      description:
        "A deep-matte canvas tote with a structured base and three internal compartments. Holds its shape even fully loaded — built for daily commuting.",
      priceCents: 89900,
      imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800",
      categoryId: everyday.id,
      variants: [
        { label: "Black", sku: "RBT-BLK", stock: 40 },
        { label: "Natural", sku: "RBT-NAT", stock: 28 },
      ],
    },
    {
      name: "Ghatkopar Everyday Tote",
      slug: "ghatkopar-everyday-tote",
      description:
        "A lightweight carryall for the daily commute — zip pocket, reinforced handles, and a durable cotton-blend lining.",
      priceCents: 74900,
      imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
      categoryId: everyday.id,
      variants: [
        { label: "Charcoal", sku: "GET-CHR", stock: 35 },
        { label: "Olive", sku: "GET-OLV", stock: 22 },
      ],
    },
    {
      name: "Andheri Premium Tote",
      slug: "andheri-premium-tote",
      description:
        "Our flagship tote — heavyweight 12oz canvas, a magnetic snap closure, and a subtle tone-on-tone Axochrome print on the face.",
      priceCents: 149900,
      imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
      categoryId: premium.id,
      variants: [
        { label: "Black / Silver print", sku: "APT-BLKS", stock: 20 },
        { label: "Black / Tone-on-tone", sku: "APT-BLKT", stock: 18 },
      ],
    },
    {
      name: "Weekender Structured Tote",
      slug: "weekender-structured-tote",
      description:
        "An oversized structured tote with a padded base for electronics or documents, and a detachable shoulder strap.",
      priceCents: 179900,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      categoryId: premium.id,
      variants: [
        { label: "Black", sku: "WST-BLK", stock: 15 },
        { label: "Sand", sku: "WST-SND", stock: 12 },
      ],
    },
    {
      name: "Corporate Bulk Tote (Pack of 10)",
      slug: "corporate-bulk-tote-10",
      description:
        "Our everyday canvas tote priced for volume ordering — ideal for events, corporate gifting, or team merchandise. Custom printing included in bulk pricing; request your design after ordering.",
      priceCents: 599000,
      imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
      categoryId: customBulk.id,
      variants: [{ label: "Black — Pack of 10", sku: "CBT-10-BLK", stock: 50 }],
    },
    {
      name: "Custom Print Tote",
      slug: "custom-print-tote",
      description:
        "Start with our premium blank canvas tote and add your own logo or design using the custom print request at checkout.",
      priceCents: 99900,
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
      categoryId: customBulk.id,
      variants: [
        { label: "Black", sku: "CPT-BLK", stock: 60 },
        { label: "Natural", sku: "CPT-NAT", stock: 45 },
      ],
    },
  ];

  for (const p of products) {
    const { variants, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: productData,
    });
    for (const v of variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        update: {},
        create: { ...v, productId: product.id },
      });
    }
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
