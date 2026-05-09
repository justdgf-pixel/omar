import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const sellerPass = await bcrypt.hash("seller123", 10);
  const customerPass = await bcrypt.hash("customer123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@souqami.dz" },
    update: {},
    create: {
      email: "admin@souqami.dz",
      name: "Admin",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@souqami.dz" },
    update: {},
    create: {
      email: "seller@souqami.dz",
      name: "Amine (Seller)",
      passwordHash: sellerPass,
      role: "SELLER",
      wilaya: "16", // Alger
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@souqami.dz" },
    update: {},
    create: {
      email: "customer@souqami.dz",
      name: "Yasmine",
      passwordHash: customerPass,
      role: "CUSTOMER",
      wilaya: "31", // Oran
    },
  });

  const categories = [
    { slug: "ebooks", nameAr: "كتب إلكترونية", nameFr: "E-books", nameEn: "E-books", icon: "📚" },
    { slug: "courses", nameAr: "دورات تعليمية", nameFr: "Cours en ligne", nameEn: "Courses", icon: "🎓" },
    { slug: "design", nameAr: "تصاميم", nameFr: "Design & graphisme", nameEn: "Design assets", icon: "🎨" },
    { slug: "templates", nameAr: "قوالب", nameFr: "Templates", nameEn: "Templates", icon: "🧩" },
    { slug: "music", nameAr: "موسيقى", nameFr: "Musique", nameEn: "Music & audio", icon: "🎵" },
    { slug: "software", nameAr: "برامج", nameFr: "Logiciels", nameEn: "Software", icon: "💻" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  const ebooks = await prisma.category.findUniqueOrThrow({ where: { slug: "ebooks" } });
  const courses = await prisma.category.findUniqueOrThrow({ where: { slug: "courses" } });
  const design = await prisma.category.findUniqueOrThrow({ where: { slug: "design" } });

  const sample = [
    {
      slug: "guide-freelance-algerie",
      titleAr: "دليل العمل الحر في الجزائر",
      titleFr: "Guide du freelance en Algérie",
      titleEn: "Freelancing in Algeria — the practical guide",
      descAr: "كل ما تحتاج معرفته للعمل الحر من الجزائر: استلام المدفوعات، الضرائب، والعملاء الأجانب.",
      descFr: "Tout ce qu'il faut savoir pour freelancer depuis l'Algérie : paiements, impôts, clients étrangers.",
      descEn: "Everything you need to start freelancing from Algeria — payments, taxes, foreign clients.",
      priceCentimes: 150000, // 1500.00 DZD
      categoryId: ebooks.id,
      featured: true,
    },
    {
      slug: "darija-arabic-pack",
      titleAr: "حزمة تعلم الدارجة الجزائرية",
      titleFr: "Pack apprendre la darija algérienne",
      titleEn: "Algerian Darija starter pack",
      descAr: "ملفات صوتية ومذكرات لتعلّم الدارجة الجزائرية.",
      descFr: "Audios et fiches PDF pour apprendre la darija algérienne.",
      descEn: "Audio lessons and printable PDFs to learn Algerian Darija.",
      priceCentimes: 250000,
      categoryId: courses.id,
      featured: true,
    },
    {
      slug: "wilaya-icons-pack",
      titleAr: "حزمة أيقونات الولايات الجزائرية",
      titleFr: "Pack d'icônes des wilayas",
      titleEn: "Algerian wilayas icon pack (SVG)",
      descAr: "58 أيقونة SVG للولايات الجزائرية، جاهزة للتصميم والمواقع.",
      descFr: "58 icônes SVG des wilayas algériennes, prêtes pour vos designs et sites web.",
      descEn: "58 SVG icons of Algerian wilayas, ready for designs and websites.",
      priceCentimes: 90000,
      categoryId: design.id,
      featured: false,
    },
  ];

  for (const p of sample) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        sellerId: seller.id,
        published: true,
        fileKey: `samples/${p.slug}.zip`,
        fileName: `${p.slug}.zip`,
        fileSize: 1024 * 50,
        fileMime: "application/zip",
        coverUrl: null,
      },
    });
  }

  console.log("Seeded:", { admin: admin.email, seller: seller.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
