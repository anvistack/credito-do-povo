export function Footer() {
  return (
    <footer className="bg-[oklch(0.18_0.02_50)] text-white/85 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img
            src="/logo.png"
            alt="Crédito do Povo"
            className="h-9 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="mt-4 text-sm text-white/70">
            Crédito honesto, atendimento humano. Para quem nunca foi tratado bem por banco.
          </p>
        </div>
        <div>
          <div className="font-bold text-white mb-3">Serviços</div>
          <ul className="space-y-2 text-sm">
            <li>Consignado INSS</li>
            <li>Crédito CLT</li>
            <li>Conta de Energia</li>
            <li>Portabilidade</li>
            <li>Cartão Consignado</li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-white mb-3">Contato</div>
          <ul className="space-y-2 text-sm">
            <li>📞 0800 000 0000</li>
            <li>💬 WhatsApp</li>
            <li>✉️ contato@creditodopovo.com.br</li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-white mb-3">Legal</div>
          <ul className="space-y-2 text-sm">
            <li>Política de Privacidade</li>
            <li>Termos de Uso</li>
            <li>LGPD</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-white/10 text-xs text-white/60 flex flex-col sm:flex-row justify-between gap-2">
        <span>© 2026 Crédito do Povo. Todos os direitos reservados.</span>
        <span>Feito com 💛 para o povo brasileiro 🇧🇷</span>
      </div>
    </footer>
  );
}
