# 🐾 PETLIFY - Next-Gen Smart Pet Care & Health Companion

**PETLIFY** is an all-in-one smart pet care platform featuring real-time biometric telemetry from IoT smart collars, AI vet diagnostics, pet voice translation, digital medical records vault, community social feeds, and veterinary booking.

This repository is organized as a unified monorepo containing both the **Web Application & Backend** and the **Flutter Mobile App**.

---

## 🌟 Architecture & Monorepo Structure

```
PETLIFY/
├── web/                       # React 19 + Vite Web Application & Node.js API
│   ├── src/                   # React frontend (Vitals, AI Voice, Safe Zone, Health Vault)
│   ├── server/                # Express REST + Realtime Telemetry API
│   ├── public/                # Static assets & icons
│   ├── package.json           # Node dependencies & scripts
│   └── vite.config.js         # Vite configuration
│
├── mobile/                    # Cross-platform Flutter Application
│   ├── lib/                   # Flutter Dart screens, models & state management
│   ├── android/               # Android native configuration
│   ├── ios/                   # iOS native configuration
│   ├── pubspec.yaml           # Flutter dependencies & assets
│   └── web/                   # Flutter web support
│
├── .gitignore                 # Unified ignore rules
└── README.md                  # Project documentation
```

---

## 🚀 Key Features

- 🩺 **Live Pet Telemetry & Vitals**: Real-time heart rate (BPM), temperature (°F), steps, calorie tracking, and battery status.
- 📡 **Smart Collar & Safe Zone GPS**: Geofencing, real-time perimeter breach alerts, safe zone mapping.
- 🤖 **AI Vet & Health Diagnostics**: Instant symptom triage, medical report analysis, and dietary recommendations.
- 🎙️ **Pet Voice AI Translator**: Audio pattern and vocalization translation for dogs and cats.
- 🗂️ **Digital Medical Record Vault**: Blood panels, vaccination tracking, and vet notes with automated health summaries.
- 🐕 **Pet Social & Community Hub**: Share pet moments, interact with fellow pet parents, and discover nearby pet-friendly spots.
- 🛒 **Pet Care Market & Vet Booking**: Seamless appointments and essential pet supplies.

---

## 🛠️ Getting Started

### 1. Web Application & Backend (`web/`)

#### Prerequisites
- Node.js (v18+)
- npm or yarn

#### Running the Backend API Server
```bash
cd web
npm install
npm run server
# Backend runs on http://localhost:3001
```

#### Running the Web Application
```bash
cd web
npm run dev
# Frontend runs on http://localhost:5173
```

---

### 2. Flutter Mobile Application (`mobile/`)

#### Prerequisites
- Flutter SDK (v3.0+)
- Android Studio / Xcode (for device emulators)

#### Running the Mobile App
```bash
cd mobile
flutter pub get
flutter run
```

---

## 🔐 Demo Credentials

- **Email**: `alex@petlify.io`
- **Password**: `demo123`

---

## 📄 License

This project is licensed under the MIT License.
