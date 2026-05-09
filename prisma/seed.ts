import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@souk.dz' },
    update: {},
    create: {
      email: 'admin@souk.dz',
      name: 'Admin Souk',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@souk.dz' },
    update: {},
    create: {
      email: 'seller@souk.dz',
      name: 'Amine — Designer',
      password: passwordHash,
      role: 'SELLER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer@souk.dz' },
    update: {},
    create: {
      email: 'customer@souk.dz',
      name: 'Yasmine',
      password: passwordHash,
      role: 'CUSTOMER',
    },
  });

  const categories = [
    { slug: 'ebooks',    nameAr: 'كتب رقمية',     nameFr: 'E-books',           nameEn: 'E-books' },
    { slug: 'courses',   nameAr: 'دورات تدريبية', nameFr: 'Cours en ligne',    nameEn: 'Online courses' },
    { slug: 'design',    nameAr: 'قوالب تصميم',  nameFr: 'Templates design',  nameEn: 'Design templates' },
    { slug: 'software',  nameAr: 'برامج وأدوات',  nameFr: 'Logiciels & outils', nameEn: 'Software & tools' },
    { slug: 'audio',     nameAr: 'صوتيات وموسيقى', nameFr: 'Audio & musique',   nameEn: 'Audio & music' },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  const allCategories = await prisma.category.findMany();
  const cat = (slug: string) => allCategories.find((c) => c.slug === slug)!;

  const privateDir = path.join(process.cwd(), 'private-files');
  if (!fs.existsSync(privateDir)) fs.mkdirSync(privateDir, { recursive: true });

  const sampleProducts = [
    {
      slug: 'guide-marketing-digital-dz',
      titleAr: 'دليل التسويق الرقمي في الجزائر',
      titleFr: 'Guide du marketing digital en Algérie',
      titleEn: 'Digital marketing guide for Algeria',
      descriptionAr: 'دليل شامل لإطلاق متجرك الإلكتروني والوصول إلى عملاء جدد في الجزائر.',
      descriptionFr: "Un guide complet pour lancer votre e-commerce et atteindre de nouveaux clients en Algérie.",
      descriptionEn: 'A complete guide to launching your e-commerce business and reaching new customers in Algeria.',
      priceCents: 250000,
      coverUrl: '/covers/marketing.svg',
      categorySlug: 'ebooks',
      featured: true,
      file: 'guide-marketing-digital-dz.txt',
      fileBody: 'Sample e-book content. Replace with the real PDF in production.',
    },
    {
      slug: 'pack-icones-algerie',
      titleAr: 'مجموعة أيقونات جزائرية',
      titleFr: "Pack d'icônes Algérie",
      titleEn: 'Algeria icon pack',
      descriptionAr: '120 أيقونة بصيغة SVG مستوحاة من الثقافة الجزائرية.',
      descriptionFr: '120 icônes SVG inspirées de la culture algérienne.',
      descriptionEn: '120 SVG icons inspired by Algerian culture.',
      priceCents: 120000,
      coverUrl: '/covers/icons.svg',
      categorySlug: 'design',
      featured: true,
      file: 'algeria-icons.txt',
      fileBody: 'Pretend SVG bundle. Replace with real assets.',
    },
    {
      slug: 'cours-react-debutant',
      titleAr: 'دورة React للمبتدئين',
      titleFr: 'Cours React pour débutants',
      titleEn: 'React course for beginners',
      descriptionAr: '8 ساعات من الدروس العملية لإتقان React من الصفر.',
      descriptionFr: '8 heures de leçons pratiques pour maîtriser React depuis zéro.',
      descriptionEn: '8 hours of hands-on lessons to master React from scratch.',
      priceCents: 450000,
      coverUrl: '/covers/react.svg',
      categorySlug: 'courses',
      featured: true,
      file: 'react-course.txt',
      fileBody: 'Sample course materials.',
    },
    {
      slug: 'modele-facture-cci',
      titleAr: 'قالب فاتورة احترافية',
      titleFr: 'Modèle de facture professionnel',
      titleEn: 'Professional invoice template',
      descriptionAr: 'قالب فاتورة Excel/Word مهيأ للضرائب الجزائرية (TVA).',
      descriptionFr: 'Modèle Excel/Word configuré pour la TVA algérienne.',
      descriptionEn: 'Excel/Word invoice template configured for Algerian VAT.',
      priceCents: 80000,
      coverUrl: '/covers/invoice.svg',
      categorySlug: 'design',
      file: 'invoice-template.txt',
      fileBody: 'Sample invoice template.',
    },
    {
      slug: 'application-budget',
      titleAr: 'تطبيق ميزانية شخصية',
      titleFr: 'Application budget personnel',
      titleEn: 'Personal budget app',
      descriptionAr: 'تطبيق Web بسيط لإدارة المصاريف بالدينار الجزائري.',
      descriptionFr: 'Application Web simple pour gérer ses dépenses en DZD.',
      descriptionEn: 'A simple web app to manage expenses in DZD.',
      priceCents: 300000,
      coverUrl: '/covers/budget.svg',
      categorySlug: 'software',
      file: 'budget-app.txt',
      fileBody: 'Sample app source.',
    },
    {
      slug: 'beats-rai-modern',
      titleAr: 'مجموعة إيقاعات راي عصرية',
      titleFr: 'Beats Raï modernes',
      titleEn: 'Modern Raï beats',
      descriptionAr: '20 إيقاع جاهز للاستخدام بصيغة WAV.',
      descriptionFr: '20 beats prêts à utiliser en WAV.',
      descriptionEn: '20 ready-to-use beats in WAV.',
      priceCents: 200000,
      coverUrl: '/covers/audio.svg',
      categorySlug: 'audio',
      file: 'rai-beats.txt',
      fileBody: 'Sample audio pack.',
    },
  ];

  for (const p of sampleProducts) {
    const filePath = path.join(privateDir, p.file);
    fs.writeFileSync(filePath, p.fileBody);
    const stat = fs.statSync(filePath);
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        titleAr: p.titleAr, titleFr: p.titleFr, titleEn: p.titleEn,
        descriptionAr: p.descriptionAr, descriptionFr: p.descriptionFr, descriptionEn: p.descriptionEn,
        priceCents: p.priceCents, coverUrl: p.coverUrl,
        fileUrl: p.file, fileName: p.file, fileSize: stat.size,
        featured: p.featured ?? false,
        categoryId: cat(p.categorySlug).id,
        sellerId: seller.id,
      },
      create: {
        slug: p.slug,
        titleAr: p.titleAr, titleFr: p.titleFr, titleEn: p.titleEn,
        descriptionAr: p.descriptionAr, descriptionFr: p.descriptionFr, descriptionEn: p.descriptionEn,
        priceCents: p.priceCents, coverUrl: p.coverUrl,
        fileUrl: p.file, fileName: p.file, fileSize: stat.size,
        featured: p.featured ?? false,
        published: true,
        categoryId: cat(p.categorySlug).id,
        sellerId: seller.id,
      },
    });
  }

  console.log('Seed complete. Logins:');
  console.log('  admin@souk.dz / password123');
  console.log('  seller@souk.dz / password123');
  console.log('  customer@souk.dz / password123');
  console.log('Admin id:', admin.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
