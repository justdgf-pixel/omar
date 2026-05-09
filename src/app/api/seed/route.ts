import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
    if (existingAdmin) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    const adminPassword = await hashPassword("admin123");
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@digistore.dz",
        passwordHash: adminPassword,
        role: "admin",
        wilaya: "Alger",
      },
    });

    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: "E-Books",
          nameFr: "Livres Numériques",
          nameAr: "كتب إلكترونية",
          slug: "ebooks",
          description: "Digital books and guides",
        },
      }),
      prisma.category.create({
        data: {
          name: "Online Courses",
          nameFr: "Cours en Ligne",
          nameAr: "دورات عبر الإنترنت",
          slug: "courses",
          description: "Video courses and tutorials",
        },
      }),
      prisma.category.create({
        data: {
          name: "Templates",
          nameFr: "Modèles",
          nameAr: "قوالب",
          slug: "templates",
          description: "Design and document templates",
        },
      }),
      prisma.category.create({
        data: {
          name: "Software & Tools",
          nameFr: "Logiciels & Outils",
          nameAr: "برامج وأدوات",
          slug: "software",
          description: "Software licenses and tools",
        },
      }),
      prisma.category.create({
        data: {
          name: "Graphics & Design",
          nameFr: "Graphisme & Design",
          nameAr: "تصميم جرافيك",
          slug: "graphics",
          description: "Graphics, icons, and design assets",
        },
      }),
    ]);

    const sampleProducts = [
      {
        name: "Complete Web Development Guide",
        nameFr: "Guide Complet du Développement Web",
        nameAr: "دليل تطوير الويب الشامل",
        slug: "complete-web-dev-guide",
        description: "Master HTML, CSS, JavaScript, and modern frameworks with this comprehensive guide.",
        descriptionFr: "Maîtrisez HTML, CSS, JavaScript et les frameworks modernes avec ce guide complet.",
        descriptionAr: "أتقن HTML و CSS و JavaScript والأطر الحديثة مع هذا الدليل الشامل.",
        price: 2500,
        comparePrice: 4500,
        categoryId: categories[0].id,
        fileUrl: "/files/web-dev-guide.pdf",
        fileSize: "15 MB",
        fileType: "PDF",
        featured: true,
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      },
      {
        name: "Arabic Calligraphy Masterclass",
        nameFr: "Masterclass de Calligraphie Arabe",
        nameAr: "ماستركلاس الخط العربي",
        slug: "arabic-calligraphy-masterclass",
        description: "Learn the beautiful art of Arabic calligraphy from beginner to advanced level.",
        descriptionFr: "Apprenez l'art magnifique de la calligraphie arabe du débutant au niveau avancé.",
        descriptionAr: "تعلم فن الخط العربي الجميل من المبتدئ إلى المستوى المتقدم.",
        price: 3500,
        comparePrice: 6000,
        categoryId: categories[1].id,
        fileUrl: "/files/calligraphy-course.zip",
        fileSize: "2.1 GB",
        fileType: "ZIP",
        featured: true,
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&h=400&fit=crop",
      },
      {
        name: "Professional Resume Templates Pack",
        nameFr: "Pack de Modèles CV Professionnels",
        nameAr: "حزمة قوالب السيرة الذاتية المهنية",
        slug: "professional-resume-templates",
        description: "50+ professionally designed resume templates compatible with Word and Google Docs.",
        descriptionFr: "Plus de 50 modèles de CV professionnels compatibles avec Word et Google Docs.",
        descriptionAr: "أكثر من 50 قالب سيرة ذاتية احترافي متوافق مع Word و Google Docs.",
        price: 1500,
        comparePrice: 2500,
        categoryId: categories[2].id,
        fileUrl: "/files/resume-templates.zip",
        fileSize: "85 MB",
        fileType: "ZIP",
        featured: true,
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
      },
      {
        name: "Social Media Design Kit",
        nameFr: "Kit Design Réseaux Sociaux",
        nameAr: "مجموعة تصميم وسائل التواصل الاجتماعي",
        slug: "social-media-design-kit",
        description: "200+ Canva-compatible social media templates for Instagram, Facebook, and TikTok.",
        descriptionFr: "Plus de 200 modèles compatibles Canva pour Instagram, Facebook et TikTok.",
        descriptionAr: "أكثر من 200 قالب متوافق مع Canva لانستغرام وفيسبوك وتيك توك.",
        price: 2000,
        categoryId: categories[4].id,
        fileUrl: "/files/social-media-kit.zip",
        fileSize: "150 MB",
        fileType: "ZIP",
        featured: true,
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
      },
      {
        name: "Algerian Business Plan Template",
        nameFr: "Modèle Business Plan Algérien",
        nameAr: "نموذج خطة عمل جزائرية",
        slug: "algerian-business-plan",
        description: "Complete business plan template adapted for Algerian market with financial projections in DZD.",
        descriptionFr: "Modèle de business plan complet adapté au marché algérien avec projections financières en DZD.",
        descriptionAr: "نموذج خطة عمل كامل مكيف للسوق الجزائري مع التوقعات المالية بالدينار الجزائري.",
        price: 3000,
        comparePrice: 5000,
        categoryId: categories[2].id,
        fileUrl: "/files/business-plan.docx",
        fileSize: "5 MB",
        fileType: "DOCX",
        featured: false,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      },
      {
        name: "Python Programming Course",
        nameFr: "Cours de Programmation Python",
        nameAr: "دورة برمجة بايثون",
        slug: "python-programming-course",
        description: "From zero to hero: Learn Python programming with hands-on projects.",
        descriptionFr: "De zéro à héros : Apprenez la programmation Python avec des projets pratiques.",
        descriptionAr: "من الصفر إلى الاحتراف: تعلم برمجة بايثون مع مشاريع تطبيقية.",
        price: 4000,
        comparePrice: 7000,
        categoryId: categories[1].id,
        fileUrl: "/files/python-course.zip",
        fileSize: "3.5 GB",
        fileType: "ZIP",
        featured: false,
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop",
      },
    ];

    for (const product of sampleProducts) {
      await prisma.product.create({ data: product });
    }

    await prisma.siteSettings.upsert({
      where: { id: "settings" },
      create: {
        siteName: "DigiStore DZ",
        siteDescription: "La première marketplace de produits numériques en Algérie",
        ccpNumber: "00799999 CLE 99",
        baridimobNumber: "07799999",
        contactEmail: "contact@digistore.dz",
        contactPhone: "+213 555 123 456",
        whatsappNumber: "+213555123456",
      },
      update: {},
    });

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
