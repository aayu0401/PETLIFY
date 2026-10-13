import 'dart:math';
import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../models/pet_model.dart';

class WeightChartWidget extends StatelessWidget {
  final List<WeightRecord> history;
  final double targetWeight;

  const WeightChartWidget({
    super.key,
    required this.history,
    required this.targetWeight,
  });

  @override
  Widget build(BuildContext context) {
    if (history.isEmpty) {
      return const Center(child: Text('No weight history logged yet.'));
    }

    final latest = history.last.weight;
    final previous = history.length > 1 ? history[history.length - 2].weight : latest;
    final diff = latest - previous;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  '$latest kg',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: PetlifyTheme.textPrimary,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: diff <= 0 ? PetlifyTheme.accentEmerald.withAlpha(30) : PetlifyTheme.accentRose.withAlpha(30),
                    borderRadius: BorderRadius.circular(9999),
                    border: Border.all(
                      color: diff <= 0 ? PetlifyTheme.accentEmerald : PetlifyTheme.accentRose,
                      width: 1,
                    ),
                  ),
                  child: Text(
                    diff >= 0 ? '+${diff.toStringAsFixed(1)} kg' : '${diff.toStringAsFixed(1)} kg',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: diff <= 0 ? PetlifyTheme.accentEmerald : PetlifyTheme.accentRose,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              'Target: ${targetWeight.toStringAsFixed(1)} kg',
              style: const TextStyle(fontSize: 12, color: PetlifyTheme.textMuted),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 90,
          width: double.infinity,
          child: CustomPaint(
            painter: _WeightLinePainter(history: history, targetWeight: targetWeight),
          ),
        ),
      ],
    );
  }
}

class _WeightLinePainter extends CustomPainter {
  final List<WeightRecord> history;
  final double targetWeight;

  _WeightLinePainter({required this.history, required this.targetWeight});

  @override
  void paint(Canvas canvas, Size size) {
    if (history.length < 2) return;

    final weights = history.map((e) => e.weight).toList();
    final minW = weights.reduce(min) - 0.5;
    final maxW = weights.reduce(max) + 0.5;

    double toX(int index) => (index / (history.length - 1)) * size.width;
    double toY(double weight) => size.height - ((weight - minW) / (maxW - minW)) * size.height;

    // Ideal Range Box
    final idealY = toY(targetWeight);
    final bandPaint = Paint()..color = PetlifyTheme.accentEmerald.withAlpha(20);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTRB(0, max(0, idealY - 8), size.width, min(size.height, idealY + 8)),
        const Radius.circular(4),
      ),
      bandPaint,
    );

    // Line Path
    final path = Path();
    for (int i = 0; i < history.length; i++) {
      final x = toX(i);
      final y = toY(history[i].weight);
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    final linePaint = Paint()
      ..color = PetlifyTheme.accentEmerald
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, linePaint);

    // Points
    final dotPaint = Paint()..color = PetlifyTheme.accentEmerald;
    final centerPaint = Paint()..color = PetlifyTheme.bgCard;

    for (int i = 0; i < history.length; i++) {
      final x = toX(i);
      final y = toY(history[i].weight);
      canvas.drawCircle(Offset(x, y), 4, dotPaint);
      canvas.drawCircle(Offset(x, y), 2, centerPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _WeightLinePainter oldDelegate) => true;
}
