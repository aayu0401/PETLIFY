import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../state/pet_state.dart';
import '../widgets/glass_card.dart';

class AiAssistantScreen extends StatefulWidget {
  final PetState state;

  const AiAssistantScreen({super.key, required this.state});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  int _activeTab = 0; // 0: AI Vet Chat, 1: BioAcoustic Voice AI
  final _messageController = TextEditingController();
  
  // AI Vet Chat History
  final List<Map<String, String>> _chatMessages = [
    {
      'sender': 'ai',
      'text': 'Hello! I am your Petlify AI Vet Assistant powered by Gemini 2.5 BioAcoustics. I am monitoring your pet\'s real-time optical PPG and thermistor telemetry. How can I help you today?',
      'time': '10:00 AM'
    },
    {
      'sender': 'user',
      'text': 'How do his vitals look today? He ran quite a bit at the dog park.',
      'time': '10:02 AM'
    },
    {
      'sender': 'ai',
      'text': 'His recovery pulse quickly stabilized back to 82 BPM within 8 minutes post-run, indicating strong cardiovascular conditioning! Temperature is nominal at 101.4°F. I recommend refilling his water fountain with ~250ml fresh water.',
      'time': '10:02 AM'
    },
  ];

  // Voice AI State
  bool _isRecording = false;
  bool _isAnalyzing = false;
  List<int> _audioWavebars = [20, 45, 80, 60, 30, 95, 40, 70, 50, 85, 30, 60];
  Timer? _waveTimer;

  Map<String, dynamic> _currentTranslation = {
    'soundType': 'Playful Staccato Bark Pattern',
    'frequency': '780 Hz',
    'confidence': '98.6%',
    'emotion': 'Joyful Excitement & Play Request',
    'translation': 'Hey! I am feeling super energetic right now. Can we grab the tennis ball and head out to the park for fetch?',
  };

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;
    final userText = _messageController.text.trim();
    setState(() {
      _chatMessages.add({
        'sender': 'user',
        'text': userText,
        'time': 'Just now',
      });
      _messageController.clear();
    });

    Future.delayed(const Duration(milliseconds: 1000), () {
      final pet = widget.state.activePet;
      setState(() {
        _chatMessages.add({
          'sender': 'ai',
          'text': 'Based on ${pet.name}\'s collar vitals (${pet.vitals.heartRate} BPM, ${pet.vitals.bodyTemp}°F) and ${pet.breed} baseline: everything looks in optimal range. Keep an eye on hydration after his ${pet.vitals.stepsToday} steps today!',
          'time': 'Just now',
        });
      });
    });
  }

  void _toggleRecording() {
    if (!_isRecording) {
      setState(() {
        _isRecording = true;
        _isAnalyzing = false;
      });

      _waveTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
        setState(() {
          _audioWavebars = List.generate(16, (_) => Random().nextInt(70) + 20);
        });
      });
    } else {
      _waveTimer?.cancel();
      setState(() {
        _isRecording = false;
        _isAnalyzing = true;
      });

      Future.delayed(const Duration(milliseconds: 1400), () {
        setState(() {
          _isAnalyzing = false;
          _currentTranslation = {
            'soundType': 'Alert Double-Bark Pattern',
            'frequency': '920 Hz',
            'confidence': '99.1%',
            'emotion': 'Territorial Alert & Curiosity',
            'translation': 'I heard footsteps outside the front door! I am keeping watch for the family.',
          };
        });
      });
    }
  }

  @override
  void dispose() {
    _waveTimer?.cancel();
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Top Switcher
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: PetlifyTheme.bgSurface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: PetlifyTheme.borderSubtle),
          ),
          child: Row(
            children: [
              Expanded(
                child: _buildTabBtn(0, '🤖 AI Vet Assistant'),
              ),
              Expanded(
                child: _buildTabBtn(1, '🎙️ Pet Voice AI'),
              ),
            ],
          ),
        ),

        Expanded(
          child: _activeTab == 0 ? _buildAiChatView() : _buildVoiceAiView(),
        ),
      ],
    );
  }

  Widget _buildTabBtn(int index, String title) {
    final active = _activeTab == index;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: active ? PetlifyTheme.accentEmerald.withAlpha(35) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: active ? PetlifyTheme.accentEmerald.withAlpha(80) : Colors.transparent),
        ),
        child: Text(
          title,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: active ? PetlifyTheme.accentEmerald : PetlifyTheme.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildAiChatView() {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            itemCount: _chatMessages.length,
            itemBuilder: (context, index) {
              final msg = _chatMessages[index];
              final isAi = msg['sender'] == 'ai';

              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  mainAxisAlignment: isAi ? MainAxisAlignment.start : MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (isAi) ...[
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: PetlifyTheme.accentEmerald.withAlpha(40),
                          border: Border.all(color: PetlifyTheme.accentEmerald),
                        ),
                        child: const Icon(Icons.auto_awesome, size: 16, color: PetlifyTheme.accentEmerald),
                      ),
                      const SizedBox(width: 8),
                    ],
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isAi ? PetlifyTheme.bgCard : PetlifyTheme.accentEmerald,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: isAi ? PetlifyTheme.borderSubtle : Colors.transparent),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              msg['text']!,
                              style: TextStyle(
                                fontSize: 13,
                                color: isAi ? PetlifyTheme.textPrimary : Colors.black,
                                fontWeight: isAi ? FontWeight.w500 : FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              msg['time']!,
                              style: TextStyle(fontSize: 9, color: isAi ? PetlifyTheme.textMuted : Colors.black54),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),

        // Input Field
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          color: PetlifyTheme.bgSurface,
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _messageController,
                  decoration: InputDecoration(
                    hintText: 'Ask AI Vet about symptoms, diet, vitals...',
                    hintStyle: const TextStyle(fontSize: 12, color: PetlifyTheme.textMuted),
                    filled: true,
                    fillColor: PetlifyTheme.bgCard,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(999), borderSide: const BorderSide(color: PetlifyTheme.borderSubtle)),
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.send_rounded, color: PetlifyTheme.accentEmerald),
                onPressed: _sendMessage,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildVoiceAiView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Waveform Card
          GlassCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Text('BioAcoustic Neural Voice Decoder', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                const SizedBox(height: 4),
                const Text('AI translates barks, meows & whines into human speech', style: TextStyle(fontSize: 11, color: PetlifyTheme.textMuted)),
                const SizedBox(height: 24),

                // Animated Waveform Bars
                SizedBox(
                  height: 80,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: _audioWavebars.map((h) {
                      return Container(
                        width: 8,
                        height: _isRecording ? h.toDouble() : 20.0,
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        decoration: BoxDecoration(
                          color: _isRecording ? PetlifyTheme.accentEmerald : PetlifyTheme.accentCyan.withAlpha(100),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 24),

                // Record Button
                GestureDetector(
                  onTap: _toggleRecording,
                  child: Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _isRecording ? PetlifyTheme.accentRose : PetlifyTheme.accentEmerald,
                      boxShadow: [
                        BoxShadow(
                          color: (_isRecording ? PetlifyTheme.accentRose : PetlifyTheme.accentEmerald).withAlpha(100),
                          blurRadius: 20,
                        ),
                      ],
                    ),
                    child: Icon(_isRecording ? Icons.stop : Icons.mic, color: Colors.black, size: 32),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _isRecording ? 'Listening to Pet Audio...' : _isAnalyzing ? 'Analyzing Frequencies...' : 'Tap to Record & Translate',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: _isRecording ? PetlifyTheme.accentRose : PetlifyTheme.accentEmerald,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Translation Result
          GlassCard(
            padding: const EdgeInsets.all(16),
            borderColor: PetlifyTheme.accentEmerald.withAlpha(80),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(_currentTranslation['soundType']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: PetlifyTheme.accentEmerald)),
                    Text('${_currentTranslation['confidence']} Confidence', style: const TextStyle(fontSize: 10, color: PetlifyTheme.accentCyan, fontWeight: FontWeight.w700)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '"${_currentTranslation['translation']}"',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, fontStyle: FontStyle.italic, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.psychology, size: 14, color: PetlifyTheme.accentPurple),
                    const SizedBox(width: 4),
                    Text('Emotion: ${_currentTranslation['emotion']}', style: const TextStyle(fontSize: 11, color: PetlifyTheme.textSecondary)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
