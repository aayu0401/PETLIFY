import React, { useState } from 'react';
import { 
  Stethoscope, 
  MapPin, 
  PhoneCall, 
  Star, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  Video, 
  ShieldAlert, 
  CheckCircle,
  ChevronRight,
  X,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Heart,
  Activity,
  MessageSquare,
  FileText,
  Sparkles,
  Send
} from 'lucide-react';
import { VETS_DIRECTORY } from '../data/mockData';
import { bookAppointmentOnApi } from '../services/api';

export default function VetDirectory({ activePet, pets }) {
  const [mainView, setMainView] = useState('directory'); // 'directory' | 'calendar'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingVet, setBookingVet] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Confirmed appointments for calendar
  const [appointments, setAppointments] = useState([
    { id: 'APT-7821', vetName: 'Paws & Claws Vet Hospital', doctor: 'Dr. Sarah Jenkins', petName: activePet.name, service: 'Annual Wellness Checkup', date: '2026-08-22', time: '10:30 AM', type: 'Wellness', color: 'var(--accent-emerald)' },
    { id: 'APT-6234', vetName: 'Emergency Animal Clinic 24/7', doctor: 'Dr. Mike Torres', petName: activePet.name, service: 'Dental Cleaning & X-Ray', date: '2026-09-05', time: '02:00 PM', type: 'Dental', color: 'var(--accent-cyan)' },
    { id: 'APT-5510', vetName: 'City Mobile Vet Services', doctor: 'Dr. Emma Clark', petName: activePet.name, service: 'Rabies & DHPP Booster', date: '2026-09-18', time: '11:00 AM', type: 'Vaccination', color: 'var(--accent-purple)' },
  ]);
  const [cancellingId, setCancellingId] = useState(null);

  // Tele-Vet Live Video Call State
  const [teleVetCall, setTeleVetCall] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [teleChatMessages, setTeleChatMessages] = useState([
    { sender: 'vet', text: `Hello! I am Dr. Sarah Jenkins. I see ${activePet.name}'s live collar vitals streaming on my monitor. Heart rate is ${activePet.vitals?.heartRate || 82} BPM, which looks great. What symptoms are we looking at today?`, time: '10:30 AM' }
  ]);
  const [teleChatInput, setTeleChatInput] = useState('');
  const [callDuration, setCallDuration] = useState('04:15');

  // Form state for booking
  const [bookingPetId, setBookingPetId] = useState(activePet.id);
  const [bookingService, setBookingService] = useState('Wellness & Comprehensive Checkup');
  const [bookingDate, setBookingDate] = useState('2026-08-22');
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [bookingNotes, setBookingNotes] = useState('');

  const categories = ['All', '24/7 Emergency', 'Tele-Vet', 'Surgery', 'Dental Care', 'Mobile Vet'];

  const filteredVets = VETS_DIRECTORY.filter(vet => {
    const matchesSearch = vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vet.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === '24/7 Emergency') return matchesSearch && vet.isEmergency;
    if (selectedCategory === 'Tele-Vet') return matchesSearch && vet.services.includes('TeleHealth Video Consult');
    if (selectedCategory === 'Surgery') return matchesSearch && vet.services.includes('Surgery');
    if (selectedCategory === 'Dental Care') return matchesSearch && vet.services.includes('Dental Care');
    if (selectedCategory === 'Mobile Vet') return matchesSearch && vet.type.includes('Mobile');
    return matchesSearch;
  });

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    const petObj = pets.find(p => p.id === bookingPetId) || activePet;
    const aptData = {
      vetName: bookingVet.name,
      doctor: bookingVet.doctor,
      petName: petObj.name,
      service: bookingService,
      date: bookingDate,
      time: bookingTime,
      address: bookingVet.address,
      phone: bookingVet.phone,
      notes: bookingNotes,
      type: bookingService.includes('Dental') ? 'Dental' : bookingService.includes('Vaccine') || bookingService.includes('Booster') ? 'Vaccination' : 'Wellness',
      color: bookingService.includes('Dental') ? 'var(--accent-cyan)' : bookingService.includes('Emergency') ? 'var(--accent-rose)' : 'var(--accent-emerald)'
    };
    const res = await bookAppointmentOnApi(aptData);
    const confirmation = res.data || { id: 'APT-' + Math.floor(1000 + Math.random() * 9000), ...aptData, status: 'Confirmed' };
    setBookingSuccess(confirmation);
    // Add to local calendar
    setAppointments(prev => [...prev, { ...confirmation }]);
    setBookingVet(null);
  };

  const handleSendTeleChat = (e) => {
    e.preventDefault();
    if (!teleChatInput.trim()) return;
    const userMsg = { sender: 'user', text: teleChatInput, time: 'Just now' };
    setTeleChatMessages(prev => [...prev, userMsg]);
    setTeleChatInput('');

    setTimeout(() => {
      const vetReply = {
        sender: 'vet',
        text: `Understood. Based on ${activePet.name}'s optical collar sensors and your description, I recommend an oral probiotic and monitoring his water intake for the next 24 hours. I have issued a digital prescription summary to your Petlify Medical Vault.`,
        time: 'Just now'
      };
      setTeleChatMessages(prev => [...prev, vetReply]);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Main View Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        {[['directory', '🏥 Find Vets & Book'], ['calendar', `📅 My Appointments (${appointments.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setMainView(id)} style={{
            flex: 1, padding: '0.55rem', border: 'none', cursor: 'pointer', borderRadius: '9px', fontSize: '0.85rem', fontWeight: 700,
            background: mainView === id ? 'rgba(6,182,212,0.15)' : 'transparent',
            color: mainView === id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            outline: mainView === id ? '1px solid rgba(6,182,212,0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}>{label}</button>
        ))}
      </div>

      {/* ══ APPOINTMENT CALENDAR VIEW ══════════════════════════════════ */}
      {mainView === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Total Upcoming', value: appointments.length, color: 'var(--accent-cyan)', emoji: '📋' },
              { label: 'This Month', value: appointments.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length, color: 'var(--accent-emerald)', emoji: '📅' },
              { label: 'Overdue', value: appointments.filter(a => new Date(a.date) < new Date()).length, color: 'var(--accent-rose)', emoji: '⚠️' },
            ].map((stat, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center', borderColor: `${stat.color}33` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.emoji}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Appointments List */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div className="section-header">
              <div className="section-title">📋 Upcoming Appointments</div>
              <button onClick={() => setMainView('directory')} className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
                + Book New
              </button>
            </div>

            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                📅 No appointments yet. Book one from the Vet Directory!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[...appointments].sort((a, b) => new Date(a.date) - new Date(b.date)).map((apt) => {
                  const isPast = new Date(apt.date) < new Date();
                  return (
                    <div key={apt.id} style={{
                      display: 'flex', gap: '1rem', alignItems: 'center',
                      padding: '1rem', borderRadius: '12px',
                      background: isPast ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isPast ? 'rgba(255,255,255,0.05)' : 'var(--border-color)'}`,
                      opacity: isPast ? 0.55 : 1
                    }}>
                      {/* Date badge */}
                      <div style={{
                        flexShrink: 0, width: '52px', textAlign: 'center',
                        background: `${apt.color}22`, border: `1px solid ${apt.color}55`,
                        borderRadius: '10px', padding: '0.4rem 0'
                      }}>
                        <div style={{ fontSize: '0.62rem', color: apt.color, fontWeight: 700, textTransform: 'uppercase' }}>
                          {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>
                          {new Date(apt.date).getDate()}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                          {new Date(apt.date).getFullYear()}
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{apt.service}</span>
                          <span className={`badge ${isPast ? 'badge-warning' : 'badge-safe'}`} style={{ fontSize: '0.58rem' }}>{isPast ? 'Past' : 'Upcoming'}</span>
                          {apt.type && <span className="badge badge-cyan" style={{ fontSize: '0.58rem' }}>{apt.type}</span>}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>{apt.vetName} • {apt.doctor}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>🕐 {apt.time}</span>
                          {apt.address && <span>📍 {apt.address}</span>}
                        </div>
                      </div>

                      {!isPast && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                          {apt.phone && (
                            <a href={`tel:${apt.phone}`} className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                              📞
                            </a>
                          )}
                          <button
                            onClick={() => setCancellingId(apt.id === cancellingId ? null : apt.id)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem', color: cancellingId === apt.id ? 'var(--accent-rose)' : undefined }}
                          >
                            {cancellingId === apt.id ? '✕ Confirm Cancel' : 'Cancel'}
                          </button>
                          {cancellingId === apt.id && (
                            <button
                              onClick={() => { setAppointments(prev => prev.filter(a => a.id !== apt.id)); setCancellingId(null); }}
                              className="btn-danger"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}
                            >
                              Yes, Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ VET DIRECTORY VIEW ══════════════════════════════════════════ */}
      {mainView === 'directory' && (
      <>
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-emerald) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 6px 20px rgba(6, 182, 212, 0.35)'
            }}>
              <Stethoscope size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Nearby Vet Clinics & Tele-Vet Care</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Book instant appointments, emergency 24/7 care & start live Tele-Vet video consultations
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setTeleVetCall(VETS_DIRECTORY[1])}
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <Video size={16} /> Start Live Tele-Vet Call
            </button>

            <a 
              href="tel:+15552349001" 
              className="btn-danger"
              style={{ textDecoration: 'none', fontSize: '0.85rem' }}
            >
              <PhoneCall size={16} /> 24/7 Hotline
            </a>
          </div>
        </div>

        {/* Search Input Bar & Category Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 1rem',
            gap: '0.75rem'
          }}>
            <Search size={20} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search vet by clinic name, doctor, or service (e.g. Surgery, Dental, X-Ray, TeleHealth)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                width: '100%'
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  border: selectedCategory === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredVets.map(vet => (
          <div key={vet.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Image & Badge Overlay */}
              <div style={{
                height: '190px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '1rem'
              }}>
                <img src={vet.image} alt={vet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {vet.isEmergency && (
                  <span className="badge badge-danger" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <ShieldAlert size={12} /> 24/7 Emergency
                  </span>
                )}

                <span className="badge badge-cyan" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                  <MapPin size={12} /> {vet.distanceKm} km away
                </span>
              </div>

              {/* Title & Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{vet.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#F59E0B', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Star size={16} fill="#F59E0B" /> {vet.rating} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({vet.reviewsCount})</span>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.6rem' }}>
                {vet.doctor}
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="var(--text-muted)" /> {vet.address}
              </p>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> {vet.hours}
              </div>

              {/* Services Offered Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {vet.services.map(srv => (
                  <span key={srv} style={{
                    fontSize: '0.72rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)'
                  }}>
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setTeleVetCall(vet)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', color: 'var(--accent-cyan)' }}
              >
                <Video size={15} /> Video Consult
              </button>

              <button
                onClick={() => setBookingVet(vet)}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
              >
                <Calendar size={15} /> Book Visit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LIVE TELE-VET VIDEO CONSULTATION ROOM MODAL */}
      {teleVetCall && (
        <div className="modal-overlay" style={{ padding: '1rem' }}>
          <div className="modal-container" style={{ maxWidth: '960px', width: '100%', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            
            {/* Video Call Header */}
            <div style={{
              background: 'rgba(7, 10, 17, 0.95)',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="pulse-dot green" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFF' }}>
                    Live Tele-Vet Video Consultation • {teleVetCall.doctor}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {teleVetCall.name} • Patient: <strong style={{ color: 'var(--accent-emerald)' }}>{activePet.name} ({activePet.breed})</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="badge badge-safe">Duration: {callDuration}</span>
                <button onClick={() => setTeleVetCall(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Video Feed Body & Chat Sidebar */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', minHeight: 0 }}>
              
              {/* Main Doctor Video Feed Canvas */}
              <div style={{
                background: '#040711',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1594824813589-38b4d8d1cf94?auto=format&fit=crop&q=80&w=800" 
                  alt="Doctor Video"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVideoOff ? 0.2 : 1 }}
                />

                {/* Pet Smart Collar Live Vitals Stream HUD Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(7, 10, 17, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: '#FFF',
                  fontSize: '0.8rem',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
                    <Heart size={16} className="pulse-icon" /> {activePet.vitals.heartRate} BPM
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F59E0B', fontWeight: 700 }}>
                    <Activity size={16} /> {activePet.vitals.bodyTemp}°F
                  </div>
                  <span className="badge badge-safe" style={{ fontSize: '0.65rem' }}>Collar Telemetry Live</span>
                </div>

                {/* Self Picture-in-Picture Camera */}
                <div style={{
                  position: 'absolute',
                  bottom: '80px',
                  right: '16px',
                  width: '140px',
                  height: '95px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
                }}>
                  <img src={activePet.avatar} alt="Owner & Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Video Controls Bar */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(14, 20, 32, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <button 
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isMicMuted ? 'var(--accent-rose)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#FFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>

                  <button 
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isVideoOff ? 'var(--accent-rose)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#FFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                  </button>

                  <button 
                    onClick={() => setTeleVetCall(null)}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'var(--accent-rose)',
                      border: 'none',
                      color: '#FFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 15px rgba(244, 63, 94, 0.6)'
                    }}
                  >
                    <PhoneOff size={20} />
                  </button>
                </div>
              </div>

              {/* Consultation Live Chat & Clinical Notes Sidebar */}
              <div style={{
                background: 'var(--bg-surface)',
                borderLeft: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1rem',
                minHeight: 0
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <MessageSquare size={16} color="var(--accent-cyan)" />
                    <span>Doctor Chat & Notes</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '55vh', overflowY: 'auto', paddingRight: '0.3rem' }}>
                    {teleChatMessages.map((msg, idx) => (
                      <div key={idx} style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: msg.sender === 'vet' ? 'rgba(6, 182, 212, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        border: msg.sender === 'vet' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}>
                        <div style={{ fontWeight: 700, color: msg.sender === 'vet' ? 'var(--accent-cyan)' : 'var(--accent-emerald)', marginBottom: '0.2rem' }}>
                          {msg.sender === 'vet' ? teleVetCall.doctor : 'You'}
                        </div>
                        <div style={{ color: 'var(--text-primary)' }}>{msg.text}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'right' }}>{msg.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendTeleChat} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="Type symptom or question..."
                    value={teleChatInput}
                    onChange={(e) => setTeleChatInput(e.target.value)}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.6rem 0.9rem' }}>
                    <Send size={15} />
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {bookingVet && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Book Vet Appointment</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bookingVet.name} • {bookingVet.doctor}</p>
              </div>
              <button onClick={() => setBookingVet(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Select Pet Patient
                </label>
                <select
                  value={bookingPetId}
                  onChange={(e) => setBookingPetId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                >
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Select Care Service
                </label>
                <select
                  value={bookingService}
                  onChange={(e) => setBookingService(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                >
                  <option value="Wellness & Comprehensive Checkup">Wellness & Routine Checkup</option>
                  <option value="Vaccination & Preventive Booster">Vaccination & Booster Shots</option>
                  <option value="TeleHealth Video Consultation">TeleHealth Video Call</option>
                  <option value="Dental Examination & Cleaning">Dental Exam & Cleaning</option>
                  <option value="Urgent Illness / Symptom Evaluation">Urgent Symptom Evaluation</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Preferred Date
                  </label>
                  <input 
                    type="date" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Time Slot
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Symptoms / Notes for Doctor (Optional)
                </label>
                <textarea 
                  rows="3"
                  placeholder="Describe any symptoms, recent diet changes, or behavior notes..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setBookingVet(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Success Modal */}
      {bookingSuccess && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>Appointment Confirmed!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Booking Reference: <strong style={{ color: 'var(--accent-cyan)' }}>{bookingSuccess.id}</strong>
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Clinic:</span>
                <strong>{bookingSuccess.vetName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Attending Vet:</span>
                <strong>{bookingSuccess.doctor}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Patient Pet:</span>
                <strong>{bookingSuccess.petName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Date & Time:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>{bookingSuccess.date} at {bookingSuccess.time}</strong>
              </div>
            </div>

            <button 
              onClick={() => setBookingSuccess(null)} 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done & View Calendar
            </button>
          </div>
        </div>
      )}
      </>
      )}

    </div>
  );
}
