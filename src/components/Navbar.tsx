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

  const colors = {
    yellow: '#FFC107', 
    cyan: '#00D8D8',   
    white: '#FFFFFF',  
    bgDark: '#030014'  
  };

  const starGlowStyle = {
    color: colors.yellow,
    fontSize: '1.2rem',
    filter: 'drop-shadow(0 0 4px rgba(255, 193, 7, 0.5))' 
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
        padding: scrolled ? '0.6rem 2rem' : '1.1rem 2rem',
        background: scrolled ? 'rgba(3,0,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid rgba(255,255,255,0.08)` : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        
        {/* -- BLOQUE IZQUIERDO: Logo -- */}
        <div style={{ flex: '1 1 0%', display: 'flex', justifyContent: 'flex-start' }}>
          <a
            href="#inicio"
            onClick={e => { e.preventDefault(); scrollTo('#inicio'); }}
            style={{
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(15, 23, 42, 0.4)',
              padding: '0.4rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <span style={starGlowStyle}>★</span>
            <span style={{
              fontSize: '1.2rem', fontWeight: 800,
              letterSpacing: '-0.3px', fontFamily: 'system-ui, sans-serif'
            }}>
              <span style={{ color: colors.yellow }}>Inter</span>
              <span style={{ color: colors.cyan }}>ConectadosWeb</span>
              <span style={{ color: colors.white }}>.es</span>
            </span>
            <span style={starGlowStyle}>★</span>
          </a>
        </div>

        {/* -- BLOQUE CENTRAL: Enlaces de navegación -- */}
        <div style={{
          flex: '0 1 auto', 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: '0.5rem',
        }} className="nav-container-desktop">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); scrollTo(link.href); }}
              style={{
                padding: '0.5rem 1rem', borderRadius: '12px',
                fontSize: '1.025rem', 
                fontWeight: 500,
                color: colors.white, 
                textDecoration: 'none', transition: 'all 0.3s ease',
              }}
              className="nav-link-item"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* -- BLOQUE DERECHO: Acciones -- */}
        <div style={{ flex: '1 1 0%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          
          {/* Botón: Iniciar Propuesta - AHORA IGUAL AL TAMAÑO DEL LOGO */}
          <a
            href="#contacto"
            onClick={e => { e.preventDefault(); scrollTo('#contacto'); }}
            style={{
              padding: '0.4rem 1rem', // Mismo padding que la caja del logo
              borderRadius: '12px', // Bordes sutiles iguales al logo
              background: 'rgba(15, 23, 42, 0.4)',
              textDecoration: 'none', 
              fontWeight: 800, // Mismo peso que el logo
              fontSize: '1.2rem', // Mismo tamaño de fuente que el logo
              transition: 'all 0.3s ease',
              border: `1px solid rgba(255, 193, 7, 0.25)`, 
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
            className="nav-cta-desktop logo-button-hover"
          >
            <span style={starGlowStyle}>★</span>
            <span style={{ fontFamily: 'system-ui, sans-serif' }}>
              <span style={{ color: colors.yellow }}>Iniciar</span>{' '}
              <span style={{ color: colors.cyan }}>Propuesta</span>
            </span>
            <span style={starGlowStyle}>★</span>
          </a>

          {/* Botón Hamburger (Móvil) */}
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

      {/* Menú Móvil (Overlay) */}
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
                color: colors.white, 
                textDecoration: 'none',
                fontWeight: 600, fontSize: '1.5rem',
              }}
            >
              {link.label}
            </a>
          ))}
          
          <a
            href={`https://wa.me/${SEO_CONFIG?.whatsapp || ''}`} 
            target="_blank" rel="noopener noreferrer"
            style={{
              marginTop: '1rem', padding: '0.8rem 1.5rem',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '12px', textDecoration: 'none',
              fontWeight: 700, fontSize: '1.2rem',
              border: `1px solid rgba(255, 193, 7, 0.4)`,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <span style={starGlowStyle}>★</span>
            <span>
              <span style={{ color: colors.yellow }}>Iniciar</span>{' '}
              <span style={{ color: colors.cyan }}>Propuesta</span>
            </span>
            <span style={starGlowStyle}>★</span>
          </a>

          <button 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
          >✕</button>
        </div>
      )}

      <style>{`
        @media (min-width: 901px) {
          .nav-container-desktop { display: flex !important; }
          .nav-cta-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 900px) {
          .nav-container-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
        .nav-link-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }
        .logo-button-hover:hover {
          transform: scale(1.05);
          background: rgba(15, 23, 42, 0.7) !important;
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.25) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
