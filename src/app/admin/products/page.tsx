"use client";

import { useEffect, useState } from "react";
import { formatDZD } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

interface Product {
  id: string;
  name: string;
  nameFr: string;
  price: number;
  image: string | null;
  published: boolean;
  featured: boolean;
  salesCount: number;
  fileType: string | null;
  category: { name: string; nameFr: string };
}

interface Category {
  id: string;
  name: string;
  nameFr: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", nameFr: "", nameAr: "",
    description: "", descriptionFr: "", descriptionAr: "",
    price: "", comparePrice: "",
    categoryId: "", image: "",
    fileUrl: "", fileSize: "", fileType: "",
    featured: false, published: true,
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(console.error);
  }, []);

  const resetForm = () => {
    setForm({
      name: "", nameFr: "", nameAr: "",
      description: "", descriptionFr: "", descriptionAr: "",
      price: "", comparePrice: "",
      categoryId: "", image: "",
      fileUrl: "", fileSize: "", fileType: "",
      featured: false, published: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id: string, field: "published" | "featured", value: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !value }),
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Produits</h1>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? "Annuler" : "+ Ajouter un produit"}
        </Button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-semibold text-text-primary mb-4">
            {editingId ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Nom (EN)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Nom (FR)" value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} />
              <Input label="Nom (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Description (EN)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Description (FR)</label>
                <textarea
                  value={form.descriptionFr}
                  onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Description (AR)</label>
                <textarea
                  value={form.descriptionAr}
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Input label="Prix (DZD)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              <Input label="Ancien prix (DZD)" type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Catégorie</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                >
                  <option value="">Sélectionner</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameFr || c.name}</option>
                  ))}
                </select>
              </div>
              <Input label="URL Image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Input label="URL du fichier" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} required />
              <Input label="Taille du fichier" value={form.fileSize} onChange={(e) => setForm({ ...form, fileSize: e.target.value })} placeholder="15 MB" />
              <Input label="Type de fichier" value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })} placeholder="PDF, ZIP..." />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                <span className="text-sm">Produit vedette</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
                <span className="text-sm">Publié</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" loading={saving}>{editingId ? "Mettre à jour" : "Créer le produit"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-border bg-surface-secondary">
                <th className="p-4 font-medium">Produit</th>
                <th className="p-4 font-medium">Catégorie</th>
                <th className="p-4 font-medium">Prix</th>
                <th className="p-4 font-medium">Ventes</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="p-4"><div className="h-8 bg-surface-tertiary rounded-lg animate-pulse" /></td></tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-text-muted">Aucun produit</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-surface-secondary/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.nameFr} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">📦</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{product.nameFr || product.name}</p>
                          {product.fileType && <p className="text-xs text-text-muted">{product.fileType}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">{product.category?.nameFr || product.category?.name}</td>
                    <td className="p-4 font-medium text-primary-700">{formatDZD(product.price)}</td>
                    <td className="p-4">{product.salesCount}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Badge variant={product.published ? "success" : "default"}>
                          {product.published ? "Publié" : "Brouillon"}
                        </Badge>
                        {product.featured && <Badge variant="info">Vedette</Badge>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggle(product.id, "published", product.published)}
                          className="p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors cursor-pointer"
                          title={product.published ? "Dépublier" : "Publier"}
                        >
                          {product.published ? "👁️" : "👁️‍🗨️"}
                        </button>
                        <button
                          onClick={() => handleToggle(product.id, "featured", product.featured)}
                          className="p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors cursor-pointer"
                          title={product.featured ? "Retirer des vedettes" : "Mettre en vedette"}
                        >
                          {product.featured ? "⭐" : "☆"}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
