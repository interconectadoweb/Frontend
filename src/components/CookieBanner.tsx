import { useState, useEffect } from 'react';

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_KEY = 'icw_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (c: ConsentState) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...c, timestamp: Date.now() }));
    setVisible(false);
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => saveConsent(consent);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999999,
      padding: '1rem',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '900px', width: '100%',
        background: 'linear-gradient(135deg, rgba(11,6,32,0.97) 0%, rgba(15,10,31,0.98) 100%)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: '0 -10px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.1)',
        animation: 'slideUpCookie 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Barra superior */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #a855f7, #06b6d4, #22c55e, #ec4899)',
          backgroundSize: '300% 100%',
          animation: 'gradientFlow 4s ease infinite',
        }} />

        <div style={{ padding: '1.5rem 2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              fontSize: '2rem', width: '50px', height: '50px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.2))',
              borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              🍪
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 800, color: 'white' }}>
                Respetamos tu privacidad
              </h3>
              <p style={{ margin: 0, fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Usamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar contenido.
                Puedes aceptar todas, rechazarlas o configurar tus preferencias. Cumplimos con el{' '}
                <strong style={{ color: '#a855f7' }}>RGPD</strong> y la{' '}
                <strong style={{ color: '#a855f7' }}>LSSI-CE</strong> española.
              </p>
            </div>
          </div>

          {/* Panel de detalles expandible */}
          {showDetails && (
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem',
              marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
              {/* Necesarias */}
              <CookieToggle
                title="🔒 Cookies necesarias"
                desc="Esenciales para el funcionamiento del sitio. No pueden desactivarse."
                checked={true}
                disabled
                onChange={() => {}}
              />
              {/* Analíticas */}
              <CookieToggle
                title="📊 Cookies analíticas"
                desc="Nos ayudan a entender cómo interactúas con la web (Google Analytics)."
                checked={consent.analytics}
                onChange={v => setConsent(p => ({ ...p, analytics: v }))}
              />
              {/* Marketing */}
              <CookieToggle
                title="🎯 Cookies de marketing"
                desc="Usadas para mostrarte publicidad relevante en otras plataformas."
                checked={consent.marketing}
                onChange={v => setConsent(p => ({ ...p, marketing: v }))}
              />
            </div>
          )}

          {/* Botones */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center',
          }}>
            <button
              onClick={acceptAll}
              style={{
                padding: '0.7rem 1.5rem', borderRadius: '100px',
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                border: 'none', color: 'white', fontWeight: 700,
                fontSize: '0.85rem', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(168,85,247,0.35)',
                transition: 'all 0.2s ease', flex: '1 1 140px',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              ✅ Aceptar todas
            </button>

            <button
              onClick={rejectAll}
              style={{
                padding: '0.7rem 1.25rem', borderRadius: '100px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s ease', flex: '1 1 120px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                e.currentTarget.style.color = '#f87171';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              ❌ Rechazar
            </button>

            {showDetails ? (
              <button
                onClick={saveCustom}
                style={{
                  padding: '0.7rem 1.25rem', borderRadius: '100px',
                  background: 'rgba(6,182,212,0.1)',
                  border: '1px solid rgba(6,182,212,0.35)',
                  color: '#06b6d4', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  transition: 'all 0.2s ease', flex: '1 1 130px',
                }}
              >
                💾 Guardar preferencias
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                style={{
                  padding: '0.7rem 1.25rem', borderRadius: '100px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#64748b', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >
                ⚙️ Personalizar
              </button>
            )}

            <span style={{ fontSize: '0.72rem', color: '#475569', marginLeft: 'auto' }}>
              <a href="#" style={{ color: '#64748b', textDecoration: 'underline' }}>
                Política de privacidad
              </a>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpCookie {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

function CookieToggle({
  title, desc, checked, disabled, onChange,
}: {
  title: string; desc: string; checked: boolean; disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
      <div>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{title}</p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '44px', height: '24px', borderRadius: '100px', flexShrink: 0,
          background: checked ? 'linear-gradient(135deg, #a855f7, #3b82f6)' : 'rgba(255,255,255,0.1)',
          border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative', transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{
          position: 'absolute', top: '3px',
          left: checked ? 'calc(100% - 21px)' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: 'white', transition: 'left 0.3s ease',
          display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}
