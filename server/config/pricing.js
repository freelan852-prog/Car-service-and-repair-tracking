/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Single source of truth for services, pricing multipliers, and stages
export const STAGE_INTERVAL_SECONDS = 15;

export const TRACKER_STAGES = [
  'Booked',
  'Vehicle received',
  'Inspection',
  'In progress',
  'Ready',
  'Delivered',
];

export const PRICING_TABLE = {
  // Vehicle segment multipliers
  segments: {
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

  // Fuel type multipliers
  fuels: {
    petrol: { label: 'Petrol', multiplier: 1.0 },
    diesel: { label: 'Diesel', multiplier: 1.18 },
    cng: { label: 'CNG', multiplier: 1.08 },
    electric: { label: 'Electric', multiplier: 0.85 },
  },

  // Base service packages for Cars
  carServices: [
    {
      id: 'car-std-periodic',
      category: 'periodic',
      categoryName: 'Periodic Maintenance',
      name: 'Comprehensive Periodic Service',
      badge: 'Popular',
      shortDesc: 'Engine lube, complete filter replacements, brake inspection & 40-point safety check.',
      basePrice: 2850,
      durationHours: 3.5,
      recommendedKm: 'Every 10,000 km or 1 year',
      inclusions: [
        'Engine oil replacement (Synthetic grade)',
        'OEM oil filter replacement',
        'Air filter cleaning & check',
        'Brake pad wear & fluid level inspection',
        'Battery voltage & electrical test',
        'Coolant & wiper wash top-up',
      ],
    },
    {
      id: 'car-major-annual',
      category: 'periodic',
      categoryName: 'Periodic Maintenance',
      name: 'Major Annual Overhaul Service',
      badge: 'Comprehensive',
      shortDesc: 'Complete fluids flush, cabin AC microfilter, throttle body de-carbonizing & scan.',
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
  ],

  // Base service packages for Bikes
  bikeServices: [
    {
      id: 'bike-std-service',
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
  ],

  // Extra-work finding templates for the inspection phase
  extraWorkTemplates: {
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
  },
};

/**
 * Calculates service price on the server.
 * The server is the ONLY source of truth.
 */
export function calculatePrice(basePrice, vehicleType, segment, fuel) {
  const typeKey = vehicleType === 'bike' ? 'bike' : 'car';
  const segMap = PRICING_TABLE.segments[typeKey] || PRICING_TABLE.segments.car;
  const segMult = segMap[segment]?.multiplier || 1.0;
  const fuelMult = PRICING_TABLE.fuels[fuel]?.multiplier || 1.0;

  const raw = basePrice * segMult * fuelMult;
  return Math.round(raw / 10) * 10;
}

/**
 * Returns service list with prices calculated for the given vehicle
 */
export function getServicesForVehicle(vehicle) {
  const isBike = vehicle.type === 'bike';
  const catalog = isBike ? PRICING_TABLE.bikeServices : PRICING_TABLE.carServices;

  return catalog.map((srv) => {
    const price = calculatePrice(srv.basePrice, vehicle.type, vehicle.segment, vehicle.fuel);
    return {
      ...srv,
      calculatedPrice: price,
      vehicleId: vehicle._id ? vehicle._id.toString() : vehicle.id,
    };
  });
}
