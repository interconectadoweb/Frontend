import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import { CartProvider } from './components/CartContext';
import CookieBanner from './components/CookieBanner';
import PaymentNotification from './components/PaymentNotification';
import Navbar from './components/Navbar';
import {
  SEO_CONFIG, projects, servicios, stats, reviews,
  valores, diferenciadores, proceso, infoCards,
} from './data/content';

// ============================================
// ESTILOS GLOBALES ULTRA PREMIUM
// ============================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --primary: #8B5CF6;
    --primary-light: #A78BFA;
    --primary-dark: #7C3AED;
    --accent: #00D4FF;
    --accent-2: #06FFA5;
    --neon-pink: #FF006E;
    --neon-blue: #3B82F6;
    --gold: #FFD700;
    --bg-primary: #0A0A0F;
    --bg-secondary: #12121A;
    --bg-tertiary: #1A1A25;
    --bg-card: rgba(18,18,26,0.7);
    --text-primary: #FFFFFF;
    --text-secondary: #A1A1AA;
    --text-muted: #71717A;
    --border-subtle: rgba(255,255,255,0.06);
    --border-light: rgba(255,255,255,0.12);
    --glow-primary: rgba(139,92,246,0.5);
    --glow-accent: rgba(0,212,255,0.5);
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
    line-height: 1.6;
  }

  ::selection { background: var(--primary); color: white; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-primary); }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--primary), var(--accent));
    border-radius: 10px;
  }

  /* ===== ANIMACIONES PREMIUM ===== */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
  }
  @keyframes floatReverse {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(15px) rotate(-2deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px var(--glow-primary), 0 0 40px transparent; }
    50% { box-shadow: 0 0 30px var(--glow-primary), 0 0 60px var(--glow-primary); }
  }
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(200%) skewX(-15deg); }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: rgba(139,92,246,0.3); }
    50% { border-color: rgba(139,92,246,0.6); }
  }
  @keyframes rotate {
    to { transform: rotate(360deg); }
  }
  @keyframes morphBlob {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes blink {
    50% { border-color: transparent; }
  }
  @keyframes slideInStagger {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes numberCount {
    from { opacity: 0; transform: translateY(10px) scale(0.8); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes glowLine {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes modalEntry {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes scrollHint {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(8px); opacity: 0.5; }
  }
  @keyframes textGradient {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  /* ===== UTILIDADES ===== */
  .text-gradient {
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--accent-2) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textGradient 4s linear infinite;
  }
  .text-gradient-static {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .text-glow {
    text-shadow: 0 0 30px var(--glow-primary), 0 0 60px rgba(139,92,246,0.3);
  }

  /* ===== LAYOUT ===== */
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 4vw, 3rem);
  }
  .section {
    padding: clamp(5rem, 12vh, 8rem) 0;
    position: relative;
  }

  /* ===== BOTONES PREMIUM ===== */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 14px;
    cursor: pointer;
    border: none;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: all 0.4s var(--ease-out-expo);
    isolation: isolate;
  }
  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%) skewX(-15deg);
    transition: transform 0.6s ease;
  }
  .btn:hover::before {
    transform: translateX(200%) skewX(-15deg);
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: 0 4px 20px var(--glow-primary), 0 0 0 1px rgba(139,92,246,0.2);
  }
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px var(--glow-primary), 0 0 0 1px rgba(139,92,246,0.4);
  }
  .btn-accent {
    background: linear-gradient(135deg, var(--accent) 0%, #00A8CC 100%);
    color: #0A0A0F;
    font-weight: 700;
    box-shadow: 0 4px 20px var(--glow-accent);
  }
  .btn-accent:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px var(--glow-accent);
  }
  .btn-outline {
    background: transparent;
    border: 2px solid var(--border-light);
    color: white;
    backdrop-filter: blur(10px);
  }
  .btn-outline:hover {
    border-color: var(--primary);
    background: rgba(139,92,246,0.1);
    box-shadow: 0 0 30px rgba(139,92,246,0.2);
  }
  .btn-whatsapp {
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    color: white;
    box-shadow: 0 4px 25px rgba(37,211,102,0.4);
  }
  .btn-whatsapp:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 40px rgba(37,211,102,0.5);
  }
  .btn-lg {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
    border-radius: 16px;
  }
  .btn-xl {
    padding: 1.4rem 3rem;
    font-size: 1.15rem;
    border-radius: 18px;
  }

  /* ===== CARDS ===== */
  .card-glass {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
    border-radius: 24px;
    transition: all 0.5s var(--ease-out-expo);
  }
  .card-glass:hover {
    border-color: rgba(139,92,246,0.3);
    box-shadow: 0 25px 80px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.1);
    transform: translateY(-8px);
  }

  /* ===== GRIDS ===== */
  .grid-services {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 2rem;
  }
  .grid-portfolio {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2.5rem;
  }
  .grid-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }
  .grid-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1024px) {
    .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
    .hero-content { align-items: center !important; }
    .hero-visual { margin-top: 3rem; }
  }
  @media (max-width: 768px) {
    .grid-services, .grid-portfolio { grid-template-columns: 1fr; }
    .btn-group { flex-direction: column; }
    .btn-group .btn { width: 100%; max-width: 360px; }
    .stats-inline { flex-direction: column; gap: 1.5rem !important; }
  }

  /* ===== PRELOADER ===== */
  .preloader {
    position: fixed;
    inset: 0;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    flex-direction: column;
    gap: 2rem;
  }
  .preloader-logo {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .preloader-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border-subtle);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: rotate 1s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
function AppInner() {
  const [appReady, setAppReady] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
  const [formSent, setFormSent] = useState(false);
  const [loadingService, setLoadingService] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const WHATSAPP_NUMBER = '573014367948';

  useLayoutEffect(() => {
    const el = document.createElement('style');
    el.id = 'premium-styles';
    el.textContent = globalStyles;
    document.head.prepend(el);
    document.body.style.overflow = 'hidden';
    return () => { document.getElementById('premium-styles')?.remove(); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
      document.body.style.overflow = '';
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    window.history.pushState({ modal: true }, '');
    const handlePop = () => setSelectedProject(null);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [selectedProject]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
  }, [selectedProject]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleContratar = async (serviceName: string, price: number, serviceId: string) => {
    if (loadingService) return;
    setLoadingService(serviceId);
    try {
      const baseURL = (import.meta.env.VITE_API_URL as string) || SEO_CONFIG.apiUrl;
      const res = await axios.post(`${baseURL}/api/stripe/create-checkout-session`, {
        serviceName,
        price,
        successUrl: `${window.location.origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/?payment=cancelled`,
      });
      if (res.data?.url) window.location.href = res.data.url;
      else throw new Error('No URL');
    } catch {
      const msg = `Hola! Quiero contratar "${serviceName}" (${price}€). ¿Me pueden ayudar?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    } finally {
      setLoadingService(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `¡Hola InterConectadosWeb! 👋%0A%0A*Servicio:* ${formData.servicio || 'Consulta general'}%0A*Nombre:* ${formData.nombre}%0A*Email:* ${formData.email}%0A*Teléfono:* ${formData.telefono || 'No indicado'}%0A%0A*Mensaje:* ${formData.mensaje}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setFormSent(true);
    setFormData({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
    setTimeout(() => setFormSent(false), 5000);
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // PRELOADER
  if (!appReady) {
    return (
      <div className="preloader">
        <div className="preloader-logo">InterConectadosWeb</div>
        <div className="preloader-spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Cargando experiencia...
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      <CookieBanner />
      <PaymentNotification />

      {/* ========== HERO SECTION PREMIUM ========== */}
      <section id="inicio" style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '100px',
        paddingBottom: '60px',
      }}>
        {/* Background Effects */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Gradient Mesh */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-20%',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 20s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-15%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatReverse 25s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(6,255,165,0.05) 0%, transparent 50%)',
            filter: 'blur(100px)',
          }} />
          {/* Grid Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }} />
          {/* Floating Orbs */}
          {[
            { size: 300, top: '10%', left: '5%', color: 'rgba(139,92,246,0.08)', delay: 0, duration: 15 },
            { size: 200, top: '60%', right: '10%', color: 'rgba(0,212,255,0.08)', delay: 2, duration: 18 },
            { size: 150, bottom: '20%', left: '15%', color: 'rgba(6,255,165,0.06)', delay: 4, duration: 20 },
            { size: 100, top: '30%', right: '25%', color: 'rgba(255,0,110,0.05)', delay: 1, duration: 12 },
          ].map((orb, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              right: orb.right,
              bottom: orb.bottom,
              background: orb.color,
              borderRadius: '50%',
              filter: 'blur(40px)',
              animation: `${i % 2 === 0 ? 'float' : 'floatReverse'} ${orb.duration}s ease-in-out infinite`,
              animationDelay: `${orb.delay}s`,
            }} />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}>
            {/* Left Content */}
            <div className="hero-content" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2rem',
            }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 20px',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '100px',
                animation: 'fadeInDown 0.8s var(--ease-out-expo)',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 10px #22C55E',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  🚀 +150 proyectos exitosos en 2024
                </span>
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.1s both',
              }}>
                <span style={{ display: 'block', color: 'white' }}>
                  Convertimos tu web en
                </span>
                <span className="text-gradient" style={{ display: 'block', marginTop: '0.2em' }}>
                  una máquina de ventas
                </span>
              </h1>

              {/* Subheadline */}
              <p style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: '540px',
                animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.2s both',
              }}>
                Diseñamos sitios web que <strong style={{ color: 'var(--accent)' }}>captan clientes 24/7</strong>, 
                aumentan tus ventas y posicionan tu marca. 
                <span style={{ color: 'white', fontWeight: 600 }}> Resultados garantizados desde €299.</span>
              </p>

              {/* Trust Indicators */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
                animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.3s both',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>⭐</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>4.9/5</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+120 reseñas</div>
                  </div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Garantía 30 días</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>o te devolvemos el dinero</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="btn-group" style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '0.5rem',
                animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.4s both',
              }}>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Quiero una consulta gratuita para mi proyecto web.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent btn-xl"
                >
                  <span>💬</span>
                  Consulta GRATIS
                </a>
                <button
                  onClick={() => scrollTo('#servicios')}
                  className="btn btn-outline btn-xl"
                >
                  Ver Precios
                  <span>→</span>
                </button>
              </div>

              {/* Quick Features */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                marginTop: '1rem',
                animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.5s both',
              }}>
                {['Entrega en 7-14 días', 'Soporte 24/7', 'Pago Seguro'].map((feature, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                  }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-2), #00A86B)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                    }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="hero-visual" style={{
              position: 'relative',
              animation: 'fadeInRight 1s var(--ease-out-expo) 0.3s both',
            }}>
              {/* Main Card */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(26,26,37,0.9), rgba(18,18,26,0.95))',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: '32px',
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.1)',
              }}>
                {/* Decorative Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--accent-2))',
                  backgroundSize: '200% auto',
                  animation: 'gradientFlow 3s linear infinite',
                }} />

                {/* Stats Display */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '1rem',
                  }}>
                    📊 Resultados de nuestros clientes
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                  }}>
                    {[
                      { value: '+340%', label: 'Más ventas online', icon: '📈' },
                      { value: '-60%', label: 'Costo de adquisición', icon: '💰' },
                      { value: '24/7', label: 'Captación de leads', icon: '🎯' },
                      { value: '3x', label: 'ROI promedio', icon: '🚀' },
                    ].map((stat, i) => (
                      <div key={i} style={{
                        padding: '1.25rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
                          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.transform = '';
                        }}
                      >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                        <div style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '1.8rem',
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>{stat.value}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Activity */}
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    animation: 'pulse 2s ease-in-out infinite',
                  }} />
                  <span style={{ fontSize: '0.9rem', color: '#22C55E', fontWeight: 500 }}>
                    🔥 3 proyectos iniciados esta semana
                  </span>
                </div>
              </div>

              {/* Floating Badge */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-10px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#0A0A0F',
                padding: '12px 20px',
                borderRadius: '100px',
                fontWeight: 800,
                fontSize: '0.85rem',
                boxShadow: '0 10px 30px rgba(255,215,0,0.3)',
                animation: 'float 6s ease-in-out infinite',
              }}>
                ⚡ OFERTA -20%
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.6,
          cursor: 'pointer',
        }}
          onClick={() => scrollTo('#esencia')}
        >
          <span style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Descubre más
          </span>
          <div style={{
            width: '24px',
            height: '40px',
            border: '2px solid var(--border-light)',
            borderRadius: '100px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '8px',
              background: 'var(--primary)',
              borderRadius: '100px',
              animation: 'scrollHint 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      {/* ========== SOCIAL PROOF BAR ========== */}
      <section style={{
        padding: '3rem 0',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite' }}>
          {[...Array(3)].map((_, setIndex) => (
            <div key={setIndex} style={{ display: 'flex', alignItems: 'center', gap: '4rem', paddingRight: '4rem' }}>
              {[
                { text: 'Empresas confían en nosotros', value: '+150' },
                { text: 'Satisfacción garantizada', value: '99%' },
                { text: 'Proyectos entregados', value: '+200' },
                { text: 'Años de experiencia', value: '+5' },
                { text: 'Respuesta en menos de', value: '2h' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', whiteSpace: 'nowrap' }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '2rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{item.value}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ========== ESENCIA SECTION ========== */}
      <section className="section" id="esencia" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary-light)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              ✨ Nuestra Filosofía
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              marginBottom: '1rem',
            }}>
              No hacemos webs. <span className="text-gradient-static">Creamos negocios.</span>
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: 1.8,
            }}>
              Cada línea de código tiene un propósito: generar más ingresos para tu negocio.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem',
          }}>
            {[
              {
                icon: '🎯',
                title: 'Misión',
                desc: 'Transformar cada visita en una oportunidad de venta. Tu web trabaja mientras tú duermes.',
                accent: 'var(--primary)',
                gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
              },
              {
                icon: '🚀',
                title: 'Visión',
                desc: 'Ser el partner digital que toda empresa necesita. Resultados medibles, no promesas vacías.',
                accent: 'var(--accent)',
                gradient: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))',
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: item.gradient,
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '28px',
                padding: '3rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.5s var(--ease-out-expo)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = `0 30px 80px rgba(0,0,0,0.3), 0 0 40px ${item.accent}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: item.accent,
                }} />
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  animation: 'float 8s ease-in-out infinite',
                }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>{item.title}</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Values Grid */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '3rem',
            }}>
              💎 Valores que nos definen
            </h3>
          </div>
          <div className="grid-features">
            {valores.map((v, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.4s var(--ease-out-expo)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{v.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.75rem' }}>{v.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ESTADÍSTICAS ========== */}
      <section className="section" ref={statsRef} style={{
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
            }}>
              📊 Números que <span className="text-gradient-static">hablan solos</span>
            </h2>
          </div>
          <div className="grid-stats">
            {stats.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                transition: 'all 0.4s var(--ease-out-expo)',
                animation: statsVisible ? `numberCount 0.6s var(--ease-out-expo) ${i * 0.1}s both` : 'none',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: '0.75rem',
                }}>{s.number}</div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SERVICIOS PREMIUM ========== */}
      <section className="section" id="servicios" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--accent)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              💼 Servicios & Precios
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              marginBottom: '1rem',
            }}>
              Soluciones que <span className="text-gradient-static">generan resultados</span>
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              margin: '0 auto',
            }}>
              Precios transparentes. Sin sorpresas. Garantía de satisfacción o devolución.
            </p>
          </div>

          <div className="grid-services">
            {servicios.map((s) => {
              const isLoading = loadingService === s.id;
              return (
                <article key={s.id} style={{
                  position: 'relative',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '28px',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  border: s.popular ? `2px solid ${s.color}` : '1px solid var(--border-subtle)',
                  transition: 'all 0.5s var(--ease-out-expo)',
                  overflow: 'hidden',
                  boxShadow: s.popular ? `0 0 50px ${s.glow}` : 'none',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-12px)';
                    e.currentTarget.style.boxShadow = `0 40px 100px rgba(0,0,0,0.4), 0 0 50px ${s.glow}`;
                    e.currentTarget.style.borderColor = s.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = s.popular ? `0 0 50px ${s.glow}` : 'none';
                    e.currentTarget.style.borderColor = s.popular ? s.color : 'var(--border-subtle)';
                  }}
                >
                  {/* Top Accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: s.color,
                    opacity: s.popular ? 1 : 0.5,
                  }} />

                  {/* Popular Badge */}
                  {s.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '-35px',
                      background: `linear-gradient(135deg, ${s.color}, #16a34a)`,
                      color: 'white',
                      padding: '8px 50px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      transform: 'rotate(45deg)',
                    }}>
                      ⭐ MÁS VENDIDO
                    </div>
                  )}

                  {/* Icon */}
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: `linear-gradient(135deg, ${s.glow}, rgba(255,255,255,0.05))`,
                    border: `1px solid ${s.color}40`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.2rem',
                    marginBottom: '1.75rem',
                  }}>{s.icon}</div>

                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '1rem',
                  }}>{s.name}</h3>

                  {/* Price */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px',
                    marginBottom: '1rem',
                  }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>€</span>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '3.5rem',
                      fontWeight: 900,
                      background: `linear-gradient(135deg, ${s.color}, var(--accent))`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1,
                    }}>{s.price}</span>
                    {s.suffix && <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{s.suffix}</span>}
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    marginBottom: '2rem',
                  }}>{s.desc}</p>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                    {s.features.map((f, j) => (
                      <li key={j} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.95rem',
                      }}>
                        <span style={{
                          width: '22px',
                          height: '22px',
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${s.color}, #22C55E)`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                        }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <button
                    onClick={() => handleContratar(s.name, s.price, s.id)}
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      marginBottom: '0.75rem',
                      background: isLoading ? 'rgba(139,92,246,0.3)' : `linear-gradient(135deg, ${s.color}, var(--primary-dark))`,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'rotate 1s linear infinite',
                        }} />
                        Procesando...
                      </>
                    ) : '💳 Comenzar Proyecto'}
                  </button>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`¡Hola! Me interesa el servicio "${s.name}" (€${s.price}). ¿Podemos hablar?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    💬 Hablar con Experto
                  </a>

                  <p style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    marginTop: '1rem',
                  }}>
                    🔒 Pago 100% seguro con Stripe
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== INFO CARDS ========== */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}>
              📋 Todo claro desde el minuto uno
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Sin sorpresas. Sin letra pequeña. Solo resultados.
            </p>
          </div>
          <div className="grid-features">
            {infoCards.map((c, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                transition: 'all 0.4s var(--ease-out-expo)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(0,212,255,0.1))',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                }}>{c.icon}</div>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{c.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PORTFOLIO ========== */}
      <section className="section" id="portafolio" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'rgba(6,255,165,0.1)',
              border: '1px solid rgba(6,255,165,0.3)',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--accent-2)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              🎨 Portafolio
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              marginBottom: '1rem',
            }}>
              Proyectos que <span className="text-gradient-static">generan ventas</span>
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Resultados reales de clientes reales. Cada proyecto cuenta una historia de éxito.
            </p>
          </div>

          <div className="grid-portfolio">
            {projects.map(p => (
              <article key={p.id} onClick={() => setSelectedProject(p)} style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.5s var(--ease-out-expo)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Image */}
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.7s var(--ease-out-expo)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(10,10,15,0.9))',
                  }} />
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(10,10,15,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '100px',
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {p.enfoque.split(' ')[0]}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: '0.5rem',
                  }}>{p.title}</h3>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(139,92,246,0.1)',
                    color: 'var(--primary-light)',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  }}>{p.enfoque}</span>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    marginBottom: '1.5rem',
                  }}>{p.descShort}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                    {p.tags.slice(0, 4).map(t => (
                      <span key={t} style={{
                        background: 'rgba(99,102,241,0.12)',
                        color: '#818CF8',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}>{t}</span>
                    ))}
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1))',
                    border: '1px solid rgba(0,212,255,0.2)',
                    color: 'var(--accent)',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.95rem',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent), var(--primary))';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1))';
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)';
                    }}
                  >
                    🔍 Ver Proyecto Completo
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div
          onClick={e => e.target === e.currentTarget && setSelectedProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            padding: '1rem',
          }}
        >
          <div style={{
            width: '100%',
            maxWidth: '1100px',
            maxHeight: '90vh',
            background: 'var(--bg-secondary)',
            borderRadius: '28px',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            animation: 'modalEntry 0.4s var(--ease-out-expo)',
          }}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '44px',
                height: '44px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                fontSize: '1.3rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 10,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = '';
              }}
            >✕</button>

            <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
              <img
                src={selectedProject.img}
                alt={selectedProject.title}
                style={{ width: '100%', height: '100%', maxHeight: '65vh', objectFit: 'cover', borderRadius: '16px' }}
              />
            </div>

            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem' }}>
                {selectedProject.title}
              </h2>
              <p style={{ color: 'var(--primary-light)', fontWeight: 600, marginBottom: '1.5rem' }}>
                🏷️ {selectedProject.enfoque}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                {selectedProject.desc}
              </p>
              <div style={{
                background: 'rgba(0,212,255,0.08)',
                borderLeft: '3px solid var(--accent)',
                padding: '1.25rem',
                borderRadius: '0 12px 12px 0',
                marginBottom: '2rem',
              }}>
                <p style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  ⚡ Destacado técnico
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  {selectedProject.highlight}
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                {selectedProject.tags.map(t => (
                  <span key={t} style={{
                    background: 'rgba(99,102,241,0.15)',
                    color: '#818CF8',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent"
                  style={{ flex: 1, textDecoration: 'none', minWidth: '150px' }}
                >
                  🚀 Ver en Vivo
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`¡Hola! Vi el proyecto "${selectedProject.title}" y quiero algo similar.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ flex: 1, textDecoration: 'none', minWidth: '150px' }}
                >
                  💬 Quiero uno similar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== DIFERENCIADORES ========== */}
      <section className="section" id="diferenciadores" style={{
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--gold)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              🏆 Por Qué Elegirnos
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
            }}>
              La diferencia de trabajar con <span className="text-gradient-static">profesionales</span>
            </h2>
          </div>

          <div className="grid-features">
            {diferenciadores.map((d, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                transition: 'all 0.5s var(--ease-out-expo)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(139,92,246,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  animation: `float ${6 + i * 0.5}s ease-in-out infinite`,
                }}>{d.icon}</div>
                <h4 style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>{d.title}</h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROCESO ========== */}
      <section className="section" id="metodologia" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary-light)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              ⚙️ Metodología
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              marginBottom: '1rem',
            }}>
              De la idea al <span className="text-gradient-static">lanzamiento en 5 pasos</span>
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Proceso claro, plazos cumplidos, comunicación constante.
            </p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {proceso.map((p, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '2.5rem',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(0,212,255,0.1))',
                    border: '2px solid var(--primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    boxShadow: '0 0 30px rgba(139,92,246,0.2)',
                  }}>
                    <span style={{ fontSize: '1.6rem' }}>{p.icon}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent)' }}>{p.step}</span>
                  </div>
                  {i < proceso.length - 1 && (
                    <div style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '40px',
                      background: 'linear-gradient(180deg, var(--primary), transparent)',
                      marginTop: '0.75rem',
                    }} />
                  )}
                </div>
                <div style={{
                  flex: 1,
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '2rem 2.5rem',
                  marginTop: '0.5rem',
                  transition: 'all 0.4s var(--ease-out-expo)',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateX(10px)';
                    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <h4 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                  }}>{p.title}</h4>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                  }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIOS ========== */}
      <section className="section" id="testimonios" style={{
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'rgba(255,0,110,0.1)',
              border: '1px solid rgba(255,0,110,0.3)',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--neon-pink)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              💬 Testimonios
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
            }}>
              Lo que dicen <span className="text-gradient-static">nuestros clientes</span>
            </h2>
          </div>

          {/* Featured Testimonial */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            minHeight: '350px',
          }}>
            <div style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '32px',
              padding: '3.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--accent-2))',
              }} />
              
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '2rem' }}>
                {[...Array(reviews[activeTestimonial].rating)].map((_, j) => (
                  <span key={j} style={{ color: '#FFD700', fontSize: '1.5rem' }}>★</span>
                ))}
              </div>
              
              <p style={{
                fontSize: '1.35rem',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '2.5rem',
              }}>
                "{reviews[activeTestimonial].texto}"
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                }}>
                  {reviews[activeTestimonial].iniciales}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                    {reviews[activeTestimonial].autor}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {reviews[activeTestimonial].cargo}
                  </p>
                </div>
              </div>

              {/* Dots */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '2.5rem',
              }}>
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    style={{
                      width: i === activeTestimonial ? '32px' : '10px',
                      height: '10px',
                      borderRadius: '100px',
                      background: i === activeTestimonial ? 'var(--primary)' : 'var(--border-light)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section style={{
        padding: '8rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}>
        {/* Decorative Elements */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '70%',
            height: '200%',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15), transparent 60%)',
            filter: 'blur(60px)',
            animation: 'float 20s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50%',
            right: '-20%',
            width: '60%',
            height: '200%',
            background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.1), transparent 60%)',
            filter: 'blur(80px)',
            animation: 'floatReverse 25s ease-in-out infinite',
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            {['🚀', '💎', '⚡'].map((e, i) => (
              <span key={i} style={{
                fontSize: '4rem',
                margin: '0 0.75rem',
                display: 'inline-block',
                animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
              }}>{e}</span>
            ))}
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            ¿Listo para <span className="text-gradient">multiplicar tus ventas</span>?
          </h2>

          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: 1.8,
          }}>
            +150 empresas ya confían en nosotros. Tu proyecto puede ser el próximo caso de éxito.
            <strong style={{ color: 'var(--accent)' }}> Consulta gratuita sin compromiso.</strong>
          </p>

          <div className="btn-group" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Quiero empezar mi proyecto web. ¿Podemos hablar?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-xl"
              style={{ boxShadow: '0 10px 40px var(--glow-accent)' }}
            >
              💬 ¡Empezar Ahora!
            </a>
            <button
              onClick={() => scrollTo('#servicios')}
              className="btn btn-outline btn-xl"
            >
              Ver Precios →
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {['✅ Consulta gratis', '💰 Sin costes ocultos', '🛡️ Garantía 30 días'].map((f, i) => (
              <span key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '100px',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTACTO ========== */}
      <section className="section" id="contacto" style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#22C55E',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              📞 Contacto
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              marginBottom: '1rem',
            }}>
              Hablemos de tu <span className="text-gradient-static">próximo proyecto</span>
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Respuesta garantizada en menos de 2 horas. Sin compromiso.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            maxWidth: '1100px',
            margin: '0 auto',
          }}>
            {/* Contact Info */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,255,0.05))',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '28px',
              padding: '3rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              }} />

              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                fontFamily: 'Space Grotesk, sans-serif',
              }} className="text-gradient-static">
                Conecta con nosotros
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                Elige tu canal preferido. Estamos listos.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  {
                    icon: '📧',
                    label: 'Email',
                    value: SEO_CONFIG.email,
                    href: `mailto:${SEO_CONFIG.email}`,
                    gradient: 'linear-gradient(135deg, var(--primary), var(--neon-pink))',
                  },
                  {
                    icon: '💬',
                    label: 'WhatsApp',
                    value: '+57 301 436 7948',
                    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Necesito información sobre sus servicios.')}`,
                    target: '_blank',
                    gradient: 'linear-gradient(135deg, #25D366, #128C7E)',
                  },
                  {
                    icon: '📍',
                    label: 'Ubicación',
                    value: SEO_CONFIG.address,
                    gradient: 'linear-gradient(135deg, var(--accent), var(--neon-blue))',
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    onClick={m.href ? () => m.target ? window.open(m.href, '_blank') : (window.location.href = m.href) : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      padding: '1.25rem 1.5rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      cursor: m.href ? 'pointer' : 'default',
                      transition: 'all 0.4s var(--ease-out-expo)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                      e.currentTarget.style.transform = 'translateX(10px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = '';
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: m.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      flexShrink: 0,
                    }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>{m.label}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{m.value}</p>
                    </div>
                    {m.href && <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>→</span>}
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '2.5rem',
                padding: '1.5rem',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: '16px',
              }}>
                <p style={{ fontWeight: 700, color: '#22C55E', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  🕐 Horario de Respuesta
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  24/7 disponibles<br />
                  Respuesta en <strong style={{ color: 'white' }}>menos de 2 horas</strong>
                </p>
              </div>
            </div>

            {/* Form */}
            <div style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '28px',
              padding: '3rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--accent-2))',
              }} />

              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                fontFamily: 'Space Grotesk, sans-serif',
              }} className="text-gradient-static">
                🎁 Consulta Gratuita
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
                Cuéntanos tu idea. Te respondemos por WhatsApp.
              </p>

              {formSent && (
                <div style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <span style={{ fontSize: '1.75rem' }}>✅</span>
                  <div>
                    <p style={{ fontWeight: 700, color: '#22C55E', marginBottom: '0.25rem' }}>¡Mensaje enviado!</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Te contactaremos pronto.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { name: 'nombre', placeholder: '👤 Tu nombre', type: 'text', required: true },
                  { name: 'email', placeholder: '📧 Tu email', type: 'email', required: true },
                  { name: 'telefono', placeholder: '📱 Tu teléfono (opcional)', type: 'tel', required: false },
                ].map(field => (
                  <input
                    key={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={e => setFormData(p => ({ ...p, [field.name]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '1.15rem 1.5rem',
                      borderRadius: '14px',
                      border: '2px solid var(--border-subtle)',
                      background: 'rgba(255,255,255,0.02)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Outfit, sans-serif',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border-subtle)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ))}

                <select
                  value={formData.servicio}
                  onChange={e => setFormData(p => ({ ...p, servicio: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.5rem',
                    borderRadius: '14px',
                    border: '2px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.02)',
                    color: formData.servicio ? 'white' : 'var(--text-muted)',
                    fontSize: '1rem',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Outfit, sans-serif',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-subtle)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="" style={{ background: 'var(--bg-secondary)' }}>🎯 ¿Qué servicio necesitas?</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.name} style={{ background: 'var(--bg-secondary)' }}>
                      {s.icon} {s.name} — €{s.price}
                    </option>
                  ))}
                  <option value="Otro" style={{ background: 'var(--bg-secondary)' }}>💡 Otro / Personalizado</option>
                </select>

                <textarea
                  placeholder="✍️ Cuéntanos tu idea..."
                  rows={4}
                  required
                  value={formData.mensaje}
                  onChange={e => setFormData(p => ({ ...p, mensaje: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.5rem',
                    borderRadius: '14px',
                    border: '2px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.02)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '120px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-subtle)';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }}>
                  🚀 Enviar Consulta Gratis
                </button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                  🔒 Tus datos están 100% protegidos. Sin spam.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHATSAPP FLOTANTE ========== */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Necesito información sobre sus servicios web.')}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 99990,
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: '0 8px 40px rgba(37,211,102,0.5)',
          transition: 'all 0.4s var(--ease-out-expo)',
          textDecoration: 'none',
          animation: 'pulseGlow 3s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.15) rotate(-10deg)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 50px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = '';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 40px rgba(37,211,102,0.5)';
        }}
      >
        💬
        <span style={{
          position: 'absolute',
          top: '-3px',
          right: '-3px',
          width: '22px',
          height: '22px',
          background: '#22C55E',
          borderRadius: '50%',
          border: '3px solid var(--bg-primary)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </a>

      {/* ========== FOOTER ========== */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '5rem 0 2rem',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3.5rem',
            marginBottom: '4rem',
          }}>
            {/* Logo */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                }}>I</div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  InterConectados<span style={{ color: 'var(--primary)' }}>Web</span>
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: '280px' }}>
                Agencia digital premium. Transformamos ideas en negocios digitales exitosos.
              </p>
            </div>

            {/* Servicios */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Servicios
              </h4>
              {servicios.map(s => (
                <a key={s.id} href="#servicios" onClick={e => { e.preventDefault(); scrollTo('#servicios'); }}
                  style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {s.icon} {s.name}
                </a>
              ))}
            </div>

            {/* Empresa */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Empresa
              </h4>
              {['Portfolio', 'Proceso', 'Testimonios', 'Contacto'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={e => { e.preventDefault(); scrollTo(`#${l.toLowerCase()}`); }}
                  style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Legal
              </h4>
              {['Política de Privacidad', 'Términos', 'Cookies'].map(l => (
                <a key={l} href="#"
                  style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {l}
                </a>
              ))}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(139,92,246,0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(139,92,246,0.15)',
              }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  🛡️ RGPD & LSSI-CE
                </p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} InterConectadosWeb · Todos los derechos reservados
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['🔒 SSL', '✅ RGPD', '💳 Stripe'].map((b, i) => (
                <span key={i} style={{
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '100px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// EXPORT
// ============================================
export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}