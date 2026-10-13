import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../models/pet_model.dart';
import '../state/pet_state.dart';
import '../widgets/glass_card.dart';

class TelemetryScreen extends StatefulWidget {
  final PetState state;

  const TelemetryScreen({super.key, required this.state});

  @override
  State<TelemetryScreen> createState() => _TelemetryScreenState();
}

class _TelemetryScreenState extends State<TelemetryScreen> {
  int _activeSubTab = 0; // 0: GPS Map, 1: Geofence, 2: Diagnostics
  double _replayProgress = 1.0;
  bool _isReplaying = false;

  final List<Map<String, dynamic>> _routeCheckpoints = [
    {'name': 'Home Safe Base (Start)', 'time': '07:30 AM', 'bpm': 78, 'x': 0.2, 'y': 0.75},
    {'name': 'Oakwood Blvd Crossing', 'time': '07:45 AM', 'bpm': 82, 'x': 0.35, 'y': 0.6},
    {'name': 'Riverside Dog Park (Ball Fetch)', 'time': '08:05 AM', 'bpm': 114, 'x': 0.7, 'y': 0.35},
    {'name': 'Pine Ridge Trail Loop', 'time': '08:25 AM', 'bpm': 106, 'x': 0.85, 'y': 0.55},
    {'name': 'Home Base (End)', 'time': '08:45 AM', 'bpm': 80, 'x': 0.25, 'y': 0.78},
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
            borderColor: PetlifyTheme.accentCyan.withAlpha(60),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.satellite_alt_rounded, size: 18, color: PetlifyTheme.accentCyan),
                        const SizedBox(width: 6),
                        const Text('GPS Satellite HUD', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: PetlifyTheme.accentCyan.withAlpha(30),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: const Text('14 Sats Lock', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: PetlifyTheme.accentCyan)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Lat 37.7749° N • Lng 122.4194° W • Heading 312° NW',
                      style: const TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () {
                    widget.state.triggerGeofenceBreach();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(pet.location.status == 'safe' ? 'Safe Zone Restored.' : '🚨 Geofence Boundary Breach Simulated!'),
                        backgroundColor: pet.location.status == 'safe' ? PetlifyTheme.accentEmerald : PetlifyTheme.accentRose,
                      ),
                    );
                  },
                  icon: Icon(
                    pet.location.status == 'safe' ? Icons.shield_outlined : Icons.warning_amber_rounded,
                    color: pet.location.status == 'safe' ? PetlifyTheme.accentEmerald : PetlifyTheme.accentRose,
                  ),
                  tooltip: 'Simulate Geofence Alert',
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
                _buildSubTab(0, '🗺️ GPS Route Map'),
                _buildSubTab(1, '🛡️ Safe Zones'),
                _buildSubTab(2, '🔧 Diagnostics'),
              ],
            ),
          ),
          const SizedBox(height: 14),

          if (_activeSubTab == 0) _buildGpsMapView(pet),
          if (_activeSubTab == 1) _buildGeofenceView(pet),
          if (_activeSubTab == 2) _buildDiagnosticsView(pet),

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

  Widget _buildGpsMapView(Pet pet) {
    return Column(
      children: [
        // Interactive Canvas Map
        GlassCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              Container(
                height: 260,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF070D18),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                ),
                child: CustomPaint(
                  painter: _RouteMapPainter(
                    checkpoints: _routeCheckpoints,
                    progress: _replayProgress,
                    status: pet.location.status,
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        top: 12,
                        left: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withAlpha(180),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: PetlifyTheme.borderSubtle),
                          ),
                          child: const Text('OAKWOOD TRAIL & PARK', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white70, letterSpacing: 1)),
                        ),
                      ),
                      Positioned(
                        bottom: 12,
                        left: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withAlpha(180),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: PetlifyTheme.borderSubtle),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.explore, size: 12, color: PetlifyTheme.accentCyan),
                              const SizedBox(width: 4),
                              Text('Speed: 3.2 km/h • ${pet.location.zoneName}', style: const TextStyle(fontSize: 10, color: Colors.white)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Replay Controller
              Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(_isReplaying ? Icons.pause_circle_filled : Icons.play_circle_fill, color: PetlifyTheme.accentCyan, size: 30),
                      onPressed: () => setState(() => _isReplaying = !_isReplaying),
                    ),
                    Expanded(
                      child: Slider(
                        value: _replayProgress,
                        min: 0.0,
                        max: 1.0,
                        activeColor: PetlifyTheme.accentCyan,
                        onChanged: (val) => setState(() => _replayProgress = val),
                      ),
                    ),
                    Text('${(_replayProgress * 100).toInt()}%', style: const TextStyle(fontSize: 11, fontFamily: 'monospace')),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Route Checkpoints Cards
        GlassCard(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Morning Walk Trail Log (Today)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
              const SizedBox(height: 10),
              ...List.generate(_routeCheckpoints.length, (i) {
                final cp = _routeCheckpoints[i];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: i == 0 ? PetlifyTheme.accentEmerald : PetlifyTheme.accentCyan,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(cp['name'], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      ),
                      Text('❤️ ${cp['bpm']} BPM', style: const TextStyle(fontSize: 11, color: PetlifyTheme.accentRose, fontWeight: FontWeight.w700)),
                      const SizedBox(width: 8),
                      Text(cp['time'], style: const TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildGeofenceView(Pet pet) {
    return Column(
      children: [
        GlassCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Safe Geofence Zones', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              _buildZoneTile('Home Safe Zone', '742 Evergreen Terrace (150m)', true, PetlifyTheme.accentEmerald),
              const SizedBox(height: 8),
              _buildZoneTile('Riverside Dog Park', 'Riverside Trail (80m)', true, PetlifyTheme.accentCyan),
              const SizedBox(height: 8),
              _buildZoneTile('Vet Clinic Area', '1420 Market St (60m)', false, PetlifyTheme.accentOrange),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildZoneTile(String name, String desc, bool active, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: PetlifyTheme.bgSurface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: active ? color.withAlpha(80) : PetlifyTheme.borderSubtle),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(width: 10, height: 10, decoration: BoxDecoration(shape: BoxShape.circle, color: color)),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  Text(desc, style: const TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
                ],
              ),
            ],
          ),
          Switch(
            value: active,
            activeColor: color,
            onChanged: (val) {},
          ),
        ],
      ),
    );
  }

  Widget _buildDiagnosticsView(Pet pet) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Collar Hardware Vitals', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          _buildDiagRow('Collar Battery', '${pet.battery}% (Li-Po 450mAh)', PetlifyTheme.accentEmerald),
          _buildDiagRow('Signal Lock', '4G LTE + GPS Fix (14 Satellites)', PetlifyTheme.accentCyan),
          _buildDiagRow('CPU Thermistor', '38.2°C (Optimal)', PetlifyTheme.accentEmerald),
          _buildDiagRow('Firmware Version', 'Petlify OS v3.4.1 (OTA Up to Date)', PetlifyTheme.textSecondary),
          _buildDiagRow('Onboard Flash Storage', '34% used (64 MB)', PetlifyTheme.accentPurple),
          _buildDiagRow('RAM Utilization', '62% active buffer', PetlifyTheme.accentCyan),
        ],
      ),
    );
  }

  Widget _buildDiagRow(String label, String value, Color valColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: PetlifyTheme.textSecondary)),
          Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: valColor)),
        ],
      ),
    );
  }
}

class _RouteMapPainter extends CustomPainter {
  final List<Map<String, dynamic>> checkpoints;
  final double progress;
  final String status;

  _RouteMapPainter({required this.checkpoints, required this.progress, required this.status});

  @override
  void paint(Canvas canvas, Size size) {
    // Grid Lines
    final gridPaint = Paint()
      ..color = Colors.white.withAlpha(12)
      ..strokeWidth = 1;

    for (double i = 0; i < size.width; i += 30) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), gridPaint);
    }
    for (double i = 0; i < size.height; i += 30) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), gridPaint);
    }

    // Geofence Circle
    final geoPaint = Paint()
      ..color = (status == 'safe' ? PetlifyTheme.accentEmerald : PetlifyTheme.accentRose).withAlpha(25)
      ..style = PaintingStyle.fill;
    final geoBorder = Paint()
      ..color = status == 'safe' ? PetlifyTheme.accentEmerald : PetlifyTheme.accentRose
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final homeCenter = Offset(size.width * 0.25, size.height * 0.75);
    canvas.drawCircle(homeCenter, 50, geoPaint);
    canvas.drawCircle(homeCenter, 50, geoBorder);

    // Route Path
    final path = Path();
    for (int i = 0; i < checkpoints.length; i++) {
      final x = size.width * (checkpoints[i]['x'] as double);
      final y = size.height * (checkpoints[i]['y'] as double);
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    final trailPaint = Paint()
      ..color = PetlifyTheme.accentCyan.withAlpha(160)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    canvas.drawPath(path, trailPaint);

    // Checkpoint Dots
    for (final cp in checkpoints) {
      final x = size.width * (cp['x'] as double);
      final y = size.height * (cp['y'] as double);
      canvas.drawCircle(Offset(x, y), 5, Paint()..color = PetlifyTheme.accentCyan);
      canvas.drawCircle(Offset(x, y), 3, Paint()..color = Colors.black);
    }

    // Current Pet Position along path
    final petIdx = (progress * (checkpoints.length - 1)).floor();
    final curCp = checkpoints[petIdx];
    final petX = size.width * (curCp['x'] as double);
    final petY = size.height * (curCp['y'] as double);

    canvas.drawCircle(Offset(petX, petY), 12, Paint()..color = PetlifyTheme.accentEmerald.withAlpha(80));
    canvas.drawCircle(Offset(petX, petY), 7, Paint()..color = PetlifyTheme.accentEmerald);
    canvas.drawCircle(Offset(petX, petY), 3, Paint()..color = Colors.white);
  }

  @override
  bool shouldRepaint(covariant _RouteMapPainter oldDelegate) => true;
}
