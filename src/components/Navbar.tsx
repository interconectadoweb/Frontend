import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { SEO_CONFIG } from '../data/content';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

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

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
        padding: scrolled ? '0.75rem 2rem' : '1.25rem 2rem',
        background: scrolled
          ? 'rgba(3,0,20,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(168,85,247,0.15)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a
          href="#inicio"
          onClick={e => { e.preventDefault(); scrollTo('#inicio'); }}
          style={{
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}
        >
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: 'white',
          }}>
            I
          </div>
          <span style={{
            fontSize: '1rem', fontWeight: 800, color: 'white',
            letterSpacing: '-0.5px',
          }}>
            InterConectados<span style={{ color: '#a855f7' }}>Web</span>
          </span>
        </a>

        {/* Desktop links */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          '@media (max-width: 768px)': { display: 'none' },
        } as React.CSSProperties}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); scrollTo(link.href); }}
              style={{
                padding: '0.5rem 0.9rem', borderRadius: '100px',
                fontSize: '0.88rem', fontWeight: 600, color: '#94a3b8',
                textDecoration: 'none', transition: 'all 0.2s ease',
                display: 'none',
              }}
              className="nav-link-desktop"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Carrito */}
          <button
            onClick={openCart}
            title="Abrir carrito"
            style={{
              position: 'relative', background: 'rgba(168,85,247,0.15)',
              border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px',
              padding: '0.55rem 0.9rem', color: 'white', cursor: 'pointer',
              fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s ease', fontWeight: 600,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(168,85,247,0.3)';
              e.currentTarget.style.borderColor = '#a855f7';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(168,85,247,0.15)';
              e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
            }}
          >
            🛒
            {totalItems > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                color: 'white', borderRadius: '100px',
                fontSize: '0.7rem', fontWeight: 800, padding: '0.1rem 0.45rem',
                minWidth: '18px', textAlign: 'center',
                animation: 'popBadge 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* CTA */}
          <a
            href="#contacto"
            onClick={e => { e.preventDefault(); scrollTo('#contacto'); }}
            style={{
              padding: '0.6rem 1.3rem', borderRadius: '100px',
              background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
              color: 'white', textDecoration: 'none', fontWeight: 700,
              fontSize: '0.85rem', transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(168,85,247,0.3)',
              display: 'none',
            }}
            className="nav-cta-desktop"
          >
            Consulta Gratis →
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '0.5rem 0.65rem',
              color: 'white', cursor: 'pointer', fontSize: '1.1rem',
              display: 'none',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 9997,
          background: 'rgba(3,0,20,0.97)', backdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(168,85,247,0.15)',
          padding: '1.5rem 2rem',
          animation: 'slideDown 0.2s ease',
        }}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); scrollTo(link.href); }}
              style={{
                display: 'block', padding: '1rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: '#94a3b8', textDecoration: 'none',
                fontWeight: 600, fontSize: '1rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${SEO_CONFIG.whatsapp}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', marginTop: '1rem', padding: '1rem',
              background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
              borderRadius: '1rem', color: 'white', textDecoration: 'none',
              fontWeight: 700, textAlign: 'center', fontSize: '0.95rem',
            }}
          >
            🚀 Consulta Gratis
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .nav-link-desktop { display: block !important; }
          .nav-cta-desktop { display: block !important; }
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 768px) {
          .nav-hamburger { display: block !important; }
        }
        .nav-link-desktop:hover {
          color: white !important;
          background: rgba(168,85,247,0.08) !important;
        }
        @keyframes popBadge {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
