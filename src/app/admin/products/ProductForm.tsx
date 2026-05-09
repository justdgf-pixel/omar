"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/lib/toast";

type Category = { id: string; name: string; nameAr?: string | null };

type ProductData = {
  id?: string;
  name?: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  price?: number;
  imageUrl?: string;
  previewUrl?: string;
  fileUrl?: string;
  fileSize?: string;
  fileType?: string;
  featured?: boolean;
  published?: boolean;
  categoryId?: string;
  tags?: string;
};

export default function ProductForm({
  categories,
  initialData,
}: {
  categories: Category[];
  initialData?: ProductData;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    nameAr: initialData?.nameAr ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    descriptionAr: initialData?.descriptionAr ?? "",
    price: initialData?.price?.toString() ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    previewUrl: initialData?.previewUrl ?? "",
    fileUrl: initialData?.fileUrl ?? "",
    fileSize: initialData?.fileSize ?? "",
    fileType: initialData?.fileType ?? "",
    featured: initialData?.featured ?? false,
    published: initialData?.published ?? false,
    categoryId: initialData?.categoryId ?? "",
    tags: initialData?.tags ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId || !form.description) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const url = initialData?.id
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = initialData?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "حدث خطأ");

      toast({ title: initialData?.id ? "تم تحديث المنتج" : "تم إضافة المنتج", variant: "success" });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast({
        title: "حدث خطأ",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900 mb-2">المعلومات الأساسية</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم المنتج (عربي) *</label>
            <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="اسم المنتج بالعربية" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name (English) *</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" dir="ltr" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL) *</label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-product-slug" dir="ltr" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">الفئة *</label>
            <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر فئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameAr ?? cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">السعر (دج) *</label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1500" dir="ltr" min="0" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (عربي) *</label>
          <textarea
            value={form.descriptionAr}
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
            rows={4}
            placeholder="وصف تفصيلي للمنتج..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (English)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            dir="ltr"
            placeholder="Product description..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Media & Files */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-900 mb-2">الملفات والوسائط</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط صورة المنتج</label>
          <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" dir="ltr" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط الملف الرئيسي (للتحميل)</label>
          <Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://storage.example.com/product.zip" dir="ltr" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط المعاينة</label>
          <Input value={form.previewUrl} onChange={(e) => setForm({ ...form, previewUrl: e.target.value })} placeholder="https://example.com/preview" dir="ltr" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع الملف</label>
            <Input value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} placeholder="ZIP, PDF, MP4..." dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">حجم الملف</label>
            <Input value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} placeholder="45 MB" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">الكلمات المفتاحية</label>
          <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="wordpress, theme, design" dir="ltr" />
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">الإعدادات</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, published: !form.published })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.published ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-4" : "translate-x-1"}`} />
            </div>
            <span className="text-sm text-gray-700">نشر المنتج (ظهور في الموقع)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.featured ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-4" : "translate-x-1"}`} />
            </div>
            <span className="text-sm text-gray-700">منتج مميز (يظهر في الصفحة الرئيسية)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} size="lg" className="flex-1">
          {loading ? "جار الحفظ..." : initialData?.id ? "تحديث المنتج" : "إضافة المنتج"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
