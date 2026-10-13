import 'package:flutter/material.dart';

class PetlifyTheme {
  // Ultra-Luxury Dark Aesthetic Palette
  static const Color bgMain = Color(0xFF060911);
  static const Color bgSurface = Color(0xFF0B101D);
  static const Color bgCard = Color(0xFF0F172A);
  static const Color bgCardHover = Color(0xFF17223B);
  
  static const Color borderSubtle = Color(0x14FFFFFF);
  static const Color borderMedium = Color(0x28FFFFFF);
  
  static const Color accentEmerald = Color(0xFF10B981);
  static const Color accentEmeraldGlow = Color(0x5910B981);
  
  static const Color accentCyan = Color(0xFF06B6D4);
  static const Color accentCyanGlow = Color(0x5906B6D4);
  
  static const Color accentOrange = Color(0xFFF97316);
  static const Color accentRose = Color(0xFFF43F5E);
  static const Color accentPurple = Color(0xFF8B5CF6);
  static const Color accentYellow = Color(0xFFF59E0B);
  
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgMain,
      primaryColor: accentEmerald,
      cardColor: bgCard,
      colorScheme: const ColorScheme.dark(
        primary: accentEmerald,
        secondary: accentCyan,
        surface: bgSurface,
        error: accentRose,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.5,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: bgSurface,
        selectedItemColor: accentEmerald,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w900, letterSpacing: -1),
        headlineMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.w800, letterSpacing: -0.5),
        titleLarge: TextStyle(color: textPrimary, fontWeight: FontWeight.w700),
        titleMedium: TextStyle(color: textPrimary, fontWeight: FontWeight.w600),
        bodyLarge: TextStyle(color: textPrimary, fontSize: 16),
        bodyMedium: TextStyle(color: textSecondary, fontSize: 14),
        bodySmall: TextStyle(color: textMuted, fontSize: 12),
      ),
    );
  }
}
