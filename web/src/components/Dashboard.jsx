import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer,
  Pencil, 
  Moon, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Zap, 
  Flame, 
  Volume2, 
  RefreshCw, 
  ChevronRight,
  Award,
  Radio,
  Utensils,
  Droplets,
  Bot,
  Sun,
  Wind,
  Footprints,
  Sparkles,
  Bell,
  Calendar,
  Navigation,
  TrendingUp,
  Scale,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { ACTIVITY_HISTORY } from '../data/mockData';
import { playDispenseSound, playCollarBeep } from '../utils/soundEffects';
import HealthScore from './HealthScore';

export default function Dashboard({ 
  pet, 
  setActiveTab, 
  onTriggerLocateBuzzer, 
  onSyncCollar, 
  isLocateBuzzerActive,
  onEditProfile
}) {
  const [telemetryTick, setTelemetryTick] = useState(0);
  const [waterLevel, setWaterLevel] = useState(78);
  const [foodLevel, setFoodLevel] = useState(65);
  const [dispenseSuccess, setDispenseSuccess] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [lastSynced, setLastSynced] = useState('Just now');

  useEffect(() => {
    const interval = setInterval(() => setTelemetryTick(prev => (prev + 1) % 100), 1000);
    return () => clearInterval(interval);
  }, []);

  const stepsPercentage = Math.min(100, Math.round((pet.vitals.stepsToday / pet.vitals.stepsGoal) * 100));
  const maxSteps = Math.max(...ACTIVITY_HISTORY.map(d => d.steps));

  let petMood = { label: 'Joyful & Playful', emoji: '🐾', color: 'var(--accent-emerald)' };
  if (pet.vitals.heartRate > 105) petMood = { label: 'Excited & Active', emoji: '⚡', color: 'var(--accent-cyan)' };
  else if (pet.vitals.heartRate < 75) petMood = { label: 'Calm & Resting', emoji: '💤', color: 'var(--accent-purple)' };

  const handleDispenseMeal = () => {
    playDispenseSound();
    setFoodLevel(prev => Math.min(100, prev + 15));
    setDispenseSuccess(true);
    setTimeout(() => setDispenseSuccess(false), 3000);
  };

  const handleSync = () => {
    if (onSyncCollar) onSyncCollar();
    setLastSynced('Just now');
  };

  // Upcoming reminders for dashboard widget
  const reminders = [
    { label: 'DHPP Booster', date: 'Sep 10, 2026', color: 'var(--accent-orange)', urgent: true },
    { label: 'Monthly Grooming Bath', date: 'Aug 25, 2026', color: 'var(--accent-cyan)', urgent: false },
    { label: 'Flea Treatment Dose', date: 'Sep 01, 2026', color: 'var(--accent-emerald)', urgent: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Pet Hero Header ── */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={pet.avatar} alt={pet.name} style={{ width: '62px', height: '62px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(16,185,129,0.5)' }} />
            <div className="pulse-dot green" style={{ position: 'absolute', bottom: '-3px', right: '-3px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{pet.name}</h1>
              <span style={{ fontSize: '1rem' }}>{petMood.emoji}</span>
              <span className="badge badge-safe" style={{ fontSize: '0.6rem' }}>{petMood.label}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {pet.breed} • {pet.age} • {pet.weight} kg • {pet.gender}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <MapPin size={11} style={{ display: 'inline', marginRight: '0.3rem' }} color="var(--accent-emerald)" />
              {pet.location.zoneName} — {pet.location.address}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Health Score Ring (compact) */}
          <HealthScore pet={pet} compact={true} />

          <button onClick={handleSync} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Sync
          </button>
          <button
            onClick={onTriggerLocateBuzzer}
            className={isLocateBuzzerActive ? 'btn-danger' : 'btn-secondary'}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            <Volume2 size={14} /> {isLocateBuzzerActive ? 'Stop' : 'Locate'}
          </button>
          {onEditProfile && (
            <button onClick={onEditProfile} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
              <Pencil size={14} /> Edit Profile
            </button>
          )}
          <button onClick={() => setActiveTab('ai-assistant')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            <Bot size={14} /> Ask AI
          </button>
        </div>
      </div>

      {/* ── Vitals Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {/* Heart Rate */}
        <div className="stat-card" style={{ borderColor: 'rgba(244, 63, 94, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heart Rate</span>
            <Heart size={15} color="var(--accent-rose)" className="pulse-icon" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>
            {pet.vitals.heartRate}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>BPM • Normal Range</div>
          <div className="progress-track" style={{ marginTop: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${Math.round((pet.vitals.heartRate / 140) * 100)}%`, background: 'var(--accent-rose)' }} />
          </div>
        </div>

        {/* Body Temp */}
        <div className="stat-card" style={{ borderColor: 'rgba(249, 115, 22, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Temp</span>
            <Thermometer size={15} color="var(--accent-orange)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>
            {pet.vitals.bodyTemp}°
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>°F • Optimal Range</div>
          <div className="progress-track" style={{ marginTop: '0.75rem' }}>
            <div className="progress-fill" style={{ width: '72%', background: 'var(--accent-orange)' }} />
          </div>
        </div>

        {/* Steps Today */}
        <div className="stat-card" style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steps Today</span>
            <Footprints size={15} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>
            {pet.vitals.stepsToday.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            of {pet.vitals.stepsGoal.toLocaleString()} goal • {stepsPercentage}%
          </div>
          <div className="progress-track" style={{ marginTop: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${stepsPercentage}%`, background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))' }} />
          </div>
        </div>

        {/* Calories */}
        <div className="stat-card" style={{ borderColor: 'rgba(139, 92, 246, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calories Burned</span>
            <Flame size={15} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>
            {pet.vitals.caloriesBurned}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>kcal • Est. Daily Target: 520</div>
          <div className="progress-track" style={{ marginTop: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${Math.round((pet.vitals.caloriesBurned / 520) * 100)}%`, background: 'var(--accent-purple)' }} />
          </div>
        </div>
      </div>

      {/* ── Middle Row: Activity Chart + GPS Status ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* 7-Day Activity Sparkline Chart */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Activity size={16} color="var(--accent-emerald)" />
              7-Day Activity
            </div>
            <button onClick={() => setActiveTab('telemetry')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Full Stats <ArrowUpRight size={12} />
            </button>
          </div>
          
          {/* Bar Chart */}
          <div className="sparkline-wrap" style={{ marginBottom: '0.5rem' }}>
            {ACTIVITY_HISTORY.map((d, i) => {
              const heightPct = Math.round((d.steps / maxSteps) * 100);
              const isToday = i === ACTIVITY_HISTORY.length - 1;
              return (
                <div
                  key={d.day}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {hoveredBar === i && (
                    <div style={{
                      position: 'absolute',
                      background: 'rgba(10,15,26,0.95)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.7rem',
                      color: '#FFF',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      pointerEvents: 'none',
                      transform: 'translateY(-110%)'
                    }}>
                      {d.steps.toLocaleString()} steps
                    </div>
                  )}
                  <div
                    className="sparkline-bar"
                    style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      background: isToday
                        ? 'linear-gradient(180deg, var(--accent-cyan) 0%, rgba(6,182,212,0.3) 100%)'
                        : undefined,
                      opacity: hoveredBar !== null && hoveredBar !== i ? 0.5 : 1
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Day Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {ACTIVITY_HISTORY.map((d, i) => (
              <span key={d.day} style={{ flex: 1, textAlign: 'center', fontWeight: i === ACTIVITY_HISTORY.length - 1 ? 700 : 400, color: i === ACTIVITY_HISTORY.length - 1 ? 'var(--accent-cyan)' : undefined }}>
                {d.day}
              </span>
            ))}
          </div>

          {/* Summary Row */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
                {Math.round(ACTIVITY_HISTORY.reduce((a, b) => a + b.steps, 0) / 7).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Avg Daily Steps</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
                {Math.round(ACTIVITY_HISTORY.reduce((a, b) => a + b.activeMins, 0) / 7)} min
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Avg Active Time</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {ACTIVITY_HISTORY.filter(d => d.steps >= pet.vitals.stepsGoal).length}/7
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Goal Days Met</div>
            </div>
          </div>
        </div>

        {/* GPS & Location Card */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Navigation size={16} color="var(--accent-cyan)" />
              Live Location
            </div>
            <button onClick={() => setActiveTab('telemetry')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              GPS Map <ArrowUpRight size={12} />
            </button>
          </div>

          {/* Mini Map Placeholder */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: '12px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Grid lines for map feel */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: 'var(--accent-emerald)',
              boxShadow: '0 0 0 6px rgba(16,185,129,0.3)',
              animation: 'pulse-ring 2s ease infinite',
              zIndex: 1
            }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600, zIndex: 1 }}>
              {pet.location.zoneName}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={15} color="var(--accent-emerald)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>Safe in Geofence</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              📍 {pet.location.address}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Coords: {pet.location.lat}°N, {pet.location.lng}°W • Last fix: Just now
            </div>
          </div>
        </div>
      </div>

      {/* ── Sleep & Recovery Insights Row ── */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div className="section-header">
          <div className="section-title">
            <Moon size={16} color="var(--accent-purple)" />
            Sleep & Recovery Tracker
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Optical Collar IMU Active</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Total Sleep (Last 24h)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-purple)' }}>{pet.vitals.sleepHours || '8.5 hrs'}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '0.15rem' }}>+45m vs average</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Deep REM Rest</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>4.2 hrs</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>49% of sleep cycle</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Restlessness Index</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: pet.vitals.restlessness === 'Low' || pet.vitals.restlessness === 'Very Low' ? 'var(--accent-emerald)' : 'var(--accent-orange)' }}>
              {pet.vitals.restlessness || 'Low'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>3 nighttime awakenings</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Night Scratch / Bark</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF' }}>
              {pet.vitals.scratchCount || 0} / {pet.vitals.barkCount || 0}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '0.15rem' }}>Normal quiet night</div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Smart Bowl + Reminders + Live Stream Ticker ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

        {/* Smart Bowl Monitor */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Utensils size={16} color="var(--accent-orange)" />
              Smart Bowls
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Water */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Droplets size={13} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 600 }}>Water Fountain</span>
                </div>
                <span style={{ color: waterLevel > 30 ? 'var(--accent-cyan)' : 'var(--accent-rose)', fontWeight: 700 }}>{waterLevel}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${waterLevel}%`, background: 'linear-gradient(90deg, var(--accent-cyan), #67E8F9)' }} />
              </div>
            </div>

            {/* Food */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Utensils size={13} color="var(--accent-orange)" />
                  <span style={{ fontWeight: 600 }}>Food Bowl</span>
                </div>
                <span style={{ color: foodLevel > 30 ? 'var(--accent-orange)' : 'var(--accent-rose)', fontWeight: 700 }}>{foodLevel}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${foodLevel}%`, background: 'linear-gradient(90deg, var(--accent-orange), #FCD34D)' }} />
              </div>
            </div>

            {dispenseSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.78rem', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Meal dispensed!
              </div>
            )}

            <button onClick={handleDispenseMeal} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
              <Zap size={13} /> Dispense Meal
            </button>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Bell size={16} color="var(--accent-orange)" />
              Reminders
            </div>
            <span className="badge badge-warning" style={{ fontSize: '0.6rem' }}>{reminders.filter(r => r.urgent).length} Urgent</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {reminders.map((r, i) => (
              <div key={i} className="reminder-item">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, flexShrink: 0, boxShadow: `0 0 6px ${r.color}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{r.label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{r.date}</div>
                </div>
                {r.urgent && <AlertTriangle size={13} color="var(--accent-orange)" />}
              </div>
            ))}
          </div>
        </div>

        {/* Live Telemetry Stream Ticker */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Radio size={16} color="var(--accent-emerald)" />
              Live Stream
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div className="pulse-dot green" />
              <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>LIVE</span>
            </div>
          </div>

          <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'var(--accent-emerald)', lineHeight: 1.8, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>[{new Date().toLocaleTimeString()}] COLLAR SYNC</div>
            <div>{'>'} PPG: {pet.vitals.heartRate} BPM ●●●●●</div>
            <div>{'>'} TEMP: {pet.vitals.bodyTemp}°F [NORMAL]</div>
            <div>{'>'} GPS: {pet.location.lat.toFixed(4)},{pet.location.lng.toFixed(4)}</div>
            <div>{'>'} STEPS: {pet.vitals.stepsToday} / {pet.vitals.stepsGoal}</div>
            <div>{'>'} 4G LTE: ████ HDOP: 0.82</div>
            <div>{'>'} BATT: {pet.battery}% [OK]</div>
            <div style={{ color: 'var(--text-muted)', animation: 'pulse 1.5s infinite' }}>
              {'>'} TICK #{telemetryTick} ████░ {Math.round(Math.random() * 20 + 50)} ms
            </div>
          </div>
        </div>
      </div>

      {/* ── Outdoor Safety ── */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div className="section-header">
          <div className="section-title">
            <Sun size={16} color="var(--accent-orange)" />
            Outdoor Walk Safety
          </div>
          <span className="badge badge-safe">✅ Safe to Walk</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { icon: Sun, label: 'Pavement Temp', value: '78°F', status: 'Safe for Paws', color: 'var(--accent-emerald)' },
            { icon: Wind, label: 'Air Quality', value: 'AQI 28', status: 'Very Good', color: 'var(--accent-emerald)' },
            { icon: Thermometer, label: 'Feels Like', value: '82°F', status: 'Comfortable', color: 'var(--accent-emerald)' },
            { icon: Clock, label: 'Best Walk Window', value: '5:30–7:00 PM', status: 'Optimal Time', color: 'var(--accent-cyan)' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                <Icon size={20} color={item.color} style={{ marginBottom: '0.4rem' }} />
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', marginBottom: '0.15rem' }}>{item.value}</div>
                <div style={{ fontSize: '0.65rem', color: item.color, fontWeight: 600 }}>{item.status}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
