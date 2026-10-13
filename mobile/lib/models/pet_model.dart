class PetVitals {
  int heartRate;
  double bodyTemp;
  int stepsToday;
  int stepsGoal;
  int caloriesBurned;
  String sleepHours;
  String restlessness;
  int barkCount;
  int scratchCount;

  PetVitals({
    required this.heartRate,
    required this.bodyTemp,
    required this.stepsToday,
    required this.stepsGoal,
    required this.caloriesBurned,
    required this.sleepHours,
    required this.restlessness,
    required this.barkCount,
    required this.scratchCount,
  });

  Map<String, dynamic> toJson() => {
    'heartRate': heartRate,
    'bodyTemp': bodyTemp,
    'stepsToday': stepsToday,
    'stepsGoal': stepsGoal,
    'caloriesBurned': caloriesBurned,
    'sleepHours': sleepHours,
    'restlessness': restlessness,
    'barkCount': barkCount,
    'scratchCount': scratchCount,
  };
}

class PetLocation {
  String status; // 'safe' | 'alert' | 'warning'
  String zoneName;
  String address;
  double lat;
  double lng;
  String lastSeen;

  PetLocation({
    required this.status,
    required this.zoneName,
    required this.address,
    required this.lat,
    required this.lng,
    required this.lastSeen,
  });
}

class WeightRecord {
  String date;
  double weight;

  WeightRecord({required this.date, required this.weight});
}

class Pet {
  String id;
  String name;
  String type; // 'dog' | 'cat'
  String breed;
  String age;
  double weight;
  double targetWeight;
  String gender;
  String neutered;
  String microchip;
  String avatar;
  String collarId;
  bool collarConnected;
  int battery;
  String signalStrength;
  String beaconColor;
  PetVitals vitals;
  PetLocation location;
  String diet;
  List<String> allergies;
  String medicalNotes;
  String vetClinic;
  String vetPhone;
  List<WeightRecord> weightHistory;

  Pet({
    required this.id,
    required this.name,
    required this.type,
    required this.breed,
    required this.age,
    required this.weight,
    required this.targetWeight,
    required this.gender,
    required this.neutered,
    required this.microchip,
    required this.avatar,
    required this.collarId,
    required this.collarConnected,
    required this.battery,
    required this.signalStrength,
    required this.beaconColor,
    required this.vitals,
    required this.location,
    required this.diet,
    required this.allergies,
    required this.medicalNotes,
    required this.vetClinic,
    required this.vetPhone,
    required this.weightHistory,
  });

  int get healthScore {
    int score = 100;
    if (vitals.heartRate > 120 || vitals.heartRate < 60) score -= 18;
    if (vitals.bodyTemp > 102.5 || vitals.bodyTemp < 100.0) score -= 15;
    if (vitals.stepsToday < (vitals.stepsGoal * 0.4)) score -= 8;
    if (location.status != 'safe') score -= 12;
    if (battery < 20) score -= 5;
    return score.clamp(10, 100);
  }
}
