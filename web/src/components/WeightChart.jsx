import React, { useState, useEffect, useRef } from 'react';
import { Scale, TrendingUp, TrendingDown, Plus, CheckCircle2, X } from 'lucide-react';
import { fetchWeightHistory, logWeightEntry } from '../services/api';

export default function WeightChart({ pet }) {
  const [history, setHistory] = useState(pet.weightHistory || [
    { date: '2025-09-01', weight: 27.2 },
    { date: '2025-10-01', weight: 27.6 },
    { date: '2025-11-01', weight: 27.9 },
    { date: '2025-12-01', weight: 28.1 },
    { date: '2026-01-01', weight: 28.3 },
    { date: '2026-02-01', weight: 28.5 },
  ]);
  const [isLogging, setIsLogging] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [logSuccess, setLogSuccess] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    fetchWeightHistory(pet.id).then(data => {
      if (data && data.length > 0) setHistory(data);
    });
  }, [pet.id]);

  const handleLogWeight = async (e) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (isNaN(w) || w <= 0) return;
    const res = await logWeightEntry(pet.id, w);
    const entry = { date: new Date().toISOString().split('T')[0], weight: w };
    setHistory(prev => [...prev, entry]);
    setNewWeight('');
    setIsLogging(false);
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  // Chart dimensions
  const W = 480, H = 140, padX = 36, padY = 16;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const weights = history.map(h => h.weight);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;
  const idealMin = parseFloat(pet.weight) * 0.9;
  const idealMax = parseFloat(pet.weight) * 1.1;

  const toX = (i) => padX + (i / (history.length - 1)) * chartW;
  const toY = (w) => padY + chartH - ((w - minW) / (maxW - minW)) * chartH;

  const linePath = history.map((h, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(h.weight)}`).join(' ');
  const areaPath = `${linePath} L ${toX(history.length - 1)} ${H - padY} L ${toX(0)} ${H - padY} Z`;

  const idealY1 = toY(Math.min(idealMax, maxW));
  const idealY2 = toY(Math.max(idealMin, minW));

  const lastWeight = weights[weights.length - 1];
  const prevWeight = weights[weights.length - 2] || lastWeight;
  const delta = (lastWeight - prevWeight).toFixed(1);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '1.75rem', fontWeight: 900 }}>
              {lastWeight} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>kg</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.2rem 0.5rem', borderRadius: '9999px',
              background: parseFloat(delta) >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              border: `1px solid ${parseFloat(delta) >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
              fontSize: '0.72rem', fontWeight: 700,
              color: parseFloat(delta) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'
            }}>
              {parseFloat(delta) >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {parseFloat(delta) >= 0 ? `+${delta}` : delta} kg
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Ideal range: {idealMin.toFixed(1)}–{idealMax.toFixed(1)} kg
          </div>
        </div>
        <button
          onClick={() => setIsLogging(!isLogging)}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
        >
          <Plus size={13} /> Log Weight
        </button>
      </div>

      {/* Log form */}
      {isLogging && (
        <form onSubmit={handleLogWeight} style={{
          display: 'flex', gap: '0.5rem', alignItems: 'center',
          marginBottom: '0.75rem', padding: '0.65rem', borderRadius: '10px',
          background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)'
        }}>
          <Scale size={15} color="var(--accent-emerald)" />
          <input
            type="number" step="0.1" min="0.5" max="120"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            placeholder="Enter weight in kg..."
            required
            style={{
              flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '0.45rem 0.75rem', color: '#FFF', fontSize: '0.85rem'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>Save</button>
          <button type="button" onClick={() => setIsLogging(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </form>
      )}

      {logSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <CheckCircle2 size={14} /> Weight logged successfully!
        </div>
      )}

      {/* SVG Chart */}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Ideal weight band */}
        <rect
          x={padX} y={idealY1}
          width={chartW} height={idealY2 - idealY1}
          fill="rgba(16,185,129,0.06)"
          rx="4"
        />
        <text x={W - padX + 4} y={idealY1 + 4} fill="rgba(16,185,129,0.5)" fontSize="8">ideal</text>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = padY + t * chartH;
          const val = maxW - t * (maxW - minW);
          return (
            <g key={t}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={padX - 4} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="8">{val.toFixed(1)}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#weightGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))' }} />

        {/* Data points + tooltips */}
        {history.map((h, i) => {
          const x = toX(i);
          const y = toY(h.weight);
          const isHovered = hoveredIdx === i;
          return (
            <g key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r={isHovered ? 6 : 4}
                fill={i === history.length - 1 ? '#10B981' : '#0F172A'}
                stroke="#10B981" strokeWidth="2"
                style={{ transition: 'r 0.15s ease', filter: isHovered ? 'drop-shadow(0 0 6px #10B981)' : 'none' }}
              />
              {isHovered && (
                <g>
                  <rect x={x - 28} y={y - 32} width="56" height="24" rx="5" fill="rgba(10,15,26,0.95)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
                  <text x={x} y={y - 18} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="700">{h.weight} kg</text>
                  <text x={x} y={y - 11} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="7">{formatDate(h.date)}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* X-axis date labels */}
        {history.map((h, i) => (
          <text key={i} x={toX(i)} y={H - 2} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">
            {formatDate(h.date)}
          </text>
        ))}
      </svg>
    </div>
  );
}
