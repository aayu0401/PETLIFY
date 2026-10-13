import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Bot, 
  Activity, 
  Heart, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  AudioWaveform, 
  Radio,
  Smile,
  ShieldAlert,
  HelpCircle,
  Clock,
  VolumeX
} from 'lucide-react';
import { playTabClick, playSuccessChime, playDispenseSound } from '../utils/soundEffects';

export default function PetVoiceTranslator({ pet }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeModel, setActiveModel] = useState('Gemini 2.5 BioAcoustic Neural Engine v4.2');
  
  // Current Translation Result
  const [currentTranslation, setCurrentTranslation] = useState({
    vocalizationType: 'Playful Staccato Bark Pattern',
    frequency: '780 Hz',
    harmonicScore: '0.94 Resonance',
    bpmCorrelated: 86,
    emotion: 'Joyful Excitement & Play Request',
    confidence: '98.6%',
    humanTranslation: `Hey! I am feeling super energetic right now. Can we grab the tennis ball and head out to the backyard for a game of fetch?`,
    audioTimestamp: 'Just now'
  });

  const [translationHistory, setTranslationHistory] = useState([
    {
      id: 1,
      petName: 'Max',
      soundType: 'Alert Double-Bark',
      frequency: '920 Hz',
      time: '15m ago',
      intent: 'Territorial Alert / Mail Carrier',
      translation: 'I hear footsteps near the porch. I am watching the front door for us!',
      mood: 'Alert & Protective'
    },
    {
      id: 2,
      petName: 'Max',
      soundType: 'Soft Rhythmic Whine',
      frequency: '440 Hz',
      time: '2h ago',
      intent: 'Food Schedule Reminder',
      translation: 'My kibble bowl looks a little empty, could we do dinner slightly early?',
      mood: 'Hungry & Expectant'
    },
    {
      id: 3,
      petName: 'Max',
      soundType: 'Excited Tail-Wag Chirp',
      frequency: '650 Hz',
      time: '5h ago',
      intent: 'Greeting & Affection',
      translation: 'You are back! I missed you so much while you were in that room!',
      mood: 'Extremely Happy'
    }
  ]);

  // Audio Waveform Randomizer during recording
  const [audioBars, setAudioBars] = useState([20, 45, 80, 60, 30, 95, 40, 70, 50, 85, 30, 60]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 75) + 20));
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const presetSamples = [
    {
      title: '🚪 Doorbell / Porch Alert Bark',
      type: 'Sharp Staccato Alert Bark (920 Hz)',
      translation: 'Someone just stepped onto the front driveway! I am on high alert and keeping the home secure.',
      emotion: 'Protective & Alert',
      confidence: '99.1%'
    },
    {
      title: '🥣 Food Bowl / Treat Whine',
      type: 'Harmonic Low Frequency Whine (420 Hz)',
      translation: 'Excuse me, my internal clock says it is treat time! Let’s open the pantry cabinet.',
      emotion: 'Hungry & Anticipating',
      confidence: '97.8%'
    },
    {
      title: '🎾 Tennis Ball Fetch Invitation',
      type: 'Playful High-Pitch Trill Bark (760 Hz)',
      translation: 'Look at the ball in my mouth! Throw it as far as you can across the grass, I will fetch it!',
      emotion: 'Joyful & Playful',
      confidence: '98.4%'
    },
    {
      title: '🐾 Leash / Walk Request Howl',
      type: 'Ascending Melodic Howl (610 Hz)',
      translation: 'The sun is shining outside and my collar says the pavement temperature is safe! Let’s go for our park walk!',
      emotion: 'Excited & Eager',
      confidence: '98.9%'
    }
  ];

  const handleRecordTrigger = () => {
    if (!isRecording) {
      playTabClick();
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          playSuccessChime();
          const sample = presetSamples[Math.floor(Math.random() * presetSamples.length)];
          const newTrans = {
            vocalizationType: sample.type,
            frequency: (Math.floor(Math.random() * 400) + 500) + ' Hz',
            harmonicScore: '0.96 Resonance',
            bpmCorrelated: pet.vitals.heartRate,
            emotion: sample.emotion,
            confidence: sample.confidence,
            humanTranslation: sample.translation,
            audioTimestamp: 'Just now'
          };
          setCurrentTranslation(newTrans);
          setTranslationHistory(prev => [{
            id: Date.now(),
            petName: pet.name,
            soundType: sample.title,
            frequency: newTrans.frequency,
            time: 'Just now',
            intent: sample.emotion,
            translation: sample.translation,
            mood: sample.emotion
          }, ...prev]);
        }, 1400);
      }, 3000);
    }
  };

  const handleSelectPreset = (sample) => {
    playTabClick();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      playSuccessChime();
      setCurrentTranslation({
        vocalizationType: sample.type,
        frequency: '810 Hz',
        harmonicScore: '0.95 Resonance',
        bpmCorrelated: pet.vitals.heartRate,
        emotion: sample.emotion,
        confidence: sample.confidence,
        humanTranslation: sample.translation,
        audioTimestamp: 'Just now'
      });
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(6, 182, 212, 0.1) 100%)',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.35)'
          }}>
            <Bot size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Pet BioAcoustic AI Voice-to-Human Translator</h2>
              <span className="badge badge-safe">Gemini 2.5 BioSpeech</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Real-time neural decoding of {pet.name}'s barks, whines, growls & meows into human speech intent
            </p>
          </div>
        </div>

        {/* AI Model Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Neural Model:</span>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-cyan)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <option value="Gemini 2.5 BioAcoustic Neural Engine v4.2">Gemini 2.5 BioAcoustic Engine v4.2</option>
            <option value="DeepBark Canine Intent Decoder v3.8">DeepBark Canine Intent Decoder v3.8</option>
            <option value="FelineBioSpeech Acoustic Matrix v2.1">FelineBioSpeech Acoustic Matrix v2.1</option>
          </select>
        </div>
      </div>

      {/* Main Studio Grid: Live Microphone Recorder + Translation Output */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1.8fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Live Audio Capture & Frequency Analyzer */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Collar Mic Telemetry</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Capture {pet.name}'s Voice</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Listen through smart collar microphone or tap to record live acoustic audio
            </p>
          </div>

          {/* Interactive Microphone Pulse Center Button */}
          <div style={{ position: 'relative', margin: '1rem 0' }}>
            {isRecording && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                right: '-15px',
                bottom: '-15px',
                borderRadius: '50%',
                border: '2px solid var(--accent-rose)',
                animation: 'pulse-ring 1.5s infinite'
              }} />
            )}

            <button
              onClick={handleRecordTrigger}
              disabled={isRecording || isAnalyzing}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: isRecording 
                  ? 'linear-gradient(135deg, #F43F5E 0%, #DC2626 100%)' 
                  : 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
                border: 'none',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isRecording ? '0 0 35px rgba(244, 63, 94, 0.6)' : '0 10px 30px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <Mic size={42} className={isRecording ? "pulse-icon" : ""} />
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isRecording ? 'var(--accent-rose)' : isAnalyzing ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
            {isRecording ? '🔴 Listening & Capturing Acoustic Frequencies...' : isAnalyzing ? '⚡ Gemini 2.5 BioAcoustic Neural Decoding...' : 'Tap Mic to Start Live Pet Voice Translation'}
          </div>

          {/* Frequency Waveform Audio Bars */}
          <div style={{
            width: '100%',
            height: '80px',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '0 1rem'
          }}>
            {audioBars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: `${isRecording ? h : Math.max(12, h * 0.3)}%`,
                  background: isRecording ? 'var(--accent-rose)' : 'linear-gradient(180deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
                  borderRadius: '3px',
                  transition: 'height 0.1s ease'
                }}
              />
            ))}
          </div>

          {/* Sample Preset Audio Barks to test */}
          <div style={{ width: '100%', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Or Test Verified Bark Sound Samples:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {presetSamples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(sample)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <span>{sample.title}</span>
                  <Play size={12} color="var(--accent-emerald)" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Translation & Human Speech Output Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Main Translation Output Card */}
          <div className="glass-panel" style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '2px solid var(--accent-emerald)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.5), var(--shadow-glow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                  AI Human Speech Translation Output
                </span>
              </div>
              <span className="badge badge-safe">Confidence: {currentTranslation.confidence}</span>
            </div>

            {/* Translated Human Speech Quote */}
            <div style={{
              background: 'rgba(7, 10, 17, 0.85)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{currentTranslation.humanTranslation}"
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--accent-cyan)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Translated from {pet.name}'s vocal cords</span> • <span>{currentTranslation.audioTimestamp}</span>
              </div>
            </div>

            {/* Neural Acoustic Biomarker Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>VOCALIZATION TYPE</span>
                <div style={{ fontWeight: 800, color: '#FFF', marginTop: '0.2rem' }}>{currentTranslation.vocalizationType}</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>PEAK FREQUENCY & PITCH</span>
                <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>{currentTranslation.frequency} ({currentTranslation.harmonicScore})</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>EMOTIONAL STATE</span>
                <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>{currentTranslation.emotion}</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>COLLAR HEART RATE</span>
                <div style={{ fontWeight: 800, color: 'var(--accent-rose)', marginTop: '0.2rem' }}>{currentTranslation.bpmCorrelated} BPM (Correlated)</div>
              </div>
            </div>
          </div>

          {/* Stored Acoustic Event Log */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Recent Acoustic Vocalization Logs</h4>
              </div>
              <span className="badge badge-cyan">{translationHistory.length} Events</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {translationHistory.map(log => (
                <div key={log.id} className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-safe" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>{log.soundType}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.frequency}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.time}</span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                    "{log.translation}"
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    Intent: {log.intent}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
