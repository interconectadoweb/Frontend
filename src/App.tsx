import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import CookieBanner from './components/CookieBanner';
import PaymentNotification from './components/PaymentNotification';
import Navbar from './components/Navbar';
import {
  SEO_CONFIG, projects, servicios, stats, reviews,
  valores, diferenciadores, proceso, infoCards,
} from './data/content';

// ============================================
// TRADUCCIÓN AUTOMÁTICA - ESPAÑOL POR DEFECTO
// ============================================
const AutoTranslator = () => {
  useEffect(() => {
    const browserLang = (navigator.language || navigator.languages?.[0] || 'es').toLowerCase();
    const isEnglish = browserLang.startsWith('en');
    
    if (!isEnglish) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      return;
    }

    const setupTranslation = () => {
      document.cookie = `googtrans=/es/en; path=/; max-age=31536000`;
      
      if (document.getElementById('google_translate_element')) return;
      
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.cssText = 'display:none!important;visibility:hidden!important;position:absolute!important;left:-9999px!important;';
      document.body.insertBefore(div, document.body.firstChild);

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateInit';
      script.async = true;
      
      (window as any).googleTranslateInit = () => {
        try {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'es',
            includedLanguages: 'en',
            autoDisplay: false,
            layout: (window as any).google.translate.TranslateElement?.InlineLayout?.SIMPLE
          }, 'google_translate_element');
        } catch (e) {
          console.log('Translate init skipped');
        }
      };
      
      document.head.appendChild(script);
    };

    if (document.readyState === 'complete') {
      setTimeout(setupTranslation, 100);
    } else {
      window.addEventListener('load', () => setTimeout(setupTranslation, 100));
    }
  }, []);

  return null;
};

// ============================================
// FAVICON
// ============================================
const updateFavicon = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFD700"/><stop offset="100%" style="stop-color:#FF8C00"/></linearGradient></defs><path d="M16 2l4 12h12l-10 8 4 12-10-8-10 8 4-12-10-8h12z" fill="url(#g)"/></svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.href = url;
  document.title = 'InterConectadosWeb - Agencia Digital Premium en España';
};

// ============================================
// ESTILOS GLOBALES - VERSIÓN FINAL PULIDA
// ============================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    /* FONDOS */
    --bg: #0f1d32;
    --bg-dark: #0a1525;
    --bg-card: rgba(18, 38, 65, 0.85);
    --bg-glass: rgba(25, 50, 85, 0.65);
    
    /* BORDES */
    --border: rgba(100, 160, 255, 0.2);
    --border-hover: rgba(100, 180, 255, 0.5);
    
    /* COLORES PRINCIPALES - PUROS Y VIBRANTES */
    --accent: #5B9FFF;
    --accent-bright: #7CB3FF;
    --accent-2: #00E5FF;
    --accent-2-bright: #40EFFF;
    --accent-3: #B794F6;
    --accent-3-bright: #D0B4FF;
    --green: #00E676;
    --green-bright: #4AFF91;
    --gold: #FFD54F;
    --gold-bright: #FFE57F;
    --red: #FF5252;
    
    /* TEXTOS - BLANCOS PUROS, SIN GRISES */
    --white: #FFFFFF;
    --white-pure: #FFFFFF;
    --white-high: rgba(255, 255, 255, 0.95);
    --white-medium: rgba(255, 255, 255, 0.85);
    --white-soft: rgba(255, 255, 255, 0.75);
    --white-muted: rgba(255, 255, 255, 0.6);
    
    /* ANIMACIONES */
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  html { 
    scroll-behavior: smooth; 
    font-size: 16px;
    -webkit-overflow-scrolling: touch;
    scroll-padding-top: 70px;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background: var(--bg);
    color: var(--white);
    overflow-x: hidden;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'kern' 1, 'liga' 1;
    letter-spacing: 0.01em;
    overscroll-behavior-y: none;
    top: 0 !important;
  }

  /* ═══════════════════════════════════════════════════════════════
     ELIMINAR X DUPLICADA DEL MENÚ MÓVIL - REGLAS ULTRA ESPECÍFICAS
     ═══════════════════════════════════════════════════════════════ */
  
  /* Ocultar cualquier X o botón de cierre duplicado en navbar */
  nav button[aria-label*="close"] svg,
  nav button[aria-label*="cerrar"] svg,
  nav button[aria-label*="Close"] svg,
  nav button[aria-label*="Cerrar"] svg,
  nav [class*="close"] svg,
  nav [class*="Close"] svg,
  nav button svg.close-icon,
  nav button svg[class*="close"],
  nav button svg[class*="x-"],
  nav button > svg:not(:only-child),
  nav button > svg + svg,
  nav button svg:nth-child(2),
  nav button svg:last-child:not(:first-child),
  .navbar button svg:not(:first-child),
  .navbar-toggle svg:not(:first-child),
  .mobile-menu-toggle svg:not(:first-child),
  .hamburger svg:not(:first-child),
  .menu-button svg:not(:first-child),
  [class*="hamburger"] svg:not(:first-child),
  [class*="mobile-menu"] button svg:not(:first-child),
  header button svg:not(:first-child),
  nav > div button svg:not(:first-child),
  nav button span:not(:first-child),
  .nav-toggle svg:not(:first-child) {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    position: absolute !important;
    pointer-events: none !important;
  }

  /* Asegurar que solo se muestre el primer SVG (hamburguesa) */
  nav button svg:first-child,
  .navbar button svg:first-child,
  .hamburger svg:first-child {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* Ocultar Google Translate UI */
  .goog-te-banner-frame,
  .goog-te-balloon-frame,
  .goog-tooltip,
  .goog-te-spinner-pos,
  .goog-te-gadget,
  body > .skiptranslate,
  #goog-gt-tt,
  .goog-te-menu-frame,
  .VIpgJd-ZVi9od-ORHb-OEVmcd,
  .VIpgJd-ZVi9od-l4eHX-hSRGPd,
  #google_translate_element {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    opacity: 0 !important;
  }

  .goog-text-highlight {
    background: none !important;
    box-shadow: none !important;
  }

  /* GPU Acceleration */
  .gpu-accelerated {
    will-change: transform, opacity;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    * { -webkit-tap-highlight-color: transparent; }
    body {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
    #portafolio .card p,
    #portafolio .card h3,
    #portafolio .card span:not(.glass) {
      font-size: calc(1em - 1pt) !important;
    }
  }

  /* Background effects */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 120% 90% at 50% -20%, rgba(91, 159, 255, 0.18), transparent 60%),
      radial-gradient(ellipse 90% 70% at 100% 100%, rgba(183, 148, 246, 0.12), transparent 50%),
      radial-gradient(ellipse 70% 60% at 0% 85%, rgba(0, 229, 255, 0.1), transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  ::selection { background: var(--accent); color: white; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg-dark); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--accent), var(--accent-3)); border-radius: 4px; }

  /* ═══════════════ ANIMACIONES ═══════════════ */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translate3d(0, 30px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes float { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -12px, 0); } }
  @keyframes floatSlow { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -18px, 0); } }
  @keyframes floatReverse { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, 14px, 0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.08); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes starPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px gold); } 50% { transform: scale(1.15); filter: drop-shadow(0 0 14px gold); } }
  @keyframes scrollDown { 0% { transform: translate3d(0, 0, 0); opacity: 1; } 100% { transform: translate3d(0, 12px, 0); opacity: 0; } }
  @keyframes carousel { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  @keyframes countUp { from { opacity: 0; transform: translate3d(0, 20px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes waPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); } 70% { box-shadow: 0 0 0 15px transparent; } }
  @keyframes slideInLeft { from { opacity: 0; transform: translate3d(-40px, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translate3d(40px, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes slideInUp { from { opacity: 0; transform: translate3d(0, 40px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.03); opacity: 1; } }

  /* ═══════════════ GLASS EFFECT ═══════════════ */
  .glass {
    background: var(--bg-glass);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border);
  }

  /* ═══════════════ CARDS ═══════════════ */
  .card {
    background: var(--bg-card);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    border: 1px solid var(--border);
    border-radius: 18px;
    transition: all 0.4s var(--ease-smooth);
    overflow: hidden;
  }

  .card:hover {
    border-color: var(--border-hover);
    transform: translate3d(0, -6px, 0);
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.35), 0 0 35px rgba(91, 159, 255, 0.12);
  }

  /* ═══════════════ GRADIENT TEXT ═══════════════ */
  .gradient-text {
    background: linear-gradient(135deg, var(--accent-bright), var(--accent-2-bright), var(--accent-3-bright));
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientFlow 4s ease infinite;
    font-weight: 700;
  }

  /* ═══════════════ BOTONES ═══════════════ */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem 1.6rem;
    font-size: 0.92rem;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: all 0.35s var(--ease-spring);
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.02em;
  }

  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transform: translate3d(-100%, 0, 0);
    transition: transform 0.6s ease;
  }

  .btn:hover::before { transform: translate3d(100%, 0, 0); }

  .btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-3));
    color: var(--white-pure);
    box-shadow: 0 6px 28px rgba(91, 159, 255, 0.45);
  }

  .btn-primary:hover {
    transform: translate3d(0, -3px, 0) scale(1.02);
    box-shadow: 0 12px 40px rgba(91, 159, 255, 0.55);
  }

  .btn-secondary {
    background: var(--bg-glass);
    backdrop-filter: blur(12px);
    border: 2px solid var(--border);
    color: var(--white-pure);
  }

  .btn-secondary:hover {
    background: rgba(91, 159, 255, 0.18);
    border-color: var(--accent);
    transform: translate3d(0, -2px, 0);
    box-shadow: 0 8px 28px rgba(91, 159, 255, 0.2);
  }

  .btn-lg { padding: 0.95rem 1.9rem; font-size: 0.98rem; }
  .btn-sm { padding: 0.55rem 1.1rem; font-size: 0.82rem; }
  .btn-block { width: 100%; }

  /* ═══════════════ SECCIONES ═══════════════ */
  .section { padding: 4.5rem 0; position: relative; z-index: 1; }
  .container { max-width: 1280px; margin: 0 auto; padding: 0 1.25rem; }

  .section-header { text-align: center; margin-bottom: 2.5rem; }
  
  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.1rem;
    background: var(--bg-glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--accent-2-bright);
    margin-bottom: 1rem;
  }
  
  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.6rem, 4.5vw, 2.5rem);
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 0.8rem;
    color: var(--white-pure);
    letter-spacing: -0.02em;
  }
  
  .section-sub {
    font-size: 1rem;
    color: var(--white-medium);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.75;
    font-weight: 500;
  }

  /* ═══════════════ GRIDS ═══════════════ */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

  @media (max-width: 1024px) {
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .section { padding: 3.5rem 0; }
  }

  @media (max-width: 768px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .section { padding: 3rem 0; }
  }

  /* ═══════════════ PRELOADER ═══════════════ */
  .preloader {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, var(--bg-dark), var(--bg));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    z-index: 999999;
  }

  .spinner {
    width: 42px;
    height: 42px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* ═══════════════ HOVER EFFECTS ═══════════════ */
  .hover-lift { transition: transform 0.35s var(--ease-spring); }
  .hover-lift:hover { transform: translate3d(0, -5px, 0); }

  .interactive { transition: all 0.3s var(--ease-spring); cursor: pointer; }
  .interactive:hover { transform: scale(1.03); }
  .interactive:active { transform: scale(0.97); }

  /* ═══════════════ TIPOGRAFÍA MEJORADA ═══════════════ */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: var(--white-pure);
    letter-spacing: -0.01em;
  }

  p {
    color: var(--white-medium);
    font-weight: 500;
  }

  strong, b {
    font-weight: 700;
    color: var(--white-pure);
  }

  /* Links elegantes */
  a {
    color: var(--accent-bright);
    text-decoration: none;
    transition: color 0.25s ease;
  }

  a:hover {
    color: var(--accent-2-bright);
  }
`;

// ============================================
// COMPONENTES
// ============================================

const NeonStar = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'starPulse 2s ease-in-out infinite' }}>
    <defs>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
    </defs>
    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6L12 2z" fill="url(#starGrad)" />
  </svg>
);

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const s = { sm: { star: 12, text: '0.78rem' }, md: { star: 14, text: '0.88rem' }, lg: { star: 18, text: '1.15rem' } }[size];
  return (
    <div className="glass interactive" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 1rem', borderRadius: '12px' }}>
      <NeonStar size={s.star} />
      <span style={{ fontFamily: 'Space Grotesk', fontSize: s.text, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <span style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Inter</span>
        <span style={{ color: 'var(--accent-2-bright)' }}>Conectados</span>
        <span style={{ color: 'var(--green-bright)' }}>Web</span>
        <span style={{ color: 'var(--white-muted)', fontWeight: 500, fontSize: '0.85em' }}>.es</span>
      </span>
      <NeonStar size={s.star} />
    </div>
  );
};

// Logo WhatsApp Oficial
const WhatsAppLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 2.469.645 4.786 1.77 6.8L2 30l7.42-1.73A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5c-2.234 0-4.36-.566-6.21-1.61l-.445-.26-4.61 1.073 1.1-4.48-.29-.46A11.44 11.44 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5z" fill="#fff"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M22.377 18.63c-.347-.174-2.053-1.013-2.372-1.129-.319-.116-.551-.174-.783.174-.232.347-.898 1.13-1.101 1.362-.203.232-.406.26-.753.087-.347-.174-1.465-.54-2.79-1.722-1.032-.92-1.729-2.055-1.932-2.402-.203-.347-.022-.535.152-.708.157-.156.348-.406.521-.609.174-.203.232-.348.348-.58.116-.232.058-.435-.029-.609-.087-.174-.783-1.888-1.072-2.585-.283-.678-.57-.586-.783-.597-.203-.01-.435-.012-.667-.012-.232 0-.609.087-.928.435-.319.347-1.217 1.188-1.217 2.899s1.246 3.362 1.42 3.594c.174.232 2.453 3.744 5.942 5.25.83.358 1.478.572 1.984.732.834.265 1.593.228 2.193.138.669-.1 2.053-.839 2.343-1.65.29-.81.29-1.504.203-1.65-.087-.145-.319-.232-.667-.406z" fill="#fff"/>
  </svg>
);

const SocialIcon = ({ type }: { type: 'instagram' | 'twitter' | 'linkedin' | 'github' }) => {
  const paths: Record<string, string> = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    github: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={paths[type]} /></svg>;
};

// Botón WhatsApp Flotante
const WhatsAppFloat = () => {
  const [hover, setHover] = useState(false);
  
  return (
    <a 
      href={`https://wa.me/${SEO_CONFIG.whatsapp}?text=${encodeURIComponent('¡Hola! Me interesa información sobre sus servicios.')}`}
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label="WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        position: 'fixed', 
        bottom: '1.5rem', 
        right: '1.5rem', 
        zIndex: 99999, 
        width: '60px', 
        height: '60px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: hover 
          ? '0 12px 38px rgba(37, 211, 102, 0.6), 0 0 0 5px rgba(37, 211, 102, 0.2)' 
          : '0 6px 28px rgba(37, 211, 102, 0.5)',
        transition: 'all 0.35s var(--ease-spring)', 
        animation: 'waPulse 2s infinite',
        transform: hover ? 'scale(1.12) rotate(5deg)' : 'scale(1)',
      }}
    >
      <WhatsAppLogo />
      <div style={{
        position: 'absolute',
        right: '72px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(14px)',
        border: '1px solid var(--border-hover)',
        padding: '0.65rem 1.1rem',
        borderRadius: '12px',
        whiteSpace: 'nowrap',
        fontSize: '0.88rem',
        fontWeight: 700,
        opacity: hover ? 1 : 0,
        transform: hover ? 'translate3d(0, 0, 0)' : 'translate3d(15px, 0, 0)',
        transition: 'all 0.35s var(--ease-spring)',
        pointerEvents: 'none',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        color: 'var(--white-pure)'
      }}>
        💬 ¡Escríbenos!
      </div>
    </a>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
function App() {
  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<typeof projects[0] | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVis, setStatsVis] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useLayoutEffect(() => {
    const s = document.createElement('style');
    s.id = 'icw-styles';
    s.textContent = globalStyles;
    document.head.prepend(s);
    document.body.style.overflow = 'hidden';
    updateFavicon();
    return () => { document.getElementById('icw-styles')?.remove(); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { setReady(true); document.body.style.overflow = ''; }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    });
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.15 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!project) return;
    window.history.pushState({}, '');
    const h = () => setProject(null);
    window.addEventListener('popstate', h);
    return () => window.removeEventListener('popstate', h);
  }, [project]);

  useEffect(() => { document.body.style.overflow = project ? 'hidden' : ''; }, [project]);

  const handleBuy = async (name: string, price: number, id: string) => {
    if (loading) return;
    setLoading(id);
    try {
      const base = (import.meta.env.VITE_API_URL as string) || SEO_CONFIG.apiUrl;
      const res = await axios.post(`${base}/api/stripe/create-checkout-session`, {
        serviceName: name, price,
        successUrl: `${location.origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${location.origin}/?payment=cancelled`,
      });
      if (res.data?.url) location.href = res.data.url;
      else throw new Error();
    } catch {
      window.open(`https://wa.me/${SEO_CONFIG.whatsapp}?text=${encodeURIComponent(`¡Hola! Quiero contratar "${name}" por €${price}`)}`, '_blank');
    } finally { setLoading(null); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = `¡Hola! 👋%0A%0A*Servicio:* ${form.servicio || 'Consulta'}%0A*Nombre:* ${form.nombre}%0A*Email:* ${form.email}%0A*Tel:* ${form.telefono || '-'}%0A%0A${form.mensaje}`;
    window.open(`https://wa.me/${SEO_CONFIG.whatsapp}?text=${txt}`, '_blank');
    setSent(true);
    setForm({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  if (!ready) {
    return (
      <div className="preloader">
        <Logo size="lg" />
        <div className="spinner" />
        <p style={{ color: 'var(--white-soft)', fontSize: '0.78rem', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AutoTranslator />
      <Navbar />
      <CookieBanner />
      <PaymentNotification />
      <WhatsAppFloat />

      {/* ═══════════════════════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <section id="inicio" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        paddingTop: '70px',
        paddingBottom: '20px'
      }}>
        {/* Fondo */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div className="gpu-accelerated" style={{
            position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '50%',
            background: 'radial-gradient(circle, rgba(91, 159, 255, 0.28) 0%, transparent 60%)',
            filter: 'blur(80px)', animation: 'floatSlow 18s ease-in-out infinite',
            transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`
          }} />
          <div className="gpu-accelerated" style={{
            position: 'absolute', bottom: '-10%', right: '-5%', width: '45%', height: '45%',
            background: 'radial-gradient(circle, rgba(183, 148, 246, 0.22) 0%, transparent 60%)',
            filter: 'blur(80px)', animation: 'floatReverse 20s ease-in-out infinite',
            transform: `translate3d(${-mousePos.x * 15}px, ${-mousePos.y * 15}px, 0)`
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(91, 159, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(91, 159, 255, 0.025) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.15fr 0.85fr', 
            gap: '2.5rem', 
            alignItems: 'center'
          }}>
            {/* CONTENIDO */}
            <div className="hero-content" style={{ animation: 'slideInLeft 0.8s var(--ease-smooth)' }}>
              {/* Badge */}
              <div style={{ marginBottom: '1rem', animation: 'bounceIn 0.7s var(--ease-spring) 0.2s both' }}>
                <div className="glass" style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.55rem 1.1rem', borderRadius: '100px',
                  fontSize: '0.75rem', fontWeight: 700
                }}>
                  <span style={{ 
                    width: '8px', height: '8px', borderRadius: '50%', 
                    background: 'var(--green-bright)', 
                    boxShadow: '0 0 12px var(--green)', 
                    animation: 'pulse 2s infinite' 
                  }} />
                  <span style={{ color: 'var(--white-pure)' }}>🇪🇸 Agencia Digital Premium — España & LATAM</span>
                </div>
              </div>

              {/* Título */}
              <h1 style={{ 
                fontFamily: 'Space Grotesk', 
                fontSize: 'clamp(1.8rem, 4vw, 3rem)', 
                fontWeight: 800, 
                lineHeight: 1.1, 
                marginBottom: '1rem',
                animation: 'slideInUp 0.7s var(--ease-smooth) 0.3s both',
                letterSpacing: '-0.02em'
              }}>
                <span style={{ color: 'var(--white-pure)' }}>Creamos </span>
                <span className="gradient-text">Experiencias Digitales</span>
                <span style={{ color: 'var(--gold-bright)' }}> Únicas</span>
              </h1>

              {/* Subtítulo */}
              <p style={{ 
                fontSize: 'clamp(0.92rem, 1.8vw, 1.02rem)', 
                color: 'var(--white-medium)', 
                marginBottom: '1.25rem', 
                maxWidth: '500px', 
                lineHeight: 1.7,
                animation: 'slideInUp 0.7s var(--ease-smooth) 0.4s both',
                fontWeight: 500
              }}>
                Transformamos tu visión en una <strong style={{ color: 'var(--white-pure)' }}>web que convierte</strong>. 
                Diseño premium con <span style={{ color: 'var(--green-bright)', fontWeight: 700 }}>resultados garantizados</span> desde <span style={{ color: 'var(--gold-bright)', fontWeight: 800 }}>€299</span>.
              </p>

              {/* CTAs */}
              <div style={{ 
                display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap',
                animation: 'slideInUp 0.7s var(--ease-smooth) 0.5s both'
              }}>
                <button onClick={() => scrollTo('#servicios')} className="btn btn-primary btn-lg">
                  🚀 Ver Servicios
                </button>
                <button onClick={() => scrollTo('#contacto')} className="btn btn-secondary btn-lg">
                  💬 Consulta Gratis
                </button>
              </div>

              {/* Features */}
              <div style={{ 
                display: 'flex', gap: '1.25rem', flexWrap: 'wrap',
                animation: 'fadeIn 0.7s var(--ease-smooth) 0.6s both'
              }}>
                {[
                  { icon: '📊', text: '+150 Proyectos', color: 'var(--accent-bright)' },
                  { icon: '🛡️', text: 'Garantía 100%', color: 'var(--green-bright)' },
                  { icon: '⚡', text: 'Soporte 24/7', color: 'var(--gold-bright)' },
                ].map((f, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.85rem', color: 'var(--white-pure)'
                  }}>
                    <span style={{ 
                      width: '34px', height: '34px', background: `${f.color}18`,
                      borderRadius: '10px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.05rem', 
                      border: `1px solid ${f.color}35`
                    }}>{f.icon}</span>
                    <span style={{ fontWeight: 700 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MOCKUP */}
            <div className="hero-visual" style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'slideInRight 0.8s var(--ease-smooth) 0.3s both'
            }}>
              <div className="gpu-accelerated" style={{
                width: '100%', maxWidth: '420px',
                animation: 'floatSlow 10s ease-in-out infinite',
                position: 'relative'
              }}>
                {/* Glow */}
                <div style={{
                  position: 'absolute', inset: '-15%',
                  background: 'radial-gradient(circle, rgba(91, 159, 255, 0.18) 0%, transparent 60%)',
                  filter: 'blur(40px)', animation: 'breathe 4s ease-in-out infinite'
                }} />
                
                {/* Browser Mockup */}
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(145deg, #1a2540, #0f1a2e)',
                  borderRadius: '16px', padding: '10px 10px 0',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(91, 159, 255, 0.12)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {/* Browser bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                    </div>
                    <div style={{
                      flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '6px',
                      padding: '6px 10px', fontSize: '0.68rem', color: 'var(--white-soft)',
                      display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600
                    }}>
                      <span style={{ color: 'var(--green-bright)' }}>🔒</span>
                      <span>interconectadosweb.es</span>
                    </div>
                  </div>
                  
                  {/* Image */}
                  <div style={{ borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                      alt="Preview"
                      loading="eager"
                      style={{ width: '100%', display: 'block', aspectRatio: '16/10', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* Badges flotantes */}
                <div className="hero-badges">
                  {/* Stats */}
                  <div className="gpu-accelerated" style={{
                    position: 'absolute', top: '-5%', left: '-12%',
                    animation: 'float 7s ease-in-out infinite'
                  }}>
                    <div className="glass hover-lift" style={{
                      padding: '0.7rem 1rem', borderRadius: '14px',
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.4)'
                    }}>
                      <div style={{
                        width: '38px', height: '38px',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
                        borderRadius: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.1rem'
                      }}>📈</div>
                      <div>
                        <div className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>+150</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--white-soft)', fontWeight: 600 }}>Proyectos</div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="gpu-accelerated" style={{
                    position: 'absolute', top: '8%', right: '-10%',
                    animation: 'floatReverse 8s ease-in-out infinite'
                  }}>
                    <div className="glass hover-lift" style={{
                      padding: '0.6rem 0.85rem', borderRadius: '12px',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.4)'
                    }}>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '0.2rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: 'var(--gold-bright)', fontSize: '0.95rem' }}>★</span>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--white-medium)', textAlign: 'center', fontWeight: 600 }}>98% Satisfacción</div>
                    </div>
                  </div>

                  {/* Conversión */}
                  <div className="gpu-accelerated" style={{
                    position: 'absolute', bottom: '5%', right: '-15%',
                    animation: 'float 9s ease-in-out infinite'
                  }}>
                    <div className="glass hover-lift" style={{
                      padding: '0.75rem 0.95rem', borderRadius: '12px',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.4)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--white-soft)', marginBottom: '0.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conversión</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-3-bright)', fontFamily: 'Space Grotesk' }}>+180%</div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--green-bright)', fontWeight: 700 }}>↑ vs promedio</div>
                    </div>
                  </div>

                  {/* Live */}
                  <div className="gpu-accelerated" style={{
                    position: 'absolute', bottom: '18%', left: '-10%',
                    animation: 'floatReverse 6s ease-in-out infinite'
                  }}>
                    <div className="glass hover-lift" style={{
                      padding: '0.55rem 0.95rem', borderRadius: '100px',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                    }}>
                      <span style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        background: 'var(--green-bright)', 
                        boxShadow: '0 0 14px var(--green)',
                        animation: 'pulse 1.5s ease infinite'
                      }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--green-bright)' }}>3 activos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator" style={{ 
            position: 'absolute', bottom: '1rem', left: '50%', 
            transform: 'translateX(-50%)', display: 'flex', 
            flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
            animation: 'fadeIn 1s var(--ease-smooth) 1.2s both'
          }}>
            <div style={{ 
              width: '24px', height: '38px', 
              border: '2px solid var(--border-hover)', borderRadius: '12px',
              display: 'flex', justifyContent: 'center', paddingTop: '8px'
            }}>
              <div style={{ 
                width: '4px', height: '8px', background: 'var(--accent-bright)',
                borderRadius: '2px', animation: 'scrollDown 1.5s ease-in-out infinite'
              }} />
            </div>
            <span style={{ fontSize: '0.62rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--white-muted)', fontWeight: 700 }}>Scroll</span>
          </div>
        </div>

        {/* Responsive */}
        <style>{`
          @media (max-width: 1024px) {
            #inicio { padding-top: 60px !important; }
            .hero-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
              text-align: center;
            }
            .hero-content { order: 2; }
            .hero-content h1 { font-size: clamp(1.6rem, 6vw, 2.2rem) !important; }
            .hero-content > div:nth-child(4) { justify-content: center; }
            .hero-content > div:nth-child(5) { justify-content: center; }
            .hero-visual { order: 1; }
            .hero-visual > div { max-width: 340px !important; }
            .hero-badges { display: none !important; }
            .scroll-indicator { display: none !important; }
          }
          @media (max-width: 600px) {
            #inicio { padding-top: 50px !important; }
            .hero-visual > div { max-width: 280px !important; }
            .hero-content h1 { font-size: clamp(1.4rem, 7vw, 1.8rem) !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════ ESENCIA ═══════════════ */}
      <section className="section" id="esencia">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💡 Nuestra Esencia</div>
            <h2 className="section-title"><span className="gradient-text">Resultados Reales</span>, No Promesas</h2>
            <p className="section-sub">El equipo que necesitas para <strong>dominar el mundo digital</strong>.</p>
          </div>

          <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
            {[
              { icon: '🎯', title: 'Misión', text: 'Convertimos tu visión en ventas reales. Construimos la máquina digital que impulsa tu negocio.', badge: 'Tu éxito = Nuestro éxito', color: 'var(--accent-bright)' },
              { icon: '🚀', title: 'Visión', text: 'Ser tu aliado digital definitivo. Webs que impresionan y generan resultados medibles.', badge: 'Impacto digital real', color: 'var(--accent-3-bright)' },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
                <div style={{ fontSize: '2.5rem', marginBottom: '0.85rem', animation: `float ${4 + i}s ease-in-out infinite` }}>{c.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.7rem', color: c.color }}>{c.title}</h3>
                <p style={{ color: 'var(--white-medium)', marginBottom: '1rem', fontSize: '0.92rem', lineHeight: 1.7, fontWeight: 500 }}>{c.text}</p>
                <span className="glass" style={{ padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, color: c.color }}>{c.badge}</span>
              </div>
            ))}
          </div>

          <h3 className="section-title" style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '1.35rem' }}>✨ <span className="gradient-text">Lo que nos define</span></h3>
          <div className="grid-4">
            {valores.map((v, i) => (
              <div key={i} className="card hover-lift" style={{ padding: '1.35rem', textAlign: 'center', animation: `fadeUp 0.4s var(--ease-smooth) ${i * 0.08}s both` }}>
                <div style={{ fontSize: '1.85rem', marginBottom: '0.6rem', animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>{v.icon}</div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.92rem', color: 'var(--white-pure)' }}>{v.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--white-soft)', lineHeight: 1.6, fontWeight: 500 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="section" ref={statsRef} style={{ background: 'linear-gradient(180deg, transparent, rgba(91, 159, 255, 0.05), transparent)', padding: '3rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-title">📈 <span className="gradient-text">Números que Hablan</span></h2>
          </div>
          <div className="grid-4">
            {stats.map((s, i) => (
              <div key={i} className="card hover-lift" style={{ padding: '1.35rem', textAlign: 'center', animation: statsVis ? `countUp 0.5s var(--ease-spring) ${i * 0.1}s both` : 'none' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div className="gradient-text" style={{ fontSize: '1.95rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>{s.number}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--white-soft)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICIOS ═══════════════ */}
      <section className="section" id="servicios">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💼 Servicios & Precios</div>
            <h2 className="section-title"><span className="gradient-text">Soluciones Premium</span></h2>
            <p className="section-sub"><strong>Precios claros.</strong> Sin sorpresas. Resultados garantizados.</p>
          </div>

          <div className="grid-3">
            {servicios.map((s, idx) => (
              <article key={s.id} className="card" style={{ 
                padding: 0, display: 'flex', flexDirection: 'column', position: 'relative', 
                border: s.popular ? `2px solid ${s.color}` : undefined, 
                animation: `fadeUp 0.4s var(--ease-smooth) ${idx * 0.08}s both`
              }}>
                <div style={{ 
                  background: `linear-gradient(135deg, ${s.color}20, transparent)`,
                  padding: '1.6rem', borderBottom: `1px solid ${s.color}35`
                }}>
                  {s.popular && (
                    <div style={{ 
                      position: 'absolute', top: '1rem', right: '1rem', 
                      background: s.color, color: 'white', padding: '0.32rem 0.75rem', 
                      borderRadius: '100px', fontSize: '0.68rem', fontWeight: 800, 
                      boxShadow: `0 0 22px ${s.color}55`, animation: 'pulse 2.5s ease infinite'
                    }}>⭐ POPULAR</div>
                  )}
                  
                  <div style={{ 
                    width: '52px', height: '52px',
                    background: `linear-gradient(135deg, ${s.color}, ${s.color}80)`,
                    borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '1.6rem', marginBottom: '1rem', boxShadow: `0 5px 18px ${s.color}45`
                  }}>{s.icon}</div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--white-pure)' }}>{s.name}</h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.95rem', color: 'var(--white-soft)', fontWeight: 600 }}>€</span>
                    <span className="gradient-text" style={{ fontSize: '2.35rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginLeft: '0.2rem' }}>{s.price}</span>
                    {s.suffix && <span style={{ fontSize: '0.82rem', color: 'var(--white-soft)', marginLeft: '0.3rem', fontWeight: 600 }}>{s.suffix}</span>}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--white-medium)', lineHeight: 1.6, fontWeight: 500 }}>{s.desc}</p>
                </div>

                <div style={{ padding: '1.6rem', flex: 1 }}>
                  <ul style={{ listStyle: 'none', marginBottom: '1.35rem' }}>
                    {s.features.slice(0, 5).map((f, j) => (
                      <li key={j} style={{ 
                        display: 'flex', alignItems: 'flex-start', gap: '0.65rem', 
                        padding: '0.6rem 0', borderBottom: j < 4 ? '1px solid var(--border)' : 'none',
                        fontSize: '0.85rem', color: 'var(--white-medium)'
                      }}>
                        <span style={{ 
                          width: '20px', height: '20px',
                          background: `linear-gradient(135deg, ${s.color}, ${s.color}80)`,
                          borderRadius: '50%', display: 'flex', alignItems: 'center', 
                          justifyContent: 'center', fontSize: '0.58rem', color: 'white', flexShrink: 0, fontWeight: 700
                        }}>✓</span>
                        <span style={{ lineHeight: 1.5, fontWeight: 500 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <button 
                      onClick={() => handleBuy(s.name, s.price, s.id)} 
                      disabled={loading === s.id} 
                      className="btn btn-primary btn-block" 
                      style={{ 
                        background: loading === s.id ? 'var(--bg-glass)' : `linear-gradient(135deg, ${s.color}, var(--accent-3))`,
                        boxShadow: `0 6px 22px ${s.color}45`, padding: '0.8rem'
                      }}
                    >
                      {loading === s.id ? (
                        <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Procesando...</>
                      ) : (<>🚀 Contratar</>)}
                    </button>
                    
                    <a 
                      href={`https://wa.me/${SEO_CONFIG.whatsapp}?text=${encodeURIComponent(`¡Hola! Me interesa "${s.name}"`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary btn-block"
                      style={{ fontSize: '0.88rem', padding: '0.65rem', textDecoration: 'none' }}
                    >💬 Consultar</a>
                  </div>

                  <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--white-muted)', marginTop: '0.8rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--green-bright)' }}>🔒</span> Pago seguro con Stripe
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INFO CARDS ═══════════════ */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--white-pure)' }}>📋 <span className="gradient-text">Todo Claro</span> desde el Minuto 1</h3>
            <p style={{ color: 'var(--white-soft)', fontSize: '0.92rem', fontWeight: 500 }}>Sin sorpresas. Sin costes ocultos.</p>
          </div>
          <div className="grid-3">
            {infoCards.map((c, i) => (
              <div key={i} className="card hover-lift" style={{ padding: '1.35rem', display: 'flex', gap: '0.8rem', alignItems: 'flex-start', animation: `fadeUp 0.35s var(--ease-smooth) ${i * 0.08}s both` }}>
                <div className="glass" style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '0.92rem', color: 'var(--white-pure)' }}>{c.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--white-soft)', lineHeight: 1.6, fontWeight: 500 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PORTFOLIO ═══════════════ */}
      <section className="section" id="portafolio">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🎨 Portafolio</div>
            <h2 className="section-title"><span className="gradient-text">Proyectos Destacados</span></h2>
            <p className="section-sub">Cada proyecto es una <strong>historia de éxito</strong>.</p>
          </div>

          <div className="grid-3">
            {projects.map((p, i) => (
              <article key={p.id} className="card interactive" style={{ cursor: 'pointer', animation: `fadeUp 0.4s var(--ease-smooth) ${i * 0.08}s both` }} onClick={() => setProject(p)}>
                <div style={{ height: '155px', overflow: 'hidden', position: 'relative' }}>
                  <img src={p.img} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease-smooth)' }} 
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} 
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg), transparent 50%)' }} />
                  <span className="glass" style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', padding: '0.28rem 0.55rem', borderRadius: '100px', fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent-2-bright)' }}>{p.enfoque.split(' ')[0]}</span>
                </div>
                <div style={{ padding: '1.35rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--accent-2-bright)' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--white-soft)', marginBottom: '0.75rem', lineHeight: 1.6, fontWeight: 500 }}>{p.descShort}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.28rem', marginBottom: '0.8rem' }}>
                    {p.tags.slice(0, 3).map(tag => (<span key={tag} className="glass" style={{ padding: '0.22rem 0.45rem', borderRadius: '6px', fontSize: '0.62rem', color: 'var(--accent-bright)', fontWeight: 600 }}>{tag}</span>))}
                  </div>
                  <button className="btn btn-secondary btn-sm btn-block">Ver Proyecto</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Proyecto */}
      {project && (
        <div onClick={e => e.target === e.currentTarget && setProject(null)} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,21,37,0.97)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: '1rem' }}>
          <div className="card project-modal" style={{ width: '100%', maxWidth: '920px', maxHeight: '88vh', overflow: 'auto', animation: 'modalIn 0.35s var(--ease-spring)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ background: 'var(--bg-dark)', padding: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={project.img} alt={project.title} style={{ width: '100%', borderRadius: '14px', boxShadow: '0 18px 45px rgba(0,0,0,0.45)' }} />
            </div>
            <div style={{ padding: '1.6rem', position: 'relative' }}>
              <button onClick={() => setProject(null)} className="glass interactive modal-close" style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', width: '34px', height: '34px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.95rem', fontWeight: 700 }}>✕</button>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--accent-2-bright)' }}>{project.title}</h2>
              <p style={{ color: 'var(--green-bright)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem' }}>🏷️ {project.enfoque}</p>
              <p style={{ color: 'var(--white-medium)', lineHeight: 1.75, marginBottom: '1rem', fontSize: '0.92rem', fontWeight: 500 }}>{project.desc}</p>
              <div className="glass" style={{ padding: '0.85rem', borderRadius: '12px', marginBottom: '1rem', borderLeft: '3px solid var(--accent-bright)' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.78rem', color: 'var(--accent-bright)' }}>⚡ Destacado técnico</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--white-medium)', fontWeight: 500 }}>{project.highlight}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.32rem', marginBottom: '1rem' }}>
                {project.tags.map(tag => (<span key={tag} className="glass" style={{ padding: '0.28rem 0.55rem', borderRadius: '100px', fontSize: '0.7rem', color: 'var(--accent-2-bright)', fontWeight: 600 }}>{tag}</span>))}
              </div>
              <div style={{ display: 'flex', gap: '0.55rem' }}>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>🚀 Ver en Vivo</a>
                <button onClick={() => { setProject(null); setTimeout(() => scrollTo('#contacto'), 100); }} className="btn btn-secondary btn-sm">💬 Quiero Similar</button>
              </div>
            </div>
          </div>
          <style>{`@media (max-width: 768px) { .project-modal { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      )}

      {/* ═══════════════ DIFERENCIADORES ═══════════════ */}
      <section className="section" id="diferenciadores">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🏆 Ventajas</div>
            <h2 className="section-title"><span className="gradient-text">¿Por qué elegirnos?</span></h2>
          </div>
          <div className="grid-3">
            {diferenciadores.map((d, i) => (
              <div key={i} className="card hover-lift" style={{ padding: '1.6rem', textAlign: 'center', animation: `fadeUp 0.4s var(--ease-smooth) ${i * 0.08}s both` }}>
                <div style={{ fontSize: '2.3rem', marginBottom: '0.8rem', animation: `float ${4 + i * 0.4}s ease-in-out infinite` }}>{d.icon}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.55rem', color: 'var(--white-pure)' }}>{d.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--white-soft)', lineHeight: 1.7, fontWeight: 500 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROCESO ═══════════════ */}
      <section className="section" id="metodologia" style={{ background: 'linear-gradient(180deg, transparent, rgba(183, 148, 246, 0.05), transparent)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⚙️ Metodología</div>
            <h2 className="section-title"><span className="gradient-text">Proceso Simple</span></h2>
            <p className="section-sub"><strong>5 pasos</strong> del concepto al lanzamiento.</p>
          </div>

          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {proceso.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.1rem', marginBottom: '1.35rem', animation: `fadeUp 0.4s var(--ease-smooth) ${i * 0.08}s both` }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="glass" style={{ width: '52px', height: '52px', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-bright)', boxShadow: '0 0 18px rgba(91, 159, 255, 0.25)' }}>
                    <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
                    <span style={{ fontSize: '0.52rem', fontWeight: 800, color: 'var(--accent-bright)' }}>{p.step}</span>
                  </div>
                  {i < proceso.length - 1 && <div style={{ width: '2px', flex: 1, minHeight: '22px', background: 'linear-gradient(to bottom, var(--accent-bright), transparent)', marginTop: '0.45rem' }} />}
                </div>
                <div className="card hover-lift" style={{ flex: 1, padding: '1.35rem' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '0.4rem', fontSize: '1rem', color: 'var(--white-pure)' }}>{p.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--white-soft)', lineHeight: 1.6, fontWeight: 500 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIOS ═══════════════ */}
      <section className="section" id="testimonios">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💬 Testimonios</div>
            <h2 className="section-title"><span className="gradient-text">Clientes Satisfechos</span></h2>
          </div>
        </div>
        <div style={{ overflow: 'hidden', padding: '0.8rem 0' }}>
          <div className="gpu-accelerated" style={{ display: 'flex', animation: 'carousel 42s linear infinite', width: 'max-content' }} 
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'} 
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}>
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} className="card" style={{ flex: '0 0 330px', margin: '0 0.55rem', padding: '1.6rem' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '0.8rem' }}>
                  {[...Array(r.rating)].map((_, j) => (<span key={j} style={{ color: 'var(--gold-bright)', fontSize: '0.9rem' }}>★</span>))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--white-medium)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.92rem', fontWeight: 500 }}>"{r.texto}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.88rem' }}>{r.iniciales}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--white-pure)' }}>{r.autor}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--white-soft)', fontWeight: 500 }}>{r.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section style={{ padding: '4.5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--accent), var(--accent-3))', opacity: 0.12 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(91, 159, 255, 0.2), transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.1rem' }}>
            {['🚀', '💎', '⚡'].map((e, i) => (<span key={i} style={{ fontSize: '2.1rem', margin: '0 0.4rem', display: 'inline-block', animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>{e}</span>))}
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--white-pure)' }}>¿Listo para <span className="gradient-text">Despegar</span>?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--white-medium)', marginBottom: '1.6rem', fontWeight: 500 }}><strong style={{ color: 'var(--white-pure)' }}>+150 empresas</strong> ya confían en nosotros.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
            <button onClick={() => scrollTo('#contacto')} className="btn btn-primary btn-lg">🚀 Empezar Ahora</button>
            <button onClick={() => scrollTo('#servicios')} className="btn btn-secondary btn-lg">💼 Ver Precios</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            {['✅ Consulta gratis', '💰 Sin ocultos', '🛡️ 30 días garantía'].map((f, i) => (
              <span key={i} className="glass" style={{ padding: '0.55rem 1.05rem', borderRadius: '100px', fontSize: '0.82rem', color: 'var(--white-pure)', fontWeight: 600 }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACTO ═══════════════ */}
      <section className="section" id="contacto">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📞 Contacto</div>
            <h2 className="section-title"><span className="gradient-text">Hablemos de tu Proyecto</span></h2>
            <p className="section-sub"><strong style={{ color: 'var(--green-bright)' }}>Respuesta en menos de 2 horas.</strong></p>
          </div>

          <div className="grid-2">
            <div className="card" style={{ padding: '1.6rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.35rem', color: 'var(--white-pure)' }}>🌟 Conecta con Nosotros</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { icon: '📧', label: 'Email', value: SEO_CONFIG.email, href: `mailto:${SEO_CONFIG.email}`, color: 'var(--accent-bright)' },
                  { icon: '💬', label: 'WhatsApp', value: 'Hablar con un Experto', href: `https://wa.me/${SEO_CONFIG.whatsapp}`, target: '_blank', color: '#25D366' },
                  { icon: '📍', label: 'Ubicación', value: SEO_CONFIG.address, color: 'var(--accent-3-bright)' },
                ].map((m, i) => (
                  <div key={i} onClick={() => m.href && (m.target ? window.open(m.href, '_blank') : (location.href = m.href))}
                    className="glass hover-lift" style={{ padding: '1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: m.href ? 'pointer' : 'default', borderLeft: `3px solid ${m.color}` }}>
                    <div style={{ width: '44px', height: '44px', background: `${m.color}18`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem' }}>{m.icon}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--white-pure)' }}>{m.label}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--white-soft)', fontWeight: 500 }}>{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '14px', borderLeft: '3px solid var(--green-bright)' }}>
                <p style={{ fontWeight: 700, color: 'var(--green-bright)', fontSize: '0.88rem' }}>⚡ Disponibilidad 24/7</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--white-soft)', marginTop: '0.25rem', fontWeight: 500 }}>Respuesta garantizada en menos de 2 horas</p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.6rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--white-pure)' }}>🎁 Consulta Gratuita</h3>
              <p style={{ color: 'var(--white-soft)', marginBottom: '1.35rem', fontSize: '0.85rem', fontWeight: 500 }}>Te responderemos por WhatsApp.</p>
              {sent && (
                <div className="glass" style={{ padding: '1rem', borderRadius: '14px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.65rem', borderLeft: '3px solid var(--green-bright)', animation: 'fadeIn 0.35s var(--ease-spring)' }}>
                  <span style={{ fontSize: '1.25rem' }}>✅</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--green-bright)', fontSize: '0.92rem' }}>¡Enviado!</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--white-soft)', fontWeight: 500 }}>Te contactaremos pronto.</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { name: 'nombre', placeholder: 'Tu nombre *', type: 'text', required: true },
                  { name: 'email', placeholder: 'Tu email *', type: 'email', required: true },
                  { name: 'telefono', placeholder: 'Teléfono (opcional)', type: 'tel' },
                ].map(f => (
                  <input key={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                    value={form[f.name as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--bg-glass)', color: 'var(--white-pure)', fontSize: '0.92rem', outline: 'none', transition: 'all 0.35s var(--ease-spring)', fontWeight: 600 }}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent-bright)'; e.target.style.boxShadow = '0 0 18px rgba(91, 159, 255, 0.18)'; }} 
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  />
                ))}
                <select value={form.servicio} onChange={e => setForm(p => ({ ...p, servicio: e.target.value }))}
                  style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--bg-glass)', color: form.servicio ? 'var(--white-pure)' : 'var(--white-muted)', fontSize: '0.92rem', outline: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  <option value="">¿Qué servicio necesitas?</option>
                  {servicios.map(s => (<option key={s.id} value={s.name}>{s.icon} {s.name} — €{s.price}</option>))}
                  <option value="Otro">Otro / Personalizado</option>
                </select>
                <textarea placeholder="Cuéntanos tu proyecto... *" rows={3} required value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                  style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--bg-glass)', color: 'var(--white-pure)', fontSize: '0.92rem', outline: 'none', resize: 'vertical', minHeight: '85px', transition: 'all 0.35s var(--ease-spring)', fontWeight: 600 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-bright)'; e.target.style.boxShadow = '0 0 18px rgba(91, 159, 255, 0.18)'; }} 
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.95rem' }}>🚀 Enviar Consulta</button>
                <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--white-muted)', fontWeight: 600 }}>🔒 Datos 100% seguros. Sin spam.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--border)', padding: '3.5rem 0 1.75rem' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.25rem', marginBottom: '2.25rem' }}>
            <div>
              <div style={{ marginBottom: '1rem' }}><Logo size="sm" /></div>
              <p style={{ fontSize: '0.85rem', color: 'var(--white-soft)', lineHeight: 1.7, marginBottom: '1rem', fontWeight: 500 }}>Agencia digital premium desde 2019.</p>
              <div style={{ display: 'flex', gap: '0.55rem' }}>
                {['instagram', 'twitter', 'linkedin', 'github'].map((s) => (
                  <a key={s} href="#" className="glass interactive" style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white-soft)' }}><SocialIcon type={s as any} /></a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-2-bright)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Servicios</h4>
              {servicios.slice(0, 5).map(s => (
                <a key={s.id} href="#servicios" onClick={e => { e.preventDefault(); scrollTo('#servicios'); }}
                  style={{ display: 'block', color: 'var(--white-soft)', fontSize: '0.85rem', marginBottom: '0.55rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.25s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--white-pure)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--white-soft)'}
                >{s.icon} {s.name}</a>
              ))}
            </div>

            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-2-bright)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Empresa</h4>
              {['Sobre Nosotros', 'Portfolio', 'Proceso', 'Testimonios', 'Contacto'].map((l, i) => (
                <a key={l} href={`#${['esencia', 'portafolio', 'metodologia', 'testimonios', 'contacto'][i]}`} onClick={e => { e.preventDefault(); scrollTo(`#${['esencia', 'portafolio', 'metodologia', 'testimonios', 'contacto'][i]}`); }}
                  style={{ display: 'block', color: 'var(--white-soft)', fontSize: '0.85rem', marginBottom: '0.55rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.25s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--white-pure)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--white-soft)'}
                >{l}</a>
              ))}
            </div>

            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-2-bright)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Legal</h4>
              {['Privacidad', 'Términos', 'Cookies'].map(l => (
                <a key={l} href="#" style={{ display: 'block', color: 'var(--white-soft)', fontSize: '0.85rem', marginBottom: '0.55rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.25s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--white-pure)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--white-soft)'}
                >{l}</a>
              ))}
              <div className="glass" style={{ marginTop: '0.8rem', padding: '0.65rem', borderRadius: '10px', fontSize: '0.72rem', color: 'var(--white-soft)', fontWeight: 600 }}>
                🛡️ RGPD & LSSI-CE
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { icon: '🔒', text: 'SSL', color: 'var(--green-bright)' },
                { icon: '✅', text: 'RGPD', color: 'var(--accent-bright)' },
                { icon: '💳', text: 'Stripe', color: 'var(--accent-3-bright)' },
              ].map((b, i) => (
                <span key={i} className="glass" style={{ padding: '0.5rem 0.95rem', borderRadius: '100px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.38rem', color: 'var(--white-pure)', fontWeight: 600 }}>
                  <span>{b.icon}</span>
                  <span style={{ color: b.color }}>{b.text}</span>
                </span>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--white-soft)', fontWeight: 500 }}>
              © {new Date().getFullYear()} <span style={{ color: 'var(--accent-2-bright)', fontWeight: 700 }}>InterConectadosWeb.es</span> — Todos los derechos reservados
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .footer-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1.75rem; } }
          @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr !important; text-align: center; } .footer-grid > div:first-child > div:last-child { justify-content: center; } }
        `}</style>
      </footer>
    </div>
  );
}

export default App;
