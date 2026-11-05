// Surplus Rescue, Value Addition Guides & Crop Residue Monetization
export const VALUE_ADDITION_GUIDES = [
  {
    id: 'va-1',
    crop: 'Tomato',
    localName: 'ಟೊಮ್ಯಾಟೊ / टमाटर',
    problemContext: 'When market price crashes to ₹3-₹5 per kg, farmers face severe losses and often dump produce on roads.',
    shelfLifeFresh: '3 to 6 days',
    solutions: [
      {
        product: 'Sterilized Tomato Puree / Paste (Aseptic Glass Jars)',
        yieldRatio: '4 kg raw tomatoes → 1 kg concentrated puree (28° Brix)',
        shelfLife: '12 Months (without refrigeration until opened)',
        rawPricePerKg: 4,
        processingCostPerKg: 12,
        sellingPricePerKg: 95,
        profitMultiplier: '4.8x higher net return',
        equipmentNeeded: 'Pulper machine, double-jacketed steam kettle, crown capper',
        buyerDemand: 'Hotels, fast food chains, cloud kitchens, retail consumers'
      },
      {
        product: 'Traditional Spicy Tomato Pickle (Andhra / South Style)',
        yieldRatio: '1 kg tomatoes + spices + sesame oil → 1.2 kg pickle',
        shelfLife: '9 Months at room temperature',
        rawPricePerKg: 4,
        processingCostPerKg: 35,
        sellingPricePerKg: 180,
        profitMultiplier: '6.2x higher net return',
        equipmentNeeded: 'Vegetable chopper, stainless steel mixing vat, sealing machine',
        buyerDemand: 'Local grocery stores, supermarts, online direct-to-consumer'
      },
      {
        product: 'Solar Dehydrated Sun-Dried Tomato Flakes',
        yieldRatio: '15 kg fresh tomatoes → 1 kg dry flakes',
        shelfLife: '18 Months',
        rawPricePerKg: 4,
        processingCostPerKg: 45,
        sellingPricePerKg: 450,
        profitMultiplier: '4.1x higher net return',
        equipmentNeeded: 'Solar tunnel dryer, slicer',
        buyerDemand: 'Pizzeria suppliers, spice blenders, European export buyers'
      }
    ]
  },
  {
    id: 'va-2',
    crop: 'Mango (Raw & Ripe)',
    localName: 'ಮಾವಿನ ಹಣ್ಣು / आम',
    problemContext: 'Glut during peak season causes sudden price collapse, premature drop during storms.',
    shelfLifeFresh: '5 to 10 days',
    solutions: [
      {
        product: 'Canned Mango Pulp (Aseptic Drums & Cans)',
        yieldRatio: '2.2 kg ripe mangoes → 1 kg sweetened pulp',
        shelfLife: '24 Months',
        rawPricePerKg: 18,
        processingCostPerKg: 18,
        sellingPricePerKg: 95,
        profitMultiplier: '3.2x higher net return',
        equipmentNeeded: 'Destoner, pulper, pasteurizer, can seamer',
        buyerDemand: 'Ice cream manufacturers, juice brands (Frooti/Maaza copackers)'
      },
      {
        product: 'Raw Mango Dry Pickle (Avakaya / Nati Style)',
        yieldRatio: '1 kg raw mango → 1.3 kg pickle with oil & mustard',
        shelfLife: '18 Months',
        rawPricePerKg: 12,
        processingCostPerKg: 40,
        sellingPricePerKg: 220,
        profitMultiplier: '5.5x higher net return',
        equipmentNeeded: 'Heavy cutter, ceramic fermentation vats, vacuum sealer',
        buyerDemand: 'Hostels, retail distributors, export Indian diaspora'
      }
    ]
  },
  {
    id: 'va-3',
    crop: 'Banana (Robusta & Cavendish)',
    localName: 'ಬಾಳೆಹಣ್ಣು / केला',
    problemContext: 'Perishable bunches cannot withstand transport delays; sudden market glut triggers panic sale.',
    shelfLifeFresh: '4 to 7 days',
    solutions: [
      {
        product: 'Crisp Vacuum-Fried Banana Chips (Salted / Peppered)',
        yieldRatio: '3.5 kg raw bananas → 1 kg chips',
        shelfLife: '6 Months (Nitrogen flushed pouches)',
        rawPricePerKg: 10,
        processingCostPerKg: 65,
        sellingPricePerKg: 260,
        profitMultiplier: '4.2x higher return',
        equipmentNeeded: 'Automatic peeler, continuous slicer, vacuum fryer, pouch sealer',
        buyerDemand: 'Snack distributors, railway canteens, modern retail'
      },
      {
        product: 'Green Banana Flour (Resistant Starch Superfood)',
        yieldRatio: '5 kg raw green bananas → 1 kg gluten-free flour',
        shelfLife: '12 Months',
        rawPricePerKg: 8,
        processingCostPerKg: 30,
        sellingPricePerKg: 280,
        profitMultiplier: '5.1x higher return',
        equipmentNeeded: 'Solar dryer, stainless steel pulverizer, vibratory sifter',
        buyerDemand: 'Health food brands, bakery premix makers, diabetic food stores'
      }
    ]
  },
  {
    id: 'va-4',
    crop: 'Arecanut Sheath & Waste',
    localName: 'ಅಡಿಕೆ ಹಾಳೆ / सुपारी पत्ता',
    problemContext: 'Fallen sheaths and fronds were traditionally burnt or left to rot in orchards.',
    shelfLifeFresh: 'Permanent after drying',
    solutions: [
      {
        product: 'Biodegradable Arecanut Leaf Plates & Bowls (Eco-Catering)',
        yieldRatio: '1 fallen sheath → 1 to 2 dinner plates or soup bowls',
        shelfLife: '3 Years (Zero plastics, 100% compostable in 60 days)',
        rawPricePerKg: 1.5,
        processingCostPerKg: 3,
        sellingPricePerKg: 18,
        profitMultiplier: '7.0x net value unlocked',
        equipmentNeeded: 'Hydraulic leaf plate heat-pressing machines, UV sterilizer',
        buyerDemand: 'Catering businesses, temple prasadams, eco-packaging exports to EU/USA'
      }
    ]
  }
];

export const PROCESSING_PARTNERS = [
  {
    id: 'proc-1',
    name: 'Shivamogga Women Farmers Agro-Processing Cooperative (SHG)',
    contactPerson: 'Smt. Roopa Devi',
    phone: '+91 94812 77011',
    location: 'Holehonnur Road, Shivamogga, Karnataka',
    services: ['Tomato Puree Extraction', 'Pickling & Bottling', 'Solar Dehydration'],
    capacityPerDay: '5,000 Kg raw produce',
    coldStorageAvailable: true,
    charges: '₹4.50 per kg processing fee or 20% revenue share',
    fssaiLicense: 'FSSAI 11221334000122'
  },
  {
    id: 'proc-2',
    name: 'Malnad Multi-Commodity Solar Cold Storage & Pack House',
    contactPerson: 'Kiran Murthy (Facility Manager)',
    phone: '+91 98451 90876',
    location: 'Bhadravathi Agro-Cluster, Karnataka',
    services: ['Cold Storage (0°C to 12°C)', 'Nitrogen Ripening', 'Grading & Sorting Line'],
    capacityPerDay: '450 Metric Tons space',
    coldStorageAvailable: true,
    charges: '₹1.10 / crate / day (Government AIF subsidized rate)',
    fssaiLicense: 'WDRA Reg. No. 44819'
  },
  {
    id: 'proc-3',
    name: 'Konkan Mango & Fruit Processing Hub',
    contactPerson: 'Dilip Sawant',
    phone: '+91 94220 54312',
    location: 'MIDC Mirjole, Ratnagiri, Maharashtra',
    services: ['Aseptic Mango Pulp Canning', 'Vacuum Freeze Drying'],
    capacityPerDay: '12,000 Kg raw mangoes',
    coldStorageAvailable: true,
    charges: '₹8.00 per kg raw pulp conversion',
    fssaiLicense: 'FSSAI 11519042000541'
  }
];

export const CROP_WASTE_LISTINGS = [
  {
    id: 'waste-1',
    residueType: 'Paddy Straw Bales (Dry, High Quality)',
    farmerName: 'Sardar Baldev Singh',
    phone: '+91 98144 32901',
    location: 'Karnal, Haryana',
    state: 'Haryana',
    quantityTons: 150,
    pricePerTon: 1800,
    moisturePercent: '12%',
    recommendedUse: 'Mushroom cultivation substrate, bio-fuel pellets, cattle fodder',
    pickupWindow: 'Available immediately - 15 Oct 2026',
    avoidedBurningCO2Tons: 225, // 1.5 tons CO2 per ton straw saved!
    transportSupport: 'Tractor trolley transport available within 40 km'
  },
  {
    id: 'waste-2',
    residueType: 'Arecanut Husk & Frond Biomass',
    farmerName: 'Ramesh Hegde',
    phone: '+91 94811 65432',
    location: 'Thirthahalli, Shivamogga, Karnataka',
    state: 'Karnataka',
    quantityTons: 40,
    pricePerTon: 2200,
    moisturePercent: '14%',
    recommendedUse: 'Bio-briquettes for boilers, eco-fiber extraction, organic vermicompost',
    pickupWindow: '01 Oct - 20 Oct 2026',
    avoidedBurningCO2Tons: 60,
    transportSupport: 'Self-loading ramp available at orchard'
  },
  {
    id: 'waste-3',
    residueType: 'Sugarcane Bagasse & Trash (Shredded)',
    farmerName: 'Vinod Patil',
    phone: '+91 98231 44567',
    location: 'Kolhapur, Maharashtra',
    state: 'Maharashtra',
    quantityTons: 300,
    pricePerTon: 1600,
    moisturePercent: '18%',
    recommendedUse: 'Co-generation thermal power plants, paper pulp, bio-plastic boards',
    pickupWindow: 'Available all month',
    avoidedBurningCO2Tons: 450,
    transportSupport: 'Direct factory weighbridge dispatch'
  },
  {
    id: 'waste-4',
    residueType: 'Cotton Stalk Shreds (Hardwood Biomass)',
    farmerName: 'Kishore Patel',
    phone: '+91 98791 22340',
    location: 'Rajkot, Gujarat',
    state: 'Gujarat',
    quantityTons: 85,
    pricePerTon: 1950,
    moisturePercent: '10%',
    recommendedUse: 'Particle boards, industrial boiler biomass pellets, active carbon',
    pickupWindow: '05 Oct - 25 Oct 2026',
    avoidedBurningCO2Tons: 130,
    transportSupport: 'Hydraulic tipper transport coordinated'
  },
  {
    id: 'waste-5',
    residueType: 'Wheat Straw Chaff (Turi / Bhusa for Fodder)',
    farmerName: 'Jagjit Singh Sandhu',
    phone: '+91 98721 88992',
    location: 'Ludhiana, Punjab',
    state: 'Punjab',
    quantityTons: 200,
    pricePerTon: 3400,
    moisturePercent: '8%',
    recommendedUse: 'Dairy cattle dry fodder (Nutrient enriched), packaging insulation',
    pickupWindow: 'Available Now',
    avoidedBurningCO2Tons: 300,
    transportSupport: 'Can supply in compressed 30kg square bales'
  }
];
