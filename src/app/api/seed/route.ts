import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
    });
    if (existingAdmin) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    const adminPassword = await hashPassword("admin123");
    const sellerPassword = await hashPassword("seller123");

    const admin = await prisma.user.create({
      data: {
        email: "admin@digistore.dz",
        name: "Admin",
        passwordHash: adminPassword,
        role: "admin",
      },
    });

    const seller = await prisma.user.create({
      data: {
        email: "seller@digistore.dz",
        name: "Digital Creator",
        passwordHash: sellerPassword,
        role: "seller",
        phone: "0555123456",
      },
    });

    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: "E-Books",
          nameFr: "Livres numériques",
          nameAr: "كتب إلكترونية",
          slug: "ebooks",
          icon: "📚",
        },
      }),
      prisma.category.create({
        data: {
          name: "Online Courses",
          nameFr: "Cours en ligne",
          nameAr: "دورات عبر الإنترنت",
          slug: "courses",
          icon: "🎓",
        },
      }),
      prisma.category.create({
        data: {
          name: "Templates",
          nameFr: "Modèles",
          nameAr: "قوالب",
          slug: "templates",
          icon: "📄",
        },
      }),
      prisma.category.create({
        data: {
          name: "Software & Tools",
          nameFr: "Logiciels et outils",
          nameAr: "برامج وأدوات",
          slug: "software",
          icon: "💻",
        },
      }),
      prisma.category.create({
        data: {
          name: "Graphics & Design",
          nameFr: "Graphisme et design",
          nameAr: "رسومات وتصميم",
          slug: "graphics",
          icon: "🎨",
        },
      }),
      prisma.category.create({
        data: {
          name: "Music & Audio",
          nameFr: "Musique et audio",
          nameAr: "موسيقى وصوتيات",
          slug: "music",
          icon: "🎵",
        },
      }),
    ]);

    const products = await Promise.all([
      prisma.product.create({
        data: {
          title: "Complete Web Development Guide",
          titleFr: "Guide complet de développement web",
          titleAr: "دليل تطوير الويب الشامل",
          description:
            "A comprehensive guide covering HTML, CSS, JavaScript, React, and Node.js. Perfect for beginners and intermediate developers looking to master full-stack web development.",
          descriptionFr:
            "Un guide complet couvrant HTML, CSS, JavaScript, React et Node.js. Parfait pour les débutants et les développeurs intermédiaires.",
          descriptionAr:
            "دليل شامل يغطي HTML و CSS و JavaScript و React و Node.js. مثالي للمبتدئين والمطورين المتوسطين.",
          price: 2500,
          comparePrice: 5000,
          fileUrl: "/uploads/files/sample.pdf",
          fileName: "web-dev-guide.pdf",
          fileSize: 15000000,
          thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
          categoryId: categories[0].id,
          sellerId: seller.id,
          featured: true,
          tags: "web,development,programming,html,css,javascript",
        },
      }),
      prisma.product.create({
        data: {
          title: "Digital Marketing Masterclass",
          titleFr: "Masterclass en marketing digital",
          titleAr: "دورة متقدمة في التسويق الرقمي",
          description:
            "Learn digital marketing strategies including SEO, social media marketing, email marketing, and paid advertising. Includes real-world case studies from the Algerian market.",
          descriptionFr:
            "Apprenez les stratégies de marketing digital y compris le SEO, le marketing des réseaux sociaux et la publicité payante.",
          price: 3500,
          comparePrice: 7000,
          fileUrl: "/uploads/files/sample.zip",
          fileName: "digital-marketing-course.zip",
          fileSize: 500000000,
          thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
          categoryId: categories[1].id,
          sellerId: seller.id,
          featured: true,
          tags: "marketing,digital,seo,social-media",
        },
      }),
      prisma.product.create({
        data: {
          title: "Professional Resume Templates Pack",
          titleFr: "Pack de modèles de CV professionnels",
          titleAr: "حزمة قوالب السيرة الذاتية الاحترافية",
          description:
            "20 professionally designed resume templates in Word and PDF formats. ATS-friendly designs suitable for the Algerian and international job market.",
          descriptionFr:
            "20 modèles de CV conçus professionnellement en formats Word et PDF.",
          price: 800,
          comparePrice: 1500,
          fileUrl: "/uploads/files/templates.zip",
          fileName: "resume-templates.zip",
          fileSize: 25000000,
          thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
          categoryId: categories[2].id,
          sellerId: seller.id,
          featured: true,
          tags: "resume,cv,templates,job",
        },
      }),
      prisma.product.create({
        data: {
          title: "Social Media Graphics Kit",
          titleFr: "Kit de graphismes pour réseaux sociaux",
          titleAr: "مجموعة تصاميم لوسائل التواصل الاجتماعي",
          description:
            "500+ ready-to-use social media templates for Instagram, Facebook, and LinkedIn. Editable in Canva and Photoshop.",
          descriptionFr:
            "Plus de 500 modèles de réseaux sociaux prêts à l'emploi pour Instagram, Facebook et LinkedIn.",
          price: 1200,
          fileUrl: "/uploads/files/graphics.zip",
          fileName: "social-media-kit.zip",
          fileSize: 150000000,
          thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
          categoryId: categories[4].id,
          sellerId: seller.id,
          tags: "social-media,graphics,templates,design",
        },
      }),
      prisma.product.create({
        data: {
          title: "Arabic Calligraphy Font Collection",
          titleFr: "Collection de polices de calligraphie arabe",
          titleAr: "مجموعة خطوط الخط العربي",
          description:
            "A beautiful collection of 15 Arabic calligraphy fonts, perfect for design projects, logos, and branding materials.",
          descriptionFr:
            "Une belle collection de 15 polices de calligraphie arabe.",
          price: 1800,
          comparePrice: 3000,
          fileUrl: "/uploads/files/fonts.zip",
          fileName: "arabic-fonts.zip",
          fileSize: 30000000,
          thumbnail: "https://images.unsplash.com/photo-1579187707643-35646d22b596?w=400&h=300&fit=crop",
          categoryId: categories[4].id,
          sellerId: seller.id,
          featured: true,
          tags: "arabic,calligraphy,fonts,design",
        },
      }),
      prisma.product.create({
        data: {
          title: "Algerian Cooking E-Book",
          titleFr: "Livre numérique de cuisine algérienne",
          titleAr: "كتاب الطبخ الجزائري الإلكتروني",
          description:
            "100+ traditional Algerian recipes with step-by-step instructions and beautiful photography. Includes recipes for couscous, chakchouka, makrout, and more.",
          descriptionFr:
            "Plus de 100 recettes algériennes traditionnelles avec des instructions étape par étape.",
          descriptionAr:
            "أكثر من 100 وصفة جزائرية تقليدية مع تعليمات خطوة بخطوة.",
          price: 1500,
          fileUrl: "/uploads/files/cookbook.pdf",
          fileName: "algerian-cookbook.pdf",
          fileSize: 80000000,
          thumbnail: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop",
          categoryId: categories[0].id,
          sellerId: seller.id,
          tags: "cooking,algerian,recipes,food",
        },
      }),
    ]);

    await prisma.siteSettings.create({
      data: {
        siteName: "DigiStore DZ",
        siteDescription: "La marketplace #1 pour les produits numériques en Algérie",
        ccpNumber: "00799999 clé 99",
        ccpName: "DigiStore DZ",
        baridimobId: "00799999",
        contactEmail: "contact@digistore.dz",
        contactPhone: "0555 00 00 00",
      },
    });

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        admin: { email: admin.email, password: "admin123" },
        seller: { email: seller.email, password: "seller123" },
        categories: categories.length,
        products: products.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
