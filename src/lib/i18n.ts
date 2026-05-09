// Tiny, dependency-free i18n suited for our routing scheme: /[locale]/...
// Supported locales: ar (default, RTL), fr, en.

export const locales = ["ar", "fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

type Dict = Record<string, string>;

const ar: Dict = {
  "site.name": "سوق ديجيتال",
  "site.tagline": "سوق المنتجات الرقمية في الجزائر",
  "nav.home": "الرئيسية",
  "nav.catalog": "المتجر",
  "nav.sell": "بِع منتجاتك",
  "nav.dashboard": "لوحة التحكم",
  "nav.cart": "السلة",
  "nav.login": "تسجيل الدخول",
  "nav.register": "إنشاء حساب",
  "nav.logout": "تسجيل الخروج",
  "home.hero.title": "بع واشترِ المنتجات الرقمية في الجزائر",
  "home.hero.subtitle": "كتب إلكترونية، دورات، قوالب، وبرمجيات — الدفع ببطاقة الذهبية أو CIB.",
  "home.hero.cta.shop": "تصفّح المنتجات",
  "home.hero.cta.sell": "ابدأ البيع",
  "home.featured": "منتجات مميّزة",
  "home.categories": "الأقسام",
  "home.payments.title": "طرق دفع محلية",
  "home.payments.body": "ندعم الذهبية، بطاقة CIB، التحويل البنكي، وبريدي موب — مع ضمان التسليم الفوري للملفات.",
  "product.buyNow": "اشترِ الآن",
  "product.addToCart": "أضف إلى السلة",
  "product.download": "تحميل",
  "product.byAuthor": "بواسطة",
  "product.empty": "لا توجد منتجات بعد.",
  "cart.title": "سلة المشتريات",
  "cart.empty": "السلة فارغة.",
  "cart.checkout": "إتمام الشراء",
  "cart.total": "المجموع",
  "cart.remove": "حذف",
  "checkout.title": "الدفع",
  "checkout.method": "طريقة الدفع",
  "checkout.method.edahabia": "بطاقة الذهبية (Chargily Pay)",
  "checkout.method.cib": "بطاقة CIB (Chargily Pay)",
  "checkout.method.bank": "تحويل بنكي",
  "checkout.method.baridimob": "بريدي موب",
  "checkout.pay": "ادفع الآن",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.name": "الاسم الكامل",
  "auth.login.title": "تسجيل الدخول",
  "auth.register.title": "إنشاء حساب جديد",
  "auth.submit.login": "دخول",
  "auth.submit.register": "تسجيل",
  "dashboard.title": "لوحة التحكم",
  "dashboard.purchases": "مشترياتي",
  "dashboard.products": "منتجاتي",
  "dashboard.orders": "طلباتي",
  "dashboard.newProduct": "منتج جديد",
  "form.title": "العنوان",
  "form.description": "الوصف",
  "form.price": "السعر (د.ج)",
  "form.category": "القسم",
  "form.file": "ملف المنتج",
  "form.cover": "صورة الغلاف (رابط)",
  "form.submit": "حفظ",
  "common.currency": "د.ج",
  "common.search": "بحث...",
  "common.loading": "جاري التحميل...",
  "common.error": "حدث خطأ.",
  "footer.about": "سوق ديجيتال هو منصّة جزائرية لبيع وشراء المنتجات الرقمية.",
  "footer.rights": "© {year} سوق ديجيتال. جميع الحقوق محفوظة."
};

const fr: Dict = {
  "site.name": "Souk Digital",
  "site.tagline": "Le marché des produits numériques en Algérie",
  "nav.home": "Accueil",
  "nav.catalog": "Boutique",
  "nav.sell": "Vendre",
  "nav.dashboard": "Tableau de bord",
  "nav.cart": "Panier",
  "nav.login": "Connexion",
  "nav.register": "Inscription",
  "nav.logout": "Déconnexion",
  "home.hero.title": "Vendez et achetez des produits numériques en Algérie",
  "home.hero.subtitle": "E-books, formations, templates et logiciels — payez avec EDAHABIA ou CIB.",
  "home.hero.cta.shop": "Parcourir le catalogue",
  "home.hero.cta.sell": "Commencer à vendre",
  "home.featured": "Produits en vedette",
  "home.categories": "Catégories",
  "home.payments.title": "Paiements locaux",
  "home.payments.body": "EDAHABIA, CIB, virement bancaire et BaridiMob — livraison instantanée des fichiers.",
  "product.buyNow": "Acheter",
  "product.addToCart": "Ajouter au panier",
  "product.download": "Télécharger",
  "product.byAuthor": "Par",
  "product.empty": "Aucun produit pour l’instant.",
  "cart.title": "Panier",
  "cart.empty": "Votre panier est vide.",
  "cart.checkout": "Passer la commande",
  "cart.total": "Total",
  "cart.remove": "Retirer",
  "checkout.title": "Paiement",
  "checkout.method": "Méthode de paiement",
  "checkout.method.edahabia": "Carte EDAHABIA (Chargily Pay)",
  "checkout.method.cib": "Carte CIB (Chargily Pay)",
  "checkout.method.bank": "Virement bancaire",
  "checkout.method.baridimob": "BaridiMob",
  "checkout.pay": "Payer maintenant",
  "auth.email": "E-mail",
  "auth.password": "Mot de passe",
  "auth.name": "Nom complet",
  "auth.login.title": "Connexion",
  "auth.register.title": "Créer un compte",
  "auth.submit.login": "Se connecter",
  "auth.submit.register": "S’inscrire",
  "dashboard.title": "Tableau de bord",
  "dashboard.purchases": "Mes achats",
  "dashboard.products": "Mes produits",
  "dashboard.orders": "Mes commandes",
  "dashboard.newProduct": "Nouveau produit",
  "form.title": "Titre",
  "form.description": "Description",
  "form.price": "Prix (DZD)",
  "form.category": "Catégorie",
  "form.file": "Fichier produit",
  "form.cover": "Image de couverture (URL)",
  "form.submit": "Enregistrer",
  "common.currency": "DA",
  "common.search": "Rechercher...",
  "common.loading": "Chargement...",
  "common.error": "Une erreur est survenue.",
  "footer.about": "Souk Digital est une plateforme algérienne dédiée à la vente de produits numériques.",
  "footer.rights": "© {year} Souk Digital. Tous droits réservés."
};

const en: Dict = {
  "site.name": "Souk Digital",
  "site.tagline": "Algeria’s marketplace for digital products",
  "nav.home": "Home",
  "nav.catalog": "Shop",
  "nav.sell": "Sell",
  "nav.dashboard": "Dashboard",
  "nav.cart": "Cart",
  "nav.login": "Sign in",
  "nav.register": "Sign up",
  "nav.logout": "Sign out",
  "home.hero.title": "Sell and buy digital products in Algeria",
  "home.hero.subtitle": "E-books, courses, templates and software — pay with EDAHABIA or CIB.",
  "home.hero.cta.shop": "Browse catalog",
  "home.hero.cta.sell": "Start selling",
  "home.featured": "Featured products",
  "home.categories": "Categories",
  "home.payments.title": "Local payments",
  "home.payments.body": "EDAHABIA, CIB, bank transfer and BaridiMob — instant file delivery.",
  "product.buyNow": "Buy now",
  "product.addToCart": "Add to cart",
  "product.download": "Download",
  "product.byAuthor": "By",
  "product.empty": "No products yet.",
  "cart.title": "Cart",
  "cart.empty": "Your cart is empty.",
  "cart.checkout": "Checkout",
  "cart.total": "Total",
  "cart.remove": "Remove",
  "checkout.title": "Checkout",
  "checkout.method": "Payment method",
  "checkout.method.edahabia": "EDAHABIA card (Chargily Pay)",
  "checkout.method.cib": "CIB card (Chargily Pay)",
  "checkout.method.bank": "Bank transfer",
  "checkout.method.baridimob": "BaridiMob",
  "checkout.pay": "Pay now",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.name": "Full name",
  "auth.login.title": "Sign in",
  "auth.register.title": "Create an account",
  "auth.submit.login": "Sign in",
  "auth.submit.register": "Sign up",
  "dashboard.title": "Dashboard",
  "dashboard.purchases": "My purchases",
  "dashboard.products": "My products",
  "dashboard.orders": "My orders",
  "dashboard.newProduct": "New product",
  "form.title": "Title",
  "form.description": "Description",
  "form.price": "Price (DZD)",
  "form.category": "Category",
  "form.file": "Product file",
  "form.cover": "Cover image (URL)",
  "form.submit": "Save",
  "common.currency": "DZD",
  "common.search": "Search...",
  "common.loading": "Loading...",
  "common.error": "Something went wrong.",
  "footer.about": "Souk Digital is an Algerian platform for buying and selling digital products.",
  "footer.rights": "© {year} Souk Digital. All rights reserved."
};

const dictionaries: Record<Locale, Dict> = { ar, fr, en };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function tFor(locale: Locale) {
  const dict = getDictionary(locale);
  return (key: string, vars: Record<string, string | number> = {}): string => {
    let s = dict[key] ?? key;
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

export function localeFieldsFor(locale: Locale) {
  const cap = locale.charAt(0).toUpperCase() + locale.slice(1);
  return {
    title: `title${cap}` as "titleAr" | "titleFr" | "titleEn",
    description: `description${cap}` as "descriptionAr" | "descriptionFr" | "descriptionEn",
    name: `name${cap}` as "nameAr" | "nameFr" | "nameEn"
  };
}
