import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'models/pet_model.dart';
import 'models/user_model.dart';
import 'screens/auth_screen.dart';
import 'screens/main_navigation.dart';
import 'state/pet_state.dart';

void main() {
  runApp(const PetlifyApp());
}

class PetlifyApp extends StatefulWidget {
  const PetlifyApp({super.key});

  @override
  State<PetlifyApp> createState() => _PetlifyAppState();
}

class _PetlifyAppState extends State<PetlifyApp> {
  final PetState _petState = PetState();
  bool _isAuthenticated = true; // Set to true by default for demo, can switch to AuthScreen

  @override
  void initState() {
    super.initState();
    _petState.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _petState.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Petlify - Smart Collar & Pet Healthcare',
      debugShowCheckedModeBanner: false,
      theme: PetlifyTheme.darkTheme,
      home: _isAuthenticated
          ? MainNavigationShell(
              state: _petState,
              onLogout: () {
                setState(() => _isAuthenticated = false);
              },
              onOpenIntakeWizard: () {
                setState(() => _isAuthenticated = false);
              },
            )
          : AuthScreen(
              onLoginSuccess: (UserProfile user, Pet? pet) {
                setState(() {
                  _petState.currentUser = user;
                  if (pet != null) {
                    _petState.addPet(pet);
                  }
                  _isAuthenticated = true;
                });
              },
            ),
    );
  }
}
