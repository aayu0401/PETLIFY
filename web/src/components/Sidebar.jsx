import React from 'react';
import { 
  LayoutDashboard, 
  Navigation,
  Stethoscope, 
  ShoppingBag, 
  FileText, 
  Sliders, 
  Battery, 
  Wifi,
  Sparkles,
  ShieldAlert,
  Bot,
  Users,
  Mic,
  HeartPulse,
  Settings,
  Utensils
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, activePet, isSimulatingAlert }) {
  const navGroups = [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { 
          id: 'telemetry', 
          label: 'GPS & Collar', 
          icon: Navigation, 
          badge: activePet?.collarConnected ? 'LIVE' : 'OFF',
          badgeClass: activePet?.collarConnected ? 'badge-safe' : 'badge-danger'
        },
      ]
    },
    {
      label: 'Health & AI',
      items: [
        { id: 'ai-assistant', label: 'AI Vet Assistant', icon: Bot, badge: 'AI', badgeClass: 'badge-safe' },
        { id: 'voice-translator', label: 'Pet Voice AI', icon: Mic, badge: 'BETA', badgeClass: 'badge-cyan' },
        { id: 'medical', label: 'Medical Vault', icon: FileText },
        { id: 'nutrition', label: 'Nutrition & Diet', icon: Utensils, badge: 'NEW', badgeClass: 'badge-cyan' },
        { id: 'vets', label: 'Vet Directory', icon: Stethoscope },
      ]
    },
    {
      label: 'Community',
      items: [
        { id: 'social', label: 'Pet Social', icon: Users },
        { id: 'shop', label: 'Pet Shop', icon: ShoppingBag },
      ]
    },
    {
      label: 'System',
      items: [
        { id: 'simulator', label: 'Collar Simulator', icon: Sliders, badge: 'DEV', badgeClass: 'badge-warning' },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1rem 0.75rem',
      flexShrink: 0,
      zIndex: 20,
      overflowY: 'auto'
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.25rem 0.5rem 1rem 0.5rem',
          marginBottom: '0.75rem',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            color: '#FFFFFF',
            flexShrink: 0
          }}>
            <HeartPulse size={19} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.2rem', 
                fontWeight: 800, 
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em'
              }}>
                Petlify
              </span>
              <Sparkles size={12} color="#10B981" />
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Smart Collar Ecosystem
            </span>
          </div>
        </div>

        {/* Alert banner */}
        {isSimulatingAlert && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.65rem',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#F87171',
            fontSize: '0.75rem',
            fontWeight: 600,
            animation: 'pulse 1.5s infinite'
          }}>
            <ShieldAlert size={14} />
            <span>Geo Alert Active</span>
          </div>
        )}

        {/* Navigation Groups */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {navGroups.map((group) => (
            <div key={group.label}>
              <div style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 0.5rem',
                marginBottom: '0.35rem'
              }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        color: isActive ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        outline: isActive ? '1px solid rgba(16,185,129,0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Icon size={16} color={isActive ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`badge ${item.badgeClass}`} style={{ fontSize: '0.58rem', padding: '0.1rem 0.3rem' }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Smart Collar Status Footer */}
      {activePet && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '0.85rem',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Collar
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div className={`pulse-dot ${activePet.collarConnected ? 'green' : 'red'}`} />
              <span style={{ fontSize: '0.65rem', color: activePet.collarConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 700 }}>
                {activePet.collarConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {activePet.collarId}
          </div>

          {/* Battery Bar */}
          <div style={{ marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <span>Battery</span>
              <span style={{ color: activePet.battery < 20 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 700 }}>
                {activePet.battery}%
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{
                width: `${activePet.battery}%`,
                background: activePet.battery < 20
                  ? 'var(--accent-rose)'
                  : 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <Wifi size={11} color="var(--accent-cyan)" />
            <span>4G LTE + GPS Lock</span>
          </div>
        </div>
      )}
    </aside>
  );
}
