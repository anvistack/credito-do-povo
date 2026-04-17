import { DonaMaria, Carlos, SeuAntonio } from "@/components/avatars";

const ITEMS = [
  {
    Avatar: DonaMaria,
    name: "Dona Maria",
    role: "Aposentada INSS",
    text: "Pensei que fosse complicado, mas foi tudo muito fácil! Em menos de um dia o dinheiro já tava na minha conta. As meninas me ajudaram em tudo, coisa linda!",
  },
  {
    Avatar: Carlos,
    name: "Carlos",
    role: "Trabalhador CLT",
    text: "Precisava de um dinheiro urgente e me atenderam rapidinho. Sem enrolação nenhuma. Falei pro meu colega de obra e ele já tá querendo contratar também!",
  },
  {
    Avatar: SeuAntonio,
    name: "Seu Antônio",
    role: "Pensionista INSS",
    text: "Já tinha tentado em outro lugar e não deu certo. Aqui foi diferente, me explicaram tudinho com calma. Consegui meu crédito sem sair de casa, graças a Deus!",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-16 sm:py-24 gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Histórias reais
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-brand text-foreground">
            Quem já passou pelas nossas mãos
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ITEMS.map((t) => {
            const A = t.Avatar;
            return (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-card shadow-card border border-border flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary/30 shrink-0">
                    <A />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                    <div className="text-warning text-sm leading-none mt-0.5">★★★★★</div>
                  </div>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">"{t.text}"</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
