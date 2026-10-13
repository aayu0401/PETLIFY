import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../models/pet_model.dart';
import '../models/vet_model.dart';
import '../state/pet_state.dart';
import '../widgets/glass_card.dart';
import '../widgets/weight_chart_widget.dart';

class MedicalVaultScreen extends StatefulWidget {
  final PetState state;

  const MedicalVaultScreen({super.key, required this.state});

  @override
  State<MedicalVaultScreen> createState() => _MedicalVaultScreenState();
}

class _MedicalVaultScreenState extends State<MedicalVaultScreen> {
  int _activeSubTab = 0; // 0: Vaccines, 1: Weight Tracker, 2: Digital ID, 3: Vet Reports
  final _newWeightController = TextEditingController();

  final List<VaccinationRecord> _vaccines = [
    VaccinationRecord(
      name: 'Rabies 3-Year Vaccine',
      dateGiven: '2025-01-15',
      nextDue: '2028-01-15',
      clinic: 'Paws & Claws Vet Hospital',
      batchNo: 'RAB-99201-B',
      isUpToDate: true,
    ),
    VaccinationRecord(
      name: 'DHPP (Distemper, Parvo)',
      dateGiven: '2025-06-20',
      nextDue: '2026-06-20',
      clinic: 'Paws & Claws Vet Hospital',
      batchNo: 'DHP-44102-X',
      isUpToDate: true,
    ),
    VaccinationRecord(
      name: 'Bordetella (Kennel Cough)',
      dateGiven: '2025-09-10',
      nextDue: '2026-09-10',
      clinic: 'Bay Area Mobile Vet',
      batchNo: 'BOR-11029-A',
      isUpToDate: true,
    ),
  ];

  final List<Map<String, String>> _reports = [
    {
      'title': 'Comprehensive Annual Wellness Checkup',
      'doctor': 'Dr. Sarah Jenkins, DVM',
      'date': '2026-01-20',
      'summary': 'Heart & lungs clear. Dental tartar grade 1 (mild). Optical collar vitals correlation verified.',
    },
    {
      'title': 'Full Chemistry & CBC Blood Panel',
      'doctor': 'Dr. Mike Torres, BVSc',
      'date': '2025-11-14',
      'summary': 'All liver, kidney, glucose, and electrolyte values well within normal physiological ranges.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final pet = widget.state.activePet;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header Status
          GlassCard(
            padding: const EdgeInsets.all(16),
            borderColor: PetlifyTheme.accentEmerald.withAlpha(60),
            child: Row(
              children: [
                const Icon(Icons.verified_user_rounded, size: 28, color: PetlifyTheme.accentEmerald),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Verified Medical Vault', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                      const SizedBox(height: 2),
                      Text('Microchip: ${pet.microchip} • Encrypted EHR Cloud Sync', style: const TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Sub Tabs Switcher
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: PetlifyTheme.bgSurface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: PetlifyTheme.borderSubtle),
            ),
            child: Row(
              children: [
                _buildSubTab(0, '💉 Vaccines'),
                _buildSubTab(1, '⚖️ Weight'),
                _buildSubTab(2, '🪪 Digital ID'),
                _buildSubTab(3, '📄 Reports'),
              ],
            ),
          ),
          const SizedBox(height: 14),

          if (_activeSubTab == 0) _buildVaccinesView(),
          if (_activeSubTab == 1) _buildWeightView(pet),
          if (_activeSubTab == 2) _buildDigitalIdView(pet),
          if (_activeSubTab == 3) _buildReportsView(),

          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSubTab(int index, String title) {
    final active = _activeSubTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _activeSubTab = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: active ? PetlifyTheme.accentEmerald.withAlpha(35) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: active ? PetlifyTheme.accentEmerald.withAlpha(80) : Colors.transparent),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.w800,
              color: active ? PetlifyTheme.accentEmerald : PetlifyTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildVaccinesView() {
    return Column(
      children: _vaccines.map((v) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: PetlifyTheme.accentEmerald.withAlpha(30),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.vaccines, color: PetlifyTheme.accentEmerald, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(v.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                      const SizedBox(height: 2),
                      Text('Given: ${v.dateGiven} • Due: ${v.nextDue}', style: const TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                      Text('Batch: ${v.batchNo} • ${v.clinic}', style: const TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                    ],
                  ),
                ),
                const Icon(Icons.check_circle, color: PetlifyTheme.accentEmerald, size: 18),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildWeightView(Pet pet) {
    return Column(
      children: [
        GlassCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('6-Month Weight Trend & Target', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              WeightChartWidget(history: pet.weightHistory, targetWeight: pet.targetWeight),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Log Weight Form
        GlassCard(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _newWeightController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    hintText: 'Enter weight (e.g. 28.6)',
                    hintStyle: const TextStyle(fontSize: 12, color: PetlifyTheme.textMuted),
                    filled: true,
                    fillColor: PetlifyTheme.bgSurface,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: PetlifyTheme.borderSubtle)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                onPressed: () {
                  final w = double.tryParse(_newWeightController.text);
                  if (w != null && w > 0) {
                    widget.state.logWeight(w);
                    _newWeightController.clear();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('⚖️ Logged weight $w kg successfully!'), backgroundColor: PetlifyTheme.accentEmerald),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: PetlifyTheme.accentEmerald,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text('Log Entry', style: TextStyle(fontWeight: FontWeight.w800)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDigitalIdView(Pet pet) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      borderColor: PetlifyTheme.accentCyan.withAlpha(80),
      child: Column(
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(pet.avatar, width: 50, height: 50, fit: BoxFit.cover),
              ),
              const SizedBox(width: 14),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(pet.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                  Text('${pet.breed} • ${pet.gender}', style: const TextStyle(fontSize: 12, color: PetlifyTheme.textSecondary)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: PetlifyTheme.borderSubtle),
          const SizedBox(height: 12),

          // Microchip & QR
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.qr_code_2_rounded, size: 100, color: Colors.black),
          ),
          const SizedBox(height: 14),
          Text('Microchip: ${pet.microchip}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, fontFamily: 'monospace')),
          const SizedBox(height: 4),
          const Text('Scan with any smartphone camera for instant emergency pet rescue profile.', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
        ],
      ),
    );
  }

  Widget _buildReportsView() {
    return Column(
      children: _reports.map((r) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(r['title']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                    Text(r['date']!, style: const TextStyle(fontSize: 11, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(r['doctor']!, style: const TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
                const SizedBox(height: 8),
                Text(r['summary']!, style: const TextStyle(fontSize: 12, color: PetlifyTheme.textSecondary)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
