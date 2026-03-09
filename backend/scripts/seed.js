// ─────────────────────────────────────────────────────────────────────────────
//  node scripts/seed.js
//  Seeds MongoDB with a demo user + all 70 properties from the frontend dataset
// ─────────────────────────────────────────────────────────────────────────────
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("../models/User");
const Property = require("../models/Property");

// ── Image pool ────────────────────────────────────────────────────────────────
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

// ── Seed data (matches frontend) ──────────────────────────────────────────────
const SEED_PROPERTIES = [
  {title:"Smart Home Estate",propertyType:"Villa",status:"For Sale",price:4800000,location:"Bandra West",city:"Mumbai",bedrooms:5,bathrooms:5,area:4800,tag:"Smart Home",description:"Fully automated luxury villa in Mumbai's most prestigious neighbourhood with rooftop pool."},
  {title:"Sea-Facing Apartment",propertyType:"Apartment",status:"For Rent",price:3200,location:"Marine Drive",city:"Mumbai",bedrooms:3,bathrooms:2,area:1600,tag:"Sea View",description:"Breathtaking sea-facing apartment on Marine Drive with panoramic Arabian Sea views."},
  {title:"Juhu Beach Villa",propertyType:"Villa",status:"For Sale",price:3500000,location:"Juhu Beach Road",city:"Mumbai",bedrooms:6,bathrooms:6,area:5200,tag:"Beachfront",description:"Exclusive beachfront villa steps from Juhu beach. Stunning sunsets and private garden."},
  {title:"Powai Lake View",propertyType:"Apartment",status:"For Rent",price:2100,location:"Hiranandani, Powai",city:"Mumbai",bedrooms:2,bathrooms:2,area:1150,tag:"Lake View",description:"Modern 2BHK apartment with stunning lake views in Hiranandani Gardens, Powai."},
  {title:"Worli Studio Flat",propertyType:"Studio",status:"For Rent",price:1400,location:"Worli Sea Face",city:"Mumbai",bedrooms:1,bathrooms:1,area:620,tag:"City View",description:"Compact studio apartment in Worli, perfect for professionals. Sea-facing balcony."},
  {title:"Andheri Townhouse",propertyType:"Townhouse",status:"For Sale",price:900000,location:"Andheri West",city:"Mumbai",bedrooms:4,bathrooms:3,area:2600,tag:"Spacious",description:"Independent townhouse with garden in Andheri West. Recently renovated with premium finishes."},
  {title:"Malad Duplex",propertyType:"House",status:"For Sale",price:1200000,location:"Malad West",city:"Mumbai",bedrooms:4,bathrooms:4,area:3100,tag:"Duplex",description:"Stunning duplex villa with terrace garden and modern interiors in Malad West."},
  {title:"Dadar Heritage Flat",propertyType:"Apartment",status:"For Rent",price:1800,location:"Dadar",city:"Mumbai",bedrooms:2,bathrooms:1,area:950,tag:"Heritage",description:"Classic pre-independence era building with modern renovation. Great connectivity."},
  {title:"Lutyens Bungalow",propertyType:"Villa",status:"For Sale",price:8500000,location:"Lutyens Delhi Zone",city:"Delhi",bedrooms:7,bathrooms:8,area:9000,tag:"Heritage Zone",description:"Grand colonial bungalow in New Delhi's elite Lutyens zone with 1-acre gardens."},
  {title:"Vasant Vihar Penthouse",propertyType:"Apartment",status:"For Sale",price:2200000,location:"Vasant Vihar",city:"Delhi",bedrooms:4,bathrooms:4,area:3800,tag:"Penthouse",description:"Stunning penthouse with 360° views of Delhi. Private terrace and jacuzzi."},
  {title:"GK-II Studio",propertyType:"Studio",status:"For Rent",price:900,location:"GK-II Market",city:"Delhi",bedrooms:1,bathrooms:1,area:520,tag:"City Center",description:"Modern studio apartment in South Delhi's prime GK-II neighbourhood near metro."},
  {title:"Defence Colony House",propertyType:"House",status:"For Sale",price:3100000,location:"Defence Colony",city:"Delhi",bedrooms:5,bathrooms:5,area:4200,tag:"Prime Location",description:"Independent house in South Delhi's coveted Defence Colony. Large plot with parking."},
  {title:"Dwarka Family Apartment",propertyType:"Apartment",status:"For Rent",price:1100,location:"Sector 10, Dwarka",city:"Delhi",bedrooms:3,bathrooms:2,area:1400,tag:"Spacious",description:"Well-maintained 3BHK in Dwarka Sector 10. Close to schools, market, and metro."},
  {title:"Saket Loft",propertyType:"Loft",status:"For Rent",price:1600,location:"Saket",city:"Delhi",bedrooms:2,bathrooms:2,area:1100,tag:"Modern",description:"Industrial-chic loft in Saket, minutes from Select Citywalk. High ceilings, exposed brick."},
  {title:"Hauz Khas Farmhouse",propertyType:"Villa",status:"For Sale",price:5200000,location:"Hauz Khas Village",city:"Delhi",bedrooms:6,bathrooms:7,area:6800,tag:"Farmhouse",description:"Stunning farmhouse on the outskirts of Hauz Khas Village with forest views and pool."},
  {title:"Koramangala Corner House",propertyType:"House",status:"For Sale",price:980000,location:"Koramangala 5th Block",city:"Bangalore",bedrooms:4,bathrooms:3,area:2800,tag:"Corner Plot",description:"Beautiful corner house in the heart of Koramangala. Lush garden and double garage."},
  {title:"Indiranagar Apartment",propertyType:"Apartment",status:"For Rent",price:1700,location:"100 Feet Road, Indiranagar",city:"Bangalore",bedrooms:2,bathrooms:2,area:1100,tag:"Trendy Locale",description:"Sleek 2BHK in Indiranagar, Bangalore's trendiest neighbourhood. Walk to cafes."},
  {title:"Whitefield Tech Villa",propertyType:"Villa",status:"For Sale",price:1600000,location:"Whitefield",city:"Bangalore",bedrooms:5,bathrooms:5,area:4300,tag:"Tech Hub",description:"Premium villa in Whitefield near ITPL and Prestige Tech Park. Smart home features."},
  {title:"Jayanagar Classic Home",propertyType:"House",status:"For Sale",price:750000,location:"Jayanagar 4th Block",city:"Bangalore",bedrooms:3,bathrooms:3,area:2200,tag:"Classic",description:"Traditional Bangalore home with modern interiors in old Jayanagar. Peaceful street."},
  {title:"Electronic City Studio",propertyType:"Studio",status:"For Rent",price:600,location:"Electronic City Phase 1",city:"Bangalore",bedrooms:1,bathrooms:1,area:450,tag:"IT Zone",description:"Compact furnished studio near Electronic City tech park. Ideal for IT professionals."},
  {title:"HSR Layout Duplex",propertyType:"House",status:"For Sale",price:1100000,location:"HSR Layout Sector 4",city:"Bangalore",bedrooms:4,bathrooms:4,area:3000,tag:"Duplex",description:"Elegant duplex in HSR Layout with terrace and private parking. Premium fittings."},
  {title:"Park Street Heritage Flat",propertyType:"Apartment",status:"For Rent",price:1200,location:"Park Street",city:"Kolkata",bedrooms:3,bathrooms:2,area:1700,tag:"Heritage",description:"Gorgeous heritage apartment on iconic Park Street. High ceilings, mosaic floors."},
  {title:"Alipore Mansion",propertyType:"Villa",status:"For Sale",price:4100000,location:"Alipore Road",city:"Kolkata",bedrooms:8,bathrooms:8,area:9500,tag:"Mansion",description:"Grand colonial mansion in exclusive Alipore. Sprawling grounds and ballroom."},
  {title:"New Town Smart Flat",propertyType:"Apartment",status:"For Rent",price:850,location:"Action Area I, New Town",city:"Kolkata",bedrooms:2,bathrooms:2,area:1000,tag:"Smart Home",description:"Modern smart apartment in New Town with IoT controls and EV charging."},
  {title:"Ballygunge Townhouse",propertyType:"Townhouse",status:"For Sale",price:680000,location:"Ballygunge",city:"Kolkata",bedrooms:4,bathrooms:3,area:2600,tag:"Classic",description:"Victorian-era townhouse beautifully restored in upscale Ballygunge."},
  {title:"Salt Lake Studio",propertyType:"Studio",status:"For Rent",price:550,location:"Salt Lake Sector V",city:"Kolkata",bedrooms:1,bathrooms:1,area:480,tag:"IT Hub",description:"Furnished studio in Salt Lake Sector V, walking distance to major IT companies."},
  {title:"Rajarhat Lakeside Villa",propertyType:"Villa",status:"For Sale",price:1400000,location:"Rajarhat New Town",city:"Kolkata",bedrooms:5,bathrooms:5,area:4100,tag:"Lakeside",description:"Contemporary villa with lakeside views in Rajarhat. Infinity pool and landscaped gardens."},
  {title:"Palm Jumeirah Garden Villa",propertyType:"Villa",status:"For Sale",price:3400000,location:"Palm Jumeirah",city:"Dubai",bedrooms:6,bathrooms:7,area:6200,tag:"Pool",description:"Spectacular Palm Jumeirah villa with private beach access and panoramic sea views."},
  {title:"Marina Bay Luxury Apt",propertyType:"Apartment",status:"For Rent",price:5200,location:"Marina Bay",city:"Dubai",bedrooms:2,bathrooms:2,area:1450,tag:"Premium",description:"Stunning marina-view apartment with floor-to-ceiling glass and 5-star amenities."},
  {title:"Downtown Burj View Penthouse",propertyType:"Apartment",status:"For Sale",price:4800000,location:"Downtown Dubai",city:"Dubai",bedrooms:4,bathrooms:5,area:4200,tag:"Burj View",description:"Ultra-luxury penthouse with direct Burj Khalifa views and private rooftop terrace."},
  {title:"Jumeirah Beach Residence",propertyType:"Apartment",status:"For Rent",price:4100,location:"JBR Walk",city:"Dubai",bedrooms:3,bathrooms:3,area:2100,tag:"Beachfront",description:"Premium beachfront apartment on JBR Walk. Direct beach access and sea views."},
  {title:"Emirates Hills Mansion",propertyType:"Villa",status:"For Sale",price:12000000,location:"Emirates Hills",city:"Dubai",bedrooms:8,bathrooms:10,area:12000,tag:"Ultra Luxury",description:"Iconic Emirates Hills mansion with golf course views and bespoke finishes."},
  {title:"Business Bay Studio",propertyType:"Studio",status:"For Rent",price:1800,location:"Business Bay",city:"Dubai",bedrooms:1,bathrooms:1,area:550,tag:"City View",description:"Smart studio in Business Bay with canal views. 15-minute walk to Dubai Mall."},
  {title:"Arabian Ranches Villa",propertyType:"Villa",status:"For Sale",price:2100000,location:"Arabian Ranches 3",city:"Dubai",bedrooms:5,bathrooms:6,area:5600,tag:"Golf View",description:"Contemporary villa in Arabian Ranches with golf course frontage. Community pool."},
  {title:"DIFC Luxury Apartment",propertyType:"Apartment",status:"For Rent",price:6500,location:"DIFC",city:"Dubai",bedrooms:3,bathrooms:3,area:2300,tag:"Financial District",description:"Executive apartment in DIFC. Concierge, gym, and sky lounge included."},
  {title:"Kensington Georgian Townhouse",propertyType:"Townhouse",status:"For Sale",price:5200000,location:"Kensington W8",city:"London",bedrooms:6,bathrooms:5,area:5100,tag:"Heritage",description:"Magnificent Grade II listed Georgian townhouse in Royal Borough of Kensington."},
  {title:"Canary Wharf High-Rise",propertyType:"Apartment",status:"For Rent",price:4800,location:"Canary Wharf, E14",city:"London",bedrooms:2,bathrooms:2,area:1000,tag:"City View",description:"Modern high-rise apartment with spectacular City of London views and concierge."},
  {title:"Chelsea Riverside Flat",propertyType:"Apartment",status:"For Sale",price:2800000,location:"Chelsea SW3",city:"London",bedrooms:3,bathrooms:3,area:1800,tag:"Thames View",description:"Stunning riverside apartment overlooking the Thames in fashionable Chelsea."},
  {title:"Notting Hill Terrace",propertyType:"Townhouse",status:"For Sale",price:3600000,location:"Notting Hill W11",city:"London",bedrooms:5,bathrooms:4,area:3400,tag:"Iconic",description:"Quintessential Notting Hill terraced house with original features and contemporary extension."},
  {title:"Shoreditch Loft",propertyType:"Loft",status:"For Rent",price:3100,location:"Shoreditch, E1",city:"London",bedrooms:2,bathrooms:1,area:1100,tag:"Industrial Chic",description:"Converted warehouse loft in trendy Shoreditch. Exposed beams, roof terrace."},
  {title:"Mayfair Studio Pied-à-Terre",propertyType:"Studio",status:"For Rent",price:3800,location:"Mayfair W1",city:"London",bedrooms:1,bathrooms:1,area:450,tag:"Ultra Prime",description:"Elegant pied-à-terre in ultra-prime Mayfair. Doorman and private courtyard garden."},
  {title:"Hampstead Heath House",propertyType:"House",status:"For Sale",price:4200000,location:"Hampstead NW3",city:"London",bedrooms:5,bathrooms:5,area:4800,tag:"Heath Views",description:"Magnificent Edwardian family home overlooking Hampstead Heath. Cinema room and gym."},
  {title:"Brixton Urban Apartment",propertyType:"Apartment",status:"For Rent",price:2200,location:"Brixton SW9",city:"London",bedrooms:2,bathrooms:1,area:780,tag:"Trendy",description:"Contemporary apartment in vibrant Brixton with rooftop terrace and skyline views."},
  {title:"Fifth Avenue Penthouse",propertyType:"Apartment",status:"For Sale",price:18500000,location:"Fifth Avenue, Manhattan",city:"New York",bedrooms:5,bathrooms:6,area:6500,tag:"Ultra Luxury",description:"Palatial full-floor penthouse on Fifth Avenue overlooking Central Park."},
  {title:"Brooklyn Brownstone",propertyType:"House",status:"For Sale",price:3200000,location:"Park Slope, Brooklyn",city:"New York",bedrooms:5,bathrooms:4,area:4100,tag:"Classic NY",description:"Immaculate 4-storey brownstone in coveted Park Slope. Garden and parlour floor."},
  {title:"Midtown Studio",propertyType:"Studio",status:"For Rent",price:3400,location:"Midtown Manhattan",city:"New York",bedrooms:1,bathrooms:1,area:520,tag:"City Center",description:"Compact studio in the heart of Midtown. Steps from Times Square and Central Park."},
  {title:"TriBeCa Loft",propertyType:"Loft",status:"For Sale",price:5800000,location:"TriBeCa, Manhattan",city:"New York",bedrooms:3,bathrooms:3,area:3200,tag:"Artist Loft",description:"Iconic TriBeCa loft in converted 1920s warehouse. 14-foot ceilings, timber floors."},
  {title:"Williamsburg Apartment",propertyType:"Apartment",status:"For Rent",price:4200,location:"Williamsburg, Brooklyn",city:"New York",bedrooms:2,bathrooms:2,area:1000,tag:"Hip",description:"Stylish Williamsburg apartment with rooftop access and Manhattan skyline views."},
  {title:"Upper West Side Classic",propertyType:"Apartment",status:"For Sale",price:2600000,location:"Upper West Side, Manhattan",city:"New York",bedrooms:4,bathrooms:3,area:2200,tag:"Pre-War",description:"Pre-war classic on the Upper West Side. Original details, renovated kitchen and baths."},
  {title:"Harlem Row House",propertyType:"House",status:"For Sale",price:1800000,location:"Harlem, Manhattan",city:"New York",bedrooms:4,bathrooms:3,area:2900,tag:"Historical",description:"Beautifully restored historic row house in Harlem. Original brownstone facade."},
  {title:"Financial District Rental",propertyType:"Apartment",status:"For Rent",price:5100,location:"Financial District, Manhattan",city:"New York",bedrooms:2,bathrooms:2,area:1150,tag:"Wall St",description:"Sleek apartment in the Financial District with views of New York Harbor."},
  {title:"Orchard Road Penthouse",propertyType:"Apartment",status:"For Sale",price:7200000,location:"Orchard Road",city:"Singapore",bedrooms:4,bathrooms:5,area:4500,tag:"Prime District",description:"Spectacular penthouse on Singapore's most prestigious shopping boulevard."},
  {title:"Sentosa Cove Villa",propertyType:"Villa",status:"For Sale",price:12000000,location:"Sentosa Cove",city:"Singapore",bedrooms:6,bathrooms:7,area:8200,tag:"Waterfront",description:"Ultra-luxury Sentosa Cove villa with private marina berth and 24-hour security."},
  {title:"Marina Bay Studio",propertyType:"Studio",status:"For Rent",price:2800,location:"Marina Bay",city:"Singapore",bedrooms:1,bathrooms:1,area:520,tag:"Bay View",description:"Modern studio in Marina Bay district. Walking distance to MBS and Gardens by the Bay."},
  {title:"Holland Village Terrace",propertyType:"Townhouse",status:"For Sale",price:4400000,location:"Holland Village",city:"Singapore",bedrooms:4,bathrooms:4,area:3600,tag:"Expat Favourite",description:"Charming terrace house in expatriate-favourite Holland Village. Serene private garden."},
  {title:"Buona Vista Apartment",propertyType:"Apartment",status:"For Rent",price:3500,location:"Buona Vista",city:"Singapore",bedrooms:3,bathrooms:2,area:1350,tag:"Near One-North",description:"Modern apartment near One-North tech hub. MRT connectivity and mall access."},
  {title:"Tanjong Pagar Loft",propertyType:"Loft",status:"For Rent",price:3200,location:"Tanjong Pagar",city:"Singapore",bedrooms:2,bathrooms:2,area:1050,tag:"CBD Adjacent",description:"Contemporary loft in the CBD-adjacent Tanjong Pagar neighbourhood with skyline views."},
  {title:"East Coast Bungalow",propertyType:"Villa",status:"For Sale",price:6800000,location:"East Coast Road",city:"Singapore",bedrooms:5,bathrooms:6,area:6500,tag:"Landed",description:"Rare detached bungalow on East Coast Road. Tropical pool garden and sea breeze."},
  {title:"Modern Glass Villa",propertyType:"Villa",status:"For Sale",price:1250000,location:"Beverly Hills, CA 90210",city:"Los Angeles",bedrooms:5,bathrooms:4,area:4200,tag:"New Listing",description:"Architecturally stunning glass villa in Beverly Hills. Infinity pool and canyon views."},
  {title:"Coastal Beach House",propertyType:"House",status:"For Sale",price:875000,location:"Malibu, CA 90265",city:"Los Angeles",bedrooms:4,bathrooms:3,area:2800,tag:"Sea View",description:"Charming Malibu beach house steps from the sand. Wraparound deck with Pacific views."},
  {title:"Hollywood Hills Retreat",propertyType:"House",status:"For Sale",price:2100000,location:"Hollywood Hills, CA",city:"Los Angeles",bedrooms:4,bathrooms:4,area:3500,tag:"City Lights",description:"Stunning Hollywood Hills hideaway with LA basin views. Infinity pool."},
  {title:"Silver Lake Bungalow",propertyType:"House",status:"For Rent",price:4800,location:"Silver Lake, Los Angeles",city:"Los Angeles",bedrooms:3,bathrooms:2,area:1600,tag:"Hip",description:"Stylish Silver Lake bungalow with drought-tolerant garden and modern open-plan kitchen."},
  {title:"South Beach Condo",propertyType:"Apartment",status:"For Rent",price:3600,location:"South Beach, Miami, FL",city:"Miami",bedrooms:2,bathrooms:2,area:1050,tag:"Ocean Drive",description:"Chic South Beach condo minutes from Ocean Drive. Pool, gym, and covered parking."},
  {title:"Brickell Sky Penthouse",propertyType:"Apartment",status:"For Sale",price:3400000,location:"Brickell, Miami, FL",city:"Miami",bedrooms:4,bathrooms:5,area:4100,tag:"Sky High",description:"Glass-walled penthouse atop a Brickell tower with 360° views of Biscayne Bay."},
  {title:"Mountain Retreat Cabin",propertyType:"Cabin",status:"For Sale",price:620000,location:"Aspen, Colorado 81611",city:"Aspen",bedrooms:3,bathrooms:2,area:1900,tag:"Mountain",description:"Cosy Aspen ski cabin with ski-in/ski-out access. Stone fireplace and hot tub."},
  {title:"Snowmass Valley Estate",propertyType:"Villa",status:"For Sale",price:5600000,location:"Snowmass Village, CO",city:"Aspen",bedrooms:6,bathrooms:7,area:7200,tag:"Ski Estate",description:"Magnificent mountain estate with private ski trail, heated drive, and wine cellar."},
  {title:"Sydney Harbour View",propertyType:"Apartment",status:"For Sale",price:2800000,location:"Kirribilli, Sydney",city:"Sydney",bedrooms:3,bathrooms:2,area:1400,tag:"Harbour View",description:"Rare apartment with iconic Harbour Bridge and Opera House views. Two car garage."},
  {title:"Bondi Beach Penthouse",propertyType:"Apartment",status:"For Sale",price:4200000,location:"Bondi Beach, NSW",city:"Sydney",bedrooms:3,bathrooms:3,area:2100,tag:"Beachfront",description:"Spectacular Bondi Beach penthouse with direct beach access and rooftop entertaining."},
  {title:"Montmartre Artist Flat",propertyType:"Apartment",status:"For Rent",price:2600,location:"Montmartre, Paris 18ème",city:"Paris",bedrooms:2,bathrooms:1,area:750,tag:"Artistic",description:"Charming Haussmann apartment in Montmartre. Parquet floors and ornate fireplace."},
  {title:"Le Marais Loft",propertyType:"Loft",status:"For Sale",price:1850000,location:"Le Marais, Paris 3ème",city:"Paris",bedrooms:2,bathrooms:2,area:1200,tag:"Design Quarter",description:"Stunning converted loft in historic Le Marais. Industrial elements with luxury finishes."},
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // ── Clean slate ──────────────────────────────────────────────────────────
    await Property.deleteMany({});
    await User.deleteMany({ email: "demo@househunt.com" });
    console.log("Cleared existing seed data");

    // ── Create demo user ─────────────────────────────────────────────────────
    const demoUser = await User.create({
      name:     "Demo User",
      email:    "demo@househunt.com",
      password: "demo1234",
      phone:    "555-0100",
      role:     "admin",
    });
    console.log(`Created demo user: ${demoUser.email}`);

    // ── Create properties ────────────────────────────────────────────────────
    const propertyDocs = SEED_PROPERTIES.map((p, i) => ({
      ...p,
      images:   [img(i), img(i + 10), img(i + 20)],
      featured: i < 8,
      owner:    demoUser._id,
    }));

    await Property.insertMany(propertyDocs);
    console.log(`✅  Inserted ${propertyDocs.length} properties`);

    console.log("\n─────────────────────────────────────");
    console.log("Seed complete!");
    console.log("Demo login:");
    console.log("  Email:    demo@househunt.com");
    console.log("  Password: demo1234");
    console.log("─────────────────────────────────────\n");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
