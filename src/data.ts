import { ScoutSection, Badge, ScoutEvent, Knot, TimelineEvent } from './types';

export const SECTIONS_DATA: ScoutSection[] = [
  {
    id: 'cubs',
    name: 'Cub Scouts',
    tagline: 'Learning by playing, exploring, and building core habits.',
    ageRange: '7 to 11 Years',
    meetingTime: 'Saturdays, 1:00 PM - 2:30 PM',
    colorClass: 'bg-amber-500 hover:bg-amber-600',
    textColor: 'text-amber-800',
    bgGradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    accentColor: '#F59E0B',
    description: 'Our Cub Pack is where the adventure begins! Cubs are split into "Sixes" led by a Sixer. Through games, crafts, and outdoor activities, they earn stars and activity badges while learning the value of cooperation and respect.',
    motto: 'Do Your Best (உன்னால் இயன்றவரை செய் / உங்களால் முடிந்ததைச் செய்யுங்கள்)',
    promise: 'I promise to do my best, to do my duty to my religion and my country, to keep the Law of the Cub Scout pack, and to do a good turn every day.',
    law: [
      'The Cub Scout obeys the elders.',
      'The Cub Scout does not give in to himself/herself (always works hard).'
    ],
    activities: [
      'Interactive games & team activities',
      'Basic camping skills & outdoor excursions',
      'Handicrafts, knotting & basic first aid',
      'Nature walks & conservation field trips'
    ],
    badges: ['Bronze Star', 'Silver Star', 'Gold Star', 'Athlete Cub', 'Artist Cub', 'First Aid Cub']
  },
  {
    id: 'scouts',
    name: 'Boy & Girl Scouts',
    tagline: 'Mastering outdoor skills, leadership, and self-reliance.',
    ageRange: '11 to 15 Years',
    meetingTime: 'Saturdays, 2:30 PM - 5:00 PM',
    colorClass: 'bg-emerald-600 hover:bg-emerald-700',
    textColor: 'text-emerald-800',
    bgGradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    accentColor: '#059669',
    description: 'The core of our Scout Group, organized into Patrols (e.g., Eagle, Tiger, Cobra, Falcon). Scouts learn advanced pioneering, wilderness survival, navigation, and community leadership. They work toward the prestigious President\'s Scout Award.',
    motto: 'Be Prepared (தயாராக இரு / ஆயத்தமாய் இரு)',
    promise: 'On my honour, I promise to do my best, to do my duty to my religion and my country, to help other people at all times, and to obey the Scout Law.',
    law: [
      'A Scout is trustworthy.',
      'A Scout is loyal.',
      'A Scout is helpful.',
      'A Scout is friendly.',
      'A Scout is courteous.',
      'A Scout is kind to animals and loves nature.',
      'A Scout is disciplined and obedient.',
      'A Scout is cheerful under difficulties.',
      'A Scout is thrifty.',
      'A Scout is clean in thought, word, and deed.'
    ],
    activities: [
      'Pioneering (building bridges and towers with ropes and spars)',
      'Backpacking, wilderness hiking & outdoor camping',
      'Compass reading, mapping & orienteering',
      'Community service & disaster response drills',
      'Campfires, singing & cooking'
    ],
    badges: ['Tenderfoot', 'Second Class', 'First Class', 'Camper', 'Pioneer', 'First Aid Expert', 'President\'s Scout']
  },
  {
    id: 'rovers',
    name: 'Rover Scouts',
    tagline: 'Active citizen service, personal development, and mentorship.',
    ageRange: '15 to 24 Years',
    meetingTime: 'Saturdays, 4:30 PM - 6:30 PM',
    colorClass: 'bg-rose-700 hover:bg-rose-800',
    textColor: 'text-rose-800',
    bgGradient: 'from-rose-700/20 via-red-600/10 to-transparent',
    accentColor: '#BE123C',
    description: 'Rovers are a self-governing crew of young adults. They focus on major community service projects, high-altitude expeditions, and helping organize events for the Cub Pack and Scout Troop. Rovers live by the motto of Service.',
    motto: 'Service (சேவை / சேவை செய்யுங்கள்)',
    promise: 'On my honour, I promise to do my best, to do my duty to my religion and my country, to help other people at all times, and to obey the Scout Law.',
    law: [
      'A Scout is trustworthy.',
      'A Scout is loyal.',
      'A Scout is helpful.',
      'A Scout is friendly.',
      'A Scout is courteous.',
      'A Scout is kind to animals and loves nature.',
      'A Scout is disciplined and obedient.',
      'A Scout is cheerful under difficulties.',
      'A Scout is thrifty.',
      'A Scout is clean in thought, word, and deed.'
    ],
    activities: [
      'Organizing charitable donation drives and school improvement programs',
      'Advanced wilderness mountaineering and expeditions',
      'Vocational training and professional networking',
      'Serving as assistant leaders or mentors for cubs/scouts'
    ],
    badges: ['Rover Aspirant', 'Service Badge', 'Rambler Badge', 'Baden-Powell Award']
  }
];

export const BADGES_DATA: Badge[] = [
  // CUBS BADGES
  {
    id: 'bronze-star',
    name: 'Bronze Star',
    category: 'efficiency',
    section: 'cubs',
    icon: '⭐️',
    description: 'The first basic efficiency star representing fundamental cub scouting skills.',
    requirements: [
      'Know the Cub Scout Promise, Law, Motto, and Sign.',
      'Demonstrate the Cub Scout salute and handclasp.',
      'Know the history of Lord Baden-Powell (founder of Scouting) in brief.',
      'Tie and explain the Reef Knot.'
    ]
  },
  {
    id: 'silver-star',
    name: 'Silver Star',
    category: 'efficiency',
    section: 'cubs',
    icon: '🌟',
    description: 'The second efficiency star indicating growing independence and helpfulness.',
    requirements: [
      'Must have completed the Bronze Star.',
      'Perform a useful service at home or school daily for at least a month.',
      'Throw a life line accurately to a target 15 feet away.',
      'Tie a Clove Hitch and Sheet Bend and know their uses.',
      'Keep a simple diary of a week\'s good turns.'
    ]
  },
  {
    id: 'gold-star',
    name: 'Gold Star',
    category: 'efficiency',
    section: 'cubs',
    icon: '✨',
    description: 'The highest efficiency star in Cub Scouting, demonstrating mastery.',
    requirements: [
      'Must have completed the Silver Star.',
      'Understand simple health and hygiene rules, including dental care.',
      'Know the national flag, national anthem, and district commissioner\'s name.',
      'Guide a blindfolded person safely through obstacles.',
      'Explain the purpose of standard first aid items.'
    ]
  },
  {
    id: 'athlete-cub',
    name: 'Athlete Cub',
    category: 'merit',
    section: 'cubs',
    icon: '🏃',
    description: 'Awarded for physical fitness, speed, and endurance.',
    requirements: [
      'Run 50 meters in under 10 seconds.',
      'Demonstrate high jump and long jump techniques.',
      'Perform 15 consecutive push-ups with correct form.',
      'Complete a 1.5-mile organized jog/walk with the pack.'
    ]
  },
  {
    id: 'artist-cub',
    name: 'Artist Cub',
    category: 'merit',
    section: 'cubs',
    icon: '🎨',
    description: 'Encourages creativity and artistic expression.',
    requirements: [
      'Draw or paint an original scene from a campout or nature hike.',
      'Construct a useful model or handicraft out of recycled materials.',
      'Sing a traditional scout campfire song solo or with a peer.',
      'Design a patrol flag for your Six.'
    ]
  },

  // SCOUT BADGES
  {
    id: 'tenderfoot',
    name: 'Tenderfoot Badge',
    category: 'efficiency',
    section: 'scouts',
    icon: '🪵',
    description: 'The fundamental entry badge for the Boy/Girl Scout section.',
    requirements: [
      'Know the Scout Promise, Scout Law, Sign, Salute, and Scout Handclasp.',
      'Explain the parts of the Scout Emblem.',
      'Understand the significance of the Scout Scarf and Uniform.',
      'Tie the Reef Knot, Sheet Bend, Clove Hitch, Bowline, and Sheepshank.'
    ]
  },
  {
    id: 'second-class',
    name: 'Second Class Badge',
    category: 'efficiency',
    section: 'scouts',
    icon: '🛡️',
    description: 'Marks progression in core outdoor skills, orienteering, and safety.',
    requirements: [
      'Must be a Tenderfoot Scout for at least 3 months.',
      'Cook a simple meal for your Patrol outdoors using a campfire.',
      'Demonstrate how to treat basic injuries: cuts, burns, insect bites, and sprains.',
      'Use a magnetic compass to take bearings and navigate a 1km course.',
      'Participate in a service project of at least 6 hours.'
    ]
  },
  {
    id: 'first-class',
    name: 'First Class Badge',
    category: 'efficiency',
    section: 'scouts',
    icon: '⚜️',
    description: 'The standard of a fully-trained, capable scout who can lead others.',
    requirements: [
      'Must be a Second Class Scout for at least 6 months.',
      'Lead a pioneering project (e.g., A-frame trestle or tripod) with your patrol.',
      'Map a 1km route with landmarks, estimating heights and distances.',
      'Swim 50 meters dressed in light clothes, or demonstrate land rescue methods.',
      'Plan, pack, and lead an overnight hiking camp for your Patrol.'
    ]
  },
  {
    id: 'camper-badge',
    name: 'Camper Badge',
    category: 'merit',
    section: 'scouts',
    icon: '⛺',
    description: 'Demonstrates expert knowledge of campcraft, environmental care, and leadership.',
    requirements: [
      'Camp in tents for a total of at least 15 nights across multiple scout outings.',
      'Pitch and strike a patrol tent with speed and neatness.',
      'Build a camp kitchen and write a menu for a 3-day camp.',
      'Demonstrate proper care of camp tools: axes, saws, and knives.',
      'Know the principles of "Leave No Trace" camping.'
    ]
  },
  {
    id: 'pioneer-badge',
    name: 'Pioneer Badge',
    category: 'merit',
    section: 'scouts',
    icon: '🌉',
    description: 'Awarded for mastery in lashings, ropework, and timber construction.',
    requirements: [
      'Demonstrate Square, Diagonal, Shear, and Parallel lashings.',
      'Splice a rope (back splice or eye splice) and whip a rope end.',
      'Build a functional pioneering bridge or tower (e.g., monkey bridge) with timber.',
      'Know the safety factors and weight capacities of different rope types.'
    ]
  },
  {
    id: 'first-aid-scout',
    name: 'First Aid Expert',
    category: 'merit',
    section: 'scouts',
    icon: '🩹',
    description: 'High-level emergency medical knowledge and treatment capability.',
    requirements: [
      'Explain the priority order of treatment in multi-casualty incidents.',
      'Demonstrate cardiopulmonary resuscitation (CPR) on a manikin.',
      'Show how to apply triangular bandages for fractures and head injuries.',
      'Identify symptoms of shock, heat stroke, hypothermia, and treat them.',
      'Construct a makeshift stretcher and safely carry a patient 50 meters.'
    ]
  },
  {
    id: 'presidents-scout',
    name: "President's Scout Award",
    category: 'award',
    section: 'scouts',
    icon: '👑',
    description: 'The highest award achievable in Sri Lankan Scouting, signed by the President of Sri Lanka.',
    requirements: [
      'Must have achieved First Class Badge.',
      'Hold at least 8 key Merit Badges including First Aid, Camper, Pioneer, Public Health, and Citizen.',
      'Complete a major community development project with 50+ hours of service.',
      'Pass a rigorous district-wide theoretical and practical evaluation.',
      'Maintain an exemplary record of school performance, discipline, and scout spirit.'
    ]
  },

  // ROVER BADGES
  {
    id: 'rover-aspirant',
    name: 'Rover Aspirant',
    category: 'general',
    section: 'rovers',
    icon: '🧭',
    description: 'Entry badge for the Rover Scout Crew, detailing adult service principles.',
    requirements: [
      'Read and discuss "Rovering to Success" by Lord Baden-Powell.',
      'Understand the structure and self-government of the Rover Crew.',
      'Deliver a presentation on a chosen global issue (e.g. climate change, poverty) and proposed actions.'
    ]
  },
  {
    id: 'service-badge',
    name: 'Rover Service Medal',
    category: 'award',
    section: 'rovers',
    icon: '🤝',
    description: 'Awarded for outstanding long-term service to the community and group.',
    requirements: [
      'Plan and execute a major environmental restoration or social relief project (minimum 100 hours).',
      'Provide regular service as an instructor or helper in the Cub or Scout sections for 6 months.',
      'Organize a Blood Donation Camp or disaster resilience workshop at the school.'
    ]
  }
];

export const EVENTS_DATA: ScoutEvent[] = [
  {
    id: 'ev-1',
    title: 'Weekly Troop & Cub Meeting',
    date: '2026-07-11',
    time: '2:30 PM - 5:00 PM',
    location: 'CIS Main Field and Assembly Hall',
    category: 'meeting',
    description: 'Regular weekly training. Cubs meet at 1:00 PM, Scouts at 2:30 PM. Focus will be on Pioneering Lashings, Knot speed runs, and preparations for the upcoming Colombo District Camporee.',
    section: 'all'
  },
  {
    id: 'ev-2',
    title: '51st Colombo Investiture Ceremony',
    date: '2026-07-25',
    time: '4:00 PM - 6:30 PM',
    location: 'CIS Main Auditorium',
    category: 'ceremony',
    description: 'Our annual formal ceremony where new recruits take the Scout Promise and receive their official Group Scarf, District Badge, and membership certificates in the presence of parents and school faculty.',
    section: 'all'
  },
  {
    id: 'ev-3',
    title: 'Pioneering Bridge Construction Challenge',
    date: '2026-08-08',
    time: '8:00 AM - 4:00 PM',
    location: 'CIS Back Field / Sports Arena',
    category: 'competition',
    description: 'The ultimate patrol rivalry! Each Patrol (Eagle, Cobra, Tiger, Falcon) gets 2 hours and 30 spars to build a self-standing monkey bridge. Bridges will be tested for weight limits and structural neatness.',
    section: 'scouts'
  },
  {
    id: 'ev-4',
    title: 'Annual Coastal Clean-up & Eco-Awareness',
    date: '2026-08-22',
    time: '7:00 AM - 12:00 PM',
    location: 'Galle Face Green Coastline, Colombo',
    category: 'community',
    description: 'In service to our city! Led by the Rover Crew, Cubs and Scouts will clear non-biodegradable waste from the beach, conduct surveys on marine plastic, and distribute cloth bags to citizens.',
    section: 'all'
  },
  {
    id: 'ev-5',
    title: 'Colombo District Camporee 2026',
    date: '2026-09-10',
    time: '5 Days / 4 Nights',
    location: 'Viharamahadevi Park, Colombo',
    category: 'camp',
    description: 'The largest gathering of Scouts in the Colombo District! Over 3,000 scouts from 40+ schools will camp together, participate in competitive games, pioneering displays, cultural talent nights, and campfire singing.',
    section: 'scouts'
  }
];

export const KNOTS_DATA: Knot[] = [
  {
    id: 'reef',
    name: 'Reef Knot (Square Knot)',
    sinhalaName: 'රිෆ් ගැටය (Reef Getaya)',
    difficulty: 'Easy',
    category: 'joining',
    description: 'A simple binding knot used to secure non-critical items, bandages, or join two ropes of equal thickness.',
    uses: 'Tying packages, securing sails, tying triangular bandages in first aid.',
    steps: [
      'Take two rope ends (left and right).',
      'Pass the left end OVER the right end, and tuck it under (Left over Right).',
      'Take the end now on the right, pass it OVER the left end, and tuck it under (Right over Left).',
      'Pull both ends firmly to tighten. The knot should lie flat and slip open easily when pulled backwards.'
    ],
    interactiveIllustration: 'reef'
  },
  {
    id: 'clove',
    name: 'Clove Hitch',
    sinhalaName: 'කොකා ගැටය (Koka Getaya)',
    difficulty: 'Easy',
    category: 'hitch',
    description: 'A secure hitch used to secure a rope to a spar, post, or cylinder. It is the foundation of almost all pioneer lashings.',
    uses: 'Starting and ending square lashings, tying a boat to a post temporarily.',
    steps: [
      'Pass the rope end around the spar to make a full loop.',
      'Pass the end around the spar again, crossing over the first loop to make an "X" shape.',
      'Tuck the rope end under the second crossing turn.',
      'Pull both ends tightly in opposite directions to bind the knot around the spar.'
    ],
    interactiveIllustration: 'clove'
  },
  {
    id: 'bowline',
    name: 'Bowline',
    sinhalaName: 'බෝලයින් ගැටය (Bowline Getaya)',
    difficulty: 'Medium',
    category: 'loop',
    description: 'The "King of Knots". It forms a secure, non-slip loop at the end of a rope that will not close or tighten under strain, yet is easy to untie.',
    uses: 'Rescue operations (lowering/raising casualties), securing sails, tying guy ropes.',
    steps: [
      'Make a small loop (the "rabbit hole") in the standing part of the rope, leaving enough end.',
      'Pass the free end (the "rabbit") UP through the loop from underneath.',
      'Wrap the end around the standing part of the rope behind the loop (around the "tree").',
      'Pass the end back DOWN through the loop (back into the "rabbit hole").',
      'Pull the standing part and the loop ends together to secure the knot.'
    ],
    interactiveIllustration: 'bowline'
  },
  {
    id: 'sheet-bend',
    name: 'Sheet Bend',
    sinhalaName: 'ෂීට් බෙන්න ගැටය (Sheet Bend Getaya)',
    difficulty: 'Medium',
    category: 'joining',
    description: 'A highly reliable knot used to join two ropes of unequal thickness or material.',
    uses: 'Extending guy lines, connecting heavy towing ropes to thinner lines.',
    steps: [
      'Form a bight (a U-shaped loop) in the thicker rope.',
      'Pass the end of the thinner rope UP through the bight.',
      'Wrap the thinner rope around the back of both strands of the thicker rope\'s bight.',
      'Tuck the thin rope under its own standing part (not under the thick rope).',
      'Pull all four strands firmly to tighten and secure the bend.'
    ],
    interactiveIllustration: 'sheet'
  },
  {
    id: 'sheepshank',
    name: 'Sheepshank',
    sinhalaName: 'නයි ගැටය (Nay Getaya)',
    difficulty: 'Hard',
    category: 'shortening',
    description: 'A knot used to shorten a long rope without cutting it, or to isolate a weak/damaged section of a rope from tension.',
    uses: 'Shortening bridge guide ropes, securing slack in long rigging.',
    steps: [
      'Gather the rope and lay it out to form a parallel "S" shape with three strands.',
      'Make a half-hitch loop in the standing rope on one side, and slide it over the adjacent folded end of the S.',
      'Make another half-hitch loop in the standing rope on the other side, and slide it over the second folded end.',
      'Pull the standing ends in opposite directions to lock the half-hitches. The knot only holds under constant tension.'
    ],
    interactiveIllustration: 'sheepshank'
  }
];

export const TIMELINE_DATA: TimelineEvent[] = [
  {
    year: '1982',
    title: 'Group Inauguration',
    description: 'The 51st Colombo Scout Group is officially chartered at Colombo International School with 12 scout recruits and 1 scout master, aiming to introduce British-Sri Lankan co-educational scouting.',
    icon: '📜'
  },
  {
    year: '1988',
    title: 'Cub Pack Expansion',
    description: 'Due to huge demand in the primary section of CIS, the 51st Colombo Cub Pack is formed, introducing physical education, camping, and teamwork to ages 7-11.',
    icon: '🐯'
  },
  {
    year: '1996',
    title: 'First President\'s Scout',
    description: 'Scout Leader Sajith Wijesinghe becomes the first 51st Colombo Scout to be awarded the prestigious President\'s Scout Award, marking the group\'s rise in technical excellence.',
    icon: '🏅'
  },
  {
    year: '2005',
    title: 'Rover Crew Chartered',
    description: 'To enable secondary school graduates and senior students to remain in scouting, the Rover Crew is created, focusing on active disaster relief, environmental activism, and mentorship.',
    icon: '⛺'
  },
  {
    year: '2012',
    title: '30 Years & Camporee Lead',
    description: 'Celebrating three decades of excellence. 51st Colombo designs and hosts the pioneering bridge obstacle course at the Colombo District Camporee, earning the "Spirit of Scouting" trophy.',
    icon: '🎗️'
  },
  {
    year: '2024',
    title: 'Pioneering Championship',
    description: 'The 51st Colombo Patrols sweep the District Pioneering and Cooking competitions, building a 12-foot self-standing drawbridge using only ropes, logs, and traditional lashings.',
    icon: '🌉'
  },
  {
    year: '2026',
    title: 'Digital Portal Launch',
    description: 'Under the supervision of GSL (Group Scout Leader) and Rover mentors, the 51st Colombo launches its first interactive badge explorer, digital uniform assistant, and online register.',
    icon: '💻'
  }
];

export const LEADERSHIP_DATA = [
  {
    name: 'Dr. Gregory Mathews',
    role: 'Patron & Principal, CIS',
    quote: 'Scouting at CIS breeds resilience, leadership, and a deep-rooted sense of citizenship. We are immensely proud of our 51st Colombo Scout Group.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Kapila Jayawardene',
    role: 'Group Scout Leader (GSL)',
    quote: 'Our goal is simple: to make scouting fun, educational, and adventurous. We give our boys and girls real skills that no classroom can teach.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Samanthi de Alwis',
    role: 'Cub Scout Mistress',
    quote: 'With cubs, we focus on play-acting, physical coordination, and making helpfulness a daily habit. We lay the foundations of character.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Rushdi Hashim',
    role: 'Scout Master',
    quote: 'Scouting is about patrols. When 6 scouts go into the woods and set up their own camp, they learn more about real leadership than from a thousand textbooks.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256'
  }
];

export const GALLERY_IMAGES = [
  {
    title: 'Pioneering Tower Construction',
    category: 'pioneering',
    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600',
    description: 'Senior scouts building a tripod signal tower.'
  },
  {
    title: 'Annual District Camporee',
    category: 'camping',
    url: 'https://images.unsplash.com/photo-1523987355122-830d31ff84ef?auto=format&fit=crop&q=80&w=600',
    description: 'Campfire gathering and singing with district troops.'
  },
  {
    title: 'Cub Pack Tree Planting',
    category: 'community',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    description: 'Our cubs planting local saplings as part of their conservation badge.'
  },
  {
    title: 'Backpack Wilderness Expedition',
    category: 'adventure',
    url: 'https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?auto=format&fit=crop&q=80&w=600',
    description: 'Rovers hiking through the knuckles mountain range.'
  },
  {
    title: 'First Aid Simulation Drill',
    category: 'meetings',
    url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=600',
    description: 'Weekly meeting practice on stretcher carries and splints.'
  },
  {
    title: 'Campfire Cooking Masterclass',
    category: 'camping',
    url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=600',
    description: 'Patrols cooking Sri Lankan pol-sambol and roti over an open woodfire.'
  }
];
