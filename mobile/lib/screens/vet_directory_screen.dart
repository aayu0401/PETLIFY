import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../models/vet_model.dart';
import '../state/pet_state.dart';
import '../widgets/glass_card.dart';

class VetDirectoryScreen extends StatefulWidget {
  final PetState state;

  const VetDirectoryScreen({super.key, required this.state});

  @override
  State<VetDirectoryScreen> createState() => _VetDirectoryScreenState();
}

class _VetDirectoryScreenState extends State<VetDirectoryScreen> {
  int _activeTab = 0; // 0: Find Vets, 1: Appointments, 2: Tele-Vet Room

  final _dateController = TextEditingController(text: '2026-08-28');
  final _timeController = TextEditingController(text: '10:30 AM');
  final _serviceController = TextEditingController(text: 'Annual Wellness Checkup');

  void _bookAppointment(VetClinic clinic) {
    final pet = widget.state.activePet;
    final apt = VetAppointment(
      id: 'APT-${DateTime.now().millisecondsSinceEpoch % 10000}',
      clinicName: clinic.name,
      doctor: clinic.doctor,
      petName: pet.name,
      service: _serviceController.text,
      date: _dateController.text,
      time: _timeController.text,
      phone: clinic.phone,
    );

    widget.state.bookAppointment(apt);
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('📅 Appointment booked at ${clinic.name}!'),
        backgroundColor: PetlifyTheme.accentEmerald,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Tab Switcher
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: PetlifyTheme.bgSurface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: PetlifyTheme.borderSubtle),
          ),
          child: Row(
            children: [
              _buildTabBtn(0, '🏥 Find Vets'),
              _buildTabBtn(1, '📅 Appointments (${widget.state.appointments.length})'),
              _buildTabBtn(2, '📹 Tele-Vet'),
            ],
          ),
        ),

        Expanded(
          child: _activeTab == 0
              ? _buildClinicsList()
              : _activeTab == 1
                  ? _buildAppointmentsList()
                  : _buildTeleVetRoom(),
        ),
      ],
    );
  }

  Widget _buildTabBtn(int index, String title) {
    final active = _activeTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _activeTab = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: active ? PetlifyTheme.accentCyan.withAlpha(35) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: active ? PetlifyTheme.accentCyan.withAlpha(80) : Colors.transparent),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: active ? PetlifyTheme.accentCyan : PetlifyTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildClinicsList() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: widget.state.clinics.length,
      itemBuilder: (context, index) {
        final clinic = widget.state.clinics[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(clinic.image, width: 64, height: 64, fit: BoxFit.cover),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(clinic.name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                          const SizedBox(height: 2),
                          Text(clinic.doctor, style: const TextStyle(fontSize: 11, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.star, color: PetlifyTheme.accentYellow, size: 14),
                              const SizedBox(width: 4),
                              Text('${clinic.rating} (${clinic.reviews}) • ${clinic.distanceKm} km away', style: const TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 4,
                  children: clinic.services.map((s) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: PetlifyTheme.bgSurface,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: PetlifyTheme.borderSubtle),
                      ),
                      child: Text(s, style: const TextStyle(fontSize: 9, color: PetlifyTheme.textSecondary)),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    ElevatedButton.icon(
                      onPressed: () => _showBookingModal(clinic),
                      icon: const Icon(Icons.calendar_month, size: 14, color: Colors.black),
                      label: const Text('Book Visit', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: PetlifyTheme.accentEmerald,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showBookingModal(VetClinic clinic) {
    showModalBottomSheet(
      context: context,
      backgroundColor: PetlifyTheme.bgCard,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Book Consultation with ${clinic.name}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              TextField(
                controller: _dateController,
                decoration: InputDecoration(
                  labelText: 'Appointment Date',
                  filled: true,
                  fillColor: PetlifyTheme.bgSurface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _timeController,
                decoration: InputDecoration(
                  labelText: 'Time Slot',
                  filled: true,
                  fillColor: PetlifyTheme.bgSurface,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => _bookAppointment(clinic),
                style: ElevatedButton.styleFrom(
                  backgroundColor: PetlifyTheme.accentEmerald,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text('Confirm Appointment', style: TextStyle(fontWeight: FontWeight.w800)),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAppointmentsList() {
    if (widget.state.appointments.isEmpty) {
      return const Center(
        child: Text('No upcoming appointments. Book one from the Directory!', style: TextStyle(color: PetlifyTheme.textMuted)),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: widget.state.appointments.length,
      itemBuilder: (context, index) {
        final apt = widget.state.appointments[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    color: PetlifyTheme.accentCyan.withAlpha(30),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: PetlifyTheme.accentCyan.withAlpha(80)),
                  ),
                  child: Column(
                    children: [
                      Text(apt.date.split('-').last, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white)),
                      const Text('AUG', style: TextStyle(fontSize: 9, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w800)),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(apt.service, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                      Text('${apt.clinicName} • ${apt.doctor}', style: const TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                      Text('🕐 ${apt.time} • ${apt.phone}', style: const TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.cancel_outlined, color: PetlifyTheme.accentRose, size: 20),
                  onPressed: () {
                    widget.state.cancelAppointment(apt.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Appointment cancelled.')),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTeleVetRoom() {
    final pet = widget.state.activePet;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Live Video Feed Placeholder
          GlassCard(
            padding: EdgeInsets.zero,
            child: Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Stack(
                children: [
                  const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.videocam, size: 40, color: PetlifyTheme.accentEmerald),
                        SizedBox(height: 8),
                        Text('Live Tele-Vet Consult Room Active', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                        Text('Dr. Sarah Jenkins streaming live video', style: TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                      ],
                    ),
                  ),
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withAlpha(200),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text('❤️ Live Stream: ${pet.vitals.heartRate} BPM • ${pet.vitals.bodyTemp}°F', style: const TextStyle(fontSize: 10, color: PetlifyTheme.accentEmerald, fontWeight: FontWeight.w800)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Digital Prescription Summary
          GlassCard(
            padding: const EdgeInsets.all(14),
            borderColor: PetlifyTheme.accentEmerald.withAlpha(80),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Prescription & Vet Notes Summary', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: PetlifyTheme.accentEmerald)),
                SizedBox(height: 6),
                Text(
                  'Collar optical telemetry and heart rhythm are consistent with healthy baseline. Recommend oral probiotic with dinner and normal active park exercise.',
                  style: TextStyle(fontSize: 12, color: PetlifyTheme.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
