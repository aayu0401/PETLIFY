import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Plus, 
  Radio, 
  User, 
  Sparkles, 
  Check, 
  X, 
  BatteryCharging,
  Volume2,
  VolumeX,
  Smile,
  ShieldAlert,
  Server
} from 'lucide-react';
import { setSoundEnabled, isSoundEnabled, playTabClick } from '../utils/soundEffects';
import { checkBackendHealth } from '../services/api';

export default function Navbar({ 
  user, 
  pets, 
  activePet, 
  setActivePet, 
  onStartPairing, 
  onLogout,
  onTriggerLostPetSos,
  onEditProfile
}) {
  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Safe Geofence Active', desc: `${activePet.name} is comfortably inside Home Safe Zone.`, time: '10m ago', unread: true },
    { id: 2, title: 'Vitals Sync Complete', desc: 'Heart rate baseline (82 BPM) recorded successfully.', time: '25m ago', unread: false },
    { id: 3, title: 'Upcoming Booster', desc: `DHPP Vaccine for ${activePet.name} due next month.`, time: '2h ago', unread: false }
  ]);

  useEffect(() => {
    checkBackendHealth().then(res => {
      setIsBackendOnline(res.status === 'online');
    });
  }, []);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) playTabClick();
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="navbar">
      
      {/* Left: Active Pet Selector Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsPetDropdownOpen(!isPetDropdownOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={activePet.avatar} 
                alt={activePet.name} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div className="pulse-dot green" style={{ position: 'absolute', bottom: '-2px', right: '-2px' }} />
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.2 }}>{activePet.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                {activePet.breed} • 🐾 Joyful
              </div>
            </div>

            <ChevronDown size={16} color="var(--text-secondary)" />
          </button>

          {/* Pet Switcher Dropdown Menu */}
          {isPetDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '260px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Your Pets ({pets.length})
              </div>

              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => {
                    setActivePet(pet);
                    setIsPetDropdownOpen(false);
                    playTabClick();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: pet.id === activePet.id ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img src={pet.avatar} alt={pet.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{pet.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{pet.breed}</div>
                    </div>
                  </div>
                  {pet.id === activePet.id && <Check size={16} color="var(--accent-emerald)" />}
                </button>
              ))}

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.3rem', paddingTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button
                  onClick={() => {
                    setIsPetDropdownOpen(false);
                    onStartPairing();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <Sparkles size={15} /> Add Pet via Intake Wizard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Backend Cloud API Status Pill */}
        <div className="badge badge-safe" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Server size={12} />
          <span>{isBackendOnline ? 'Cloud Backend API Online' : 'Local Offline Mode'}</span>
        </div>
      </div>

      {/* Right Action Icons: SOS Lost Pet, Audio Toggle, Notifications & Account */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* Lost Pet Community SOS Broadcast Trigger */}
        <button
          onClick={onTriggerLostPetSos}
          className="btn-danger"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
          title="Broadcast Lost Pet Alert to Nearby Community"
        >
          <ShieldAlert size={15} /> Lost Pet SOS
        </button>

        {/* Web Audio FX Mute / Unmute Toggle Button */}
        <button
          onClick={toggleSound}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: soundOn ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: soundOn ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
            color: soundOn ? 'var(--accent-emerald)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title={soundOn ? "Audio FX: ON (Click to Mute)" : "Audio FX: MUTED (Click to Enable)"}
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Notifications Icon Button */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--accent-rose)',
                color: '#FFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout Drawer */}
          {isNotificationsOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '320px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Smart Alerts</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: n.unread ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: n.unread ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '0.2rem' }}>
                      <span>{n.title}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400 }}>{n.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.3 }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account Profile Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-emerald) 0%, var(--accent-cyan) 100%)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{user?.name || 'Alex Morgan'}</span>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </button>

          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '200px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 100
            }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.3rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user?.name || 'Alex Morgan'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.email || 'alex.morgan@petlify.io'}</div>
              </div>

              {onEditProfile && (
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onEditProfile();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <User size={14} color="var(--accent-cyan)" /> Edit {activePet?.name}'s Profile
                </button>
              )}

              <button
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-rose)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                Sign Out / Switch Account
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
