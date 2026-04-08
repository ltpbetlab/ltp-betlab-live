# LTP Betlab Pro Final

Modern, kékes dizájnú sportfogadási elemző szoftver Next.js alapon.

## Fő funkciók

- erős landing oldal SEO-barát szövegezéssel
- Free / VIP / VIP+ tippek blur logikával
- heti meccslista sport és oddsmozgás szűréssel
- grafikonos statisztika blokk
- több meccses bankroll és tétajánló kalkulátor
- popup belépés, regisztráció és árazás
- admin felület mockup tippjóváhagyással
- Telegram API route előkészítés
- Stripe checkout route előkészítés
- elemzési route előkészítés OpenAI kulcshoz
- Supabase schema és env példa

## Indítás

```bash
npm install
npm run dev
```

Böngésző:

```bash
http://localhost:3000
```

## Demo belépés

- `admin@ltpbetlab.hu` -> admin felület megjelenik
- bármely email amiben szerepel a `vip` -> VIP hozzáférés
- bármely email amiben szerepel a `vipplus` -> VIP+ hozzáférés

## API kulcsok bekötése

Másold át a `.env.example` fájlt `.env.local` névre.

Töltsd ki a következőket:

- Supabase URL + kulcsok
- OpenAI API key
- Telegram bot token + chat ID-k
- Stripe secret key + price ID-k

## Élesítés

1. GitHub repo létrehozása
2. Projekt feltöltése GitHubra
3. Vercel import
4. Environment Variables felvitele
5. Domain csatlakoztatása Vercelben

## Fontos

A projektben a backend route-ok elő vannak készítve, de a végleges üzemi logikához még rá kell kötni:

- valódi Supabase auth flow
- Stripe webhook kezelés
- odds provider tényleges adatolvasás
- admin mentések adatbázisba
