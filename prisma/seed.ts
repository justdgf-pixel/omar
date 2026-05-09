/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("→ Seeding Souk Digital DZ");

  // --- Categories
  const cats = [
    {
      slug: "ebooks",
      nameAr: "كتب إلكترونية",
      nameFr: "Ebooks",
      nameEn: "Ebooks",
      icon: "📚",
    },
    {
      slug: "courses",
      nameAr: "دورات تدريبية",
      nameFr: "Formations",
      nameEn: "Courses",
      icon: "🎓",
    },
    {
      slug: "templates",
      nameAr: "قوالب",
      nameFr: "Templates",
      nameEn: "Templates",
      icon: "🧩",
    },
    {
      slug: "design",
      nameAr: "أصول تصميم",
      nameFr: "Design assets",
      nameEn: "Design assets",
      icon: "🎨",
    },
    {
      slug: "audio",
      nameAr: "صوتيات",
      nameFr: "Audio & musique",
      nameEn: "Audio & music",
      icon: "🎧",
    },
    {
      slug: "software",
      nameAr: "برمجيات",
      nameFr: "Logiciels & plugins",
      nameEn: "Software & plugins",
      icon: "💻",
    },
  ];
  for (const c of cats) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  // --- Admin
  const admin = await db.user.upsert({
    where: { email: "admin@souk.dz" },
    update: {},
    create: {
      email: "admin@souk.dz",
      name: "Admin",
      role: "ADMIN",
      locale: "fr",
      passwordHash: await bcrypt.hash("admin1234", 10),
    },
  });

  // --- Demo seller
  const seller = await db.user.upsert({
    where: { email: "seller@souk.dz" },
    update: {},
    create: {
      email: "seller@souk.dz",
      name: "Yasmine Khelif",
      role: "SELLER",
      locale: "fr",
      wilaya: "Alger",
      passwordHash: await bcrypt.hash("seller1234", 10),
      sellerProfile: {
        create: {
          storeName: "Studio Casbah",
          storeSlug: "studio-casbah",
          bio: "Studio de design et de formation basé à Alger.",
          ccpAccount: "1234567 89",
          approved: true,
        },
      },
    },
    include: { sellerProfile: true },
  });

  // --- Demo buyer
  await db.user.upsert({
    where: { email: "buyer@souk.dz" },
    update: {},
    create: {
      email: "buyer@souk.dz",
      name: "Sami Benali",
      role: "BUYER",
      locale: "ar",
      wilaya: "Oran",
      passwordHash: await bcrypt.hash("buyer1234", 10),
    },
  });

  // --- Products
  const sellerProfile =
    seller.sellerProfile ??
    (await db.sellerProfile.findUnique({ where: { userId: seller.id } }));
  if (!sellerProfile) throw new Error("seller profile missing");

  const ebooks = await db.category.findUnique({ where: { slug: "ebooks" } });
  const courses = await db.category.findUnique({ where: { slug: "courses" } });
  const templates = await db.category.findUnique({
    where: { slug: "templates" },
  });
  const design = await db.category.findUnique({ where: { slug: "design" } });
  const software = await db.category.findUnique({ where: { slug: "software" } });

  const products = [
    {
      slug: "guide-freelance-algerie",
      titleAr: "دليل العمل الحر في الجزائر",
      titleFr: "Le guide du freelance en Algérie",
      titleEn: "The Algerian Freelancer's Guide",
      descAr:
        "كتاب إلكتروني شامل (PDF + EPUB) يشرح كل ما تحتاجه لبدء العمل الحر في الجزائر: الإجراءات الإدارية، CNAS، استلام المدفوعات، الفوترة، والضرائب.",
      descFr:
        "Un ebook complet (PDF + EPUB) qui couvre tout pour démarrer en freelance en Algérie : démarches, CNAS, encaissement, facturation et fiscalité.",
      descEn:
        "A complete ebook (PDF + EPUB) covering everything to start freelancing in Algeria: paperwork, CNAS, payments, invoicing, and taxes.",
      priceDzd: 1900,
      compareAtDzd: 2500,
      categoryId: ebooks!.id,
      featured: true,
      coverImage: "/uploads/sample-ebook.svg",
    },
    {
      slug: "formation-react-darija",
      titleAr: "دورة React بالدارجة",
      titleFr: "Formation React (français + darija)",
      titleEn: "React Course (Arabic darija + French)",
      descAr:
        "أكثر من 30 ساعة فيديو تعلمك React من الصفر إلى مستوى متقدم بأمثلة جزائرية واقعية.",
      descFr:
        "Plus de 30 heures de vidéo pour apprendre React de zéro à avancé avec des exemples concrets algériens.",
      descEn:
        "30+ hours of video teaching React from zero to advanced with practical Algerian examples.",
      priceDzd: 4900,
      categoryId: courses!.id,
      featured: true,
      coverImage: "/uploads/sample-course.svg",
    },
    {
      slug: "pack-cv-recruteurs-dz",
      titleAr: "قوالب سيرة ذاتية للمجندين الجزائريين",
      titleFr: "Pack CV pour recruteurs algériens",
      titleEn: "CV pack for Algerian recruiters",
      descAr:
        "20 قالب CV احترافي بصيغة DOCX و PDF متوافق مع متطلبات السوق الجزائرية.",
      descFr:
        "20 templates de CV professionnels DOCX & PDF adaptés au marché algérien.",
      descEn:
        "20 professional CV templates (DOCX & PDF) tailored to the Algerian job market.",
      priceDzd: 800,
      categoryId: templates!.id,
      featured: true,
      coverImage: "/uploads/sample-template.svg",
    },
    {
      slug: "pack-illustrations-casbah",
      titleAr: "حزمة رسومات القصبة",
      titleFr: "Pack d'illustrations Casbah",
      titleEn: "Casbah illustrations pack",
      descAr: "50 رسمة متجهية بصيغة SVG و PNG مستوحاة من القصبة العتيقة.",
      descFr: "50 illustrations vectorielles SVG/PNG inspirées de la Casbah.",
      descEn: "50 SVG/PNG vector illustrations inspired by the old Casbah.",
      priceDzd: 1500,
      categoryId: design!.id,
      coverImage: "/uploads/sample-design.svg",
    },
    {
      slug: "plugin-facturation-dz",
      titleAr: "إضافة فوترة جزائرية لـ WooCommerce",
      titleFr: "Plugin de facturation algérienne (WooCommerce)",
      titleEn: "Algerian invoicing plugin (WooCommerce)",
      descAr:
        "إضافة لـ WooCommerce تنشئ فواتير مطابقة للقوانين الجزائرية مع رقم NIF و NIS.",
      descFr:
        "Plugin WooCommerce qui génère des factures conformes (NIF, NIS, RC, AI).",
      descEn:
        "WooCommerce plugin that generates Algerian-compliant invoices (NIF, NIS, RC, AI).",
      priceDzd: 3500,
      categoryId: software!.id,
      coverImage: "/uploads/sample-plugin.svg",
    },
    {
      slug: "presets-lightroom-sahara",
      titleAr: "إعدادات Lightroom — صحراء",
      titleFr: "Presets Lightroom — Sahara",
      titleEn: "Lightroom presets — Sahara",
      descAr:
        "30 إعداد Lightroom مستوحى من الصحراء الجزائرية لتصوير محترف.",
      descFr:
        "30 presets Lightroom inspirés du Sahara algérien pour photographes pros.",
      descEn: "30 Lightroom presets inspired by the Algerian Sahara.",
      priceDzd: 1200,
      categoryId: design!.id,
      coverImage: "/uploads/sample-presets.svg",
    },
  ];

  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        sellerId: sellerProfile.id,
        status: "PUBLISHED",
        fileKey: null,
        fileName: null,
        fileSize: null,
      },
    });
  }

  console.log("✓ Seed complete.");
  console.log("  Admin:  admin@souk.dz / admin1234");
  console.log("  Seller: seller@souk.dz / seller1234");
  console.log("  Buyer:  buyer@souk.dz / buyer1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
