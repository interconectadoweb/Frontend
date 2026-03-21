import { useState } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { SEO_CONFIG } from '../data/content';

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, totalPrice, totalItems, isOpen, closeCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setPaymentStatus('idle');

    try {
      const lineItems = items.map(item => ({
        serviceName: item.name,
        price: item.price,
        quantity: item.quantity,
        suffix: item.suffix || '',
      }));

      const baseURL = import.meta.env.VITE_API_URL || SEO_CONFIG.apiUrl;
      const res = await axios.post(`${baseURL}/api/stripe/create-checkout-session`, {
        lineItems,
        successUrl: `${window.location.origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/?payment=cancelled`,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
      // Fallback: WhatsApp con detalle del pedido
      const itemsText = items
        .map(i => `• ${i.name} x${i.quantity} = ${i.price * i.quantity}€${i.suffix || ''}`)
        .join('%0A');
      const msg = `Hola InterConectadosWeb, quiero contratar:%0A%0A${itemsText}%0A%0A*Total: ${totalPrice}€*%0A%0APor favor, indíqueme cómo proceder con el pago.`;
      window.open(`https://wa.me/${SEO_CONFIG.whatsapp}?text=${msg}`, '_blank');
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)', zIndex: 99998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '480px',
        background: 'linear-gradient(180deg, #0b0620 0%, #0f0a1f 100%)',
        borderLeft: '1px solid rgba(168,85,247,0.2)',
        zIndex: 99999,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(168,85,247,0.05)',
          position: 'sticky', top: 0, zIndex: 10,
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🛒</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                Carrito de Compra
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                {totalItems} {totalItems === 1 ? 'servicio' : 'servicios'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', borderRadius: '50%', width: '40px', height: '40px',
              cursor: 'pointer', fontSize: '1.1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Agrega servicios desde la sección de precios
              </p>
              <button
                onClick={closeCart}
                style={{
                  marginTop: '1.5rem', padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  border: 'none', borderRadius: '100px', color: 'white',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                }}
              >
                Ver Servicios →
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '1rem', padding: '1.25rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Icono */}
                <div style={{
                  width: '52px', height: '52px', flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.2))',
                  borderRadius: '0.75rem', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem',
                }}>
                  {item.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none', border: 'none', color: '#f87171',
                        cursor: 'pointer', fontSize: '1rem', padding: '0 0.25rem',
                        opacity: 0.7, transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>

                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                    {item.desc.slice(0, 60)}...
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Cantidad */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white', cursor: 'pointer', fontSize: '1rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)',
                          color: '#a855f7', cursor: 'pointer', fontSize: '1rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Precio */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '1.1rem', fontWeight: 800,
                        background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
                        {(item.price * item.quantity).toLocaleString('es-ES')}€
                      </span>
                      {item.suffix && (
                        <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                          {item.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con total y checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.3)',
            position: 'sticky', bottom: 0,
          }}>
            {/* Resumen */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Subtotal</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{totalPrice.toLocaleString('es-ES')}€</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>IVA (21%)</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Incluido</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)',
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>TOTAL</span>
                <span style={{
                  fontSize: '1.4rem', fontWeight: 900,
                  background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {totalPrice.toLocaleString('es-ES')}€
                </span>
              </div>
            </div>

            {/* Alerta de error/fallback */}
            {paymentStatus === 'error' && (
              <div style={{
                background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)',
                borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1rem',
                fontSize: '0.8rem', color: '#fb923c', textAlign: 'center',
              }}>
                ⚠️ Redirigido a WhatsApp. También puedes escribirnos directamente.
              </div>
            )}

            {/* Botón pago */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%', padding: '1rem', borderRadius: '1rem',
                background: loading
                  ? 'rgba(168,85,247,0.3)'
                  : 'linear-gradient(135deg, #a855f7, #3b82f6)',
                border: 'none', color: 'white', fontWeight: 800,
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.75rem', transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(168,85,247,0.35)',
                marginBottom: '0.75rem',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', display: 'inline-block',
                  }} />
                  Procesando pago seguro...
                </>
              ) : (
                <>🔐 Pagar con Stripe — {totalPrice.toLocaleString('es-ES')}€</>
              )}
            </button>

            {/* Vaciar carrito */}
            <button
              onClick={clearCart}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '0.75rem',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                e.currentTarget.style.color = '#f87171';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              🗑️ Vaciar carrito
            </button>

            {/* Seguridad */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', marginTop: '1rem',
              color: '#64748b', fontSize: '0.75rem',
            }}>
              <span>🔒</span>
              <span>Pago cifrado SSL · Procesado por Stripe</span>
            </div>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
