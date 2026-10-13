import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  User, 
  Stethoscope, 
  ShieldCheck, 
  FileText, 
  Upload, 
  FolderHeart, 
  CheckCircle2, 
  Plus, 
  X, 
  History, 
  Mic, 
  MicOff, 
  Volume2, 
  Download, 
  Printer, 
  Activity, 
  Heart,
  Sliders
} from 'lucide-react';
import { HISTORICAL_VET_REPORTS } from '../data/mockData';

export default function AiHealthAssistant({ pet, setActiveTab }) {
  const [reports, setReports] = useState(HISTORICAL_VET_REPORTS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showMemoryDrawer, setShowMemoryDrawer] = useState(true);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all'); // 'all' | 'symptoms' | 'diet' | 'behavior' | 'labs'

  // New Upload Report Form
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Bloodwork & Lab Test');
  const [reportClinic, setReportClinic] = useState('Paws & Claws Veterinary Hospital');
  const [reportNotes, setReportNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const petReports = reports.filter(r => r.petId === pet.id);

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am your **Petlify AI Health & Clinical Advisor**. I have loaded **${pet.name}'s** full history, including **${petReports.length} indexed veterinary documents** (Bloodwork, X-Rays, Allergies) and real-time smart collar vitals (*${pet.vitals.heartRate} BPM, ${pet.vitals.bodyTemp}°F*). You can ask questions via text or tap the microphone for live voice consultation.`,
      timestamp: 'Just now',
      triage: 'OPTIMAL HEALTH'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    `Analyze ${pet.name}'s latest bloodwork & renal lab report`,
    `Cross-reference ${pet.name}'s current heart rate with 6-month baseline`,
    `What diet & supplements are recommended for hip joint comfort?`,
    `Summarize X-Ray findings from last orthopedic visit`
  ];

  const handleUploadReport = (e) => {
    e.preventDefault();
    setIsScanning(true);

    setTimeout(() => {
      const newReport = {
        id: 'rep-' + Date.now(),
        petId: pet.id,
        title: reportTitle || 'Veterinary Clinical Lab Summary',
        date: '2026-08-19',
        vetClinic: reportClinic,
        doctor: 'Dr. Sarah Jenkins, DVM',
        type: reportType,
        summary: reportNotes || 'General health evaluation report attached.',
        aiAnalysis: `AI indexed ${reportTitle || 'Lab report'}. Biomarkers, vitals, and treatment notes extracted into ${pet.name}'s permanent medical vault.`,
        documentUrl: '#pdf-view',
        badgeColor: 'badge-safe'
      };

      setReports([newReport, ...reports]);
      setIsScanning(false);
      setIsUploadModalOpen(false);

      const aiAck = {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        text: `📄 **New Vet Report Indexed!** I have processed **"${newReport.title}"** from ${newReport.vetClinic}. Key findings have been saved to **${pet.name}'s** permanent medical memory. You can ask me questions about this report anytime!`,
        timestamp: 'Just now',
        triage: 'OPTIMAL HEALTH'
      };
      setMessages(prev => [...prev, aiAck]);
      setReportTitle('');
      setReportNotes('');
    }, 1500);
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      let triageBadge = 'OPTIMAL HEALTH';

      const lower = text.toLowerCase();
      if (lower.includes('bloodwork') || lower.includes('lab') || lower.includes('report') || lower.includes('renal')) {
        const bloodReport = petReports.find(r => r.type.includes('Bloodwork')) || petReports[0];
        aiResponseText = `According to **${pet.name}'s** stored report *"${bloodReport?.title || 'Annual Wellness Panel'}"* from ${bloodReport?.date || 'recent visit'}:\n\n- **CBC & Biomarkers:** Kidney & Liver enzymes BUN/Creatinine (1.2) fall in the normal reference interval.\n- **Thyroid T4:** Normal.\n- **Heartworm Panel:** Negative.\n\n*AI Recommendation:* ${pet.name}'s organ metabolic filtration is stable. Next routine bloodwork due in 6 months.`;
        triageBadge = 'OPTIMAL HEALTH';
      } else if (lower.includes('x-ray') || lower.includes('orthopedic') || lower.includes('hip') || lower.includes('joint')) {
        const xrayReport = petReports.find(r => r.type.includes('X-Ray')) || petReports[1];
        aiResponseText = `Referencing **${pet.name}'s** X-Ray scan from ${xrayReport?.date || '2025-06-20'}:\n\n- **Radiology Findings:** Radiographs showed minor mild tightness in the right hip joint socket typical for ${pet.breed}s.\n- **Stored AI Care Protocol:** Omega-3 fatty acid supplements and memory foam orthopedic bedding were prescribed.`;
        triageBadge = 'MILD OBSERVATION';
      } else if (lower.includes('allergy') || lower.includes('scratch') || lower.includes('skin')) {
        aiResponseText = `Checking **${pet.name}'s** permanent allergy registry:\n\n- **Documented Allergies:** ${pet.allergies.join(', ')}.\n- **Telemetry Correlation:** Current scratch count is **${pet.vitals.scratchCount} events** today. Dust mite exposure or seasonal pollen can trigger mild itchiness. Recommend paw wiping after park walks.`;
        triageBadge = 'MILD OBSERVATION';
      } else if (lower.includes('baseline') || lower.includes('trend') || lower.includes('heart rate') || lower.includes('bpm')) {
        aiResponseText = `Comparing **${pet.name}'s** live pulse (**${pet.vitals.heartRate} BPM**) against his 6-month historical baseline:\n\n- **Historical Avg:** 78 - 86 BPM during rest.\n- **Current Reading:** ${pet.vitals.heartRate} BPM is within normal variation (+3.2% from average).\n- **Arrhythmia Risk:** None detected by Smart Collar sensors.`;
        triageBadge = 'OPTIMAL HEALTH';
      } else {
        aiResponseText = `I have cross-referenced **${pet.name}'s** full medical vault (containing ${petReports.length} vet reports and microchip ID #${pet.microchip}). His overall vitals baseline is strong. Is there a specific vet report or symptom you would like me to analyze further?`;
        triageBadge = 'OPTIMAL HEALTH';
      }

      const aiMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Just now',
        triage: triageBadge
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1300);
  };

  const handleTriggerVoiceMode = () => {
    setIsVoiceModeActive(!isVoiceModeActive);
    if (!isVoiceModeActive) {
      setTimeout(() => {
        handleSendMessage("Max seems very active today after his morning walk. Are his vitals within range?");
        setIsVoiceModeActive(false);
      }, 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '680px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.5rem 2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
        borderColor: 'rgba(16, 185, 129, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10B981 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}>
            <Bot size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Petlify AI Health Bot & Voice Assistant</h2>
              <Sparkles size={18} color="var(--accent-emerald)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
              <span className="badge badge-safe" style={{ fontSize: '0.65rem' }}>Engine: Gemini 2.5 Pro Multimodal</span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                Indexed Medical Memory: <strong style={{ color: 'var(--accent-emerald)' }}>{petReports.length} Vet Reports</strong> • Real-time Collar Telemetry Linked
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
          >
            <Upload size={16} /> Upload Vet Report (PDF)
          </button>

          <button 
            onClick={() => setShowMemoryDrawer(!showMemoryDrawer)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
          >
            <History size={16} /> {showMemoryDrawer ? 'Hide Medical Index' : 'View Stored Reports (' + petReports.length + ')'}
          </button>
        </div>
      </div>

      {/* Main Grid: Stored Reports Memory Drawer + AI Chat */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showMemoryDrawer ? '300px 1fr' : '1fr',
        gap: '1.5rem',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden'
      }}>
        
        {/* Left Side: Stored Medical Records & Reports Index */}
        {showMemoryDrawer && (
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 800 }}>
                <FileText size={18} color="var(--accent-cyan)" />
                <span>Indexed Vet Memory</span>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{petReports.length} Files</span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              The AI automatically refers to these documents when analyzing symptoms or answering health questions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {petReports.map(rep => (
                <div key={rep.id} className="glass-card" style={{ padding: '0.85rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span className={`badge ${rep.badgeColor}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                      {rep.type}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rep.date}</span>
                  </div>

                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    {rep.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {rep.summary}
                  </p>

                  <button
                    onClick={() => handleSendMessage(`Analyze ${pet.name}'s report "${rep.title}"`)}
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: 'var(--accent-emerald)',
                      borderRadius: '4px',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    Analyze with AI Bot ✨
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Side: AI Assistant Chat Screen & Voice Mode */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          overflow: 'hidden'
        }}>
          
          {/* Voice Mode Audio Waveform Animation Banner */}
          {isVoiceModeActive && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1.25rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mic size={20} color="var(--accent-emerald)" className="pulse-icon" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Listening... Speak naturally to AI Vet Assistant</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[12, 24, 16, 32, 20, 28, 14].map((h, i) => (
                  <div key={i} style={{ width: '4px', height: `${h}px`, background: 'var(--accent-emerald)', borderRadius: '2px', animation: `pulse-ring ${0.8 + i * 0.1}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Chat Feed */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            paddingRight: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            {messages.map(msg => (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? 'var(--accent-cyan)' : 'linear-gradient(135deg, #10B981 0%, #8B5CF6 100%)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {msg.sender === 'user' ? <User size={18} /> : <Bot size={20} />}
                </div>

                <div style={{
                  maxWidth: '78%',
                  background: msg.sender === 'user' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: msg.sender === 'user' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.5
                }}>
                  {msg.triage && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span className={`badge ${msg.triage === 'OPTIMAL HEALTH' ? 'badge-safe' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        <ShieldCheck size={12} /> {msg.triage}
                      </span>
                    </div>
                  )}

                  <div dangerouslySetInnerHTML={{ 
                    __html: msg.text
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} />

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-emerald)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} />
                </div>
                <div className="glass-card" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Analyzing historical vet reports & collar sensor stream...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts & Message Input with Voice Button */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Sparkles size={12} color="var(--accent-cyan)" /> {qp}
                </button>
              ))}
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.5rem 0.4rem 1rem',
                gap: '0.75rem'
              }}
            >
              <input 
                type="text" 
                placeholder={`Ask AI about ${pet.name}'s vet reports, bloodwork, allergies, or vitals history...`}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem'
                }}
              />

              {/* Voice Consultation Toggle Button */}
              <button 
                type="button"
                onClick={handleTriggerVoiceMode}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isVoiceModeActive ? 'var(--accent-rose)' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-color)',
                  color: isVoiceModeActive ? '#FFF' : 'var(--accent-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Voice Consultation Mode"
              >
                <Mic size={18} />
              </button>

              <button 
                type="submit"
                className="btn-primary"
                style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
              >
                Send <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Upload & Index Vet Report Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Upload Vet Report for AI Indexing</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add bloodwork, radiology X-rays, or allergy test for {pet.name}</p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Document Title / Description
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Annual Blood Panel & Renal Function Test"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="Bloodwork & Lab Test">Bloodwork & Biochemistry</option>
                    <option value="X-Ray Radiology Scan">X-Ray & Radiology Scan</option>
                    <option value="Allergy Profile Report">Allergy IgE Profile</option>
                    <option value="Dental Examination">Dental Scan & Procedure</option>
                    <option value="Surgery / Operation Summary">Surgery & Surgical Notes</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Veterinary Clinic
                  </label>
                  <input 
                    type="text" 
                    value={reportClinic}
                    onChange={(e) => setReportClinic(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Drag and Drop Upload Visual Target */}
              <div style={{
                border: '2px dashed var(--accent-emerald)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.05)',
                cursor: 'pointer'
              }}>
                <Upload size={32} color="var(--accent-emerald)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Click or Drag PDF / Scanned Image Report Here</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Supports PDF, PNG, JPG up to 25 MB</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Doctor's Notes / Summary (Optional)
                </label>
                <textarea 
                  rows="2"
                  placeholder="Paste or type doctor summary notes..."
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isScanning} style={{ flex: 1, justifyContent: 'center' }}>
                  {isScanning ? 'AI Scanning & Indexing...' : 'Scan & Save to AI Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
