import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import { CartProvider, useCart } from './components/CartContext';
import Cart from './components/Cart';
import CookieBanner from './components/CookieBanner';
import PaymentNotification from './components/PaymentNotification';
import Navbar from './components/Navbar';
import {
  SEO_CONFIG, projects, servicios, stats, reviews,
  valores, diferenciadores, proceso, infoCards,
} from './data/content';

// ============================================
// ESTILOS GLOBALES PREMIUM
// ============================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --purple: #a855f7;
    --cyan: #06b6d4;
    --green: #22c55e;
    --pink: #ec4899;
    --blue: #3b82f6;
    --orange: #f97316;
    --amber: #f59e0b;
    --bg: #030014;
    --bg2: #0f0a1f;
    --card: rgba(15,10,31,0.85);
    --txt: #ffffff;
    --txt2: #94a3b8;
    --ease: cubic-bezier(0.4,0,0.2,1);
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg);
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--txt);
    overflow-x: hidden;
  }

  ::selection { background: var(--purple); color: white; }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--purple), var(--cyan));
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--cyan), var(--purple));
  }

  /* ---- ANIMACIONES ---- */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatAnim {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-14px); }
  }
  @keyframes pulseSoft {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes gradShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes spinAnim { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  @keyframes carouselScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes confettiFall {
    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes scrollDot {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(28px); opacity: 0; }
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.93) translateY(16px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.25); }
    50% { box-shadow: 0 0 45px rgba(168,85,247,0.5); }
  }
  @keyframes rotateSlow {
    to { transform: rotate(360deg); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }

  /* ---- UTILIDADES ---- */
  .grad-text {
    background: linear-gradient(135deg, var(--purple), var(--cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grad-text-tri {
    background: linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #22c55e 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradShift 6s ease infinite;
  }
  .section-tag {
    display: inline-block;
    padding: 0.45rem 1.25rem;
    background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,182,212,0.15));
    border: 1px solid rgba(168,85,247,0.3);
    border-radius: 100px;
    font-size: 0.78rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2px;
    color: var(--purple); margin-bottom: 1.25rem;
  }
  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.9rem, 4.5vw, 3rem);
    font-weight: 800; line-height: 1.15;
    margin-bottom: 1rem;
  }
  .section-sub {
    font-size: clamp(0.95rem, 1.8vw, 1.1rem);
    color: var(--txt2); max-width: 680px;
    margin: 0 auto; line-height: 1.75;
  }
  .container { max-width: 1380px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2; }
  .section { padding: 5rem 0; position: relative; overflow: hidden; }
  .section-dark {
    background: linear-gradient(180deg, var(--bg) 0%, #0a0520 50%, var(--bg) 100%);
  }
  .section-header { text-align: center; margin-bottom: 3.5rem; }

  /* ---- BOTONES ---- */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 0.5rem; padding: 0.95rem 2rem;
    font-size: 0.95rem; font-weight: 700;
    border-radius: 100px; cursor: pointer; border: none;
    text-decoration: none; position: relative; overflow: hidden;
    transition: all 0.3s var(--ease);
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  }
  .btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transform: translateX(-100%); transition: transform 0.5s ease;
  }
  .btn:hover::before { transform: translateX(100%); }
  .btn-primary {
    background: linear-gradient(135deg, var(--purple), var(--blue));
    color: white;
    box-shadow: 0 5px 22px rgba(168,85,247,0.35);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(168,85,247,0.45); }
  .btn-secondary {
    background: rgba(255,255,255,0.05);
    border: 2px solid rgba(255,255,255,0.18);
    color: white; backdrop-filter: blur(10px);
  }
  .btn-secondary:hover { border-color: var(--cyan); background: rgba(6,182,212,0.1); }
  .btn-lg { padding: 1.1rem 2.5rem; font-size: 1rem; }
  .btn-block { width: 100%; }
  .btn-green {
    background: linear-gradient(135deg, #25D366, #128C7E);
    color: white; box-shadow: 0 5px 22px rgba(37,211,102,0.3);
  }

  /* ---- GRID LAYOUTS ---- */
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem; max-width: 1320px; margin: 0 auto;
  }
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem; max-width: 1380px; margin: 0 auto;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.5rem;
  }
  .valores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  .esencia-grid {
    display: grid; grid-template-columns: repeat(2,1fr);
    gap: 2rem; margin-bottom: 4rem;
  }
  .dif-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
    gap: 2rem;
  }
  .info-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr));
    gap: 1.5rem; max-width: 1200px; margin: 0 auto;
  }
  .contact-grid {
    display: grid; grid-template-columns: 1fr 1.3fr;
    gap: 3rem; align-items: start;
  }

  /* ---- RESPONSIVE ---- */
  @media (max-width: 900px) {
    .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
    .esencia-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .section { padding: 4rem 0; }
    .pricing-grid { grid-template-columns: 1fr; }
    .portfolio-grid { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .dif-grid { grid-template-columns: 1fr; }
    .container { padding: 0 1.25rem; }
    .btn-hero-row { flex-direction: column; align-items: center; }
    .btn-hero-row .btn { width: 100%; max-width: 320px; }
  }
  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
  }

  /* ---- PRELOADER ---- */
  .preloader {
    position: fixed; inset: 0; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    z-index: 999999; flex-direction: column; gap: 1.5rem;
  }
  .preloader-ring {
    width: 60px; height: 60px;
    border: 4px solid rgba(168,85,247,0.15);
    border-top-color: var(--purple);
    border-radius: 50%;
    animation: spinAnim 0.9s linear infinite;
  }

  /* ---- CARDS ---- */
  .card-glass {
    background: var(--card);
    backdrop-filter: blur(22px);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 1.75rem;
    transition: all 0.4s var(--ease);
  }
  .card-glass:hover {
    border-color: rgba(168,85,247,0.3);
    box-shadow: 0 25px 60px rgba(0,0,0,0.4);
    transform: translateY(-8px);
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
// COMPONENTE INNER (usa CartContext)
// ============================================
function AppInner() {
  const [appReady, setAppReady] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
  const [formSent, setFormSent] = useState(false);
  const [loadingService, setLoadingService] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const { addItem } = useCart();

  // Inyectar estilos
  useLayoutEffect(() => {
    const el = document.createElement('style');
    el.id = 'app-styles';
    el.textContent = globalStyles;
    document.head.prepend(el);
    document.body.style.overflow = 'hidden';
    return () => { document.getElementById('app-styles')?.remove(); };
  }, []);

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
      document.body.style.overflow = '';
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Observer stats
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Modal handlers
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

  // Contratar con Stripe
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
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else throw new Error('No URL');
    } catch {
      // Fallback WhatsApp
      const msg = `Hola, quiero contratar "${serviceName}" por ${price}€. ¿Podéis ayudarme?`;
      window.open(`https://wa.me/${SEO_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    } finally {
      setLoadingService(null);
    }
  };

  // Formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola InterConectadosWeb! 👋%0A%0A*Servicio de interés:* ${formData.servicio || 'General'}%0A*Nombre:* ${formData.nombre}%0A*Email:* ${formData.email}%0A*Teléfono:* ${formData.telefono || 'No indicado'}%0A%0A*Mensaje:* ${formData.mensaje}%0A%0AEsperando vuestra respuesta. ¡Gracias!`;
    window.open(`https://wa.me/${SEO_CONFIG.whatsapp}?text=${text}`, '_blank');
    setFormSent(true);
    setFormData({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
    setTimeout(() => setFormSent(false), 5000);
  };

  // PRELOADER
  if (!appReady) {
    return (
      <div className="preloader">
        <div style={{
          fontSize: '2rem', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif',
          background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '0.5rem',
        }}>
          InterConectadosWeb
        </div>
        <div className="preloader-ring" />
        <p style={{ color: '#64748b', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Preparando tu experiencia...
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', animation: 'fadeUp 0.5s ease' }}>
      <Navbar />
      <Cart />
      <CookieBanner />
      <PaymentNotification />

      {/* ======= HERO ======= */}
      <section id="inicio" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative', overflow: 'hidden',
        padding: '7rem 2rem 5rem',
      }}>
        {/* BG */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }} />
          {/* Radials */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168,85,247,0.18), transparent),
              radial-gradient(ellipse 60% 40% at 80% 70%, rgba(6,182,212,0.1), transparent),
              radial-gradient(ellipse 50% 40% at 10% 60%, rgba(59,130,246,0.08), transparent)
            `,
            animation: 'pulseSoft 10s ease-in-out infinite',
          }} />
          {/* Floating orbs */}
          {[
            { size: 400, x: '70%', y: '20%', color: 'rgba(168,85,247,0.06)', delay: '0s' },
            { size: 300, x: '10%', y: '60%', color: 'rgba(6,182,212,0.06)', delay: '2s' },
            { size: 200, x: '50%', y: '80%', color: 'rgba(34,197,94,0.05)', delay: '4s' },
          ].map((orb, i) => (
            <div key={i} style={{
              position: 'absolute', width: orb.size, height: orb.size,
              left: orb.x, top: orb.y, transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${orb.color}, transparent)`,
              borderRadius: '50%', filter: 'blur(40px)',
              animation: `floatAnim ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: orb.delay,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '980px', width: '100%' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.55rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(6,182,212,0.12))',
            border: '1px solid rgba(168,85,247,0.28)', borderRadius: '100px',
            fontSize: '0.82rem', fontWeight: 600, color: 'white',
            marginBottom: '2rem', backdropFilter: 'blur(10px)',
            animation: 'fadeUp 0.7s ease 0.1s both',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
              animation: 'shimmer 3s ease-in-out infinite',
            }} />
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 10px #22c55e', animation: 'pulseSoft 2s ease infinite', flexShrink: 0,
            }} />
            🇪🇸 Agencia Digital Premium — España & Latinoamérica
          </div>

          {/* Título */}
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2.6rem, 7.5vw, 5rem)',
            fontWeight: 900, lineHeight: 1.07,
            marginBottom: '1.5rem',
            animation: 'fadeUp 0.7s ease 0.2s both',
          }}>
            <span style={{ display: 'block', color: 'white', marginBottom: '0.2rem' }}>
              Tu web profesional
            </span>
            <span className="grad-text-tri">lista para vender</span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
            color: 'var(--txt2)', maxWidth: '660px', margin: '0 auto 2.5rem',
            lineHeight: 1.75, animation: 'fadeUp 0.7s ease 0.3s both',
          }}>
            Diseñamos sitios web que{' '}
            <strong style={{ color: 'var(--cyan)', fontWeight: 700 }}>convierten visitantes en clientes</strong>.
            Resultados garantizados desde{' '}
            <strong style={{ color: 'var(--purple)', fontWeight: 700 }}>€299</strong>. Sin sorpresas. Sin letra pequeña.
          </p>

          {/* CTAs */}
          <div className="btn-hero-row" style={{
            display: 'flex', justifyContent: 'center', gap: '1rem',
            flexWrap: 'wrap', marginBottom: '3rem',
            animation: 'fadeUp 0.7s ease 0.4s both',
          }}>
            <a href="#servicios" onClick={e => { e.preventDefault(); document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn btn-primary btn-lg">
              🚀 Ver Servicios y Precios
            </a>
            <a href="#contacto" onClick={e => { e.preventDefault(); document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn btn-secondary btn-lg">
              💬 Consulta Gratis
            </a>
          </div>

          {/* Feature pills */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '0.75rem',
            flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.5s both',
          }}>
            {['✅ +100 proyectos entregados', '🛡️ Garantía 30 días', '⚡ Soporte 24/7', '💳 Pago seguro Stripe'].map((f, i) => (
              <span key={i} style={{
                padding: '0.45rem 1rem', borderRadius: '100px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.85rem', color: 'var(--txt2)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(168,85,247,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'var(--txt2)';
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          opacity: 0.45, animation: 'fadeUp 1s ease 0.8s both',
        }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--txt2), transparent)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10px', background: 'var(--cyan)', animation: 'scrollDot 1.6s ease-in-out infinite' }} />
          </div>
          <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--txt2)' }}>Scroll</span>
        </div>
      </section>

      {/* ======= ESENCIA ======= */}
      <section className="section section-dark" id="esencia">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💡 Nuestra Esencia</div>
            <h2 className="section-title">Resultados, <span className="grad-text">no promesas</span></h2>
            <p className="section-sub">Somos el equipo que necesitas para dominar el mundo digital con estrategia real.</p>
          </div>

          <div className="esencia-grid">
            {[
              { icon: '🎯', title: 'Misión', text: 'Convertimos tu visión en ventas reales. Mientras tú haces crecer tu negocio, nosotros construimos la máquina digital que lo impulsa hacia el siguiente nivel.', badge: 'Tu éxito = Nuestro éxito', badgeClass: 'purple' },
              { icon: '🚀', title: 'Visión', text: 'Ser tu aliado digital definitivo. Creamos webs que no solo impresionan visualmente, sino que generan resultados medibles y consistentes cada día.', badge: 'Impacto digital real', badgeClass: 'cyan' },
            ].map((c, i) => (
              <div key={i} style={{
                background: 'var(--card)', backdropFilter: 'blur(22px)',
                padding: '2.5rem', borderRadius: '2rem', textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.4s var(--ease)', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: i === 0 ? 'linear-gradient(90deg, var(--purple), var(--pink))' : 'linear-gradient(90deg, var(--cyan), var(--blue))' }} />
                <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem', display: 'block', animation: `floatAnim ${5 + i}s ease-in-out infinite` }}>{c.icon}</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'Space Grotesk, sans-serif' }} className="grad-text">{c.title}</h3>
                <p style={{ color: 'var(--txt2)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '1rem' }}>{c.text}</p>
                <span style={{
                  display: 'inline-block', padding: '0.45rem 1.2rem', borderRadius: '100px',
                  background: i === 0 ? 'rgba(168,85,247,0.12)' : 'rgba(6,182,212,0.12)',
                  color: i === 0 ? 'var(--purple)' : 'var(--cyan)',
                  border: `1px solid ${i === 0 ? 'rgba(168,85,247,0.3)' : 'rgba(6,182,212,0.3)'}`,
                  fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  {c.badge}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h3 className="section-title" style={{ fontSize: '1.9rem' }}>💎 Lo que nos define</h3>
          </div>
          <div className="valores-grid">
            {valores.map((v, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.025)', padding: '1.75rem', borderRadius: '1.25rem',
                border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center',
                transition: 'all 0.3s var(--ease)', cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)';
                  e.currentTarget.style.background = 'rgba(168,85,247,0.07)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{v.title}</h4>
                <p style={{ color: 'var(--txt2)', fontSize: '0.85rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= ESTADÍSTICAS ======= */}
      <section className="section" ref={statsRef} style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(168,85,247,0.03) 50%, transparent 100%)',
        borderTop: '1px solid rgba(168,85,247,0.08)',
        borderBottom: '1px solid rgba(168,85,247,0.08)',
      }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">📈 <span className="grad-text">Números reales</span>, no marketing</h2>
          </div>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '2rem 1rem', borderRadius: '1.5rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.3s var(--ease)',
                animation: statsVisible ? `countUp 0.5s ease ${i * 0.08}s both` : 'none',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                  e.currentTarget.style.background = 'rgba(168,85,247,0.05)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <div style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900,
                  fontFamily: 'Space Grotesk, sans-serif',
                  background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', marginBottom: '0.4rem',
                }}>
                  {s.number}
                </div>
                <div style={{ color: 'var(--txt2)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SERVICIOS / PRICING ======= */}
      <section className="section section-dark" id="servicios">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💼 Servicios & Precios</div>
            <h2 className="section-title">Soluciones que <span className="grad-text">funcionan</span></h2>
            <p className="section-sub">Precios claros. Sin letra pequeña. Resultados garantizados desde el día 1.</p>
          </div>

          <div className="pricing-grid">
            {servicios.map((s) => {
              const isLoading = loadingService === s.id;
              return (
                <article
                  key={s.id}
                  style={{
                    position: 'relative', background: 'var(--card)',
                    backdropFilter: 'blur(22px)', borderRadius: '2rem',
                    padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
                    border: s.popular ? `2px solid ${s.color}` : '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.4s var(--ease)', overflow: 'hidden',
                    boxShadow: s.popular ? `0 0 40px ${s.glow}` : 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = `0 30px 70px rgba(0,0,0,0.4), 0 0 40px ${s.glow}`;
                    e.currentTarget.style.borderColor = s.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = s.popular ? `0 0 40px ${s.glow}` : 'none';
                    e.currentTarget.style.borderColor = s.popular ? s.color : 'rgba(255,255,255,0.05)';
                  }}
                >
                  {/* Top line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: s.color, filter: `blur(1px)`, opacity: s.popular ? 1 : 0.5 }} />

                  {/* Popular ribbon */}
                  {s.popular && (
                    <div style={{
                      position: 'absolute', top: '18px', right: '-38px',
                      background: `linear-gradient(135deg, ${s.color}, #16a34a)`,
                      color: 'white', padding: '0.35rem 3rem',
                      fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '2px', transform: 'rotate(45deg)',
                      boxShadow: `0 4px 20px ${s.glow}`, zIndex: 5,
                    }}>
                      {s.badge || '★ TOP'}
                    </div>
                  )}

                  {/* Icono */}
                  <div style={{
                    width: '68px', height: '68px',
                    background: `linear-gradient(135deg, ${s.glow}, rgba(255,255,255,0.05))`,
                    border: `1px solid ${s.color}30`,
                    borderRadius: '1.25rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem',
                    transition: 'all 0.3s var(--ease)',
                  }}>
                    {s.icon}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>
                    {s.name}
                  </h3>

                  {/* Precio */}
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--txt2)', marginRight: '2px' }}>€</span>
                    <span style={{
                      fontSize: 'clamp(2.5rem, 4vw, 3.2rem)', fontWeight: 900,
                      fontFamily: 'Space Grotesk, sans-serif',
                      background: `linear-gradient(135deg, ${s.color}, var(--cyan))`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text', lineHeight: 1,
                    }}>
                      {s.price}
                    </span>
                    {s.suffix && <span style={{ color: 'var(--txt2)', marginLeft: '4px', fontSize: '0.95rem' }}>{s.suffix}</span>}
                  </div>

                  <p style={{ color: 'var(--txt2)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                    {s.desc}
                  </p>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                    {s.features.map((f, j) => (
                      <li key={j} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '0.88rem', transition: 'all 0.2s ease',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.paddingLeft = '0.5rem')}
                        onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
                      >
                        <span style={{
                          width: '20px', height: '20px', flexShrink: 0,
                          background: `linear-gradient(135deg, ${s.color}, #16a34a)`,
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '0.65rem',
                        }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Botones */}
                  <button
                    onClick={() => handleContratar(s.name, s.price, s.id)}
                    disabled={isLoading}
                    className="btn btn-primary btn-block"
                    style={{
                      background: isLoading ? 'rgba(168,85,247,0.3)' : `linear-gradient(135deg, ${s.color}, var(--blue))`,
                      opacity: isLoading ? 0.8 : 1, marginBottom: '0.75rem',
                    }}
                  >
                    {isLoading ? (
                      <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spinAnim 0.8s linear infinite' }} />Procesando...</>
                    ) : '💳 Contratar con Stripe'}
                  </button>

                  <button
                    onClick={() => addItem(s)}
                    className="btn btn-secondary btn-block"
                    style={{ fontSize: '0.85rem', padding: '0.75rem' }}
                  >
                    🛒 Añadir al carrito
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--txt2)', fontSize: '0.75rem' }}>
                    🔒 Pago 100% seguro con Stripe
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======= INFO CARDS ======= */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>📋 Todo claro desde el primer minuto</h3>
            <p style={{ color: 'var(--txt2)', fontSize: '0.95rem' }}>Sin sorpresas. Sin costes ocultos. Solo resultados.</p>
          </div>
          <div className="info-grid">
            {infoCards.map((c, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem',
                padding: '1.6rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
                transition: 'all 0.3s var(--ease)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(168,85,247,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = '';
                }}
              >
                <div style={{
                  width: '50px', height: '50px', flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,182,212,0.15))',
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem',
                }}>
                  {c.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.95rem' }}>{c.title}</h4>
                  <p style={{ color: 'var(--txt2)', fontSize: '0.83rem', lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= PORTFOLIO ======= */}
      <section className="section" id="portafolio">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🎨 Portfolio</div>
            <h2 className="section-title">
              Proyectos que <span className="grad-text">generan resultados</span>
            </h2>
            <p className="section-sub">Cada proyecto es una historia de éxito. Haz clic para explorar.</p>
          </div>
          <div className="portfolio-grid">
            {projects.map(p => (
              <article
                key={p.id}
                onClick={() => setSelectedProject(p)}
                style={{
                  background: 'var(--card)', backdropFilter: 'blur(22px)',
                  border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem',
                  overflow: 'hidden', cursor: 'pointer',
                  transition: 'all 0.4s var(--ease)', display: 'flex', flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Imagen */}
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative', background: '#0a0a0a' }}>
                  <img
                    src={p.img} alt={`${p.title} - proyecto web desarrollado por InterConectadosWeb`}
                    loading="lazy" width="900" height="600"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s var(--ease)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(3,0,20,0.7))',
                  }} />
                  {/* Category badge */}
                  <span style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    background: 'rgba(3,0,20,0.75)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(6,182,212,0.3)', borderRadius: '100px',
                    padding: '0.3rem 0.8rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--cyan)',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>
                    {p.enfoque.split(' ')[0]}
                  </span>
                </div>

                {/* Contenido */}
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cyan)', marginBottom: '0.5rem' }}>
                    {p.title}
                  </h3>
                  <span style={{
                    display: 'inline-block', background: 'rgba(168,85,247,0.1)',
                    color: 'var(--purple)', padding: '0.3rem 0.8rem', borderRadius: '100px',
                    fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.9rem',
                    border: '1px solid rgba(168,85,247,0.25)', alignSelf: 'flex-start',
                  }}>
                    {p.enfoque}
                  </span>
                  <p style={{ color: 'var(--txt2)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.25rem', flex: 1 }}>
                    {p.descShort}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {p.tags.map(t => (
                      <span key={t} style={{
                        background: 'rgba(99,102,241,0.12)', color: '#818cf8',
                        padding: '0.2rem 0.65rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 500,
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <button style={{
                    width: '100%', padding: '0.8rem',
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1))',
                    border: '1px solid rgba(6,182,212,0.25)', color: 'var(--cyan)',
                    borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.3s var(--ease)',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, var(--cyan), var(--purple))';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1))';
                      e.currentTarget.style.color = 'var(--cyan)';
                      e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)';
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

      {/* Modal */}
      {selectedProject && (
        <div
          onClick={e => e.target === e.currentTarget && setSelectedProject(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 100000, padding: '1rem',
          }}
        >
          <style>{`
            .modal-inner {
              display: grid;
              grid-template-columns: 1.5fr 1fr;
            }
            .modal-img-panel { min-height: 350px; }
            @media (max-width: 860px) {
              .modal-inner {
                grid-template-columns: 1fr !important;
                grid-template-rows: 240px auto !important;
                overflow-y: auto !important;
              }
              .modal-img-panel { min-height: 240px; max-height: 240px; }
            }
          `}</style>
          <div className="modal-inner" style={{
            width: '100%', maxWidth: '1180px', maxHeight: '90vh',
            background: '#0b0f19', borderRadius: '1.75rem',
            border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
            position: 'relative',
            animation: 'modalIn 0.35s var(--ease)',
          }}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                width: '40px', height: '40px', background: 'rgba(15,42,74,0.9)',
                border: 'none', borderRadius: '50%', color: 'white',
                fontSize: '1.2rem', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--purple)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(15,42,74,0.9)';
                e.currentTarget.style.transform = '';
              }}
              aria-label="Cerrar"
            >✕</button>

            <div className="modal-img-panel" style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
              <img src={selectedProject.img} alt={selectedProject.title}
                style={{ width: '100%', height: '100%', maxHeight: '65vh', objectFit: 'cover', borderRadius: '0.75rem' }} />
            </div>

            <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginBottom: '0.6rem' }}>
                {selectedProject.title}
              </h2>
              <p style={{ color: 'var(--purple)', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                🏷️ {selectedProject.enfoque}
              </p>
              <p style={{ color: '#d1d5db', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                {selectedProject.desc}
              </p>
              <div style={{
                background: 'rgba(6,182,212,0.06)', borderLeft: '3px solid var(--cyan)',
                padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem',
              }}>
                <p style={{ color: 'var(--cyan)', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.85rem' }}>⚡ Destacado técnico</p>
                <p style={{ color: '#e5e7eb', fontSize: '0.88rem', lineHeight: 1.65 }}>{selectedProject.highlight}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {selectedProject.tags.map(t => (
                  <span key={t} style={{
                    background: 'rgba(99,102,241,0.18)', color: '#818cf8',
                    padding: '0.3rem 0.75rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                <a
                  href={selectedProject.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 1, display: 'block', textAlign: 'center',
                    background: 'linear-gradient(90deg, var(--cyan), #00a2ff)',
                    color: '#000', padding: '1rem', borderRadius: '0.75rem',
                    textDecoration: 'none', fontWeight: 800, fontSize: '0.88rem',
                    textTransform: 'uppercase', letterSpacing: '1px',
                    transition: 'all 0.3s ease', minWidth: '160px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(6,182,212,0.35)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  🚀 Ver en Vivo →
                </a>
                <a
                  href="#contacto"
                  onClick={e => { e.preventDefault(); setSelectedProject(null); setTimeout(() => document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                  style={{
                    display: 'block', textAlign: 'center',
                    background: 'rgba(168,85,247,0.15)',
                    border: '1px solid rgba(168,85,247,0.35)',
                    color: 'var(--purple)', padding: '1rem 1.5rem', borderRadius: '0.75rem',
                    textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.15)'; }}
                >
                  💬 Quiero Algo Similar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======= DIFERENCIADORES ======= */}
      <section className="section section-dark" id="diferenciadores">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🏆 Ventajas</div>
            <h2 className="section-title">¿Por qué elegir <span className="grad-text">InterConectadosWeb</span>?</h2>
          </div>
          <div className="dif-grid">
            {diferenciadores.map((d, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '2.5rem 2rem',
                background: 'var(--card)', backdropFilter: 'blur(22px)',
                borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.4s var(--ease)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.borderColor = 'var(--purple)';
                  e.currentTarget.style.boxShadow = '0 25px 65px rgba(168,85,247,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem', display: 'block', animation: `floatAnim ${5 + i * 0.5}s ease-in-out infinite` }}>{d.icon}</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.9rem', fontFamily: 'Space Grotesk, sans-serif' }}>{d.title}</h4>
                <p style={{ color: 'var(--txt2)', fontSize: '0.92rem', lineHeight: 1.7 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= PROCESO ======= */}
      <section className="section" id="metodologia">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⚙️ Metodología</div>
            <h2 className="section-title">Proceso <span className="grad-text">simple y efectivo</span></h2>
            <p className="section-sub">5 pasos claros para llevar tu proyecto del concepto al lanzamiento.</p>
          </div>

          {/* Timeline — Layout mobile simplificado */}
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            {proceso.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                {/* Marcador vertical */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: '64px', height: '64px',
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.1))',
                    border: '2px solid var(--purple)',
                    borderRadius: '50%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', zIndex: 10,
                    transition: 'all 0.3s ease', flexShrink: 0,
                    boxShadow: '0 0 20px rgba(168,85,247,0.2)',
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{p.icon}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '0.5px' }}>{p.step}</span>
                  </div>
                  {i < proceso.length - 1 && (
                    <div style={{ width: '2px', flex: 1, minHeight: '30px', background: 'linear-gradient(180deg, var(--purple), transparent)', marginTop: '0.5rem' }} />
                  )}
                </div>
                {/* Tarjeta */}
                <div style={{
                  flex: 1, padding: '1.75rem 2rem',
                  background: 'var(--card)', backdropFilter: 'blur(22px)',
                  borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s var(--ease)', marginTop: '0.5rem',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>{p.title}</h4>
                  <p style={{ color: 'var(--txt2)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TESTIMONIOS ======= */}
      <section className="section section-dark" id="testimonios">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💬 Testimonios</div>
            <h2 className="section-title"><span className="grad-text">Clientes reales</span>, resultados reales</h2>
            <p className="section-sub">Lo que dicen quienes ya confían en nosotros.</p>
          </div>
        </div>

        <div style={{ overflow: 'hidden', padding: '1rem 0 2rem' }}>
          <div style={{
            display: 'flex', animation: 'carouselScroll 45s linear infinite',
            willChange: 'transform',
          }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
          >
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} style={{
                flex: '0 0 400px', margin: '0 1rem',
                background: 'var(--card)', backdropFilter: 'blur(22px)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2rem',
                padding: '2.5rem', transition: 'all 0.3s var(--ease)',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1.25rem' }}>
                  {[...Array(r.rating)].map((_, j) => (
                    <span key={j} style={{ color: '#fbbf24', fontSize: '1.1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--txt2)', lineHeight: 1.75, marginBottom: '1.75rem', fontSize: '0.95rem' }}>
                  "{r.texto}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1rem', color: 'white',
                  }}>
                    {r.iniciales}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.95rem' }}>{r.autor}</p>
                    <p style={{ color: 'var(--txt2)', fontSize: '0.82rem' }}>{r.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA FESTIVO ======= */}
      <section style={{
        padding: '5rem 2rem', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        backgroundSize: '400% 400%', animation: 'gradShift 15s ease infinite',
      }}>
        {/* Shapes */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[
            { w: 400, h: 400, x: '-100px', y: '-200px', d: '0s' },
            { w: 300, h: 300, x: 'auto', y: 'auto', d: '2s' },
          ].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', width: s.w, height: s.h,
              left: i === 0 ? s.x : 'auto', right: i === 1 ? '-50px' : 'auto',
              top: i === 0 ? s.y : 'auto', bottom: i === 1 ? '-150px' : 'auto',
              background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(40px)',
              animation: `floatAnim ${10 - i * 2}s ease-in-out infinite ${s.d}`,
            }} />
          ))}
          {/* Confetti */}
          {['#f472b6', '#a78bfa', '#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#60a5fa'].map((c, i) => (
            <div key={i} style={{
              position: 'absolute', width: '8px', height: '12px', borderRadius: '3px',
              background: c, left: `${10 + i * 10}%`, top: '-20px',
              animation: `confettiFall 6s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            {['🚀', '💎', '🎯'].map((e, i) => (
              <span key={i} style={{ fontSize: '3rem', margin: '0 0.5rem', display: 'inline-block', animation: `floatAnim ${3 + i * 0.4}s ease-in-out infinite` }}>{e}</span>
            ))}
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
            color: 'white', marginBottom: '1.25rem', lineHeight: 1.15,
            textShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}>
            🎉 ¿Listo para despegar? Tu momento es AHORA 🎉
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'rgba(255,255,255,0.95)',
            marginBottom: '2.5rem', lineHeight: 1.75,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
            🌟 +150 empresas ya confían en nosotros. ¡Tu proyecto puede ser el próximo éxito! 🌟
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a href="#contacto"
              onClick={e => { e.preventDefault(); document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn btn-lg"
              style={{ background: 'white', color: '#764ba2', fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.02)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              🚀 ¡Empezar Mi Proyecto Ya!
            </a>
            <a href="#servicios"
              onClick={e => { e.preventDefault(); document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn btn-lg"
              style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.75)', color: 'white' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'white'; el.style.color = '#764ba2'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'white'; }}
            >
              💼 Ver Todos los Precios
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {['✅ Consulta gratis', '💰 Sin costes ocultos', '🛡️ 30 días garantía'].map((f, i) => (
              <span key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                background: 'rgba(255,255,255,0.14)', padding: '0.65rem 1.4rem',
                borderRadius: '100px', color: 'rgba(255,255,255,0.95)',
                fontSize: '0.9rem', fontWeight: 600, backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CONTACTO ======= */}
      <section className="section" id="contacto" style={{
        background: 'linear-gradient(180deg, var(--bg) 0%, #0a0520 100%)', position: 'relative',
      }}>
        {/* Top border */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, var(--purple), var(--cyan), var(--green), var(--pink))',
          backgroundSize: '300% 100%', animation: 'gradShift 5s ease infinite',
        }} />

        <div className="container">
          <div className="section-header">
            <div className="section-tag">📞 Contacto</div>
            <h2 className="section-title">Hablemos de tu <span className="grad-text">próximo proyecto</span></h2>
            <p className="section-sub">Respuesta garantizada en menos de 2 horas. Sin compromiso.</p>
          </div>

          <div className="contact-grid">
            {/* Info */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(6,182,212,0.06))',
              border: '1px solid rgba(168,85,247,0.18)', borderRadius: '2rem', padding: '2.5rem',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--purple), var(--cyan))' }} />

              <h3 style={{
                fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif',
              }} className="grad-text">
                Conecta con nosotros
              </h3>
              <p style={{ color: 'var(--txt2)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Elige tu canal preferido. Estamos listos para ayudarte.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  {
                    icon: '📧', label: 'Email Directo', value: SEO_CONFIG.email,
                    href: `mailto:${SEO_CONFIG.email}`, cls: 'email',
                    color: 'rgba(168,85,247,0.3)', hoverBg: 'rgba(168,85,247,0.1)',
                    iconBg: 'linear-gradient(135deg, var(--purple), var(--pink))',
                  },
                  {
                    icon: '💬', label: 'WhatsApp', value: '+57 301 436 7948',
                    href: `https://wa.me/${SEO_CONFIG.whatsapp}?text=Hola!%20Quiero%20información%20sobre%20vuestros%20servicios`,
                    cls: 'wa', color: 'rgba(34,197,94,0.3)', hoverBg: 'rgba(34,197,94,0.1)',
                    iconBg: 'linear-gradient(135deg, #25D366, #128C7E)', target: '_blank',
                  },
                  {
                    icon: '📍', label: 'Ubicación', value: SEO_CONFIG.address,
                    href: undefined, cls: 'loc',
                    color: 'rgba(6,182,212,0.3)', hoverBg: 'rgba(6,182,212,0.1)',
                    iconBg: 'linear-gradient(135deg, var(--cyan), var(--blue))',
                  },
                ].map((m, i) => (
                  <div key={i}
                    onClick={m.href ? () => { if (m.target) window.open(m.href, '_blank'); else window.location.href = m.href!; } : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1.2rem 1.4rem',
                      background: 'rgba(255,255,255,0.025)',
                      border: `1px solid ${m.color}`,
                      borderRadius: '1rem', cursor: m.href ? 'pointer' : 'default',
                      transition: 'all 0.3s var(--ease)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = m.hoverBg;
                      e.currentTarget.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                      e.currentTarget.style.transform = '';
                    }}
                  >
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '12px',
                      background: m.iconBg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                    }}>
                      {m.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.95rem', color: 'white' }}>{m.label}</p>
                      <p style={{ color: 'var(--txt2)', fontSize: '0.85rem' }}>{m.value}</p>
                    </div>
                    {m.href && <span style={{ color: 'var(--txt2)', opacity: 0.5, fontSize: '1.1rem' }}>→</span>}
                  </div>
                ))}
              </div>

              {/* Horario */}
              <div style={{
                marginTop: '2rem', padding: '1.25rem',
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)', borderRadius: '1rem',
              }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--green)', marginBottom: '0.4rem' }}>
                  🕐 Horario de Respuesta
                </p>
                <p style={{ color: 'var(--txt2)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Lunes – Domingo: 24/7<br />
                  Respuesta garantizada en <strong style={{ color: 'white' }}>menos de 2 horas</strong>
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div style={{
              background: 'var(--card)', backdropFilter: 'blur(22px)',
              padding: '2.5rem', borderRadius: '2rem',
              border: '1px solid rgba(255,255,255,0.05)', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--purple), var(--cyan), var(--green))' }} />

              <h3 style={{
                fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif',
              }} className="grad-text">
                🎁 Consulta Gratuita
              </h3>
              <p style={{ color: 'var(--txt2)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Cuéntanos tu idea. Te responderemos por WhatsApp en instantes.
              </p>

              {formSent && (
                <div style={{
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  animation: 'fadeUp 0.3s ease',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--green)', marginBottom: '0.2rem' }}>¡Mensaje enviado!</p>
                    <p style={{ color: 'var(--txt2)', fontSize: '0.85rem' }}>Te contactaremos por WhatsApp en breve.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[
                  { name: 'nombre', placeholder: '👤 Tu nombre completo', type: 'text', required: true },
                  { name: 'email', placeholder: '📧 Tu email profesional', type: 'email', required: true },
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
                      width: '100%', padding: '1rem 1.25rem', borderRadius: '0.9rem',
                      border: '2px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)', color: 'white',
                      fontSize: '0.92rem', outline: 'none',
                      transition: 'all 0.3s var(--ease)', fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--purple)';
                      e.target.style.background = 'rgba(168,85,247,0.05)';
                      e.target.style.boxShadow = '0 0 0 4px rgba(168,85,247,0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.target.style.background = 'rgba(255,255,255,0.03)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ))}

                <select
                  value={formData.servicio}
                  onChange={e => setFormData(p => ({ ...p, servicio: e.target.value }))}
                  style={{
                    width: '100%', padding: '1rem 1.25rem', borderRadius: '0.9rem',
                    border: '2px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: formData.servicio ? 'white' : '#64748b',
                    fontSize: '0.92rem', outline: 'none', cursor: 'pointer',
                    transition: 'all 0.3s var(--ease)', fontFamily: 'Inter, sans-serif',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.4rem',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--purple)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(168,85,247,0.1)';
                  }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                >
                  <option value="" style={{ background: '#0f0a1f' }}>🎯 ¿Qué servicio necesitas?</option>
                  {servicios.map(s => (
                    <option key={s.id} value={s.name} style={{ background: '#0f0a1f' }}>
                      {s.icon} {s.name} — desde €{s.price}
                    </option>
                  ))}
                  <option value="Otro proyecto" style={{ background: '#0f0a1f' }}>💡 Otro / Proyecto personalizado</option>
                </select>

                <textarea
                  placeholder="✍️ Cuéntanos tu idea, objetivos y cualquier detalle relevante..."
                  rows={4} required
                  value={formData.mensaje}
                  onChange={e => setFormData(p => ({ ...p, mensaje: e.target.value }))}
                  style={{
                    width: '100%', padding: '1rem 1.25rem', borderRadius: '0.9rem',
                    border: '2px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: 'white',
                    fontSize: '0.92rem', outline: 'none', resize: 'vertical', minHeight: '110px',
                    transition: 'all 0.3s var(--ease)', fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--purple)';
                    e.target.style.background = 'rgba(168,85,247,0.05)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(168,85,247,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.target.style.background = 'rgba(255,255,255,0.03)';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                <button type="submit" className="btn btn-primary btn-lg btn-block"
                  style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>
                  🚀 Enviar Consulta Gratis
                </button>

                <p style={{ textAlign: 'center', color: 'var(--txt2)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  🔒 Tus datos están 100% seguros. Sin spam. Sin venta a terceros.<br />
                  Al enviar aceptas nuestra política de privacidad.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ======= WHATSAPP FLOTANTE ======= */}
      <a
        href={`https://wa.me/${SEO_CONFIG.whatsapp}?text=Hola%20InterConectadosWeb!%20Quiero%20información%20sobre%20vuestros%20servicios%20web.`}
        target="_blank" rel="noopener noreferrer"
        title="Escríbenos por WhatsApp"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 99990,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.75rem', boxShadow: '0 6px 30px rgba(37,211,102,0.45)',
          transition: 'all 0.3s ease', textDecoration: 'none',
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.12) rotate(-5deg)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 40px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = '';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 30px rgba(37,211,102,0.45)';
        }}
      >
        💬
        <span style={{
          position: 'absolute', top: '-4px', right: '-4px',
          width: '20px', height: '20px', background: 'var(--green)',
          borderRadius: '50%', border: '2px solid var(--bg)',
          animation: 'pulseSoft 2s ease-in-out infinite',
        }} />
      </a>

      {/* ======= FOOTER ======= */}
      <footer style={{
        background: '#030014', borderTop: '1px solid rgba(168,85,247,0.1)',
        padding: '4rem 2rem 2rem',
      }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            {/* Logo & desc */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '38px', height: '38px', background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.1rem', color: 'white',
                }}>I</div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>
                  InterConectados<span style={{ color: 'var(--purple)' }}>Web</span>
                </span>
              </div>
              <p style={{ color: 'var(--txt2)', fontSize: '0.85rem', lineHeight: 1.75, maxWidth: '260px' }}>
                Agencia digital premium en España. Transformamos ideas en negocios digitales exitosos desde 2019.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                {['📧', '💬', '📱'].map((icon, i) => (
                  <div key={i} style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1rem',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.2)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Servicios */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'white', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Servicios
              </h4>
              {servicios.map(s => (
                <a key={s.id} href="#servicios"
                  onClick={e => { e.preventDefault(); document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' }); }}
                  style={{ display: 'block', color: 'var(--txt2)', fontSize: '0.85rem', marginBottom: '0.6rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt2)')}
                >
                  {s.icon} {s.name}
                </a>
              ))}
            </div>

            {/* Empresa */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'white', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Empresa
              </h4>
              {['Sobre Nosotros', 'Portfolio', 'Proceso', 'Testimonios', 'Blog'].map(l => (
                <a key={l} href="#" style={{ display: 'block', color: 'var(--txt2)', fontSize: '0.85rem', marginBottom: '0.6rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt2)')}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'white', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Legal
              </h4>
              {['Política de Privacidad', 'Términos y Condiciones', 'Política de Cookies', 'Aviso Legal'].map(l => (
                <a key={l} href="#" style={{ display: 'block', color: 'var(--txt2)', fontSize: '0.85rem', marginBottom: '0.6rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt2)')}
                >
                  {l}
                </a>
              ))}
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(168,85,247,0.06)', borderRadius: '0.75rem', border: '1px solid rgba(168,85,247,0.15)' }}>
                <p style={{ color: 'var(--txt2)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  🛡️ Cumplimos con RGPD y LSSI-CE.<br />
                  Datos protegidos en servidores europeos.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '1rem',
          }}>
            <p style={{ color: 'var(--txt2)', fontSize: '0.82rem' }}>
              © {new Date().getFullYear()} InterConectadosWeb · Todos los derechos reservados · España
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {['🔒 SSL', '✅ RGPD', '💳 Stripe'].map((b, i) => (
                <span key={i} style={{
                  padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '100px',
                  fontSize: '0.72rem', color: 'var(--txt2)',
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
// EXPORT con Provider
// ============================================
export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
