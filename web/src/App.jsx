import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CollarTelemetry from './components/CollarTelemetry';
import AiHealthAssistant from './components/AiHealthAssistant';
import PetVoiceTranslator from './components/PetVoiceTranslator';
import VetDirectory from './components/VetDirectory';
import PetSocial from './components/PetSocial';
import PetStore from './components/PetStore';
import MedicalVault from './components/MedicalVault';
import SimulationControls from './components/SimulationControls';
import NutritionLog from './components/NutritionLog';
import SettingsPage from './components/SettingsPage';
import AuthScreen from './components/AuthScreen';
import DevicePairingWizard from './components/DevicePairingWizard';
import LostPetBroadcastModal from './components/LostPetBroadcastModal';
import PetProfileEdit from './components/PetProfileEdit';
import { INITIAL_PETS } from './data/mockData';
import {
  fetchPetsFromApi, createPetOnApi, startTelemetryPolling
} from './services/api';
import { X, CheckCircle2, AlertTriangle, Volume2, Bot, Navigation, ShieldAlert } from 'lucide-react';
import { playTabClick, playCollarBeep, playSuccessChime, playDispenseSound } from './utils/soundEffects';

export default function App() {
  const [appStage, setAppStage] = useState('app'); // 'auth' | 'pairing' | 'app'
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@petlify.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    accountType: 'Pet Parent Premium'
  });

  const [pets, setPets] = useState(INITIAL_PETS);
  const [activePetId, setActivePetId] = useState('pet-1');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLocateBuzzerActive, setIsLocateBuzzerActive] = useState(false);
  const [isLostPetModalOpen, setIsLostPetModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const activePet = pets.find(p => p.id === activePetId) || pets[0];

  // ── Boot: load pets from backend ──────────────────────────────────────────
  useEffect(() => {
    fetchPetsFromApi().then(apiPets => {
      if (apiPets && apiPets.length > 0) setPets(apiPets);
    });
  }, []);

  // ── Live Telemetry Polling (every 5s when collar connected) ───────────────
  useEffect(() => {
    if (!activePet?.collarConnected) return;
    const intervalId = startTelemetryPolling(activePet.id, (telemetry) => {
      setPets(prev => prev.map(p => {
        if (p.id === activePet.id) {
          return {
            ...p,
            battery: telemetry.battery || p.battery,
            vitals: { ...p.vitals, ...telemetry.vitals }
          };
        }
        return p;
      }));
    }, 5000);
    return () => clearInterval(intervalId);
  }, [activePet?.id, activePet?.collarConnected]);

  // ── Fallback: local BPM fluctuation if backend offline ───────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setPets(prev => prev.map(pet => {
        if (!pet.collarConnected) return pet;
        const delta = Math.floor(Math.random() * 5) - 2;
        return {
          ...pet,
          vitals: {
            ...pet.vitals,
            heartRate: Math.min(135, Math.max(65, pet.vitals.heartRate + delta))
          }
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Toast System ──────────────────────────────────────────────────────────
  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [{ id, ...toast }, ...prev].slice(0, 5));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const handleTabChange = (newTab) => {
    playTabClick();
    setActiveTab(newTab);
  };

  // ── Collar Actions ────────────────────────────────────────────────────────
  const handleLocateBuzzer = () => {
    playCollarBeep();
    setIsLocateBuzzerActive(v => !v);
    if (!isLocateBuzzerActive) {
      addToast({ type: 'warning', title: '🔔 Collar Beeper Active', message: `${activePet.name}'s collar is emitting audio & LED strobe beacon.` });
    }
  };

  const handleSyncCollar = () => {
    playSuccessChime();
    addToast({ type: 'success', title: 'Telemetry Synced', message: `All vitals & GPS refreshed for ${activePet.name}.` });
  };

  // ── Pet Update Helper (for SimulationControls) ────────────────────────────
  const updatePetState = useCallback((updates) => {
    setPets(prev => prev.map(p => p.id === activePetId ? { ...p, ...updates } : p));
  }, [activePetId]);

  const triggerAlertNotif = useCallback((title, message) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const onResetSimulation = useCallback(() => {
    setPets(INITIAL_PETS);
    addToast({ type: 'success', title: 'Simulation Reset', message: 'All collar vitals restored to baseline.' });
  }, [addToast]);

  // ── Pairing Complete ──────────────────────────────────────────────────────
  const handlePairingComplete = async (newPet) => {
    playSuccessChime();
    setPets(prev => [newPet, ...prev]);
    setActivePetId(newPet.id);
    setAppStage('app');
    await createPetOnApi(newPet);
    addToast({ type: 'success', title: '🎉 New Collar Paired!', message: `${newPet.name}'s smart collar is now streaming live.` });
  };

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = (product) => {
    playSuccessChime();
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast({ type: 'info', title: 'Added to Cart 🛒', message: `${product.name} added to your bag.` });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, delta) => setCart(prev =>
    prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0)
  );
  const clearCart = () => setCart([]);

  // ── Auth / Pairing Guard ──────────────────────────────────────────────────
  if (appStage === 'auth' || !user) {
    return (
      <AuthScreen
        onLoginSuccess={(loggedInUser, newPet) => {
          setUser(loggedInUser);
          if (newPet) {
            setPets(prev => [newPet, ...prev]);
            setActivePetId(newPet.id);
            createPetOnApi(newPet);
            addToast({
              type: 'success',
              title: `🎉 Welcome, ${newPet.name}!`,
              message: `Smart collar telemetry and personalized care baseline generated.`
            });
          }
          setAppStage('app');
          playSuccessChime();
        }}
        onStartPairingDirectly={() => { setAppStage('pairing'); playTabClick(); }}
      />
    );
  }

  if (appStage === 'pairing') {
    return (
      <DevicePairingWizard
        onPairingComplete={handlePairingComplete}
        onCancel={() => setAppStage('app')}
      />
    );
  }

  return (
    <div className="app-layout">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        activePet={activePet}
        isSimulatingAlert={activePet?.location?.status === 'alert'}
      />

      <div className="main-content">
        {/* ── Navbar ──────────────────────────────────────────────── */}
        <Navbar
          user={user}
          pets={pets}
          activePet={activePet}
          setActivePet={(p) => { setActivePetId(p.id); playTabClick(); }}
          onStartPairing={() => setAppStage('pairing')}
          onLogout={() => { setUser(null); setAppStage('auth'); }}
          onTriggerLostPetSos={() => setIsLostPetModalOpen(true)}
          onEditProfile={() => setIsEditProfileOpen(true)}
        />

        {/* ── Main Content Area ────────────────────────────────────── */}
        <main className="content-area" style={{ paddingBottom: '5rem' }}>

          {activeTab === 'dashboard' && (
            <Dashboard
              pet={activePet}
              setActiveTab={handleTabChange}
              onTriggerLocateBuzzer={handleLocateBuzzer}
              onSyncCollar={handleSyncCollar}
              isLocateBuzzerActive={isLocateBuzzerActive}
              onEditProfile={() => setIsEditProfileOpen(true)}
            />
          )}

          {activeTab === 'telemetry' && (
            <CollarTelemetry
              pet={activePet}
              onTriggerLocateBuzzer={handleLocateBuzzer}
              isLocateBuzzerActive={isLocateBuzzerActive}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AiHealthAssistant pet={activePet} setActiveTab={handleTabChange} />
          )}

          {activeTab === 'voice-translator' && (
            <PetVoiceTranslator pet={activePet} />
          )}

          {activeTab === 'nutrition' && (
            <NutritionLog pet={activePet} />
          )}

          {activeTab === 'vets' && (
            <VetDirectory activePet={activePet} pets={pets} />
          )}

          {activeTab === 'social' && (
            <PetSocial activePet={activePet} />
          )}

          {activeTab === 'shop' && (
            <PetStore
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
              clearCart={clearCart}
            />
          )}

          {activeTab === 'medical' && (
            <MedicalVault pet={activePet} setActiveTab={handleTabChange} />
          )}

          {activeTab === 'simulator' && (
            <SimulationControls
              pets={pets}
              setPets={setPets}
              activePetId={activePetId}
              addToast={addToast}
              updatePetState={updatePetState}
              triggerAlertNotif={triggerAlertNotif}
              onResetSimulation={onResetSimulation}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage user={user} activePet={activePet} />
          )}

        </main>
      </div>

      {/* ── Floating Speed Dial Dock ─────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(10, 15, 26, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '9999px',
        padding: '0.45rem 1rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        boxShadow: '0 12px 30px rgba(0,0,0,0.6), 0 0 20px rgba(16,185,129,0.2)',
        zIndex: 90
      }}>
        <button onClick={() => setIsLostPetModalOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          background: 'rgba(244,63,94,0.18)', border: '1px solid var(--accent-rose)',
          color: 'var(--accent-rose)', padding: '0.35rem 0.75rem',
          borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
        }}>
          <ShieldAlert size={14} /> Lost Pet SOS
        </button>

        <button onClick={handleLocateBuzzer} style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          background: isLocateBuzzerActive ? 'var(--accent-rose)' : 'rgba(255,255,255,0.07)',
          border: '1px solid var(--border-color)', color: '#FFF',
          padding: '0.35rem 0.75rem', borderRadius: '9999px',
          fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
        }}>
          <Volume2 size={14} color="var(--accent-emerald)" />
          {isLocateBuzzerActive ? 'Stop Beep' : 'Locate'}
        </button>

        <button onClick={() => handleTabChange('voice-translator')} style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          background: activeTab === 'voice-translator' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${activeTab === 'voice-translator' ? 'var(--accent-purple)' : 'var(--border-color)'}`,
          color: 'var(--accent-purple)', padding: '0.35rem 0.75rem',
          borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
        }}>
          <Bot size={14} /> Voice AI
        </button>

        <button onClick={() => handleTabChange('telemetry')} style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          background: activeTab === 'telemetry' ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${activeTab === 'telemetry' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
          color: 'var(--accent-cyan)', padding: '0.35rem 0.75rem',
          borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
        }}>
          <Navigation size={14} /> GPS
        </button>
      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}
      {isLostPetModalOpen && (
        <LostPetBroadcastModal
          pet={activePet}
          onClose={() => setIsLostPetModalOpen(false)}
          onBroadcastSuccess={(res) => addToast({ type: 'warning', title: '🚨 SOS Transmitted!', message: res.message })}
        />
      )}

      {isEditProfileOpen && (
        <PetProfileEdit
          pet={activePet}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(updatedPet) => {
            setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
            setIsEditProfileOpen(false);
            addToast({ type: 'success', title: 'Profile Updated ✅', message: `${updatedPet.name}'s profile saved to cloud.` });
          }}
        />
      )}

      {/* ── Toast Stack ─────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: '90px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '0.65rem',
        zIndex: 9999, pointerEvents: 'none', maxWidth: '360px'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} className="glass-panel" style={{
            pointerEvents: 'auto',
            padding: '0.85rem 1rem',
            background: 'rgba(10,15,26,0.95)',
            backdropFilter: 'blur(18px)',
            borderColor: toast.type === 'warning' ? 'var(--accent-rose)' : toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            animation: 'slideUp 0.25s ease'
          }}>
            <div style={{ color: toast.type === 'warning' ? 'var(--accent-rose)' : toast.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-cyan)', marginTop: '2px', flexShrink: 0 }}>
              {toast.type === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.15rem' }}>{toast.title}</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>{toast.message}</p>
            </div>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
