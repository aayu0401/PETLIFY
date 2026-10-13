import React, { useState, useEffect } from 'react';
import {
  MapPin, BatteryCharging, Wifi, Radio, Compass, Layers, Play, Pause,
  RotateCcw, AlertTriangle, Zap, Share2, Download, Sparkles, Volume2,
  Cpu, Plus, Minus, Navigation, Shield, ShieldCheck, ShieldAlert,
  Signal, Satellite, Settings2, Clock, Thermometer, Activity,
  ArrowUpRight, CheckCircle2, X, Edit3, Trash2
} from 'lucide-react';
import CollarVisualizer from './CollarVisualizer';

// Signal strength bar renderer
function SignalBars({ strength }) {
  // strength: 0–4
  const bars = [1, 2, 3, 4];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
      {bars.map(b => (
        <div key={b} style={{
          width: '4px',
          height: `${b * 4}px`,
          borderRadius: '2px',
          background: b <= strength
            ? strength >= 3 ? 'var(--accent-emerald)' : strength === 2 ? 'var(--accent-orange)' : 'var(--accent-rose)'
            : 'rgba(255,255,255,0.12)'
        }} />
      ))}
    </div>
  );
}

const GEOFENCE_COLORS = ['var(--accent-emerald)', 'var(--accent-cyan)', 'var(--accent-orange)', 'var(--accent-purple)'];

export default function CollarTelemetry({ pet, onTriggerLocateBuzzer, isLocateBuzzerActive }) {
  const [mapLayer, setMapLayer] = useState('satellite');
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(100);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [isFirmwareUpdating, setIsFirmwareUpdating] = useState(false);
  const [firmwareProgress, setFirmwareProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'geofence' | 'diagnostics'

  // Geofence Zones
  const [zones, setZones] = useState([
    { id: 'z1', name: 'Home Safe Zone', radius: 150, lat: 37.7749, lng: -122.4194, active: true, color: 'var(--accent-emerald)', cx: 130, cy: 265 },
    { id: 'z2', name: 'Riverside Dog Park', radius: 80, lat: 37.7762, lng: -122.4180, active: true, color: 'var(--accent-cyan)', cx: 390, cy: 130 },
    { id: 'z3', name: 'Vet Clinic Safe Area', radius: 60, lat: 37.7735, lng: -122.4210, active: false, color: 'var(--accent-orange)', cx: 480, cy: 300 },
  ]);
  const [editingZone, setEditingZone] = useState(null);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRadius, setNewZoneRadius] = useState(100);
  const [showAddZone, setShowAddZone] = useState(false);
  const [geoSaved, setGeoSaved] = useState(false);

  // Live diagnostics simulated values
  const [diagnostics, setDiagnostics] = useState({
    cpuTemp: 38.2,
    gpsHdop: 0.82,
    satCount: 14,
    signalBars: 4,
    networkType: '4G LTE',
    firmwareVer: 'v3.4.1',
    lastSync: 'Just now',
    uptimeDays: 7,
    totalStepsRecorded: 284500,
    totalDistanceKm: 213.4,
    ramUsage: 62,
    storageUsed: 34,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDiagnostics(d => ({
        ...d,
        gpsHdop: parseFloat((0.7 + Math.random() * 0.4).toFixed(2)),
        cpuTemp: parseFloat((37 + Math.random() * 3).toFixed(1)),
        signalBars: Math.floor(Math.random() < 0.1 ? 3 : 4),
        lastSync: 'Just now',
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Replay path
  useEffect(() => {
    let timer;
    if (isReplaying) {
      timer = setInterval(() => {
        setReplayProgress(prev => {
          if (prev >= 100) { setIsReplaying(false); return 100; }
          return prev + (1 * replaySpeed);
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isReplaying, replaySpeed]);

  const handleTriggerFirmwareUpdate = () => {
    setIsFirmwareUpdating(true);
    setFirmwareProgress(0);
    const interval = setInterval(() => {
      setFirmwareProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(() => setIsFirmwareUpdating(false), 800); return 100; }
        return p + 5;
      });
    }, 150);
  };

  const routePoints = [
    { x: 120, y: 260, label: 'Home (Start 07:30 AM)', bpm: 78 },
    { x: 190, y: 220, label: 'Oakwood Blvd Crossing', bpm: 82 },
    { x: 280, y: 170, label: 'Elm Street Cafe', bpm: 85 },
    { x: 390, y: 130, label: 'Riverside Dog Park (Fetch)', bpm: 114 },
    { x: 490, y: 190, label: 'Pine Ridge Trail Loop', bpm: 106 },
    { x: 420, y: 270, label: 'Return Path (Rest)', bpm: 91 },
    { x: 140, y: 275, label: 'Home Base (End 08:45 AM)', bpm: 80 },
  ];

  const currentPointIndex = Math.min(routePoints.length - 1, Math.floor((replayProgress / 100) * (routePoints.length - 1)));
  const currentPos = routePoints[currentPointIndex];

  const saveZones = () => {
    setGeoSaved(true);
    setTimeout(() => setGeoSaved(false), 2500);
  };

  const toggleZone = (id) => setZones(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z));
  const deleteZone = (id) => setZones(prev => prev.filter(z => z.id !== id));
  const addZone = () => {
    if (!newZoneName.trim()) return;
    const colors = GEOFENCE_COLORS;
    setZones(prev => [...prev, {
      id: 'z' + Date.now(), name: newZoneName, radius: newZoneRadius,
      lat: 37.7749 + (Math.random() - 0.5) * 0.005,
      lng: -122.4194 + (Math.random() - 0.5) * 0.005,
      active: true, color: colors[prev.length % colors.length],
      cx: 150 + Math.random() * 300, cy: 100 + Math.random() * 200
    }]);
    setNewZoneName(''); setNewZoneRadius(100); setShowAddZone(false);
  };

  const tabs = [
    { id: 'map', label: '🗺️ GPS Map & Route', icon: Navigation },
    { id: 'geofence', label: '🛡️ Geofence Zones', icon: Shield },
    { id: 'diagnostics', label: '🔧 Collar Diagnostics', icon: Cpu },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header HUD ────────────────────────────────────────────── */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(16,185,129,0.08) 100%)',
        borderColor: 'rgba(6,182,212,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070A11'
          }}>
            <Navigation size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>GPS Satellite HUD</h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>
                {diagnostics.satCount} Sats • HDOP {diagnostics.gpsHdop}
              </span>
              {pet.collarConnected
                ? <span className="badge badge-safe" style={{ fontSize: '0.6rem' }}>●LIVE</span>
                : <span className="badge badge-danger" style={{ fontSize: '0.6rem' }}>●OFFLINE</span>
              }
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Lat <strong style={{ color: '#FFF' }}>{pet.location?.lat?.toFixed(4)}° N</strong> &nbsp;•&nbsp;
              Lng <strong style={{ color: '#FFF' }}>{Math.abs(pet.location?.lng?.toFixed(4))}° W</strong> &nbsp;•&nbsp;
              <strong style={{ color: 'var(--accent-emerald)' }}>Heading 312° NW</strong>
            </p>
          </div>
        </div>

        {/* Signal + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Signal strength indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <SignalBars strength={diagnostics.signalBars} />
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{diagnostics.networkType}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={onTriggerLocateBuzzer} className={isLocateBuzzerActive ? 'btn-danger' : 'btn-primary'} style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}>
              <Volume2 size={14} /> {isLocateBuzzerActive ? 'Stop Beep' : 'Locate Buzz'}
            </button>
            <button onClick={handleTriggerFirmwareUpdate} disabled={isFirmwareUpdating} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}>
              <Zap size={14} /> {isFirmwareUpdating ? `OTA ${firmwareProgress}%` : `FW ${diagnostics.firmwareVer}`}
            </button>
          </div>
        </div>
      </div>

      {/* ── Firmware Update Progress Bar ────────────────────────────── */}
      {isFirmwareUpdating && (
        <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700 }}>📡 OTA Firmware Update In Progress...</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{firmwareProgress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${firmwareProgress}%`, background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))' }} />
          </div>
        </div>
      )}

      {/* ── Sub Tab Switcher ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '0.55rem', border: 'none', cursor: 'pointer', borderRadius: '9px', fontSize: '0.82rem', fontWeight: 700,
            background: activeTab === t.id ? 'rgba(6,182,212,0.15)' : 'transparent',
            color: activeTab === t.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            outline: activeTab === t.id ? '1px solid rgba(6,182,212,0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: GPS MAP ════════════════════════════════════════════════ */}
      {activeTab === 'map' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(300px, 1.2fr)', gap: '1.25rem', alignItems: 'start' }}>

          {/* Map Canvas */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['satellite', 'street', 'terrain'].map(layer => (
                  <button key={layer} onClick={() => setMapLayer(layer)} style={{
                    padding: '0.3rem 0.65rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize',
                    border: mapLayer === layer ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    background: mapLayer === layer ? 'rgba(6,182,212,0.18)' : 'rgba(255,255,255,0.04)',
                    color: mapLayer === layer ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  }}>
                    {layer}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => setZoomLevel(z => Math.min(18, z + 1))} style={{ width: '26px', height: '26px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={13} />
                </button>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: '50px', textAlign: 'center' }}>Zoom {zoomLevel}</span>
                <button onClick={() => setZoomLevel(z => Math.max(12, z - 1))} style={{ width: '26px', height: '26px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={13} />
                </button>
              </div>
            </div>

            {/* Map Canvas */}
            <div style={{
              height: '400px', borderRadius: '10px', position: 'relative', overflow: 'hidden',
              background: mapLayer === 'satellite' ? '#070D18' : mapLayer === 'street' ? '#1E293B' : '#0F172A',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              {/* Street labels */}
              {[['OAKWOOD BOULEVARD', '35px', '160px'], ['RIVERSIDE DOG PARK', '150px', null, '40px'], ['ELM STREET LOOP', null, '260px', null, '80px']].map(([text, top, left, right, bottom], i) => (
                <div key={i} style={{ position: 'absolute', top, left, right, bottom, color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em' }}>{text}</div>
              ))}

              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {/* Route trail with gradient */}
                <defs>
                  <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(6,182,212,0.3)" />
                    <stop offset="100%" stopColor="rgba(16,185,129,0.5)" />
                  </linearGradient>
                </defs>
                <polyline points={routePoints.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="url(#trailGrad)" strokeWidth="3" strokeDasharray="6,4" />

                {/* Active geofence zones */}
                {zones.filter(z => z.active).map(z => (
                  <circle key={z.id} cx={z.cx} cy={z.cy} r={z.radius * 0.45} fill="rgba(16,185,129,0.07)" stroke={z.color} strokeWidth="1.5" strokeDasharray="5,4" />
                ))}

                {/* Route checkpoints */}
                {routePoints.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r={5} fill={i === currentPointIndex ? 'var(--accent-emerald)' : 'var(--accent-cyan)'} stroke="#070A11" strokeWidth="2" />
                    {i === currentPointIndex && (
                      <circle cx={pt.x} cy={pt.y} r={10} fill="none" stroke="var(--accent-emerald)" strokeWidth="1.5" strokeOpacity="0.5" style={{ animation: 'pulse-ring 2s infinite' }} />
                    )}
                  </g>
                ))}
              </svg>

              {/* Live pet position marker */}
              <div style={{ position: 'absolute', top: `${currentPos.y - 24}px`, left: `${currentPos.x - 21}px`, transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '3px solid var(--accent-emerald)', boxShadow: '0 0 20px rgba(16,185,129,0.8)', overflow: 'hidden' }}>
                  <img src={pet.avatar} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ background: 'rgba(10,15,26,0.9)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '9999px', padding: '1px 6px', fontSize: '0.6rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                  ❤️ {pet.vitals?.heartRate} BPM
                </div>
              </div>

              {/* HUD overlay */}
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(7,10,17,0.88)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.85rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Compass size={16} color="var(--accent-cyan)" />
                <div>
                  <div>Speed: <strong style={{ color: '#FFF' }}>3.2 km/h</strong></div>
                  <div>Zone: <strong style={{ color: 'var(--accent-emerald)' }}>{pet.location?.status === 'safe' ? '✅ Inside Safe Zone' : '⚠️ Boundary Breach'}</strong></div>
                </div>
              </div>

              {/* Current waypoint tooltip */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(7,10,17,0.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.7rem', maxWidth: '180px' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.2rem' }}>📍 Checkpoint {currentPointIndex + 1}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{currentPos.label}</div>
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.65rem', marginTop: '0.2rem' }}>❤️ {currentPos.bpm} BPM here</div>
              </div>
            </div>

            {/* Replay Controls */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => setIsReplaying(!isReplaying)} className="btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
                  {isReplaying ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Replay Walk</>}
                </button>
                <button onClick={() => { setReplayProgress(0); setIsReplaying(true); }} className="btn-secondary" style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem' }}>
                  <RotateCcw size={13} />
                </button>
              </div>
              <div style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="range" min="0" max="100" value={replayProgress} onChange={e => setReplayProgress(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'monospace', flexShrink: 0 }}>{replayProgress}%</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {[1, 2, 5].map(speed => (
                  <button key={speed} onClick={() => setReplaySpeed(speed)} style={{
                    padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                    border: replaySpeed === speed ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    background: replaySpeed === speed ? 'rgba(6,182,212,0.18)' : 'transparent',
                    color: replaySpeed === speed ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  }}>{speed}x</button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Collar Visualizer */}
          <CollarVisualizer pet={pet} />
        </div>
      )}

      {/* ══ TAB: GEOFENCE ZONES ══════════════════════════════════════════ */}
      {activeTab === 'geofence' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Map with zones overlay */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div className="section-header">
              <div className="section-title"><Shield size={16} color="var(--accent-emerald)" /> Geofence Zone Map</div>
              <span className="badge badge-safe" style={{ fontSize: '0.6rem' }}>{zones.filter(z => z.active).length} Active</span>
            </div>

            <div style={{ height: '380px', borderRadius: '10px', position: 'relative', overflow: 'hidden', background: '#070D18', border: '1px solid var(--border-color)' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {zones.map(z => (
                  <g key={z.id} style={{ opacity: z.active ? 1 : 0.3 }}>
                    <circle cx={z.cx} cy={z.cy} r={z.radius * 0.5} fill={z.color.replace('var', 'rgba').replace(')', ', 0.08)').replace('--accent-emerald', '16, 185, 129').replace('--accent-cyan', '6, 182, 212').replace('--accent-orange', '249, 115, 22').replace('--accent-purple', '139, 92, 246')} stroke={z.color.replace('var(', '').replace(')', '')} strokeWidth="1.5" strokeDasharray="6,4" />
                    <circle cx={z.cx} cy={z.cy} r={5} fill={z.active ? '#10B981' : 'rgba(255,255,255,0.3)'} />
                    <text x={z.cx + 8} y={z.cy + 4} fill="rgba(255,255,255,0.6)" fontSize="9" fontWeight="600">{z.name}</text>
                  </g>
                ))}
                {/* Pet position */}
                <circle cx={130} cy={265} r={7} fill="var(--accent-emerald)" stroke="#070A11" strokeWidth="2" />
                <circle cx={130} cy={265} r={15} fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
              </svg>
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} /> Pet Position
                <span style={{ marginLeft: '0.5rem' }}>Dashed = Zone boundary</span>
              </div>
            </div>
          </div>

          {/* Zone Manager Panel */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div className="section-header">
              <div className="section-title"><Settings2 size={15} color="var(--accent-cyan)" /> Manage Zones</div>
              <button onClick={() => setShowAddZone(!showAddZone)} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                <Plus size={12} /> New Zone
              </button>
            </div>

            {/* Add Zone Form */}
            {showAddZone && (
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.85rem', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--accent-emerald)' }}>Add New Geofence Zone</div>
                <input value={newZoneName} onChange={e => setNewZoneName(e.target.value)} placeholder="Zone name (e.g. Grandma's House)"
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.45rem 0.7rem', color: '#FFF', fontSize: '0.82rem', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Radius: {newZoneRadius}m</div>
                <input type="range" min={25} max={500} value={newZoneRadius} onChange={e => setNewZoneRadius(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-emerald)', marginBottom: '0.65rem' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={addZone} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.45rem', fontSize: '0.78rem' }}>Add Zone</button>
                  <button onClick={() => setShowAddZone(false)} className="btn-secondary" style={{ padding: '0.45rem 0.65rem', fontSize: '0.78rem' }}><X size={13} /></button>
                </div>
              </div>
            )}

            {/* Zones List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {zones.map(zone => (
                <div key={zone.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  padding: '0.65rem 0.85rem', borderRadius: '10px',
                  background: zone.active ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${zone.active ? 'var(--border-color)' : 'rgba(255,255,255,0.04)'}`,
                  opacity: zone.active ? 1 : 0.5
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: zone.active ? zone.color : 'rgba(255,255,255,0.2)', flexShrink: 0, boxShadow: zone.active ? `0 0 6px ${zone.color}` : 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{zone.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Radius: {zone.radius}m • {zone.lat.toFixed(4)}°N</div>
                  </div>
                  <button onClick={() => toggleZone(zone.id)} style={{
                    width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', position: 'relative',
                    background: zone.active ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.12)',
                    transition: 'background 0.2s ease'
                  }}>
                    <div style={{ position: 'absolute', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#FFF', left: zone.active ? '18px' : '2px', transition: 'left 0.2s ease' }} />
                  </button>
                  <button onClick={() => deleteZone(zone.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.15rem' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {geoSaved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <CheckCircle2 size={14} /> Zones saved to collar firmware!
              </div>
            )}

            <button onClick={saveZones} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.6rem' }}>
              <CheckCircle2 size={14} /> Save Zones to Collar
            </button>
          </div>
        </div>
      )}

      {/* ══ TAB: COLLAR DIAGNOSTICS ══════════════════════════════════════ */}
      {activeTab === 'diagnostics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

          {/* Hardware Vitals */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div className="section-header">
              <div className="section-title"><Cpu size={16} color="var(--accent-cyan)" /> Hardware Vitals</div>
              <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>Live</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { label: 'Firmware Version', value: diagnostics.firmwareVer, color: 'var(--accent-emerald)', action: 'Check Update' },
                { label: 'Collar CPU Temperature', value: `${diagnostics.cpuTemp}°C`, color: diagnostics.cpuTemp > 42 ? 'var(--accent-rose)' : 'var(--accent-emerald)' },
                { label: 'GPS Satellite Count', value: `${diagnostics.satCount} satellites`, color: 'var(--accent-cyan)' },
                { label: 'GPS HDOP Accuracy', value: `${diagnostics.gpsHdop} (${diagnostics.gpsHdop < 1 ? 'Excellent' : 'Good'})`, color: 'var(--accent-emerald)' },
                { label: 'Network Connection', value: diagnostics.networkType, color: 'var(--accent-cyan)' },
                { label: 'Last Cloud Sync', value: diagnostics.lastSync, color: 'var(--accent-emerald)' },
                { label: 'Collar Online Since', value: `${diagnostics.uptimeDays} days`, color: 'var(--text-secondary)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Memory & Storage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div className="section-header">
                <div className="section-title"><Activity size={15} color="var(--accent-purple)" /> Onboard Memory</div>
              </div>
              {[
                { label: 'RAM Usage', value: diagnostics.ramUsage, color: 'var(--accent-purple)' },
                { label: 'Flash Storage', value: diagnostics.storageUsed, color: 'var(--accent-cyan)' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                    <span>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.value}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Lifetime Stats */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div className="section-header">
                <div className="section-title"><ArrowUpRight size={15} color="var(--accent-emerald)" /> Lifetime Collar Stats</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Total Steps', value: diagnostics.totalStepsRecorded.toLocaleString(), sub: 'steps recorded', color: 'var(--accent-emerald)' },
                  { label: 'Total Distance', value: `${diagnostics.totalDistanceKm} km`, sub: 'lifetime tracked', color: 'var(--accent-cyan)' },
                  { label: 'Active Days', value: diagnostics.uptimeDays, sub: 'consecutive days', color: 'var(--accent-purple)' },
                  { label: 'GPS Accuracy', value: `HDOP ${diagnostics.gpsHdop}`, sub: diagnostics.gpsHdop < 1 ? 'Excellent' : 'Good', color: 'var(--accent-orange)' },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '0.65rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: stat.color, marginBottom: '0.15rem' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                    <div style={{ fontSize: '0.58rem', color: stat.color, fontWeight: 600 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div className="section-header">
                <div className="section-title"><Settings2 size={15} color="var(--text-muted)" /> Collar Actions</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Download GPS History (GPX)', icon: Download, action: () => {}, color: 'var(--accent-cyan)' },
                  { label: 'Share Location Link', icon: Share2, action: () => {}, color: 'var(--accent-purple)' },
                  { label: 'Check Firmware OTA', icon: Zap, action: handleTriggerFirmwareUpdate, color: 'var(--accent-orange)' },
                ].map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <button key={i} onClick={a.action} className="btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.65rem', fontSize: '0.82rem', padding: '0.6rem 0.85rem' }}>
                      <Icon size={15} color={a.color} /> {a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
