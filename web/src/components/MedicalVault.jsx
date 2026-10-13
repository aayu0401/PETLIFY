import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Download, 
  Printer, 
  Syringe, 
  Scale, 
  Calendar, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Info, 
  FolderHeart, 
  Eye, 
  Bot,
  QrCode,
  Smartphone,
  PhoneCall,
  Lock
} from 'lucide-react';
import { VACCINATIONS_INITIAL, HISTORICAL_VET_REPORTS } from '../data/mockData';
import WeightChart from './WeightChart';

export default function MedicalVault({ pet, setActiveTab }) {
  const [vaccines, setVaccines] = useState(VACCINATIONS_INITIAL);
  const [reports, setReports] = useState(HISTORICAL_VET_REPORTS);
  const [activeSubTab, setActiveSubTab] = useState('vaccines'); // 'vaccines' | 'reports' | 'weight' | 'digitalId'
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPassportView, setIsPassportView] = useState(false);
  const [selectedReportView, setSelectedReportView] = useState(null);

  // New Vaccine Form State
  const [vacName, setVacName] = useState('');
  const [vacDate, setVacDate] = useState('2026-08-19');
  const [vacDueDate, setVacDueDate] = useState('2027-08-19');
  const [vacClinic, setVacClinic] = useState('Paws & Claws Vet Hospital');
  const [vacDoctor, setVacDoctor] = useState('Dr. Sarah Jenkins');
  const [vacNotes, setVacNotes] = useState('');

  const petVaccines = vaccines.filter(v => v.petId === pet.id);
  const petReports = reports.filter(r => r.petId === pet.id);

  const handleAddVaccine = (e) => {
    e.preventDefault();
    const newRecord = {
      id: 'vac-' + Date.now(),
      petId: pet.id,
      vaccineName: vacName,
      dateAdministered: vacDate,
      dueDate: vacDueDate,
      status: 'Up to Date',
      clinic: vacClinic,
      doctor: vacDoctor,
      notes: vacNotes
    };
    setVaccines([newRecord, ...vaccines]);
    setIsAddModalOpen(false);
    setVacName('');
    setVacNotes('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Vault Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        borderColor: 'rgba(139, 92, 246, 0.25)',
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
            background: 'var(--accent-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF'
          }}>
            <FileText size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{pet.name}'s Medical Vault & Digital Passport</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Vaccination history, lab bloodwork reports, microchip data & digital recovery QR tag
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsPassportView(!isPassportView)} 
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <Printer size={16} /> {isPassportView ? 'Exit Passport Mode' : 'Print / Export Health Passport'}
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add Vaccine Record
          </button>
        </div>
      </div>

      {/* Pet Clinical Summary Card */}
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MICROCHIP ID</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>{pet.microchip}</div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT WEIGHT</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Scale size={18} color="var(--accent-emerald)" /> {pet.weight}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KNOWN ALLERGIES</span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-rose)', marginTop: '0.2rem' }}>
            {pet.allergies.join(', ')}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DIET & PRESCRIBED MEALS</span>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--text-primary)' }}>{pet.diet}</div>
        </div>
      </div>

      {/* Vault Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('vaccines')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeSubTab === 'vaccines' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: activeSubTab === 'vaccines' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Syringe size={18} /> Vaccination Log ({petVaccines.length})
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeSubTab === 'reports' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeSubTab === 'reports' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FolderHeart size={18} /> Vet Reports & Lab Results ({petReports.length})
        </button>

        <button
          onClick={() => setActiveSubTab('digitalId')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeSubTab === 'digitalId' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: activeSubTab === 'digitalId' ? 'var(--accent-purple)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <QrCode size={18} /> Digital Pet ID & Recovery QR
        </button>
      </div>

      {/* SUB-TAB 1: VACCINES LIST */}
      {activeSubTab === 'vaccines' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Syringe size={20} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Vaccination & Preventive Care Log</h3>
            </div>
            <span className="badge badge-safe">{petVaccines.length} Records On File</span>
          </div>

          {petVaccines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
              <Info size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
              <p>No vaccination records found for {pet.name}. Click "Add Vaccine Record" to start tracking.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {petVaccines.map(vac => {
                const isOverdue = vac.status === 'Overdue';
                const isDueSoon = vac.status === 'Due Soon';

                return (
                  <div 
                    key={vac.id} 
                    className="glass-card"
                    style={{
                      borderLeft: `4px solid ${isOverdue ? 'var(--accent-rose)' : isDueSoon ? '#F59E0B' : 'var(--accent-emerald)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: isOverdue ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOverdue ? 'var(--accent-rose)' : 'var(--accent-emerald)'
                        }}>
                          <Syringe size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{vac.vaccineName}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Administered by {vac.doctor} ({vac.clinic})
                          </span>
                        </div>
                      </div>

                      <span className={`badge ${isOverdue ? 'badge-danger' : isDueSoon ? 'badge-warning' : 'badge-safe'}`}>
                        {vac.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.82rem', background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Date Given:</span> <strong>{vac.dateAdministered}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Next Due Date:</span> <strong style={{ color: isOverdue ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{vac.dueDate}</strong>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Vet Notes:</span> {vac.notes}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: VET REPORTS & LAB RESULTS */}
      {activeSubTab === 'reports' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderHeart size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Clinical Vet Reports & Indexed Lab Results</h3>
            </div>

            {setActiveTab && (
              <button 
                onClick={() => setActiveTab('ai-assistant')}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
              >
                <Bot size={16} /> Consult AI Bot Memory
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {petReports.map(rep => (
              <div key={rep.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={`badge ${rep.badgeColor}`}>
                      {rep.type}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rep.date}</span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.4rem' }}>{rep.title}</h4>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {rep.doctor} ({rep.vetClinic})
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    <strong>Doctor Summary:</strong> {rep.summary}
                  </p>

                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '0.2rem' }}>
                      <Sparkles size={14} /> AI Clinical Insights
                    </div>
                    <div style={{ color: 'var(--text-primary)', lineHeight: 1.3 }}>{rep.aiAnalysis}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => setSelectedReportView(rep)}
                    className="btn-secondary" 
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
                  >
                    <Eye size={15} /> View Full Report
                  </button>

                  {setActiveTab && (
                    <button 
                      onClick={() => setActiveTab('ai-assistant')}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
                    >
                      <Bot size={15} /> Ask AI Bot
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DIGITAL PET ID & SCANNABLE QR PASSPORT */}
      {activeSubTab === 'digitalId' && (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            border: '2px solid var(--accent-emerald)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), var(--shadow-glow)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>PETLIFY OFFICIAL ID</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFF' }}>{pet.name}</h3>
              </div>
              <span className="badge badge-safe">Verified NFC & QR</span>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem', textAlign: 'left' }}>
              <img src={pet.avatar} alt={pet.name} style={{ width: '90px', height: '90px', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--accent-emerald)' }} />
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div><strong>Breed:</strong> {pet.breed}</div>
                <div><strong>Microchip:</strong> <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{pet.microchip}</span></div>
                <div><strong>Collar ID:</strong> #{pet.collarId}</div>
                <div><strong>Emergency:</strong> (555) 234-9001</div>
              </div>
            </div>

            {/* QR Code Graphic Box */}
            <div style={{
              background: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
            }}>
              <QrCode size={130} color="#0F172A" />
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, marginTop: '0.4rem' }}>
                SCAN TO VIEW OWNER CONTACT & VET RECORDS
              </span>
            </div>

            <button onClick={() => alert("Digital Pet Passport Card downloaded as PDF!")} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Download size={16} /> Download High-Res ID Badge
            </button>
          </div>
        </div>
      )}

      {/* PDF View Modal for Clinical Report */}
      {selectedReportView && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '680px', background: '#FFFFFF', color: '#111827' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E5E7EB', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase' }}>OFFICIAL CLINICAL VET REPORT</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>{selectedReportView.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Issued by {selectedReportView.doctor} • {selectedReportView.vetClinic}</p>
              </div>
              <button onClick={() => setSelectedReportView(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#111827' }}>Veterinary Findings & Lab Evaluation:</div>
              <p style={{ color: '#374151', lineHeight: 1.5, marginBottom: '1rem' }}>{selectedReportView.summary}</p>
              
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                <strong style={{ color: '#047857' }}>Petlify AI Stored Summary:</strong>
                <p style={{ color: '#065F46', marginTop: '0.2rem' }}>{selectedReportView.aiAnalysis}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => window.print()} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Printer size={16} /> Print Clinical Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vaccine Record Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Add Vaccination Record</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVaccine} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Vaccine Name / Treatment
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rabies 3-Yr Booster, Flea & Tick, Leptospirosis"
                  value={vacName}
                  onChange={(e) => setVacName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Date Given
                  </label>
                  <input 
                    type="date"
                    value={vacDate}
                    onChange={(e) => setVacDate(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Next Booster Due
                  </label>
                  <input 
                    type="date"
                    value={vacDueDate}
                    onChange={(e) => setVacDueDate(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Vet Clinic & Doctor
                </label>
                <input 
                  type="text" 
                  value={vacClinic}
                  onChange={(e) => setVacClinic(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Medical Notes
                </label>
                <textarea 
                  rows="2"
                  value={vacNotes}
                  onChange={(e) => setVacNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Pet Health Passport Modal */}
      {isPassportView && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '750px', background: '#FFFFFF', color: '#111827' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E5E7EB', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>PETLIFY OFFICIAL HEALTH PASSPORT</h2>
                <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Verified Smart Collar Health Record & Medical History</p>
              </div>
              <button onClick={() => setIsPassportView(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', background: '#F9FAFB', padding: '1rem', borderRadius: '12px' }}>
              <img src={pet.avatar} alt={pet.name} style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #10B981' }} />
              <div style={{ fontSize: '0.9rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem', flex: 1 }}>
                <div><strong>Pet Name:</strong> {pet.name}</div>
                <div><strong>Breed:</strong> {pet.breed}</div>
                <div><strong>Age:</strong> {pet.age}</div>
                <div><strong>Microchip:</strong> {pet.microchip}</div>
                <div><strong>Smart Collar ID:</strong> {pet.collarId}</div>
                <div><strong>Weight:</strong> {pet.weight}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Vaccination Log</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ background: '#F3F4F6', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Vaccine</th>
                  <th style={{ padding: '0.5rem' }}>Date Given</th>
                  <th style={{ padding: '0.5rem' }}>Next Due</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {petVaccines.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>{v.vaccineName}</td>
                    <td style={{ padding: '0.5rem' }}>{v.dateAdministered}</td>
                    <td style={{ padding: '0.5rem' }}>{v.dueDate}</td>
                    <td style={{ padding: '0.5rem', color: v.status === 'Up to Date' ? '#10B981' : '#EF4444', fontWeight: 700 }}>{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => window.print()} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Printer size={16} /> Print Official PDF Passport
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
