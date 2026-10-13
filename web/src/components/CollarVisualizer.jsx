import React, { useState } from 'react';
import { 
  Radio, 
  Sun, 
  Battery, 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Check, 
  Sliders,
  Sparkles,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export default function CollarVisualizer({ pet, onLedColorChange, onLedModeChange }) {
  const [selectedColor, setSelectedColor] = useState('#10B981'); // Emerald Green default
  const [ledMode, setLedMode] = useState('glow'); // 'glow' | 'pulse' | 'strobe' | 'emergency'

  const colorOptions = [
    { name: 'Emerald Safety', hex: '#10B981', glow: 'rgba(16, 185, 129, 0.6)' },
    { name: 'Electric Cyan', hex: '#06B6D4', glow: 'rgba(6, 182, 212, 0.6)' },
    { name: 'Sunset Orange', hex: '#F97316', glow: 'rgba(249, 115, 22, 0.6)' },
    { name: 'Strobe White', hex: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.7)' },
    { name: 'Neon Purple', hex: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.6)' }
  ];

  const ledModes = [
    { id: 'glow', label: 'Solid Glow' },
    { id: 'pulse', label: 'Slow Pulse' },
    { id: 'strobe', label: 'Night Strobe' },
    { id: 'emergency', label: 'Beacon Flash' }
  ];

  const handleSelectColor = (colorHex) => {
    setSelectedColor(colorHex);
    if (onLedColorChange) onLedColorChange(colorHex);
  };

  const handleSelectMode = (modeId) => {
    setLedMode(modeId);
    if (onLedModeChange) onLedModeChange(modeId);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Visualizer Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Radio size={22} color={selectedColor} />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Smart Collar Hardware Visualizer</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Hardware ID: <strong style={{ color: selectedColor }}>{pet.collarId}</strong> • Firmware v3.4.1
            </span>
          </div>
        </div>

        <div className="badge badge-safe" style={{ fontSize: '0.72rem' }}>
          <Activity size={12} /> Sensors Active
        </div>
      </div>

      {/* 2D Smart Collar Hardware Mockup Graphic with Dynamic LED Ring */}
      <div style={{
        height: '180px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, #090E17 0%, #111827 100%)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
      }}>
        {/* Background Tech Grid */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* Collar Strap Simulation */}
        <div style={{
          width: '80%',
          height: '42px',
          borderRadius: '21px',
          background: '#1F2937',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          boxShadow: `0 0 25px ${selectedColor}40`
        }}>
          {/* Glowing LED Safety Strip */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            right: '10px',
            height: '8px',
            transform: 'translateY(-50%)',
            borderRadius: '4px',
            background: selectedColor,
            boxShadow: `0 0 20px ${selectedColor}, 0 0 35px ${selectedColor}`,
            animation: ledMode === 'pulse' ? 'pulse-ring 1.8s infinite' : ledMode === 'strobe' ? 'pulse-ring 0.6s infinite' : 'none'
          }} />

          {/* Central Smart Pod Sensor Hub */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '52px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
            border: `2px solid ${selectedColor}`,
            boxShadow: `0 0 20px ${selectedColor}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 0.5rem',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Zap size={14} color={selectedColor} />
              <span style={{ fontSize: '0.6rem', color: '#FFF', fontWeight: 800 }}>GPS</span>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

            {/* Live PPG Heart Rate Sensor LEDs */}
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-rose)', boxShadow: '0 0 8px var(--accent-rose)', animation: 'pulse 1s infinite' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedColor, boxShadow: `0 0 8px ${selectedColor}` }} />
            </div>

            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Wifi size={14} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.6rem', color: '#FFF', fontWeight: 800 }}>4G</span>
            </div>
          </div>
        </div>
      </div>

      {/* LED Safety Color Picker */}
      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Select 360° Safety LED Glow Color
        </label>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {colorOptions.map(col => (
            <button
              key={col.hex}
              onClick={() => handleSelectColor(col.hex)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: selectedColor === col.hex ? `2px solid ${col.hex}` : '1px solid var(--border-color)',
                background: selectedColor === col.hex ? `${col.hex}20` : 'rgba(255, 255, 255, 0.04)',
                color: selectedColor === col.hex ? col.hex : 'var(--text-secondary)',
                fontWeight: selectedColor === col.hex ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: col.hex, boxShadow: `0 0 10px ${col.hex}` }} />
              <span>{col.name}</span>
              {selectedColor === col.hex && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* LED Mode Selector Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
        {ledModes.map(m => (
          <button
            key={m.id}
            onClick={() => handleSelectMode(m.id)}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: ledMode === m.id ? `1px solid ${selectedColor}` : '1px solid var(--border-color)',
              background: ledMode === m.id ? `${selectedColor}15` : 'transparent',
              color: ledMode === m.id ? selectedColor : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Live Hardware Telemetry Diagnostic Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>GPS Precision (HDOP):</span>
          <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '0.1rem' }}>0.8 (Sub-Meter)</div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Cellular Transceiver:</span>
          <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.1rem' }}>-72 dBm (Excellent)</div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Battery Capacity:</span>
          <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '0.1rem' }}>14-Day Li-Po Battery</div>
        </div>
      </div>

    </div>
  );
}
