import 'dart:math';
import 'package:flutter/material.dart';
import '../core/theme.dart';

class HealthScoreGauge extends StatelessWidget {
  final int score;
  final double size;
  final bool showDetails;

  const HealthScoreGauge({
    super.key,
    required this.score,
    this.size = 80,
    this.showDetails = false,
  });

  @override
  Widget build(BuildContext context) {
    Color gaugeColor = PetlifyTheme.accentEmerald;
    if (score < 70) gaugeColor = PetlifyTheme.accentOrange;
    if (score < 50) gaugeColor = PetlifyTheme.accentRose;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: CustomPaint(
            painter: _GaugePainter(score: score, color: gaugeColor),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '$score',
                    style: TextStyle(
                      fontSize: size * 0.32,
                      fontWeight: FontWeight.w900,
                      color: PetlifyTheme.textPrimary,
                    ),
                  ),
                  Text(
                    '/100',
                    style: TextStyle(
                      fontSize: size * 0.15,
                      color: PetlifyTheme.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        if (showDetails) ...[
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'AI Health Index',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: PetlifyTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                score >= 85 ? '🌟 Prime Condition' : score >= 70 ? '⚡ Good Baseline' : '⚠️ Attention Advised',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: gaugeColor,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

class _GaugePainter extends CustomPainter {
  final int score;
  final Color color;

  _GaugePainter({required this.score, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - 10) / 2;
    const strokeWidth = 7.0;

    // Track Paint
    final trackPaint = Paint()
      ..color = Colors.white.withAlpha(20)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    canvas.drawCircle(center, radius, trackPaint);

    // Progress Arc
    final progressPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    const startAngle = -pi / 2;
    final sweepAngle = (score / 100) * 2 * pi;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _GaugePainter oldDelegate) =>
      oldDelegate.score != score || oldDelegate.color != color;
}
