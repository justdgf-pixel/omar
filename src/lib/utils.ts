import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "DZD"): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
  "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
  "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun",
  "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
  "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

export const CATEGORIES = [
  { slug: "ebooks", name: "E-Books", nameFr: "Livres numériques", nameAr: "كتب إلكترونية", icon: "📚" },
  { slug: "courses", name: "Online Courses", nameFr: "Cours en ligne", nameAr: "دورات عبر الإنترنت", icon: "🎓" },
  { slug: "templates", name: "Templates", nameFr: "Modèles", nameAr: "قوالب", icon: "📋" },
  { slug: "software", name: "Software", nameFr: "Logiciels", nameAr: "برامج", icon: "💻" },
  { slug: "graphics", name: "Graphics & Design", nameFr: "Graphisme & Design", nameAr: "تصميم جرافيك", icon: "🎨" },
  { slug: "music", name: "Music & Audio", nameFr: "Musique & Audio", nameAr: "موسيقى وصوتيات", icon: "🎵" },
  { slug: "photos", name: "Stock Photos", nameFr: "Photos", nameAr: "صور", icon: "📷" },
  { slug: "documents", name: "Documents", nameFr: "Documents", nameAr: "وثائق", icon: "📄" },
];

export const PAYMENT_METHODS = [
  { id: "ccp", name: "CCP", nameFr: "CCP (Compte Postal)", nameAr: "حساب بريدي جاري", icon: "🏦" },
  { id: "baridimob", name: "BaridiMob", nameFr: "BaridiMob", nameAr: "بريدي موب", icon: "📱" },
  { id: "edahabia", name: "Edahabia Card", nameFr: "Carte Edahabia", nameAr: "بطاقة الذهبية", icon: "💳" },
];
