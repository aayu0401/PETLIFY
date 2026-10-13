// Petlify Backend REST + Realtime Telemetry Server (CommonJS)
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'petlify-ultra-secret-2024-key';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ======================== IN-MEMORY DATABASE ========================
const db = {
  users: [
    { id: 'usr-1', name: 'Alex Morgan', email: 'alex@petlify.io', passwordHash: bcrypt.hashSync('demo123', 8), accountType: 'Premium' }
  ],
  pets: [
    {
      id: 'pet-1', ownerId: 'usr-1',
      name: 'Max', type: 'dog', breed: 'Golden Retriever',
      age: '3 Years 2 Months', weight: 28.5, gender: 'Male',
      microchip: '985-141-0293',
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      collarId: 'PET-SMART-904', collarConnected: true, battery: 88,
      vitals: { heartRate: 82, bodyTemp: 101.4, stepsToday: 8420, stepsGoal: 10000, caloriesBurned: 430 },
      location: { status: 'safe', zoneName: 'Home Safe Zone', address: '742 Evergreen Terrace, Springfield', lat: 37.7749, lng: -122.4194 },
      weightHistory: [
        { date: '2025-09-01', weight: 27.2 }, { date: '2025-10-01', weight: 27.6 },
        { date: '2025-11-01', weight: 27.9 }, { date: '2025-12-01', weight: 28.1 },
        { date: '2026-01-01', weight: 28.3 }, { date: '2026-02-01', weight: 28.5 }
      ],
      allergies: ['Chicken Feather Powder', 'Dust Mites'],
      diet: '2 Cups Organic Protein Kibble (8:00 AM & 6:00 PM)'
    }
  ],
  appointments: [],
  orders: [],
  reports: [
    {
      id: 'rep-1', petId: 'pet-1',
      title: 'Comprehensive Annual Wellness & Bloodwork Panel',
      date: '2025-11-14', vetClinic: 'Paws & Claws Veterinary Hospital',
      doctor: 'Dr. Sarah Jenkins, DVM', type: 'Bloodwork & Biochemistry',
      summary: 'CBC normal. Kidney & Liver enzymes within optimal range.',
      aiAnalysis: 'Excellent baseline health. Renal filtration is optimal.'
    }
  ],
  reminders: [
    { id: 'rem-1', petId: 'pet-1', type: 'Vaccination', title: 'DHPP Booster Due', date: '2026-09-10', status: 'upcoming' },
    { id: 'rem-2', petId: 'pet-1', type: 'Grooming', title: 'Monthly Bath & Nail Trim', date: '2026-08-25', status: 'upcoming' }
  ],
  emergencyAlerts: [],
  voiceTranslations: []
};

// ======================== MIDDLEWARE ========================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// ======================== HEALTH CHECK ========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Petlify Cloud REST Engine v2.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    stats: {
      pets: db.pets.length, users: db.users.length,
      appointments: db.appointments.length, orders: db.orders.length
    }
  });
});

// ======================== AUTH ROUTES ========================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, accountType: user.accountType } });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ success: false, error: 'Email already registered' });
  }
  const passwordHash = bcrypt.hashSync(password, 8);
  const newUser = { id: 'usr-' + Date.now(), name, email, passwordHash, accountType: 'Standard' };
  db.users.push(newUser);
  const token = jwt.sign({ id: newUser.id, email, name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ success: true, token, user: { id: newUser.id, name, email, accountType: 'Standard' } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, accountType: user.accountType } });
});

// ======================== PETS ROUTES ========================
app.get('/api/pets', (req, res) => {
  res.json({ success: true, count: db.pets.length, data: db.pets });
});

app.post('/api/pets', (req, res) => {
  const newPet = {
    id: 'pet-' + Date.now(), ownerId: 'usr-1',
    ...req.body,
    vitals: req.body.vitals || { heartRate: 80, bodyTemp: 101.2, stepsToday: 0, stepsGoal: 10000, caloriesBurned: 0 },
    weightHistory: [], collarConnected: false, battery: 100
  };
  db.pets.push(newPet);
  res.status(201).json({ success: true, message: 'Pet profile created', data: newPet });
});

app.get('/api/pets/:id', (req, res) => {
  const pet = db.pets.find(p => p.id === req.params.id);
  if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
  res.json({ success: true, data: pet });
});

app.patch('/api/pets/:id', (req, res) => {
  const idx = db.pets.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Pet not found' });
  db.pets[idx] = { ...db.pets[idx], ...req.body };
  res.json({ success: true, data: db.pets[idx] });
});

// ======================== TELEMETRY ========================
app.get('/api/telemetry/:id', (req, res) => {
  const pet = db.pets.find(p => p.id === req.params.id);
  if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });

  // Simulate live fluctuation on each request
  const bpmDelta = Math.floor(Math.random() * 5) - 2;
  const liveVitals = {
    ...pet.vitals,
    heartRate: Math.min(135, Math.max(65, pet.vitals.heartRate + bpmDelta)),
    bodyTemp: parseFloat((pet.vitals.bodyTemp + (Math.random() * 0.2 - 0.1)).toFixed(1)),
    stepsToday: pet.vitals.stepsToday + Math.floor(Math.random() * 3),
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true, petId: pet.id, collarId: pet.collarId,
    vitals: liveVitals, location: pet.location,
    battery: pet.battery, signalStrength: pet.signalStrength || '4G + GPS'
  });
});

// ======================== APPOINTMENTS ========================
app.get('/api/appointments', (req, res) => {
  res.json({ success: true, count: db.appointments.length, data: db.appointments });
});

app.post('/api/appointments', (req, res) => {
  const appointment = {
    id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
    ...req.body, status: 'Confirmed', createdAt: new Date().toISOString()
  };
  db.appointments.push(appointment);
  res.status(201).json({ success: true, message: 'Vet appointment booked & confirmed!', data: appointment });
});

// ======================== ORDERS ========================
app.post('/api/orders', (req, res) => {
  const order = {
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    ...req.body, status: 'Confirmed & In Transit', estimatedDelivery: '3-5 Business Days',
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
});

// ======================== VET REPORTS ========================
app.get('/api/reports/:petId', (req, res) => {
  const petReports = db.reports.filter(r => r.petId === req.params.petId);
  res.json({ success: true, count: petReports.length, data: petReports });
});

app.post('/api/reports', (req, res) => {
  const report = { id: 'rep-' + Date.now(), ...req.body, createdAt: new Date().toISOString() };
  db.reports.push(report);
  res.status(201).json({ success: true, message: 'Vet report indexed in medical vault.', data: report });
});

// ======================== REMINDERS ========================
app.get('/api/reminders/:petId', (req, res) => {
  const reminders = db.reminders.filter(r => r.petId === req.params.petId);
  res.json({ success: true, data: reminders });
});

app.post('/api/reminders', (req, res) => {
  const reminder = { id: 'rem-' + Date.now(), ...req.body, createdAt: new Date().toISOString() };
  db.reminders.push(reminder);
  res.status(201).json({ success: true, data: reminder });
});

app.delete('/api/reminders/:id', (req, res) => {
  const idx = db.reminders.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Reminder not found' });
  db.reminders.splice(idx, 1);
  res.json({ success: true, message: 'Reminder deleted.' });
});

// ======================== WEIGHT HISTORY ========================
app.get('/api/pets/:id/weight-history', (req, res) => {
  const pet = db.pets.find(p => p.id === req.params.id);
  if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
  res.json({ success: true, data: pet.weightHistory || [] });
});

app.post('/api/pets/:id/weight-history', (req, res) => {
  const pet = db.pets.find(p => p.id === req.params.id);
  if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
  const entry = { date: req.body.date || new Date().toISOString().split('T')[0], weight: req.body.weight };
  pet.weightHistory = pet.weightHistory || [];
  pet.weightHistory.push(entry);
  res.status(201).json({ success: true, data: entry });
});

// ======================== AI VOICE TRANSLATION LOG ========================
app.post('/api/voice-translation', (req, res) => {
  const log = { id: 'vt-' + Date.now(), ...req.body, timestamp: new Date().toISOString() };
  db.voiceTranslations.push(log);
  res.status(201).json({ success: true, data: log });
});

app.get('/api/voice-translation/:petId', (req, res) => {
  const logs = db.voiceTranslations.filter(v => v.petId === req.params.petId);
  res.json({ success: true, data: logs.slice(-10) }); // Last 10 translations
});

// ======================== LOST PET EMERGENCY SOS ========================
app.post('/api/emergency/broadcast', (req, res) => {
  const alert = {
    alertId: 'SOS-' + Date.now(),
    ...req.body,
    notifiedUsersCount: Math.floor(140 + Math.random() * 80),
    notifiedClinicsCount: 12,
    status: 'Active',
    broadcastTimestamp: new Date().toISOString()
  };
  db.emergencyAlerts.push(alert);
  res.status(201).json({
    success: true,
    message: `🚨 SOS Alert broadcasted to ${alert.notifiedUsersCount} nearby Petlify members & ${alert.notifiedClinicsCount} vet clinics!`,
    data: alert
  });
});

app.listen(PORT, () => {
  console.log(`\n⚡ Petlify Backend API v2.0 is running on http://localhost:${PORT}`);
  console.log(`   REST Endpoints: /api/health | /api/pets | /api/telemetry | /api/auth | /api/reports`);
  console.log(`   Auth: JWT Bearer Token (demo: alex@petlify.io / demo123)\n`);
});
