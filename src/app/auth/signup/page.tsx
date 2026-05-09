"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { WILAYAS } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "buyer", phone: "", wilaya: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone, wilaya: form.wilaya }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create account"); setLoading(false); return; }
      localStorage.setItem("digidz-user", JSON.stringify(data.user));
      localStorage.setItem("digidz-token", data.user.id);
      if (data.user.role === "seller") router.push("/dashboard/seller"); else router.push("/dashboard/buyer");
      window.location.reload();
    } catch { setError("Something went wrong. Please try again."); setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-white font-bold text-2xl">D</span></div>
          <h1 className="text-2xl font-bold text-gray-900">Join DigiDZ</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button type="button" onClick={() => updateForm("role", "buyer")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.role === "buyer" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>I want to Buy</button>
            <button type="button" onClick={() => updateForm("role", "seller")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.role === "seller" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>I want to Sell</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required placeholder="Your full name" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} required placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="0555..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Wilaya</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><select value={form.wilaya} onChange={(e) => updateForm("wilaya", e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none bg-white"><option value="">Select</option>{WILAYAS.map((w) => (<option key={w} value={w}>{w}</option>))}</select></div></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateForm("password", e.target.value)} required placeholder="Min 6 characters" className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="password" value={form.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} required placeholder="Repeat password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" /></div></div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors">{loading ? "Creating account..." : "Create Account"}</button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link href="/auth/signin" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign In</Link></p>
      </div>
    </div>
  );
}
