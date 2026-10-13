import React, { useState } from 'react';
import {
  User, Camera, Scale, Dna, AlertTriangle, CheckCircle2,
  X, Pencil, Save, Plus, Trash2
} from 'lucide-react';
import { updatePetOnApi, logWeightEntry } from '../services/api';
import { playSuccessChime } from '../utils/soundEffects';

export default function PetProfileEdit({ pet, onClose, onSave }) {
  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed);
  const [age, setAge] = useState(pet.age);
  const [weight, setWeight] = useState(pet.weight);
  const [gender, setGender] = useState(pet.gender);
  const [diet, setDiet] = useState(pet.diet || '');
  const [allergies, setAllergies] = useState(pet.allergies || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(pet.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const updated = {
      ...pet,
      name, breed, age,
      weight: parseFloat(weight) || pet.weight,
      gender, diet, allergies, avatar: avatarUrl
    };
    await updatePetOnApi(pet.id, updated);
    // Log new weight entry if changed
    if (parseFloat(weight) !== parseFloat(pet.weight)) {
      await logWeightEntry(pet.id, parseFloat(weight));
    }
    playSuccessChime();
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onSave(updated);
    }, 1200);
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (a) => setAllergies(allergies.filter(x => x !== a));

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)'
            }}>
              <Pencil size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Edit Pet Profile</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Update {pet.name}'s information</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {saveSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Profile Updated!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Changes saved to cloud backend.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Avatar preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              <img src={avatarUrl} alt={name} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Avatar URL</div>
                <input
                  type="url" value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.65rem', color: '#FFF', fontSize: '0.78rem' }}
                />
              </div>
            </div>

            {/* Name + Breed */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Pet Name', value: name, set: setName, required: true },
                { label: 'Breed', value: breed, set: setBreed },
              ].map(({ label, value, set, required }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{label}</label>
                  <input required={required} type="text" value={value} onChange={e => set(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#FFF', fontSize: '0.85rem' }} />
                </div>
              ))}
            </div>

            {/* Age + Weight + Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Age</label>
                <input type="text" value={age} onChange={e => setAge(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#FFF', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Weight (kg)</label>
                <input type="number" step="0.1" min="0.1" value={weight} onChange={e => setWeight(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#FFF', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#FFF', fontSize: '0.85rem' }}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* Diet */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Diet Plan</label>
              <textarea value={diet} onChange={e => setDiet(e.target.value)} rows={2}
                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#FFF', fontSize: '0.85rem', resize: 'vertical' }} />
            </div>

            {/* Allergies */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Known Allergies
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                {allergies.filter(a => a !== 'None').map(a => (
                  <div key={a} style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
                    borderRadius: '9999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', color: 'var(--accent-rose)'
                  }}>
                    <AlertTriangle size={11} /> {a}
                    <button type="button" onClick={() => removeAllergy(a)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: 0, marginLeft: '0.2rem' }}>
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={newAllergy} onChange={e => setNewAllergy(e.target.value)}
                  placeholder="Add allergy (e.g. Chicken, Dairy)..."
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.45rem 0.7rem', color: '#FFF', fontSize: '0.8rem' }} />
                <button type="button" onClick={addAllergy} className="btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                <Save size={15} /> {isSaving ? 'Saving to Cloud...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
