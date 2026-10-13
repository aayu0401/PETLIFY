import React, { useState } from 'react';
import {
  Utensils, Droplets, CheckCircle2, Clock, Plus, Flame,
  TrendingUp, AlertTriangle, RotateCcw, Apple, Fish
} from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_TIMES = ['Morning (8:00 AM)', 'Afternoon (1:00 PM)', 'Evening (6:00 PM)'];

export default function NutritionLog({ pet }) {
  const targetCalories = pet.type === 'cat' ? 250 : 520;
  const [meals, setMeals] = useState({
    'Morning (8:00 AM)': { fed: true, time: '08:05 AM', amount: '1 cup', calories: 185 },
    'Afternoon (1:00 PM)': { fed: false, time: null, amount: '0.5 cup', calories: 90 },
    'Evening (6:00 PM)': { fed: false, time: null, amount: '1 cup', calories: 185 },
  });
  const [waterMl, setWaterMl] = useState(420);
  const [waterGoal] = useState(700);
  const [weeklyCalories] = useState([480, 520, 390, 510, 455, 540, 0]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([
    { text: 'Ate slower than usual this morning — possible tooth sensitivity.', time: '2h ago' }
  ]);

  const fedCalories = Object.values(meals).filter(m => m.fed).reduce((a, m) => a + m.calories, 0);
  const waterPct = Math.round((waterMl / waterGoal) * 100);
  const caloriePct = Math.round((fedCalories / targetCalories) * 100);

  const markFed = (mealTime) => {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMeals(prev => ({
      ...prev,
      [mealTime]: { ...prev[mealTime], fed: true, time: now }
    }));
  };

  const addWater = (ml) => setWaterMl(prev => Math.min(waterGoal + 100, prev + ml));

  const maxWeekly = Math.max(...weeklyCalories.filter(c => c > 0), targetCalories);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        {/* Calories Ring */}
        <div className="stat-card" style={{ textAlign: 'center', borderColor: 'rgba(249,115,22,0.25)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Calories Today</div>
          <svg viewBox="0 0 80 80" style={{ width: '80px', height: '80px', margin: '0 auto 0.5rem auto' }}>
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
            <circle cx="40" cy="40" r="30" fill="none" stroke="#F97316" strokeWidth="7"
              strokeDasharray={`${(caloriePct / 100) * 188.5} 188.5`}
              strokeDashoffset="47" strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.6))' }} />
            <text x="40" y="38" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="900">{fedCalories}</text>
            <text x="40" y="50" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7">/ {targetCalories} kcal</text>
          </svg>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: 700 }}>{caloriePct}% of daily target</div>
        </div>

        {/* Water Ring */}
        <div className="stat-card" style={{ textAlign: 'center', borderColor: 'rgba(6,182,212,0.25)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Water Intake</div>
          <svg viewBox="0 0 80 80" style={{ width: '80px', height: '80px', margin: '0 auto 0.5rem auto' }}>
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
            <circle cx="40" cy="40" r="30" fill="none" stroke="#06B6D4" strokeWidth="7"
              strokeDasharray={`${(waterPct / 100) * 188.5} 188.5`}
              strokeDashoffset="47" strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.6))' }} />
            <text x="40" y="38" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="900">{waterMl}</text>
            <text x="40" y="50" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7">/ {waterGoal} ml</text>
          </svg>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{waterPct}% hydrated</div>
        </div>

        {/* Meal count */}
        <div className="stat-card" style={{ borderColor: 'rgba(16,185,129,0.25)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Meals Fed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFF', lineHeight: 1, marginBottom: '0.25rem' }}>
            {Object.values(meals).filter(m => m.fed).length}
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/{MEAL_TIMES.length}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{pet.diet}</div>
          {pet.allergies && pet.allergies[0] !== 'None' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--accent-orange)', fontWeight: 600 }}>
              <AlertTriangle size={12} /> Avoid: {pet.allergies.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Meal Tracker */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div className="section-header">
          <div className="section-title">
            <Utensils size={16} color="var(--accent-orange)" />
            Meal Schedule
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tap to confirm feeding</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {MEAL_TIMES.map(mealTime => {
            const meal = meals[mealTime];
            return (
              <div key={mealTime} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.75rem 1rem', borderRadius: '10px',
                background: meal.fed ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${meal.fed ? 'rgba(16,185,129,0.25)' : 'var(--border-color)'}`,
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: meal.fed ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: meal.fed ? 'var(--accent-emerald)' : 'var(--text-muted)'
                }}>
                  {meal.fed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{mealTime}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {meal.amount} • {meal.calories} kcal
                    {meal.fed && meal.time && <span style={{ color: 'var(--accent-emerald)', marginLeft: '0.5rem' }}>✓ Fed at {meal.time}</span>}
                  </div>
                </div>
                {!meal.fed ? (
                  <button onClick={() => markFed(mealTime)} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
                    Mark Fed
                  </button>
                ) : (
                  <span className="badge badge-safe" style={{ fontSize: '0.6rem' }}>Done</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Water + Weekly Calories */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
        {/* Water intake tracker */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Droplets size={16} color="var(--accent-cyan)" />
              Water Intake
            </div>
          </div>
          <div className="progress-track" style={{ height: '8px', marginBottom: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${Math.min(100, waterPct)}%`, background: 'linear-gradient(90deg, var(--accent-cyan), #67E8F9)' }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            {waterMl} ml / {waterGoal} ml goal
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[50, 100, 200].map(ml => (
              <button key={ml} onClick={() => addWater(ml)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '0.4rem', fontSize: '0.75rem' }}>
                +{ml}ml
              </button>
            ))}
          </div>
        </div>

        {/* Weekly calorie bar chart */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">
              <Flame size={16} color="var(--accent-orange)" />
              Weekly Calories
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: {targetCalories} kcal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '64px', marginBottom: '0.5rem' }}>
            {weeklyCalories.map((cal, i) => {
              const isToday = i === 6;
              const h = cal > 0 ? `${Math.round((cal / maxWeekly) * 100)}%` : '4px';
              const isOver = cal > targetCalories;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: h,
                    borderRadius: '4px 4px 0 0',
                    background: isToday ? 'var(--accent-orange)' : isOver ? 'var(--accent-rose)' : 'rgba(249,115,22,0.35)',
                    opacity: cal === 0 ? 0.3 : 1,
                    transition: 'height 0.5s ease',
                    minHeight: '4px'
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {DAYS.map((d, i) => (
              <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: '0.62rem', color: i === 6 ? 'var(--accent-orange)' : 'var(--text-muted)', fontWeight: i === 6 ? 700 : 400 }}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Diet Notes */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div className="section-header">
          <div className="section-title">
            <Apple size={16} color="var(--accent-emerald)" />
            Diet Notes & Observations
          </div>
          <button onClick={() => setShowAddNote(!showAddNote)} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            <Plus size={12} /> Add Note
          </button>
        </div>
        {showAddNote && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text" value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Note a feeding behavior, refusal, vomiting, etc..."
              style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#FFF', fontSize: '0.82rem' }}
            />
            <button onClick={() => {
              if (noteText.trim()) {
                setNotes(prev => [{ text: noteText, time: 'Just now' }, ...prev]);
                setNoteText('');
                setShowAddNote(false);
              }
            }} className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>Save</button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notes.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
              <Fish size={14} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem' }}>{n.text}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
