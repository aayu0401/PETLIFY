import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-Memory Database Store with initial seed data
let pets = [
  {
    id: 'pet-1',
    name: 'Max',
    type: 'dog',
    breed: 'Golden Retriever',
    age: '3 Years 2 Months',
    weight: '28.5 kg',
    gender: 'Male',
    microchip: '985-141-0293',
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
    collarId: 'PET-SMART-904',
    collarConnected: true,
    battery: 88,
    signalStrength: 'Excellent (4G + GPS Lock)',
    vitals: {
      heartRate: 82,
      bodyTemp: 101.4,
      stepsToday: 8420,
      stepsGoal: 10000,
      caloriesBurned: 430,
      sleepHours: '8.5 hrs',
      restlessness: 'Low',
      barkCount: 2,
      scratchCount: 5,
    },
    location: {
      status: 'safe',
      zoneName: 'Home Safe Zone (Radius 150m)',
      address: '742 Evergreen Terrace, Springfield',
      lat: 37.7749,
      lng: -122.4194,
      lastSeen: 'Just now',
    },
    diet: '2 Cups Organic Protein Kibble (8:00 AM & 6:00 PM)',
    allergies: ['Chicken Feather Powder', 'Dust Mites'],
  }
];

let appointments = [];
let orders = [];
let reports = [
  {
    id: 'rep-1',
    petId: 'pet-1',
    title: 'Comprehensive Annual Wellness & Bloodwork Panel',
    date: '2025-11-14',
    vetClinic: 'Paws & Claws Veterinary Hospital',
    doctor: 'Dr. Sarah Jenkins, DVM',
    type: 'Bloodwork & Biochemistry',
    summary: 'Complete Blood Count (CBC) normal. Kidney & Liver enzymes within optimal range.',
    aiAnalysis: 'Excellent baseline health. Renal filtration is optimal.',
    badgeColor: 'badge-safe'
  }
];

let emergencyAlerts = [];

// ==================== REST API ENDPOINTS ====================

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', service: 'Petlify Cloud REST Engine', timestamp: new Date().toISOString() });
});

// GET /api/pets
app.get('/api/pets', (req, res) => {
  res.json({ success: true, count: pets.length, data: pets });
});

// POST /api/pets
app.post('/api/pets', (req, res) => {
  const newPet = {
    id: 'pet-' + Date.now(),
    ...req.body,
    vitals: req.body.vitals || {
      heartRate: 80,
      bodyTemp: 101.2,
      stepsToday: 0,
      stepsGoal: 10000,
      caloriesBurned: 0,
      sleepHours: '8.0 hrs',
      restlessness: 'Low'
    }
  };
  pets.push(newPet);
  res.status(201).json({ success: true, message: 'Pet profile created', data: newPet });
});

// GET /api/telemetry/:id
app.get('/api/telemetry/:id', (req, res) => {
  const pet = pets.find(p => p.id === req.params.id);
  if (!pet) return res.status(404).json({ success: false, error: 'Pet not found' });
  res.json({
    success: true,
    petId: pet.id,
    collarId: pet.collarId,
    vitals: pet.vitals,
    location: pet.location,
    battery: pet.battery,
    signalStrength: pet.signalStrength
  });
});

// POST /api/appointments
app.post('/api/appointments', (req, res) => {
  const appointment = {
    id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  appointments.push(appointment);
  res.status(201).json({ success: true, message: 'Vet appointment booked', data: appointment });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const order = {
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    ...req.body,
    status: 'Confirmed & In Transit',
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
});

// POST /api/reports
app.post('/api/reports', (req, res) => {
  const report = {
    id: 'rep-' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  reports.push(report);
  res.status(201).json({ success: true, message: 'Vet report indexed', data: report });
});

// GET /api/reports/:petId
app.get('/api/reports/:petId', (req, res) => {
  const petReports = reports.filter(r => r.petId === req.params.petId);
  res.json({ success: true, count: petReports.length, data: petReports });
});

// POST /api/emergency/broadcast (Lost Pet SOS)
app.post('/api/emergency/broadcast', (req, res) => {
  const alert = {
    alertId: 'SOS-' + Date.now(),
    petId: req.body.petId,
    petName: req.body.petName,
    lastSeenLocation: req.body.location,
    rewardAmount: req.body.rewardAmount || '$500',
    ownerContact: req.body.ownerContact,
    activeRadiusKm: req.body.radiusKm || 5,
    notifiedUsersCount: Math.floor(140 + Math.random() * 80),
    notifiedClinicsCount: 12,
    broadcastTimestamp: new Date().toISOString()
  };
  emergencyAlerts.push(alert);
  res.status(201).json({
    success: true,
    message: `🚨 Emergency Lost Pet Alert Broadcasted to ${alert.notifiedUsersCount} nearby Petlify community members and ${alert.notifiedClinicsCount} local vet clinics!`,
    data: alert
  });
});

app.listen(PORT, () => {
  console.log(`⚡ Petlify Backend REST & Telemetry Server running on http://localhost:${PORT}`);
});
