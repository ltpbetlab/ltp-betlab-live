'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { getCurrentUser, getMyProfile, signIn, signOutUser, signUp } from '@/lib/auth';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [message, setMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function loadUserData() {
    setLoading(true);

    const { user } = await getCurrentUser();
    setUser(user || null);

    if (user) {
      const { profile } = await getMyProfile();
      setProfile(profile || null);
    } else {
      setProfile(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  async function handleRegister(e) {
    e.preventDefault();
    setMessage('');

    const { error } = await signUp(registerEmail, registerPassword);

    if (error) {
      setMessage(`Regisztrációs hiba: ${error.message}`);
      return;
    }

    setMessage('Sikeres regisztráció. Ha kell email megerősítés, ellenőrizd a postafiókod.');
    setRegisterEmail('');
    setRegisterPassword('');
    await loadUserData();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      setMessage(`Belépési hiba: ${error.message}`);
      return;
    }

    setMessage('Sikeres belépés.');
    setLoginEmail('');
    setLoginPassword('');
    await loadUserData();
  }

  async function handleLogout() {
    await signOutUser();
    setMessage('Sikeres kijelentkezés.');
    await loadUserData();
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <a href="#top" style={brandStyle}>
            <img
              src="/ltp-web-logo.png"
              alt="LTP Betlab"
              style={logoStyle}
            />
            <div style={{ minWidth: 0 }}>
              <div style={brandTitleStyle}>LTP Betlab</div>
              <div style={brandSubtitleStyle}>Sportfogadási elemző szoftver</div>
            </div>
          </a>

          <nav style={desktopNavStyle}>
            <a href="#regisztracio" style={navLinkStyle}>Regisztráció</a>
            <a href="#belepes" style={navLinkStyle}>Belépés</a>
            <a href="#profil" style={navLinkStyle}>Profil</a>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            style={mobileMenuButtonStyle}
            aria-label="Mobil menü megnyitása"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div style={mobileOverlayStyle}>
          <div style={mobileBackdropStyle} onClick={closeMobileMenu} />

          <div style={mobilePopupStyle}>
            <div style={mobilePopupTopStyle}>
              <div style={mobileBrandWrapStyle}>
                <img
                  src="/ltp-web-logo.png"
                  alt="LTP Betlab"
                  style={mobileLogoStyle}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={mobileBrandTitleStyle}>LTP Betlab</div>
                  <div style={mobileBrandSubtitleStyle}>Sportfogadási elemző szoftver</div>
                </div>
              </div>

              <button
                onClick={closeMobileMenu}
                style={closeButtonStyle}
                aria-label="Menü bezárása"
              >
                <X size={20} />
              </button>
            </div>

            <div style={mobileMenuLinksWrapStyle}>
              <a href="#regisztracio" onClick={closeMobileMenu} style={mobileMenuLinkStyle}>
                Regisztráció
              </a>

              <a href="#belepes" onClick={closeMobileMenu} style={mobileMenuLinkStyle}>
                Belépés
              </a>

              <a href="#profil" onClick={closeMobileMenu} style={mobileMenuLinkStyle}>
                Profil
              </a>
            </div>
          </div>
        </div>
      )}

      <div id="top" style={containerStyle}>
        <section style={heroBoxStyle}>
          <p style={heroEyebrowStyle}>SPORTFOGADÁSI ELEMZŐ SZOFTVER</p>
          <h1 style={heroTitleStyle}>LTP Betlab felhasználói központ</h1>
          <p style={heroTextStyle}>
            Itt tudsz regisztrálni, belépni, és ellenőrizni a fiókodat, jogosultságodat,
            illetve a VIP lejárati dátumodat.
          </p>
        </section>

        {message ? (
          <div style={messageStyle}>
            {message}
          </div>
        ) : null}

        <div style={gridStyle}>
          <section id="regisztracio" style={cardStyle}>
            <h2 style={cardTitleStyle}>Regisztráció</h2>

            <form onSubmit={handleRegister} style={formStyle}>
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Jelszó"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={buttonStylePrimary}>
                Regisztráció
              </button>
            </form>
          </section>

          <section id="belepes" style={cardStyle}>
            <h2 style={cardTitleStyle}>Belépés</h2>

            <form onSubmit={handleLogin} style={formStyle}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Jelszó"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={buttonStylePrimary}>
                Belépés
              </button>
            </form>
          </section>
        </div>

        <section id="profil" style={cardStyleLarge}>
          <h2 style={cardTitleStyle}>Aktuális felhasználó</h2>

          {loading ? (
            <p style={textStyle}>Betöltés...</p>
          ) : user ? (
            <>
              <p style={textStyle}>
                <strong>Email:</strong> {user.email}
              </p>
              <p style={textStyle}>
                <strong>Szerepkör:</strong> {profile?.role || 'nincs profil'}
              </p>
              <p style={textStyle}>
                <strong>VIP lejárat:</strong>{' '}
                {profile?.vip_expire_at
                  ? new Date(profile.vip_expire_at).toLocaleString('hu-HU')
                  : 'nincs'}
              </p>

              <button onClick={handleLogout} style={{ ...buttonStylePrimary, marginTop: '16px' }}>
                Kijelentkezés
              </button>
            </>
          ) : (
            <p style={textStyle}>Nincs belépve felhasználó.</p>
          )}
        </section>
      </div>

      <style jsx>{`
        @media (max-width: 920px) {
          .desktop-nav-fallback {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #04101f 0%, #061226 100%)',
  color: 'white',
};

const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
  background: 'rgba(6, 18, 38, 0.92)',
  backdropFilter: 'blur(16px)',
};

const headerInnerStyle = {
  maxWidth: '1180px',
  margin: '0 auto',
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  textDecoration: 'none',
  color: 'white',
  minWidth: 0,
};

const logoStyle = {
  width: '62px',
  height: '62px',
  objectFit: 'contain',
  flexShrink: 0,
};

const brandTitleStyle = {
  fontSize: 'clamp(26px, 2vw, 34px)',
  fontWeight: 800,
  lineHeight: 1.05,
  whiteSpace: 'nowrap',
};

const brandSubtitleStyle = {
  fontSize: 'clamp(13px, 1vw, 16px)',
  color: '#b7c6db',
  marginTop: '2px',
};

const desktopNavStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const navLinkStyle = {
  color: 'rgba(255,255,255,0.9)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 600,
};

const mobileMenuButtonStyle = {
  display: 'none',
  height: '46px',
  width: '46px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '14px',
  border: '1px solid rgba(56, 189, 248, 0.16)',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  cursor: 'pointer',
};

const mobileOverlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 999,
};

const mobileBackdropStyle = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.68)',
  backdropFilter: 'blur(6px)',
};

const mobilePopupStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100vw - 32px)',
  maxWidth: '380px',
  maxHeight: '80vh',
  overflowY: 'auto',
  background: '#07182f',
  border: '1px solid rgba(56, 189, 248, 0.14)',
  borderRadius: '24px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
  padding: '20px',
  zIndex: 1000,
};

const mobilePopupTopStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '24px',
};

const mobileBrandWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: 0,
};

const mobileLogoStyle = {
  width: '56px',
  height: '56px',
  objectFit: 'contain',
  flexShrink: 0,
};

const mobileBrandTitleStyle = {
  fontSize: '20px',
  fontWeight: 800,
  lineHeight: 1.05,
  whiteSpace: 'nowrap',
};

const mobileBrandSubtitleStyle = {
  fontSize: '11px',
  color: '#b7c6db',
  marginTop: '3px',
};

const closeButtonStyle = {
  height: '42px',
  width: '42px',
  borderRadius: '14px',
  border: '1px solid rgba(56, 189, 248, 0.16)',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  cursor: 'pointer',
  flexShrink: 0,
};

const mobileMenuLinksWrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const mobileMenuLinkStyle = {
  textDecoration: 'none',
  color: 'white',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(56, 189, 248, 0.14)',
  borderRadius: '16px',
  padding: '15px 16px',
  fontSize: '16px',
  fontWeight: 700,
  textAlign: 'center',
};

const containerStyle = {
  maxWidth: '1180px',
  margin: '0 auto',
  padding: '28px 18px 50px',
};

const heroBoxStyle = {
  background: '#081933',
  border: '1px solid #153560',
  borderRadius: '24px',
  padding: '24px',
  marginBottom: '24px',
};

const heroEyebrowStyle = {
  fontSize: '12px',
  letterSpacing: '0.28em',
  color: '#67e8f9',
  marginBottom: '12px',
};

const heroTitleStyle = {
  fontSize: 'clamp(32px, 5vw, 52px)',
  fontWeight: 800,
  lineHeight: 1.05,
  marginBottom: '14px',
};

const heroTextStyle = {
  fontSize: '18px',
  color: '#a9b7d0',
  lineHeight: 1.7,
  maxWidth: '800px',
};

const messageStyle = {
  background: '#0d203f',
  border: '1px solid #1f4d8f',
  padding: '14px 16px',
  borderRadius: '12px',
  marginBottom: '24px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '24px',
};

const cardStyle = {
  background: '#081933',
  border: '1px solid #153560',
  borderRadius: '20px',
  padding: '24px',
};

const cardStyleLarge = {
  background: '#081933',
  border: '1px solid #153560',
  borderRadius: '20px',
  padding: '24px',
  marginTop: '24px',
};

const cardTitleStyle = {
  fontSize: '24px',
  marginBottom: '16px',
  fontWeight: 800,
};

const formStyle = {
  display: 'grid',
  gap: '14px',
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: '#0a1f3d',
  border: '1px solid #204b84',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
};

const buttonStylePrimary = {
  background: 'linear-gradient(90deg, #38bdf8, #2563eb)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '14px 18px',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const textStyle = {
  fontSize: '16px',
  lineHeight: 1.8,
  color: '#dbe7f5',
  marginBottom: '8px',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 920px) {
      nav[style] {
        display: none !important;
      }
      button[aria-label="Mobil menü megnyitása"] {
        display: flex !important;
      }
      div[style*="grid-template-columns: repeat(2, minmax(0, 1fr))"] {
        grid-template-columns: 1fr !important;
      }
      img[alt="LTP Betlab"] {
        max-width: 100%;
      }
    }
  `;
  if (!document.head.querySelector('style[data-ltp-mobile-center-menu]')) {
    style.setAttribute('data-ltp-mobile-center-menu', 'true');
    document.head.appendChild(style);
  }
}