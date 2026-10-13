import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../state/pet_state.dart';
import '../widgets/glass_card.dart';

class PetSocialScreen extends StatelessWidget {
  final PetState state;

  const PetSocialScreen({super.key, required this.state});

  final List<Map<String, dynamic>> _nearbyPets = const [
    {
      'name': 'Rocky',
      'breed': 'French Bulldog',
      'age': '2 Years',
      'owner': 'Jessica Taylor',
      'distance': '0.6 km',
      'compatibility': '98%',
      'avatar': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      'tags': ['Super Friendly', 'Ball Fetcher', 'Park Regular'],
    },
    {
      'name': 'Milo',
      'breed': 'Australian Shepherd',
      'age': '1.5 Years',
      'owner': 'David Chen',
      'distance': '1.2 km',
      'compatibility': '95%',
      'avatar': 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400',
      'tags': ['High Energy', 'Agility Lover', 'Frisbee Champ'],
    },
    {
      'name': 'Nala',
      'breed': 'Shiba Inu',
      'age': '3 Years',
      'owner': 'Sophie Bennett',
      'distance': '1.8 km',
      'compatibility': '91%',
      'avatar': 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400',
      'tags': ['Calm', 'Leash Trained', 'Cafe Friendly'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _nearbyPets.length,
      itemBuilder: (context, index) {
        final pet = _nearbyPets[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(pet['avatar'], width: 56, height: 56, fit: BoxFit.cover),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(pet['name'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: PetlifyTheme.accentEmerald.withAlpha(30),
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                child: Text('${pet['compatibility']} Match', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: PetlifyTheme.accentEmerald)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text('${pet['breed']} • ${pet['age']} • ${pet['distance']} away', style: const TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                          Text('Parent: ${pet['owner']}', style: const TextStyle(fontSize: 10, color: PetlifyTheme.textMuted)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 4,
                  children: (pet['tags'] as List<String>).map((t) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: PetlifyTheme.bgSurface,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: PetlifyTheme.borderSubtle),
                      ),
                      child: Text(t, style: const TextStyle(fontSize: 9, color: PetlifyTheme.accentCyan)),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('🎉 Playdate invitation sent to ${pet['owner']}!'), backgroundColor: PetlifyTheme.accentEmerald),
                    );
                  },
                  icon: const Icon(Icons.send_rounded, size: 14, color: Colors.black),
                  label: Text('Send Playdate Invite for ${state.activePet.name}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: PetlifyTheme.accentEmerald,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
