"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ArrowLeft,
  Upload,
  X,
  Save,
  Image,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  nameFr: string;
}

function ProductsManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showNew = searchParams.get("action") === "new";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(showNew);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    titleFr: "",
    description: "",
    descriptionFr: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    tags: "",
    fileUrl: "",
    fileName: "",
    fileSize: 0,
    thumbnail: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (!userData.user || (userData.user.role !== "seller" && userData.user.role !== "admin")) {
          router.push("/login");
          return;
        }

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products?sellerId=${userData.user.id}&limit=100`),
          fetch("/api/categories"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch {
        router.push("/login");
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "thumbnail"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    if (type === "product") setUploading(true);
    else setUploadingThumb(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (type === "product") {
          setForm({
            ...form,
            fileUrl: data.url,
            fileName: data.fileName,
            fileSize: data.fileSize,
          });
        } else {
          setForm({ ...form, thumbnail: data.url });
        }
        toast.success("Fichier uploadé!");
      } else {
        toast.error("Erreur d'upload");
      }
    } catch {
      toast.error("Erreur d'upload");
    }

    if (type === "product") setUploading(false);
    else setUploadingThumb(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price || !form.categoryId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fileUrl: form.fileUrl || "/uploads/files/placeholder.zip",
          fileName: form.fileName || "product.zip",
        }),
      });

      if (res.ok) {
        toast.success(
          editingProduct ? "Produit mis à jour!" : "Produit créé!"
        );
        setShowForm(false);
        setEditingProduct(null);
        setForm({
          title: "",
          titleFr: "",
          description: "",
          descriptionFr: "",
          price: "",
          comparePrice: "",
          categoryId: "",
          tags: "",
          fileUrl: "",
          fileName: "",
          fileSize: 0,
          thumbnail: "",
        });
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        const productsRes = await fetch(
          `/api/products?sellerId=${userData.user.id}&limit=100`
        );
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        toast.success("Produit supprimé");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      titleFr: product.titleFr || "",
      description: product.description,
      descriptionFr: product.descriptionFr || "",
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      categoryId: product.categoryId,
      tags: product.tags || "",
      fileUrl: product.fileUrl,
      fileName: product.fileName,
      fileSize: product.fileSize,
      thumbnail: product.thumbnail || "",
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mes produits</h1>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            setForm({
              title: "",
              titleFr: "",
              description: "",
              descriptionFr: "",
              price: "",
              comparePrice: "",
              categoryId: "",
              tags: "",
              fileUrl: "",
              fileName: "",
              fileSize: 0,
              thumbnail: "",
            });
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4" />
          Nouveau
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingProduct ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre (Français)
                </label>
                <input
                  type="text"
                  value={form.titleFr}
                  onChange={(e) =>
                    setForm({ ...form, titleFr: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (DZD) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix barré (DZD)
                </label>
                <input
                  type="number"
                  value={form.comparePrice}
                  onChange={(e) =>
                    setForm({ ...form, comparePrice: e.target.value })
                  }
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameFr || cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="web, design, template"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fichier du produit
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                  {form.fileName ? (
                    <p className="text-sm text-emerald-600 font-medium">
                      {form.fileName}
                    </p>
                  ) : (
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "product")}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploading && (
                    <p className="text-xs text-gray-400 mt-1">Upload...</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image de couverture
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                  {form.thumbnail ? (
                    <img
                      src={form.thumbnail}
                      alt=""
                      className="w-full h-20 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <Image className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "thumbnail")}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploadingThumb && (
                    <p className="text-xs text-gray-400 mt-1">Upload...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600"
              >
                <Save className="w-4 h-4" />
                {editingProduct ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun produit
          </h3>
          <p className="text-gray-500 mb-6">
            Commencez par créer votre premier produit numérique
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4" />
            Créer un produit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500">
                  {product.category.nameFr || product.category.name} &middot;{" "}
                  {formatDate(product.createdAt)}
                </p>
              </div>
              <div className="text-right mr-4">
                <p className="font-semibold text-emerald-600">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-gray-400">
                  {product.published ? "Publié" : "Brouillon"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl mb-3" />
          ))}
        </div>
      }
    >
      <ProductsManager />
    </Suspense>
  );
}
