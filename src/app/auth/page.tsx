"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { WILAYAS } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "register" || m === "login") setMode(m);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login"
        ? { email, password }
        : { name, email, password, phone, wilaya };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUser(data.user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-12 items-center">
        <div className="max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold text-white">DigiStore DZ</span>
          </Link>

          <h2 className="text-4xl font-bold text-white mb-6">
            {mode === "login"
              ? "Heureux de vous revoir !"
              : "Rejoignez notre communauté"
            }
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed">
            Accédez à des milliers de produits numériques. E-books, cours, templates et plus encore. Paiement facile en Dinar Algérien.
          </p>

          <div className="flex gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">🇩🇿</div>
              <p className="text-sm text-primary-200 mt-1">100% Algérien</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">💳</div>
              <p className="text-sm text-primary-200 mt-1">Paiement local</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">⚡</div>
              <p className="text-sm text-primary-200 mt-1">Livraison instantanée</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">DigiStore DZ</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-1">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-text-secondary mb-8">
            {mode === "login"
              ? "Connectez-vous à votre compte DigiStore DZ"
              : "Créez votre compte gratuit en quelques secondes"
            }
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <Input
                id="name"
                label="Nom complet"
                placeholder="Ahmed Bensalem"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="ahmed@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            {mode === "register" && (
              <>
                <Input
                  id="phone"
                  label="Téléphone (optionnel)"
                  placeholder="0555 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Wilaya (optionnel)</label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="">Sélectionnez votre wilaya</option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            {mode === "login" ? (
              <>
                Pas encore de compte ?{" "}
                <button onClick={() => setMode("register")} className="text-primary-600 font-medium hover:underline cursor-pointer">
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button onClick={() => setMode("login")} className="text-primary-600 font-medium hover:underline cursor-pointer">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
