import HeroSection from "@/components/ui/HeroSection";
import CategoryGrid from "@/components/ui/CategoryGrid";
import FeaturedProducts from "@/components/ui/FeaturedProducts";
import { Users, Package, Star, CreditCard } from "lucide-react";

function StatsSection() {
  const stats = [
    { icon: Package, label: "Digital Products", value: "500+" },
    { icon: Users, label: "Active Sellers", value: "100+" },
    { icon: Star, label: "Happy Buyers", value: "2,000+" },
    { icon: CreditCard, label: "Wilayas Covered", value: "58" },
  ];
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { step: "01", title: "Browse Products", description: "Explore our curated collection of digital products from Algerian creators." },
    { step: "02", title: "Choose Payment", description: "Pay securely with CCP, BaridiMob, or Edahabia card - methods you trust." },
    { step: "03", title: "Instant Download", description: "Get immediate access to your digital products after payment confirmation." },
  ];
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-3 text-gray-500 text-lg">Start buying or selling in just a few steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-emerald-600">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SellerCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-600 to-teal-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Start Selling Your Digital Products</h2>
        <p className="mt-4 text-emerald-100 text-lg max-w-2xl mx-auto">
          Join hundreds of Algerian creators selling their digital products. Set your own prices, reach buyers across all 58 wilayas, and get paid through local payment methods.
        </p>
        <a href="/auth/signup" className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-white hover:bg-gray-50 text-emerald-700 font-semibold rounded-xl transition-all shadow-lg">Create Seller Account</a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <CategoryGrid />
      <HowItWorks />
      <SellerCTA />
    </>
  );
}
