export type ProductCategory =
  | "ebooks"
  | "courses"
  | "templates"
  | "software"
  | "graphics"
  | "music"
  | "photos";

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number; // in DZD
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  gallery?: string[];
  rating: number;
  reviewCount: number;
  downloadCount: number;
  fileSize: string;
  fileType: string;
  featured: boolean;
  bestseller: boolean;
  createdAt: string;
  seller: Seller;
  tags: string[];
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  wilaya: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "cib" | "dahabia" | "baridimob" | "ccp";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wilaya: string;
  avatar?: string;
  role: "customer" | "seller" | "admin";
  createdAt: string;
}

export type Locale = "fr" | "ar";

export const WILAYAS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
] as const;

export const CATEGORIES: {
  id: ProductCategory;
  name: string;
  nameAr: string;
  icon: string;
}[] = [
  { id: "ebooks", name: "E-Books", nameAr: "كتب إلكترونية", icon: "📚" },
  { id: "courses", name: "Cours en ligne", nameAr: "دورات عبر الإنترنت", icon: "🎓" },
  { id: "templates", name: "Modèles", nameAr: "قوالب", icon: "📄" },
  { id: "software", name: "Logiciels", nameAr: "برامج", icon: "💻" },
  { id: "graphics", name: "Graphiques", nameAr: "رسومات", icon: "🎨" },
  { id: "music", name: "Musique", nameAr: "موسيقى", icon: "🎵" },
  { id: "photos", name: "Photos", nameAr: "صور", icon: "📷" },
];
