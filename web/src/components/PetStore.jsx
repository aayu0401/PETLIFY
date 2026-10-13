import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Tag, 
  Plus, 
  Check, 
  Filter, 
  Eye, 
  X, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ShoppingBasket,
  Sliders,
  Radio,
  Type,
  Ruler
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRODUCTS_STORE } from '../data/mockData';

export default function PetStore({ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, clearCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // Smart Collar Customizer State
  const [customEngravingText, setCustomEngravingText] = useState('MAX • (555) 234-9001');
  const [collarMaterial, setCollarMaterial] = useState('Reflective Carbon Weave');
  const [collarSize, setCollarSize] = useState('Large (18" - 26")');
  const [collarLedAccent, setCollarLedAccent] = useState('#10B981');

  const categories = ['All', 'Smart Wearables', 'Nutrition & Food', 'Interactive Toys', 'Grooming & Care', 'Collars & Leashes', 'Gear & Beds'];

  const filteredProducts = PRODUCTS_STORE.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'PETLIFY20') {
      setDiscountPercent(20);
    } else {
      alert("Invalid Code. Try typing 'PETLIFY20' for 20% OFF!");
    }
  };

  const handleAddCustomCollarToCart = () => {
    const customCollarItem = {
      id: 'prod-custom-' + Date.now(),
      name: `Petlify Pro v3 Custom Laser-Engraved (${collarSize.split(' ')[0]})`,
      category: 'Smart Wearables',
      price: 139.99,
      rating: 5.0,
      image: '/collar_banner.jpg',
      description: `Custom Engraving: "${customEngravingText}" • Material: ${collarMaterial} • Size: ${collarSize}`,
      isBestSeller: true
    };
    addToCart(customCollarItem);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsCheckoutSuccess(true);
    clearCart();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Store Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.14) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderColor: 'rgba(249, 115, 22, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'var(--accent-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 6px 20px rgba(249, 115, 22, 0.35)'
            }}>
              <ShoppingBag size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Petlify Gear, Accessories & Smart Collars</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Next-gen smart collars, laser-engraved hardware, organic wellness nutrition & interactive toys
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="badge badge-warning" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
              <Sparkles size={14} /> Code <strong>PETLIFY20</strong> for 20% OFF
            </div>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <ShoppingBasket size={18} /> Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 1rem',
            gap: '0.75rem'
          }}>
            <Search size={20} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search products by title, collar type, food, toys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                width: '100%'
              }}
            />
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  border: selectedCategory === cat ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedCategory === cat ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTERACTIVE SMART COLLAR 3D / 2D LASER ENGRAVER CUSTOMIZER */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1.5fr)',
        gap: '2rem',
        alignItems: 'center'
      }}>
        {/* Left: Custom Collar Laser Engraving Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            width: '100%',
            height: '240px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #090E17 0%, #172033 100%)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 30px rgba(16, 185, 129, 0.25)'
          }}>
            {/* Ambient Background Glow */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: collarLedAccent,
              opacity: 0.15,
              filter: 'blur(30px)'
            }} />

            {/* Collar Mockup Image */}
            <img 
              src="/collar_banner.jpg" 
              alt="Smart Collar Customizer" 
              style={{ width: '85%', height: '140px', objectFit: 'contain', zIndex: 5 }} 
            />

            {/* Laser Engraved Titanium Buckle Tag Overlay */}
            <div style={{
              background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              padding: '0.35rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#F9FAFB',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              zIndex: 10,
              marginTop: '-15px'
            }}>
              <Sparkles size={14} color="var(--accent-emerald)" />
              <span>{customEngravingText || 'PET NAME • PHONE NUMBER'}</span>
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ✨ Live Optical Laser Engraving Preview (Titanium Hardware Tag)
          </span>
        </div>

        {/* Right: Customizer Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span className="badge badge-safe" style={{ marginBottom: '0.4rem' }}>Flagship Wearable</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Petlify Ultra Collar Pro v3 (Custom Engraved)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              24/7 Optical Heart Rate Sensor, Real-Time GPS Geofencing, IP68 Waterproof & Laser Engraved ID.
            </p>
          </div>

          {/* Text Engraving Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Custom Laser Engraving Text
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 0.85rem',
              gap: '0.5rem'
            }}>
              <Type size={16} color="var(--accent-emerald)" />
              <input 
                type="text" 
                maxLength={30}
                placeholder="e.g. MAX • (555) 234-9001"
                value={customEngravingText}
                onChange={(e) => setCustomEngravingText(e.target.value.toUpperCase())}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.05em' }}
              />
            </div>
          </div>

          {/* Material & Size Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Strap Material
              </label>
              <select
                value={collarMaterial}
                onChange={(e) => setCollarMaterial(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
              >
                <option value="Reflective Carbon Weave">Reflective Carbon Weave</option>
                <option value="Tactical Ballistic Nylon">Tactical Ballistic Nylon</option>
                <option value="Waterproof Bio-Thane Cyber">Waterproof Cyber Bio-Thane</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Size & Fit
              </label>
              <select
                value={collarSize}
                onChange={(e) => setCollarSize(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
              >
                <option value='Small (10" - 14")'>Small (10" - 14" neck)</option>
                <option value='Medium (14" - 18")'>Medium (14" - 18" neck)</option>
                <option value='Large (18" - 26")'>Large (18" - 26" neck)</option>
                <option value='XL (24" - 32")'>XL (24" - 32" neck)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
              $139.99
            </div>

            <button
              onClick={handleAddCustomCollarToCart}
              className="btn-primary"
              style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
            >
              <Plus size={18} /> Add Custom Collar to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredProducts.map(product => {
          const inCart = cart.find(i => i.id === product.id);
          return (
            <div key={product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Product Image & Badges */}
                <div style={{
                  height: '200px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1rem',
                  background: '#0F172A'
                }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {product.isBestSeller && (
                    <span className="badge badge-warning" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      Best Seller
                    </span>
                  )}

                  <span className="badge badge-cyan" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    {product.tag}
                  </span>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#FFF',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Quick View"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  {product.category}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {product.name}
                </h3>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <Star size={15} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontWeight: 700 }}>{product.rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.reviews} reviews)</span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description}
                </p>
              </div>

              {/* Price & Add To Cart Button */}
              <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
                    ${product.price.toFixed(2)}
                  </div>
                  {product.originalPrice && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className={inCart ? "btn-secondary" : "btn-primary"}
                  style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
                >
                  {inCart ? <Check size={16} color="var(--accent-emerald)" /> : <Plus size={16} />}
                  {inCart ? `In Cart (${inCart.quantity})` : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ height: '260px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div>
                <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>{selectedProduct.category}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{selectedProduct.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontWeight: 700 }}>{selectedProduct.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({selectedProduct.reviews} verified buyer reviews)</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {selectedProduct.description}
                </p>

                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: '1.25rem' }}>
                  ${selectedProduct.price.toFixed(2)}
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                    setIsCartOpen(true);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ShoppingBag size={18} /> Add to Cart & Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Slide-Over */}
      {isCartOpen && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
          <div style={{
            width: '420px',
            maxWidth: '100%',
            height: '100vh',
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.75rem 1.5rem',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={22} color="var(--accent-orange)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Your Petlify Cart</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Cart Item List */}
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                  <ShoppingBasket size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 600 }}>Your cart is empty</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Add custom collars, organic food or toys!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '50vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>${item.price.toFixed(2)}</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '22px', height: '22px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '22px', height: '22px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', alignSelf: 'flex-start' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer Summary */}
            {cart.length > 0 && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                
                {/* Promo Code Input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Promo Code (PETLIFY20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ flex: 1, padding: '0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                  />
                  <button onClick={handleApplyPromo} className="btn-secondary" style={{ fontSize: '0.78rem' }}>Apply</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)' }}>
                      <span>Discount (20% OFF)</span>
                      <strong>-${discountAmount.toFixed(2)}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Express Pet Shipping</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>FREE</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800, paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span>Grand Total</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Complete Order & Pay ${grandTotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {isCheckoutSuccess && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <Check size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>Thank You for Your Order!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your Petlify delivery is confirmed. Express shipping tracking will be linked to your smart collar notifications.
            </p>

            <button onClick={() => { setIsCheckoutSuccess(false); setIsCartOpen(false); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Back to Pet Care Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
