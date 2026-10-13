import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, Heart, Footprints, Thermometer, Moon } from 'lucide-react';

// Compute a composite 0–100 health score from vitals
function computeHealthScore(vitals, battery) {
  let score = 100;
  // Heart rate (ideal 65–100 BPM for dogs)
  const bpm = vitals.heartRate;
  if (bpm < 65 || bpm > 110) score -= 20;
  else if (bpm < 70 || bpm > 100) score -= 8;
  // Body temp (ideal 100–102.5 °F)
  const temp = vitals.bodyTemp;
  if (temp < 99 || temp > 103.5) score -= 15;
  else if (temp < 100 || temp > 102.5) score -= 5;
  // Steps (at least 60% of goal)
  const stepsPct = (vitals.stepsToday / vitals.stepsGoal) * 100;
  if (stepsPct < 30) score -= 15;
  else if (stepsPct < 60) score -= 5;
  // Battery proxy (low battery = less data quality)
  if (battery < 15) score -= 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getScoreColor(score) {
  if (score >= 85) return '#10B981';
  if (score >= 65) return '#F59E0B';
  return '#F43F5E';
}

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Attention';
}

export default function HealthScore({ pet, compact = false }) {
  const score = computeHealthScore(pet.vitals, pet.battery);
  const yesterday = score + Math.floor(Math.random() * 7) - 3; // simulate
  const delta = score - yesterday;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG ring parameters
  const r = compact ? 28 : 42;
  const cx = compact ? 34 : 50;
  const cy = compact ? 34 : 50;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const viewBox = compact ? '0 0 68 68' : '0 0 100 100';
  const svgSize = compact ? 68 : 100;

  const factors = [
    { icon: Heart, label: 'Heart Rate', value: `${pet.vitals.heartRate} BPM`, ok: pet.vitals.heartRate >= 65 && pet.vitals.heartRate <= 110 },
    { icon: Thermometer, label: 'Temperature', value: `${pet.vitals.bodyTemp}°F`, ok: pet.vitals.bodyTemp >= 100 && pet.vitals.bodyTemp <= 102.5 },
    { icon: Footprints, label: 'Activity', value: `${Math.round((pet.vitals.stepsToday / pet.vitals.stepsGoal) * 100)}% goal`, ok: pet.vitals.stepsToday >= pet.vitals.stepsGoal * 0.6 },
    { icon: Moon, label: 'Sleep', value: pet.vitals.sleepHours || '8.5 hrs', ok: true },
  ];

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg width={svgSize} height={svgSize} viewBox={viewBox}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${filled} ${circumference - filled}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 1s ease' }}
          />
          <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="13" fontWeight="800">
            {score}
          </text>
        </svg>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health Score</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color }}>{label}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Score Ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={svgSize} height={svgSize} viewBox={viewBox}>
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
            {/* Fill */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${filled} ${circumference - filled}`}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dasharray 1.2s ease' }}
            />
            <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="18" fontWeight="900">{score}</text>
            <text x={cx} y={cy + 13} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.45)" fontSize="8">/100</text>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color }}>{label}</span>
            <Sparkles size={14} color={color} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            AI composite score based on vitals, activity & sleep
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.25rem 0.6rem', borderRadius: '9999px',
            background: delta >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
            border: `1px solid ${delta >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
            fontSize: '0.75rem', fontWeight: 700,
            color: delta >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'
          }}>
            {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {delta > 0 ? `+${delta}` : delta} pts vs yesterday
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {factors.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.65rem', borderRadius: '8px',
              background: f.ok ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)',
              border: `1px solid ${f.ok ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}`
            }}>
              <Icon size={13} color={f.ok ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{f.label}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{f.value}</div>
              </div>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: f.ok ? 'var(--accent-emerald)' : 'var(--accent-rose)', flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
