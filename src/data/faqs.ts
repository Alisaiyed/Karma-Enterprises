export type FaqCategory = 'maintenance' | 'warranty' | 'technical-support';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  seriesScope: 'KING Geared' | 'PRINCE Gearless' | 'KING & PRINCE';
  question: string;
  answer: string;
  specNote?: string;
  keywords: string[];
}

export const FAQ_CATEGORIES: { id: 'all' | FaqCategory; label: string }[] = [
  { id: 'all', label: 'All Topics' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'warranty', label: 'Warranty' },
  { id: 'technical-support', label: 'Technical Support' },
];

export const KAYNOXX_FAQS: FaqItem[] = [
  {
    id: 'geared-oil-schedule',
    category: 'maintenance',
    seriesScope: 'KING Geared',
    question: 'What is the recommended gear oil grade and replacement schedule for KING geared machines?',
    answer:
      'KAYNOXX KING worm-geared traction machines require ISO VG 320 or VG 460 synthetic polyglycol (PAG) worm gear oil, depending on ambient machine-room temperature. Perform the first oil flush after 500–800 operating hours (or 6 months post-commissioning) to remove break-in particles, then replace oil every 24 months or 6,000 operating hours. Always verify the oil sight-glass level during monthly elevator servicing.',
    specNote:
      'Sump capacity: KING 125 (2.0 L) · KING 153 (3.0 L) · KING 210 (4.25 L) · KING 215 (5.0 L) · KING 220 (7.0 L) · KING 225 (8.0 L)',
    keywords: ['oil', 'lubrication', 'gearbox', 'vg 320', 'vg 460', 'sump', 'service', 'flush'],
  },
  {
    id: 'gearless-maintenance-needs',
    category: 'maintenance',
    seriesScope: 'PRINCE Gearless',
    question: 'Are PRINCE permanent-magnet gearless machines completely maintenance-free?',
    answer:
      'PRINCE series PMSM machines are 100% oil-free and use sealed-for-life heavy-duty bearings, eliminating gear oil changes, oil seals, and gearbox leaks in MRL shafts. Routine preventive maintenance is focused on inspecting electromagnetic brake air-gap clearance, verifying brake micro-switch feedback, checking traction sheave groove wear, and ensuring dust-free airflow around the stator frame.',
    specNote: 'Recommended inspection cadence: Quarterly brake & micro-switch check · Annual rope tension & groove gauge audit',
    keywords: ['oil-free', 'gearless', 'pmsm', 'bearing', 'mrl', 'sheave', 'groove', 'inspection'],
  },
  {
    id: 'brake-air-gap-service',
    category: 'maintenance',
    seriesScope: 'KING & PRINCE',
    question: 'How frequently should electromagnetic brakes and linings be inspected?',
    answer:
      'Check brake air gap, coil pick-up/hold voltage (48V / 60V / 110V / 220V DC on KING geared models; 110V DC on PRINCE gearless models), and manual release lever smoothness every 3 months in commercial buildings and every 6 months in residential shafts. Replace friction pads before lining thickness reaches the minimum wear limit stamped on the brake shoe, and verify silent, simultaneous opening on dual-circuit PRINCE brakes.',
    specNote: 'Standard brake coil ratings: KING Series (48 / 60 / 110 / 220V DC) · PRINCE Series (110V DC dual-circuit)',
    keywords: ['brake', 'air gap', '110v', '220v', 'lining', 'pad', 'coil', 'micro-switch'],
  },
  {
    id: 'factory-warranty-coverage',
    category: 'warranty',
    seriesScope: 'KING & PRINCE',
    question: 'What does the Karma Enterprises factory warranty cover on KAYNOXX traction machines?',
    answer:
      'Every KAYNOXX machine dispatched from our GIDC Naroda, Ahmedabad plant carries a 12-month standard warranty from commissioning (or 18 months from dispatch, whichever occurs first) against manufacturing defects in cast-iron housings, worm shafts, phosphor-bronze wheels, PMSM stators, permanent magnets, and factory-fitted brakes. Extended OEM project warranty terms are available for multi-tower contracts.',
    specNote: 'Traceability: Every unit ships with an individual thermal & full-load QC test certificate linked to its nameplate serial number',
    keywords: ['warranty', 'guarantee', 'coverage', '12 months', '18 months', 'defects', 'serial', 'certificate'],
  },
  {
    id: 'warranty-claim-conditions',
    category: 'warranty',
    seriesScope: 'KING & PRINCE',
    question: 'Which installation or operating conditions are required to keep the warranty valid?',
    answer:
      'To preserve full warranty eligibility, machines must be operated within their catalog duty load, max static load, and S4/S5 (40%) duty-cycle ratings with properly equalized hoist ropes and a compatible VVVF drive. Warranty does not cover wear consumables (friction linings, shaft seals, ropes) or damage caused by unapproved mineral oils, phase failure, water ingress beyond IP-20/IP-40 limits, or unauthorized disassembly.',
    specNote: 'Protection ratings: KING Geared (IP-20, F Class) · PRINCE Gearless (IP-40, F Class)',
    keywords: ['conditions', 'void', 'exclusions', 'ip-20', 'ip-40', 'duty cycle', 'static load', 'claim'],
  },
  {
    id: 'spare-parts-availability',
    category: 'warranty',
    seriesScope: 'KING & PRINCE',
    question: 'How quickly are genuine KAYNOXX spare parts dispatched for installed elevators?',
    answer:
      'Because Karma Enterprises machines and assembles both KING and PRINCE platforms in-house in Ahmedabad, critical spares—including traction sheaves, electromagnetic brake assemblies, coils, rectifiers, encoders, and worm-gear sets—are stocked at the factory. Verified spare orders for standard models typically dispatch within 24–48 business hours across India.',
    specNote: 'Direct factory parts dispatch from GIDC Naroda, Ahmedabad · Quote nameplate serial number for exact fitment',
    keywords: ['spares', 'parts', 'sheave', 'encoder', 'brake coil', 'dispatch', 'replacement', 'stock'],
  },
  {
    id: 'vvvf-encoder-commissioning',
    category: 'technical-support',
    seriesScope: 'KING & PRINCE',
    question: 'Which VVVF drives and encoders are compatible with KAYNOXX machines, and do you assist with commissioning?',
    answer:
      'Both KING (400V, 50 Hz AC induction) and PRINCE (400V PMSM synchronous) machines are compatible with all leading closed-loop elevator VVVF controllers (Monarch, Invertek, Yaskawa, Fuji, Arkel, Gefran, and Schneider). Our technical desk supplies complete motor nameplate parameters, pole counts, encoder wiring pinouts, and remote commissioning support for stationary or rotational auto-tuning.',
    specNote: 'Support deliverables: Motor parameter sheet · Encoder pinout diagram · Brake rectifier wiring guide',
    keywords: ['vvvf', 'inverter', 'drive', 'encoder', 'commissioning', 'autotune', 'monarch', 'yaskawa', 'fuji'],
  },
  {
    id: 'field-engineer-support',
    category: 'technical-support',
    seriesScope: 'KING & PRINCE',
    question: 'How do elevator contractors request remote troubleshooting or an on-site service engineer?',
    answer:
      'Contractors and OEM maintenance teams can reach our Ahmedabad engineering desk directly on +91 9925577565 or via kaynoxx-karma@gmail.com with the machine serial number, VVVF fault code, and a short shaft video. Most drive tuning, brake timing, and vibration diagnostics are resolved remotely the same business day; when physical inspection is required, Karma Enterprises schedules a dedicated field service engineer.',
    specNote: 'Engineering desk hours: Mon–Sat, 09:30–18:30 IST · Direct hotline: +91 9925577565',
    keywords: ['support', 'engineer', 'troubleshooting', 'vibration', 'noise', 'on-site', 'phone', 'hotline'],
  },
  {
    id: 'custom-sheave-cad-drawings',
    category: 'technical-support',
    seriesScope: 'KING & PRINCE',
    question: 'Can Karma Enterprises provide GA CAD drawings, custom rope grooves, or modernization drop-in guidance?',
    answer:
      'Yes. Full orthographic mm-scale dimensional drawings are available for every KING and PRINCE model, and our engineering team verifies machine-beam reactions, rope fleet angles, and bedplate footprint compatibility for both new MRL/MR shafts and geared modernization retrofits. Custom sheave diameters and rope-groove profiles can be confirmed prior to production release.',
    specNote: 'Catalog sheave diameters: 200 – 400 mm (PRINCE Gearless) · 530 – 610 mm (KING Geared)',
    keywords: ['cad', 'ga drawing', 'custom', 'sheave', 'modernization', 'retrofit', 'bedplate', 'dimensions'],
  },
];
