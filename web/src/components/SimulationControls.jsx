import React from 'react';
import {
  Sliders, ShieldAlert, ShieldCheck, Heart, BatteryLow, Radio,
  RotateCcw, Zap, Thermometer, MapPin, Activity
} from 'lucide-react';
import { playCollarBeep, playSuccessChime } from '../utils/soundEffects';

export default function SimulationControls({
  pets,
  setPets,
  activePetId,
  addToast,
  updatePetState,
  triggerAlertNotif,
  onResetSimulation
}) {
  const pet = pets?.find(p => p.id === activePetId) || pets?.[0];
  if (!pet) return null;

  const isBreached = pet.location?.status !== 'safe';

  const handleToggleBreach = () => {
    if (!isBreached) {
      updatePetState({
        location: {
          ...pet.location,
          status: 'alert',
          zoneName: '⚠️ Boundary Breach — Out of Bounds',
          address: 'Corner of Elm Street & 5th Ave (0.4 km from home)'
        }
      });
      triggerAlertNotif(
        `🚨 GEOFENCE ALERT: ${pet.name} exited Safe Zone!`,
        `${pet.name} is 0.4km outside your home boundary. GPS tracking active.`
      );
      playCollarBeep();
    } else {
      updatePetState({
        location: {
          ...pet.location,
          status: 'safe',
          zoneName: 'Home Safe Zone (Radius 150m)',
          address: '742 Evergreen Terrace, Springfield'
        }
      });
      addToast({ type: 'success', title: 'Safe Zone Restored', message: `${pet.name} is back inside the home geofence.` });
    }
  };

  const handleSpikeHeartRate = () => {
    const newBpm = pet.vitals.heartRate > 120 ? 82 : 148;
    updatePetState({ vitals: { ...pet.vitals, heartRate: newBpm } });
    if (newBpm > 120) {
      triggerAlertNotif(
        `❤️ HIGH HEART RATE WARNING (${newBpm} BPM)`,
        `${pet.name}'s collar detected a rapid pulse spike. Check vitals immediately.`
      );
      playCollarBeep();
    } else {
      addToast({ type: 'success', title: 'Heart Rate Normalized', message: `${pet.name}'s pulse back to ${newBpm} BPM baseline.` });
    }
  };

  const handleHighTemp = () => {
    const newTemp = pet.vitals.bodyTemp > 102.5 ? 101.4 : 104.2;
    updatePetState({ vitals: { ...pet.vitals, bodyTemp: newTemp } });
    if (newTemp > 102.5) {
      triggerAlertNotif(
        `🌡️ HIGH TEMPERATURE ALERT (${newTemp}°F)`,
        `${pet.name} may be running a fever. Consult vet if sustained over 30 mins.`
      );
    } else {
      addToast({ type: 'success', title: 'Temperature Normalized', message: `${pet.name}'s body temp restored to ${newTemp}°F.` });
    }
  };

  const handleLowBattery = () => {
    const newBattery = pet.battery < 20 ? 88 : 12;
    updatePetState({ battery: newBattery });
    if (newBattery < 20) {
      triggerAlertNotif(
        `🔋 COLLAR BATTERY CRITICAL (${newBattery}%)`,
        `Please place ${pet.name}'s Smart Collar on its magnetic charging dock.`
      );
    } else {
      addToast({ type: 'success', title: 'Battery Restored', message: `Collar battery simulated at ${newBattery}%.` });
    }
  };

  const handleToggleCollar = () => {
    const next = !pet.collarConnected;
    updatePetState({ collarConnected: next });
    if (!next) {
      triggerAlertNotif(
        `📡 COLLAR SIGNAL LOST`,
        `${pet.name}'s smart collar connection has dropped. Check Bluetooth & 4G signal.`
      );
    } else {
      addToast({ type: 'success', title: 'Collar Reconnected', message: `${pet.name}'s collar is back online and streaming.` });
      playSuccessChime();
    }
  };

  const controls = [
    {
      label: isBreached ? 'Restore Safe Zone' : 'Trigger Geofence Breach',
      icon: isBreached ? ShieldCheck : ShieldAlert,
      iconColor: isBreached ? 'var(--accent-emerald)' : 'var(--accent-rose)',
      badge: isBreached ? 'ALERT' : 'SAFE',
      badgeClass: isBreached ? 'badge-danger' : 'badge-safe',
      onClick: handleToggleBreach,
      active: isBreached,
    },
    {
      label: pet.vitals.heartRate > 120 ? `Normalize Pulse (→82 BPM)` : `Spike Pulse to 148 BPM`,
      icon: Heart,
      iconColor: pet.vitals.heartRate > 120 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
      badge: `${pet.vitals.heartRate} BPM`,
      badgeClass: pet.vitals.heartRate > 120 ? 'badge-danger' : 'badge-warning',
      onClick: handleSpikeHeartRate,
      active: pet.vitals.heartRate > 120,
    },
    {
      label: pet.vitals.bodyTemp > 102.5 ? `Normalize Temp (→101.4°F)` : `Simulate Fever (104.2°F)`,
      icon: Thermometer,
      iconColor: pet.vitals.bodyTemp > 102.5 ? 'var(--accent-rose)' : 'var(--accent-orange)',
      badge: `${pet.vitals.bodyTemp}°F`,
      badgeClass: pet.vitals.bodyTemp > 102.5 ? 'badge-danger' : 'badge-warning',
      onClick: handleHighTemp,
      active: pet.vitals.bodyTemp > 102.5,
    },
    {
      label: pet.battery < 20 ? `Restore Battery (→88%)` : `Simulate Low Battery (12%)`,
      icon: BatteryLow,
      iconColor: pet.battery < 20 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
      badge: `${pet.battery}%`,
      badgeClass: pet.battery < 20 ? 'badge-danger' : 'badge-safe',
      onClick: handleLowBattery,
      active: pet.battery < 20,
    },
    {
      label: pet.collarConnected ? 'Simulate Signal Loss' : 'Reconnect Collar',
      icon: Radio,
      iconColor: pet.collarConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)',
      badge: pet.collarConnected ? 'ONLINE' : 'OFFLINE',
      badgeClass: pet.collarConnected ? 'badge-safe' : 'badge-danger',
      onClick: handleToggleCollar,
      active: !pet.collarConnected,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(139,92,246,0.08) 100%)',
        borderColor: 'rgba(6,182,212,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)'
          }}>
            <Sliders size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Collar Simulator & Testing Engine</h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>Dev Mode</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Trigger telemetry events, boundary breaches, vitals anomalies & power alerts in real-time
            </p>
          </div>
        </div>
        <button onClick={onResetSimulation} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      {/* Active Pet Status Banner */}
      <div style={{
        padding: '0.85rem 1.1rem',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
      }}>
        <img src={pet.avatar} alt={pet.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Testing: {pet.name} ({pet.breed})</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Collar ID: {pet.collarId}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className={`badge ${isBreached ? 'badge-danger' : 'badge-safe'}`} style={{ fontSize: '0.65rem' }}>
            {isBreached ? '⚠️ OUT OF ZONE' : '✅ SAFE ZONE'}
          </span>
          <span className={`badge ${pet.collarConnected ? 'badge-safe' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
            {pet.collarConnected ? '📡 ONLINE' : '⚫ OFFLINE'}
          </span>
          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>❤️ {pet.vitals.heartRate} BPM</span>
          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>🌡️ {pet.vitals.bodyTemp}°F</span>
          <span className={`badge ${pet.battery < 20 ? 'badge-danger' : 'badge-safe'}`} style={{ fontSize: '0.65rem' }}>🔋 {pet.battery}%</span>
        </div>
      </div>

      {/* Control Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {controls.map((ctrl, i) => {
          const Icon = ctrl.icon;
          return (
            <button
              key={i}
              onClick={ctrl.onClick}
              className={ctrl.active ? 'btn-danger' : 'btn-secondary'}
              style={{ padding: '1rem 1.1rem', justifyContent: 'space-between', fontSize: '0.88rem', borderRadius: '14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Icon size={20} color={ctrl.iconColor} />
                <span>{ctrl.label}</span>
              </div>
              <span className={`badge ${ctrl.badgeClass}`} style={{ fontSize: '0.6rem' }}>{ctrl.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        💡 These simulations trigger real alert toasts, update the Dashboard, and send events through the same alert pipeline used by a real physical collar connection.
      </div>
    </div>
  );
}
