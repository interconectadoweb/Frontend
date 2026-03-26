// ============================================
// CONFIGURACIÓN GLOBAL SEO & CONTACTO
// ============================================
export const SEO_CONFIG = {
  siteName: 'InterConectadosWeb',
  siteUrl: 'https://interconectadosweb.es',
  title: 'InterConectadosWeb | Agencia de Desarrollo Web Premium en España',
  description: 'Agencia de desarrollo web profesional en España. Landing pages, tiendas online, webs corporativas. Desde 299€ con garantía 30 días.',
  email: 'soporte@interconectadosweb.es',
  whatsapp: '573014367948',
  address: 'España (Servicio Global)',
  apiUrl: 'https://interconectadoback.onrender.com',
};

// ============================================
// PROYECTOS PORTFOLIO
// ============================================
export const projects = [
  {
    id: 'faciltrueque',
    title: 'FacilTrueque',
    enfoque: 'Economía Colaborativa y Marketplace',
    desc: 'Plataforma moderna de intercambio y trueque digital. Desarrollada con un enfoque en la facilidad de uso (UX), permitiendo a los usuarios gestionar activos y servicios de forma ágil y segura.',
    descShort: 'Plataforma moderna de intercambio y trueque digital con enfoque en UX y experiencia de usuario superior.',
    highlight: 'Arquitectura escalable y gestión de flujo de usuarios en tiempo real con tecnología de punta.',
    url: 'https://faciltrueque.interconectadosweb.es',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&q=85',
    tags: ['React', 'Node.js', 'MongoDB'],
    category: 'marketplace',
  },
  {
    id: 'doctor-repair',
    title: 'Doctor Repair',
    enfoque: 'Servicio Técnico y Logística',
    desc: 'Solución digital integral para servicios de reparación técnica. Incluye una estructura optimizada para la conversión de leads y gestión de solicitudes de soporte especializado.',
    descShort: 'Solución digital integral para servicios de reparación técnica con sistema de gestión de leads.',
    highlight: 'Interfaz intuitiva y optimización de SEO local para captación de clientes, con +300% mejora en conversiones.',
    url: 'https://doctor-repair.interconectadosweb.es',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=600&fit=crop&q=85',
    tags: ['WordPress', 'SEO', 'Google Ads'],
    category: 'corporativo',
  },
  {
    id: 'biomagnetismo',
    title: 'Biomagnetismo',
    enfoque: 'Salud y Bienestar',
    desc: 'Sitio especializado para servicios de terapias alternativas. Diseñado con una estética limpia y profesional que transmite confianza, orientado a la reserva de citas y educación del paciente.',
    descShort: 'Sitio especializado para terapias alternativas con diseño limpio y sistema de reserva de citas.',
    highlight: 'Optimización de Web Vitals al 98% y diseño 100% responsive con sistema de citas online integrado.',
    url: 'https://biomagnetismo.interconectadosweb.es',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=900&h=600&fit=crop&q=85',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'salud',
  },
  {
    id: 'jetperience',
    title: 'JetXperience',
    enfoque: 'Turismo y Experiencias Premium',
    desc: 'Landing page de alto impacto visual para la promoción de servicios turísticos exclusivos. Enfocada en el storytelling visual para maximizar el deseo de compra del usuario.',
    descShort: 'Landing page de alto impacto visual para servicios turísticos exclusivos y premium.',
    highlight: 'Integración de elementos multimedia de alta calidad sin sacrificar rendimiento. Score 100 PageSpeed.',
    url: 'https://jetxperience.interconectadosweb.es',
    img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop&q=85',
    tags: ['React', 'Framer Motion', 'Stripe'],
    category: 'turismo',
  },
  {
    id: 'casa-restauracion',
    title: 'Casa de Restauración',
    enfoque: 'Institucional / Social',
    desc: 'Plataforma de presencia digital para organizaciones de apoyo social. Estructura clara para la difusión de eventos, programas de ayuda y contacto directo con la comunidad.',
    descShort: 'Plataforma digital para organizaciones de apoyo social con gestión de eventos y comunidad.',
    highlight: 'Organización de contenido jerárquica para facilitar la navegación en dispositivos móviles, accesibilidad AA.',
    url: 'https://casaderestauracion.interconectadosweb.es',
    img: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&h=600&fit=crop&q=85',
    tags: ['WordPress', 'Elementor', 'SEO'],
    category: 'institucional',
  },
  {
    id: 'interconectados',
    title: 'Interconectados Web',
    enfoque: 'Agencia de Desarrollo y Consultoría',
    desc: 'El centro de operaciones donde se demuestra la capacidad técnica en SEO, rendimiento y auditoría de código. Es la vitrina de servicios de automatización y desarrollo a medida.',
    descShort: 'Centro de operaciones con capacidad técnica en SEO avanzado, rendimiento y arquitectura cloud.',
    highlight: 'Puntuaciones de 100% en PageSpeed Insights y arquitectura de microservicios escalable en AWS.',
    url: 'https://www.interconectadosweb.es',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&h=600&fit=crop&q=85',
    tags: ['React', 'Vite', 'Tailwind'],
    category: 'agencia',
  },
];

// ============================================
// SERVICIOS / PRECIOS
// ============================================
export interface Servicio {
  id: string;
  name: string;
  price: number;
  suffix?: string;
  desc: string;
  features: string[];
  icon: string;
  color: string;
  glow: string;
  popular?: boolean;
  badge?: string;
}

export const servicios: Servicio[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    price: 299,
    desc: 'Página de aterrizaje optimizada para conversión directa y campañas de Google Ads.',
    features: [
      'Diseño responsive premium',
      'Formulario de contacto avanzado',
      'SEO básico incluido',
      'Hosting 1 año gratis',
      'Velocidad optimizada (PageSpeed 90+)',
      'Integración Google Analytics',
    ],
    icon: '🚀',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.25)',
  },
  {
    id: 'disenio',
    name: 'Diseño Personalizado',
    price: 599,
    desc: 'Diseño único de identidad visual corporativa con brand identity completa.',
    features: [
      'Diseño 100% exclusivo',
      'Brand identity completa',
      'Manual de marca digital',
      'Archivos editables (AI, PSD)',
      'Logo + paleta + tipografía',
      'Revisiones ilimitadas',
    ],
    icon: '🎨',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.25)',
  },
  {
    id: 'ecommerce',
    name: 'Tienda Online',
    price: 799,
    desc: 'E-commerce completo con gestión de productos, pagos y panel administrador.',
    features: [
      'Hasta 100 productos',
      'Pasarela de pagos Stripe',
      'Panel admin intuitivo',
      'Soporte 3 meses incluido',
      'Gestión de inventario',
      'Reportes de ventas',
    ],
    icon: '🛒',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
    popular: true,
    badge: '⭐ MÁS VENDIDO',
  },
  {
    id: 'corporativo',
    name: 'Sitio Corporativo',
    price: 1199,
    desc: 'Presencia profesional avanzada para empresas y PYMEs con blog y analytics.',
    features: [
      'Hasta 10 páginas internas',
      'Blog corporativo integrado',
      'Multilenguaje (ES/EN)',
      'Analytics avanzado',
      'CRM básico integrado',
      'SEO técnico profesional',
    ],
    icon: '🏢',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
  },
  {
    id: 'hosting',
    name: 'Hosting Web Pro',
    price: 99,
    suffix: '/año',
    desc: 'Alta velocidad con SSD, backups automáticos y seguridad SSL premium incluida.',
    features: [
      'SSD 5TB ultrarrápido',
      'SSL gratuito premium',
      'Backups diarios automáticos',
      'Soporte técnico 24/7',
      'Ancho de banda ilimitado',
      'Panel de control cPanel',
    ],
    icon: '☁️',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento',
    price: 19,
    suffix: '/mes',
    desc: 'Seguridad activa, actualizaciones mensuales y monitoreo 24/7 de tu web.',
    features: [
      'Actualizaciones constantes',
      'Seguridad proactiva',
      'Monitoreo 24/7',
      'Soporte técnico prioritario',
      'Informe mensual',
      'Backup semanal extra',
    ],
    icon: '🔧',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.25)',
  },
];

// ============================================
// ESTADÍSTICAS
// ============================================
export const stats = [
  { number: '160+', label: 'Proyectos Entregados', icon: '📊' },
  { number: '150+', label: 'Clientes Felices', icon: '😊' },
  { number: '5+', label: 'Años de Experiencia', icon: '⏰' },
  { number: '4.9', label: 'Calificación Media', icon: '⭐' },
  { number: '180%', label: 'ROI Promedio', icon: '📈' },
  { number: '30', label: 'Días de Garantía', icon: '🛡️' },
];

// ============================================
// REVIEWS
// ============================================
export const reviews = [
  {
    id: 1,
    texto: 'El equipo de InterConectadosWeb es excepcional. Entendieron perfectamente nuestra visión y la ejecución fue impecable. Superaron todas nuestras expectativas.',
    autor: 'Carlos Rodríguez',
    cargo: 'Director Ejecutivo, TechStart Solutions',
    iniciales: 'CR',
    rating: 5,
  },
  {
    id: 2,
    texto: 'InterConectadosWeb transformó completamente nuestra presencia online. El sitio web no solo es hermoso sino que genera ventas reales desde el primer día.',
    autor: 'María González',
    cargo: 'Directora de Marketing, Moda Urbana',
    iniciales: 'MG',
    rating: 5,
  },
  {
    id: 3,
    texto: 'La landing page que crearon generó más de 500 leads calificados en el primer mes. El ROI ha sido absolutamente excepcional. Los recomiendo 100%.',
    autor: 'Roberto Sánchez',
    cargo: 'Director Comercial, Gimnasio FitLife',
    iniciales: 'RS',
    rating: 5,
  },
  {
    id: 4,
    texto: 'Trabajar con ellos fue una experiencia increíble. Su atención al detalle, la velocidad de entrega y el compromiso con la calidad son incomparables en el mercado.',
    autor: 'Ana Martínez',
    cargo: 'Propietaria, La Bella Vista Restaurant',
    iniciales: 'AM',
    rating: 5,
  },
  {
    id: 5,
    texto: 'Nuestra tienda online pasó de 0 a 50 ventas mensuales en solo 3 meses. El equipo nos guió en cada paso con profesionalismo y dedicación total.',
    autor: 'Luis Fernández',
    cargo: 'Fundador, EcoTienda Digital',
    iniciales: 'LF',
    rating: 5,
  },
];

// ============================================
// VALORES
// ============================================
export const valores = [
  { icon: '🔍', title: 'Transparencia Total', desc: 'Sin letra pequeña. Sin sorpresas ocultas.' },
  { icon: '📈', title: 'Resultados Medibles', desc: 'Cada píxel diseñado para convertir.' },
  { icon: '🛡️', title: 'Inversión Protegida', desc: 'Tu inversión está 100% garantizada.' },
  { icon: '⚡', title: 'Velocidad Real', desc: 'Entregamos en tiempo récord.' },
  { icon: '🤝', title: 'Socios, No Proveedores', desc: 'Tu éxito es nuestro éxito.' },
];

// ============================================
// DIFERENCIADORES
// ============================================
export const diferenciadores = [
  { icon: '🏆', title: 'Garantía de Calidad', desc: '100% satisfacción con revisiones ilimitadas hasta que quedes conforme.' },
  { icon: '⚡', title: 'Velocidad Pura', desc: 'Sitios optimizados para cargar en milisegundos. PageSpeed 90+ garantizado.' },
  { icon: '🎧', title: 'Soporte Dedicado', desc: 'Canal directo de comunicación 365 días. Respuesta en menos de 2 horas.' },
  { icon: '💻', title: 'Código Moderno', desc: 'Arquitecturas escalables con las últimas tecnologías del mercado.' },
];

// ============================================
// PROCESO
// ============================================
export const proceso = [
  { step: '01', title: 'Consulta Inicial Gratis', desc: 'Conversamos sobre tu proyecto, objetivos y visión de negocio sin compromiso.', icon: '💬' },
  { step: '02', title: 'Pago Seguro', desc: 'Proceso de pago 100% garantizado con factura profesional y contrato digital.', icon: '🔐' },
  { step: '03', title: 'Diseño y Prototipo', desc: 'Creamos maquetas y prototipos personalizados para tu aprobación previa.', icon: '🎨' },
  { step: '04', title: 'Desarrollo Premium', desc: 'Programamos tu sitio con código limpio, semántico y optimizado para SEO.', icon: '⚙️' },
  { step: '05', title: 'Lanzamiento y Soporte', desc: 'Publicamos tu web y brindamos soporte continuo para garantizar tu éxito.', icon: '🚀' },
];

// ============================================
// INFO CARDS
// ============================================
export const infoCards = [
  { icon: '💶', title: 'Precios transparentes', desc: 'Todos los valores mostrados ya incluyen IVA. Sin costes ocultos.' },
  { icon: '📄', title: 'Tranquilidad legal', desc: 'Cada proyecto se respalda con un contrato profesional firmado digitalmente.' },
  { icon: '🛡️', title: 'Inversión protegida', desc: 'Garantía de satisfacción total durante los primeros 30 días de entrega.' },
  { icon: '🔍', title: 'Claridad absoluta', desc: 'Flujo de trabajo 100% transparente y trazable desde el primer minuto.' },
  { icon: '🤝', title: 'Soluciones a tu medida', desc: 'Consulta condiciones especiales para proyectos personalizados o paquetes.' },
  { icon: '🚀', title: 'Soporte Prioritario', desc: 'Atención directa y seguimiento continuo para asegurar tu éxito digital.' },
];
