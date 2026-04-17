import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stats } from "@/components/landing/Stats";
import { ClientsBanner } from "@/components/landing/ClientsBanner";
import { Testimonials } from "@/components/landing/Testimonials";
import { SocialProofGrid } from "@/components/landing/SocialProofGrid";
import { FAQ } from "@/components/landing/FAQ";
import { CTABanner } from "@/components/landing/CTABanner";
import { Footer } from "@/components/landing/Footer";
import { FloatingButtons } from "@/components/landing/FloatingButtons";
import { MultiStepModal } from "@/components/form/MultiStepModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crédito do Povo — Empréstimo online, rápido e sem complicação" },
      {
        name: "description",
        content:
          "Simule seu crédito 100% online em menos de 2 minutos. Consignado INSS, CLT, portabilidade e mais. Aprovação rápida, sem sair de casa.",
      },
      { property: "og:title", content: "Crédito do Povo — Crédito honesto, atendimento humano" },
      {
        property: "og:description",
        content: "Mais de 15.000 brasileiros já confiaram. Faça sua simulação grátis agora.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);
  const onCTA = () => setOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Header onCTAClick={onCTA} />
      <main>
        <Hero onCTAClick={onCTA} />
        <Services onCTAClick={onCTA} />
        <HowItWorks />
        <Stats />
        <ClientsBanner />
        <Testimonials />
        <SocialProofGrid />
        <FAQ />
        <CTABanner onCTAClick={onCTA} />
      </main>
      <Footer />
      <FloatingButtons onFormClick={onCTA} />
      <MultiStepModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
