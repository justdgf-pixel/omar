"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse by Category</h2>
          <p className="mt-3 text-gray-500 text-lg">Find exactly what you need from our curated categories</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="group relative bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-emerald-50 hover:to-teal-50 rounded-2xl p-6 text-center transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:shadow-md">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.nameFr}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
