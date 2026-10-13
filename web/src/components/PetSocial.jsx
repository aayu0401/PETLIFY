import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  X,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PetSocial({ activePet }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaydatePet, setSelectedPlaydatePet] = useState(null);
  const [inviteSent, setInviteSent] = useState(false);

  // Form State
  const [playdateLocation, setPlaydateLocation] = useState('Golden Gate Dog Park & Run');
  const [playdateDate, setPlaydateDate] = useState('2026-08-23');
  const [playdateTime, setPlaydateTime] = useState('04:00 PM');
  const [playdateMessage, setPlaydateMessage] = useState(`Hi! Would love to bring ${activePet.name} for a fun park walk and playdate!`);

  const nearbyPets = [
    {
      id: 'soc-1',
      name: 'Rocky',
      type: 'dog',
      breed: 'French Bulldog',
      age: '2 Years',
      gender: 'Male',
      ownerName: 'Jessica Taylor',
      distanceKm: 0.6,
      compatibility: 98,
      tags: ['Super Friendly', 'Ball Fetcher', 'Park Regular'],
      avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      bio: 'Loves chasing tennis balls at the park! Super gentle with all dog sizes.'
    },
    {
      id: 'soc-2',
      name: 'Milo',
      type: 'dog',
      breed: 'Australian Shepherd',
      age: '1.5 Years',
      gender: 'Male',
      ownerName: 'David Chen',
      distanceKm: 1.2,
      compatibility: 95,
      tags: ['High Energy', 'Agility Lover', 'Frisbee Champ'],
      avatar: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400',
      bio: 'High energy pup looking for running buddies in the afternoon.'
    },
    {
      id: 'soc-3',
      name: 'Nala',
      type: 'dog',
      breed: 'Shiba Inu',
      age: '3 Years',
      gender: 'Female',
      ownerName: 'Sophie Bennett',
      distanceKm: 1.8,
      compatibility: 91,
      tags: ['Calm', 'Leash Trained', 'Cafe Friendly'],
      avatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400',
      bio: 'Calm and polite. Enjoys cozy walks and patio cafes.'
    },
    {
      id: 'soc-4',
      name: 'Buster',
      type: 'dog',
      breed: 'Labrador Retriever',
      age: '2.5 Years',
      gender: 'Male',
      ownerName: 'Marcus Vance',
      distanceKm: 2.4,
      compatibility: 99,
      tags: ['Swimmer', 'High Energy', 'Social Butterfly'],
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      bio: 'Loves water games and swimming. Always down for weekend playdates!'
    }
  ];

  const filteredPets = nearbyPets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendInvite = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
    setInviteSent(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        borderColor: 'rgba(249, 115, 22, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--accent-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF'
          }}>
            <Users size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Petlify Social & Nearby Playdates</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Connect with nearby verified pet owners, schedule dog park playdates & meetups
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.85rem', gap: '0.5rem' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search nearby pets by breed or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Grid of Nearby Pets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredPets.map(p => (
          <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                height: '190px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1rem'
              }}>
                <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                <span className="badge badge-safe" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <Sparkles size={12} /> {p.compatibility}% Match for {activePet.name}
                </span>

                <span className="badge badge-cyan" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                  <MapPin size={12} /> {p.distanceKm} km away
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{p.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.gender}</span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {p.breed} • {p.age}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                "{p.bio}"
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    fontSize: '0.72rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)'
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Owner: <strong>{p.ownerName}</strong></span>

              <button
                onClick={() => setSelectedPlaydatePet(p)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
              >
                <Calendar size={15} /> Playdate Invite
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Playdate Invitation Modal */}
      {selectedPlaydatePet && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Schedule Playdate with {selectedPlaydatePet.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Owner: {selectedPlaydatePet.ownerName} ({selectedPlaydatePet.distanceKm} km away)</p>
              </div>
              <button onClick={() => { setSelectedPlaydatePet(null); setInviteSent(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {!inviteSent ? (
              <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Meeting Location / Dog Park
                  </label>
                  <select
                    value={playdateLocation}
                    onChange={(e) => setPlaydateLocation(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="Golden Gate Dog Park & Run">Golden Gate Dog Park & Run (0.8 km)</option>
                    <option value="Mission Bay Bark Park">Mission Bay Bark Park (1.4 km)</option>
                    <option value="Presidio Off-Leash Trail">Presidio Off-Leash Trail (2.2 km)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Date
                    </label>
                    <input 
                      type="date"
                      value={playdateDate}
                      onChange={(e) => setPlaydateDate(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Time
                    </label>
                    <select
                      value={playdateTime}
                      onChange={(e) => setPlaydateTime(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Personal Note for {selectedPlaydatePet.ownerName}
                  </label>
                  <textarea 
                    rows="3"
                    value={playdateMessage}
                    onChange={(e) => setPlaydateMessage(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  Send Playdate Invitation <Sparkles size={18} />
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>Playdate Invitation Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  {selectedPlaydatePet.ownerName} has received your invite for <strong style={{ color: 'var(--accent-emerald)' }}>{playdateDate} at {playdateTime}</strong> at {playdateLocation}.
                </p>
                <button onClick={() => { setSelectedPlaydatePet(null); setInviteSent(false); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
