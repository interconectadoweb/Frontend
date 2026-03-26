import { useState, useEffect, useLayoutEffect, useRef, createContext, useContext } from 'react';
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
// SISTEMA DE INTERNACIONALIZACIÓN COMPLETO
// ============================================
type Language = 'es' | 'en' | 'pt' | 'fr';

const translations: Record<string, Record<Language, string>> = {
  // HERO
  hero_badge: {
    es: '🇪🇸 Agencia Digital Premium — España & Latinoamérica',
    en: '🇺🇸 Premium Digital Agency — Spain & Latin America',
    pt: '🇧🇷 Agência Digital Premium — Espanha & América Latina',
    fr: '🇫🇷 Agence Digitale Premium — Espagne & Amérique Latine',
  },
  hero_title_1: { es: 'Creamos', en: 'We Create', pt: 'Criamos', fr: 'Nous Créons' },
  hero_title_2: { es: 'Experiencias', en: 'Digital', pt: 'Experiências', fr: 'Expériences' },
  hero_title_3: { es: 'Digitales', en: 'Experiences', pt: 'Digitais', fr: 'Numériques' },
  hero_subtitle: {
    es: 'Transformamos tu visión en una web que convierte visitantes en clientes. Diseño premium, resultados garantizados desde €299.',
    en: 'We transform your vision into a website that converts visitors into customers. Premium design, guaranteed results from €299.',
    pt: 'Transformamos sua visão em um site que converte visitantes em clientes. Design premium, resultados garantidos a partir de €299.',
    fr: 'Nous transformons votre vision en un site web qui convertit. Design premium, résultats garantis à partir de 299€.',
  },
  cta_services: { es: 'Ver Servicios', en: 'View Services', pt: 'Ver Serviços', fr: 'Voir Services' },
  cta_contact: { es: 'Contactar', en: 'Contact', pt: 'Contatar', fr: 'Contacter' },
  feature_1: { es: '+150 Proyectos', en: '+150 Projects', pt: '+150 Projetos', fr: '+150 Projets' },
  feature_2: { es: 'Garantía 100%', en: '100% Guarantee', pt: 'Garantia 100%', fr: 'Garantie 100%' },
  feature_3: { es: 'Soporte 24/7', en: '24/7 Support', pt: 'Suporte 24/7', fr: 'Support 24/7' },
  feature_4: { es: 'Pago Seguro', en: 'Secure Pay', pt: 'Pag. Seguro', fr: 'Paiem. Sécurisé' },
  scroll: { es: 'Scroll', en: 'Scroll', pt: 'Rolar', fr: 'Défiler' },
  
  // ESENCIA
  esencia_tag: { es: 'Nuestra Esencia', en: 'Our Essence', pt: 'Nossa Essência', fr: 'Notre Essence' },
  esencia_title_1: { es: 'Resultados Reales', en: 'Real Results', pt: 'Resultados Reais', fr: 'Résultats Réels' },
  esencia_title_2: { es: 'No Promesas', en: 'Not Promises', pt: 'Não Promessas', fr: 'Pas de Promesses' },
  esencia_sub: {
    es: 'Somos el equipo que necesitas para dominar el mundo digital con estrategia real.',
    en: 'We are the team you need to dominate the digital world with real strategy.',
    pt: 'Somos a equipe que você precisa para dominar o mundo digital com estratégia real.',
    fr: 'Nous sommes l\'équipe dont vous avez besoin pour dominer le monde numérique.',
  },
  mision: { es: 'Misión', en: 'Mission', pt: 'Missão', fr: 'Mission' },
  mision_text: {
    es: 'Convertimos tu visión en ventas reales. Construimos la máquina digital que impulsa tu negocio al siguiente nivel.',
    en: 'We turn your vision into real sales. We build the digital machine that drives your business to the next level.',
    pt: 'Transformamos sua visão em vendas reais. Construímos a máquina digital que impulsiona seu negócio.',
    fr: 'Nous transformons votre vision en ventes réelles. Nous construisons la machine numérique qui propulse votre entreprise.',
  },
  mision_badge: { es: 'Tu éxito = Nuestro éxito', en: 'Your success = Our success', pt: 'Seu sucesso = Nosso sucesso', fr: 'Votre succès = Notre succès' },
  vision: { es: 'Visión', en: 'Vision', pt: 'Visão', fr: 'Vision' },
  vision_text: {
    es: 'Ser tu aliado digital definitivo. Webs que impresionan visualmente y generan resultados medibles.',
    en: 'To be your definitive digital ally. Websites that visually impress and generate measurable results.',
    pt: 'Ser seu aliado digital definitivo. Sites que impressionam visualmente e geram resultados mensuráveis.',
    fr: 'Être votre allié numérique définitif. Sites web qui impressionnent et génèrent des résultats mesurables.',
  },
  vision_badge: { es: 'Impacto digital real', en: 'Real digital impact', pt: 'Impacto digital real', fr: 'Impact numérique réel' },
  valores_title: { es: 'Lo que nos define', en: 'What defines us', pt: 'O que nos define', fr: 'Ce qui nous définit' },
  
  // STATS
  stats_title: { es: 'Números que Hablan', en: 'Numbers that Speak', pt: 'Números que Falam', fr: 'Chiffres qui Parlent' },
  
  // SERVICES
  services_tag: { es: 'Servicios & Precios', en: 'Services & Pricing', pt: 'Serviços & Preços', fr: 'Services & Prix' },
  services_title: { es: 'Soluciones Premium', en: 'Premium Solutions', pt: 'Soluções Premium', fr: 'Solutions Premium' },
  services_sub: {
    es: 'Precios claros. Sin sorpresas. Resultados garantizados desde el día 1.',
    en: 'Clear pricing. No surprises. Guaranteed results from day 1.',
    pt: 'Preços claros. Sem surpresas. Resultados garantidos desde o dia 1.',
    fr: 'Prix clairs. Sans surprises. Résultats garantis dès le jour 1.',
  },
  btn_start: { es: 'Comenzar', en: 'Start', pt: 'Começar', fr: 'Commencer' },
  btn_info: { es: 'Más Info', en: 'More Info', pt: 'Mais Info', fr: 'Plus d\'Infos' },
  secure_pay: { es: 'Pago 100% seguro con Stripe', en: '100% secure payment with Stripe', pt: 'Pagamento 100% seguro com Stripe', fr: 'Paiement 100% sécurisé avec Stripe' },
  processing: { es: 'Procesando...', en: 'Processing...', pt: 'Processando...', fr: 'Traitement...' },
  
  // INFO
  info_title: { es: 'Todo Claro desde el Primer Minuto', en: 'Everything Clear from Minute One', pt: 'Tudo Claro desde o Primeiro Minuto', fr: 'Tout Clair dès la Première Minute' },
  info_sub: {
    es: 'Sin sorpresas. Sin costes ocultos. Solo resultados.',
    en: 'No surprises. No hidden costs. Just results.',
    pt: 'Sem surpresas. Sem custos ocultos. Apenas resultados.',
    fr: 'Sans surprises. Sans coûts cachés. Juste des résultats.',
  },
  
  // PORTFOLIO
  portfolio_tag: { es: 'Portfolio', en: 'Portfolio', pt: 'Portfólio', fr: 'Portfolio' },
  portfolio_title: { es: 'Proyectos Destacados', en: 'Featured Projects', pt: 'Projetos Destacados', fr: 'Projets en Vedette' },
  portfolio_sub: {
    es: 'Cada proyecto es una historia de éxito. Haz clic para explorar.',
    en: 'Every project is a success story. Click to explore.',
    pt: 'Cada projeto é uma história de sucesso. Clique para explorar.',
    fr: 'Chaque projet est une histoire de succès. Cliquez pour explorer.',
  },
  btn_view: { es: 'Ver Proyecto', en: 'View Project', pt: 'Ver Projeto', fr: 'Voir Projet' },
  btn_live: { es: 'Ver en Vivo', en: 'View Live', pt: 'Ver ao Vivo', fr: 'Voir en Direct' },
  btn_similar: { es: 'Quiero Algo Similar', en: 'I Want Something Similar', pt: 'Quero Algo Similar', fr: 'Je Veux Quelque Chose de Similaire' },
  tech_highlight: { es: 'Destacado técnico', en: 'Technical highlight', pt: 'Destaque técnico', fr: 'Point technique' },
  
  // DIFERENCIADORES
  dif_tag: { es: 'Ventajas', en: 'Advantages', pt: 'Vantagens', fr: 'Avantages' },
  dif_title: { es: '¿Por qué elegirnos?', en: 'Why choose us?', pt: 'Por que nos escolher?', fr: 'Pourquoi nous choisir?' },
  
  // PROCESO
  proceso_tag: { es: 'Metodología', en: 'Methodology', pt: 'Metodologia', fr: 'Méthodologie' },
  proceso_title: { es: 'Proceso Simple y Efectivo', en: 'Simple and Effective Process', pt: 'Processo Simples e Eficaz', fr: 'Processus Simple et Efficace' },
  proceso_sub: {
    es: '5 pasos claros para llevar tu proyecto del concepto al lanzamiento.',
    en: '5 clear steps to take your project from concept to launch.',
    pt: '5 passos claros para levar seu projeto do conceito ao lançamento.',
    fr: '5 étapes claires pour mener votre projet du concept au lancement.',
  },
  
  // TESTIMONIOS
  testimonios_tag: { es: 'Testimonios', en: 'Testimonials', pt: 'Depoimentos', fr: 'Témoignages' },
  testimonios_title: { es: 'Clientes Satisfechos', en: 'Satisfied Clients', pt: 'Clientes Satisfeitos', fr: 'Clients Satisfaits' },
  testimonios_sub: {
    es: 'Lo que dicen quienes ya confían en nosotros.',
    en: 'What those who already trust us say.',
    pt: 'O que dizem aqueles que já confiam em nós.',
    fr: 'Ce que disent ceux qui nous font déjà confiance.',
  },
  
  // CTA
  cta_title: { es: '¿Listo para Despegar?', en: 'Ready to Take Off?', pt: 'Pronto para Decolar?', fr: 'Prêt à Décoller?' },
  cta_sub: {
    es: '+150 empresas ya confían en nosotros. ¡Tu proyecto puede ser el próximo éxito!',
    en: '+150 companies already trust us. Your project can be the next success!',
    pt: '+150 empresas já confiam em nós. Seu projeto pode ser o próximo sucesso!',
    fr: '+150 entreprises nous font confiance. Votre projet peut être le prochain succès!',
  },
  cta_btn: { es: 'Empezar Ahora', en: 'Start Now', pt: 'Começar Agora', fr: 'Commencer Maintenant' },
  cta_btn_2: { es: 'Ver Precios', en: 'See Prices', pt: 'Ver Preços', fr: 'Voir Prix' },
  cta_feature_1: { es: 'Consulta gratis', en: 'Free consultation', pt: 'Consulta grátis', fr: 'Consultation gratuite' },
  cta_feature_2: { es: 'Sin costes ocultos', en: 'No hidden costs', pt: 'Sem custos ocultos', fr: 'Sans coûts cachés' },
  cta_feature_3: { es: '30 días garantía', en: '30-day guarantee', pt: '30 dias garantia', fr: 'Garantie 30 jours' },
  
  // CONTACTO
  contact_tag: { es: 'Contacto', en: 'Contact', pt: 'Contato', fr: 'Contact' },
  contact_title: { es: 'Hablemos de tu Proyecto', en: "Let's Talk About Your Project", pt: 'Vamos Falar do seu Projeto', fr: 'Parlons de Votre Projet' },
  contact_sub: {
    es: 'Respuesta garantizada en menos de 2 horas. Sin compromiso.',
    en: 'Guaranteed response in less than 2 hours. No obligation.',
    pt: 'Resposta garantida em menos de 2 horas. Sem compromisso.',
    fr: 'Réponse garantie en moins de 2 heures. Sans engagement.',
  },
  contact_connect: { es: 'Conecta con nosotros', en: 'Connect with us', pt: 'Conecte-se conosco', fr: 'Connectez-vous avec nous' },
  contact_email: { es: 'Email Directo', en: 'Direct Email', pt: 'Email Direto', fr: 'Email Direct' },
  contact_location: { es: 'Ubicación', en: 'Location', pt: 'Localização', fr: 'Emplacement' },
  contact_hours: { es: 'Horario 24/7', en: '24/7 Hours', pt: 'Horário 24/7', fr: 'Horaires 24/7' },
  contact_hours_text: {
    es: 'Respuesta garantizada en menos de 2 horas',
    en: 'Guaranteed response in less than 2 hours',
    pt: 'Resposta garantida em menos de 2 horas',
    fr: 'Réponse garantie en moins de 2 heures',
  },
  form_title: { es: 'Consulta Gratuita', en: 'Free Consultation', pt: 'Consulta Gratuita', fr: 'Consultation Gratuite' },
  form_sub: {
    es: 'Cuéntanos tu idea. Te responderemos por WhatsApp.',
    en: 'Tell us your idea. We will respond via WhatsApp.',
    pt: 'Conte-nos sua ideia. Responderemos pelo WhatsApp.',
    fr: 'Parlez-nous de votre idée. Nous répondrons par WhatsApp.',
  },
  form_name: { es: 'Tu nombre completo', en: 'Your full name', pt: 'Seu nome completo', fr: 'Votre nom complet' },
  form_email: { es: 'Tu email profesional', en: 'Your professional email', pt: 'Seu email profissional', fr: 'Votre email professionnel' },
  form_phone: { es: 'Tu teléfono (opcional)', en: 'Your phone (optional)', pt: 'Seu telefone (opcional)', fr: 'Votre téléphone (optionnel)' },
  form_service: { es: '¿Qué servicio necesitas?', en: 'What service do you need?', pt: 'Qual serviço você precisa?', fr: 'De quel service avez-vous besoin?' },
  form_other: { es: 'Otro / Proyecto personalizado', en: 'Other / Custom project', pt: 'Outro / Projeto personalizado', fr: 'Autre / Projet personnalisé' },
  form_message: { es: 'Cuéntanos tu proyecto, objetivos y detalles...', en: 'Tell us about your project, goals and details...', pt: 'Conte-nos sobre seu projeto, objetivos e detalhes...', fr: 'Parlez-nous de votre projet, objectifs et détails...' },
  form_submit: { es: 'Enviar Consulta Gratis', en: 'Send Free Consultation', pt: 'Enviar Consulta Grátis', fr: 'Envoyer Consultation Gratuite' },
  form_privacy: {
    es: 'Tus datos están 100% seguros. Sin spam.',
    en: 'Your data is 100% secure. No spam.',
    pt: 'Seus dados estão 100% seguros. Sem spam.',
    fr: 'Vos données sont 100% sécurisées. Pas de spam.',
  },
  form_sent: { es: '¡Mensaje enviado con éxito!', en: 'Message sent successfully!', pt: 'Mensagem enviada com sucesso!', fr: 'Message envoyé avec succès!' },
  form_sent_text: {
    es: 'Te contactaremos por WhatsApp en breve.',
    en: 'We will contact you via WhatsApp shortly.',
    pt: 'Entraremos em contato pelo WhatsApp em breve.',
    fr: 'Nous vous contacterons par WhatsApp sous peu.',
  },
  
  // FOOTER
  footer_desc: {
    es: 'Agencia digital premium. Transformamos ideas en negocios digitales exitosos desde 2019.',
    en: 'Premium digital agency. Transforming ideas into successful digital businesses since 2019.',
    pt: 'Agência digital premium. Transformando ideias em negócios digitais de sucesso desde 2019.',
    fr: 'Agence digitale premium. Transformer des idées en entreprises numériques réussies depuis 2019.',
  },
  footer_services: { es: 'Servicios', en: 'Services', pt: 'Serviços', fr: 'Services' },
  footer_company: { es: 'Empresa', en: 'Company', pt: 'Empresa', fr: 'Entreprise' },
  footer_about: { es: 'Sobre Nosotros', en: 'About Us', pt: 'Sobre Nós', fr: 'À Propos' },
  footer_portfolio: { es: 'Portfolio', en: 'Portfolio', pt: 'Portfólio', fr: 'Portfolio' },
  footer_process: { es: 'Proceso', en: 'Process', pt: 'Processo', fr: 'Processus' },
  footer_testimonials: { es: 'Testimonios', en: 'Testimonials', pt: 'Depoimentos', fr: 'Témoignages' },
  footer_contact: { es: 'Contacto', en: 'Contact', pt: 'Contato', fr: 'Contact' },
  footer_legal: { es: 'Legal', en: 'Legal', pt: 'Legal', fr: 'Légal' },
  footer_privacy: { es: 'Privacidad', en: 'Privacy', pt: 'Privacidade', fr: 'Confidentialité' },
  footer_terms: { es: 'Términos', en: 'Terms', pt: 'Termos', fr: 'Conditions' },
  footer_cookies: { es: 'Cookies', en: 'Cookies', pt: 'Cookies', fr: 'Cookies' },
  footer_social: { es: 'Síguenos', en: 'Follow Us', pt: 'Siga-nos', fr: 'Suivez-nous' },
  footer_rights: { es: 'Todos los derechos reservados', en: 'All rights reserved', pt: 'Todos os direitos reservados', fr: 'Tous droits réservés' },
  footer_compliance: {
    es: 'Cumplimos con RGPD y LSSI-CE',
    en: 'We comply with GDPR and LSSI-CE',
    pt: 'Cumprimos com RGPD e LSSI-CE',
    fr: 'Nous respectons le RGPD et LSSI-CE',
  },
  
  // MISC
  preloader: { es: 'Cargando experiencia...', en: 'Loading experience...', pt: 'Carregando experiência...', fr: 'Chargement de l\'expérience...' },
  whatsapp: { es: 'Escríbenos por WhatsApp', en: 'Write us on WhatsApp', pt: 'Escreva-nos no WhatsApp', fr: 'Écrivez-nous sur WhatsApp' },
  close: { es: 'Cerrar', en: 'Close', pt: 'Fechar', fr: 'Fermer' },
};

// Detectar idioma automáticamente
const detectLanguage = async (): Promise<Language> => {
  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(2000) });
    const data = await response.json();
    const countryMap: Record<string, Language> = {
      ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es', BO: 'es', PY: 'es', UY: 'es', CR: 'es', PA: 'es', DO: 'es', GT: 'es', HN: 'es', SV: 'es', NI: 'es', CU: 'es',
      US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', ZA: 'en', IN: 'en', PH: 'en', SG: 'en',
      BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt',
      FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr', SN: 'fr',
    };
    if (data.country_code && countryMap[data.country_code]) {
      return countryMap[data.country_code];
    }
  } catch { /* fallback to browser */ }
  
  const browserLang = navigator.language.split('-')[0] as Language;
  return ['es', 'en', 'pt', 'fr'].includes(browserLang) ? browserLang : 'es';
};

// Context
interface LangContextType { lang: Language; setLang: (l: Language) => void; t: (key: string) => string; }
const LangContext = createContext<LangContextType | null>(null);

const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('es');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem('lang') as Language;
      if (saved && ['es', 'en', 'pt', 'fr'].includes(saved)) {
        setLang(saved);
      } else {
        const detected = await detectLanguage();
        setLang(detected);
        localStorage.setItem('lang', detected);
      }
      setReady(true);
    };
    init();
  }, []);

  const handleSetLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = (key: string): string => translations[key]?.[lang] || translations[key]?.es || key;

  if (!ready) return null;
  
  return <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>{children}</LangContext.Provider>;
};

const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
};

// ============================================
// ESTILOS GLOBALES PREMIUM + NUEVAS ANIMACIONES
// ============================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --bg: #0a1628;
    --bg-dark: #060d18;
    --bg-card: rgba(15, 30, 55, 0.7);
    --bg-glass: rgba(20, 40, 70, 0.5);
    --border: rgba(100, 150, 255, 0.12);
    --border-hover: rgba(100, 180, 255, 0.35);
    --accent: #3b82f6;
    --accent-2: #06b6d4;
    --accent-3: #8b5cf6;
    --green: #10b981;
    --gold: #f59e0b;
    --white: #ffffff;
    --white-90: rgba(255,255,255,0.9);
    --white-70: rgba(255,255,255,0.7);
    --white-50: rgba(255,255,255,0.5);
    --white-30: rgba(255,255,255,0.3);
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--white);
    overflow-x: hidden;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 100% 80% at 50% -30%, rgba(59,130,246,0.12), transparent),
      radial-gradient(ellipse 80% 60% at 100% 100%, rgba(139,92,246,0.08), transparent),
      radial-gradient(ellipse 60% 50% at 0% 80%, rgba(6,182,212,0.06), transparent);
    pointer-events: none;
    z-index: 0;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  ::selection { background: var(--accent); color: white; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-dark); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(var(--accent), var(--accent-3)); border-radius: 3px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
  @keyframes floatReverse { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(15px) rotate(-2deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.4); } 50% { box-shadow: 0 0 40px rgba(59,130,246,0.7); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes starPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px gold); } 50% { transform: scale(1.1); filter: drop-shadow(0 0 12px gold); } }
  @keyframes scrollDown { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(12px); opacity: 0; } }
  @keyframes carousel { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes countUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes waPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); } 70% { box-shadow: 0 0 0 15px transparent; } }
  @keyframes cardHover { 0% { transform: translateY(0); } 100% { transform: translateY(-6px); } }
  @keyframes borderGlow { 0%, 100% { border-color: var(--border); } 50% { border-color: var(--border-hover); } }
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
  @keyframes rotateIn { from { opacity: 0; transform: rotate(-10deg) scale(0.9); } to { opacity: 1; transform: rotate(0deg) scale(1); } }
  @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes morphGradient { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
  @keyframes orbit { from { transform: rotate(0deg) translateX(120px) rotate(0deg); } to { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
  @keyframes typing { from { width: 0; } to { width: 100%; } }
  @keyframes blink { 50% { border-color: transparent; } }

  .glass {
    background: var(--bg-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
  }

  .card {
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 16px;
    transition: all 0.4s var(--ease);
    overflow: hidden;
  }

  .card:hover {
    border-color: var(--border-hover);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.25), 0 0 20px rgba(59,130,246,0.08);
  }

  .gradient-text {
    background: linear-gradient(135deg, var(--accent), var(--accent-2), var(--accent-3));
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientFlow 4s ease infinite;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: all 0.3s var(--ease);
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  .btn:hover::before { transform: translateX(100%); }

  .btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-3));
    color: white;
    box-shadow: 0 4px 20px rgba(59,130,246,0.35);
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(59,130,246,0.5);
  }

  .btn-secondary {
    background: var(--bg-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    color: white;
  }

  .btn-secondary:hover {
    background: rgba(59,130,246,0.15);
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .btn-lg { padding: 1rem 2rem; font-size: 1rem; }
  .btn-sm { padding: 0.5rem 1rem; font-size: 0.8rem; }
  .btn-block { width: 100%; }

  .section { padding: 4rem 0; position: relative; z-index: 1; }
  .container { max-width: 1280px; margin: 0 auto; padding: 0 1.25rem; }

  .section-header { text-align: center; margin-bottom: 2.5rem; }
  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 1rem;
    background: var(--bg-glass);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent-2);
    margin-bottom: 1rem;
  }
  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.75rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  .section-sub {
    font-size: 0.95rem;
    color: var(--white-70);
    max-width: 550px;
    margin: 0 auto;
  }

  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

  @media (max-width: 1024px) {
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .section { padding: 3rem 0; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .container { padding: 0 1rem; }
  }

  .preloader {
    position: fixed;
    inset: 0;
    background: var(--bg-dark);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    z-index: 999999;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

// ============================================
// COMPONENTES
// ============================================

const NeonStar = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'starPulse 2s ease-in-out infinite' }}>
    <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFD700" /><stop offset="100%" stopColor="#FF8C00" /></linearGradient></defs>
    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6L12 2z" fill="url(#sg)" />
  </svg>
);

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const s = { sm: { star: 12, text: '0.75rem' }, md: { star: 14, text: '0.85rem' }, lg: { star: 18, text: '1.1rem' } }[size];
  return (
    <div className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '10px' }}>
      <NeonStar size={s.star} />
      <span style={{ fontFamily: 'Space Grotesk', fontSize: s.text, fontWeight: 700 }}>
        <span style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Inter</span>
        <span style={{ color: 'var(--accent-2)' }}>Conectados</span>
        <span style={{ color: 'var(--green)' }}>Web</span>
        <span style={{ color: 'var(--white-30)', fontWeight: 400 }}>.es</span>
      </span>
      <NeonStar size={s.star} />
    </div>
  );
};

// ============================================
// WHATSAPP ICON ACTUALIZADO 2024
// ============================================
const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.6 6.32A7.85 7.85 0 0012 4a7.94 7.94 0 00-6.88 11.89L4 20l4.2-1.1a7.93 7.93 0 003.79 1 8 8 0 006.61-12.58zM12 18.53a6.58 6.58 0 01-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.6 6.6 0 1110.25-8.17A6.68 6.68 0 0112 18.53zm3.61-4.93c-.2-.1-1.17-.58-1.35-.64s-.32-.1-.45.1-.52.64-.63.77-.24.15-.44.05a5.6 5.6 0 01-2.78-2.43c-.21-.36.21-.33.6-1.11a.37.37 0 00-.02-.35c-.05-.1-.45-1.08-.61-1.47s-.32-.33-.45-.34h-.38a.73.73 0 00-.53.25 2.2 2.2 0 00-.69 1.64 3.82 3.82 0 00.8 2.04 8.76 8.76 0 003.38 2.99 3.86 3.86 0 001.19.44 2.85 2.85 0 001.32-.08 2.02 2.02 0 001.33-.93 1.64 1.64 0 00.11-.93c-.05-.09-.18-.14-.38-.24z" fill="#fff"/>
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

// Selector de idioma
const LangSelector = () => {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const langs: { code: Language; flag: string }[] = [
    { code: 'es', flag: '🇪🇸' }, { code: 'en', flag: '🇺🇸' }, { code: 'pt', flag: '🇧🇷' }, { code: 'fr', flag: '🇫🇷' },
  ];
  const current = langs.find(l => l.code === lang) || langs[0];

  return (
    <div style={{ position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 99998, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {open && (
        <div style={{ marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', animation: 'fadeUp 0.2s ease' }}>
          {langs.filter(l => l.code !== lang).map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--border)', background: 'var(--bg-card)', backdropFilter: 'blur(10px)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >{l.flag}</button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--border-hover)', background: 'var(--bg-card)', backdropFilter: 'blur(20px)', cursor: 'pointer', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
      >{current.flag}</button>
    </div>
  );
};

// ============================================
// WHATSAPP FLOTANTE ACTUALIZADO 2024
// ============================================
const WhatsAppFloat = () => {
  const { t } = useLang();
  const [hover, setHover] = useState(false);
  
  return (
    <a 
      href={`https://wa.me/${SEO_CONFIG.whatsapp}?text=${encodeURIComponent('Hola! Quiero información sobre sus servicios.')}`}
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={t('whatsapp')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        position: 'fixed', 
        bottom: '2rem', 
        right: '2rem', 
        zIndex: 99999, 
        width: '56px', 
        height: '56px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: hover 
          ? '0 8px 30px rgba(37,211,102,0.6), 0 0 0 4px rgba(37,211,102,0.2)' 
          : '0 4px 20px rgba(37,211,102,0.4)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        animation: 'waPulse 2s infinite',
        transform: hover ? 'scale(1.1) rotate(10deg)' : 'scale(1) rotate(0deg)',
      }}
    >
      <WhatsAppIcon />
      {/* Tooltip */}
      <div style={{
        position: 'absolute',
        right: '70px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border)',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        fontSize: '0.8rem',
        fontWeight: 500,
        opacity: hover ? 1 : 0,
        transform: hover ? 'translateX(0)' : 'translateX(10px)',
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        💬 ¡Chatea con nosotros!
      </div>
    </a>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
function AppInner() {
  const { t } = useLang();
  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<typeof projects[0] | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVis, setStatsVis] = useState(false);
  const { addItem } = useCart();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const s = document.createElement('style');
    s.id = 'styles';
    s.textContent = globalStyles;
    document.head.prepend(s);
    document.body.style.overflow = 'hidden';
    return () => { document.getElementById('styles')?.remove(); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { setReady(true); document.body.style.overflow = ''; }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.2 });
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
      window.open(`https://wa.me/${SEO_CONFIG.whatsapp}?text=${encodeURIComponent(`Hola, quiero contratar "${name}" por €${price}`)}`, '_blank');
    } finally { setLoading(null); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = `Hola! 👋%0A%0A*Servicio:* ${form.servicio || 'General'}%0A*Nombre:* ${form.nombre}%0A*Email:* ${form.email}%0A*Tel:* ${form.telefono || '-'}%0A%0A${form.mensaje}`;
    window.open(`https://wa.me/${SEO_CONFIG.whatsapp}?text=${txt}`, '_blank');
    setSent(true);
    setForm({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  // PRELOADER
  if (!ready) {
    return (
      <div className="preloader">
        <Logo size="lg" />
        <div className="spinner" />
        <p style={{ color: 'var(--white-50)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{t('preloader')}</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Navbar />
      <Cart />
      <CookieBanner />
      <PaymentNotification />
      <LangSelector />
      <WhatsAppFloat />

      {/* ═══════════════════════════════════════════════════════════════════════════════
          ███████╗ HERO COMPLETAMENTE NUEVO - DISEÑO IMPACTANTE ███████╗
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <section id="inicio" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        paddingTop: '5rem'
      }}>
        {/* ===== FONDO DINÁMICO CON GRADIENTES Y FORMAS ===== */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Imagen de fondo con overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.07
          }} />
          
          {/* Gradientes animados */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatSlow 15s ease-in-out infinite',
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '50%',
            height: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatReverse 18s ease-in-out infinite',
            transform: `translate(${-mousePos.x * 20}px, ${-mousePos.y * 20}px)`
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 12s ease-in-out infinite',
            transform: 'translate(-50%, -50%)'
          }} />

          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
          }} />

          {/* Partículas flotantes */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              background: ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)', 'var(--gold)'][i % 4],
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: `0 0 ${10 + Math.random() * 10}px ${['var(--accent)', 'var(--accent-2)', 'var(--accent-3)', 'var(--gold)'][i % 4]}`,
              opacity: 0.4 + Math.random() * 0.3,
            }} />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '4rem', 
            alignItems: 'center',
            minHeight: '80vh'
          }}>
            {/* ===== COLUMNA IZQUIERDA - CONTENIDO ===== */}
            <div style={{ animation: 'slideInLeft 0.8s ease' }}>
              {/* Badge animado */}
              <div style={{ marginBottom: '1.5rem', animation: 'bounceIn 0.6s ease 0.2s both' }}>
                <div className="glass" style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.6rem 1.25rem', 
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid rgba(59,130,246,0.3)'
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: 'var(--green)', 
                    boxShadow: '0 0 12px var(--green)', 
                    animation: 'pulse 2s infinite' 
                  }} />
                  <span style={{ color: 'var(--accent-2)' }}>{t('hero_badge')}</span>
                </div>
              </div>

              {/* Título principal */}
              <h1 style={{ 
                fontFamily: 'Space Grotesk', 
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                fontWeight: 800, 
                lineHeight: 1.1, 
                marginBottom: '1.5rem',
                animation: 'slideInUp 0.6s ease 0.3s both'
              }}>
                <span style={{ display: 'block', color: 'var(--white)' }}>{t('hero_title_1')}</span>
                <span className="gradient-text" style={{ 
                  display: 'block', 
                  fontSize: '1.15em',
                  textShadow: '0 0 60px rgba(59,130,246,0.5)'
                }}>
                  {t('hero_title_2')}
                </span>
                <span style={{ display: 'block', color: 'var(--white)' }}>{t('hero_title_3')}</span>
              </h1>

              {/* Subtítulo */}
              <p style={{ 
                fontSize: '1.1rem', 
                color: 'var(--white-70)', 
                marginBottom: '2rem', 
                maxWidth: '500px',
                lineHeight: 1.7,
                animation: 'slideInUp 0.6s ease 0.4s both'
              }}>
                {t('hero_subtitle')}
              </p>

              {/* Botones CTA */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2.5rem', 
                flexWrap: 'wrap',
                animation: 'slideInUp 0.6s ease 0.5s both'
              }}>
                <button onClick={() => scrollTo('#servicios')} className="btn btn-primary btn-lg" style={{ 
                  fontSize: '1rem',
                  boxShadow: '0 0 30px rgba(59,130,246,0.4)',
                }}>
                  🚀 {t('cta_services')}
                </button>
                <button onClick={() => scrollTo('#contacto')} className="btn btn-secondary btn-lg" style={{ fontSize: '1rem' }}>
                  💬 {t('cta_contact')}
                </button>
              </div>

              {/* Features inline */}
              <div style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                flexWrap: 'wrap',
                animation: 'fadeIn 0.6s ease 0.7s both'
              }}>
                {[
                  { icon: '📊', text: t('feature_1'), color: 'var(--accent)' },
                  { icon: '🛡️', text: t('feature_2'), color: 'var(--green)' },
                  { icon: '⚡', text: t('feature_3'), color: 'var(--gold)' },
                ].map((f, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--white-70)',
                    animation: `fadeIn 0.4s ease ${0.8 + i * 0.1}s both`
                  }}>
                    <span style={{ 
                      width: '32px', 
                      height: '32px', 
                      background: `${f.color}20`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>{f.icon}</span>
                    <span style={{ fontWeight: 500 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== COLUMNA DERECHA - COMPOSICIÓN VISUAL ===== */}
            <div style={{ 
              position: 'relative', 
              height: '600px',
              animation: 'slideInRight 0.8s ease 0.3s both'
            }}>
              {/* Mockup principal - Laptop */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                animation: 'floatSlow 8s ease-in-out infinite',
                zIndex: 2
              }}>
                <div style={{
                  background: 'linear-gradient(145deg, #1a1a2e, #0f0f1a)',
                  borderRadius: '16px',
                  padding: '12px 12px 0',
                  boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {/* Barra de navegador */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                    </div>
                    <div style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.7rem',
                      color: 'var(--white-50)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ color: 'var(--green)' }}>🔒</span>
                      interconectadosweb.es
                    </div>
                  </div>
                  {/* Imagen del sitio */}
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    alt="Website Preview"
                    style={{
                      width: '100%',
                      borderRadius: '8px 8px 0 0',
                      display: 'block'
                    }}
                  />
                </div>
              </div>

              {/* ===== BANNERS FLOTANTES ===== */}
              
              {/* Banner 1 - Stats */}
              <div style={{
                position: 'absolute',
                top: '5%',
                left: '-5%',
                animation: 'float 6s ease-in-out infinite',
                zIndex: 3
              }}>
                <div className="glass" style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(59,130,246,0.2)'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}>📈</div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk' }} className="gradient-text">+150</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--white-50)' }}>Proyectos Exitosos</div>
                  </div>
                </div>
              </div>

              {/* Banner 2 - Rating */}
              <div style={{
                position: 'absolute',
                top: '15%',
                right: '-10%',
                animation: 'floatReverse 7s ease-in-out infinite',
                zIndex: 3
              }}>
                <div className="glass" style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '14px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(245,158,11,0.3)'
                }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: 'var(--gold)', fontSize: '1rem', textShadow: '0 0 10px var(--gold)' }}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--white-70)', textAlign: 'center' }}>98% Satisfacción</div>
                </div>
              </div>

              {/* Banner 3 - Live indicator */}
              <div style={{
                position: 'absolute',
                bottom: '25%',
                left: '-8%',
                animation: 'float 5s ease-in-out infinite 1s',
                zIndex: 3
              }}>
                <div className="glass" style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(16,185,129,0.3)'
                }}>
                  <span style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: 'var(--green)',
                    boxShadow: '0 0 15px var(--green)',
                    animation: 'pulse 1.5s ease infinite'
                  }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)' }}>3 proyectos en curso</span>
                </div>
              </div>

              {/* Banner 4 - Tech stack */}
              <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '0%',
                animation: 'floatReverse 6s ease-in-out infinite 0.5s',
                zIndex: 3
              }}>
                <div className="glass" style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '14px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--white-50)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tech Stack</div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {['⚛️', '🔷', '🟢', '🔶'].map((e, i) => (
                      <span key={i} style={{ 
                        width: '28px', 
                        height: '28px', 
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem'
                      }}>{e}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banner 5 - Conversión */}
              <div style={{
                position: 'absolute',
                top: '40%',
                right: '-15%',
                animation: 'float 8s ease-in-out infinite 2s',
                zIndex: 3
              }}>
                <div className="glass" style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--white-50)', marginBottom: '0.25rem' }}>Conversión</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-3)', fontFamily: 'Space Grotesk' }}>+340%</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--green)' }}>
                    <span>↑</span> vs. promedio
                  </div>
                </div>
              </div>

              {/* Elementos decorativos orbitantes */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '300px',
                height: '300px',
                transform: 'translate(-50%, -50%)',
                animation: 'spin 30s linear infinite',
                zIndex: 1
              }}>
                <div style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  top: '0',
                  left: '50%',
                  boxShadow: '0 0 15px var(--accent)'
                }} />
                <div style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  background: 'var(--accent-2)',
                  borderRadius: '50%',
                  bottom: '20%',
                  right: '0',
                  boxShadow: '0 0 15px var(--accent-2)'
                }} />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ 
            position: 'absolute', 
            bottom: '2rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '0.5rem',
            animation: 'fadeIn 1s ease 1.5s both'
          }}>
            <div style={{ 
              width: '24px', 
              height: '40px', 
              border: '2px solid var(--border-hover)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '8px'
            }}>
              <div style={{ 
                width: '4px', 
                height: '8px', 
                background: 'var(--accent)',
                borderRadius: '2px',
                animation: 'scrollDown 1.5s ease-in-out infinite'
              }} />
            </div>
            <span style={{ 
              fontSize: '0.65rem', 
              letterSpacing: '2px', 
              textTransform: 'uppercase', 
              color: 'var(--white-50)',
              fontWeight: 500
            }}>{t('scroll')}</span>
          </div>
        </div>

        {/* Responsive styles para Hero */}
        <style>{`
          @media (max-width: 1024px) {
            #inicio .container > div {
              grid-template-columns: 1fr !important;
              text-align: center;
              gap: 3rem !important;
            }
            #inicio .container > div > div:first-child {
              order: 1;
            }
            #inicio .container > div > div:first-child > div:last-child {
              justify-content: center;
            }
            #inicio .container > div > div:last-child {
              order: 0;
              height: 400px !important;
            }
            #inicio .container > div > div:last-child > div:first-child {
              width: 80% !important;
            }
            #inicio .container > div > div:last-child > div:nth-child(2),
            #inicio .container > div > div:last-child > div:nth-child(3),
            #inicio .container > div > div:last-child > div:nth-child(4),
            #inicio .container > div > div:last-child > div:nth-child(5),
            #inicio .container > div > div:last-child > div:nth-child(6) {
              display: none;
            }
          }
          @media (max-width: 600px) {
            #inicio .container > div > div:last-child {
              height: 280px !important;
            }
          }
        `}</style>
      </section>

      {/* ═══════════════ RESTO DE SECCIONES (SIN CAMBIOS) ═══════════════ */}

      {/* ESENCIA */}
      <section className="section" id="esencia">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💡 {t('esencia_tag')}</div>
            <h2 className="section-title"><span className="gradient-text">{t('esencia_title_1')}</span>, {t('esencia_title_2')}</h2>
            <p className="section-sub">{t('esencia_sub')}</p>
          </div>

          <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
            {[
              { icon: '🎯', title: t('mision'), text: t('mision_text'), badge: t('mision_badge'), color: 'var(--accent)' },
              { icon: '🚀', title: t('vision'), text: t('vision_text'), badge: t('vision_badge'), color: 'var(--accent-3)' },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem', textAlign: 'center', position: 'relative', animation: 'borderGlow 3s ease infinite' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${c.color}, transparent)` }} />
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', animation: `float ${4 + i}s ease-in-out infinite` }}>{c.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: c.color, textShadow: `0 0 20px ${c.color}40` }}>{c.title}</h3>
                <p style={{ color: 'var(--white-70)', marginBottom: '1rem', fontSize: '0.85rem', lineHeight: 1.6 }}>{c.text}</p>
                <span className="glass" style={{ padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 600, color: c.color }}>{c.badge}</span>
              </div>
            ))}
          </div>

          <h3 className="section-title" style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '1.25rem' }}>✨ {t('valores_title')}</h3>
          <div className="grid-4">
            {valores.map((v, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem', textAlign: 'center', animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem', animation: `float ${3 + i * 0.5}s ease-in-out infinite` }}>{v.icon}</div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--white-90)' }}>{v.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--white-50)', lineHeight: 1.5 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section" ref={statsRef} style={{ background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.03), transparent)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">📈 <span className="gradient-text">{t('stats_title')}</span></h2>
          </div>
          <div className="grid-4">
            {stats.map((s, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center', animation: statsVis ? `countUp 0.4s ease ${i * 0.1}s both` : 'none' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk', textShadow: '0 0 30px rgba(59,130,246,0.3)' }}>{s.number}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--white-50)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section" id="servicios" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,13,24,0.5))' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💼 {t('services_tag')}</div>
            <h2 className="section-title"><span className="gradient-text">{t('services_title')}</span></h2>
            <p className="section-sub">{t('services_sub')}</p>
          </div>

          <div className="grid-3">
            {servicios.map((s, idx) => (
              <article key={s.id} className="card" style={{ 
                padding: 0,
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative', 
                border: s.popular ? `2px solid ${s.color}` : undefined, 
                animation: `fadeUp 0.4s ease ${idx * 0.1}s both`,
                overflow: 'hidden'
              }}>
                <div style={{ 
                  background: `linear-gradient(135deg, ${s.color}20, transparent)`,
                  padding: '1.5rem',
                  position: 'relative',
                  borderBottom: `1px solid ${s.color}30`
                }}>
                  {s.popular && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '1rem', 
                      right: '1rem', 
                      background: s.color, 
                      color: 'white', 
                      padding: '0.3rem 0.75rem', 
                      borderRadius: '100px', 
                      fontSize: '0.65rem', 
                      fontWeight: 700, 
                      boxShadow: `0 0 20px ${s.color}50`,
                      animation: 'pulse 2s ease infinite'
                    }}>
                      ★ POPULAR
                    </div>
                  )}
                  
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: `linear-gradient(135deg, ${s.color}, ${s.color}80)`,
                    borderRadius: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1.75rem', 
                    marginBottom: '1rem', 
                    boxShadow: `0 4px 20px ${s.color}40`,
                    animation: 'float 4s ease-in-out infinite'
                  }}>
                    {s.icon}
                  </div>

                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700, 
                    marginBottom: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px', 
                    color: 'var(--white-90)' 
                  }}>
                    {s.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--white-50)' }}>€</span>
                    <span className="gradient-text" style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 800, 
                      fontFamily: 'Space Grotesk', 
                      textShadow: `0 0 30px ${s.color}40`,
                      marginLeft: '0.25rem'
                    }}>
                      {s.price}
                    </span>
                    {s.suffix && <span style={{ fontSize: '0.8rem', color: 'var(--white-50)', marginLeft: '0.3rem' }}>{s.suffix}</span>}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--white-70)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>

                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <ul style={{ listStyle: 'none', marginBottom: '1.25rem' }}>
                    {s.features.slice(0, 5).map((f, j) => (
                      <li key={j} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '0.6rem', 
                        padding: '0.6rem 0', 
                        borderBottom: j < 4 ? '1px solid var(--border)' : 'none',
                        fontSize: '0.8rem', 
                        color: 'var(--white-70)',
                      }}>
                        <span style={{ 
                          width: '20px', 
                          height: '20px', 
                          background: `linear-gradient(135deg, ${s.color}, ${s.color}80)`,
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.6rem', 
                          color: 'white', 
                          flexShrink: 0,
                          boxShadow: `0 2px 10px ${s.color}40`
                        }}>
                          ✓
                        </span>
                        <span style={{ lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button 
                      onClick={() => handleBuy(s.name, s.price, s.id)} 
                      disabled={loading === s.id} 
                      className="btn btn-primary btn-block" 
                      style={{ 
                        background: loading === s.id ? 'var(--bg-glass)' : `linear-gradient(135deg, ${s.color}, var(--accent-3))`,
                        boxShadow: `0 4px 20px ${s.color}40`,
                        fontSize: '0.9rem',
                        padding: '0.75rem'
                      }}
                    >
                      {loading === s.id ? (
                        <>
                          <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> 
                          {t('processing')}
                        </>
                      ) : (
                        <>🚀 {t('btn_start')}</>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => addItem(s)} 
                      className="btn btn-secondary btn-block"
                      style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                    >
                      ℹ️ {t('btn_info')}
                    </button>
                  </div>

                  <p style={{ 
                    textAlign: 'center', 
                    fontSize: '0.65rem', 
                    color: 'var(--white-30)', 
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}>
                    <span style={{ color: 'var(--green)' }}>🔒</span>
                    {t('secure_pay')}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--white-90)' }}>📋 {t('info_title')}</h3>
            <p style={{ color: 'var(--white-50)', fontSize: '0.85rem' }}>{t('info_sub')}</p>
          </div>
          <div className="grid-3">
            {infoCards.map((c, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', animation: `fadeUp 0.3s ease ${i * 0.1}s both` }}>
                <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.85rem', color: 'var(--white-90)' }}>{c.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--white-50)', lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="section" id="portafolio">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🎨 {t('portfolio_tag')}</div>
            <h2 className="section-title"><span className="gradient-text">{t('portfolio_title')}</span></h2>
            <p className="section-sub">{t('portfolio_sub')}</p>
          </div>

          <div className="grid-3">
            {projects.map((p, i) => (
              <article key={p.id} className="card" style={{ cursor: 'pointer', animation: `fadeUp 0.4s ease ${i * 0.1}s both` }} onClick={() => setProject(p)}>
                <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                  <img src={p.img} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg), transparent)' }} />
                  <span className="glass" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600 }}>{p.enfoque.split(' ')[0]}</span>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--accent-2)', textShadow: '0 0 20px rgba(6,182,212,0.3)' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--white-50)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{p.descShort}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    {p.tags.slice(0, 3).map(tag => (<span key={tag} className="glass" style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.6rem', color: 'var(--accent)' }}>{tag}</span>))}
                  </div>
                  <button className="btn btn-secondary btn-block btn-sm">{t('btn_view')}</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Proyecto */}
      {project && (
        <div onClick={e => e.target === e.currentTarget && setProject(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(6,13,24,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '900px', maxHeight: '85vh', overflow: 'auto', animation: 'modalIn 0.3s ease', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={project.img} alt={project.title} style={{ width: '100%', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }} />
            </div>
            <div style={{ padding: '1.5rem', position: 'relative' }}>
              <button onClick={() => setProject(null)} className="glass" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem' }}>✕</button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--accent-2)' }}>{project.title}</h2>
              <p style={{ color: 'var(--green)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.8rem' }}>🏷️ {project.enfoque}</p>
              <p style={{ color: 'var(--white-70)', lineHeight: 1.6, marginBottom: '1rem', fontSize: '0.85rem' }}>{project.desc}</p>
              <div className="glass" style={{ padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', borderLeft: '2px solid var(--accent)' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.75rem', color: 'var(--accent)' }}>⚡ {t('tech_highlight')}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--white-70)' }}>{project.highlight}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                {project.tags.map(tag => (<span key={tag} className="glass" style={{ padding: '0.25rem 0.5rem', borderRadius: '100px', fontSize: '0.65rem', color: 'var(--accent-2)' }}>{tag}</span>))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>🚀 {t('btn_live')}</a>
                <button onClick={() => { setProject(null); setTimeout(() => scrollTo('#contacto'), 100); }} className="btn btn-secondary btn-sm">💬 {t('btn_similar')}</button>
              </div>
            </div>
          </div>
          <style>{`@media (max-width: 768px) { .card { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      )}

      {/* DIFERENCIADORES */}
      <section className="section" id="diferenciadores">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🏆 {t('dif_tag')}</div>
            <h2 className="section-title"><span className="gradient-text">{t('dif_title')}</span></h2>
          </div>
          <div className="grid-3">
            {diferenciadores.map((d, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center', animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', animation: `float ${4 + i * 0.5}s ease-in-out infinite` }}>{d.icon}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--white-90)' }}>{d.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--white-50)', lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="section" id="metodologia" style={{ background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.03), transparent)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">⚙️ {t('proceso_tag')}</div>
            <h2 className="section-title"><span className="gradient-text">{t('proceso_title')}</span></h2>
            <p className="section-sub">{t('proceso_sub')}</p>
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {proceso.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="glass" style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent)', boxShadow: '0 0 15px rgba(59,130,246,0.2)' }}>
                    <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                    <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--accent)' }}>{p.step}</span>
                  </div>
                  {i < proceso.length - 1 && <div style={{ width: '2px', flex: 1, minHeight: '20px', background: 'linear-gradient(to bottom, var(--accent), transparent)', marginTop: '0.4rem' }} />}
                </div>
                <div className="card" style={{ flex: 1, padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.35rem', fontSize: '0.95rem', color: 'var(--white-90)' }}>{p.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--white-50)', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="section" id="testimonios">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">💬 {t('testimonios_tag')}</div>
            <h2 className="section-title"><span className="gradient-text">{t('testimonios_title')}</span></h2>
            <p className="section-sub">{t('testimonios_sub')}</p>
          </div>
        </div>
        <div style={{ overflow: 'hidden', padding: '0.75rem 0' }}>
          <div style={{ display: 'flex', animation: 'carousel 35s linear infinite', width: 'max-content' }} onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'} onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}>
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} className="card" style={{ flex: '0 0 320px', margin: '0 0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '0.75rem' }}>
                  {[...Array(r.rating)].map((_, j) => (<span key={j} style={{ color: 'var(--gold)', fontSize: '0.85rem', textShadow: '0 0 10px rgba(245,158,11,0.4)' }}>★</span>))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--white-70)', lineHeight: 1.6, marginBottom: '1rem', fontSize: '0.85rem' }}>"{r.texto}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{r.iniciales}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--white-90)' }}>{r.autor}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--white-50)' }}>{r.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--accent), var(--accent-3))', opacity: 0.08 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15), transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            {['🚀', '💎', '⚡'].map((e, i) => (<span key={i} style={{ fontSize: '2rem', margin: '0 0.35rem', display: 'inline-block', animation: `float ${3 + i * 0.4}s ease-in-out infinite` }}>{e}</span>))}
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.75rem', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>{t('cta_title')}</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--white-70)', marginBottom: '1.5rem' }}>{t('cta_sub')}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button onClick={() => scrollTo('#contacto')} className="btn btn-primary btn-lg">🚀 {t('cta_btn')}</button>
            <button onClick={() => scrollTo('#servicios')} className="btn btn-secondary btn-lg">💼 {t('cta_btn_2')}</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[t('cta_feature_1'), t('cta_feature_2'), t('cta_feature_3')].map((f, i) => (
              <span key={i} className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--white-70)' }}>
                {['✅', '💰', '🛡️'][i]} {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="section" id="contacto">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📞 {t('contact_tag')}</div>
            <h2 className="section-title"><span className="gradient-text">{t('contact_title')}</span></h2>
            <p className="section-sub">{t('contact_sub')}</p>
          </div>

          <div className="grid-2">
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--white-90)' }}>🌟 {t('contact_connect')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: '📧', label: t('contact_email'), value: SEO_CONFIG.email, href: `mailto:${SEO_CONFIG.email}`, color: 'var(--accent)' },
                  { icon: '💬', label: 'WhatsApp', value: '+57 301 436 7948', href: `https://wa.me/${SEO_CONFIG.whatsapp}`, target: '_blank', color: '#25D366' },
                  { icon: '📍', label: t('contact_location'), value: SEO_CONFIG.address, color: 'var(--accent-3)' },
                ].map((m, i) => (
                  <div key={i} onClick={() => m.href && (m.target ? window.open(m.href, '_blank') : (location.href = m.href))}
                    className="glass" style={{ padding: '0.875rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: m.href ? 'pointer' : 'default', transition: 'all 0.3s ease', borderLeft: `3px solid ${m.color}` }}
                    onMouseEnter={e => { if (m.href) { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = 'translateX(5px)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <div style={{ width: '40px', height: '40px', background: `${m.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{m.icon}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--white-90)' }}>{m.label}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--white-50)' }}>{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass" style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: '10px', borderLeft: '3px solid var(--green)' }}>
                <p style={{ fontWeight: 600, color: 'var(--green)', fontSize: '0.8rem' }}>⚡ {t('contact_hours')}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--white-50)', marginTop: '0.2rem' }}>{t('contact_hours_text')}</p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--white-90)' }}>🎁 {t('form_title')}</h3>
              <p style={{ color: 'var(--white-50)', marginBottom: '1.25rem', fontSize: '0.8rem' }}>{t('form_sub')}</p>
              {sent && (
                <div className="glass" style={{ padding: '0.875rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '3px solid var(--green)', animation: 'fadeIn 0.3s ease' }}>
                  <span style={{ fontSize: '1.25rem' }}>✅</span>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--green)', fontSize: '0.85rem' }}>{t('form_sent')}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--white-50)' }}>{t('form_sent_text')}</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'nombre', placeholder: t('form_name'), type: 'text', required: true },
                  { name: 'email', placeholder: t('form_email'), type: 'email', required: true },
                  { name: 'telefono', placeholder: t('form_phone'), type: 'tel' },
                ].map(f => (
                  <input key={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                    value={form[f.name as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-glass)', color: 'white', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                ))}
                <select value={form.servicio} onChange={e => setForm(p => ({ ...p, servicio: e.target.value }))}
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-glass)', color: form.servicio ? 'white' : 'var(--white-50)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                  <option value="">{t('form_service')}</option>
                  {servicios.map(s => (<option key={s.id} value={s.name}>{s.icon} {s.name} — €{s.price}</option>))}
                  <option value="Otro">{t('form_other')}</option>
                </select>
                <textarea placeholder={t('form_message')} rows={3} required value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-glass)', color: 'white', fontSize: '0.85rem', outline: 'none', resize: 'vertical', minHeight: '80px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="submit" className="btn btn-primary btn-block">🚀 {t('form_submit')}</button>
                <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--white-30)' }}>🔒 {t('form_privacy')}</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--border)', padding: '3rem 0 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ marginBottom: '1rem' }}><Logo size="sm" /></div>
              <p style={{ fontSize: '0.8rem', color: 'var(--white-50)', lineHeight: 1.6, marginBottom: '1rem' }}>{t('footer_desc')}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['instagram', 'twitter', 'linkedin', 'github'].map((s) => (
                  <a key={s} href="#" className="glass" style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white-50)', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--white-50)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  ><SocialIcon type={s as any} /></a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-2)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 0 15px rgba(6,182,212,0.3)' }}>{t('footer_services')}</h4>
              {servicios.slice(0, 5).map(s => (
                <a key={s.id} href="#servicios" onClick={e => { e.preventDefault(); scrollTo('#servicios'); }}
                  style={{ display: 'block', color: 'var(--white-50)', fontSize: '0.8rem', marginBottom: '0.5rem', textDecoration: 'none', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.paddingLeft = '5px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--white-50)'; e.currentTarget.style.paddingLeft = '0'; }}
                >{s.icon} {s.name}</a>
              ))}
            </div>

            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-2)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 0 15px rgba(6,182,212,0.3)' }}>{t('footer_company')}</h4>
              {[t('footer_about'), t('footer_portfolio'), t('footer_process'), t('footer_testimonials'), t('footer_contact')].map((l, i) => (
                <a key={l} href={`#${['esencia', 'portafolio', 'metodologia', 'testimonios', 'contacto'][i]}`} onClick={e => { e.preventDefault(); scrollTo(`#${['esencia', 'portafolio', 'metodologia', 'testimonios', 'contacto'][i]}`); }}
                  style={{ display: 'block', color: 'var(--white-50)', fontSize: '0.8rem', marginBottom: '0.5rem', textDecoration: 'none', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.paddingLeft = '5px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--white-50)'; e.currentTarget.style.paddingLeft = '0'; }}
                >{l}</a>
              ))}
            </div>

            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-2)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 0 15px rgba(6,182,212,0.3)' }}>{t('footer_legal')}</h4>
              {[t('footer_privacy'), t('footer_terms'), t('footer_cookies')].map(l => (
                <a key={l} href="#" style={{ display: 'block', color: 'var(--white-50)', fontSize: '0.8rem', marginBottom: '0.5rem', textDecoration: 'none', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.paddingLeft = '5px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--white-50)'; e.currentTarget.style.paddingLeft = '0'; }}
                >{l}</a>
              ))}
              <div className="glass" style={{ marginTop: '0.75rem', padding: '0.6rem', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--white-50)' }}>
                🛡️ {t('footer_compliance')}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { icon: '🔒', text: 'SSL', color: 'var(--green)' },
                { icon: '✅', text: 'RGPD', color: 'var(--accent)' },
                { icon: '💳', text: 'Stripe', color: 'var(--accent-3)' },
              ].map((b, i) => (
                <span key={i} className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: b.color, color: 'var(--white-90)' }}>
                  <span style={{ filter: 'brightness(1.2)' }}>{b.icon}</span>
                  <span style={{ color: b.color, fontWeight: 600, textShadow: `0 0 10px ${b.color}40` }}>{b.text}</span>
                </span>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--white-50)' }}>
              © {new Date().getFullYear()} <span style={{ color: 'var(--accent-2)' }}>InterConectadosWeb.es</span> — {t('footer_rights')}
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            footer .container > div:first-child { grid-template-columns: repeat(2, 1fr) !important; gap: 1.5rem; }
          }
          @media (max-width: 600px) {
            footer .container > div:first-child { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </LangProvider>
  );
}
