import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@souk.dz";
  const sellerEmail = "seller@souk.dz";
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: password,
      role: "ADMIN"
    }
  });

  const seller = await prisma.user.upsert({
    where: { email: sellerEmail },
    update: { role: "SELLER" },
    create: {
      email: sellerEmail,
      name: "Yacine Benali",
      passwordHash: password,
      role: "SELLER",
      wilaya: "Alger"
    }
  });

  const categoriesData = [
    { slug: "ebooks", nameAr: "كتب إلكترونية", nameFr: "E-books", nameEn: "E-books", icon: "📚" },
    { slug: "courses", nameAr: "دورات تدريبية", nameFr: "Formations", nameEn: "Courses", icon: "🎓" },
    { slug: "templates", nameAr: "قوالب", nameFr: "Modèles", nameEn: "Templates", icon: "🧩" },
    { slug: "software", nameAr: "برمجيات", nameFr: "Logiciels", nameEn: "Software", icon: "💻" },
    { slug: "music", nameAr: "موسيقى", nameFr: "Musique", nameEn: "Music", icon: "🎵" },
    { slug: "graphics", nameAr: "تصاميم", nameFr: "Graphismes", nameEn: "Graphics", icon: "🎨" }
  ];

  const categories = await Promise.all(
    categoriesData.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: c,
        create: c
      })
    )
  );

  const cat = (slug: string) => categories.find((c) => c.slug === slug)!.id;

  const products = [
    {
      slug: "starter-business-plan-dz",
      titleAr: "نموذج خطة عمل للشركات الناشئة في الجزائر",
      titleFr: "Modèle de business plan pour startups algériennes",
      titleEn: "Business plan template for Algerian startups",
      descriptionAr:
        "قالب احترافي بصيغة Word و PDF لإعداد خطة عمل متكاملة موجّهة للسوق الجزائري.",
      descriptionFr:
        "Modèle Word et PDF clé en main pour rédiger un business plan adapté au marché algérien.",
      descriptionEn:
        "Plug-and-play Word + PDF template to write a complete business plan tailored to Algeria.",
      priceDzd: 2500,
      coverImage:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900",
      categoryId: cat("templates"),
      featured: true
    },
    {
      slug: "darija-french-ebook",
      titleAr: "كتاب: تعلّم الفرنسية انطلاقًا من الدارجة الجزائرية",
      titleFr: "E-book : apprendre le français à partir de la darija algérienne",
      titleEn: "E-book: Learn French through Algerian darija",
      descriptionAr:
        "120 صفحة، أمثلة صوتية ومفردات يومية مرتبة حسب المواقف.",
      descriptionFr:
        "120 pages, exemples audio et vocabulaire trié par situations du quotidien.",
      descriptionEn:
        "120 pages, audio examples and vocabulary organized by everyday situations.",
      priceDzd: 1500,
      coverImage:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900",
      categoryId: cat("ebooks"),
      featured: true
    },
    {
      slug: "freelance-course-dz",
      titleAr: "دورة: ابدأ العمل الحرّ من الجزائر واستلم دفعاتك",
      titleFr: "Formation : se lancer en freelance depuis l’Algérie",
      titleEn: "Course: Start freelancing from Algeria and get paid",
      descriptionAr:
        "5 ساعات فيديو، خطوات الدفع عبر Wise وحلول محلية، عقود جاهزة.",
      descriptionFr:
        "5h de vidéos, paiements via Wise et solutions locales, contrats prêts.",
      descriptionEn:
        "5h of video, payouts via Wise and local solutions, ready-to-use contracts.",
      priceDzd: 4900,
      coverImage:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900",
      categoryId: cat("courses"),
      featured: true
    },
    {
      slug: "instagram-pack-dz",
      titleAr: "حزمة قوالب إنستغرام للتجار الجزائريين",
      titleFr: "Pack de templates Instagram pour commerçants algériens",
      titleEn: "Instagram template pack for Algerian merchants",
      descriptionAr:
        "30 قالب Canva بألوان جزائرية ونصوص جاهزة بالعربية والفرنسية.",
      descriptionFr:
        "30 modèles Canva aux couleurs algériennes, textes prêts en AR et FR.",
      descriptionEn:
        "30 Canva templates with Algerian palette and ready-to-use copy in AR/FR.",
      priceDzd: 1200,
      coverImage:
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=900",
      categoryId: cat("graphics"),
      featured: true
    },
    {
      slug: "lofi-pack-vol1",
      titleAr: "حزمة موسيقى Lo-Fi — الإصدار الأول",
      titleFr: "Pack musique Lo-Fi — Vol. 1",
      titleEn: "Lo-Fi Music Pack — Vol. 1",
      descriptionAr: "12 مقطع صوتي بترخيص استخدام تجاري.",
      descriptionFr: "12 morceaux avec licence d’utilisation commerciale.",
      descriptionEn: "12 tracks with commercial-use license.",
      priceDzd: 1990,
      coverImage:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900",
      categoryId: cat("music")
    },
    {
      slug: "wilaya-data-csv",
      titleAr: "قاعدة بيانات: ولايات وبلديات الجزائر (CSV)",
      titleFr: "Base de données : wilayas et communes d’Algérie (CSV)",
      titleEn: "Dataset: Algeria wilayas & communes (CSV)",
      descriptionAr: "ملف CSV نظيف، محدّث ومفهرس، جاهز للاستيراد في تطبيقاتك.",
      descriptionFr: "Fichier CSV propre, à jour et indexé, prêt à importer.",
      descriptionEn: "Clean, up-to-date, indexed CSV ready to import into your apps.",
      priceDzd: 990,
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900",
      categoryId: cat("software")
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        ...p,
        sellerId: seller.id,
        status: "PUBLISHED"
      },
      create: {
        ...p,
        sellerId: seller.id,
        status: "PUBLISHED"
      }
    });
  }

  console.log("Seed complete:", { admin: admin.email, seller: seller.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
