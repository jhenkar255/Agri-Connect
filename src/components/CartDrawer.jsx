import React, { useState } from 'react';
import { 
  X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Check, 
  CreditCard, QrCode, Building, Truck, Download, Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../data/languages';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onClearCart,
  currentLang = 'en'
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'shipping' | 'payment' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  // Shipping details state
  const [shippingInfo, setShippingInfo] = useState({
    name: 'Ananya Sharma',
    company: 'Metro Fresh Foods Private Ltd.',
    phone: '+91 98860 44521',
    address: 'Warehouse Bay 4, Yeshwanthpur Wholesale Yard',
    city: 'Bengaluru',
    pincode: '560022',
    state: 'Karnataka'
  });

  if (!isOpen) return null;

  // Subtotal calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const mandiCess = 0; // 0% on direct farmer purchase
  const deliveryFee = subtotal > 0 ? (subtotal > 2000 ? 0 : 150) : 0;
  const totalPayable = subtotal + mandiCess + deliveryFee;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const randomId = 'AGRI-ORD-2026-' + Math.floor(1000 + Math.random() * 9000);
    setLastOrderId(randomId);

    // Record order in MongoDB Atlas
    try {
      const orderPayload = {
        orderId: randomId,
        customerName: shippingInfo.name || 'Ananya Sharma',
        customerPhone: shippingInfo.phone || '+91 98860 44521',
        shippingAddress: shippingInfo,
        items: cartItems.map(item => ({
          id: String(item.id || ''),
          title: item.title || 'Agri Item',
          price: item.price || 0,
          quantity: item.quantity || 1,
          unit: item.unit || 'kg',
          category: item.category || 'Produce',
          image: item.image || ''
        })),
        subtotal,
        deliveryFee,
        totalPayable,
        paymentMethod
      };
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      }).catch(() => {});
    } catch (e) {}

    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }
    }, 1200);
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--slate-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--primary-700)" />
            <h3 style={{ fontSize: '1.15rem' }}>
              {checkoutStep === 'cart' && `${t.cartDrawerTitle || 'Your Cart'} (${cartItems.length})`}
              {checkoutStep === 'shipping' && 'Delivery Destination'}
              {checkoutStep === 'payment' && 'Secure Indian Payment Gateway'}
              {checkoutStep === 'success' && 'Order Confirmed!'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: CART ITEMS LIST */}
        {checkoutStep === 'cart' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--slate-400)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ fontSize: '1rem', fontWeight: 600 }}>{t.cartEmptyMessage || 'Your agricultural cart is empty'}</p>
                  <small>{t.cartDrawerTitle || 'Browse fresh produce or farm inputs from the marketplace'}</small>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '10px', background: '#fff', border: '1px solid var(--slate-200)' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/crop_biomass_hero.jpg';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.92rem', marginBottom: '2px', color: 'var(--dark-900)' }}>{item.name}</h4>
                        <small style={{ color: 'var(--slate-600)', fontSize: '0.74rem' }}>Seller: {item.seller}</small>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--primary-800)', fontSize: '0.94rem' }}>
                            ₹{item.price} <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', fontWeight: 400 }}>/{item.unit}</span>
                          </span>

                          {/* Qty controller */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--slate-300)', borderRadius: '6px', overflow: 'hidden' }}>
                              <button 
                                onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                                style={{ padding: '2px 8px', border: 'none', background: 'var(--slate-100)', cursor: 'pointer' }}
                              >-</button>
                              <span style={{ padding: '0 8px', fontSize: '0.84rem', fontWeight: 600 }}>{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                style={{ padding: '2px 8px', border: 'none', background: 'var(--slate-100)', cursor: 'pointer' }}
                              >+</button>
                            </div>

                            <button 
                              onClick={() => onRemoveItem(item.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary Bottom */}
            {cartItems.length > 0 && (
              <div style={{ padding: '20px', borderTop: '1px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t.cartSubtotalLabel || 'Items Subtotal:'}</span>
                    <strong style={{ color: 'var(--dark-900)' }}>₹{subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>APMC Mandi Fee / Cess:</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>₹0 (Direct Trade Exempt)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{t.cartDeliveryLabel || 'Direct Farm Transport:'}</span>
                    <span>{deliveryFee === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed var(--slate-300)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark-900)' }}>
                    <span>{t.cartTotalLabel || 'Total Amount:'}</span>
                    <span style={{ color: 'var(--primary-800)', fontFamily: 'var(--font-heading)' }}>₹{totalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setCheckoutStep('shipping')}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>{t.btnProceedCheckout || 'Proceed to Delivery Details'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: SHIPPING / DELIVERY FORM */}
        {checkoutStep === 'shipping' && (
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Receiver / Business Name:</label>
                <input
                  type="text"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Company / Restaurant / Retailer:</label>
                <input
                  type="text"
                  value={shippingInfo.company}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, company: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Phone Number:</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Delivery Address / Cold Storage Bay:</label>
                <textarea
                  rows="2"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>City:</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>PIN Code:</label>
                  <input
                    type="text"
                    value={shippingInfo.pincode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>
              </div>

              <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', color: '#065f46', marginTop: '6px' }}>
                <Truck size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Direct cold-chain temperature tracked dispatch arranged from farmer's pickup gate.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setCheckoutStep('cart')} className="btn btn-outline">Back</button>
              <button onClick={() => setCheckoutStep('payment')} className="btn btn-primary" style={{ flex: 1 }}>
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT METHOD */}
        {checkoutStep === 'payment' && (
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-400)' }}>Amount to Pay:</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="badge badge-green">100% Escrow Protected</span>
              </div>

              {/* Payment Options Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* UPI Option */}
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'upi' ? 'var(--primary-600)' : 'var(--slate-200)',
                    background: paymentMethod === 'upi' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="payOpt"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    style={{ accentColor: 'var(--primary-600)' }}
                  />
                  <QrCode size={22} color="var(--primary-700)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Instant UPI (GPay / PhonePe / Paytm / BHIM)</div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.74rem' }}>Zero transaction charge • Instant settlement to farmer</small>
                  </div>
                </label>

                {/* Card Option */}
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'card' ? 'var(--primary-600)' : 'var(--slate-200)',
                    background: paymentMethod === 'card' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="payOpt"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={{ accentColor: 'var(--primary-600)' }}
                  />
                  <CreditCard size={22} color="var(--primary-700)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Credit / Debit / Kisan RuPay Card</div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.74rem' }}>RuPay, Visa, Mastercard accepted</small>
                  </div>
                </label>

                {/* NetBanking Option */}
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'netbanking' ? 'var(--primary-600)' : 'var(--slate-200)',
                    background: paymentMethod === 'netbanking' ? 'var(--primary-50)' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="payOpt"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    style={{ accentColor: 'var(--primary-600)' }}
                  />
                  <Building size={22} color="var(--primary-700)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Net Banking (All Indian Banks)</div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.74rem' }}>SBI, HDFC, Canara, ICICI, PNB</small>
                  </div>
                </label>

              </div>

              {/* UPI QR Simulation Box */}
              {paymentMethod === 'upi' && (
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ width: '130px', height: '130px', margin: '0 auto 10px', background: '#f8fafc', border: '1px dashed #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <QrCode size={80} color="var(--dark-800)" />
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '-4px' }}>BHIM UPI 2.0</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--slate-600)' }}>Scan with any UPI App or click Confirm to simulate payment</span>
                </div>
              )}

            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setCheckoutStep('shipping')} className="btn btn-outline">Back</button>
              <button 
                onClick={handlePlaceOrder} 
                disabled={isProcessing}
                className="btn btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isProcessing ? 'Verifying Bank Transaction...' : `Confirm & Pay ₹${totalPayable.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED RECEIPT & INVOICE */}
        {checkoutStep === 'success' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Check size={36} />
            </div>

            <h3 style={{ fontSize: '1.35rem', color: '#166534', marginBottom: '4px' }}>
              Order Successfully Paid!
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Transaction ID: <strong>{lastOrderId}</strong>
            </p>

            {/* Official Digital Invoice Receipt Card */}
            <div style={{ background: '#fff', border: '1px solid var(--slate-300)', borderRadius: '12px', padding: '18px', textAlign: 'left', marginBottom: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '10px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--primary-900)' }}>Agri-Connect Direct Trade Receipt</div>
                  <small style={{ color: 'var(--slate-400)', fontSize: '0.72rem' }}>e-Way Bill Reference: EWB-{lastOrderId.split('-')[2]}</small>
                </div>
                <span className="badge badge-green">Paid via UPI</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                <strong>Deliver To:</strong> {shippingInfo.company} ({shippingInfo.name})<br />
                {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
              </div>

              <div style={{ fontSize: '0.8rem', borderTop: '1px dashed var(--slate-200)', paddingTop: '10px' }}>
                {cartItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--slate-200)', fontWeight: 800, fontSize: '0.94rem' }}>
                  <span>Total Settled:</span>
                  <span style={{ color: 'var(--primary-800)' }}>₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={handleDownloadInvoice}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download size={16} />
                <span>Print / Download Tax Invoice (PDF)</span>
              </button>

              <button 
                onClick={() => {
                  onClearCart();
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Done & Return to Market
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
