import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  DollarSign, 
  Send, 
  X, 
  CheckCircle2, 
  Radio, 
  Users, 
  Share2, 
  AlertTriangle 
} from 'lucide-react';
import { broadcastLostPetAlert } from '../services/api';
import { playCollarBeep, playSuccessChime } from '../utils/soundEffects';

export default function LostPetBroadcastModal({ pet, onClose, onBroadcastSuccess }) {
  const [rewardAmount, setRewardAmount] = useState('$500');
  const [ownerPhone, setOwnerPhone] = useState('+1 (555) 234-9001');
  const [broadcastRadius, setBroadcastRadius] = useState(5); // km
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setIsBroadcasting(true);
    playCollarBeep();

    const payload = {
      petId: pet.id,
      petName: pet.name,
      location: pet.location.address,
      rewardAmount,
      ownerContact: ownerPhone,
      radiusKm: broadcastRadius
    };

    const res = await broadcastLostPetAlert(payload);
    setIsBroadcasting(false);
    playSuccessChime();
    setBroadcastResult(res);
    if (onBroadcastSuccess) onBroadcastSuccess(res);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '620px', border: '2px solid var(--accent-rose)', boxShadow: '0 0 40px rgba(244, 63, 94, 0.4)' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.2)',
              border: '1px solid var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)'
            }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>Lost Pet Community SOS Broadcast</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant push alert to nearby Petlify owners & vet clinics</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {broadcastResult ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginBottom: '0.5rem' }}>
              SOS Broadcast Transmitted!
            </h4>
            <p style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              {broadcastResult.message}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div><strong>Alert ID:</strong> {broadcastResult.data?.alertId}</div>
              <div><strong>Broadcast Radius:</strong> {broadcastRadius} km radius</div>
              <div><strong>Target Pet:</strong> {pet.name} ({pet.breed}) • Microchip #{pet.microchip}</div>
              <div><strong>Owner Contact:</strong> {ownerPhone}</div>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close & Monitor Collar Satellite Fix
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Pet Quick Info Banner */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
              <img src={pet.avatar} alt={pet.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{pet.name} ({pet.breed})</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Last Seen GPS: <strong style={{ color: 'var(--accent-cyan)' }}>{pet.location.address}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Microchip ID: {pet.microchip}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Emergency Owner Phone
                </label>
                <input 
                  type="text" 
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Reward Offer (Optional)
                </label>
                <input 
                  type="text" 
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Broadcast Alert Radius: <strong style={{ color: 'var(--accent-cyan)' }}>{broadcastRadius} km (~180 users)</strong>
              </label>
              <input 
                type="range" 
                min="1" 
                max="25" 
                value={broadcastRadius}
                onChange={(e) => setBroadcastRadius(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-rose)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" disabled={isBroadcasting} className="btn-danger" style={{ flex: 1.5, justifyContent: 'center' }}>
                <Send size={16} /> {isBroadcasting ? 'Transmitting SOS Broadcast...' : 'Broadcast Emergency SOS Alert'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
