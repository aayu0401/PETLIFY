import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../models/pet_model.dart';
import '../models/user_model.dart';
import '../widgets/glass_card.dart';

class AuthScreen extends StatefulWidget {
  final Function(UserProfile user, Pet? pet) onLoginSuccess;

  const AuthScreen({super.key, required this.onLoginSuccess});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isLogin = true;
  int wizardStep = 1;
  final int totalSteps = 5;

  // Login Form
  final _loginEmailController = TextEditingController(text: 'alex.morgan@petlify.io');
  final _loginPasswordController = TextEditingController(text: '••••••••••••');
  bool _obscurePassword = true;

  // Wizard Step 1: Owner
  final _ownerName = TextEditingController(text: 'Alex Morgan');
  final _ownerEmail = TextEditingController(text: 'alex.morgan@petlify.io');
  final _ownerPhone = TextEditingController(text: '(555) 234-5678');
  final _homeAddress = TextEditingController(text: '742 Evergreen Terrace, Springfield');

  // Wizard Step 2: Pet
  final _petName = TextEditingController(text: 'Max');
  String _petType = 'dog';
  String _petBreed = 'Golden Retriever';
  String _petGender = 'Male';
  String _isNeutered = 'Yes';
  final _petAgeYears = TextEditingController(text: '3');
  final _microchip = TextEditingController(text: '985-141-0293');

  // Wizard Step 3: Health
  final _currentWeight = TextEditingController(text: '28.5');
  final _targetWeight = TextEditingController(text: '27.5');
  final List<String> _selectedAllergies = ['Chicken Feather Powder'];
  final _vetClinic = TextEditingController(text: 'Paws & Claws Veterinary Hospital');

  // Wizard Step 4: Routine
  String _dietType = 'Dry Kibble (High Protein)';
  String _feedingSchedule = '2 Times / Day (8:00 AM & 6:00 PM)';
  final _dailyCalories = TextEditingController(text: '480');

  // Wizard Step 5: Collar IoT
  String _beaconColor = '#10B981';
  double _geofenceRadius = 150;
  bool _emergencyAlerts = true;

  // Provisioning
  bool _isProvisioning = false;
  double _provisionProgress = 0.0;
  String _provisionMessage = '';

  final List<String> _dogBreeds = [
    'Golden Retriever', 'French Bulldog', 'German Shepherd', 'Labrador', 'Poodle', 'Husky'
  ];

  final List<String> _catBreeds = [
    'Persian Cat', 'Maine Coon', 'British Shorthair', 'Siamese', 'Ragdoll'
  ];

  void _handleQuickDemo() {
    final user = UserProfile(
      name: 'Alex Morgan',
      email: 'alex.morgan@petlify.io',
      phone: '(555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      accountType: 'Pet Parent Premium',
    );
    widget.onLoginSuccess(user, null);
  }

  void _handleFinalizeSignup() {
    setState(() {
      _isProvisioning = true;
      _provisionProgress = 0.1;
      _provisionMessage = 'Allocating Cloud Vault & Database...';
    });

    final messages = [
      'Calibrating Optical PPG & Body Thermistors...',
      'Setting Up Safe Zone Perimeter (${_geofenceRadius.toInt()}m)...',
      'Connecting Smart Collar IoT Gateway (Petlify OS v3.4)...',
      'Generating AI Health Baseline Model...',
    ];

    int count = 0;
    Timer.periodic(const Duration(milliseconds: 500), (timer) {
      count++;
      if (count < messages.length) {
        setState(() {
          _provisionProgress = (count + 1) * 0.2;
          _provisionMessage = messages[count];
        });
      } else {
        timer.cancel();
        setState(() {
          _provisionProgress = 1.0;
          _provisionMessage = 'Provisioning Complete!';
        });

        Future.delayed(const Duration(milliseconds: 600), () {
          final user = UserProfile(
            name: _ownerName.text.isEmpty ? 'Alex Morgan' : _ownerName.text,
            email: _ownerEmail.text.isEmpty ? 'alex@petlify.io' : _ownerEmail.text,
            phone: _ownerPhone.text,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            accountType: 'Pet Parent Premium',
          );

          final pet = Pet(
            id: 'pet-${DateTime.now().millisecondsSinceEpoch}',
            name: _petName.text.isEmpty ? 'Buddy' : _petName.text,
            type: _petType,
            breed: _petBreed,
            age: '${_petAgeYears.text} Yrs',
            weight: double.tryParse(_currentWeight.text) ?? 28.5,
            targetWeight: double.tryParse(_targetWeight.text) ?? 27.5,
            gender: _petGender,
            neutered: _isNeutered,
            microchip: _microchip.text,
            avatar: _petType == 'dog'
                ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400'
                : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
            collarId: 'PET-SMART-${100 + Random().nextInt(800)}',
            collarConnected: true,
            battery: 96,
            signalStrength: 'Excellent (4G LTE + GPS Lock)',
            beaconColor: _beaconColor,
            vitals: PetVitals(
              heartRate: _petType == 'cat' ? 118 : 82,
              bodyTemp: 101.4,
              stepsToday: 4200,
              stepsGoal: _petType == 'cat' ? 5000 : 10000,
              caloriesBurned: 350,
              sleepHours: '8.5 hrs',
              restlessness: 'Low',
              barkCount: 1,
              scratchCount: 3,
            ),
            location: PetLocation(
              status: 'safe',
              zoneName: 'Home Safe Zone (Radius ${_geofenceRadius.toInt()}m)',
              address: _homeAddress.text,
              lat: 37.7749,
              lng: -122.4194,
              lastSeen: 'Just now',
            ),
            diet: '$_dietType ($_feedingSchedule)',
            allergies: _selectedAllergies,
            medicalNotes: 'Routine vaccinations up to date.',
            vetClinic: _vetClinic.text,
            vetPhone: '(555) 349-2810',
            weightHistory: [
              WeightRecord(date: '2025-11-01', weight: (double.tryParse(_currentWeight.text) ?? 28.5) - 0.8),
              WeightRecord(date: '2025-12-01', weight: (double.tryParse(_currentWeight.text) ?? 28.5) - 0.4),
              WeightRecord(date: '2026-01-01', weight: double.tryParse(_currentWeight.text) ?? 28.5),
            ],
          );

          widget.onLoginSuccess(user, pet);
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(-0.8, -0.6),
            radius: 1.2,
            colors: [
              Color(0x2810B981),
              Color(0x1806B6D4),
              PetlifyTheme.bgMain,
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: isLogin ? _buildLoginView() : _buildWizardView(),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Brand Header
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                gradient: const LinearGradient(
                  colors: [PetlifyTheme.accentEmerald, PetlifyTheme.accentCyan],
                ),
                boxShadow: const [
                  BoxShadow(color: PetlifyTheme.accentEmeraldGlow, blurRadius: 16),
                ],
              ),
              child: const Icon(Icons.radar_rounded, color: Colors.white, size: 26),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Petlify',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: PetlifyTheme.textPrimary,
                    letterSpacing: -1,
                  ),
                ),
                Text(
                  'Smart Collar & Healthcare Platform',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: PetlifyTheme.accentEmerald,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 24),

        // Quick Demo Card
        GlassCard(
          backgroundColor: PetlifyTheme.accentEmerald.withAlpha(25),
          borderColor: PetlifyTheme.accentEmerald.withAlpha(80),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.bolt_rounded, color: PetlifyTheme.accentEmerald, size: 22),
                  SizedBox(width: 8),
                  Text(
                    'Instant Demo Access',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: _handleQuickDemo,
                style: ElevatedButton.styleFrom(
                  backgroundColor: PetlifyTheme.accentEmerald,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('1-Click Demo', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Main Login Card
        GlassCard(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Tab Switcher
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.black.withAlpha(100),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: PetlifyTheme.accentEmerald,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'Sign In',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.black, fontWeight: FontWeight.w800, fontSize: 13),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => isLogin = false),
                        child: const Text(
                          'Start Pet Intake ✨',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: PetlifyTheme.textSecondary, fontWeight: FontWeight.w700, fontSize: 13),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Email
              const Text('Email Address', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: PetlifyTheme.textSecondary)),
              const SizedBox(height: 6),
              TextField(
                controller: _loginEmailController,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.email_outlined, size: 18, color: PetlifyTheme.textMuted),
                  filled: true,
                  fillColor: PetlifyTheme.bgSurface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: PetlifyTheme.borderSubtle)),
                ),
              ),
              const SizedBox(height: 14),

              // Password
              const Text('Password', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: PetlifyTheme.textSecondary)),
              const SizedBox(height: 6),
              TextField(
                controller: _loginPasswordController,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.lock_outline, size: 18, color: PetlifyTheme.textMuted),
                  suffixIcon: IconButton(
                    icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, size: 18, color: PetlifyTheme.textMuted),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  filled: true,
                  fillColor: PetlifyTheme.bgSurface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: PetlifyTheme.borderSubtle)),
                ),
              ),
              const SizedBox(height: 20),

              // Submit Button
              ElevatedButton(
                onPressed: _handleQuickDemo,
                style: ElevatedButton.styleFrom(
                  backgroundColor: PetlifyTheme.accentEmerald,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Sign In to Petlify', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward, size: 18),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              Center(
                child: TextButton(
                  onPressed: () => setState(() => isLogin = false),
                  child: const Text(
                    'New pet parent? Start Questionnaire →',
                    style: TextStyle(color: PetlifyTheme.accentEmerald, fontWeight: FontWeight.w700, fontSize: 13),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildWizardView() {
    if (_isProvisioning) {
      return GlassCard(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
        child: Column(
          children: [
            const SizedBox(
              width: 60,
              height: 60,
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(PetlifyTheme.accentEmerald),
                strokeWidth: 4,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Setting Up ${_petName.text}\'s Ecosystem...',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            Text(
              _provisionMessage,
              style: const TextStyle(fontSize: 13, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 20),
            ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: LinearProgressIndicator(
                value: _provisionProgress,
                backgroundColor: Colors.white10,
                valueColor: const AlwaysStoppedAnimation<Color>(PetlifyTheme.accentEmerald),
                minHeight: 8,
              ),
            ),
          ],
        ),
      );
    }

    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Wizard Top Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Pet & Parent Intake', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                  Text('Step $wizardStep of $totalSteps', style: const TextStyle(fontSize: 12, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w700)),
                ],
              ),
              TextButton(
                onPressed: () => setState(() => isLogin = true),
                child: const Text('Back to Login', style: TextStyle(color: PetlifyTheme.textMuted, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Stepper Progress
          Row(
            children: List.generate(totalSteps, (index) {
              final active = index + 1 <= wizardStep;
              return Expanded(
                child: Container(
                  height: 4,
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    color: active ? PetlifyTheme.accentEmerald : Colors.white12,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 20),

          // Steps Content
          if (wizardStep == 1) _buildStep1Owner(),
          if (wizardStep == 2) _buildStep2Pet(),
          if (wizardStep == 3) _buildStep3Health(),
          if (wizardStep == 4) _buildStep4Routine(),
          if (wizardStep == 5) _buildStep5Collar(),

          const SizedBox(height: 24),

          // Navigation Buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (wizardStep > 1)
                OutlinedButton(
                  onPressed: () => setState(() => wizardStep--),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: PetlifyTheme.textSecondary,
                    side: const BorderSide(color: PetlifyTheme.borderSubtle),
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Back'),
                )
              else
                const SizedBox.shrink(),
              ElevatedButton(
                onPressed: () {
                  if (wizardStep < totalSteps) {
                    setState(() => wizardStep++);
                  } else {
                    _handleFinalizeSignup();
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: PetlifyTheme.accentEmerald,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: Text(
                  wizardStep == totalSteps ? 'Complete & Launch App 🚀' : 'Next Step →',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep1Owner() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('1. Pet Parent & Emergency Contacts', style: TextStyle(fontWeight: FontWeight.w700, color: PetlifyTheme.accentEmerald)),
        const SizedBox(height: 12),
        _buildTextField('Your Full Name *', _ownerName, 'Alex Morgan'),
        const SizedBox(height: 10),
        _buildTextField('Email Address *', _ownerEmail, 'alex.morgan@petlify.io'),
        const SizedBox(height: 10),
        _buildTextField('Mobile Phone (for SOS alerts) *', _ownerPhone, '(555) 234-5678'),
        const SizedBox(height: 10),
        _buildTextField('Home Address (Geofence Center) *', _homeAddress, '742 Evergreen Terrace'),
      ],
    );
  }

  Widget _buildStep2Pet() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('2. Pet Profile & Breed Details', style: TextStyle(fontWeight: FontWeight.w700, color: PetlifyTheme.accentEmerald)),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _petType = 'dog'),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _petType == 'dog' ? PetlifyTheme.accentEmerald.withAlpha(40) : PetlifyTheme.bgSurface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: _petType == 'dog' ? PetlifyTheme.accentEmerald : PetlifyTheme.borderSubtle),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.pets, size: 18, color: PetlifyTheme.accentEmerald),
                      SizedBox(width: 8),
                      Text('Dog / Canine', style: TextStyle(fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _petType = 'cat'),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _petType == 'cat' ? PetlifyTheme.accentCyan.withAlpha(40) : PetlifyTheme.bgSurface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: _petType == 'cat' ? PetlifyTheme.accentCyan : PetlifyTheme.borderSubtle),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.catching_pokemon, size: 18, color: PetlifyTheme.accentCyan),
                      SizedBox(width: 8),
                      Text('Cat / Feline', style: TextStyle(fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _buildTextField('Pet Name *', _petName, 'Max'),
        const SizedBox(height: 10),
        const Text('Popular Breeds (Tap to choose):', style: TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
        const SizedBox(height: 6),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: (_petType == 'dog' ? _dogBreeds : _catBreeds).map((b) {
            final isSel = _petBreed == b;
            return ChoiceChip(
              label: Text(b, style: TextStyle(fontSize: 11, color: isSel ? Colors.black : Colors.white)),
              selected: isSel,
              selectedColor: PetlifyTheme.accentEmerald,
              backgroundColor: PetlifyTheme.bgSurface,
              onSelected: (val) => setState(() => _petBreed = b),
            );
          }).toList(),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _buildTextField('Age (Years)', _petAgeYears, '3')),
            const SizedBox(width: 10),
            Expanded(child: _buildTextField('Microchip #', _microchip, '985-141-XXXX')),
          ],
        ),
      ],
    );
  }

  Widget _buildStep3Health() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('3. Vitals Baseline & Health History', style: TextStyle(fontWeight: FontWeight.w700, color: PetlifyTheme.accentEmerald)),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildTextField('Current Weight (kg) *', _currentWeight, '28.5')),
            const SizedBox(width: 10),
            Expanded(child: _buildTextField('Target Weight (kg)', _targetWeight, '27.5')),
          ],
        ),
        const SizedBox(height: 10),
        const Text('Known Allergies:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: PetlifyTheme.textSecondary)),
        const SizedBox(height: 6),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: ['Chicken', 'Beef', 'Dairy', 'Grain / Wheat', 'Dust Mites', 'None'].map((a) {
            final isSel = _selectedAllergies.contains(a);
            return FilterChip(
              label: Text(a, style: TextStyle(fontSize: 11, color: isSel ? Colors.black : Colors.white)),
              selected: isSel,
              selectedColor: PetlifyTheme.accentEmerald,
              backgroundColor: PetlifyTheme.bgSurface,
              onSelected: (val) {
                setState(() {
                  if (a == 'None') {
                    _selectedAllergies.clear();
                    _selectedAllergies.add('None');
                  } else {
                    _selectedAllergies.remove('None');
                    if (isSel) {
                      _selectedAllergies.remove(a);
                    } else {
                      _selectedAllergies.add(a);
                    }
                  }
                });
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 10),
        _buildTextField('Primary Veterinary Hospital', _vetClinic, 'Paws & Claws Veterinary Hospital'),
      ],
    );
  }

  Widget _buildStep4Routine() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('4. Daily Nutrition & Feeding Schedule', style: TextStyle(fontWeight: FontWeight.w700, color: PetlifyTheme.accentEmerald)),
        const SizedBox(height: 12),
        const Text('Food & Diet Type:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: PetlifyTheme.textSecondary)),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
          initialValue: _dietType,
          decoration: InputDecoration(
            filled: true,
            fillColor: PetlifyTheme.bgSurface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          ),
          items: [
            'Dry Kibble (High Protein)',
            'Wet / Canned Organic Food',
            'Raw Diet (BARF)',
            'Prescription Gastrointestinal Formula',
          ].map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 13)))).toList(),
          onChanged: (val) => setState(() => _dietType = val!),
        ),
        const SizedBox(height: 12),
        _buildTextField('Estimated Daily Calories (kcal)', _dailyCalories, '480'),
      ],
    );
  }

  Widget _buildStep5Collar() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('5. Smart Collar IoT & Geofence Boundary', style: TextStyle(fontWeight: FontWeight.w700, color: PetlifyTheme.accentEmerald)),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Safe Zone Geofence Radius', style: TextStyle(fontWeight: FontWeight.w600)),
            Text('${_geofenceRadius.toInt()} meters', style: const TextStyle(color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w800)),
          ],
        ),
        Slider(
          value: _geofenceRadius,
          min: 50,
          max: 500,
          divisions: 18,
          activeColor: PetlifyTheme.accentCyan,
          onChanged: (val) => setState(() => _geofenceRadius = val),
        ),
        const SizedBox(height: 10),
        SwitchListTile(
          value: _emergencyAlerts,
          activeColor: PetlifyTheme.accentRose,
          contentPadding: EdgeInsets.zero,
          title: const Text('Lost Pet Emergency SOS Alerts', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
          subtitle: const Text('Send SMS and push alerts if collar exits geofence', style: TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
          onChanged: (val) => setState(() => _emergencyAlerts = val),
        ),
      ],
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, String hint) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: PetlifyTheme.textSecondary)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: PetlifyTheme.textMuted, fontSize: 13),
            filled: true,
            fillColor: PetlifyTheme.bgSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: PetlifyTheme.borderSubtle)),
          ),
        ),
      ],
    );
  }
}
