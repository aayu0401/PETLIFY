import 'package:flutter_test/flutter_test.dart';
import 'package:petlify_mobile/main.dart';

void main() {
  testWidgets('PetlifyApp basic smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const PetlifyApp());
    expect(find.text('Petlify'), findsWidgets);
  });
}
