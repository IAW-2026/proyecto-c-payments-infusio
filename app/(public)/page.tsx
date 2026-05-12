import Image from "next/image";
import { ClientRedirect } from "@/app/redirect/client-redirect";
import { auth } from "@clerk/nextjs/server";
import { HeroActions } from "@/components/hero-actions";
import { Logo } from "@/components/ui/logo";

export default async function LandingPage() {
  const { userId } = await auth();
  
  if (userId) {
    return <ClientRedirect url="/redirect" />;
  }

  const features = [
    {
      number: "01",
      label: "PROCESO",
      title: "Pagos seguros potenciados por Mercado Pago.",
      bgColor: "bg-olive",
      textColor: "text-cream",
    },
    {
      number: "02",
      label: "SEGUIMIENTO",
      title: "Estado del pago en tiempo real para compradores y vendedores.",
      bgColor: "bg-terracotta",
      textColor: "text-cream",
    },
    {
      number: "03",
      label: "GESTIÓN",
      title: "Panel completo para administradores. Cada transacción a la vista.",
      bgColor: "bg-tan",
      textColor: "text-brown",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-32 sm:py-48 text-center overflow-hidden min-h-[80vh]">
        {/* Background Image */}
        <Image
          src="/infusio_hero_background_1778540230135.png"
          alt="Infusio Hero"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-brown/60 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cream/80 mb-8 italic">
            Infusio Marketplace
          </p>
          <h1 className="font-serif text-5xl sm:text-8xl text-cream leading-tight tracking-tight max-w-4xl">
            Procesamiento
            <br />
            <span className="italic font-normal">de Pagos</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-cream/80 max-w-xl leading-relaxed font-light">
            La capa de seguridad para el ecosistema de Infusio. Desde el checkout hasta 
            la confirmación, manejado con arte y precisión.
          </p>
          <HeroActions className="mt-12 flex gap-6" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="grid grid-cols-1 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.number}
            className={`${feature.bgColor} ${feature.textColor} px-8 py-24 sm:px-12 flex flex-col justify-between border-r border-brown/5 last:border-r-0`}
          >
            <div>
              <span className="text-[10px] tracking-[0.3em] font-medium opacity-60 uppercase">
                {feature.number} — {feature.label}
              </span>
              <h2 className="mt-6 text-3xl font-serif leading-tight">
                {feature.title}
              </h2>
            </div>
            <div className="mt-12 w-12 h-[1px] bg-current opacity-30" />
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-brown text-tan/40 px-6 py-16 flex flex-col items-center text-[10px] tracking-[0.2em] uppercase border-t border-cream/5">
        <Logo showText={false} className="opacity-40 grayscale hover:grayscale-0 transition-all mb-4 scale-125" />
        <p className="text-center">
          &copy; {new Date().getFullYear()} Infusio Payments. 
          <br className="sm:hidden" /> 
          Parte del Marketplace de Infusio.
        </p>
      </footer>
    </div>
  );
}
