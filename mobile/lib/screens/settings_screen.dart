import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../state/pet_state.dart';
import '../widgets/glass_card.dart';

class SettingsScreen extends StatefulWidget {
  final PetState state;

  const SettingsScreen({super.key, required this.state});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  double _heartRateLimit = 120;
  double _tempLimit = 103.0;
  double _geofenceLimit = 150;
  bool _heartAlert = true;
  bool _geofenceAlert = true;
  bool _batteryAlert = true;
  bool _soundFx = true;
  String _units = 'Metric (kg, °C)';

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Collar Vitals Alert Thresholds', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: PetlifyTheme.accentEmerald)),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Heart Rate High Limit', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    Text('${_heartRateLimit.toInt()} BPM', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: PetlifyTheme.accentRose)),
                  ],
                ),
                Slider(
                  value: _heartRateLimit,
                  min: 90,
                  max: 180,
                  activeColor: PetlifyTheme.accentRose,
                  onChanged: (v) => setState(() => _heartRateLimit = v),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Body Temp High Limit', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    Text('${_tempLimit.toStringAsFixed(1)}°F', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: PetlifyTheme.accentOrange)),
                  ],
                ),
                Slider(
                  value: _tempLimit,
                  min: 101,
                  max: 106,
                  activeColor: PetlifyTheme.accentOrange,
                  onChanged: (v) => setState(() => _tempLimit = v),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Geofence Safe Zone Limit', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    Text('${_geofenceLimit.toInt()} m', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: PetlifyTheme.accentCyan)),
                  ],
                ),
                Slider(
                  value: _geofenceLimit,
                  min: 50,
                  max: 500,
                  divisions: 18,
                  activeColor: PetlifyTheme.accentCyan,
                  onChanged: (v) => setState(() => _geofenceLimit = v),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Measurement Units', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    DropdownButton<String>(
                      value: _units,
                      dropdownColor: PetlifyTheme.bgSurface,
                      underline: const SizedBox.shrink(),
                      items: ['Metric (kg, °C)', 'Imperial (lbs, °F)'].map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 12)))).toList(),
                      onChanged: (val) => setState(() => _units = val!),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Smart Notifications', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: PetlifyTheme.accentCyan)),
                const SizedBox(height: 8),
                SwitchListTile(
                  title: const Text('Heart Rate Spikes & Arrhythmia', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  value: _heartAlert,
                  activeColor: PetlifyTheme.accentEmerald,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (v) => setState(() => _heartAlert = v),
                ),
                SwitchListTile(
                  title: const Text('Geofence Safe Zone Breach', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  value: _geofenceAlert,
                  activeColor: PetlifyTheme.accentEmerald,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (v) => setState(() => _geofenceAlert = v),
                ),
                SwitchListTile(
                  title: const Text('Collar Low Battery Alert (<20%)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  value: _batteryAlert,
                  activeColor: PetlifyTheme.accentEmerald,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (v) => setState(() => _batteryAlert = v),
                ),
                SwitchListTile(
                  title: const Text('In-App Sound Effects & Chimes', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                  value: _soundFx,
                  activeColor: PetlifyTheme.accentEmerald,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (v) => setState(() => _soundFx = v),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Cloud REST Backend Status', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: PetlifyTheme.accentPurple)),
                const SizedBox(height: 8),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Node.js REST API Server', style: TextStyle(fontSize: 12, color: PetlifyTheme.textSecondary)),
                    Text('http://localhost:3001 ● ONLINE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: PetlifyTheme.accentEmerald)),
                  ],
                ),
                const SizedBox(height: 4),
                const Text('Endpoints: /pets /telemetry /reports /reminders /voice', style: TextStyle(fontSize: 10, color: PetlifyTheme.textMuted, fontFamily: 'monospace')),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
