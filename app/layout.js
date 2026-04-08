import './globals.css';

export const metadata = {
  title: 'LTP Betlab – Sportfogadási elemző szoftver, value tippek és bankroll kezelés',
  description:
    'LTP Betlab sportfogadási elemző szoftver: meccselemzés, value keresés, jelzés alapú tippadás, statisztikák, VIP csomagok és bankroll kalkulátor egy modern felületen.',
  keywords: [
    'sportfogadás',
    'tippek',
    'value tippek',
    'bankroll kalkulátor',
    'sportfogadási elemzés',
    'VIP tippek',
    'odds kalkulátor'
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
