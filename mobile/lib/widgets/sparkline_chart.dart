import 'dart:math';
import 'package:flutter/material.dart';
import '../core/theme.dart';

class SparklineChart extends StatelessWidget {
  final List<int> stepsData;
  final int stepGoal;

  const SparklineChart({
    super.key,
    required this.stepsData,
    required this.stepGoal,
  });

  @override
  Widget build(BuildContext context) {
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final maxSteps = max(stepsData.reduce(max), stepGoal);

    return Column(
      children: [
        SizedBox(
          height: 65,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(stepsData.length, (index) {
              final val = stepsData[index];
              final heightPct = (val / maxSteps).clamp(0.08, 1.0);
              final isToday = index == stepsData.length - 1;

              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 3),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        height: 55 * heightPct,
                        decoration: BoxDecoration(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: isToday
                                ? [PetlifyTheme.accentCyan, PetlifyTheme.accentCyan.withAlpha(80)]
                                : [PetlifyTheme.accentEmerald, PetlifyTheme.accentEmerald.withAlpha(80)],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(days.length, (index) {
            final isToday = index == days.length - 1;
            return Expanded(
              child: Text(
                days[index],
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: isToday ? FontWeight.w800 : FontWeight.w500,
                  color: isToday ? PetlifyTheme.accentCyan : PetlifyTheme.textMuted,
                ),
              ),
            );
          }),
        ),
      ],
    );
  }
}
