import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../state/pet_state.dart';
import 'dashboard_screen.dart';
import 'telemetry_screen.dart';
import 'ai_assistant_screen.dart';
import 'medical_vault_screen.dart';
import 'vet_directory_screen.dart';
import 'pet_social_screen.dart';
import 'settings_screen.dart';

class MainNavigationShell extends StatefulWidget {
  final PetState state;
  final VoidCallback onLogout;
  final VoidCallback onOpenIntakeWizard;

  const MainNavigationShell({
    super.key,
    required this.state,
    required this.onLogout,
    required this.onOpenIntakeWizard,
  });

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final pet = widget.state.activePet;

    final screens = [
      DashboardScreen(state: widget.state, onNavigateTab: (idx) => setState(() => _currentIndex = idx)),
      TelemetryScreen(state: widget.state),
      AiAssistantScreen(state: widget.state),
      MedicalVaultScreen(state: widget.state),
      VetDirectoryScreen(state: widget.state),
      PetSocialScreen(state: widget.state),
      SettingsScreen(state: widget.state),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: PetlifyTheme.bgSurface,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                gradient: const LinearGradient(colors: [PetlifyTheme.accentEmerald, PetlifyTheme.accentCyan]),
              ),
              child: const Icon(Icons.radar_rounded, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 8),
            const Text('Petlify', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
            const SizedBox(width: 6),
            const Icon(Icons.auto_awesome, color: PetlifyTheme.accentEmerald, size: 16),
          ],
        ),
        actions: [
          // Active Pet Switcher Chip Dropdown
          GestureDetector(
            onTap: _showPetSwitcherModal,
            child: Container(
              margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: PetlifyTheme.bgCard,
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: PetlifyTheme.accentEmerald.withAlpha(80)),
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(999),
                    child: Image.network(pet.avatar, width: 20, height: 20, fit: BoxFit.cover),
                  ),
                  const SizedBox(width: 6),
                  Text(pet.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
                  const Icon(Icons.keyboard_arrow_down, size: 16, color: PetlifyTheme.textSecondary),
                ],
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, size: 18, color: PetlifyTheme.textMuted),
            onPressed: widget.onLogout,
            tooltip: 'Sign Out',
          ),
        ],
      ),
      body: screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: PetlifyTheme.borderSubtle)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex.clamp(0, 4),
          onTap: (index) => setState(() => _currentIndex = index),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.near_me_rounded),
              label: 'GPS Map',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.auto_awesome),
              label: 'AI & Voice',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.health_and_safety_rounded),
              label: 'Vault',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.local_hospital_rounded),
              label: 'Vets',
            ),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: Container(
        margin: const EdgeInsets.only(bottom: 50),
        child: FloatingActionButton.extended(
          backgroundColor: PetlifyTheme.accentRose,
          foregroundColor: Colors.white,
          elevation: 8,
          icon: const Icon(Icons.warning_amber_rounded, size: 18),
          label: const Text('Lost Pet SOS', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
          onPressed: () {
            showDialog(
              context: context,
              builder: (ctx) => AlertDialog(
                backgroundColor: PetlifyTheme.bgCard,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                title: Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: PetlifyTheme.accentRose, size: 24),
                    const SizedBox(width: 8),
                    Text('Lost Pet SOS Broadcast', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                  ],
                ),
                content: Text(
                  'Emergency broadcast alert will be sent with ${pet.name}\'s live GPS coordinates (37.7749°N, 122.4194°W), microchip ID (${pet.microchip}), and collar strobe beacon will activate at full intensity.',
                  style: const TextStyle(fontSize: 12, color: PetlifyTheme.textSecondary),
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Cancel', style: TextStyle(color: PetlifyTheme.textMuted)),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      widget.state.toggleBuzzer();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('🚨 Emergency SOS Transmitted for ${pet.name}! Collar LED Strobe Active.'),
                          backgroundColor: PetlifyTheme.accentRose,
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: PetlifyTheme.accentRose),
                    child: const Text('TRANSMIT SOS NOW', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900)),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  void _showPetSwitcherModal() {
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
              const Text('Switch Active Pet', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              ...widget.state.pets.map((p) {
                final isSelected = p.id == widget.state.activePetId;
                return ListTile(
                  leading: ClipRRect(
                    borderRadius: BorderRadius.circular(999),
                    child: Image.network(p.avatar, width: 36, height: 36, fit: BoxFit.cover),
                  ),
                  title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.w800)),
                  subtitle: Text('${p.breed} • ${p.weight} kg', style: const TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                  trailing: isSelected ? const Icon(Icons.check_circle, color: PetlifyTheme.accentEmerald) : null,
                  onTap: () {
                    widget.state.setActivePet(p.id);
                    Navigator.pop(ctx);
                  },
                );
              }),
              const Divider(color: PetlifyTheme.borderSubtle),
              const SizedBox(height: 8),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(ctx);
                  widget.onOpenIntakeWizard();
                },
                icon: const Icon(Icons.add, size: 18, color: Colors.black),
                label: const Text('Add Pet via Intake Wizard ✨', style: TextStyle(fontWeight: FontWeight.w800, color: Colors.black)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: PetlifyTheme.accentEmerald,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
