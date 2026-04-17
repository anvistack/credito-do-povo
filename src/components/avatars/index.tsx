// 8 inline SVG avatars representing diverse Brazilian clients.
// All use stylized illustrations with brand-friendly palette.

type AvatarProps = { className?: string };


function Frame({ children, bg = "oklch(0.96 0.04 60)" }: { children: React.ReactNode; bg?: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <clipPath id="circ"><circle cx="50" cy="50" r="48" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill={bg} />
      <g clipPath="url(#circ)">{children}</g>
      <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(0.71 0.20 47)" strokeWidth="3" />
    </svg>
  );
}

export function DonaMaria({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.93 0.06 60)">
        <ellipse cx="50" cy="105" rx="42" ry="35" fill="oklch(0.78 0.13 25)" />
        <circle cx="50" cy="48" r="20" fill="oklch(0.55 0.08 40)" />
        <path d="M30 42 Q50 18 70 42 Q70 30 50 24 Q30 30 30 42 Z" fill="oklch(0.96 0.01 60)" />
        <circle cx="50" cy="28" r="6" fill="oklch(0.96 0.01 60)" />
        <circle cx="44" cy="50" r="1.6" fill="#1a1a1a" />
        <circle cx="56" cy="50" r="1.6" fill="#1a1a1a" />
        <path d="M44 58 Q50 62 56 58" stroke="oklch(0.40 0.10 30)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </Frame>
    </div>
  );
}

export function SeuJoao({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.92 0.08 80)">
        <circle cx="50" cy="48" r="20" fill="oklch(0.62 0.10 50)" />
        <path d="M30 40 Q50 30 70 40 Q70 28 50 26 Q30 28 30 40 Z" fill="oklch(0.85 0.02 60)" />
        <circle cx="44" cy="50" r="1.6" fill="#1a1a1a" />
        <circle cx="56" cy="50" r="1.6" fill="#1a1a1a" />
        <path d="M40 58 Q50 60 60 58" stroke="oklch(0.85 0.02 60)" strokeWidth="2.5" fill="none" />
        <ellipse cx="50" cy="105" rx="40" ry="32" fill="oklch(0.55 0.10 60)" />
      </Frame>
    </div>
  );
}

export function Carlos({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.90 0.06 50)">
        <circle cx="50" cy="48" r="20" fill="oklch(0.48 0.08 45)" />
        <path d="M30 44 Q50 22 70 44 Q70 32 50 28 Q30 32 30 44 Z" fill="oklch(0.20 0.02 50)" />
        <circle cx="44" cy="50" r="1.6" fill="#1a1a1a" />
        <circle cx="56" cy="50" r="1.6" fill="#1a1a1a" />
        <path d="M44 58 Q50 60 56 58" stroke="oklch(0.30 0.05 40)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="108" rx="42" ry="34" fill="oklch(0.65 0.18 40)" />
      </Frame>
    </div>
  );
}

export function DonaRosa({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.94 0.04 50)">
        <circle cx="50" cy="48" r="20" fill="oklch(0.70 0.08 50)" />
        <path d="M28 44 Q34 22 50 22 Q66 22 72 44 Q70 34 50 30 Q30 34 28 44 Z" fill="oklch(0.92 0.01 60)" />
        <rect x="40" y="48" width="20" height="6" rx="3" fill="none" stroke="oklch(0.30 0.02 60)" strokeWidth="1.5" />
        <circle cx="44" cy="51" r="1.4" fill="#1a1a1a" />
        <circle cx="56" cy="51" r="1.4" fill="#1a1a1a" />
        <path d="M44 60 Q50 62 56 60" stroke="oklch(0.40 0.10 30)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="108" rx="42" ry="34" fill="oklch(0.65 0.10 280)" />
      </Frame>
    </div>
  );
}

export function Paulo({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.92 0.07 60)">
        <circle cx="50" cy="48" r="20" fill="oklch(0.54 0.08 45)" />
        <path d="M28 44 L72 44 L72 36 Q50 28 28 36 Z" fill="oklch(0.18 0.02 50)" />
        <rect x="32" y="34" width="36" height="6" rx="2" fill="oklch(0.71 0.20 47)" />
        <circle cx="44" cy="52" r="1.6" fill="#1a1a1a" />
        <circle cx="56" cy="52" r="1.6" fill="#1a1a1a" />
        <path d="M44 60 Q50 63 56 60" stroke="oklch(0.30 0.05 40)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="108" rx="42" ry="34" fill="oklch(0.55 0.14 150)" />
      </Frame>
    </div>
  );
}

export function SeuAntonio({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.90 0.05 80)">
        <circle cx="50" cy="48" r="20" fill="oklch(0.32 0.04 45)" />
        <path d="M30 42 Q50 30 70 42 Q70 30 50 26 Q30 30 30 42 Z" fill="oklch(0.92 0.01 60)" />
        <circle cx="44" cy="50" r="1.6" fill="#fff" />
        <circle cx="56" cy="50" r="1.6" fill="#fff" />
        <path d="M40 58 Q50 60 60 58" stroke="oklch(0.92 0.01 60)" strokeWidth="2" fill="none" />
        <ellipse cx="50" cy="106" rx="40" ry="33" fill="oklch(0.45 0.08 60)" />
      </Frame>
    </div>
  );
}

export function Sandra({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.93 0.05 50)">
        <ellipse cx="50" cy="38" rx="22" ry="18" fill="oklch(0.30 0.04 45)" />
        <circle cx="50" cy="48" r="20" fill="oklch(0.58 0.08 45)" />
        <circle cx="44" cy="50" r="1.6" fill="#1a1a1a" />
        <circle cx="56" cy="50" r="1.6" fill="#1a1a1a" />
        <path d="M44 58 Q50 61 56 58" stroke="oklch(0.40 0.10 30)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="108" rx="42" ry="34" fill="oklch(0.65 0.16 30)" />
      </Frame>
    </div>
  );
}

export function CasalSilva({ className }: AvatarProps) {
  return (
    <div className={className}>
      <Frame bg="oklch(0.92 0.05 60)">
        {/* Right person */}
        <circle cx="62" cy="50" r="16" fill="oklch(0.55 0.08 45)" />
        <path d="M48 48 Q62 32 76 48 Q76 38 62 35 Q50 38 48 48 Z" fill="oklch(0.20 0.02 50)" />
        <circle cx="58" cy="51" r="1.4" fill="#1a1a1a" />
        <circle cx="65" cy="51" r="1.4" fill="#1a1a1a" />
        {/* Left person */}
        <circle cx="38" cy="52" r="16" fill="oklch(0.70 0.07 45)" />
        <path d="M22 50 Q28 30 38 30 Q48 30 54 50 Q52 40 38 38 Q26 40 22 50 Z" fill="oklch(0.92 0.01 60)" />
        <circle cx="34" cy="53" r="1.4" fill="#1a1a1a" />
        <circle cx="41" cy="53" r="1.4" fill="#1a1a1a" />
        <ellipse cx="50" cy="110" rx="50" ry="36" fill="oklch(0.71 0.20 47)" />
      </Frame>
    </div>
  );
}

export const ALL_AVATARS = [
  { C: DonaMaria, name: "Dona Maria, 68" },
  { C: SeuJoao, name: "Seu João, 72" },
  { C: Carlos, name: "Carlos, 45" },
  { C: DonaRosa, name: "Dona Rosa, 65" },
  { C: Paulo, name: "Paulo, 38" },
  { C: SeuAntonio, name: "Seu Antônio, 71" },
  { C: Sandra, name: "Sandra, 52" },
  { C: CasalSilva, name: "Casal Silva" },
];
