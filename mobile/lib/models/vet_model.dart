class VetClinic {
  final String id;
  final String name;
  final String doctor;
  final double rating;
  final int reviews;
  final double distanceKm;
  final String address;
  final String phone;
  final bool isEmergency;
  final List<String> services;
  final String image;

  VetClinic({
    required this.id,
    required this.name,
    required this.doctor,
    required this.rating,
    required this.reviews,
    required this.distanceKm,
    required this.address,
    required this.phone,
    required this.isEmergency,
    required this.services,
    required this.image,
  });
}

class VetAppointment {
  final String id;
  final String clinicName;
  final String doctor;
  final String petName;
  final String service;
  final String date;
  final String time;
  final String phone;
  String status;

  VetAppointment({
    required this.id,
    required this.clinicName,
    required this.doctor,
    required this.petName,
    required this.service,
    required this.date,
    required this.time,
    required this.phone,
    this.status = 'Confirmed',
  });
}

class VaccinationRecord {
  final String name;
  final String dateGiven;
  final String nextDue;
  final String clinic;
  final String batchNo;
  final bool isUpToDate;

  VaccinationRecord({
    required this.name,
    required this.dateGiven,
    required this.nextDue,
    required this.clinic,
    required this.batchNo,
    required this.isUpToDate,
  });
}
