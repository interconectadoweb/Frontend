import { useState, useEffect } from 'react';

type PaymentStatus = 'success' | 'cancelled' | 'error' | null;

export default function PaymentNotification() {
  const [status, setStatus] = useState<PaymentStatus>(null);
  const [visible, setVisible] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const sid = params.get('session_id');

    if (payment === 'success') {
      setStatus('success');
      setSessionId(sid);
      setVisible(true);
      // Limpiar URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (payment === 'cancelled') {
      setStatus('cancelled');
      setVisible(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const close = () => setVisible(false);

  if (!visible || !status) return null;

  const configs = {
    success: {
      icon: '🎉',
      title: '¡Pago realizado con éxito!',
      message: 'Tu pedido ha sido confirmado. Recibirás un email de confirmación y nos pondremos en contacto contigo en menos de 2 horas para comenzar tu proyecto.',
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.1)',
      border: 'rgba(34,197,94,0.3)',
      cta: '🚀 Ir al inicio',
      detail: sessionId ? `ID de sesión: ${sessionId.slice(0, 20)}...` : null,
    },
    cancelled: {
      icon: '⚠️',
      title: 'Pago cancelado',
      message: 'El proceso de pago fue cancelado. Puedes intentarlo de nuevo o contactarnos directamente por WhatsApp para ayudarte.',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.3)',
      cta: '💬 Contactar por WhatsApp',
      detail: null,
    },
    error: {
      icon: '❌',
      title: 'Error en el pago',
      message: 'Ocurrió un error procesando tu pago. Por favor intenta de nuevo o contáctanos directamente.',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.3)',
      cta: '💬 Contactar Soporte',
      detail: null,
    },
  };

  const cfg = configs[status];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeInOverlay 0.3s ease',
    }}>
      <div style={{
        maxWidth: '500px', width: '100%',
        background: 'linear-gradient(135deg, #0b0620, #0f0a1f)',
        border: `1px solid ${cfg.border}`,
        borderRadius: '2rem', padding: '3rem 2.5rem',
        textAlign: 'center', position: 'relative',
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${cfg.bg}`,
        animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Top glow bar */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '3px',
          background: cfg.color, borderRadius: '0 0 3px 3px', filter: 'blur(4px)',
        }} />

        {/* Icono */}
        <div style={{
          fontSize: '5rem', marginBottom: '1.25rem',
          display: 'block', animation: 'bounceIn 0.6s 0.2s both',
        }}>
          {cfg.icon}
        </div>

        <h2 style={{
          margin: '0 0 1rem', fontSize: '1.6rem', fontWeight: 900, color: 'white',
        }}>
          {cfg.title}
        </h2>

        <p style={{
          margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7,
        }}>
          {cfg.message}
        </p>

        {cfg.detail && (
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem',
            padding: '0.75rem', marginBottom: '1.5rem',
            fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace',
          }}>
            {cfg.detail}
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {status === 'cancelled' || status === 'error' ? (
            <>
              <button
                onClick={() => {
                  window.open(`https://wa.me/573014367948?text=Hola, necesito ayuda con mi pago`, '_blank');
                  close();
                }}
                style={{
                  width: '100%', padding: '1rem', borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  border: 'none', color: 'white', fontWeight: 700,
                  fontSize: '1rem', cursor: 'pointer',
                }}
              >
                💬 Contactar por WhatsApp
              </button>
              <button
                onClick={close}
                style={{
                  width: '100%', padding: '0.85rem', borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                Intentar de nuevo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={close}
                style={{
                  width: '100%', padding: '1rem', borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none', color: 'white', fontWeight: 700,
                  fontSize: '1rem', cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(34,197,94,0.3)',
                }}
              >
                🚀 ¡Perfecto, vamos!
              </button>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                📧 Revisa tu email — te enviamos la confirmación
              </p>
            </>
          )}
        </div>

        {/* Close X */}
        <button
          onClick={close}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(255,255,255,0.06)', border: 'none',
            color: '#94a3b8', width: '32px', height: '32px',
            borderRadius: '50%', cursor: 'pointer', fontSize: '0.9rem',
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounceIn {
          from { transform: scale(0); }
          60% { transform: scale(1.2); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
