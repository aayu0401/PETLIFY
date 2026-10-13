import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Dog, 
  Cat, 
  Zap,
  CheckCircle2,
  Activity,
  MapPin,
  Heart,
  Phone,
  Home,
  Syringe,
  AlertTriangle,
  Scale,
  Utensils,
  Moon,
  Compass,
  Check,
  Plus,
  X,
  Bot,
  Battery,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { playTabClick, playSuccessChime, playCollarBeep } from '../utils/soundEffects';

const POPULAR_DOG_BREEDS = [
  'Golden Retriever', 'French Bulldog', 'German Shepherd', 
  'Labrador Retriever', 'Poodle', 'Beagle', 'Rottweiler', 
  'Siberian Husky', 'Dachshund', 'Border Collie'
];

const POPULAR_CAT_BREEDS = [
  'Persian Cat', 'Maine Coon', 'British Shorthair', 
  'Siamese', 'Ragdoll', 'Bengal', 'Sphynx', 'American Shorthair'
];

const ALLERGIES_LIST = [
  'Chicken', 'Beef', 'Dairy Products', 'Grain / Wheat', 
  'Flea Saliva', 'Pollen / Dust Mites', 'Soy', 'Egg', 'None'
];

const PRESET_AVATARS = [
  { id: 'a1', type: 'dog', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', label: 'Golden' },
  { id: 'a2', type: 'dog', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400', label: 'Frenchie' },
  { id: 'a3', type: 'dog', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400', label: 'Husky' },
  { id: 'a4', type: 'dog', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400', label: 'Puppy' },
  { id: 'a5', type: 'cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', label: 'Persian' },
  { id: 'a6', type: 'cat', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400', label: 'Tabby' },
];

export default function AuthScreen({ onLoginSuccess, onStartPairingDirectly }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [wizardStep, setWizardStep] = useState(1);
  const totalSteps = 5;

  // Login Form State
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // ── Questionnaire Wizard State ──
  // Step 1: Owner Profile
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');

  // Step 2: Pet Basics
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('dog');
  const [petBreed, setPetBreed] = useState('Golden Retriever');
  const [petGender, setPetGender] = useState('Male');
  const [isNeutered, setIsNeutered] = useState('Yes');
  const [petAgeYears, setPetAgeYears] = useState('2');
  const [petAgeMonths, setPetAgeMonths] = useState('4');
  const [microchip, setMicrochip] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Step 3: Vitals & Health Baseline
  const [currentWeight, setCurrentWeight] = useState('24.5');
  const [targetWeight, setTargetWeight] = useState('24.0');
  const [activityLevel, setActivityLevel] = useState('Moderate (1-2 hrs daily walk)');
  const [selectedAllergies, setSelectedAllergies] = useState(['None']);
  const [customAllergy, setCustomAllergy] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('None reported. Routine vaccines up to date.');
  const [primaryVetClinic, setPrimaryVetClinic] = useState('Paws & Claws Veterinary Hospital');
  const [primaryVetPhone, setPrimaryVetPhone] = useState('(555) 349-2810');

  // Step 4: Daily Nutrition & Lifestyle
  const [dietType, setDietType] = useState('Dry Kibble (High Protein)');
  const [feedingTimes, setFeedingTimes] = useState('2 Times / Day (8:00 AM & 6:00 PM)');
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState('480');
  const [waterSource, setWaterSource] = useState('Smart Fountain with UV filter');
  const [sleepStyle, setSleepStyle] = useState('Calm & Deep Sleeper (8+ hrs)');
  const [nightRestlessness, setNightRestlessness] = useState('Low');

  // Step 5: Smart Collar & IoT Beacon Setup
  const [collarModel, setCollarModel] = useState('Petlify Pro GPS + 4G Cellular');
  const [beaconColor, setBeaconColor] = useState('#10B981'); // Emerald
  const [geofenceRadius, setGeofenceRadius] = useState(150);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);

  // Provisioning state
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionMessage, setProvisionMessage] = useState('');

  // Handlers
  const handleQuickDemoLogin = () => {
    playSuccessChime();
    const demoUser = {
      name: 'Alex Morgan',
      email: 'alex.morgan@petlify.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      accountType: 'Pet Parent Premium'
    };
    onLoginSuccess(demoUser);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    playSuccessChime();
    const userObj = {
      name: loginEmail.split('@')[0] || 'Alex Morgan',
      email: loginEmail || 'alex.morgan@petlify.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      accountType: 'Pet Parent Premium'
    };
    onLoginSuccess(userObj);
  };

  const handleToggleAllergy = (allergy) => {
    if (allergy === 'None') {
      setSelectedAllergies(['None']);
      return;
    }
    let updated = selectedAllergies.filter(a => a !== 'None');
    if (updated.includes(allergy)) {
      updated = updated.filter(a => a !== allergy);
    } else {
      updated.push(allergy);
    }
    if (updated.length === 0) updated = ['None'];
    setSelectedAllergies(updated);
  };

  const handleAddCustomAllergy = () => {
    if (!customAllergy.trim()) return;
    const clean = customAllergy.trim();
    let updated = selectedAllergies.filter(a => a !== 'None');
    if (!updated.includes(clean)) {
      updated.push(clean);
    }
    setSelectedAllergies(updated);
    setCustomAllergy('');
  };

  const handleNextStep = () => {
    playTabClick();
    if (wizardStep < totalSteps) {
      setWizardStep(prev => prev + 1);
    } else {
      handleFinalizeSignup();
    }
  };

  const handlePrevStep = () => {
    playTabClick();
    if (wizardStep > 1) {
      setWizardStep(prev => prev - 1);
    }
  };

  const handleFinalizeSignup = () => {
    setIsProvisioning(true);
    playCollarBeep();

    const messages = [
      'Allocating Cloud Database & User Vault...',
      'Synthesizing Optical PPG & Thermistor Calibration...',
      `Generating Safe Zone Geofence (${geofenceRadius}m) for ${petName || 'Your Pet'}...`,
      'Connecting Smart Collar IoT Gateway (Petlify OS v3.4)...',
      'AI Health Baseline Model Ready!'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProvisionProgress(step * 20);
      setProvisionMessage(messages[step - 1] || 'Finalizing Profile...');

      if (step >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          playSuccessChime();
          const finalUser = {
            name: ownerName || 'Pet Parent',
            email: ownerEmail || 'parent@petlify.io',
            phone: ownerPhone || '(555) 234-5678',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            accountType: 'Pet Parent Premium'
          };

          const finalPet = {
            id: 'pet-' + Date.now(),
            name: petName || 'Buddy',
            type: petType,
            breed: petBreed || (petType === 'dog' ? 'Golden Retriever' : 'Persian Cat'),
            age: `${petAgeYears} Yrs ${petAgeMonths} Mos`,
            weight: parseFloat(currentWeight) || 24.5,
            targetWeight: parseFloat(targetWeight) || 24.0,
            gender: petGender,
            neutered: isNeutered,
            microchip: microchip || '985-141-8899',
            avatar: customAvatarUrl || selectedAvatar,
            collarId: 'PET-SMART-' + Math.floor(100 + Math.random() * 900),
            collarConnected: true,
            battery: 98,
            signalStrength: 'Excellent (4G LTE + GPS Lock)',
            beaconColor: beaconColor,
            vitals: {
              heartRate: petType === 'cat' ? 115 : 82,
              bodyTemp: 101.4,
              stepsToday: 4200,
              stepsGoal: petType === 'cat' ? 5000 : 10000,
              caloriesBurned: Math.round((parseFloat(dailyCalorieTarget) || 480) * 0.4),
              sleepHours: '8.5 hrs',
              restlessness: nightRestlessness,
              barkCount: 1,
              scratchCount: 3,
            },
            location: {
              status: 'safe',
              zoneName: 'Home Safe Zone (Radius ' + geofenceRadius + 'm)',
              address: homeAddress || '742 Evergreen Terrace, Springfield',
              lat: 37.7749,
              lng: -122.4194,
              lastSeen: 'Just now',
            },
            diet: `${dietType} (${feedingTimes})`,
            allergies: selectedAllergies,
            medicalNotes: medicalConditions,
            vetClinic: primaryVetClinic,
            vetPhone: primaryVetPhone,
            weightHistory: [
              { date: '2025-11-01', weight: parseFloat(currentWeight) - 0.8 },
              { date: '2025-12-01', weight: parseFloat(currentWeight) - 0.4 },
              { date: '2026-01-01', weight: parseFloat(currentWeight) - 0.2 },
              { date: '2026-02-01', weight: parseFloat(currentWeight) },
            ]
          };

          onLoginSuccess(finalUser, finalPet);
        }, 800);
      }
    }, 450);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(circle at 12% 18%, rgba(16, 185, 129, 0.15) 0%, transparent 40%), radial-gradient(circle at 88% 82%, rgba(6, 182, 212, 0.15) 0%, transparent 40%), var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflowY: 'auto'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: authMode === 'signup' ? '880px' : '1100px',
        zIndex: 10,
        transition: 'all 0.3s ease'
      }}>

        {/* ══ VIEW: LOGIN / DEMO ACCESS ══ */}
        {authMode === 'login' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            {/* Left Brand Banner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                  color: '#FFFFFF'
                }}>
                  <Radio size={30} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                      Petlify
                    </h1>
                    <Sparkles size={22} color="#10B981" />
                  </div>
                  <p style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.92rem' }}>
                    Smart Collar Telemetry & Pet Healthcare Platform
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.3 }}>
                Continuous 24/7 Vitals, GPS Geofencing & AI Vet Care for Your Pet.
              </h2>

              <div className="glass-panel" style={{
                padding: '0.5rem',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), var(--shadow-glow)'
              }}>
                <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src="/collar_banner.jpg" 
                    alt="Petlify Ultra Smart Collar Pro"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    background: 'rgba(7, 10, 17, 0.85)',
                    backdropFilter: 'blur(12px)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="pulse-dot green" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Petlify Collar Pro v3
                      </span>
                    </div>
                    <span className="badge badge-safe" style={{ fontSize: '0.65rem' }}>
                      4G LTE + Optical PPG
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Heart size={20} color="var(--accent-rose)" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Real-Time Vitals</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>BPM & Body Thermistors</div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={20} color="var(--accent-cyan)" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>GPS Geofence</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Escape Alerts & Trail Replay</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Login Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-panel" style={{
                padding: '0.85rem 1.15rem',
                background: 'rgba(16, 185, 129, 0.12)',
                borderColor: 'rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} color="var(--accent-emerald)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Instant Demo Mode
                  </span>
                </div>
                <button 
                  onClick={handleQuickDemoLogin}
                  className="btn-primary"
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
                >
                  1-Click Demo Login
                </button>
              </div>

              <div className="glass-panel" style={{ padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
                {/* Tab Switcher */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '4px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.75rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <button
                    onClick={() => setAuthMode('login')}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'var(--accent-emerald)',
                      color: '#070A11',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => { setAuthMode('signup'); setWizardStep(1); playTabClick(); }}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Start Pet Intake ✨
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Email Address
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      gap: '0.75rem'
                    }}>
                      <Mail size={18} color="var(--text-muted)" />
                      <input 
                        type="email" 
                        required
                        placeholder="alex.morgan@petlify.io"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Password
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      gap: '0.75rem'
                    }}>
                      <Lock size={18} color="var(--text-muted)" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', width: '100%' }}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: 'var(--accent-emerald)' }}
                      /> Remember this device
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo password reset sent!"); }} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
                      Forgot password?
                    </a>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
                    Sign In to Petlify <ArrowRight size={18} />
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    New pet parent?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode('signup'); setWizardStep(1); playTabClick(); }}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Complete Pet Intake Questionnaire →
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ══ VIEW: MULTI-STEP PET & PARENT INTAKE SIGNUP WIZARD ══ */}
        {authMode === 'signup' && (
          <div className="glass-panel" style={{
            padding: '2.5rem',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), var(--shadow-glow)'
          }}>

            {/* Wizard Header Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--accent-emerald) 0%, var(--accent-cyan) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#070A11',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}>
                  <Radio size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Pet & Parent Onboarding Wizard</h2>
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Step {wizardStep} of {totalSteps}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {wizardStep === 1 && '1. Account & Owner Emergency Contacts'}
                    {wizardStep === 2 && '2. Pet Profile, Breed & Identity Details'}
                    {wizardStep === 3 && '3. Vitals Baseline, Physical Build & Allergies'}
                    {wizardStep === 4 && '4. Daily Lifestyle, Feeding Schedule & Sleep'}
                    {wizardStep === 5 && '5. Smart Collar IoT, Geofence & AI Provisioning'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => { setAuthMode('login'); playTabClick(); }}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
              >
                Back to Sign In
              </button>
            </div>

            {/* Step Indicators Bar */}
            <div className="step-indicator-bar">
              <div 
                className="step-indicator-progress" 
                style={{ width: `${((wizardStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
              {[
                { num: 1, label: 'Owner' },
                { num: 2, label: 'Pet Info' },
                { num: 3, label: 'Health' },
                { num: 4, label: 'Routine' },
                { num: 5, label: 'Collar IoT' }
              ].map(s => (
                <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', zIndex: 5 }}>
                  <div className={`step-bubble ${wizardStep === s.num ? 'active' : wizardStep > s.num ? 'completed' : ''}`}>
                    {wizardStep > s.num ? <Check size={18} /> : s.num}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: wizardStep >= s.num ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ── STEP 1: OWNER & ACCOUNT SETUP ── */}
            {wizardStep === 1 && (
              <div className="wizard-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Your Full Name *
                    </label>
                    <input 
                      type="text"
                      className="glow-input"
                      placeholder="e.g. Alex Morgan"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Primary Email Address *
                    </label>
                    <input 
                      type="email"
                      className="glow-input"
                      placeholder="alex.morgan@petlify.io"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Secure Password *
                    </label>
                    <input 
                      type="password"
                      className="glow-input"
                      placeholder="Minimum 8 characters"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Mobile Phone (for SOS & Collar Alerts) *
                    </label>
                    <input 
                      type="tel"
                      className="glow-input"
                      placeholder="(555) 234-5678"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Home Base Address (Used to center Geofence Safe Zone) *
                    </label>
                    <input 
                      type="text"
                      className="glow-input"
                      placeholder="742 Evergreen Terrace, Springfield"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Secondary Emergency Contact Phone
                    </label>
                    <input 
                      type="tel"
                      className="glow-input"
                      placeholder="(555) 987-6543 (Partner / Sitter)"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: PET BASICS & BREED PROFILE ── */}
            {wizardStep === 2 && (
              <div className="wizard-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Pet Type Select */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    What kind of pet do you have? *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div 
                      className={`selection-card ${petType === 'dog' ? 'selected' : ''}`}
                      onClick={() => { setPetType('dog'); setPetBreed('Golden Retriever'); setSelectedAvatar(PRESET_AVATARS[0].url); }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
                          <Dog size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Dog / Canine</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Full GPS + Bark Sensor + Activity Tracker</div>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`selection-card ${petType === 'cat' ? 'selected' : ''}`}
                      onClick={() => { setPetType('cat'); setPetBreed('Persian Cat'); setSelectedAvatar(PRESET_AVATARS[4].url); }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                          <Cat size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Cat / Feline</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Lightweight Collar + Sleep & Pounce Metrics</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pet Name & Breed */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Pet's Name *
                    </label>
                    <input 
                      type="text"
                      className="glow-input"
                      placeholder="e.g. Max, Bella, Milo"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Breed *
                    </label>
                    <input 
                      type="text"
                      className="glow-input"
                      placeholder="e.g. Golden Retriever, Mixed"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                    />
                  </div>
                </div>

                {/* Popular Breed Chips */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Popular {petType === 'dog' ? 'Dog' : 'Cat'} Breeds (Click to auto-fill):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {(petType === 'dog' ? POPULAR_DOG_BREEDS : POPULAR_CAT_BREEDS).map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setPetBreed(b)}
                        className={`chip-selector ${petBreed === b ? 'active' : ''}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender, Spayed, Age, Microchip */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Gender
                    </label>
                    <select 
                      className="glow-input"
                      value={petGender}
                      onChange={(e) => setPetGender(e.target.value)}
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Spayed / Neutered
                    </label>
                    <select 
                      className="glow-input"
                      value={isNeutered}
                      onChange={(e) => setIsNeutered(e.target.value)}
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Age (Years)
                    </label>
                    <input 
                      type="number"
                      min="0"
                      max="25"
                      className="glow-input"
                      value={petAgeYears}
                      onChange={(e) => setPetAgeYears(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Microchip ID Number
                    </label>
                    <input 
                      type="text"
                      className="glow-input"
                      placeholder="985-141-XXXX"
                      value={microchip}
                      onChange={(e) => setMicrochip(e.target.value)}
                    />
                  </div>
                </div>

                {/* Avatar Picker */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Choose an Avatar or Upload Custom Photo:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {PRESET_AVATARS.map(av => (
                      <img 
                        key={av.id}
                        src={av.url}
                        alt={av.label}
                        className={`avatar-option ${selectedAvatar === av.url && !customAvatarUrl ? 'selected' : ''}`}
                        onClick={() => { setSelectedAvatar(av.url); setCustomAvatarUrl(''); }}
                      />
                    ))}
                    <input 
                      type="url"
                      className="glow-input"
                      placeholder="Or paste custom image URL..."
                      style={{ flex: 1, minWidth: '220px' }}
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 3: VITALS BASELINE & MEDICAL HISTORY ── */}
            {wizardStep === 3 && (
              <div className="wizard-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Weight Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Current Weight (kg) *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="number"
                        step="0.1"
                        className="glow-input"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Target / Ideal Weight (kg)
                    </label>
                    <input 
                      type="number"
                      step="0.1"
                      className="glow-input"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Typical Daily Activity Level
                    </label>
                    <select 
                      className="glow-input"
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                    >
                      <option>Low / Couch Potato (&lt; 30 mins)</option>
                      <option>Moderate (1-2 hrs daily walk)</option>
                      <option>High / Very Active (2-3 hrs running &amp; play)</option>
                      <option>Working / Agility Athlete (3+ hrs)</option>
                    </select>
                  </div>
                </div>

                {/* Allergies Multi-Select */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Known Food &amp; Environmental Allergies:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {ALLERGIES_LIST.map(alg => {
                      const isSel = selectedAllergies.includes(alg);
                      return (
                        <button
                          key={alg}
                          type="button"
                          onClick={() => handleToggleAllergy(alg)}
                          className={`chip-selector ${isSel ? 'active' : ''}`}
                        >
                          {alg === 'None' ? '✅ None' : `⚠️ ${alg}`}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text"
                      className="glow-input"
                      placeholder="Add another allergy (e.g. Grass pollen, Lamb)..."
                      value={customAllergy}
                      onChange={(e) => setCustomAllergy(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAllergy())}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddCustomAllergy}
                      className="btn-secondary"
                      style={{ padding: '0 1rem' }}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>

                {/* Medical Conditions */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Pre-existing Medical History &amp; Chronic Medications:
                  </label>
                  <textarea 
                    className="glow-input"
                    rows={2}
                    placeholder="e.g. Sensitive digestion, taking joint supplements daily, vaccinated for Rabies & DHPP in Jan 2026."
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                  />
                </div>

                {/* Primary Vet Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Primary Veterinary Hospital / Clinic
                    </label>
                    <input 
                      type="text"
                      className="glow-input"
                      placeholder="Paws & Claws Veterinary Hospital"
                      value={primaryVetClinic}
                      onChange={(e) => setPrimaryVetClinic(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Vet Clinic Phone
                    </label>
                    <input 
                      type="tel"
                      className="glow-input"
                      placeholder="(555) 349-2810"
                      value={primaryVetPhone}
                      onChange={(e) => setPrimaryVetPhone(e.target.value)}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 4: DAILY LIFESTYLE & NUTRITION ── */}
            {wizardStep === 4 && (
              <div className="wizard-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Diet &amp; Food Type *
                    </label>
                    <select 
                      className="glow-input"
                      value={dietType}
                      onChange={(e) => setDietType(e.target.value)}
                    >
                      <option>Dry Kibble (High Protein)</option>
                      <option>Wet / Canned Organic Food</option>
                      <option>Raw Diet (BARF)</option>
                      <option>Prescription Gastrointestinal Formula</option>
                      <option>Custom Home-Cooked Mix</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Daily Feeding Schedule *
                    </label>
                    <select 
                      className="glow-input"
                      value={feedingTimes}
                      onChange={(e) => setFeedingTimes(e.target.value)}
                    >
                      <option>2 Times / Day (8:00 AM &amp; 6:00 PM)</option>
                      <option>3 Times / Day (Morning, Noon &amp; Evening)</option>
                      <option>1 Large Meal / Day (Evening)</option>
                      <option>Free-Feeding (Bowl always available)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Estimated Daily Calorie Target (kcal)
                    </label>
                    <input 
                      type="number"
                      className="glow-input"
                      value={dailyCalorieTarget}
                      onChange={(e) => setDailyCalorieTarget(e.target.value)}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      💡 Recommended: ~450–550 kcal for a 24kg active dog.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Hydration / Water Source
                    </label>
                    <select 
                      className="glow-input"
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                    >
                      <option>Smart Fountain with UV filter</option>
                      <option>Standard Ceramic Bowl</option>
                      <option>Stainless Steel Water Bowl</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Typical Night Sleep Style
                    </label>
                    <select 
                      className="glow-input"
                      value={sleepStyle}
                      onChange={(e) => setSleepStyle(e.target.value)}
                    >
                      <option>Calm &amp; Deep Sleeper (8+ hrs)</option>
                      <option>Light Sleeper (Wakes to sounds)</option>
                      <option>Co-sleeping with Pet Parent</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Nighttime Restlessness Baseline
                    </label>
                    <select 
                      className="glow-input"
                      value={nightRestlessness}
                      onChange={(e) => setNightRestlessness(e.target.value)}
                    >
                      <option>Low (Normal)</option>
                      <option>Medium (Occasional pacing)</option>
                      <option>High (Frequent scratching / barking)</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 5: SMART COLLAR IOT & GEOFENCE ── */}
            {wizardStep === 5 && !isProvisioning && (
              <div className="wizard-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Collar Model */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Select Smart Collar Hardware Series:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div 
                      className={`selection-card ${collarModel.includes('Pro') ? 'selected' : ''}`}
                      onClick={() => setCollarModel('Petlify Pro GPS + 4G Cellular')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Radio size={22} color="var(--accent-emerald)" />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Petlify Pro (4G + GPS)</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Live GPS, optical pulse, IMU, 30-day battery</div>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`selection-card ${collarModel.includes('Lite') ? 'selected' : ''}`}
                      onClick={() => setCollarModel('Petlify Lite (Bluetooth + Wi-Fi)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Battery size={22} color="var(--accent-cyan)" />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Petlify Lite (BLE + Home Hub)</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Ultra lightweight, 60-day battery, home radar</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Night LED Beacon Color */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    High-Beam Night LED Strobe Beacon Color:
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {[
                      { color: '#10B981', label: 'Emerald Green' },
                      { color: '#06B6D4', label: 'Neon Cyan' },
                      { color: '#F97316', label: 'Sunset Amber' },
                      { color: '#8B5CF6', label: 'UV Violet' },
                    ].map(c => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setBeaconColor(c.color)}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${beaconColor === c.color ? c.color : 'var(--border-color)'}`,
                          background: beaconColor === c.color ? `${c.color}22` : 'rgba(255,255,255,0.02)',
                          color: '#FFF',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          boxShadow: beaconColor === c.color ? `0 0 16px ${c.color}66` : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safe Geofence Radius Slider */}
                <div className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem' }}>
                      <MapPin size={16} color="var(--accent-cyan)" />
                      Home Safe Zone Boundary Radius
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                      {geofenceRadius} meters
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={geofenceRadius}
                    onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)', marginBottom: '0.5rem' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    If {petName || 'your pet'} crosses beyond {geofenceRadius}m from {homeAddress || 'home'}, your phone will buzz with high-priority push notifications.
                  </div>
                </div>

                {/* Instant Escape Alert Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(244,63,94,0.08)',
                  border: '1px solid rgba(244,63,94,0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <ShieldCheck size={20} color="var(--accent-rose)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Emergency Lost Pet SOS Broadcast</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Auto-alert neighborhood Petlify community if pet goes missing</div>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={emergencyAlertsEnabled}
                    onChange={(e) => setEmergencyAlertsEnabled(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
                  />
                </div>

              </div>
            )}

            {/* ── PROVISIONING ANIMATION SCREEN ── */}
            {isProvisioning && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '4px solid rgba(16, 185, 129, 0.2)',
                    borderTopColor: 'var(--accent-emerald)',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <Radio 
                    size={32} 
                    color="var(--accent-emerald)" 
                    style={{ position: 'absolute', top: '24px', left: '24px', animation: 'pulse 1.5s infinite' }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.4rem' }}>
                    Setting Up {petName || 'Your Pet'}'s Smart Ecosystem...
                  </h3>
                  <p style={{ color: 'var(--accent-cyan)', fontSize: '0.88rem', fontWeight: 600, minHeight: '24px' }}>
                    {provisionMessage}
                  </p>
                </div>

                <div className="progress-track" style={{ maxWidth: '400px', height: '8px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${provisionProgress}%`, background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))' }}
                  />
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            {!isProvisioning && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                {wizardStep > 1 ? (
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary"
                    style={{ padding: '0.65rem 1.25rem' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div />
                )}

                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary"
                  style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem' }}
                >
                  {wizardStep === totalSteps ? (
                    <>Complete Setup &amp; Launch App <Sparkles size={18} /></>
                  ) : (
                    <>Continue to Step {wizardStep + 1} <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
