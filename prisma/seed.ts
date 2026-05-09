import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "E-Books", nameFr: "Livres numériques", nameAr: "كتب إلكترونية", slug: "ebooks", icon: "📚" },
    { name: "Online Courses", nameFr: "Cours en ligne", nameAr: "دورات عبر الإنترنت", slug: "courses", icon: "🎓" },
    { name: "Templates", nameFr: "Modèles", nameAr: "قوالب", slug: "templates", icon: "📋" },
    { name: "Software", nameFr: "Logiciels", nameAr: "برامج", slug: "software", icon: "💻" },
    { name: "Graphics & Design", nameFr: "Graphisme & Design", nameAr: "تصميم جرافيك", slug: "graphics", icon: "🎨" },
    { name: "Music & Audio", nameFr: "Musique & Audio", nameAr: "موسيقى وصوتيات", slug: "music", icon: "🎵" },
    { name: "Stock Photos", nameFr: "Photos", nameAr: "صور", slug: "photos", icon: "📷" },
    { name: "Documents", nameFr: "Documents", nameAr: "وثائق", slug: "documents", icon: "📄" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const passwordHash = await bcrypt.hash("password123", 12);

  const seller1 = await prisma.user.upsert({ where: { email: "karim@digidz.com" }, update: {}, create: { email: "karim@digidz.com", name: "Karim Boudjema", passwordHash, role: "seller", wilaya: "Alger", bio: "Developer and digital creator from Algiers" } });
  const seller2 = await prisma.user.upsert({ where: { email: "amina@digidz.com" }, update: {}, create: { email: "amina@digidz.com", name: "Amina Benali", passwordHash, role: "seller", wilaya: "Oran", bio: "Graphic designer and illustrator based in Oran" } });
  const seller3 = await prisma.user.upsert({ where: { email: "yacine@digidz.com" }, update: {}, create: { email: "yacine@digidz.com", name: "Yacine Mebarki", passwordHash, role: "seller", wilaya: "Constantine", bio: "Full-stack developer and online educator" } });
  await prisma.user.upsert({ where: { email: "buyer@digidz.com" }, update: {}, create: { email: "buyer@digidz.com", name: "Ahmed Tlemcani", passwordHash, role: "buyer", wilaya: "Tlemcen" } });

  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  const products = [
    { title: "Complete Guide to Web Development in Algeria", description: "A comprehensive e-book covering modern web development with practical examples relevant to the Algerian market.", price: 2500, comparePrice: 4000, categoryId: catMap["ebooks"], sellerId: seller1.id, fileUrl: "/files/webdev-guide.pdf", fileSize: "15 MB", fileType: "PDF", featured: true, downloads: 342, rating: 4.5, reviewCount: 28, tags: JSON.stringify(["web", "development", "javascript"]) },
    { title: "Mastering Python - From Zero to Hero", description: "Start from zero and become a Python expert. This course includes video lessons, exercises, and real-world projects.", price: 5000, comparePrice: 8000, categoryId: catMap["courses"], sellerId: seller3.id, fileUrl: "/files/python-course.zip", fileSize: "2.3 GB", fileType: "ZIP", featured: true, downloads: 567, rating: 4.8, reviewCount: 45, tags: JSON.stringify(["python", "programming", "course"]) },
    { title: "Algerian Business Plan Template Pack", description: "Professional business plan templates adapted for Algerian entrepreneurs. Includes financial projections in DZD.", price: 1500, categoryId: catMap["templates"], sellerId: seller1.id, fileUrl: "/files/business-templates.zip", fileSize: "45 MB", fileType: "ZIP", featured: true, downloads: 234, rating: 4.3, reviewCount: 19, tags: JSON.stringify(["business", "template"]) },
    { title: "Algerian Cultural Illustration Pack", description: "Beautiful vector illustrations featuring Algerian culture, landmarks, and traditions.", price: 3500, comparePrice: 5000, categoryId: catMap["graphics"], sellerId: seller2.id, fileUrl: "/files/dz-illustrations.zip", fileSize: "120 MB", fileType: "ZIP", featured: true, downloads: 189, rating: 4.7, reviewCount: 22, tags: JSON.stringify(["illustrations", "algeria", "culture"]) },
    { title: "E-Commerce Starter Kit for Algeria", description: "Complete e-commerce solution built for Algerian market with CCP/BaridiMob payment integration.", price: 15000, comparePrice: 25000, categoryId: catMap["software"], sellerId: seller3.id, fileUrl: "/files/ecommerce-kit.zip", fileSize: "350 MB", fileType: "ZIP", featured: true, downloads: 78, rating: 4.6, reviewCount: 12, tags: JSON.stringify(["ecommerce", "software"]) },
    { title: "Traditional Algerian Music Loops & Samples", description: "Professional-quality music loops inspired by traditional Algerian music. 200+ loops.", price: 4000, categoryId: catMap["music"], sellerId: seller2.id, fileUrl: "/files/dz-music-loops.zip", fileSize: "800 MB", fileType: "ZIP", featured: true, downloads: 145, rating: 4.4, reviewCount: 16, tags: JSON.stringify(["music", "loops", "samples"]) },
    { title: "Algeria Stock Photo Collection - 500 Photos", description: "High-resolution stock photos of Algeria. Royalty-free for commercial use.", price: 6000, comparePrice: 10000, categoryId: catMap["photos"], sellerId: seller2.id, fileUrl: "/files/dz-photos.zip", fileSize: "4.5 GB", fileType: "ZIP", featured: true, downloads: 92, rating: 4.9, reviewCount: 8, tags: JSON.stringify(["photos", "stock", "algeria"]) },
    { title: "Algerian Tax & Legal Document Templates", description: "Essential legal and tax document templates for Algerian businesses in French and Arabic.", price: 2000, categoryId: catMap["documents"], sellerId: seller1.id, fileUrl: "/files/legal-templates.zip", fileSize: "25 MB", fileType: "ZIP", featured: true, downloads: 456, rating: 4.2, reviewCount: 34, tags: JSON.stringify(["legal", "tax", "documents"]) },
    { title: "React Native Mobile App Course (Arabic)", description: "Full course in Arabic teaching React Native mobile development. Build 5 complete apps.", price: 7000, comparePrice: 12000, categoryId: catMap["courses"], sellerId: seller3.id, fileUrl: "/files/rn-course-ar.zip", fileSize: "5.2 GB", fileType: "ZIP", downloads: 312, rating: 4.7, reviewCount: 38, tags: JSON.stringify(["react-native", "mobile", "arabic"]) },
    { title: "Modern Arabic Calligraphy Font Pack", description: "10 beautiful Arabic calligraphy fonts designed for modern use.", price: 3000, categoryId: catMap["graphics"], sellerId: seller2.id, fileUrl: "/files/arabic-fonts.zip", fileSize: "35 MB", fileType: "ZIP", downloads: 278, rating: 4.5, reviewCount: 25, tags: JSON.stringify(["fonts", "arabic", "calligraphy"]) },
    { title: "Freelancing Guide for Algerians", description: "Complete guide to freelancing from Algeria. Covers finding clients, getting paid, tax obligations.", price: 1800, categoryId: catMap["ebooks"], sellerId: seller1.id, fileUrl: "/files/freelancing-guide.pdf", fileSize: "8 MB", fileType: "PDF", downloads: 523, rating: 4.6, reviewCount: 41, tags: JSON.stringify(["freelancing", "business"]) },
    { title: "Social Media Marketing Templates (DZ Edition)", description: "150+ social media post templates designed for Algerian businesses.", price: 2500, comparePrice: 4500, categoryId: catMap["templates"], sellerId: seller2.id, fileUrl: "/files/social-templates.zip", fileSize: "200 MB", fileType: "ZIP", downloads: 387, rating: 4.4, reviewCount: 29, tags: JSON.stringify(["social-media", "marketing"]) },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { title: product.title } });
    if (!existing) await prisma.product.create({ data: product });
  }

  console.log("Seed completed successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
