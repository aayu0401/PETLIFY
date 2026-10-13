import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../models/pet_model.dart';
import '../models/user_model.dart';
import '../models/vet_model.dart';

class PetState extends ChangeNotifier {
  UserProfile? currentUser;
  List<Pet> pets = [];
  String activePetId = 'pet-1';
  bool isBuzzerActive = false;
  int waterLevel = 78;
  int foodLevel = 62;
  Timer? _telemetryTimer;

  // Appointments
  List<VetAppointment> appointments = [];
  
  // Initial Mock Vets
  final List<VetClinic> clinics = [
    VetClinic(
      id: 'vet-1',
      name: 'Paws & Claws Veterinary Hospital',
      doctor: 'Dr. Sarah Jenkins, DVM',
      rating: 4.9,
      reviews: 142,
      distanceKm: 0.8,
      address: '1420 Market St, San Francisco, CA',
      phone: '(555) 349-2810',
      isEmergency: true,
      services: ['24/7 Emergency', 'Surgery', 'TeleHealth Video Consult', 'Digital X-Ray', 'Dental Care'],
      image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=400',
    ),
    VetClinic(
      id: 'vet-2',
      name: 'Mission Pet Emergency & Critical Care',
      doctor: 'Dr. Mike Torres, BVSc',
      rating: 4.8,
      reviews: 98,
      distanceKm: 1.5,
      address: '788 Valencia St, San Francisco, CA',
      phone: '(555) 912-4400',
      isEmergency: true,
      services: ['24/7 Emergency', 'ICU Monitoring', 'Trauma Surgery', 'Blood Transfusions'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    ),
    VetClinic(
      id: 'vet-3',
      name: 'Bay Area Mobile Veterinary Unit',
      doctor: 'Dr. Amanda Hayes, DVM',
      rating: 5.0,
      reviews: 67,
      distanceKm: 2.1,
      address: 'Mobile Service — Direct to Your Doorstep',
      phone: '(555) 670-3322',
      isEmergency: false,
      services: ['At-Home Checkups', 'Vaccinations', 'Microchipping', 'Compassionate Care'],
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400',
    ),
  ];

  PetState() {
    _initDefaults();
    _startLiveTelemetry();
  }

  void _initDefaults() {
    currentUser = UserProfile(
      name: 'Alex Morgan',
      email: 'alex.morgan@petlify.io',
      phone: '(555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      accountType: 'Pet Parent Premium',
    );

    pets = [
      Pet(
        id: 'pet-1',
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        age: '3 Yrs 2 Mos',
        weight: 28.5,
        targetWeight: 27.5,
        gender: 'Male',
        neutered: 'Yes',
        microchip: '985-141-0293',
        avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
        collarId: 'PET-SMART-904',
        collarConnected: true,
        battery: 88,
        signalStrength: 'Excellent (4G LTE + GPS Lock)',
        beaconColor: '#10B981',
        vitals: PetVitals(
          heartRate: 82,
          bodyTemp: 101.4,
          stepsToday: 8420,
          stepsGoal: 10000,
          caloriesBurned: 430,
          sleepHours: '8.5 hrs',
          restlessness: 'Low',
          barkCount: 2,
          scratchCount: 4,
        ),
        location: PetLocation(
          status: 'safe',
          zoneName: 'Home Safe Zone (Radius 150m)',
          address: '742 Evergreen Terrace, Springfield',
          lat: 37.7749,
          lng: -122.4194,
          lastSeen: 'Just now',
        ),
        diet: '2 Cups Organic Protein Kibble (8:00 AM & 6:00 PM)',
        allergies: ['Chicken Feather Powder', 'Dust Mites'],
        medicalNotes: 'Routine DHPP and Rabies vaccinated Jan 2026. Taking daily joint supplements.',
        vetClinic: 'Paws & Claws Veterinary Hospital',
        vetPhone: '(555) 349-2810',
        weightHistory: [
          WeightRecord(date: '2025-09-01', weight: 27.2),
          WeightRecord(date: '2025-10-01', weight: 27.6),
          WeightRecord(date: '2025-11-01', weight: 27.9),
          WeightRecord(date: '2025-12-01', weight: 28.1),
          WeightRecord(date: '2026-01-01', weight: 28.3),
          WeightRecord(date: '2026-02-01', weight: 28.5),
        ],
      ),
      Pet(
        id: 'pet-2',
        name: 'Bella',
        type: 'cat',
        breed: 'Persian Cat',
        age: '2 Yrs 1 Mo',
        weight: 4.2,
        targetWeight: 4.0,
        gender: 'Female',
        neutered: 'Yes',
        microchip: '985-141-0881',
        avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        collarId: 'PET-SMART-302',
        collarConnected: true,
        battery: 94,
        signalStrength: 'Good (Wi-Fi + BLE)',
        beaconColor: '#06B6D4',
        vitals: PetVitals(
          heartRate: 118,
          bodyTemp: 100.8,
          stepsToday: 3200,
          stepsGoal: 5000,
          caloriesBurned: 180,
          sleepHours: '13.2 hrs',
          restlessness: 'Very Low',
          barkCount: 0,
          scratchCount: 1,
        ),
        location: PetLocation(
          status: 'safe',
          zoneName: 'Living Room Safe Zone',
          address: '742 Evergreen Terrace, Springfield',
          lat: 37.7749,
          lng: -122.4194,
          lastSeen: 'Just now',
        ),
        diet: '1 Can Premium Salmon Pate (Morning & Evening)',
        allergies: ['None'],
        medicalNotes: 'Spayed, indoor only, flea preventatives active.',
        vetClinic: 'Paws & Claws Veterinary Hospital',
        vetPhone: '(555) 349-2810',
        weightHistory: [
          WeightRecord(date: '2025-10-01', weight: 4.0),
          WeightRecord(date: '2025-11-01', weight: 4.1),
          WeightRecord(date: '2025-12-01', weight: 4.1),
          WeightRecord(date: '2026-01-01', weight: 4.2),
        ],
      ),
    ];

    appointments = [
      VetAppointment(
        id: 'APT-7821',
        clinicName: 'Paws & Claws Veterinary Hospital',
        doctor: 'Dr. Sarah Jenkins, DVM',
        petName: 'Max',
        service: 'Annual Comprehensive Wellness Checkup',
        date: '2026-08-25',
        time: '10:30 AM',
        phone: '(555) 349-2810',
      ),
    ];
  }

  Pet get activePet {
    return pets.firstWhere((p) => p.id == activePetId, orElse: () => pets.first);
  }

  void setActivePet(String id) {
    activePetId = id;
    notifyListeners();
  }

  void addPet(Pet newPet) {
    pets.insert(0, newPet);
    activePetId = newPet.id;
    notifyListeners();
  }

  void updatePet(Pet updatedPet) {
    final idx = pets.indexWhere((p) => p.id == updatedPet.id);
    if (idx != -1) {
      pets[idx] = updatedPet;
      notifyListeners();
    }
  }

  void toggleBuzzer() {
    isBuzzerActive = !isBuzzerActive;
    notifyListeners();
  }

  void dispenseFood() {
    foodLevel = min(100, foodLevel + 30);
    notifyListeners();
  }

  void refillWater() {
    waterLevel = 100;
    notifyListeners();
  }

  void logWeight(double newWeight) {
    final now = DateTime.now();
    final dateStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
    activePet.weight = newWeight;
    activePet.weightHistory.add(WeightRecord(date: dateStr, weight: newWeight));
    notifyListeners();
  }

  void bookAppointment(VetAppointment apt) {
    appointments.add(apt);
    notifyListeners();
  }

  void cancelAppointment(String id) {
    appointments.removeWhere((a) => a.id == id);
    notifyListeners();
  }

  void triggerGeofenceBreach() {
    if (activePet.location.status == 'safe') {
      activePet.location.status = 'alert';
      activePet.location.zoneName = '⚠️ Boundary Breach Alert';
      activePet.location.address = 'Elm St & 5th Ave (0.4 km outside perimeter)';
    } else {
      activePet.location.status = 'safe';
      activePet.location.zoneName = 'Home Safe Zone (Radius 150m)';
      activePet.location.address = '742 Evergreen Terrace, Springfield';
    }
    notifyListeners();
  }

  void _startLiveTelemetry() {
    _telemetryTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (pets.isNotEmpty && activePet.collarConnected) {
        final deltaBpm = Random().nextInt(5) - 2;
        activePet.vitals.heartRate = (activePet.vitals.heartRate + deltaBpm).clamp(65, 140);
        notifyListeners();
      }
    });
  }

  @override
  void dispose() {
    _telemetryTimer?.cancel();
    super.dispose();
  }
}
