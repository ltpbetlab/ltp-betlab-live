'use client';

import { useMemo, useState } from 'react';
import {
  BarChart3,
  Bot,
  CircleDollarSign,
  Crown,
  Lock,
  LogIn,
  Menu,
  Send,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const formatNumber = (value) => new Intl.NumberFormat('hu-HU').format(Math.round(Number(value) || 0));
const formatCurrency = (value) => `${formatNumber(value)} Ft`;
const cls = (...items) => items.filter(Boolean).join(' ');
const getTierRank = (tier) => ({ free: 0, vip: 1, vipplus: 2 }[tier] ?? 0);
const unitWeight = (unit) => ({ 1: 0.1, 2: 0.15, 3: 0.2, 4: 0.3 }[unit] ?? 0.1);

const pricing = {
  vip: [
    { title: 'VIP havi', price: 9990, note: '30 nap', badge: 'Legtöbbet választott', hot: true, desc: 'Napi 1 free tipp + 3 VIP tipp részletes elemzéssel.' },
    { title: 'VIP 3 havi', price: 24990, note: '90 nap', desc: 'Jobb ár, stabil bankroll-kontroll és teljes VIP hozzáférés.' },
    { title: 'VIP féléves', price: 44990, note: '180 nap', desc: 'Kényelmes, hosszabb hozzáférés a teljes VIP tippsorhoz.' },
  ],
  vipplus: [
    { title: 'VIP+ havi', price: 14990, note: '30 nap', desc: '1 free + 3 VIP + 3 VIP+ + 1 nagytétes tipp naponta.' },
    { title: 'VIP+ 3 havi', price: 39990, note: '90 nap', badge: 'Tüzes ajánlat', glow: true, desc: 'VIP+ kombináló, live jelzések és teljes prémium hozzáférés.' },
    { title: 'VIP+ féléves', price: 69990, note: '180 nap', badge: 'Legjobban megéri', best: true, desc: 'A legerősebb csomag teljes elemzési és prémium tartalommal.' },
  ]
};

const tips = [
  { id: 1, sport: 'Foci', league: 'Premier League', match: 'Arsenal vs Newcastle', tip: 'Arsenal győzelem', odds: 1.82, previousOdds: 1.89, signal: 78, unit: 3, tier: 'free', strength: 'Erős', live: false, note: 'Hazai fölény, stabil forma és támadó oldali előny.' },
  { id: 2, sport: 'Foci', league: 'Serie A', match: 'Milan vs Torino', tip: '2.5 gól alatt', odds: 1.74, previousOdds: 1.68, signal: 71, unit: 2, tier: 'vip', strength: 'Jó', live: false, note: 'Zártabb tempó és alacsonyabb helyzetminőség.' },
  { id: 3, sport: 'Tenisz', league: 'ATP', match: 'Sinner vs Ruud', tip: 'Sinner győzelem', odds: 1.63, previousOdds: 1.59, signal: 74, unit: 2, tier: 'vip', strength: 'Jó', live: false, note: 'Jobb szerva mögötti pontok és formaelőny.' },
  { id: 4, sport: 'Foci', league: 'Champions League', match: 'Real Madrid vs Bayern', tip: 'Mindkét csapat szerez gólt', odds: 1.88, previousOdds: 1.96, signal: 73, unit: 3, tier: 'vip', strength: 'Jó', live: false, note: 'Nyílt meccskép, támadó minőség mindkét oldalon.' },
  { id: 5, sport: 'Foci', league: 'Bundesliga', match: 'Leipzig vs Freiburg', tip: 'Leipzig -1 hendikep', odds: 2.03, previousOdds: 1.94, signal: 82, unit: 4, tier: 'vipplus', strength: 'Erős', live: false, note: 'Erős xG fölény és jó hazai matchup.' },
  { id: 6, sport: 'Kosár', league: 'NBA', match: 'Boston vs Miami', tip: 'Boston -5.5', odds: 1.89, previousOdds: 1.97, signal: 76, unit: 3, tier: 'vipplus', strength: 'Erős', live: true, note: 'Mélyebb rotáció és jobb matchup a festékben.' },
  { id: 7, sport: 'Tenisz', league: 'WTA', match: 'Swiatek vs Gauff', tip: 'Swiatek 2-0', odds: 1.95, previousOdds: 1.87, signal: 77, unit: 3, tier: 'vipplus', strength: 'Erős', live: false, note: 'Erősebb return game és nyomás a hosszú labdamenetekben.' },
  { id: 8, sport: 'Foci', league: 'La Liga', match: 'Betis vs Villarreal', tip: 'Mindkét csapat szerez gólt', odds: 1.91, previousOdds: 1.99, signal: 84, unit: 4, tier: 'vipplus', strength: 'Nagytétes', live: true, note: 'Két nyitott támadófelfogású csapat, jó gólkép.' },
];

const weeklyFixtures = [
  { sport: 'Foci', league: 'UEFA Champions League', country: 'Európa', time: '21:00', home: 'Real Madrid', away: 'Bayern München', movement: '+0.09' },
  { sport: 'Foci', league: 'Championship', country: 'England', time: '21:00', home: 'Wrexham', away: 'Southampton', movement: '-0.06' },
  { sport: 'Foci', league: 'Ekstraklasa', country: 'Poland', time: '19:00', home: 'Arka Gdynia', away: 'Zaglebie', movement: '+0.11' },
  { sport: 'Kosár', league: 'NBA', country: 'USA', time: '02:30', home: 'Lakers', away: 'Suns', movement: '+0.14' },
  { sport: 'Tenisz', league: 'ATP Miami', country: 'USA', time: '18:30', home: 'Rune', away: 'Medvedev', movement: '-0.03' },
];

const statsData = [
  { name: 'Hétfő', profit: 1.1, hitrate: 58 },
  { name: 'Kedd', profit: 2.4, hitrate: 62 },
  { name: 'Szerda', profit: 1.8, hitrate: 64 },
  { name: 'Csüt.', profit: 3.1, hitrate: 66 },
  { name: 'Péntek', profit: 4.2, hitrate: 69 },
  { name: 'Szombat', profit: 5.7, hitrate: 72 },
  { name: 'Vasárnap', profit: 4.8, hitrate: 68 },
];

const registrationData = [
  { day: 'H', registered: 12, free: 8, vip: 3, vipplus: 1 },
  { day: 'K', registered: 18, free: 11, vip: 5, vipplus: 2 },
  { day: 'Sze', registered: 22, free: 13, vip: 6, vipplus: 3 },
  { day: 'Cs', registered: 17, free: 9, vip: 5, vipplus: 3 },
  { day: 'P', registered: 27, free: 15, vip: 8, vipplus: 4 },
  { day: 'Szo', registered: 33, free: 20, vip: 9, vipplus: 4 },
  { day: 'V', registered: 21, free: 12, vip: 6, vipplus: 3 },
];

const howBlocks = [
  { title: 'Adatok beolvasása', text: 'Szoftverünk meccsadatokat, formát, oddsmozgást és piaci eltéréseket olvas össze.' },
  { title: 'Value szűrés', text: 'Kiemeli azokat a helyzeteket, ahol az ár és a valós esély között különbség lehet.' },
  { title: 'Jelzés és tét', text: 'Százalékos jelzést, unitot és bankroll-alapú tétajánlót kapsz ugyanabban a nézetben.' },
];

const initialUsers = [
  { id: 1, name: 'Kiss Bence', email: 'bence@gmail.com', tier: 'free', joined: '2026-04-01' },
  { id: 2, name: 'Nagy Martin', email: 'martin@vipmail.hu', tier: 'vip', joined: '2026-04-02' },
  { id: 3, name: 'Tóth Dániel', email: 'dani@vipplus.hu', tier: 'vipplus', joined: '2026-04-03' },
  { id: 4, name: 'LTP Admin', email: 'admin@ltpbetlab.hu', tier: 'admin', joined: '2026-04-03' },
  { id: 5, name: 'Szabó Ádám', email: 'adam@gmail.com', tier: 'free', joined: '2026-04-04' },
];

const broadcastPresets = {
  free: { daily: [1], weekly: [1], weekend: [1] },
  vip: { daily: [2, 3, 4], weekly: [2, 4, 3], weekend: [2, 3, 4] },
  vipplus: { daily: [5, 6, 7, 8], weekly: [5, 6, 7], weekend: [6, 7, 8] },
};

function analyzeSingleMatch(signal, unit, odds) {
  const score = signal * 0.65 + unit * 8 + Math.min(odds * 6, 16);
  if (signal < 60 || odds > 3.5) return 'Inkább hagyd ki';
  if (score >= 78) return 'Megéri';
  if (score >= 68) return 'Közepes';
  return 'Óvatosan';
}

function tierLabel(group) {
  return group === 'vipplus' ? 'VIP+' : group === 'vip' ? 'VIP' : 'FREE';
}

function bannerForGroup(group) {
  return group === 'vipplus' ? '/vipplus-banner.png' : group === 'vip' ? '/vip-banner.png' : '/free-banner.png';
}

function normalizeBroadcastItem(item, fallbackTier = 'free') {
  if (!item) return null;
  if ('match' in item && 'tip' in item) return item;
  return {
    id: `fixture-${item.home}-${item.away}-${item.time}`,
    sport: item.sport || 'Foci',
    league: item.league || 'Heti meccs',
    match: `${item.home} vs ${item.away}`,
    tip: 'Heti shortlist meccs',
    odds: item.odds || 1.85,
    previousOdds: item.previousOdds || 1.85,
    signal: item.signal || 72,
    unit: item.unit || 2,
    tier: fallbackTier,
    strength: 'Figyelőlistás',
    live: false,
    note: item.note || `Kiemelt heti meccs a(z) ${item.league || 'heti kínálat'} listából.`,
  };
}

function buildTelegramMessage(selectedTips, group) {
  const today = 'MA';
  const tipsArr = Array.isArray(selectedTips) ? selectedTips : [selectedTips].filter(Boolean);
  const intro = group === 'free' ? 'FREE szelvény' : group === 'vip' ? 'VIP napi jelzés' : 'VIP+ prémium csomag';
  const lines = [
    `💰 ${tierLabel(group)} TIPPEK – ${today} 💰`,
    '🔥 LTP BETLAB',
    '',
    'Sziasztok!',
    '',
    `👉 Mai ${intro} a kiválasztott meccsekkel`,
    '💡 LTP = hosszú távú profit',
    '',
  ];
  tipsArr.forEach((tip, index) => {
    lines.push('———', '', `⚽ ${tip.match}`, `🕒 ${tip.league}`, `👉 Tipp: ${tip.tip}`, `💸 Odds: ~${tip.odds.toFixed(2)}`, `📊 Jelzés: ${tip.signal}%`, `💰 ${tip.unit} UNIT`, `📝 Röviden: ${tip.note}`, '');
  });
  lines.push('📊 ELEMZÉS', '👉 Az odds és a meccskép jelenleg egy irányba mutat', '👉 A kiválasztott jelzések ugyanazok, mint a napi meccsajánlóban', '', `🍀 ${tierLabel(group)} – okosan játssz!`);
  return lines.join('\n');
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        {children}
      </div>
    </div>
  );
}

function PackageCard({ item, tone }) {
  return (
    <div className={cls('package-card', item.best && 'package-best', item.hot && 'package-hot', item.glow && 'package-glow')}>
      <div className="package-header-row">
        <h4>{item.title}</h4>
        {item.badge ? <span className={cls('badge', tone === 'vipplus' ? 'badge-bright' : 'badge-soft')}>{item.badge}</span> : null}
      </div>
      <div className="price">{formatCurrency(item.price)}</div>
      <div className="subtle">{item.note}</div>
      <p>{item.desc}</p>
      <button className={cls('ghost-button', tone === 'vipplus' && 'accent-button')}>{tone === 'vipplus' ? 'VIP+ kiválasztása' : 'VIP kiválasztása'}</button>
    </div>
  );
}

function AccessCard({ title, value, tone }) {
  return (
    <div className={cls('access-card', tone)}>
      <div className="subtle small">{title}</div>
      <div className="access-value">{value}</div>
    </div>
  );
}

function MotionPanel() {
  return (
    <div className="motion-shell">
      <div className="motion-topbar">
        <div className="traffic"><span /><span /><span /></div>
        <div className="motion-title">engine.flow.ts — LTP Betlab software</div>
        <div className="motion-status">RUNNING</div>
      </div>
      <div className="motion-grid">
        <div className="motion-col">
          <span className="motion-label">INPUT</span>
          <div className="motion-dot-row"><span className="motion-dot" /> Meccsadatok</div>
          <div className="motion-dot-row"><span className="motion-dot" /> Odds változás</div>
          <div className="motion-dot-row"><span className="motion-dot" /> Forma és jelzések</div>
        </div>
        <div className="motion-lines">
          <div className="wire one" />
          <div className="wire two" />
          <div className="wire three" />
          <div className="wire four" />
          <div className="wire five" />
        </div>
        <div className="motion-col center-col">
          <span className="motion-label">SZŰRÉS</span>
          <div className="stack-item">Value keresés</div>
          <div className="stack-item">Piaci eltérés</div>
          <div className="stack-item">Jelzés modell</div>
        </div>
        <div className="motion-lines reverse">
          <div className="wire one" />
          <div className="wire two" />
          <div className="wire three" />
          <div className="wire four" />
          <div className="wire five" />
        </div>
        <div className="motion-col">
          <span className="motion-label">OUTPUT</span>
          <div className="result-chip">Napi tipp</div>
          <div className="result-chip">Jelzés %</div>
          <div className="result-chip">Tétajánló</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [mobileNav, setMobileNav] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [tier, setTier] = useState('free');
  const [adminEnabled, setAdminEnabled] = useState(false);
  const [sportFilter, setSportFilter] = useState('Összes');
  const [movementFilter, setMovementFilter] = useState('all');
  const [leagueFilter, setLeagueFilter] = useState('Összes');
  const [telegramGroup, setTelegramGroup] = useState('free');
  const [approvedTips, setApprovedTips] = useState([]);
  const [selectedTelegramTipIds, setSelectedTelegramTipIds] = useState([1]);
  const [selectedFixtureIds, setSelectedFixtureIds] = useState([]);
  const [users, setUsers] = useState(initialUsers);
  const [bankroll, setBankroll] = useState('100000');
  const [manualStake, setManualStake] = useState('');
  const [rows, setRows] = useState([{ odds: '1.82', signal: '78', unit: '3' }]);
  const [sendState, setSendState] = useState('');

  const availableLeagues = ['Összes', ...new Set(weeklyFixtures.filter((f) => sportFilter === 'Összes' || f.sport === sportFilter).map((f) => f.league))];
  const filteredFixtures = weeklyFixtures.filter((f) => {
    if (sportFilter !== 'Összes' && f.sport !== sportFilter) return false;
    if (leagueFilter !== 'Összes' && f.league !== leagueFilter) return false;
    const movement = Number(f.movement);
    if (movementFilter === 'up') return movement > 0;
    if (movementFilter === 'down') return movement < 0;
    return true;
  });

  const liveTips = tips.filter((m) => m.live && m.tier === 'vipplus');
  const heroTip = tips.find((m) => m.tier === 'free');
  const vipTipCount = tips.filter((t) => t.tier === 'vip').length;
  const vipPlusCount = tips.filter((t) => t.tier === 'vipplus').length;

  const calc = useMemo(() => {
    const parsed = rows.map((r) => ({ odds: Number(r.odds), signal: Number(r.signal), unit: Number(r.unit) }))
      .filter((r) => r.odds > 0 && r.signal > 0 && r.unit > 0);
    if (!parsed.length) return { combinedOdds: 0, avgSignal: 0, avgUnit: 0, suggestedStake: 0, finalStake: 0, profit: 0, advice: 'Adj meg legalább egy meccset a számoláshoz.', rowsAdvice: [] };
    const combinedOdds = parsed.reduce((acc, row) => acc * row.odds, 1);
    const avgSignal = parsed.reduce((acc, row) => acc + row.signal, 0) / parsed.length;
    const avgUnit = parsed.reduce((acc, row) => acc + row.unit, 0) / parsed.length;
    const bankrollNum = Number(bankroll) || 0;
    const unitRounded = Math.min(4, Math.max(1, Math.round(avgUnit)));
    const suggestedStake = bankrollNum * unitWeight(unitRounded) * Math.max(0.75, Math.min(1.2, avgSignal / 75)) * (combinedOdds > 6 ? 0.62 : combinedOdds > 4 ? 0.72 : combinedOdds > 2.4 ? 0.84 : 1);
    const finalStake = manualStake !== '' ? Number(manualStake) || 0 : suggestedStake;
    const profit = finalStake * Math.max(combinedOdds - 1, 0);
    const advice = avgSignal >= 77 && combinedOdds <= 4.5 ? 'Erős összkép, vállalható tét fegyelmezett bankroll mellett.' : avgSignal >= 68 ? 'Játszható, de maradj kontrollált tétnél és ne told túl a kombit.' : 'Itt inkább kisebb összeggel menj, vagy bontsd szét single tippekre.';
    return {
      combinedOdds, avgSignal, avgUnit, suggestedStake, finalStake, profit, advice,
      rowsAdvice: parsed.map((row, idx) => ({ idx, text: `Meccs ${idx + 1}: ${row.odds.toFixed(2)} odds • ${row.signal}% • ${row.unit} unit`, tag: analyzeSingleMatch(row.signal, row.unit, row.odds) }))
    };
  }, [rows, bankroll, manualStake]);

  const telegramOptions = useMemo(() => {
    const source = approvedTips.length ? approvedTips : tips;
    return source.filter((tip) => tip.tier === telegramGroup);
  }, [approvedTips, telegramGroup]);

  const adminFixtureOptions = useMemo(() => weeklyFixtures.map((fixture, idx) => ({
    id: `weekly-${idx}`,
    label: `${fixture.home} vs ${fixture.away} · ${fixture.league}` ,
    payload: normalizeBroadcastItem({ ...fixture, signal: 70 + (idx % 4) * 3, unit: 2 + (idx % 2), odds: 1.72 + idx * 0.07, note: `${fixture.country} · ${fixture.time} kezdés, shortlistelt heti meccs.` }, telegramGroup),
  })), [telegramGroup]);

  const selectedTelegramTips = useMemo(() => {
    const fallback = telegramOptions[0] ? [telegramOptions[0].id] : [];
    const ids = selectedTelegramTipIds.length ? selectedTelegramTipIds : fallback;
    const baseTips = telegramOptions.filter((tip) => ids.includes(tip.id)).map((tip) => normalizeBroadcastItem(tip, telegramGroup));
    const fixtureTips = adminFixtureOptions.filter((fixture) => selectedFixtureIds.includes(fixture.id)).map((fixture) => fixture.payload);
    return [...baseTips, ...fixtureTips].filter(Boolean);
  }, [telegramOptions, selectedTelegramTipIds, adminFixtureOptions, selectedFixtureIds, telegramGroup]);

  const telegramMessage = useMemo(() => buildTelegramMessage(selectedTelegramTips, telegramGroup), [selectedTelegramTips, telegramGroup]);

  const handleLogin = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '').toLowerCase();
    if (email.includes('admin')) setAdminEnabled(true);
    if (email.includes('vipplus')) setTier('vipplus');
    else if (email.includes('vip')) setTier('vip');
    else setTier('free');
    setAuthModal(null);
  };

  const approveTip = (tip) => {
    setApprovedTips((prev) => prev.some((item) => item.id === tip.id) ? prev : [...prev, tip]);
    if (tip.tier === 'vipplus') setTelegramGroup('vipplus');
    else if (tip.tier === 'vip') setTelegramGroup('vip');
    else setTelegramGroup('free');
    setSelectedTelegramTipIds([tip.id]);
    setSelectedFixtureIds([]);
  };

  const updateUserTier = (id, nextTier) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, tier: nextTier } : u));

  const applyTelegramPreset = (presetKey) => {
    const selected = broadcastPresets[telegramGroup]?.[presetKey] || [];
    setSelectedTelegramTipIds(selected);
    if (presetKey === 'weekly') setSelectedFixtureIds(['weekly-0', 'weekly-1', 'weekly-2']);
    else if (presetKey === 'weekend') setSelectedFixtureIds(['weekly-2', 'weekly-3', 'weekly-4']);
    else setSelectedFixtureIds([]);
  };

  const sendTelegramPreview = async () => {
    setSendState('Küldés...');
    try {
      const res = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: telegramMessage, group: telegramGroup, imagePath: bannerForGroup(telegramGroup) })
      });
      const json = await res.json();
      setSendState(json.ok ? 'Telegram küldés kész vagy mock módban lefutott.' : 'Hiba történt a küldésnél.');
    } catch (e) {
      setSendState('Hiba történt a küldésnél.');
    }
  };

  const sectionLink = (id, label) => <a href={`#${id}`} onClick={() => setMobileNav(false)}>{label}</a>;

  return (
    <main className="page-bg">
      <header className="topbar glass">
        <div className="brand-row">
          <img src="/ltp-web-logo.png" alt="LTP Betlab logó" className="brand-logo" />
          <div>
            <div className="brand-name">LTP Betlab</div>
            <div className="brand-sub">Sportfogadási elemző szoftver</div>
          </div>
        </div>
        <nav className="desktop-nav">
          {sectionLink('tippek', 'Tippek')}
          {sectionLink('meccsek', 'Meccsek')}
          {sectionLink('statisztika', 'Statisztika')}
          {sectionLink('hogyan-mukodik', 'Hogyan működik')}
          <button onClick={() => setAuthModal('pricing')}>Árazás</button>
          <button onClick={() => setAuthModal('login')}>Belépés</button>
          <button className="gradient-button compact" onClick={() => setAuthModal('register')}>Regisztráció</button>
        </nav>
        <button className="menu-button" onClick={() => setMobileNav((v) => !v)}><Menu /></button>
      </header>

      {mobileNav && <div className="mobile-nav glass">{sectionLink('tippek', 'Tippek')}{sectionLink('meccsek', 'Meccsek')}{sectionLink('statisztika', 'Statisztika')}{sectionLink('hogyan-mukodik', 'Hogyan működik')}<button onClick={() => setAuthModal('pricing')}>Árazás</button><button onClick={() => setAuthModal('login')}>Belépés</button><button onClick={() => setAuthModal('register')}>Regisztráció</button></div>}

      <section className="hero grid-two" id="tippek">
        <div className="glass hero-copy">
          <div className="eyebrow">Sportfogadási elemző szoftver</div>
          <h1>Meccselemzés, value keresés és tétajánlás egy letisztult, gyors rendszerben.</h1>
          <p>Elemző szoftverünk átnézi a meccseket, az oddsokat és a jelzéseket, majd kiemeli azokat a tippeket, ahol valódi érték lehet. Látod a százalékos jelzést, a unit súlyozást, a javasolt tétet és azt is, mikor jobb kimaradni.</p>
          <div className="hero-actions">
            <a href="#napi-tippek" className="gradient-button">Mai tippek megnyitása</a>
            <button className="ghost-button" onClick={() => setAuthModal('pricing')}>Csomagok megtekintése</button>
          </div>
          <div className="access-grid">
            <AccessCard title="Free hozzáférés" value="1 free tipp / nap" tone="free" />
            <AccessCard title="VIP hozzáférés" value={`1 free + ${vipTipCount} VIP`} tone="vip" />
            <AccessCard title="VIP+ hozzáférés" value={`1 free + ${vipTipCount} VIP + ${vipPlusCount} VIP+ + 1 nagytétes`} tone="vipplus" />
          </div>
        </div>

        <div className="glass feature-card">
          <div className="chip-row"><span className="chip">Legjobb napi free tipp</span><span className="chip chip-bright">Jelzett value</span></div>
          <div className="tip-main">
            <h2>{heroTip.match}</h2>
            <div className="tip-market">{heroTip.tip}</div>
            <p>Elemző szoftverünk itt erős hazai fölényt lát. A helyzetminőség, a forma és a piaci ár együtt jelenleg a hazai oldalt támogatja.</p>
          </div>
          <div className="stat-mini-grid">
            <div className="mini-card"><span>Odds</span><strong>{heroTip.odds.toFixed(2)}</strong></div>
            <div className="mini-card"><span>Jelzés</span><strong>{heroTip.signal}%</strong></div>
            <div className="mini-card"><span>Unit</span><strong>{heroTip.unit}/4</strong></div>
            <div className="mini-card"><span>Tipp erősség</span><strong>{heroTip.strength}</strong></div>
          </div>
        </div>
      </section>

      <section className="section" id="napi-tippek">
        <div className="section-head">
          <div><div className="eyebrow">Napi tippek</div><h3>Free, VIP és VIP+ jelzések egy helyen</h3></div>
          <div className="tier-switch glass small-panel"><button className={cls(tier === 'free' && 'active')} onClick={() => setTier('free')}>Free</button><button className={cls(tier === 'vip' && 'active')} onClick={() => setTier('vip')}>VIP</button><button className={cls(tier === 'vipplus' && 'active')} onClick={() => setTier('vipplus')}>VIP+</button></div>
        </div>
        <div className="tips-grid">
          {tips.map((tip) => {
            const locked = getTierRank(tip.tier) > getTierRank(tier);
            return (
              <div key={tip.id} className={cls('glass tip-card-wrap', tip.tier)}>
                <div className={cls('tip-card', locked && 'locked')}>
                  <div className="tip-top">
                    <div><div className="subtle small">{tip.league} · {tip.sport}</div><h4>{tip.match}</h4></div>
                    <span className={cls('tier-badge', tip.tier)}>{tip.tier.toUpperCase()}</span>
                  </div>
                  <div className="tip-pick">{tip.tip}</div>
                  <div className="tip-stats">
                    <span>Odds: <strong>{tip.odds.toFixed(2)}</strong> <em className={cls('odds-trend', tip.odds > tip.previousOdds ? 'up' : 'down')}>{tip.odds > tip.previousOdds ? '↑' : '↓'}</em></span>
                    <span>Jelzés: <strong>{tip.signal}%</strong></span>
                    <span>Unit: <strong>{tip.unit}/4</strong></span>
                  </div>
                </div>
                {locked && <div className="blur-overlay"><Lock size={18} /> Csak {tip.tier === 'vip' ? 'VIP' : 'VIP+'} hozzáféréssel</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section grid-two" id="meccsek">
        <div className="glass">
          <div className="section-head compact">
            <div><div className="eyebrow">Heti meccsek</div><h3>Szűrj sportra és oddsmozgásra</h3></div>
            <div className="filters-row">
              <select value={sportFilter} onChange={(e) => { setSportFilter(e.target.value); setLeagueFilter('Összes'); }}><option>Összes</option><option>Foci</option><option>Tenisz</option><option>Kosár</option></select>
              <select value={leagueFilter} onChange={(e) => setLeagueFilter(e.target.value)}>{availableLeagues.map((league) => <option key={league} value={league}>{league}</option>)}</select>
              <select value={movementFilter} onChange={(e) => setMovementFilter(e.target.value)}><option value="all">Minden oddsmozgás</option><option value="up">Emelkedő odds</option><option value="down">Csökkenő odds</option></select>
            </div>
          </div>
          <div className="fixture-list">
            {filteredFixtures.map((match, idx) => <div key={idx} className="fixture-card"><div className="fixture-header"><div><div className="fixture-league">{match.league}</div><div className="subtle small">{match.country}</div></div><span className={cls('movement-chip', Number(match.movement) >= 0 ? 'up' : 'down')}>{Number(match.movement) >= 0 ? '↑' : '↓'} {match.movement}</span></div><div className="fixture-row"><span className="fixture-time">{match.time}</span><div className="fixture-teams"><strong>{match.home}</strong><strong>{match.away}</strong></div></div></div>)}
          </div>
        </div>
        <div className="glass live-shell">
          <div className="section-head compact"><div><div className="eyebrow">Live tippek</div><h3>Gyors jelzések futó meccsekre</h3></div></div>
          <div className={cls('live-list live-content', tier !== 'vipplus' && 'locked-zone')}>{liveTips.map((item) => <div key={item.id} className="live-card"><div><div className="subtle small">{item.league}</div><strong>{item.match}</strong><div className="tip-pick small-pick">{item.tip}</div></div><div className="live-right"><span>{item.signal}%</span><span>{item.unit}/4</span></div></div>)}</div>
          {tier !== 'vipplus' && <div className="blur-overlay strong-lock"><Lock size={18} /> Gyors jelzések csak VIP+ hozzáféréssel</div>}
        </div>
      </section>

      <section className="section" id="statisztika">
        <div className="section-head"><div><div className="eyebrow">Statisztikák</div><h3>Nézd vissza a profit görbét és a találati arányt</h3></div></div>
        <div className="stats-grid">
          <div className="glass chart-card"><div className="chart-head"><BarChart3 size={18} /> Profit görbe</div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={statsData}><defs><linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#57c8ff" stopOpacity={0.5} /><stop offset="100%" stopColor="#57c8ff" stopOpacity={0.05} /></linearGradient></defs><CartesianGrid stroke="#14345f" vertical={false} /><XAxis dataKey="name" stroke="#7ba7d8" /><YAxis stroke="#7ba7d8" /><Tooltip contentStyle={{ background: '#07162c', border: '1px solid #1d4170', borderRadius: '14px' }} /><Area type="monotone" dataKey="profit" stroke="#57c8ff" fill="url(#profitGrad)" strokeWidth={3} /></AreaChart></ResponsiveContainer></div></div>
          <div className="glass chart-card"><div className="chart-head"><TrendingUp size={18} /> Találati arány</div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={statsData}><CartesianGrid stroke="#14345f" vertical={false} /><XAxis dataKey="name" stroke="#7ba7d8" /><YAxis stroke="#7ba7d8" /><Tooltip contentStyle={{ background: '#07162c', border: '1px solid #1d4170', borderRadius: '14px' }} /><Bar dataKey="hitrate" fill="#6f87ff" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        </div>
      </section>

      <section className="section" id="kalkulator">
        <div className="section-head"><div><div className="eyebrow">Odds kalkulátor</div><h3>Több meccses tétajánló átlagolt unit és összesített odds alapján</h3><p className="subtle odds-help">Használat: add meg az oddsot, a rendszer által adott százalékos jelzést, az unitot és a bankrollt. A bankroll az a maximum összeg, amit összesen a fogadásokra szánsz. Ezekből számol a rendszer összesített oddsot, javasolt tétet és várható profitot.</p></div></div>
        <div className="glass calculator-grid partial-shell">
          <div className="calc-left">
            <label>Bankroll</label>
            <input value={bankroll} onChange={(e) => setBankroll(e.target.value.replace(/[^\d]/g, ''))} placeholder="100000" />
            <div className="calc-rows">
              {rows.map((row, idx) => <div key={idx} className="calc-row"><input value={row.odds} onChange={(e) => setRows((prev) => prev.map((item, i) => i === idx ? { ...item, odds: e.target.value } : item))} placeholder="Odds" /><input value={row.signal} onChange={(e) => setRows((prev) => prev.map((item, i) => i === idx ? { ...item, signal: e.target.value.replace(/[^\d]/g, '') } : item))} placeholder="Jelzés %" /><select value={row.unit} onChange={(e) => setRows((prev) => prev.map((item, i) => i === idx ? { ...item, unit: e.target.value } : item))}><option value="1">1 unit</option><option value="2">2 unit</option><option value="3">3 unit</option><option value="4">4 unit</option></select></div>)}
            </div>
            <button className="ghost-button left-fit" onClick={() => setRows((prev) => [...prev, { odds: '', signal: '', unit: '1' }])}>+ Odds hozzáadása</button>
            <label>Kézi össztét felülírás</label>
            <input value={manualStake} onChange={(e) => setManualStake(e.target.value.replace(/[^\d]/g, ''))} placeholder={`Ajánlott: ${formatNumber(calc.suggestedStake)}`} />
          </div>
          <div className={cls('calc-right', tier !== 'vipplus' && 'locked-zone')}>
            <div className="result-card"><span>Összesített odds</span><strong>{calc.combinedOdds ? calc.combinedOdds.toFixed(2) : '0.00'}</strong></div>
            <div className="result-card"><span>Átlagos jelzés</span><strong>{Math.round(calc.avgSignal)}%</strong></div>
            <div className="result-card"><span>Átlagolt unit</span><strong>{calc.avgUnit ? `${calc.avgUnit.toFixed(1)}/4` : '0.0/4'}</strong></div>
            <div className="result-card"><span>Ajánlott össztét</span><strong>{formatCurrency(calc.suggestedStake)}</strong></div>
            <div className="result-card"><span>Végső össztét</span><strong>{formatCurrency(calc.finalStake)}</strong></div>
            <div className="result-card"><span>Várható profit</span><strong>{formatCurrency(calc.profit)}</strong></div>
            <div className="advice-card">{calc.advice}</div>
            {calc.rowsAdvice.map((row) => <div className="row-advice" key={row.idx}><span>{row.text}</span><strong>{row.tag}</strong></div>)}
          </div>
          {tier !== 'vipplus' && <div className="blur-overlay strong-lock partial-right-lock"><Lock size={18} /> Ez a rész csak VIP+ hozzáféréssel érhető el</div>}
        </div>
      </section>

      <section className="section" id="kombi-builder">
        <div className="section-head"><div><div className="eyebrow">Kombi builder</div><h3>VIP és VIP+ szelvény összerakó a napi legerősebb jelzésekből</h3></div></div>
        <div className="glass combo-shell">
          <div className={cls('combo-grid', tier === 'free' && 'locked-zone')}>
            {[2,3,5,8].map((id) => {
              const tip = tips.find((item) => item.id === id);
              return <div key={tip.id} className={cls('combo-card', tip.tier)}><div className="subtle small">{tip.league}</div><strong>{tip.match}</strong><div>{tip.tip}</div><div className="tip-stats"><span>Odds: <strong>{tip.odds.toFixed(2)}</strong></span><span>Jelzés: <strong>{tip.signal}%</strong></span></div></div>;
            })}
          </div>
          <div className={cls('combo-side', tier === 'free' && 'locked-zone')}>
            <div className="result-card"><span>Ajánlott kombi odds</span><strong>{tips.filter((tip) => [2,3,5,8].includes(tip.id)).reduce((acc, tip) => acc * tip.odds, 1).toFixed(2)}</strong></div>
            <div className="result-card"><span>Átlagos jelzés</span><strong>{Math.round(tips.filter((tip) => [2,3,5,8].includes(tip.id)).reduce((acc, tip) => acc + tip.signal, 0) / 4)}%</strong></div>
            <div className="advice-card">A kombi builder a napi VIP és VIP+ meccsekből állít össze egy játszható szelvényt. Free nézetben csak az előnézet látszik.</div>
          </div>
          {tier === 'free' && <div className="blur-overlay strong-lock combo-center-lock"><Lock size={18} /> A teljes kombi builder csak VIP és VIP+ hozzáféréssel látszik</div>}
        </div>
      </section>

      <section className="section" id="hogyan-mukodik">
        <div className="section-head centered"><div><div className="eyebrow">Hogyan működik a szoftverünk?</div><h3>Nem csak tippeket látsz. Egy szűrt, értelmezett döntési folyamatot kapsz.</h3></div></div>
        <MotionPanel />
        <div className="how-grid">{howBlocks.map((block) => <div key={block.title} className="glass how-card"><div className="how-icon"><Zap size={18} /></div><h4>{block.title}</h4><p>{block.text}</p></div>)}</div>
      </section>

      {adminEnabled && (
        <section className="section" id="admin">
          <div className="section-head"><div><div className="eyebrow">Admin felület</div><h3>Tipp jóváhagyás, Telegram küldés és felhasználó kezelés</h3></div></div>
          <div className="admin-grid admin-grid-full">
            <div className="glass admin-block">
              <div className="admin-summary">
                <div className="summary-box"><Users size={18} /><span>Felhasználók kezelése</span></div>
                <div className="summary-box"><Bot size={18} /><span>Telegram jelzések</span></div>
                <div className="summary-box"><CircleDollarSign size={18} /><span>Előfizetések és csomagok</span></div>
              </div>
              <div className="section-head compact"><div><div className="eyebrow">Jóváhagyható tippek</div><h3>Napi jelzések kiküldés előtt</h3></div></div>
              <div className="admin-list">{tips.map((tip) => <div className="admin-tip" key={tip.id}><div><div className="subtle small">{tip.league}</div><strong>{tip.match}</strong><div>{tip.tip} · {tip.odds.toFixed(2)} · {tip.signal}% · {tip.unit}/4</div></div><button className="gradient-button compact" onClick={() => approveTip(tip)}>Jóváhagyás</button></div>)}</div>
            </div>

            <div className="glass admin-block">
              <div className="section-head compact"><div><div className="eyebrow">Felhasználó kezelés</div><h3>Adj Free, VIP vagy VIP+ jogosultságot</h3></div></div>
              <div className="user-list">{users.map((user) => <div key={user.id} className="user-item"><div><strong>{user.name}</strong><div className="subtle small">{user.email} · {user.joined}</div></div><div className="user-actions"><span className={cls('tier-badge', user.tier === 'admin' ? 'vipplus' : user.tier)}>{user.tier.toUpperCase()}</span>{user.tier !== 'admin' && <><button className="tier-action free" onClick={() => updateUserTier(user.id, 'free')}>Free</button><button className="tier-action vip" onClick={() => updateUserTier(user.id, 'vip')}>VIP</button><button className="tier-action vipplus" onClick={() => updateUserTier(user.id, 'vipplus')}>VIP+</button></>}</div></div>)}</div>
            </div>

            <div className="glass admin-block">
              <div className="section-head compact"><div><div className="eyebrow">Regisztrációk és előfizetők</div><h3>Lásd, melyik napon mennyi free, VIP és VIP+ érkezett</h3></div></div>
              <div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><LineChart data={registrationData}><CartesianGrid stroke="#14345f" vertical={false} /><XAxis dataKey="day" stroke="#7ba7d8" /><YAxis stroke="#7ba7d8" /><Tooltip contentStyle={{ background: '#07162c', border: '1px solid #1d4170', borderRadius: '14px' }} /><Legend /><Line type="monotone" dataKey="registered" stroke="#57c8ff" strokeWidth={3} dot={{ r: 3 }} /><Line type="monotone" dataKey="free" stroke="#76b6ff" strokeWidth={2} /><Line type="monotone" dataKey="vip" stroke="#3bdb78" strokeWidth={2} /><Line type="monotone" dataKey="vipplus" stroke="#9b6dff" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
            </div>

            <div className="glass admin-block">
              <div className="section-head compact"><div><div className="eyebrow">Telegram küldés</div><h3>Free, VIP és VIP+ csoportos formátumú jelzés</h3></div></div>
              <label>Célcsoport</label>
              <select value={telegramGroup} onChange={(e) => { setTelegramGroup(e.target.value); setSelectedTelegramTipIds([]); }}><option value="free">Free Telegram</option><option value="vip">VIP Telegram</option><option value="vipplus">VIP+ Telegram</option></select>
              <label>Kiküldendő tippek a napi ajánlóból</label>
              <div className="preset-row"><button className="ghost-button compact" onClick={() => applyTelegramPreset('daily')}>Mai tippek</button><button className="ghost-button compact" onClick={() => applyTelegramPreset('weekly')}>Heti tippek</button><button className="ghost-button compact" onClick={() => applyTelegramPreset('weekend')}>Hétvégi 3-as</button></div>
              <div className="telegram-tip-picker">{telegramOptions.map((tip) => <label key={tip.id} className="telegram-check"><input type="checkbox" checked={selectedTelegramTipIds.includes(tip.id)} onChange={(e) => setSelectedTelegramTipIds((prev) => e.target.checked ? [...new Set([...prev, tip.id])] : prev.filter((id) => id !== tip.id))} /><span>{tip.match} · {tip.tip}</span></label>)}{!telegramOptions.length && <div className="subtle small">Ehhez a csoporthoz még nincs jóváhagyott tipp. Válassz egyet a bal oldali listából.</div>}</div><label>Heti meccsek hozzáadása a Telegram üzenethez</label><div className="telegram-tip-picker fixture-picker">{adminFixtureOptions.map((fixture) => <label key={fixture.id} className="telegram-check"><input type="checkbox" checked={selectedFixtureIds.includes(fixture.id)} onChange={(e) => setSelectedFixtureIds((prev) => e.target.checked ? [...new Set([...prev, fixture.id])] : prev.filter((id) => id !== fixture.id))} /><span>{fixture.label}</span></label>)}</div><div className="subtle small">Itt bármelyik heti meccset hozzáadhatod a Telegram üzenethez. Csak jelöld ki név szerint, amit a szelvényre szeretnél.</div>
              <div className="subtle small">A gyors gombokkal külön heti vagy hétvégi tippsort is kiküldhetsz ugyanabból a tipplistából.</div>
              <div className="telegram-preview-card">
                <img src={bannerForGroup(telegramGroup)} alt={`${tierLabel(telegramGroup)} banner`} className="telegram-banner telegram-logo-banner" />
                <div className="telegram-message"><pre>{telegramMessage}</pre></div>
              </div>
              <div className="subtle small">A preview ugyanazokat a meccseket küldi ki, mint amik a napi Free / VIP / VIP+ ajánlóban látszanak.</div>
              {sendState ? <div className="send-state">{sendState}</div> : null}
              <button className="gradient-button send-btn" onClick={sendTelegramPreview}><Send size={16} /> Küldés a Telegram csoportba</button>
            </div>
          </div>
        </section>
      )}

      
      <section className="section legal-grid" id="aszf">
        <div className="glass legal-card">
          <div className="eyebrow">Jogi információk</div>
          <h3>Általános Szerződési Feltételek</h3>
          <p className="subtle">Az oldalon megjelenő jelzések és elemzések tájékoztató jellegűek. Az előfizetések, hozzáférési szintek, tartalmak elérése és a felhasználói jogosultságok részletes szabályait az ÁSZF tartalmazza.</p>
        </div>
        <div className="glass legal-card" id="adatkezeles">
          <div className="eyebrow">Adatvédelem</div>
          <h3>Adatkezelési Tájékoztató</h3>
          <p className="subtle">A regisztráció, belépés és előfizetés során megadott adatokat kizárólag a szolgáltatás működtetéséhez, jogosultságkezeléshez és ügyfélkapcsolathoz használjuk fel. A részletes szabályozás az adatkezelési tájékoztatóban szerepel.</p>
        </div>
      </section>

      <footer className="footer glass"><div><strong>LTP Betlab</strong><div className="subtle">Sportfogadási elemző szoftver, value keresés, statisztikák és bankroll kontroll egy helyen.</div></div><div className="footer-links"><a href="#tippek">Tippek</a><a href="#statisztika">Statisztika</a><a href="#hogyan-mukodik">Hogyan működik</a><a href="#aszf">ÁSZF</a><a href="#adatkezeles">Adatkezelés</a></div></footer>


      <Modal open={authModal === 'register'} onClose={() => setAuthModal(null)}><div className="modal-head"><UserPlus size={18} /> Regisztráció</div><p className="subtle">Készíts fiókot, hogy megnyíljon a napi tippfal, az árazás és később az előfizetéses hozzáférés.</p><form className="form-grid" onSubmit={(e) => { e.preventDefault(); setAuthModal(null); }}><input placeholder="Név" /><input placeholder="Email cím" /><input placeholder="Jelszó" type="password" /><button className="gradient-button">Fiók létrehozása</button></form></Modal>
      <Modal open={authModal === 'login'} onClose={() => setAuthModal(null)}><div className="modal-head"><LogIn size={18} /> Belépés</div><p className="subtle">Demo: admin emaillel megjelenik az admin felület, vip vagy vipplus emaillel prémium nézet nyílik.</p><form className="form-grid" onSubmit={handleLogin}><input placeholder="Email cím" name="email" /><input placeholder="Jelszó" type="password" name="password" /><button className="gradient-button">Belépés</button></form></Modal>
      <Modal open={authModal === 'pricing'} onClose={() => setAuthModal(null)}><div className="eyebrow">LTP Betlab</div><div className="modal-title">Árazás és csomagok</div><div className="pricing-section-title"><Crown size={18} /> VIP csomagok</div><div className="pricing-grid">{pricing.vip.map((item) => <PackageCard key={item.title} item={item} tone="vip" />)}</div><div className="pricing-section-title"><Sparkles size={18} /> VIP+ csomagok</div><div className="pricing-grid">{pricing.vipplus.map((item) => <PackageCard key={item.title} item={item} tone="vipplus" />)}</div></Modal>
    </main>
  );
}
