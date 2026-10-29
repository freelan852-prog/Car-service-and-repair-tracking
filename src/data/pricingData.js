/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// PRESENTATION / DEMO CONFIGURATION
// Change this single constant to adjust automatic tracker stage speed
// ============================================================================
export const TRACKER_STAGE_INTERVAL_MS = 15000; // 15 seconds per stage

// Automatic progression stages
export const TRACKER_STAGES = [
  'Booked',
  'Vehicle received',
  'Inspection',
  'In progress',
  'Ready',
  'Delivered',
];

// Helper to format currency in Indian Rupees
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ============================================================================
// MODEL-BASED PRICING CONFIGURATION & TIERS
// Prices change according to vehicle type, specific model tier, and fuel type
// ============================================================================

export const MODEL_TIERS = {
  car: {
    entry_hatch: {
      id: 'entry_hatch',
      label: 'Entry / Budget Hatchback',
      description: 'Alto, Kwid, WagonR, Celerio, Santro, S-Presso, Eon',
      multiplier: 0.85,
    },
    premium_hatch: {
      id: 'premium_hatch',
      label: 'Standard & Premium Hatchback',
      description: 'Swift, Baleno, i20, Altroz, Polo, Glanza, Tiago',
      multiplier: 1.0,
    },
    compact_sedan: {
      id: 'compact_sedan',
      label: 'Compact Sedan',
      description: 'Dzire, Amaze, Aura, Tigor',
      multiplier: 1.15,
    },
    executive_sedan: {
      id: 'executive_sedan',
      label: 'Executive & Mid-Size Sedan',
      description: 'City, Verna, Ciaz, Slavia, Virtus, Civic, Octavia',
      multiplier: 1.30,
    },
    compact_suv: {
      id: 'compact_suv',
      label: 'Sub-Compact / Urban SUV',
      description: 'Brezza, Nexon, Venue, Sonet, Punch, Magnite, Kiger, Fronx',
      multiplier: 1.35,
    },
    mid_suv: {
      id: 'mid_suv',
      label: 'Mid-Size & Crossover SUV',
      description: 'Creta, Seltos, Grand Vitara, Hyryder, Scorpio, Taigun, Kushaq, Thar',
      multiplier: 1.55,
    },
    full_suv: {
      id: 'full_suv',
      label: 'Full-Size / Rugged Premium SUV',
      description: 'Fortuner, XUV700, Safari, Harrier, Endeavour, Gloster',
      multiplier: 1.95,
    },
    luxury: {
      id: 'luxury',
      label: 'Luxury & Executive Imports',
      description: 'BMW, Mercedes-Benz, Audi, Jaguar, Land Rover, Volvo',
      multiplier: 2.60,
    },
  },
  bike: {
    entry_commuter: {
      id: 'entry_commuter',
      label: 'Entry Commuter (< 110cc)',
      description: 'Splendor, HF Deluxe, Platina, Passion, CT100, XL100',
      multiplier: 0.80,
    },
    standard_scooter: {
      id: 'standard_scooter',
      label: 'Standard Scooter / 110-125cc',
      description: 'Activa, Jupiter, Access, Dio, Shine, RayZR, Fascino',
      multiplier: 1.0,
    },
    performance_street: {
      id: 'performance_street',
      label: 'Performance Street (150-250cc)',
      description: 'Pulsar 150/200, Apache RTR, Yamaha FZ, MT-15, R15, Gixxer',
      multiplier: 1.25,
    },
    cruiser_tourer: {
      id: 'cruiser_tourer',
      label: 'Cruiser & Adventure (350-500cc)',
      description: 'Royal Enfield Classic 350, Bullet, Hunter, Meteor, Himalayan, Jawa, CB350',
      multiplier: 1.50,
    },
    superbike: {
      id: 'superbike',
      label: 'Premium & Superbike (600cc+)',
      description: 'KTM Duke 390, Kawasaki Ninja, Harley-Davidson, Triumph, Ducati',
      multiplier: 2.20,
    },
  },
};

// Fuel Type Multipliers
export const FUEL_CONFIG = {
  petrol: { label: 'Petrol', multiplier: 1.0 },
  diesel: { label: 'Diesel', multiplier: 1.18 },
  cng: { label: 'CNG', multiplier: 1.08 },
  electric: { label: 'Electric', multiplier: 0.85 },
};

// Backwards-compatibility object
export const PRICING_CONFIG = {
  categories: {
    car: {
      hatchback: { label: 'Hatchback', multiplier: 1.0 },
      sedan: { label: 'Sedan', multiplier: 1.25 },
      suv: { label: 'SUV / MUV', multiplier: 1.5 },
    },
    bike: {
      commuter: { label: 'Commuter (< 160cc)', multiplier: 1.0 },
      sports: { label: 'Sports / Cruiser (160cc+)', multiplier: 1.35 },
    },
  },
  fuels: FUEL_CONFIG,
};

// ============================================================================
// SMART MODEL RECOGNITION HELPER
// Automatically detects model tier from brand/model names if not explicitly set
// ============================================================================
export function detectModelTier(vehicleType, brand = '', model = '') {
  const query = `${brand} ${model}`.toLowerCase();

  if (vehicleType === 'bike') {
    if (query.match(/ninja|duke|rc390|harley|triumph|ducati|hayabusa|superbike|bmw/)) {
      return 'superbike';
    }
    if (query.match(/classic|bullet|hunter|meteor|himalayan|jawa|yezdi|cb350|interceptor|continental|royal enfield|re /)) {
      return 'cruiser_tourer';
    }
    if (query.match(/pulsar|apache|rtr|fz|mt-15|mt15|r15|gixxer|hornet|ns200|rs200|duke 200|xpulse/)) {
      return 'performance_street';
    }
    if (query.match(/splendor|hf deluxe|platina|passion|ct100|ct 100|xl100|shine 100|tvs sport/)) {
      return 'entry_commuter';
    }
    return 'standard_scooter';
  }

  // Car model detection
  if (query.match(/bmw|mercedes|audi|jaguar|land rover|range rover|volvo|porsche|lexus/)) {
    return 'luxury';
  }
  if (query.match(/fortuner|endeavour|xuv700|xuv 700|safari|harrier|gloster|alturas/)) {
    return 'full_suv';
  }
  if (query.match(/creta|seltos|grand vitara|hyryder|scorpio|taigun|kushaq|astor|thar|compass|duster|alcazar/)) {
    return 'mid_suv';
  }
  if (query.match(/brezza|nexon|venue|sonet|punch|magnite|kiger|fronx|wr-v|wrv|exter/)) {
    return 'compact_suv';
  }
  if (query.match(/city|verna|ciaz|slavia|virtus|civic|octavia|corolla|elantra/)) {
    return 'executive_sedan';
  }
  if (query.match(/dzire|amaze|aura|tigor|etios/)) {
    return 'compact_sedan';
  }
  if (query.match(/alto|kwid|wagonr|wagon r|celerio|santro|s-presso|spresso|eon|nano/)) {
    return 'entry_hatch';
  }

  // Default standard hatchback
  return 'premium_hatch';
}

// ============================================================================
// CALCULATE SERVICE PRICE
// Supports: calculateServicePrice(basePrice, vehicle) or multi-param signatures
// ============================================================================
export function calculateServicePrice(
  basePrice,
  vehicleOrType,
  categoryKey,
  fuelKey,
  modelTierParam
) {
  let type = 'car';
  let fuel = 'petrol';
  let tierKey = 'premium_hatch';

  if (typeof vehicleOrType === 'object' && vehicleOrType !== null) {
    // Passed whole vehicle object
    type = vehicleOrType.type || 'car';
    fuel = vehicleOrType.fuel || 'petrol';
    tierKey =
      vehicleOrType.modelTier ||
      detectModelTier(type, vehicleOrType.brand, vehicleOrType.model);
  } else {
    // Multi-arg signature
    type = vehicleOrType || 'car';
    fuel = fuelKey || 'petrol';
    tierKey = modelTierParam || categoryKey || 'premium_hatch';

    // If tierKey matches old category keys, map them
    if (tierKey === 'hatchback') tierKey = 'premium_hatch';
    if (tierKey === 'sedan') tierKey = 'executive_sedan';
    if (tierKey === 'suv') tierKey = 'mid_suv';
    if (tierKey === 'commuter') tierKey = 'standard_scooter';
    if (tierKey === 'sports') tierKey = 'cruiser_tourer';
  }

  const tiersForType = MODEL_TIERS[type] || MODEL_TIERS.car;
  const tierConfig = tiersForType[tierKey] || Object.values(tiersForType)[0];
  const modelMultiplier = tierConfig?.multiplier || 1.0;

  const fuelMultiplier = FUEL_CONFIG[fuel]?.multiplier || 1.0;

  const raw = basePrice * modelMultiplier * fuelMultiplier;
  return Math.round(raw / 10) * 10; // Clean rounded Indian Rupee
}

// Get the display label for a vehicle's model tier
export function getVehicleModelTierInfo(vehicle) {
  if (!vehicle) return { label: 'Standard', multiplier: 1.0, description: '' };
  const type = vehicle.type || 'car';
  const tierKey = vehicle.modelTier || detectModelTier(type, vehicle.brand, vehicle.model);
  const tiersForType = MODEL_TIERS[type] || MODEL_TIERS.car;
  return tiersForType[tierKey] || { label: 'Standard', multiplier: 1.0, description: '' };
}

// ============================================================================
// SERVICE CATALOG: CARS
// ============================================================================
export const CAR_SERVICES = [
  {
    id: 'car-std-periodic',
    vehicleType: 'car',
    category: 'periodic',
    categoryName: 'Periodic Maintenance',
    name: 'Comprehensive Periodic Service',
    badge: 'Popular',
    shortDesc: 'Engine lube, complete filter replacements, brake inspection & 40-point safety check.',
    basePrice: 2850,
    durationHours: 3.5,
    recommendedKm: 'Every 10,000 km or 1 year',
    inclusions: [
      'Engine oil replacement (Model & fuel calibrated grade)',
      'OEM oil filter replacement',
      'Air filter cleaning & check',
      'Brake pad wear & fluid level inspection',
      'Battery voltage & electrical test',
      'Coolant & wiper wash top-up',
    ],
  },
  {
    id: 'car-major-annual',
    vehicleType: 'car',
    category: 'periodic',
    categoryName: 'Periodic Maintenance',
    name: 'Major Annual Overhaul Service',
    badge: 'Comprehensive',
    shortDesc: 'Complete fluids flush, cabin AC microfilter, throttle body de-carbonizing & computerized scan.',
    basePrice: 4600,
    durationHours: 5.0,
    recommendedKm: 'Every 20,000 km or 2 years',
    inclusions: [
      'Full synthetic oil replacement',
      'Oil + Air + Cabin AC filter new OEM replacement',
      'Brake fluid hydraulic flush & bleed',
      'Coolant complete drain & refill',
      'OBD-II diagnostic trouble code scan',
      'Complimentary exterior wash & interior vacuum',
    ],
  },
  {
    id: 'car-brakes-front',
    vehicleType: 'car',
    category: 'brakes',
    categoryName: 'Brakes & Suspension',
    name: 'Front Brake Pads & Rotor Refacing',
    badge: 'OEM Spec',
    shortDesc: 'Precision replacement of front disc pads, caliper pin greasing and rotor polishing.',
    basePrice: 1950,
    durationHours: 2.0,
    recommendedKm: 'When pad thickness < 3mm',
    inclusions: [
      'OEM-grade front ceramic/metallic brake pad set',
      'Caliper sliding pin cleaning & silicone lube',
      'Disc rotor surface de-glazing',
      'Brake hydraulic pressure check',
    ],
  },
  {
    id: 'car-ac-service',
    vehicleType: 'car',
    category: 'ac',
    categoryName: 'AC & Climate',
    name: 'Complete AC Service & Gas Refill',
    badge: 'Cooling',
    shortDesc: 'Cooling coil cleaning, compressor oil top-up, R134a refrigerant evacuation & refill.',
    basePrice: 2200,
    durationHours: 2.5,
    recommendedKm: 'Annually before summer',
    inclusions: [
      'Condenser coil power chemical wash',
      'High/Low pressure line vacuum leak detection',
      'Pure R134a refrigerant gas refill',
      'Compressor synthetic lubricant oil top-up',
    ],
  },
  {
    id: 'car-wheel-alignment',
    vehicleType: 'car',
    category: 'tyres',
    categoryName: 'Tyres & Alignment',
    name: '3D Laser Wheel Alignment & Balancing',
    badge: 'Smooth Drive',
    shortDesc: '3D laser alignment for 4 wheels, computerized lead balancing and tyre rotation.',
    basePrice: 750,
    durationHours: 1.5,
    recommendedKm: 'Every 5,000 km',
    inclusions: [
      '3D laser camber, caster & toe alignment',
      'Dynamic high-speed computerized balancing',
      'Precision counter-weights included',
      '4-tyre cross rotation & nitrogen pressure check',
    ],
  },
  {
    id: 'car-interior-spa',
    vehicleType: 'car',
    category: 'detailing',
    categoryName: 'Detailing & Spa',
    name: 'Deep Interior Foam Spa & Sanitization',
    badge: 'Deep Clean',
    shortDesc: 'Extraction shampoo on all seats, carpet stain removal, dashboard UV treatment.',
    basePrice: 1750,
    durationHours: 3.0,
    recommendedKm: 'Every 6 months',
    inclusions: [
      'Wet extraction foam shampoo on all seats & door trims',
      'Deep carpet vacuuming & stain removal',
      'Dashboard & console UV matte dressing',
      'AC vent antibacterial steam disinfection',
    ],
  },
];

// ============================================================================
// SERVICE CATALOG: BIKES / MOTORCYCLES / SCOOTERS
// ============================================================================
export const BIKE_SERVICES = [
  {
    id: 'bike-std-service',
    vehicleType: 'bike',
    category: 'periodic',
    categoryName: 'Periodic Maintenance',
    name: 'General Service & Engine Oil Flush',
    badge: 'Popular',
    shortDesc: 'Premium 4T engine oil replacement, oil filter, spark plug cleaning, carburetor/FI tuning.',
    basePrice: 650,
    durationHours: 2.0,
    recommendedKm: 'Every 3,000 - 4,000 km',
    inclusions: [
      '4T Semi-Synthetic / Full-Synthetic engine oil change',
      'OEM oil filter replacement',
      'Spark plug cleaning and electrode gap calibration',
      'Air filter cleaning & box degreasing',
      'Clutch free-play adjustment and cable lubrication',
      'Brake shoe/pad inspection & cleaning',
    ],
  },
  {
    id: 'bike-chain-service',
    vehicleType: 'bike',
    category: 'drivetrain',
    categoryName: 'Drivetrain & Chain',
    name: 'Chain Deep Cleaning, Tensioning & Lube',
    badge: 'Essential',
    shortDesc: 'Kerosene/biodegradable chain soak, brush degreasing, slack adjustment, high-temp lube.',
    basePrice: 350,
    durationHours: 1.0,
    recommendedKm: 'Every 500 - 1,000 km',
    inclusions: [
      'O-ring / X-ring chain solvent degreasing',
      'Front counter-shaft sprocket cover debris removal',
      'Precision chain slack tension adjustment (25-30mm)',
      'Heavy-duty high-speed chain lube application',
    ],
  },
  {
    id: 'bike-brakes-front-rear',
    vehicleType: 'bike',
    category: 'brakes',
    categoryName: 'Brakes & Suspension',
    name: 'Front & Rear Disc Pad Replacement',
    badge: 'OEM Grade',
    shortDesc: 'Replacement of disc brake pads, caliper slide pin greasing, disc surface degreasing.',
    basePrice: 550,
    durationHours: 1.5,
    recommendedKm: 'When friction material is < 2mm',
    inclusions: [
      'OEM sintered/organic brake pads installation',
      'Caliper piston cleaning and fluid seal inspection',
      'Brake fluid level inspection & top-up',
      'Lever stroke and bite-point calibration',
    ],
  },
  {
    id: 'bike-fork-overhaul',
    vehicleType: 'bike',
    category: 'brakes',
    categoryName: 'Brakes & Suspension',
    name: 'Front Fork Oil Replacement & Seal Service',
    badge: 'Suspension',
    shortDesc: 'Draining old contaminated fork fluid, replacing damaged oil seals and refilling fork oil.',
    basePrice: 950,
    durationHours: 2.5,
    recommendedKm: 'Every 15,000 km or upon fork oil leak',
    inclusions: [
      'Front fork stanchion disassembly & inspection',
      'Dual fork oil seals replacement',
      'Graded hydraulic fork oil refill per OEM spec',
      'Steering cone ball-bearing greasing and adjustment',
    ],
  },
  {
    id: 'bike-wash-polish',
    vehicleType: 'bike',
    category: 'detailing',
    categoryName: 'Detailing & Spa',
    name: 'Snow Foam Wash & Teflon Gloss Coating',
    badge: 'Shine',
    shortDesc: 'Pressure foam shampoo, wheel and engine fin degreasing, chain wash, and body Teflon polish.',
    basePrice: 380,
    durationHours: 1.5,
    recommendedKm: 'Monthly',
    inclusions: [
      'pH-balanced snow foam high-pressure pre-wash',
      'Engine fin and under-cowl grease removal',
      'Alloy wheel brake dust decontamination',
      'Teflon protective gloss coat on tank and painted fairings',
    ],
  },
];

// ============================================================================
// AUTOMATIC EXTRA-WORK FINDING TEMPLATES (Inspection Stage)
// ============================================================================

export const EXTRA_WORK_TEMPLATES = {
  car: {
    reason: 'Front Brake Pads Worn (85% Thin - 2.1mm remaining)',
    component: 'Braking System',
    description: 'Bay technician measured front brake pad lining at 2.1mm. High safety risk of rotor scoring during highway deceleration.',
    price: 1450,
    photoPlaceholder: {
      type: 'car_brake_pad',
      caption: 'Front right brake caliper assembly showing friction lining worn down near backplate.',
      label: 'CAR INSPECTION PHOTO',
    },
  },
  bike: {
    reason: 'Drive Chain Excessive Slack & Sprocket Hooking',
    component: 'Drive Chain Assembly',
    description: 'Technician measured 45mm vertical chain play with uneven link binding and worn rear sprocket teeth.',
    price: 680,
    photoPlaceholder: {
      type: 'bike_chain',
      caption: 'Rear wheel drive sprocket showing hooked teeth profile and link slack.',
      label: 'BIKE INSPECTION PHOTO',
    },
  },
};
