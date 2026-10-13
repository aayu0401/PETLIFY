import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../state/pet_state.dart';
import '../widgets/glass_card.dart';
import '../widgets/health_score_gauge.dart';
import '../widgets/sparkline_chart.dart';

class DashboardScreen extends StatelessWidget {
  final PetState state;
  final Function(int) onNavigateTab;

  const DashboardScreen({
    super.key,
    required this.state,
    required this.onNavigateTab,
  });

  @override
  Widget build(BuildContext context) {
    final pet = state.activePet;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── HERO PET BANNER ──
          GlassCard(
            padding: const EdgeInsets.all(16),
            backgroundColor: PetlifyTheme.bgCard,
            borderColor: PetlifyTheme.accentEmerald.withAlpha(60),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: Image.network(
                    pet.avatar,
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    errorBuilder: (ctx, _, __) => Container(
                      width: 60,
                      height: 60,
                      color: PetlifyTheme.bgSurface,
                      child: const Icon(Icons.pets, color: PetlifyTheme.accentEmerald),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            pet.name,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: PetlifyTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: PetlifyTheme.accentEmerald.withAlpha(30),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              pet.collarConnected ? '● 4G LIVE' : '⚫ OFFLINE',
                              style: const TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                color: PetlifyTheme.accentEmerald,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${pet.breed} • ${pet.age} • ${pet.weight} kg',
                        style: const TextStyle(fontSize: 12, color: PetlifyTheme.textSecondary),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 12, color: PetlifyTheme.accentEmerald),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              pet.location.zoneName,
                              style: const TextStyle(fontSize: 11, color: PetlifyTheme.textMuted),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                HealthScoreGauge(score: pet.healthScore, size: 60),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // ── QUICK ACTIONS ROW ──
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    state.toggleBuzzer();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(state.isBuzzerActive ? '🔔 Collar High-Beam Beacon & Buzzer Active!' : 'Collar Beeper Stopped.'),
                        backgroundColor: state.isBuzzerActive ? PetlifyTheme.accentRose : PetlifyTheme.accentEmerald,
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: Icon(
                    Icons.volume_up_rounded,
                    size: 16,
                    color: state.isBuzzerActive ? Colors.white : PetlifyTheme.accentEmerald,
                  ),
                  label: Text(
                    state.isBuzzerActive ? 'Stop Beep' : 'Locate Beep',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: state.isBuzzerActive ? Colors.white : PetlifyTheme.textPrimary,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: state.isBuzzerActive ? PetlifyTheme.accentRose : Colors.transparent,
                    side: BorderSide(color: state.isBuzzerActive ? PetlifyTheme.accentRose : PetlifyTheme.borderSubtle),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => onNavigateTab(2), // Jump to AI assistant
                  icon: const Icon(Icons.auto_awesome, size: 16, color: Colors.black),
                  label: const Text(
                    'Ask AI Vet',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.black),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: PetlifyTheme.accentEmerald,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // ── VITALS 2x2 GRID ──
          Row(
            children: [
              // Heart Rate
              Expanded(
                child: GlassCard(
                  padding: const EdgeInsets.all(12),
                  borderColor: PetlifyTheme.accentRose.withAlpha(60),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('HEART RATE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: PetlifyTheme.textMuted)),
                          Icon(Icons.favorite, size: 14, color: PetlifyTheme.accentRose),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${pet.vitals.heartRate}',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                      const Text('BPM • Optical PPG', style: TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Body Temp
              Expanded(
                child: GlassCard(
                  padding: const EdgeInsets.all(12),
                  borderColor: PetlifyTheme.accentOrange.withAlpha(60),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('BODY TEMP', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: PetlifyTheme.textMuted)),
                          Icon(Icons.thermostat, size: 14, color: PetlifyTheme.accentOrange),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${pet.vitals.bodyTemp}°F',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                      const Text('Optimal Baseline', style: TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              // Steps
              Expanded(
                child: GlassCard(
                  padding: const EdgeInsets.all(12),
                  borderColor: PetlifyTheme.accentEmerald.withAlpha(60),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('STEPS TODAY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: PetlifyTheme.textMuted)),
                          Icon(Icons.directions_walk, size: 14, color: PetlifyTheme.accentEmerald),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${pet.vitals.stepsToday}',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                      Text('Goal: ${pet.vitals.stepsGoal}', style: const TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Calories
              Expanded(
                child: GlassCard(
                  padding: const EdgeInsets.all(12),
                  borderColor: PetlifyTheme.accentPurple.withAlpha(60),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('CALORIES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: PetlifyTheme.textMuted)),
                          Icon(Icons.local_fire_department, size: 14, color: PetlifyTheme.accentPurple),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${pet.vitals.caloriesBurned}',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                      const Text('kcal burned today', style: TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // ── 7-DAY ACTIVITY SPARKLINE ──
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.bar_chart_rounded, size: 16, color: PetlifyTheme.accentEmerald),
                        SizedBox(width: 6),
                        Text('7-Day Activity Trend', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                      ],
                    ),
                    Text('Avg: 9,200 steps', style: TextStyle(fontSize: 11, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 14),
                SparklineChart(
                  stepsData: const [9400, 11200, 7800, 10500, 8900, 13400, 8420],
                  stepGoal: pet.vitals.stepsGoal,
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // ── SLEEP & RESTLESSNESS TRACKER ──
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.bedtime_outlined, size: 16, color: PetlifyTheme.accentPurple),
                        SizedBox(width: 6),
                        Text('Sleep & Recovery Insights', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                      ],
                    ),
                    Text('IMU Optical Sensor', style: TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Total Rest (24h)', style: TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
                          const SizedBox(height: 2),
                          Text(pet.vitals.sleepHours, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: PetlifyTheme.accentPurple)),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Restlessness', style: TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
                          const SizedBox(height: 2),
                          Text(pet.vitals.restlessness, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: PetlifyTheme.accentEmerald)),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Night Barks', style: TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
                          const SizedBox(height: 2),
                          Text('${pet.vitals.barkCount} events', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // ── SMART BOWL MONITOR ──
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.restaurant, size: 16, color: PetlifyTheme.accentOrange),
                        SizedBox(width: 6),
                        Text('Smart Bowls & Feeder', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
                      ],
                    ),
                    Text('Auto Dispenser Sync', style: TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                  ],
                ),
                const SizedBox(height: 14),

                // Water Fountain
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Water Fountain', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                    Text('${state.waterLevel}%', style: const TextStyle(fontSize: 12, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w800)),
                  ],
                ),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: state.waterLevel / 100,
                    backgroundColor: Colors.white10,
                    valueColor: const AlwaysStoppedAnimation<Color>(PetlifyTheme.accentCyan),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 10),

                // Food Bowl
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Dry Kibble Hopper', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                    Text('${state.foodLevel}%', style: const TextStyle(fontSize: 12, color: PetlifyTheme.accentOrange, fontWeight: FontWeight.w800)),
                  ],
                ),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: state.foodLevel / 100,
                    backgroundColor: Colors.white10,
                    valueColor: const AlwaysStoppedAnimation<Color>(PetlifyTheme.accentOrange),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 14),

                ElevatedButton.icon(
                  onPressed: () {
                    state.dispenseFood();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('🍖 1 Cup Organic Kibble Dispensed!'), backgroundColor: PetlifyTheme.accentEmerald),
                    );
                  },
                  icon: const Icon(Icons.flash_on, size: 16, color: Colors.white),
                  label: const Text('Dispense Meal Now', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: PetlifyTheme.accentOrange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // ── OUTDOOR WALK WEATHER SAFETY ──
          GlassCard(
            padding: const EdgeInsets.all(16),
            borderColor: PetlifyTheme.accentEmerald.withAlpha(40),
            child: const Row(
              children: [
                Icon(Icons.wb_sunny_outlined, size: 28, color: PetlifyTheme.accentYellow),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Safe for Outdoor Walk', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: PetlifyTheme.accentEmerald)),
                      SizedBox(height: 2),
                      Text('Pavement 78°F • Air Quality AQI 28 (Good) • Optimal walk window: 5:30 PM', style: TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
