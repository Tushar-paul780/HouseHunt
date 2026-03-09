// ─── Helper ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 10000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : n >= 1000000
    ? `$${(n / 1000000).toFixed(2)}M`
    : n >= 1000
    ? `$${(n / 1000).toFixed(0)}K`
    : `$${n}`;

const rentFmt = (n) => `$${n.toLocaleString()}/mo`;

// ─── Unsplash property image pool ────────────────────────────────────────────
const IMGS = [
  "photo-1600596542815-ffad4c1539a9","photo-1545324418-cc1a3fa10c00",
  "photo-1512917774080-9991f1c4c750","photo-1484154218962-a197022b5858",
  "photo-1558618666-fcd25c85cd64","photo-1502672260266-1c1ef2d93688",
  "photo-1449158743715-0a90ebb6d2d8","photo-1600607687939-ce8a6c25118c",
  "photo-1613490493576-7fde63acd811","photo-1560448204-e02f11c3d0e2",
  "photo-1600585154340-be6161a56a0c","photo-1582268611958-ebfd161ef9cf",
  "photo-1570129477492-45c003edd2be","photo-1566908829550-e6551b00979b",
  "photo-1523217582562-09d0def993a6","photo-1587831990711-23ca6441447b",
  "photo-1494526585095-c41746248156","photo-1605276374104-dee2a0ed3cd6",
  "photo-1416331108676-a22ccb276e35","photo-1600047509807-ba8f99d2cdde",
  "photo-1600585154526-990dced4db0d","photo-1629236714692-48cddc1289f2",
  "photo-1538608376742-e32e3a9c1b17","photo-1519974719765-e6559eac2575",
  "photo-1567524795491-7b2f35a07cc8","photo-1556909212-d5b604d0c90d",
  "photo-1640449141820-db7b6b855d77","photo-1598228723793-52759bba239c",
  "photo-1575517111478-7f6afd0973db","photo-1509660933844-6910e12765a0",
];

const img = (i) => `https://images.unsplash.com/${IMGS[i % IMGS.length]}?w=600&q=80`;

// ─── Raw seed data ────────────────────────────────────────────────────────────
const seed = [
  { title:"Smart Home Estate",type:"Villa",status:"For Sale",priceRaw:4800000,address:"Bandra West",city:"Mumbai",beds:5,baths:5,area:4800,tag:"Smart Home",description:"Fully automated luxury villa in Mumbai's most prestigious neighbourhood with rooftop pool." },
  { title:"Sea-Facing Apartment",type:"Apartment",status:"For Rent",priceRaw:3200,address:"Marine Drive",city:"Mumbai",beds:3,baths:2,area:1600,tag:"Sea View",description:"Breathtaking sea-facing apartment on Marine Drive with panoramic Arabian Sea views." },
  { title:"Juhu Beach Villa",type:"Villa",status:"For Sale",priceRaw:3500000,address:"Juhu Beach Road",city:"Mumbai",beds:6,baths:6,area:5200,tag:"Beachfront",description:"Exclusive beachfront villa steps from Juhu beach. Stunning sunsets and private garden." },
  { title:"Powai Lake View",type:"Apartment",status:"For Rent",priceRaw:2100,address:"Hiranandani, Powai",city:"Mumbai",beds:2,baths:2,area:1150,tag:"Lake View",description:"Modern 2BHK apartment with stunning lake views in Hiranandani Gardens, Powai." },
  { title:"Worli Studio Flat",type:"Studio",status:"For Rent",priceRaw:1400,address:"Worli Sea Face",city:"Mumbai",beds:1,baths:1,area:620,tag:"City View",description:"Compact studio apartment in Worli, perfect for professionals. Sea-facing balcony." },
  { title:"Andheri Townhouse",type:"Townhouse",status:"For Sale",priceRaw:900000,address:"Andheri West",city:"Mumbai",beds:4,baths:3,area:2600,tag:"Spacious",description:"Independent townhouse with garden in Andheri West. Recently renovated with premium finishes." },
  { title:"Malad Duplex",type:"House",status:"For Sale",priceRaw:1200000,address:"Malad West",city:"Mumbai",beds:4,baths:4,area:3100,tag:"Duplex",description:"Stunning duplex villa with terrace garden and modern interiors in Malad West." },
  { title:"Dadar Heritage Flat",type:"Apartment",status:"For Rent",priceRaw:1800,address:"Dadar",city:"Mumbai",beds:2,baths:1,area:950,tag:"Heritage",description:"Classic pre-independence era building with modern renovation. Great connectivity." },
  { title:"Lutyens Bungalow",type:"Villa",status:"For Sale",priceRaw:8500000,address:"Lutyens Delhi Zone",city:"Delhi",beds:7,baths:8,area:9000,tag:"Heritage Zone",description:"Grand colonial bungalow in New Delhi's elite Lutyens zone with 1-acre gardens." },
  { title:"Vasant Vihar Penthouse",type:"Apartment",status:"For Sale",priceRaw:2200000,address:"Vasant Vihar",city:"Delhi",beds:4,baths:4,area:3800,tag:"Penthouse",description:"Stunning penthouse with 360° views of Delhi. Private terrace and jacuzzi." },
  { title:"GK-II Studio",type:"Studio",status:"For Rent",priceRaw:900,address:"GK-II Market",city:"Delhi",beds:1,baths:1,area:520,tag:"City Center",description:"Modern studio apartment in South Delhi's prime GK-II neighbourhood near metro." },
  { title:"Defence Colony House",type:"House",status:"For Sale",priceRaw:3100000,address:"Defence Colony",city:"Delhi",beds:5,baths:5,area:4200,tag:"Prime Location",description:"Independent house in South Delhi's coveted Defence Colony. Large plot with parking." },
  { title:"Dwarka Family Apartment",type:"Apartment",status:"For Rent",priceRaw:1100,address:"Sector 10, Dwarka",city:"Delhi",beds:3,baths:2,area:1400,tag:"Spacious",description:"Well-maintained 3BHK in Dwarka Sector 10. Close to schools, market, and metro." },
  { title:"Saket Loft",type:"Loft",status:"For Rent",priceRaw:1600,address:"Saket",city:"Delhi",beds:2,baths:2,area:1100,tag:"Modern",description:"Industrial-chic loft in Saket, minutes from Select Citywalk. High ceilings, exposed brick." },
  { title:"Hauz Khas Farmhouse",type:"Villa",status:"For Sale",priceRaw:5200000,address:"Hauz Khas Village",city:"Delhi",beds:6,baths:7,area:6800,tag:"Farmhouse",description:"Stunning farmhouse on the outskirts of Hauz Khas Village with forest views and pool." },
  { title:"Koramangala Corner House",type:"House",status:"For Sale",priceRaw:980000,address:"Koramangala 5th Block",city:"Bangalore",beds:4,baths:3,area:2800,tag:"Corner Plot",description:"Beautiful corner house in the heart of Koramangala. Lush garden and double garage." },
  { title:"Indiranagar Apartment",type:"Apartment",status:"For Rent",priceRaw:1700,address:"100 Feet Road, Indiranagar",city:"Bangalore",beds:2,baths:2,area:1100,tag:"Trendy Locale",description:"Sleek 2BHK in Indiranagar, Bangalore's trendiest neighbourhood. Walk to cafes." },
  { title:"Whitefield Tech Villa",type:"Villa",status:"For Sale",priceRaw:1600000,address:"Whitefield",city:"Bangalore",beds:5,baths:5,area:4300,tag:"Tech Hub",description:"Premium villa in Whitefield near ITPL and Prestige Tech Park. Smart home features." },
  { title:"Jayanagar Classic Home",type:"House",status:"For Sale",priceRaw:750000,address:"Jayanagar 4th Block",city:"Bangalore",beds:3,baths:3,area:2200,tag:"Classic",description:"Traditional Bangalore home with modern interiors in old Jayanagar. Peaceful street." },
  { title:"Electronic City Studio",type:"Studio",status:"For Rent",priceRaw:600,address:"Electronic City Phase 1",city:"Bangalore",beds:1,baths:1,area:450,tag:"IT Zone",description:"Compact furnished studio near Electronic City tech park. Ideal for IT professionals." },
  { title:"HSR Layout Duplex",type:"House",status:"For Sale",priceRaw:1100000,address:"HSR Layout Sector 4",city:"Bangalore",beds:4,baths:4,area:3000,tag:"Duplex",description:"Elegant duplex in HSR Layout with terrace and private parking. Premium fittings." },
  { title:"Park Street Heritage Flat",type:"Apartment",status:"For Rent",priceRaw:1200,address:"Park Street",city:"Kolkata",beds:3,baths:2,area:1700,tag:"Heritage",description:"Gorgeous heritage apartment on iconic Park Street. High ceilings, mosaic floors." },
  { title:"Alipore Mansion",type:"Villa",status:"For Sale",priceRaw:4100000,address:"Alipore Road",city:"Kolkata",beds:8,baths:8,area:9500,tag:"Mansion",description:"Grand colonial mansion in exclusive Alipore. Sprawling grounds and ballroom." },
  { title:"New Town Smart Flat",type:"Apartment",status:"For Rent",priceRaw:850,address:"Action Area I, New Town",city:"Kolkata",beds:2,baths:2,area:1000,tag:"Smart Home",description:"Modern smart apartment in New Town with IoT controls and EV charging." },
  { title:"Ballygunge Townhouse",type:"Townhouse",status:"For Sale",priceRaw:680000,address:"Ballygunge",city:"Kolkata",beds:4,baths:3,area:2600,tag:"Classic",description:"Victorian-era townhouse beautifully restored in upscale Ballygunge." },
  { title:"Salt Lake Studio",type:"Studio",status:"For Rent",priceRaw:550,address:"Salt Lake Sector V",city:"Kolkata",beds:1,baths:1,area:480,tag:"IT Hub",description:"Furnished studio in Salt Lake Sector V, walking distance to major IT companies." },
  { title:"Rajarhat Lakeside Villa",type:"Villa",status:"For Sale",priceRaw:1400000,address:"Rajarhat New Town",city:"Kolkata",beds:5,baths:5,area:4100,tag:"Lakeside",description:"Contemporary villa with lakeside views in Rajarhat. Infinity pool and landscaped gardens." },
  { title:"Palm Jumeirah Garden Villa",type:"Villa",status:"For Sale",priceRaw:3400000,address:"Palm Jumeirah",city:"Dubai",beds:6,baths:7,area:6200,tag:"Pool",description:"Spectacular Palm Jumeirah villa with private beach access and panoramic sea views." },
  { title:"Marina Bay Luxury Apt",type:"Apartment",status:"For Rent",priceRaw:5200,address:"Marina Bay",city:"Dubai",beds:2,baths:2,area:1450,tag:"Premium",description:"Stunning marina-view apartment with floor-to-ceiling glass and 5-star amenities." },
  { title:"Downtown Burj View Penthouse",type:"Apartment",status:"For Sale",priceRaw:4800000,address:"Downtown Dubai",city:"Dubai",beds:4,baths:5,area:4200,tag:"Burj View",description:"Ultra-luxury penthouse with direct Burj Khalifa views and private rooftop terrace." },
  { title:"Jumeirah Beach Residence",type:"Apartment",status:"For Rent",priceRaw:4100,address:"JBR Walk",city:"Dubai",beds:3,baths:3,area:2100,tag:"Beachfront",description:"Premium beachfront apartment on JBR Walk. Direct beach access and sea views." },
  { title:"Emirates Hills Mansion",type:"Villa",status:"For Sale",priceRaw:12000000,address:"Emirates Hills",city:"Dubai",beds:8,baths:10,area:12000,tag:"Ultra Luxury",description:"Iconic Emirates Hills mansion with golf course views and bespoke finishes." },
  { title:"Business Bay Studio",type:"Studio",status:"For Rent",priceRaw:1800,address:"Business Bay",city:"Dubai",beds:1,baths:1,area:550,tag:"City View",description:"Smart studio in Business Bay with canal views. 15-minute walk to Dubai Mall." },
  { title:"Arabian Ranches Villa",type:"Villa",status:"For Sale",priceRaw:2100000,address:"Arabian Ranches 3",city:"Dubai",beds:5,baths:6,area:5600,tag:"Golf View",description:"Contemporary villa in Arabian Ranches with golf course frontage. Community pool." },
  { title:"DIFC Luxury Apartment",type:"Apartment",status:"For Rent",priceRaw:6500,address:"DIFC",city:"Dubai",beds:3,baths:3,area:2300,tag:"Financial District",description:"Executive apartment in DIFC. Concierge, gym, and sky lounge included." },
  { title:"Kensington Georgian Townhouse",type:"Townhouse",status:"For Sale",priceRaw:5200000,address:"Kensington W8",city:"London",beds:6,baths:5,area:5100,tag:"Heritage",description:"Magnificent Grade II listed Georgian townhouse in Royal Borough of Kensington." },
  { title:"Canary Wharf High-Rise",type:"Apartment",status:"For Rent",priceRaw:4800,address:"Canary Wharf, E14",city:"London",beds:2,baths:2,area:1000,tag:"City View",description:"Modern high-rise apartment with spectacular City of London views and concierge." },
  { title:"Chelsea Riverside Flat",type:"Apartment",status:"For Sale",priceRaw:2800000,address:"Chelsea SW3",city:"London",beds:3,baths:3,area:1800,tag:"Thames View",description:"Stunning riverside apartment overlooking the Thames in fashionable Chelsea." },
  { title:"Notting Hill Terrace",type:"Townhouse",status:"For Sale",priceRaw:3600000,address:"Notting Hill W11",city:"London",beds:5,baths:4,area:3400,tag:"Iconic",description:"Quintessential Notting Hill terraced house with original features and contemporary extension." },
  { title:"Shoreditch Loft",type:"Loft",status:"For Rent",priceRaw:3100,address:"Shoreditch, E1",city:"London",beds:2,baths:1,area:1100,tag:"Industrial Chic",description:"Converted warehouse loft in trendy Shoreditch. Exposed beams, roof terrace." },
  { title:"Mayfair Studio Pied-à-Terre",type:"Studio",status:"For Rent",priceRaw:3800,address:"Mayfair W1",city:"London",beds:1,baths:1,area:450,tag:"Ultra Prime",description:"Elegant pied-à-terre in ultra-prime Mayfair. Doorman and private courtyard garden." },
  { title:"Hampstead Heath House",type:"House",status:"For Sale",priceRaw:4200000,address:"Hampstead NW3",city:"London",beds:5,baths:5,area:4800,tag:"Heath Views",description:"Magnificent Edwardian family home overlooking Hampstead Heath. Cinema room and gym." },
  { title:"Brixton Urban Apartment",type:"Apartment",status:"For Rent",priceRaw:2200,address:"Brixton SW9",city:"London",beds:2,baths:1,area:780,tag:"Trendy",description:"Contemporary apartment in vibrant Brixton with rooftop terrace and skyline views." },
  { title:"Fifth Avenue Penthouse",type:"Apartment",status:"For Sale",priceRaw:18500000,address:"Fifth Avenue, Manhattan",city:"New York",beds:5,baths:6,area:6500,tag:"Ultra Luxury",description:"Palatial full-floor penthouse on Fifth Avenue overlooking Central Park." },
  { title:"Brooklyn Brownstone",type:"House",status:"For Sale",priceRaw:3200000,address:"Park Slope, Brooklyn",city:"New York",beds:5,baths:4,area:4100,tag:"Classic NY",description:"Immaculate 4-storey brownstone in coveted Park Slope. Garden and parlour floor." },
  { title:"Midtown Studio",type:"Studio",status:"For Rent",priceRaw:3400,address:"Midtown Manhattan",city:"New York",beds:1,baths:1,area:520,tag:"City Center",description:"Compact studio in the heart of Midtown. Steps from Times Square and Central Park." },
  { title:"TriBeCa Loft",type:"Loft",status:"For Sale",priceRaw:5800000,address:"TriBeCa, Manhattan",city:"New York",beds:3,baths:3,area:3200,tag:"Artist Loft",description:"Iconic TriBeCa loft in converted 1920s warehouse. 14-foot ceilings, timber floors." },
  { title:"Williamsburg Apartment",type:"Apartment",status:"For Rent",priceRaw:4200,address:"Williamsburg, Brooklyn",city:"New York",beds:2,baths:2,area:1000,tag:"Hip",description:"Stylish Williamsburg apartment with rooftop access and Manhattan skyline views." },
  { title:"Upper West Side Classic",type:"Apartment",status:"For Sale",priceRaw:2600000,address:"Upper West Side, Manhattan",city:"New York",beds:4,baths:3,area:2200,tag:"Pre-War",description:"Pre-war classic on the Upper West Side. Original details, renovated kitchen and baths." },
  { title:"Harlem Row House",type:"House",status:"For Sale",priceRaw:1800000,address:"Harlem, Manhattan",city:"New York",beds:4,baths:3,area:2900,tag:"Historical",description:"Beautifully restored historic row house in Harlem. Original brownstone facade." },
  { title:"Financial District Rental",type:"Apartment",status:"For Rent",priceRaw:5100,address:"Financial District, Manhattan",city:"New York",beds:2,baths:2,area:1150,tag:"Wall St",description:"Sleek apartment in the Financial District with views of New York Harbor." },
  { title:"Orchard Road Penthouse",type:"Apartment",status:"For Sale",priceRaw:7200000,address:"Orchard Road",city:"Singapore",beds:4,baths:5,area:4500,tag:"Prime District",description:"Spectacular penthouse on Singapore's most prestigious shopping boulevard." },
  { title:"Sentosa Cove Villa",type:"Villa",status:"For Sale",priceRaw:12000000,address:"Sentosa Cove",city:"Singapore",beds:6,baths:7,area:8200,tag:"Waterfront",description:"Ultra-luxury Sentosa Cove villa with private marina berth and 24-hour security." },
  { title:"Marina Bay Studio",type:"Studio",status:"For Rent",priceRaw:2800,address:"Marina Bay",city:"Singapore",beds:1,baths:1,area:520,tag:"Bay View",description:"Modern studio in Marina Bay district. Walking distance to MBS and Gardens by the Bay." },
  { title:"Holland Village Terrace",type:"Townhouse",status:"For Sale",priceRaw:4400000,address:"Holland Village",city:"Singapore",beds:4,baths:4,area:3600,tag:"Expat Favourite",description:"Charming terrace house in expatriate-favourite Holland Village. Serene private garden." },
  { title:"Buona Vista Apartment",type:"Apartment",status:"For Rent",priceRaw:3500,address:"Buona Vista",city:"Singapore",beds:3,baths:2,area:1350,tag:"Near One-North",description:"Modern apartment near One-North tech hub. MRT connectivity and mall access." },
  { title:"Tanjong Pagar Loft",type:"Loft",status:"For Rent",priceRaw:3200,address:"Tanjong Pagar",city:"Singapore",beds:2,baths:2,area:1050,tag:"CBD Adjacent",description:"Contemporary loft in the CBD-adjacent Tanjong Pagar neighbourhood with skyline views." },
  { title:"East Coast Bungalow",type:"Villa",status:"For Sale",priceRaw:6800000,address:"East Coast Road",city:"Singapore",beds:5,baths:6,area:6500,tag:"Landed",description:"Rare detached bungalow on East Coast Road. Tropical pool garden and sea breeze." },
  { title:"Modern Glass Villa",type:"Villa",status:"For Sale",priceRaw:1250000,address:"Beverly Hills, CA 90210",city:"Los Angeles",beds:5,baths:4,area:4200,tag:"New Listing",description:"Architecturally stunning glass villa in Beverly Hills. Infinity pool and canyon views." },
  { title:"Coastal Beach House",type:"House",status:"For Sale",priceRaw:875000,address:"Malibu, CA 90265",city:"Los Angeles",beds:4,baths:3,area:2800,tag:"Sea View",description:"Charming Malibu beach house steps from the sand. Wraparound deck with Pacific views." },
  { title:"Hollywood Hills Retreat",type:"House",status:"For Sale",priceRaw:2100000,address:"Hollywood Hills, CA",city:"Los Angeles",beds:4,baths:4,area:3500,tag:"City Lights",description:"Stunning Hollywood Hills hideaway with LA basin views. Infinity pool." },
  { title:"Silver Lake Bungalow",type:"House",status:"For Rent",priceRaw:4800,address:"Silver Lake, Los Angeles",city:"Los Angeles",beds:3,baths:2,area:1600,tag:"Hip",description:"Stylish Silver Lake bungalow with drought-tolerant garden and modern open-plan kitchen." },
  { title:"South Beach Condo",type:"Apartment",status:"For Rent",priceRaw:3600,address:"South Beach, Miami, FL",city:"Miami",beds:2,baths:2,area:1050,tag:"Ocean Drive",description:"Chic South Beach condo minutes from Ocean Drive. Pool, gym, and covered parking." },
  { title:"Brickell Sky Penthouse",type:"Apartment",status:"For Sale",priceRaw:3400000,address:"Brickell, Miami, FL",city:"Miami",beds:4,baths:5,area:4100,tag:"Sky High",description:"Glass-walled penthouse atop a Brickell tower with 360° views of Biscayne Bay." },
  { title:"Mountain Retreat Cabin",type:"Cabin",status:"For Sale",priceRaw:620000,address:"Aspen, Colorado 81611",city:"Aspen",beds:3,baths:2,area:1900,tag:"Mountain",description:"Cosy Aspen ski cabin with ski-in/ski-out access. Stone fireplace and hot tub." },
  { title:"Snowmass Valley Estate",type:"Villa",status:"For Sale",priceRaw:5600000,address:"Snowmass Village, CO",city:"Aspen",beds:6,baths:7,area:7200,tag:"Ski Estate",description:"Magnificent mountain estate with private ski trail, heated drive, and wine cellar." },
  { title:"Sydney Harbour View",type:"Apartment",status:"For Sale",priceRaw:2800000,address:"Kirribilli, Sydney",city:"Sydney",beds:3,baths:2,area:1400,tag:"Harbour View",description:"Rare apartment with iconic Harbour Bridge and Opera House views. Two car garage." },
  { title:"Bondi Beach Penthouse",type:"Apartment",status:"For Sale",priceRaw:4200000,address:"Bondi Beach, NSW",city:"Sydney",beds:3,baths:3,area:2100,tag:"Beachfront",description:"Spectacular Bondi Beach penthouse with direct beach access and rooftop entertaining." },
  { title:"Montmartre Artist Flat",type:"Apartment",status:"For Rent",priceRaw:2600,address:"Montmartre, Paris 18ème",city:"Paris",beds:2,baths:1,area:750,tag:"Artistic",description:"Charming Haussmann apartment in Montmartre. Parquet floors and ornate fireplace." },
  { title:"Le Marais Loft",type:"Loft",status:"For Sale",priceRaw:1850000,address:"Le Marais, Paris 3ème",city:"Paris",beds:2,baths:2,area:1200,tag:"Design Quarter",description:"Stunning converted loft in historic Le Marais. Industrial elements with luxury finishes." },
];

// ─── Generate full dataset ────────────────────────────────────────────────────
export const properties = seed.map((p, i) => ({
  id: i + 1,
  ...p,
  price: p.status === "For Rent" ? rentFmt(p.priceRaw) : fmt(p.priceRaw),
  image: img(i),
  featured: i < 8,
  propertyType: p.type,
  bedrooms: p.beds,
  bathrooms: p.baths,
  location: p.address,
}));

// ─── Locations ────────────────────────────────────────────────────────────────
export const locations = [
  { id:1, city:"Mumbai",    country:"India",     count:properties.filter(p=>p.city==="Mumbai").length,    image:"https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&q=80" },
  { id:2, city:"Delhi",     country:"India",     count:properties.filter(p=>p.city==="Delhi").length,     image:"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80" },
  { id:3, city:"Bangalore", country:"India",     count:properties.filter(p=>p.city==="Bangalore").length, image:"https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80" },
  { id:4, city:"Kolkata",   country:"India",     count:properties.filter(p=>p.city==="Kolkata").length,   image:"https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80" },
  { id:5, city:"Dubai",     country:"UAE",       count:properties.filter(p=>p.city==="Dubai").length,     image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
  { id:6, city:"London",    country:"UK",        count:properties.filter(p=>p.city==="London").length,    image:"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
  { id:7, city:"New York",  country:"USA",       count:properties.filter(p=>p.city==="New York").length,  image:"https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?w=600&q=80" },
  { id:8, city:"Singapore", country:"Singapore", count:properties.filter(p=>p.city==="Singapore").length, image:"https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80" },
];

// ─── Agents ───────────────────────────────────────────────────────────────────
export const agents = [
  { id:1, name:"Sarah Mitchell", specialty:"Luxury Properties",       listings:48, rating:4.9, reviews:127, phone:"+1 (555) 234-5678", image:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80" },
  { id:2, name:"James Okafor",   specialty:"Commercial & Residential", listings:62, rating:4.8, reviews:203, phone:"+1 (555) 345-6789", image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80" },
  { id:3, name:"Priya Sharma",   specialty:"Investment Properties",    listings:35, rating:4.9, reviews:89,  phone:"+1 (555) 456-7890", image:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
  { id:4, name:"Marcus Chen",    specialty:"First-Time Buyers",        listings:54, rating:4.7, reviews:165, phone:"+1 (555) 567-8901", image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
];
