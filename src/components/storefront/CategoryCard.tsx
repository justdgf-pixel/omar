"use client";

import Link from "next/link";

interface Category {
  slug: string;
  nameFr: string;
  name: string;
  _count: { products: number };
}

const categoryIcons: Record<string, string> = {
  ebooks: "📚",
  courses: "🎓",
  templates: "📄",
  software: "💻",
  graphics: "🎨",
};

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group bg-white rounded-2xl border border-border p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary-100/50 hover:-translate-y-1 hover:border-primary-200">
        <div className="text-4xl mb-3">{categoryIcons[category.slug] || "📦"}</div>
        <h3 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
          {category.nameFr || category.name}
        </h3>
        <p className="text-sm text-text-muted mt-1">{category._count.products} produits</p>
      </div>
    </Link>
  );
}
