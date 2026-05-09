import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import ProductToggle from "./ProductToggle";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const products = await prisma.product.findMany({
    include: {
      category: true,
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> إضافة منتج
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">المنتج</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">الفئة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">السعر</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">المبيعات</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-[200px]">
                        {product.nameAr ?? product.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{product.slug}</p>
                      {product.featured && (
                        <span className="text-xs text-yellow-600">⭐ مميز</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {product.category.nameAr ?? product.category.name}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">
                    {formatPrice(product.price, product.currency)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-center">
                    {product._count.orderItems}
                  </td>
                  <td className="px-4 py-3">
                    <ProductToggle
                      productId={product.id}
                      published={product.published}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="عرض"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <p className="text-gray-400 mb-3">لا توجد منتجات بعد</p>
                    <Link href="/admin/products/new" className="text-emerald-600 hover:underline text-sm">
                      + أضف أول منتج
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
