import React, { useState } from 'react';
import {
  Settings, Bell, Shield, Ruler, Server, Heart, Thermometer,
  MapPin, Moon, Palette, ChevronRight, ToggleLeft, ToggleRight,
  CheckCircle2, Save, Volume2, VolumeX, Wifi, BatteryCharging
} from 'lucide-react';
import { checkBackendHealth } from '../services/api';
import { setSoundEnabled, isSoundEnabled } from '../utils/soundEffects';

export default function SettingsPage({ user, activePet, onSoundChange }) {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [units, setUnits] = useState('metric'); // 'metric' | 'imperial'
  const [theme, setTheme] = useState('dark');

  // Alert Thresholds
  const [bpmHigh, setBpmHigh] = useState(120);
  const [bpmLow, setBpmLow] = useState(60);
  const [tempHigh, setTempHigh] = useState(103.0);
  const [tempLow, setTempLow] = useState(99.5);
  const [geofenceRadius, setGeofenceRadius] = useState(150);

  // Notifications
  const [notif, setNotif] = useState({
    heartRateAlert: true,
    geofenceAlert: true,
    lowBattery: true,
    vaccineDue: true,
    mealReminder: true,
    walkReminder: false
  });

  const [saved, setSaved] = useState(false);

  const checkBackend = async () => {
    setBackendStatus('checking');
    const res = await checkBackendHealth();
    setBackendStatus(res.status === 'online' ? 'online' : 'offline');
  };

  React.useEffect(() => { checkBackend(); }, []);

  const toggleNotif = (key) => setNotif(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (onSoundChange) onSoundChange(next);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange }) => (
    <button onClick={onChange} style={{ background: 'none', border: 'none', cursor: 'pointer', color: value ? 'var(--accent-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
      {value ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  );

  const Section = ({ title, icon: Icon, children }) => (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
        <Icon size={16} color="var(--accent-emerald)" />
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{title}</h4>
      </div>
      {children}
    </div>
  );

  const SettingRow = ({ label, desc, value, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{desc}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)'
        }}>
          <Settings size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>App Settings</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thresholds, alerts, account & collar config</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Collar Alert Thresholds */}
          <Section title="Collar Alert Thresholds" icon={Heart}>
            {[
              { label: 'Heart Rate High Limit', value: bpmHigh, set: setBpmHigh, min: 80, max: 180, unit: 'BPM', color: 'var(--accent-rose)' },
              { label: 'Heart Rate Low Limit', value: bpmLow, set: setBpmLow, min: 40, max: 90, unit: 'BPM', color: 'var(--accent-cyan)' },
            ].map(({ label, value, set, min, max, unit, color }) => (
              <div key={label} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>{value} {unit}</span>
                </div>
                <input type="range" min={min} max={max} value={value} onChange={e => set(Number(e.target.value))}
                  style={{ width: '100%', accentColor: color }} />
              </div>
            ))}
            {[
              { label: 'Body Temp High Limit', value: tempHigh, set: setTempHigh, min: 101, max: 106, step: 0.1, unit: '°F', color: 'var(--accent-orange)' },
              { label: 'Body Temp Low Limit', value: tempLow, set: setTempLow, min: 97, max: 101, step: 0.1, unit: '°F', color: 'var(--accent-purple)' },
            ].map(({ label, value, set, min, max, step, unit, color }) => (
              <div key={label} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>{value.toFixed(1)} {unit}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value} onChange={e => setTempHigh(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: color }} />
              </div>
            ))}
          </Section>

          {/* Geofence */}
          <Section title="Geofence & GPS" icon={MapPin}>
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>Default Safe Zone Radius</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{geofenceRadius} m</span>
              </div>
              <input type="range" min={25} max={500} value={geofenceRadius} onChange={e => setGeofenceRadius(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={11} /> Current zone: {activePet?.location?.zoneName || 'Home Safe Zone'}
            </div>
          </Section>

        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Notifications */}
          <Section title="Smart Notifications" icon={Bell}>
            {[
              { key: 'heartRateAlert', label: 'Heart Rate Alerts', desc: 'Alert when BPM exceeds thresholds' },
              { key: 'geofenceAlert', label: 'Geofence Breach', desc: 'Notify when pet exits safe zone' },
              { key: 'lowBattery', label: 'Low Collar Battery', desc: 'Alert at 20% and 10%' },
              { key: 'vaccineDue', label: 'Vaccine Reminders', desc: '7 days before due date' },
              { key: 'mealReminder', label: 'Meal Time Reminders', desc: '15 mins before scheduled feed' },
              { key: 'walkReminder', label: 'Daily Walk Reminder', desc: 'Morning walk nudge at 7 AM' },
            ].map(({ key, label, desc }) => (
              <SettingRow key={key} label={label} desc={desc} value={notif[key]} onChange={() => toggleNotif(key)} />
            ))}
          </Section>

          {/* App Preferences */}
          <Section title="App Preferences" icon={Palette}>
            <SettingRow label="Audio Sound FX" desc="Collar beeps, chimes & UI sounds" value={soundOn} onChange={toggleSound} />

            <div style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Measurement Units</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['metric', 'imperial'].map(u => (
                  <button key={u} onClick={() => setUnits(u)}
                    style={{
                      flex: 1, padding: '0.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: units === u ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                      color: units === u ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                      fontWeight: units === u ? 700 : 500, fontSize: '0.8rem',
                      outline: units === u ? '1px solid rgba(16,185,129,0.4)' : 'none'
                    }}>
                    {u === 'metric' ? '🌍 Metric (kg, °C)' : '🇺🇸 Imperial (lbs, °F)'}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Backend Status */}
          <Section title="System & Backend" icon={Server}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cloud REST API</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>http://localhost:3001</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: backendStatus === 'online' ? 'var(--accent-emerald)' : backendStatus === 'offline' ? 'var(--accent-rose)' : 'var(--accent-orange)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: backendStatus === 'online' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {backendStatus === 'online' ? 'Connected' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
                </span>
                <button onClick={checkBackend} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>↻</button>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.6rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', fontFamily: 'monospace' }}>
              <div>API v2.0 • JWT Auth • Real-time Telemetry</div>
              <div>Endpoints: /pets /telemetry /reports /reminders</div>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Signed in as: <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> ({user?.email})
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
              {user?.accountType || 'Premium'} Account
            </div>
          </Section>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Settings saved!
          </div>
        )}
        <button onClick={handleSave} className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
          <Save size={15} /> Save Settings
        </button>
      </div>

    </div>
  );
}
