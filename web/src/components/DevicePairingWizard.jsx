import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Wifi, 
  BatteryCharging, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  Dog, 
  Cat, 
  Sparkles, 
  X,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DevicePairingWizard({ onPairingComplete, onCancel }) {
  const [step, setStep] = useState(1); // 1: Scan, 2: Select Device, 3: PIN Code, 4: Pet Details, 5: Success
  const [isScanning, setIsScanning] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [pairingPin, setPairingPin] = useState('749288');

  // Pet Onboarding Details
  const [petName, setPetName] = useState('Cooper');
  const [petType, setPetType] = useState('dog');
  const [petBreed, setPetBreed] = useState('Golden Retriever');
  const [petAge, setPetAge] = useState('1 Year 6 Months');
  const [petWeight, setPetWeight] = useState('22.4 kg');
  const [microchip, setMicrochip] = useState('985-141-9921');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400');

  // Simulated Device Discovery Scan
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        setStep(2);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const discoveredDevices = [
    {
      id: 'PET-SMART-904',
      name: 'Petlify Ultra Smart Collar Pro v3',
      signal: '-42 dBm (Strong Signal)',
      battery: 92,
      protocol: '4G LTE + GPS + BLE 5.3',
      isPro: true
    },
    {
      id: 'PET-SMART-302',
      name: 'Petlify Smart Tag Mini Gen 2',
      signal: '-68 dBm (Moderate)',
      battery: 84,
      protocol: 'BLE 5.3 + Wi-Fi Beacon',
      isPro: false
    }
  ];

  const handleSelectDevice = (dev) => {
    setSelectedDevice(dev);
    setStep(3);
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pairingPin.length >= 4) {
      setStep(4);
    } else {
      alert("Please enter valid 6-digit PIN code.");
    }
  };

  const handleCompletePetSetup = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 }
    });
    setStep(5);
  };

  const handleFinishWizard = () => {
    const newPet = {
      id: 'pet-' + Date.now(),
      name: petName,
      type: petType,
      breed: petBreed,
      age: petAge,
      weight: petWeight,
      gender: 'Male',
      microchip: microchip,
      avatar: avatar,
      collarId: selectedDevice ? selectedDevice.id : 'PET-SMART-904',
      collarConnected: true,
      battery: selectedDevice ? selectedDevice.battery : 90,
      signalStrength: 'Excellent (4G + GPS Lock)',
      vitals: {
        heartRate: 84,
        bodyTemp: 101.2,
        stepsToday: 4200,
        stepsGoal: 10000,
        caloriesBurned: 240,
        sleepHours: '9.0 hrs',
        restlessness: 'Low',
        barkCount: 1,
        scratchCount: 4
      },
      location: {
        status: 'safe',
        zoneName: 'Home Safe Zone (Radius 150m)',
        address: '742 Evergreen Terrace, Springfield',
        lat: 37.7749,
        lng: -122.4194,
        lastSeen: 'Just now'
      },
      diet: '2 Cups Organic Kibble',
      allergies: ['None noted']
    };
    onPairingComplete(newPet);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '580px', position: 'relative' }}>
        
        {/* Cancel Button */}
        {onCancel && (
          <button onClick={onCancel} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        )}

        {/* Wizard Header Progress Bar */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Radio size={22} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Smart Collar Device Pairing</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: s <= step ? 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>
        </div>

        {/* STEP 1: BLUETOOTH / CELLULAR RADAR SCAN */}
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '2px solid var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              position: 'relative',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
              animation: 'pulse 1.5s infinite'
            }}>
              <Radio size={46} color="var(--accent-emerald)" />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Scanning for Nearby Petlify Collars...
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Ensure your Petlify Smart Collar is powered on and within 10 meters of your device.
            </p>
          </div>
        )}

        {/* STEP 2: DISCOVERED DEVICES LIST */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Discovered Devices</h3>
              <button 
                onClick={() => { setIsScanning(true); setStep(1); }} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <RefreshCw size={14} /> Rescan
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {discoveredDevices.map(dev => (
                <div 
                  key={dev.id} 
                  onClick={() => handleSelectDevice(dev)}
                  className="glass-card" 
                  style={{
                    cursor: 'pointer',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--accent-emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Radio size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dev.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        ID: {dev.id} • {dev.protocol}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-safe" style={{ fontSize: '0.65rem', marginBottom: '0.2rem' }}>
                      {dev.signal}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      🔋 {dev.battery}% Battery
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SECURITY PIN CODE */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Pairing Security Verification
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Selected Device: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedDevice?.name}</strong>. Enter the 6-digit Bluetooth pairing PIN displayed on collar box or press button on collar.
            </p>

            <form onSubmit={handleVerifyPin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  6-Digit Collar PIN Code
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
                  <Lock size={18} color="var(--accent-emerald)" />
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={pairingPin}
                    onChange={(e) => setPairingPin(e.target.value)}
                    style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', letterSpacing: '0.3em', fontWeight: 800, width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Back
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Verify & Connect <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: PET PROFILE SETUP */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Set Up Pet Profile for Smart Collar
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Link your pet details to collar sensors for accurate calorie burn, steps, and vitals.
            </p>

            <form onSubmit={handleCompletePetSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Pet Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Species
                  </label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="dog">Dog / Puppy</option>
                    <option value="cat">Cat / Kitten</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Breed
                  </label>
                  <input 
                    type="text" 
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Age
                  </label>
                  <input 
                    type="text" 
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Weight (kg)
                  </label>
                  <input 
                    type="text" 
                    value={petWeight}
                    onChange={(e) => setPetWeight(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Microchip ID
                  </label>
                  <input 
                    type="text" 
                    value={microchip}
                    onChange={(e) => setMicrochip(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                Activate Smart Collar & Pair <Sparkles size={18} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 5: SUCCESS CONFETTI */}
        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle size={42} />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Collar Successfully Paired!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <strong style={{ color: 'var(--accent-cyan)' }}>{petName}</strong> is now synced with Petlify Smart Collar <strong style={{ color: 'var(--accent-emerald)' }}>#{selectedDevice ? selectedDevice.id : 'PET-SMART-904'}</strong>.
            </p>

            <button onClick={handleFinishWizard} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              Launch Pet Care Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
