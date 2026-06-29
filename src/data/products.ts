export interface Product {
  id: string;
  name: string;
  categories: ('blood-bank' | 'laboratory' | 'cryogenic-accessories')[];
  categoryLabel: string;
  tagline: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  imageUrl: string;
  imagePlaceholder: string; // fallback if no real image
  brochureUrl: string;
  aspectRatio?: string; // e.g. "1823/2560" for exact width/height matching
}

export const products: Product[] = [
  // --- LABORATORY ---
  {
    id: "newgen-ultra-low-freezer",
    name: "newGen Ultra Low Temperature Freezer (-86°C)",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "Integrated 10\" touchscreen control panel & VIP PUF insulated ultra low temperature freezer with dual-compressor architecture",
    description: "Our newGen series represents the pinnacle of sample safety and performance at -86°C. Features dual-compressor cascade refrigeration, an integrated 10\" touchscreen control panel, real-time temperature graphing, and robust security access controls.",
    features: [
      "10\" interactive touchscreen control panel for intuitive monitoring, data logging, and password protection",
      "Dual-compressor architecture for ultimate cooling redundancy and rapid pull-down",
      "Energy-optimized design with high-density polyurethane (PUF) insulation",
      "Comprehensive safety alarms (High/Low Temp, Door Ajar, Power Failure, Sensor Failure)",
      "Integrated USB data export for temperature logs and system diagnostic reports"
    ],
    specs: {
      "Model Range": "URC-V-380-4 (400L) to URC-V-1000-4 (1000L)",
      "Temperature Range": "-50°C to -86°C",
      "Control System": "Touchscreen controller with real-time graphing",
      "Capacity Options": "400L, 520L, 670L, 770L, 850L, and 1000L models",
      "Insulation": "VIP (Vacuum Insulation Panel) + high-density PUF",
      "Refrigeration": "Dual compressor cascade system (Eco-friendly refrigerants)",
      "Power Consumption": "10 to 13 kWh/Day depending on model",
      "Safety Features": "Adjustable delay restart, door lock, audio-visual alarms, battery backup"
    },
    imageUrl: "/product logo/new_gen_ultra_-86.png",
    imagePlaceholder: "newGen Ultra Low Freezer",
    brochureUrl: "https://drive.google.com/file/d/1JNy-5Js6p2NpXr0Sd5d5aMlKwpkgde0k/view?usp=drive_link",
    aspectRatio: "1823/2560"
  },
  {
    id: "standard-ultra-low-freezer",
    name: "Ultra Low Temperature Freezer (-86°C) Standard Series",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "Engineered for reliable performance, precise temperature control, and long-term preservation of valuable biological samples",
    description: "Our Standard Series -86°C Freezers deliver robust, dependable sample preservation. Equipped with energy-optimized refrigeration systems, advanced microprocessor controllers, and high-security alarms.",
    features: [
      "Microprocessor control system for precise temperature monitoring and alarms",
      "Consistent -86°C temperature control for maximum sample protection",
      "Energy-optimized cooling system for lower system consumption",
      "Robust cabinet construction with premium components for long-term reliability",
      "CE Marked & ISO 9001:2015 certified for global standards"
    ],
    specs: {
      "Model Range": "URC-V-100-4 (105L) to URC-V-1000-4 (938L)",
      "Temperature Range": "Down to -86°C",
      "Control System": "Microprocessor control with Digital LED display",
      "Capacity Options": "105L, 158L, 210L, 328L, 400L, 550L, 638L, 750L, and 938L models",
      "Gaskets": "Durable magnetic gaskets for excellent sealing",
      "Certification": "CE Marked & ISO 9001:2015"
    },
    imageUrl: "/product logo/ultra_low_freezer_standard_series.png",
    imagePlaceholder: "Ultra Low Freezer Standard Series",
    brochureUrl: "https://drive.google.com/file/d/1vh7hFuiKy2p38acDqudB3EO1DkHEhdnS/view?usp=drive_link",
    aspectRatio: "1707/2560"
  },
  {
    id: "plasma-freezer",
    name: "Deep Freezer / Plasma Freezer (-40°C)",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "Reliable deep freezing for plasma and clinical specimens",
    description: "Designed specifically for the storage of fresh frozen plasma, biological samples, and enzymes in clinical and medical environments.",
    features: [
      "Inner cabinet and adjustable shelves made of high-quality Stainless Steel SS304",
      "High density CFC-free, Eco-friendly PUF insulation for maximum thermal retention",
      "Heavy duty hermetically sealed air cooled compressor (60% to 70% run time)",
      "Microprocessor control with digital LED display and PT100/NTC sensors",
      "Audio-visual alerts for temperature deviations and time delay restart protection"
    ],
    specs: {
      "Model Range": "URC-V-100-2 (80L) to URC-V-1000-2 (938L)",
      "Temperature Range": "Down to -40°C",
      "Control Accuracy": "0.1°C / 1.0°C setting accuracy",
      "Chamber Material": "Stainless Steel SS-304",
      "Insulation": "Eco-friendly high-density PUF",
      "Cabinet Exterior": "Powder coated CRCA sheet (corrosion resistive)",
      "Refrigeration Type": "Energy-efficient, low-noise air cooled system"
    },
    imageUrl: "/product logo/Deep_Freezer.png",
    imagePlaceholder: "Plasma Freezer",
    brochureUrl: "https://drive.google.com/file/d/1cRhJcXY8hV9xISOJ_I4Q3FI_1j5JGo1_/view?usp=drive_link"
  },
  {
    id: "low-freezer-single-door",
    name: "Low Freezer (-20°C) - Single Door (Blue Door)",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "Compact and efficient single-door low temperature freezer",
    description: "Ideal for routine laboratory sample storage, pharmaceutical preservation, and enzyme storage at stable temperatures from -10°C to -25°C.",
    features: [
      "Energy efficient, eco-friendly refrigerant refrigeration system",
      "Microprocessor based control with digital temperature setting",
      "Stainless steel interior cabinet and shelves for hygienic durability",
      "Audio-visual alarm for temperature deviations",
      "Built-in automatic voltage stabilizer with high/low cutoff and MCB protection"
    ],
    specs: {
      "Model Range": "URC-V-500-1 (500L) & URC-V-650-1 (650L)",
      "Temperature Range": "-10°C to -25°C",
      "Temperature Uniformity": "±2°C",
      "Control Accuracy": "0.1°C setting accuracy",
      "Chamber Material": "Stainless Steel SS-304",
      "Voltage Stabilizer": "Built-in with time delay restart"
    },
    imageUrl: "/product logo/low blue door.png",
    imagePlaceholder: "Low Freezer Single Door",
    brochureUrl: "https://drive.google.com/file/d/1IR5cUWMm2Pc922DOkdo8u-ZTOKV6Fw_z/view?usp=drive_link"
  },
  {
    id: "low-freezer-double-door",
    name: "Low Freezer (-20°C) - Double Door",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "High-capacity double-door low temperature freezer",
    description: "Designed for larger laboratories and clinical facilities requiring frequent access and large volume storage of frozen materials at -15°C to -20°C.",
    features: [
      "Self-closing double doors with magnetic gasket to minimize cooling loss",
      "Static cooling system using eco-friendly R-134a refrigerant",
      "Durable Stainless Steel SS-304 inner cabinet and adjustable shelves",
      "Microprocessor based controller with digital LED temperature display",
      "Built-in automatic voltage stabilizer with high/low cutoff and MCB protection"
    ],
    specs: {
      "Model": "URC-V-500-1 (Double Door)",
      "Capacity": "500 Litres",
      "Temperature Range": "-15°C to -20°C",
      "Input Power": "450 W",
      "Dimensions (W*D*H)": "620 * 775 * 1940 mm (Exterior)",
      "Net Weight": "101 KG",
      "Cabinet Material": "Stainless Steel SS-304"
    },
    imageUrl: "/product logo/lowdouble.png",
    imagePlaceholder: "Low Freezer Double Door",
    brochureUrl: "https://drive.google.com/file/d/1WT60dnXCKC1KgdfxP9OeXQHOlZyWVGDQ/view?usp=drive_link"
  },
  {
    id: "lab-pharma-refrigerator",
    name: "Laboratory Refrigerator (+2°C to +8°C)",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "High-precision laboratory and chromatography storage",
    description: "Designed for storing vaccines, pharmacy reagents, and chromatography samples under strict temperature-controlled (+2°C to +8°C) environments.",
    features: [
      "Double-glazed tempered glass door with secure key lock",
      "No-frost, fan-assisted cooling system with self-evaporating drip tray",
      "Microprocessor control, LED display, and PT100/NTC thermistor sensor",
      "Inner cabinet options of White epoxy painted steel or Stainless Steel SS304/SS316",
      "Built-in audio-visual alarms for temperature deviations"
    ],
    specs: {
      "Model Range": "FRC-V-300, FRC-V-500, FRC-V-1000, FRC-V-1500",
      "Net Volume": "300L, 500L, 1000L, and 1500L options",
      "Temperature Range": "+2°C to +8°C",
      "Power Consumption": "2.0 to 7.5 kWh/Day depending on model",
      "Cabinet Exterior": "Powder coated CRCA sheet",
      "Refrigeration": "Non-CFC/HCFC hermetic system with PUF insulation"
    },
    imageUrl: "/product logo/Lab_Refri.jpg",
    imagePlaceholder: "Lab Pharma Refrigerator",
    brochureUrl: "https://drive.google.com/file/d/1ESYrMHmGJIscA65Uf5OuJeiGqyOKdkca/view?usp=drive_link"
  },
  {
    id: "blood-bank-refrigerator",
    name: "Blood Bag Refrigerator",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "Strict temperature-controlled blood storage with weekly chart recorders",
    description: "Specifically engineered to meet strict blood preservation requirements. Features no-frost positive forced air circulation, full-length interior lighting, and built-in circular 7-day temperature chart recorders.",
    features: [
      "Microprocessor based digital temperature controller with battery backup",
      "Circular weekly (7-day) chart recorder for permanent record of storage conditions",
      "Durable pre-coated galvanised outer sheets and SS 304 non-rusting interior",
      "Fully extendable SS drawers with dividers for organized blood bag storage",
      "Low noise, hermetically sealed compressor with eco-friendly R-290 refrigerant"
    ],
    specs: {
      "Model Range": "BBR-60, BBR-160, BBR-300, BBR-600",
      "Storage Capacity": "60, 160, 300, and 600 bag models",
      "Number of Trays": "3, 4, 5, or 10 drawers depending on model",
      "Temperature Range": "2°C to 6°C (±0.5°C accuracy)",
      "Safety Alarms": "High/Low Temp, Power Failure, Door Open",
      "Electrical Input": "220/240 V, 50 Hz, power cord & plug"
    },
    imageUrl: "/product logo/BBR.png",
    imagePlaceholder: "Blood Bag Refrigerator",
    brochureUrl: "https://drive.google.com/file/d/1oh1G9HCAfL6EGgdxsLmhggMUzNmvMKyh/view?usp=drive_link"
  },
  {
    id: "ice-lined-refrigerator",
    name: "Ice Lined Refrigerator",
    categories: ["laboratory"],
    categoryLabel: "Laboratory",
    tagline: "Extended cold holdover under power outage conditions",
    description: "Utilizes triple wall construction and gel pack technology to maintain safe temperature zones (+2°C to +8°C) for over 27 hours during power outages. Ideal for vaccines and blood products.",
    features: [
      "Triple Wall Construction with 110 mm PUF insulation for maximum thermal efficiency",
      "Maintains safe temperature storage for over 27 hours in power cuts",
      "High grade Stainless Steel SS 304 inner chamber for durability and hygiene",
      "Eco-friendly R-290 refrigerant with hermetically sealed low-maintenance compressor",
      "Microprocessor controller with digital LED display and audio-visual alarms"
    ],
    specs: {
      "Model Range": "ILR-150 (150L) & ILR-300 (275L)",
      "Temperature Range": "+2°C to +8°C",
      "Insulation Thickness": "110 mm Polyurethane Foam (PUF)",
      "Chamber Material": "Stainless Steel SS-304",
      "Holdover Backup": "27+ Hours",
      "Electrical Rating": "10 Amps, 230 V, 1 Phase, 50 Hz"
    },
    imageUrl: "/product logo/ILR.jpg",
    imagePlaceholder: "Ice Lined Refrigerator",
    brochureUrl: "https://drive.google.com/file/d/1yOWQuT-UVI9ZIpuQIRMnH0YRBvoHEedV/view?usp=drive_link"
  },

  // --- BLOOD BANK ---
  {
    id: "plasma-thawing-bath",
    name: "Plasma Thawing Bath",
    categories: ["blood-bank"],
    categoryLabel: "Blood Bank",
    tagline: "Suitable for rapid thawing of frozen plasma bags upto a temperature of 37°C",
    description: "Designed for rapid, safe thawing of fresh frozen plasma bags. Features a noiseless circulation pump, SS 304 basket, and microprocessor temperature regulation preset at 37°C.",
    features: [
      "Microprocessor based control system with digital LED display of temperature",
      "Audio-visual alarm for temperature deviation and end of cycle timer alarm",
      "Stainless steel SS 304 interior with rounded corners and powder coated CRCA exterior",
      "Tullu noiseless pump for deep thawing and uniform circulation of water",
      "1000W immersion heater and SS 304 Ball Valve (1/2\") for fast draining"
    ],
    specs: {
      "Model": "SAFE thaw",
      "Thawing Capacity": "Up to 12 plasma bags",
      "Temperature Preset": "37°C (rapid thawing range)",
      "Chamber Material": "Stainless Steel SS-304",
      "Internal Dimensions": "460 * 320 * 250 mm (L*W*H)",
      "External Dimensions": "810 * 410 * 350 mm (L*W*H)",
      "Power Rating": "15 Amps, 230 V, 1 Phase, 50 Hz"
    },
    imageUrl: "/product logo/plasma_thaw.jpg",
    imagePlaceholder: "Plasma Thawing Bath",
    brochureUrl: "https://drive.google.com/file/d/1D2m_YHjiWifGwl0CWQ0Z6rjcn4y3I-y_/view?usp=drive_link"
  },
  {
    id: "cold-trap",
    name: "Ultra-low temperature Cold Trap (ULCT-80)",
    categories: ["blood-bank"],
    categoryLabel: "Blood Bank",
    tagline: "Microprocessor-based Ultra Low Temperature Cold Trap",
    description: "Protects vacuum systems and pumps by effectively condensing and trapping chemical or moisture vapors at extreme temperatures down to -80°C.",
    features: [
      "Achieves ultra-low trapping temperatures down to -80°C",
      "Microprocessor-based controller with high-definition LCD display",
      "Dual compressor refrigeration system (1470W) with eco-friendly R404A & R503",
      "High-efficiency air-cooling condenser with 8 m² heat exchange area",
      "化学耐性のある pagoda joint connection with Φ12mm outer diameter"
    ],
    specs: {
      "Model": "ULCT-80",
      "Temperature Range": "-80°C to Room Temperature",
      "Control Accuracy": "±0.1°C",
      "Total Power": "1662W",
      "Water Tank Volume": "6.8 Litres (Φ200 * 180H mm)",
      "Sensor Type": "PT100",
      "Net Weight": "104 KG"
    },
    imageUrl: "/product logo/ultc1.png",
    imagePlaceholder: "Cold Trap",
    brochureUrl: "https://drive.google.com/file/d/1DcaE3GBpaJnTgNyCxgu2MdDpX88APT6o/view?usp=drive_link"
  },
  {
    id: "sub-zero-chiller-bath",
    name: "Sub-Zero Circulation Chiller Bath (SZCCB-20)",
    categories: ["blood-bank"],
    categoryLabel: "Blood Bank",
    tagline: "High Precision Temperature Control for Laboratory & Industrial Cooling",
    description: "Provides highly stable sub-zero cooling fluids down to -20°C for reactors, distillation systems, incubation studies, and analytical equipment.",
    features: [
      "Precise temperature control from -20°C to Ambient with ±0.1°C accuracy",
      "High capacity 165W circulation pump with 50 L/min flow rate",
      "Eco-friendly R404A refrigerant system with heavy duty 1300W compressor",
      "Microprocessor based controller with digital LED display and PT100 sensor",
      "Triple safety protections: Delay restart, over-current, and overheating"
    ],
    specs: {
      "Model": "SZCCB-20",
      "Temperature Range": "-20°C to Ambient",
      "Control Accuracy": "±0.1°C",
      "Bath Capacity": "24 Litres (300 * 200 * 400 mm)",
      "Pump Lift / Flow": "4-6 Meters / 50 L/min",
      "Total Power": "2000W / 220V 50Hz",
      "Dimensions": "650 * 500 * 1100 mm",
      "Net Weight": "95 KG"
    },
    imageUrl: "/product logo/sub_zero.png",
    imagePlaceholder: "Sub-Zero Chiller Bath",
    brochureUrl: "https://drive.google.com/file/d/1fVy6etdERAE7uHMXST-SnBpBpIqaehxs/view?usp=drive_link"
  },
  {
    id: "heating-cooling-circulator",
    name: "Heating and Cooling Circulator (HCC-40)",
    categories: ["blood-bank"],
    categoryLabel: "Blood Bank",
    tagline: "Precise Dynamic Temperature Control System (-40°C to +200°C)",
    description: "Advanced heating and cooling circulator designed to deliver highly stable temperature controls for reactors, double-walled vessels, calibration systems, and demanding laboratory or industrial processes.",
    features: [
      "Precise temperature control from -40°C to +200°C with ±0.1°C accuracy",
      "Reliable high-capacity circulation pump (up to 40L/min flow) for uniform heat distribution",
      "Multi-tier safety protection: Delay, over-current, overheating, phase sequence, and phase loss protection",
      "Eco-friendly CFC & HCFC free R404A refrigerant system",
      "High-resolution LCD display with intuitive keypad for easy configuration"
    ],
    specs: {
      "Model": "HCC-40",
      "Temperature Range": "-40°C to +200°C",
      "Control Accuracy": "±0.1°C",
      "Sensor Type": "PT100",
      "Heating Power": "2000W",
      "Total Power": "2835W",
      "Compressor Power": "735W (Eco R404A)",
      "Pump Lift / Flow": "4-6M / 20-40 L/min",
      "Fluid Interface": "3/4\" interface with 2m metal pipes",
      "Fluid Type": "Grade A silicone oil",
      "Dimensions (W*D*H)": "630 * 550 * 1060 mm",
      "Net Weight": "80 KG"
    },
    imageUrl: "/product logo/he&co.png",
    imagePlaceholder: "Heating Cooling Circulator",
    brochureUrl: "https://drive.google.com/file/d/1uQAM3LUCazVVNvKj6L3wPA_kqFRzSzDi/view?usp=sharing"
  },


  // --- CRYOGENIC ACCESSORIES ---
  {
    id: "temp-data-loggers",
    name: "Temperature Data Loggers – Single and Multi-channels",
    categories: ["cryogenic-accessories"],
    categoryLabel: "Cryogenic accessories",
    tagline: "Highly accurate cold chain temperature logs and records",
    description: "Digital data loggers designed for continuous temperature measurement and recording during medical transit and lab storage.",
    features: [
      "Supports single or multiple external probe connections",
      "Automated PDF/Excel report generation upon USB connection",
      "Compact design with long battery life",
      "Visual warning indicators for temperature breaches"
    ],
    specs: {
      "Measurement Range": "-100°C to +150°C",
      "Memory Capacity": "Up to 100,000 readings",
      "Accuracy": "±0.2°C",
      "Channels": "1, 2, 4, or 8 channels"
    },
    imageUrl: "/product logo/temp_data_logger.jpg",
    imagePlaceholder: "Data Logger",
    brochureUrl: "/brochures/data-logger.pdf"
  },
  {
    id: "iot-realtime-monitors",
    name: "IoT Realtime Monitors",
    categories: ["cryogenic-accessories"],
    categoryLabel: "Cryogenic accessories",
    tagline: "Cloud-connected 24/7 wireless temperature monitoring",
    description: "Real-time IoT sensors that push temperature, humidity, and power status parameters directly to mobile apps and secure cloud dashboards.",
    features: [
      "Wireless cellular or Wi-Fi connectivity for constant data transmission",
      "SMS, Email, and Push Notification alerts in case of thresholds breach",
      "Battery backup protects data logs during power failures",
      "Cloud platform compliance with regulatory validation logs"
    ],
    specs: {
      "Connectivity": "Wi-Fi / 4G LTE / LoRaWAN",
      "Sensor Range": "-200°C to +200°C (Pt100 RTD sensor)",
      "Alert Channels": "Siren, SMS, E-Mail, App Alert",
      "Power Source": "AC Adapter with Rechargeable Li-Ion backup"
    },
    imageUrl: "/product logo/data_logger.jpeg",
    imagePlaceholder: "IoT Monitor",
    brochureUrl: "/brochures/iot-monitor.pdf"
  },
  {
    id: "temperature-recorders",
    name: "Temperature Recorders",
    categories: ["cryogenic-accessories"],
    categoryLabel: "Cryogenic accessories",
    tagline: "Classical and digital charting systems for environmental assurance",
    description: "Inkless paper chart recorders and electronic recorders providing secure and tamper-proof temperature histories.",
    features: [
      "Circular inkless thermal paper chart recordings",
      "Easy chart replacement and calibration access",
      "Robust quartz motor for timing accuracy",
      "Audible system backup warnings"
    ],
    specs: {
      "Chart Type": "Circular (6-inch / 8-inch)",
      "Recording Duration": "24 hours / 7 days selectable",
      "Measurement Range": "-100°C to +20°C",
      "Mounting Options": "Built-in / Wall mount panel"
    },
    imageUrl: "/product logo/temperature_recorder.jpg",
    imagePlaceholder: "Temperature Recorder",
    brochureUrl: "/brochures/temp-recorder.pdf"
  },
  {
    id: "cryoracks-cryoboxes",
    name: "Cryoracks, Cryoboxes",
    categories: ["cryogenic-accessories"],
    categoryLabel: "Cryogenic accessories",
    tagline: "High density cryogenic inventory organizational storage",
    description: "Premium cryogenic storage solutions including durable stainless steel racks and chemical-resistant cryoboxes for vial organization.",
    features: [
      "Corrosion-resistant stainless steel rack frames with drawer configuration",
      "Polycarbonate and cardboard cryoboxes optimized for -196°C liquid nitrogen use",
      "Numeric grid numbering systems on lids for quick vial identification",
      "Various size configurations to accommodate 1.2ml, 2.0ml, and 5.0ml cryovials"
    ],
    specs: {
      "Rack Material": "Stainless Steel (SS-304)",
      "Box Grid Size": "9x9 (81 wells) / 10x10 (100 wells)",
      "Temperature Range": "-196°C to +121°C (autoclavable boxes)",
      "Compatibility": "Fits standard LN2 Dewars and chest freezers"
    },
    imageUrl: "/product logo/cryoracks.jpg",
    imagePlaceholder: "Cryo Racks and Boxes",
    brochureUrl: "/brochures/cryo-organization.pdf"
  },
  {
    id: "cryopen-cryoapron",
    name: "Cryopen, Cryoapron",
    categories: ["cryogenic-accessories"],
    categoryLabel: "Cryogenic accessories",
    tagline: "Personal safety wear and tools for cryogenic handling",
    description: "Essential personal protective equipment (PPE) and precision handling tools designed to prevent cryogenic frostbite injuries in liquid nitrogen environments.",
    features: [
      "Multi-layered thermal protection aprons for liquid nitrogen splash protection",
      "High strength insulated cryogenic pens/forceps for precise sample extraction",
      "Breathable, lightweight, and waterproof apron outer fabric",
      "Certified to EU and safety cold-protection standards"
    ],
    specs: {
      "Apron Lengths": "36-inch, 42-inch, 48-inch options",
      "Thermal Protection": "Tested down to -196°C",
      "PPE Category": "Category III EN 511 protection levels",
      "Cryopen Length": "250mm / 300mm medical-grade stainless steel"
    },
    imageUrl: "/product logo/cryo_pro.jpeg",
    imagePlaceholder: "Cryo PPE",
    brochureUrl: "/brochures/cryo-ppe.pdf"
  }
];
