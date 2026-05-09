import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "غير مسموح في الإنتاج" }, { status: 403 });
  }

  try {
    // Categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "software" },
        update: {},
        create: { name: "Software", nameAr: "برمجيات", slug: "software", description: "Software and tools", icon: "💻" },
      }),
      prisma.category.upsert({
        where: { slug: "design" },
        update: {},
        create: { name: "Design", nameAr: "تصميم", slug: "design", description: "Design templates", icon: "🎨" },
      }),
      prisma.category.upsert({
        where: { slug: "education" },
        update: {},
        create: { name: "Education", nameAr: "تعليم", slug: "education", description: "Educational content", icon: "📚" },
      }),
      prisma.category.upsert({
        where: { slug: "music" },
        update: {},
        create: { name: "Music", nameAr: "موسيقى", slug: "music", description: "Music and audio", icon: "🎵" },
      }),
      prisma.category.upsert({
        where: { slug: "video" },
        update: {},
        create: { name: "Video", nameAr: "فيديو", slug: "video", description: "Video content", icon: "🎬" },
      }),
      prisma.category.upsert({
        where: { slug: "marketing" },
        update: {},
        create: { name: "Marketing", nameAr: "تسويق", slug: "marketing", description: "Marketing tools", icon: "📢" },
      }),
    ]);

    const [software, design, education, music] = categories;

    // Admin user
    const adminPass = await bcrypt.hash("admin123456", 12);
    await prisma.user.upsert({
      where: { email: "admin@rakamdz.dz" },
      update: {},
      create: {
        name: "مدير RakamDZ",
        email: "admin@rakamdz.dz",
        password: adminPass,
        role: "admin",
        wilaya: "الجزائر",
      },
    });

    // Sample products
    const products = [
      {
        name: "Complete WordPress Theme Pack",
        nameAr: "حزمة قوالب ووردبريس الشاملة",
        slug: "wordpress-theme-pack-pro",
        description: "Professional WordPress themes for businesses",
        descriptionAr: "مجموعة من أفضل قوالب ووردبريس للأعمال التجارية والمواقع الاحترافية. تشمل 10 قوالب متجاوبة مع جميع الأجهزة.",
        price: 1500,
        categoryId: design.id,
        imageUrl: null,
        fileType: "ZIP",
        fileSize: "45 MB",
        featured: true,
        published: true,
        rating: 4.8,
        reviewCount: 32,
        totalSales: 120,
        tags: "wordpress,theme,design",
      },
      {
        name: "Python Programming Course - Arabic",
        nameAr: "دورة البرمجة بلغة Python بالعربية",
        slug: "python-programming-arabic",
        description: "Complete Python programming course in Arabic",
        descriptionAr: "دورة شاملة لتعلم البرمجة بلغة Python من الصفر حتى الاحتراف. مناسبة للمبتدئين والمتوسطين.",
        price: 2500,
        categoryId: education.id,
        imageUrl: null,
        fileType: "MP4",
        fileSize: "8.2 GB",
        featured: true,
        published: true,
        rating: 4.9,
        reviewCount: 78,
        totalSales: 245,
        tags: "python,programming,course",
      },
      {
        name: "Social Media Design Kit",
        nameAr: "حزمة تصاميم وسائل التواصل الاجتماعي",
        slug: "social-media-design-kit",
        description: "Ready-to-use social media templates",
        descriptionAr: "أكثر من 200 قالب جاهز للاستخدام على وسائل التواصل الاجتماعي. مناسب لفيسبوك، انستغرام، تيكتوك والمزيد.",
        price: 800,
        categoryId: design.id,
        imageUrl: null,
        fileType: "PSD",
        fileSize: "2.1 GB",
        featured: false,
        published: true,
        rating: 4.7,
        reviewCount: 45,
        totalSales: 180,
        tags: "social-media,design,templates",
      },
      {
        name: "Accounting Software - DZ Edition",
        nameAr: "برنامج المحاسبة - إصدار الجزائر",
        slug: "accounting-software-dz",
        description: "Accounting software adapted for Algerian businesses",
        descriptionAr: "برنامج محاسبة شامل مخصص للشركات الجزائرية. يدعم الفاتورة الإلكترونية والتقارير الضريبية.",
        price: 4500,
        categoryId: software.id,
        imageUrl: null,
        fileType: "EXE",
        fileSize: "156 MB",
        featured: true,
        published: true,
        rating: 4.6,
        reviewCount: 23,
        totalSales: 67,
        tags: "accounting,software,business",
      },
      {
        name: "Arabic Music Production Pack",
        nameAr: "حزمة الإنتاج الموسيقي العربي",
        slug: "arabic-music-production-pack",
        description: "Arabic music loops and samples",
        descriptionAr: "مجموعة من أفضل الأصوات والإيقاعات العربية الجاهزة للإنتاج الموسيقي. أكثر من 500 مقطع صوتي.",
        price: 1200,
        categoryId: music.id,
        imageUrl: null,
        fileType: "WAV",
        fileSize: "3.4 GB",
        featured: false,
        published: true,
        rating: 4.5,
        reviewCount: 19,
        totalSales: 89,
        tags: "music,arabic,production",
      },
      {
        name: "Digital Marketing Course",
        nameAr: "دورة التسويق الرقمي الشاملة",
        slug: "digital-marketing-course-arabic",
        description: "Complete digital marketing in Arabic",
        descriptionAr: "تعلم التسويق الرقمي من الصفر: SEO، إعلانات فيسبوك، إنستغرام، البريد الإلكتروني، وأكثر.",
        price: 3000,
        categoryId: education.id,
        imageUrl: null,
        fileType: "MP4",
        fileSize: "12.5 GB",
        featured: true,
        published: true,
        rating: 4.8,
        reviewCount: 56,
        totalSales: 203,
        tags: "marketing,digital,course",
      },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم تهيئة البيانات بنجاح!",
      admin: { email: "admin@rakamdz.dz", password: "admin123456" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ في تهيئة البيانات" }, { status: 500 });
  }
}
