export type Product = {
  slug: string;
  title: string;
  category: string;
  headline: string;
  priceDzd: number;
  shortDescription: string;
  longDescription: string;
  deliveryLabel: string;
  formats: string[];
  features: string[];
  audience: string[];
  paymentHints: string[];
  assetPath: string;
};

export const paymentRails = [
  {
    title: "CIB cards",
    body: "For banked customers using SATIM-backed online card payments.",
  },
  {
    title: "Edahabia",
    body: "A core local payment method for broad reach through Algerie Poste.",
  },
  {
    title: "BaridiMob confirmation",
    body: "Useful for trust-building, reminders, and post-payment support flows.",
  },
] as const;

export const trustPoints = [
  "Instant access after confirmed payment",
  "Arabic/French-friendly positioning and support copy",
  "Mobile-first checkout with WhatsApp-style reassurance",
  "Ready to extend into analytics, coupons, and seller dashboards",
] as const;

export const products: Product[] = [
  {
    slug: "freelancer-toolkit",
    title: "Freelancer toolkit",
    category: "Templates",
    headline: "Invoices, proposals, and social assets for solo operators.",
    priceDzd: 6900,
    shortDescription:
      "A business starter bundle for Algerian freelancers who want polished files they can customize fast.",
    longDescription:
      "Launch faster with editable business templates, proposal pages, social media posts, and onboarding files tailored for local service businesses.",
    deliveryLabel: "Instant download",
    formats: ["Canva", "PDF", "Google Docs"],
    features: [
      "20 editable Canva templates",
      "Arabic and French invoice pack",
      "Proposal and client onboarding docs",
      "Brand moodboard and pricing worksheet",
    ],
    audience: ["Freelancers", "Designers", "Small agencies"],
    paymentHints: ["CIB", "Edahabia"],
    assetPath: "/downloads/freelancer-toolkit.txt",
  },
  {
    slug: "arabic-coding-course",
    title: "Arabic coding course",
    category: "Courses",
    headline: "A practical developer course with files, lessons, and updates.",
    priceDzd: 12000,
    shortDescription:
      "A beginner-friendly course bundle with code samples, exercises, and structured learning for mobile-first students.",
    longDescription:
      "Sell a structured learning path with lesson modules, starter repositories, worksheets, and private community access for students who prefer Arabic-first instruction.",
    deliveryLabel: "Course access",
    formats: ["Video", "Source code", "Worksheets"],
    features: [
      "12 structured lesson modules",
      "Downloadable starter source files",
      "Practice prompts and checklists",
      "Bonus update pack for future revisions",
    ],
    audience: ["Students", "Career switchers", "Junior developers"],
    paymentHints: ["Edahabia", "BaridiMob support"],
    assetPath: "/downloads/arabic-coding-course.txt",
  },
  {
    slug: "ramadan-recipe-ebook",
    title: "Ramadan recipe ebook",
    category: "Ebooks",
    headline: "Premium recipe content with printable extras and meal planning.",
    priceDzd: 2500,
    shortDescription:
      "A simple digital product format that is easy to market and easy to fulfill with instant delivery.",
    longDescription:
      "Package recipes, shopping lists, and printable meal planning sheets into a lightweight offer that can be promoted on Instagram, TikTok, and WhatsApp.",
    deliveryLabel: "PDF delivery",
    formats: ["PDF", "Printable planner"],
    features: [
      "Illustrated recipe guide",
      "Shopping list templates",
      "Printable meal planner",
      "Bonus social promo captions",
    ],
    audience: ["Food creators", "Families", "Lifestyle audiences"],
    paymentHints: ["CIB", "Edahabia"],
    assetPath: "/downloads/ramadan-recipe-ebook.txt",
  },
];

export const launchSteps = [
  "Set up your legal activity, invoicing flow, and merchant paperwork before processing live payments.",
  "Connect an approved local gateway when your merchant account is validated and use a sandbox for webhook testing.",
  "Automate delivery by product type: file download, course enrollment, invite link, or license key.",
] as const;

export const faqItems = [
  {
    question: "How are digital products delivered?",
    answer:
      "This starter demonstrates instant access after order creation. In production, unlock downloads or course access only after the payment gateway confirms the order.",
  },
  {
    question: "Which payment methods should come first?",
    answer:
      "Most Algeria-focused stores should prioritize CIB and Edahabia, then add clear support messaging for buyers who need help completing payment.",
  },
  {
    question: "Where are demo orders stored?",
    answer:
      "Orders are written to a local JSON file inside the web app as a starter persistence layer. Replace it with a real database before launch.",
  },
] as const;

export function formatPrice(priceDzd: number) {
  return `${new Intl.NumberFormat("fr-DZ").format(priceDzd)} DZD`;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
