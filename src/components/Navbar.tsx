import { useState, useEffect } from 'react';
import { SEO_CONFIG } from '../data/content';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Portfolio', href: '#portafolio' },
    { label: 'Proceso', href: '#metodologia' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // Colores del ecosistema: Púrpura, Azul Real y Cian
  const colors = {
    primary: '#a855f7',
    secondary: '#3b82f6',
    accent: '#06b6d4',
    neonShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
        padding: scrolled ? '0.6rem 2rem' : '1.1rem 2rem',
        background: scrolled ? 'rgba(3,0,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.primary}33` : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        
        {/* Logo Elaborado con 3 Colores y Neon */}
        <a
          href="#inicio"
          onClick={e => { e.preventDefault(); scrollTo('#inicio'); }}
          style={{
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            filter: `drop-shadow(${colors.neonShadow})`
          }}
        >
          <div style={{
            position: 'relative', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Elemento gráfico del logo: 3 círculos entrelazados o degradado complejo */}
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="50%" stopColor={colors.secondary} />
                  <stop offset="100%" stopColor={colors.accent} />
                </linearGradient>
              </defs>
              <path d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z" stroke="url(#logoGradient)" strokeWidth="8" />
              <circle cx="50" cy="50" r="15" fill="url(#logoGradient)" />
            </svg>
          </div>
          <span style={{
            fontSize: '1.2rem', fontWeight: 850, color: 'white',
            letterSpacing: '-0.5px',
          }}>
            InterConectados<span style={{ 
              background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Web</span>
          </span>
        </a>

        {/* Desktop links */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          '@media (max-width: 900px)': { display: 'none' },
        } as React.CSSProperties} className="nav-container-desktop">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); scrollTo(link.href); }}
              style={{
                padding: '0.5rem 1rem', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1',
                textDecoration: 'none', transition: 'all 0.3s ease',
              }}
              className="nav-link-item"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Nuevo Boton: Iniciar Propuesta con Efecto Neon */}
          <a
            href="#contacto"
            onClick={e => { e.preventDefault(); scrollTo('#contacto'); }}
            style={{
              padding: '0.7rem 1.5rem', borderRadius: '50px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white', textDecoration: 'none', fontWeight: 700,
              fontSize: '0.85rem', transition: 'all 0.3s ease',
              boxShadow: `0 0 15px ${colors.primary}66`,
              border: `1px solid ${colors.primary}aa`,
              letterSpacing: '0.3px'
            }}
            className="nav-cta-desktop neon-button-hover"
          >
            Iniciar Propuesta
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '0.6rem',
              color: 'white', cursor: 'pointer', fontSize: '1.2rem',
              display: 'none', transition: '0.2s'
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '0', left: 0, right: 0, bottom: 0, zIndex: 9997,
          background: 'rgba(3,0,20,0.98)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', padding: '2rem', gap: '1.5rem',
          animation: 'fadeIn 0.3s ease',
        }}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); scrollTo(link.href); }}
              style={{
                color: 'white', textDecoration: 'none',
                fontWeight: 600, fontSize: '1.5rem',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${SEO_CONFIG.whatsapp}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              marginTop: '1rem', padding: '1rem 2.5rem',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: '50px', color: 'white', textDecoration: 'none',
              fontWeight: 700, fontSize: '1.1rem',
              boxShadow: `0 0 20px ${colors.primary}44`,
            }}
          >
            Iniciar Propuesta 🚀
          </a>
          <button 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', fontSize: '2rem' }}
          >✕</button>
        </div>
      )}

      <style>{`
        @media (min-width: 901px) {
          .nav-container-desktop { display: flex !important; }
          .nav-cta-desktop { display: inline-block !important; }
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 900px) {
          .nav-container-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
        .nav-link-item:hover {
          color: white !important;
          background: rgba(168,85,247,0.1);
          transform: translateY(-2px);
        }
        .neon-button-hover:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px ${colors.primary}aa !important;
          filter: brightness(1.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}