import Link from "next/link";
import { HeroActions } from "@/components/hero-actions";

// Next.js requires default export for pages
// eslint-disable-next-line import/no-default-export
export default function LandingPage() {
  const features = [
    {
      number: "01",
      label: "PROCESS",
      title: "Secure checkout powered by Mercado Pago.",
      bgColor: "bg-olive",
      textColor: "text-cream",
    },
    {
      number: "02",
      label: "TRACK",
      title: "Real-time payment status for buyers and sellers.",
      bgColor: "bg-terracotta",
      textColor: "text-cream",
    },
    {
      number: "03",
      label: "MANAGE",
      title: "Full dashboard for admins. Every transaction at a glance.",
      bgColor: "bg-tan",
      textColor: "text-brown",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 py-32 bg-brown text-cream text-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-olive/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl" />

        <p className="relative text-xs uppercase tracking-[0.3em] text-cream/60 mb-6">
          Infusio Marketplace
        </p>
        <h1 className="relative font-brand text-5xl sm:text-7xl leading-tight tracking-tight max-w-3xl">
          Payment
          <br />
          Processing
        </h1>
        <p className="relative mt-6 text-lg text-cream/70 max-w-lg leading-relaxed">
          The secure payment layer for the Infusio ecosystem. From checkout to
          confirmation, handled with care.
        </p>
        <HeroActions className="relative mt-10 flex gap-4" />
      </section>

      {/* Features */}
      <section id="features">
        {features.map((feature) => (
          <div
            key={feature.number}
            className={`${feature.bgColor} ${feature.textColor} px-6 py-20 sm:px-12 lg:px-24`}
          >
            <div className="max-w-4xl mx-auto">
              <span className="text-xs tracking-[0.2em] opacity-60">
                {feature.number} — {feature.label}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-brand leading-snug max-w-xl">
                {feature.title}
              </h2>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-brown text-cream/50 px-6 py-12 text-center text-xs tracking-wide">
        <p>
          &copy; {new Date().getFullYear()} Infusio Payments. Part of the
          Infusio Marketplace.
        </p>
      </footer>
    </div>
  );
}


