// ==========================================
// Full Listings Management Data
// ==========================================

export type ListingStatus = "Approved" | "Pending" | "Rejected"

export interface ListingItem {
  id: string
  name: string
  slug?: string
  category: string
  shortDescription?: string
  fullDescription?: string
  established?: string
  employees?: string
  gstin?: string
  tags?: string[]
  city: string
  state: string
  address: string
  pincode?: string
  latitude?: string
  longitude?: string
  phone: string
  secondaryPhone?: string
  whatsapp?: string
  email: string
  website?: string
  is24x7?: boolean
  openTime?: string
  closeTime?: string
  closedDays?: string[]
  logo?: string
  gallery?: string[]
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  plan?: "Free" | "Featured" | "Featured Pro"
  views?: number
  isActive?: boolean
  rating: number
  reviews: number
  status: ListingStatus
  ownerId: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  createdAt: string
  rejectionReason?: string
}

export const mockListings: ListingItem[] = [
  {
    id: "LST-1082",
    name: "Taj Mahal Palace Suites",
    slug: "taj-mahal-palace-suites",
    category: "Hotels & Stays",
    shortDescription: "Experience 5-star royal heritage overlooking Gateway of India in Mumbai.",
    fullDescription: "Iconic luxury heritage hotel overlooking the Gateway of India with world-class hospitality, fine dining restaurants, and majestic sea-facing suites.",
    established: "1903",
    employees: "200+",
    gstin: "27AAACT1234F1Z8",
    tags: ["hotel", "luxury", "mumbai", "gateway", "heritage", "seafacing", "suites"],
    city: "Mumbai",
    state: "Maharashtra",
    address: "Apollo Bunder, Colaba, Mumbai 400001",
    pincode: "400001",
    latitude: "18.9217",
    longitude: "72.8332",
    phone: "+91 22 6665 3366",
    secondaryPhone: "+91 22 6665 3367",
    whatsapp: "+91 98251 44320",
    email: "reservations@tajpalace.com",
    website: "https://tajhotels.com",
    is24x7: true,
    openTime: "12:00 AM",
    closeTime: "11:59 PM",
    closedDays: [],
    logo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=80",
    ],
    facebook: "https://facebook.com/tajmahalpalacemumbai",
    instagram: "https://instagram.com/tajhotels",
    twitter: "https://twitter.com/TajHotels",
    linkedin: "https://linkedin.com/company/taj-hotels",
    youtube: "https://youtube.com/@TajHotels",
    metaTitle: "Taj Mahal Palace Suites Mumbai | 5-Star Heritage Hotel",
    metaDescription: "Book majestic sea-facing suites at The Taj Mahal Palace Mumbai. Iconic luxury heritage and fine dining.",
    metaKeywords: "taj hotel mumbai, 5 star hotel colaba, luxury suites gateway of india",
    plan: "Featured Pro",
    views: 14280,
    isActive: true,
    rating: 4.9,
    reviews: 320,
    status: "Approved",
    ownerId: "USR-101",
    ownerName: "Rajesh Kothari",
    ownerEmail: "rajesh.k@gmail.com",
    ownerPhone: "+91 98251 44320",
    createdAt: "Oct 12, 2026",
  },
  {
    id: "LST-1081",
    name: "Apex Healthcare & Diagnostics",
    slug: "apex-healthcare-diagnostics",
    category: "Health & Medical",
    shortDescription: "NABH-accredited multi-speciality diagnostic hospital in Indiranagar, Bengaluru.",
    fullDescription: "NABH-accredited multi-speciality diagnostic hospital offering comprehensive health checkups, modern MRI/CT scans, and 24/7 emergency response.",
    established: "2016",
    employees: "51-200",
    gstin: "29AAACA9876C1Z3",
    tags: ["hospital", "diagnostics", "mri", "health", "bengaluru", "emergency"],
    city: "Bengaluru",
    state: "Karnataka",
    address: "14th Main Rd, Indiranagar, Bengaluru 560038",
    pincode: "560038",
    latitude: "12.9716",
    longitude: "77.6412",
    phone: "+91 80 4125 7890",
    secondaryPhone: "+91 80 4125 7891",
    whatsapp: "+91 98980 12345",
    email: "care@apexhealthcare.in",
    website: "https://apexhealthcare.in",
    is24x7: false,
    openTime: "08:00 AM",
    closeTime: "09:00 PM",
    closedDays: ["Sunday"],
    logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80",
    ],
    facebook: "https://facebook.com/apexhealthcareblr",
    instagram: "https://instagram.com/apexhealthcare",
    linkedin: "https://linkedin.com/company/apex-healthcare",
    metaTitle: "Apex Healthcare & Diagnostics | Indiranagar, Bengaluru",
    metaDescription: "Comprehensive diagnostic imaging, pathology tests, and doctor consultations in Indiranagar.",
    metaKeywords: "diagnostic centre bangalore, mri scan indiranagar, apex hospital",
    plan: "Featured",
    views: 8940,
    isActive: true,
    rating: 4.7,
    reviews: 145,
    status: "Approved",
    ownerId: "USR-103",
    ownerName: "Amitabh Sen",
    ownerEmail: "amitabh@biznest.in",
    ownerPhone: "+91 98980 12345",
    createdAt: "Sep 28, 2026",
  },
  {
    id: "LST-1080",
    name: "Urban Kicks & Streetwear",
    slug: "urban-kicks-streetwear",
    category: "Shopping & Retail",
    shortDescription: "Curated premium streetwear boutique and sneaker consignment store in Delhi.",
    fullDescription: "Curated premium streetwear boutique and sneaker consignment store showcasing limited-edition drops and authentic international apparel.",
    established: "2021",
    employees: "6-20",
    gstin: "07AAACU4321D1Z9",
    tags: ["sneakers", "streetwear", "fashion", "delhi", "gk1", "kicks"],
    city: "Delhi",
    state: "Delhi",
    address: "Shop 24, Block M, Greater Kailash 1, New Delhi 110048",
    pincode: "110048",
    latitude: "28.5482",
    longitude: "77.2343",
    phone: "+91 11 4987 6543",
    whatsapp: "+91 99100 55412",
    email: "contact@urbankicks.in",
    website: "https://urbankicks.in",
    is24x7: false,
    openTime: "11:00 AM",
    closeTime: "09:30 PM",
    closedDays: [],
    logo: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    ],
    instagram: "https://instagram.com/urbankicks_in",
    metaTitle: "Urban Kicks & Streetwear Store | Greater Kailash, Delhi",
    metaDescription: "Shop 100% authentic sneakers and luxury streetwear in Greater Kailash 1, New Delhi.",
    metaKeywords: "sneaker store delhi, streetwear boutique gk1, buy jordans delhi",
    plan: "Free",
    views: 3120,
    isActive: false,
    rating: 4.5,
    reviews: 88,
    status: "Pending",
    ownerId: "USR-105",
    ownerName: "Sameer Malhotra",
    ownerEmail: "sameer.m@urbankicks.in",
    ownerPhone: "+91 99100 55412",
    createdAt: "Oct 21, 2026",
  },
  {
    id: "LST-1079",
    name: "Royal Spice Fine Dining",
    slug: "royal-spice-fine-dining",
    category: "Food & Restaurants",
    shortDescription: "Authentic North Indian and Mughlai royal dining experience on SG Highway.",
    fullDescription: "Authentic North Indian and Mughlai royal dining experience celebrated for slow-cooked clay oven delicacies and exquisite family banqueting.",
    established: "2017",
    employees: "21-50",
    gstin: "24AAACR8821B1Z2",
    tags: ["restaurant", "mughlai", "finedining", "ahmedabad", "kebabs"],
    city: "Ahmedabad",
    state: "Gujarat",
    address: "SG Highway, Bodakdev, Ahmedabad 380054",
    pincode: "380054",
    latitude: "23.0416",
    longitude: "72.5113",
    phone: "+91 79 2685 1122",
    whatsapp: "+91 98790 33219",
    email: "reservations@spicedine.com",
    website: "https://royalspiceahmedabad.com",
    is24x7: false,
    openTime: "12:00 PM",
    closeTime: "11:30 PM",
    closedDays: [],
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    ],
    facebook: "https://facebook.com/royalspiceahmedabad",
    instagram: "https://instagram.com/royalspice_dining",
    metaTitle: "Royal Spice Fine Dining Restaurant | Bodakdev Ahmedabad",
    metaDescription: "Exquisite Mughlai and North Indian dinner destination on SG Highway Ahmedabad.",
    metaKeywords: "mughlai food ahmedabad, fine dining bodakdev, royal spice sg highway",
    plan: "Featured",
    views: 6540,
    isActive: true,
    rating: 4.8,
    reviews: 210,
    status: "Approved",
    ownerId: "USR-107",
    ownerName: "Vikramaditya Roy",
    ownerEmail: "vikram.roy@spicedine.com",
    ownerPhone: "+91 98790 33219",
    createdAt: "Oct 20, 2026",
  },
  {
    id: "LST-1078",
    name: "Zenith Digital Solutions",
    slug: "zenith-digital-solutions",
    category: "IT & Software",
    shortDescription: "Full-cycle digital transformation agency in Magarpatta Cybercity, Pune.",
    fullDescription: "Full-cycle digital transformation agency specializing in enterprise web portals, SaaS architectures, mobile applications, and cloud migration.",
    established: "2019",
    employees: "21-50",
    gstin: "27AAACZ9911K1Z4",
    tags: ["software", "webdev", "saas", "cloud", "pune", "itcompany"],
    city: "Pune",
    state: "Maharashtra",
    address: "Tower 3, Magarpatta Cybercity, Hadapsar, Pune 411028",
    pincode: "411028",
    latitude: "18.5158",
    longitude: "73.9272",
    phone: "+91 20 6712 9000",
    whatsapp: "+91 98200 99881",
    email: "hello@zenithsol.com",
    website: "https://zenithsol.com",
    is24x7: false,
    openTime: "09:30 AM",
    closeTime: "06:30 PM",
    closedDays: ["Saturday", "Sunday"],
    logo: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80",
    ],
    linkedin: "https://linkedin.com/company/zenithsol",
    metaTitle: "Zenith Digital Solutions | IT Software Agency Pune",
    metaDescription: "Enterprise web and mobile app development company based in Magarpatta Cybercity, Pune.",
    metaKeywords: "software development pune, it agency hadapsar, web development magarpatta",
    plan: "Free",
    views: 1890,
    isActive: false,
    rating: 4.2,
    reviews: 39,
    status: "Pending",
    ownerId: "USR-106",
    ownerName: "Neha Singhania",
    ownerEmail: "neha.s@zenithsol.com",
    ownerPhone: "+91 98200 99881",
    createdAt: "Oct 19, 2026",
  },
  {
    id: "LST-1085",
    name: "Greenleaf Organic Supermarket",
    category: "Shopping & Retail",
    city: "Bengaluru",
    state: "Karnataka",
    address: "80 Feet Rd, Koramangala 4th Block, Bengaluru 560034",
    pincode: "560034",
    latitude: "12.9352",
    longitude: "77.6245",
    phone: "+91 80 2553 4411",
    email: "store@greenleafmarket.in",
    website: "https://greenleafmarket.in",
    is24x7: false,
    openTime: "07:30 AM",
    closeTime: "10:00 PM",
    closedDays: [],
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
    shortDescription: "Certified organic farm-to-table grocer carrying artisanal whole foods and eco-friendly goods.",
    fullDescription: "Certified organic farm-to-table grocer carrying artisanal whole foods, gluten-free pantry essentials, eco-friendly goods, and cold-pressed oils.",
    rating: 4.6,
    reviews: 95,
    plan: "Featured",
    views: 5410,
    isActive: true,
    status: "Approved",
    ownerId: "USR-102",
    ownerName: "Pooja Varma",
    ownerEmail: "pooja.v@outlook.com",
    ownerPhone: "+91 97234 88129",
    createdAt: "Oct 15, 2026",
  },
  {
    id: "LST-1088",
    name: "Aura Unisex Salon & Spa",
    category: "Health & Medical",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "Sindhu Bhavan Marg, Thaltej, Ahmedabad 380059",
    pincode: "380059",
    latitude: "23.0525",
    longitude: "72.5028",
    phone: "+91 79 4001 7722",
    email: "appointments@aurasalon.in",
    is24x7: false,
    openTime: "10:00 AM",
    closeTime: "08:30 PM",
    closedDays: ["Monday"],
    logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80",
    shortDescription: "Luxury grooming haven offering professional hair styling and therapeutic Ayurvedic body therapy.",
    fullDescription: "Luxury grooming haven offering professional hair styling, bridal treatments, organic facials, and therapeutic Ayurvedic body therapy.",
    rating: 4.1,
    reviews: 62,
    plan: "Free",
    views: 2190,
    isActive: false,
    status: "Pending",
    ownerId: "USR-104",
    ownerName: "Kavita Rao",
    ownerEmail: "kavita.rao@yahoo.com",
    ownerPhone: "+91 94260 77651",
    createdAt: "Oct 18, 2026",
  },
  {
    id: "LST-1090",
    name: "Marine Drive Coastal Cafe",
    category: "Food & Restaurants",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Sea Face Promenade, Marine Lines, Mumbai 400020",
    pincode: "400020",
    latitude: "18.9438",
    longitude: "72.8232",
    phone: "+91 22 2281 9900",
    email: "cafe@marinedrive.in",
    is24x7: false,
    openTime: "07:00 AM",
    closeTime: "12:00 AM",
    closedDays: [],
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80",
    shortDescription: "Coastal cafe and bistro famous for freshly brewed coffees and artisan sourdough sandwiches.",
    fullDescription: "Coastal cafe and bistro famous for freshly brewed coffees, artisan sourdough sandwiches, and stunning sunset views of Queen's Necklace.",
    rating: 4.6,
    reviews: 180,
    plan: "Featured",
    views: 9320,
    isActive: true,
    status: "Approved",
    ownerId: "USR-101",
    ownerName: "Rajesh Kothari",
    ownerEmail: "rajesh.k@gmail.com",
    ownerPhone: "+91 98251 44320",
    createdAt: "Oct 14, 2026",
  },
  {
    id: "LST-1091",
    name: "Lotus Ayurveda Wellness",
    category: "Health & Medical",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Linking Road, Bandra West, Mumbai 400050",
    pincode: "400050",
    latitude: "19.0600",
    longitude: "72.8360",
    phone: "+91 22 2640 1234",
    email: "info@lotuswellness.in",
    is24x7: false,
    openTime: "08:00 AM",
    closeTime: "07:00 PM",
    closedDays: ["Sunday"],
    logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
    shortDescription: "Panchakarma and traditional holistic rejuvenation centre supervised by veteran Ayurvedic vaidyas.",
    fullDescription: "Panchakarma and traditional holistic rejuvenation centre supervised by veteran Ayurvedic vaidyas with customized dietary consultations.",
    rating: 4.8,
    reviews: 112,
    plan: "Featured Pro",
    views: 7650,
    isActive: true,
    status: "Approved",
    ownerId: "USR-109",
    ownerName: "Ananya Deshmukh",
    ownerEmail: "ananya.d@lotuswellness.in",
    ownerPhone: "+91 98220 54321",
    createdAt: "Oct 22, 2026",
  },
  {
    id: "LST-1092",
    name: "Mehta Premium Automobiles",
    category: "Automotive",
    city: "Surat",
    state: "Gujarat",
    address: "Ring Road, Surat 395002",
    pincode: "395002",
    latitude: "21.1959",
    longitude: "72.8302",
    phone: "+91 261 2456 789",
    email: "sales@mehtaautos.com",
    website: "https://mehtaautos.com",
    is24x7: false,
    openTime: "09:30 AM",
    closeTime: "08:00 PM",
    closedDays: ["Sunday"],
    logo: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    shortDescription: "Multi-brand luxury pre-owned cars showroom with certified inspections and genuine parts.",
    fullDescription: "Multi-brand luxury pre-owned cars showroom, automated insurance clearance, certified inspections, and genuine spare parts detailing.",
    rating: 4.4,
    reviews: 58,
    plan: "Free",
    views: 3410,
    isActive: false,
    status: "Approved",
    ownerId: "USR-110",
    ownerName: "Gaurav Mehta",
    ownerEmail: "gaurav.m@mehtaautos.com",
    ownerPhone: "+91 97250 88765",
    createdAt: "Oct 24, 2026",
  },
  {
    id: "LST-1093",
    name: "The Madras Baking Studio",
    slug: "the-madras-baking-studio",
    category: "Food & Restaurants",
    shortDescription: "Artisanal dessert workshop and bakery on TTK Road, Alwarpet, Chennai.",
    fullDescription: "Artisanal dessert workshop and bakery rejected due to invalid FSSAI license documentation submitted during registration.",
    established: "2023",
    employees: "6-20",
    gstin: "33AAACM5541L1Z6",
    tags: ["bakery", "desserts", "cakes", "chennai", "alwarpet"],
    city: "Chennai",
    state: "Tamil Nadu",
    address: "TTK Road, Alwarpet, Chennai 600018",
    pincode: "600018",
    latitude: "13.0334",
    longitude: "80.2528",
    phone: "+91 44 2499 8877",
    whatsapp: "+91 98401 22334",
    email: "orders@madrasbakes.com",
    website: "https://madrasbakes.com",
    is24x7: false,
    openTime: "10:00 AM",
    closeTime: "09:00 PM",
    closedDays: ["Monday"],
    logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    ],
    metaTitle: "The Madras Baking Studio | Bakery Alwarpet Chennai",
    metaDescription: "Handcrafted french pastries and custom birthday cakes in Alwarpet Chennai.",
    metaKeywords: "bakery chennai, cakes alwarpet, madras baking studio",
    plan: "Free",
    views: 420,
    isActive: false,
    rating: 3.9,
    reviews: 24,
    status: "Rejected",
    rejectionReason: "Invalid or expired FSSAI license certificate submitted during registration.",
    ownerId: "USR-111",
    ownerName: "Shalini Iyer",
    ownerEmail: "shalini.iyer@chennaibakes.com",
    ownerPhone: "+91 98401 22334",
    createdAt: "Oct 25, 2026",
  },
  {
    id: "LST-1094",
    name: "NextGen Cloud Infrastructure",
    category: "IT & Software",
    city: "Hyderabad",
    state: "Telangana",
    address: "Hitec City, Madhapur, Hyderabad 500081",
    pincode: "500081",
    latitude: "17.4483",
    longitude: "78.3915",
    phone: "+91 40 4012 3456",
    email: "contact@nextgencloud.io",
    website: "https://nextgencloud.io",
    is24x7: false,
    openTime: "09:00 AM",
    closeTime: "06:00 PM",
    closedDays: ["Saturday", "Sunday"],
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    shortDescription: "Kubernetes DevOps consulting, multi-cloud architectures, and CI/CD pipelines in Hyderabad.",
    fullDescription: "Kubernetes DevOps consulting, managed multi-cloud architectures (AWS/GCP), CI/CD pipelines, and 24x7 NOC monitoring services.",
    rating: 4.3,
    reviews: 17,
    plan: "Free",
    views: 890,
    isActive: false,
    status: "Pending",
    ownerId: "USR-106",
    ownerName: "Neha Singhania",
    ownerEmail: "neha.s@zenithsol.com",
    ownerPhone: "+91 98200 99881",
    createdAt: "Oct 26, 2026",
  },
]
export interface UserListingRef {
  id: string
  name: string
  category: string
  city: string
  rating: number
  reviews?: number
  logo?: string
  plan?: "Free" | "Featured" | "Featured Pro"
  latitude?: string
  longitude?: string
  status: ListingStatus
}

export interface UserItem {
  id: string
  name: string
  email: string
  phone: string
  image?: string
  status: "Active" | "Inactive"
  city: string
  createdAt: string
  totalListings: number
  verified: boolean
  listings: UserListingRef[]
}

// Full Users Directory Data (Registered Business Owners)
export const mockUsers: UserItem[] = [
  {
    id: "USR-101",
    name: "Rajesh Kothari",
    email: "rajesh.k@gmail.com",
    phone: "+91 98251 44320",
    status: "Active",
    city: "Mumbai, MH",
    createdAt: "Oct 12, 2026",
    totalListings: 2,
    verified: true,
    listings: [
      {
        id: "LST-1082",
        name: "Taj Mahal Palace Suites",
        category: "Hotels & Stays",
        city: "Mumbai, MH",
        rating: 4.9,
        reviews: 320,
        logo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
        plan: "Featured Pro",
        latitude: "18.9217",
        longitude: "72.8332",
        status: "Approved",
      },
      {
        id: "LST-1090",
        name: "Marine Drive Coastal Cafe",
        category: "Food & Restaurants",
        city: "Mumbai, MH",
        rating: 4.6,
        reviews: 180,
        logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80",
        plan: "Featured",
        latitude: "18.9438",
        longitude: "72.8232",
        status: "Approved",
      },
    ],
  },
  {
    id: "USR-102",
    name: "Pooja Varma",
    email: "pooja.v@outlook.com",
    phone: "+91 97234 88129",
    status: "Active",
    city: "Bengaluru, KA",
    createdAt: "Oct 15, 2026",
    totalListings: 1,
    verified: true,
    listings: [
      {
        id: "LST-1085",
        name: "Greenleaf Organic Bistro",
        category: "Food & Restaurants",
        city: "Bengaluru, KA",
        rating: 4.6,
        reviews: 95,
        logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
        plan: "Featured",
        latitude: "12.9352",
        longitude: "77.6245",
        status: "Approved",
      },
    ],
  },
  {
    id: "USR-103",
    name: "Amitabh Sen",
    email: "amitabh@biznest.in",
    phone: "+91 98980 12345",
    status: "Active",
    city: "Bengaluru, KA",
    createdAt: "Sep 28, 2026",
    totalListings: 1,
    verified: true,
    listings: [
      {
        id: "LST-1081",
        name: "Apex Healthcare & Diagnostics",
        category: "Health & Medical",
        city: "Bengaluru, KA",
        rating: 4.7,
        reviews: 210,
        logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80",
        plan: "Featured Pro",
        latitude: "12.9716",
        longitude: "77.5946",
        status: "Approved",
      },
    ],
  },
  {
    id: "USR-104",
    name: "Kavita Rao",
    email: "kavita.rao@yahoo.com",
    phone: "+91 94260 77651",
    status: "Inactive",
    city: "Ahmedabad, GJ",
    createdAt: "Oct 18, 2026",
    totalListings: 1,
    verified: false,
    listings: [
      {
        id: "LST-1088",
        name: "Aura Unisex Salon & Spa",
        category: "Beauty & Spa",
        city: "Ahmedabad, GJ",
        rating: 4.1,
        reviews: 62,
        logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80",
        plan: "Free",
        latitude: "23.0525",
        longitude: "72.5028",
        status: "Pending",
      },
    ],
  },
  {
    id: "USR-105",
    name: "Sameer Malhotra",
    email: "sameer.m@urbankicks.in",
    phone: "+91 99100 55412",
    status: "Active",
    city: "Delhi, NCR",
    createdAt: "Oct 21, 2026",
    totalListings: 1,
    verified: false,
    listings: [
      {
        id: "LST-1080",
        name: "Urban Kicks & Streetwear",
        category: "Shopping & Retail",
        city: "Delhi, NCR",
        rating: 4.5,
        reviews: 145,
        logo: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80",
        plan: "Featured",
        latitude: "28.6506",
        longitude: "77.2334",
        status: "Pending",
      },
    ],
  },
  {
    id: "USR-106",
    name: "Neha Singhania",
    email: "neha.s@zenithsol.com",
    phone: "+91 98200 99881",
    status: "Active",
    city: "Pune, MH",
    createdAt: "Aug 10, 2026",
    totalListings: 2,
    verified: true,
    listings: [
      {
        id: "LST-1078",
        name: "Zenith Digital Solutions",
        category: "IT & Software",
        city: "Pune, MH",
        rating: 4.2,
        reviews: 84,
        logo: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80",
        plan: "Featured Pro",
        latitude: "18.5204",
        longitude: "73.8567",
        status: "Approved",
      },
      {
        id: "LST-1079",
        name: "CloudBridge Hosting Lab",
        category: "IT & Software",
        city: "Pune, MH",
        rating: 4.4,
        reviews: 42,
        logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
        plan: "Free",
        latitude: "18.5590",
        longitude: "73.7868",
        status: "Approved",
      },
    ],
  },
  {
    id: "USR-107",
    name: "Vikramaditya Roy",
    email: "vikram.roy@spicedine.com",
    phone: "+91 98790 33219",
    status: "Active",
    city: "Ahmedabad, GJ",
    createdAt: "Sep 15, 2026",
    totalListings: 1,
    verified: true,
    listings: [
      {
        id: "LST-1089",
        name: "Royal Spice Fine Dining",
        category: "Food & Restaurants",
        city: "Ahmedabad, GJ",
        rating: 4.8,
        reviews: 130,
        logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
        plan: "Featured",
        latitude: "23.0225",
        longitude: "72.5714",
        status: "Approved",
      },
    ],
  },
  {
    id: "USR-108",
    name: "Deepak Chawla",
    email: "deepak.c@spammer.org",
    phone: "+91 91234 00099",
    status: "Inactive",
    city: "Jaipur, RJ",
    createdAt: "Oct 01, 2026",
    totalListings: 0,
    verified: false,
    listings: [],
  },
  {
    id: "USR-109",
    name: "Ananya Deshmukh",
    email: "ananya.d@lotuswellness.in",
    phone: "+91 98220 54321",
    status: "Active",
    city: "Mumbai, MH",
    createdAt: "Oct 22, 2026",
    totalListings: 1,
    verified: true,
    listings: [
      {
        id: "LST-1091",
        name: "Lotus Holistic Ayurveda Spa",
        category: "Beauty & Spa",
        city: "Mumbai, MH",
        rating: 4.8,
        reviews: 112,
        logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
        plan: "Featured Pro",
        latitude: "19.0600",
        longitude: "72.8360",
        status: "Approved",
      },
    ],
  },
  {
    id: "USR-110",
    name: "Gaurav Mehta",
    email: "gaurav.m@mehtaautos.com",
    phone: "+91 97250 88765",
    status: "Active",
    city: "Surat, GJ",
    createdAt: "Oct 24, 2026",
    totalListings: 1,
    verified: true,
    listings: [
      {
        id: "LST-1092",
        name: "Mehta Auto Spares & Service",
        category: "Automotive",
        city: "Surat, GJ",
        rating: 4.3,
        reviews: 58,
        logo: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
        plan: "Free",
        latitude: "21.1959",
        longitude: "72.8302",
        status: "Approved",
      },
    ],
  },
  {
    id: "USR-111",
    name: "Shalini Iyer",
    email: "shalini.iyer@chennaibakes.com",
    phone: "+91 98401 22334",
    status: "Inactive",
    city: "Chennai, TN",
    createdAt: "Oct 25, 2026",
    totalListings: 1,
    verified: false,
    listings: [
      {
        id: "LST-1093",
        name: "Madras Artisan Bakery",
        category: "Food & Restaurants",
        city: "Chennai, TN",
        rating: 3.9,
        reviews: 24,
        logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
        plan: "Free",
        latitude: "13.0334",
        longitude: "80.2528",
        status: "Rejected",
      },
    ],
  },
]

export interface CategoryItem {
  id: string
  name: string
  slug: string
  image: string
  listingCount: number
  status: "Active" | "Inactive"
  createdAt: string
}

export const mockCategories: CategoryItem[] = [
  {
    id: "CAT-101",
    name: "Food & Restaurants",
    slug: "food-restaurants",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=80",
    listingCount: 3420,
    status: "Active",
    createdAt: "Oct 10, 2026",
  },
  {
    id: "CAT-102",
    name: "Hotels & Stays",
    slug: "hotels-stays",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=80",
    listingCount: 2890,
    status: "Active",
    createdAt: "Oct 11, 2026",
  },
  {
    id: "CAT-103",
    name: "Health & Medical",
    slug: "health-medical",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80",
    listingCount: 1940,
    status: "Active",
    createdAt: "Oct 12, 2026",
  },
  {
    id: "CAT-104",
    name: "Real Estate",
    slug: "real-estate",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80",
    listingCount: 1580,
    status: "Active",
    createdAt: "Oct 14, 2026",
  },
  {
    id: "CAT-105",
    name: "Automotive & Vehicles",
    slug: "automotive-vehicles",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=80",
    listingCount: 920,
    status: "Active",
    createdAt: "Oct 15, 2026",
  },
  {
    id: "CAT-106",
    name: "Beauty & Spa",
    slug: "beauty-spa",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=80",
    listingCount: 840,
    status: "Active",
    createdAt: "Oct 16, 2026",
  },
  {
    id: "CAT-107",
    name: "Shopping & Retail",
    slug: "shopping-retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80",
    listingCount: 760,
    status: "Active",
    createdAt: "Oct 18, 2026",
  },
  {
    id: "CAT-108",
    name: "Fitness & Gyms",
    slug: "fitness-gyms",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=80",
    listingCount: 510,
    status: "Active",
    createdAt: "Oct 19, 2026",
  },
  {
    id: "CAT-109",
    name: "Education & Coaching",
    slug: "education-coaching",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80",
    listingCount: 430,
    status: "Inactive",
    createdAt: "Oct 20, 2026",
  },
  {
    id: "CAT-110",
    name: "Event & Wedding",
    slug: "event-wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&auto=format&fit=crop&q=80",
    listingCount: 310,
    status: "Active",
    createdAt: "Oct 22, 2026",
  },
  {
    id: "CAT-111",
    name: "IT & Freelance Services",
    slug: "it-freelance-services",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80",
    listingCount: 280,
    status: "Inactive",
    createdAt: "Oct 24, 2026",
  },
]

// ==========================================
// Notifications Data
// ==========================================

export type NotificationType = "listing" | "inquiry" | "payment" | "user" | "broadcast"

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  target?: "admin" | "business" | "all"
  recipientName?: string
}

export const mockNotifications: NotificationItem[] = [
  {
    id: "NOTIF-101",
    title: "New Listing Pending Verification",
    message: "Taj Palace Suites has been submitted by Rajesh Sharma for approval.",
    type: "listing",
    read: false,
    createdAt: "10 mins ago",
  },
  {
    id: "NOTIF-102",
    title: "New Contact Inquiry Received",
    message: "Priya Sengupta submitted an inquiry regarding portal partnership.",
    type: "inquiry",
    read: false,
    createdAt: "25 mins ago",
  },
  {
    id: "NOTIF-103",
    title: "Banner Ad Campaign Request",
    message: "Apex Healthcare requested a 'Header Banner' ad placement for 30 days.",
    type: "inquiry",
    read: false,
    createdAt: "1 hour ago",
  },
  {
    id: "NOTIF-104",
    title: "Payment Received (Growth Plan)",
    message: "₹2,499 received from Royal Spice Restaurant via Razorpay.",
    type: "payment",
    read: true,
    createdAt: "2 hours ago",
  },
  {
    id: "NOTIF-105",
    title: "New User Registered",
    message: "Dr. Ananya Roy registered as a verified medical professional.",
    type: "user",
    read: true,
    createdAt: "Yesterday",
  },
  {
    id: "NOTIF-106",
    title: "Festive Season Announcement",
    message: "Broadcast sent to all business owners: '50% Discount on Featured Listing upgrades for Diwali week'.",
    type: "broadcast",
    recipientName: "All Businesses",
    read: true,
    createdAt: "2 days ago",
  },
  {
    id: "NOTIF-107",
    title: "Listing Verification Approved",
    message: "Urban Kicks & Streetwear listing status changed to Verified by Admin.",
    type: "listing",
    read: true,
    createdAt: "3 days ago",
  },
  {
    id: "NOTIF-108",
    title: "System Maintenance Notice",
    message: "Scheduled cloud database upgrade announcement sent to platform vendors.",
    type: "broadcast",
    recipientName: "Verified Only",
    read: true,
    createdAt: "4 days ago",
  },
  {
    id: "NOTIF-109",
    title: "Premium Subscription Renewed",
    message: "Elite Dental Clinic successfully renewed their Annual Business plan for ₹9,999.",
    type: "payment",
    read: false,
    createdAt: "5 hours ago",
  },
  {
    id: "NOTIF-110",
    title: "Services & Products Inquiry",
    message: "Customer Rahul Mehta sent an inquiry for 'Luxury Bridal Makeup Package' on Glamour Salon.",
    type: "inquiry",
    read: false,
    createdAt: "1 day ago",
  },
  {
    id: "NOTIF-111",
    title: "Special Policy Update Notice",
    message: "Important guideline regarding verified badge renewal dispatched to business profiles.",
    type: "broadcast",
    recipientName: "All Businesses",
    read: true,
    createdAt: "5 days ago",
  },
  {
    id: "NOTIF-112",
    title: "New User Registered",
    message: "Vikramaditya Roy registered a new business owner account from Ahmedabad, GJ.",
    type: "user",
    read: false,
    createdAt: "35 mins ago",
  },
]

// ----------------------------------------------------
// Contact Inquiries Data
// ----------------------------------------------------
export interface ContactInquiryItem {
  id: string
  name: string
  email: string
  phone: string
  subject:
    | "General Inquiry"
    | "Listing Support"
    | "Technical Issue"
    | "Business Partnership"
    | "Advertising & Sponsorship"
    | "Other"
  message: string
  status: "New" | "Replied" | "Archived"
  createdAt: string
  replyText?: string
  repliedAt?: string
}

export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Listing Support",
  "Technical Issue",
  "Business Partnership",
  "Advertising & Sponsorship",
  "Other",
] as const

export const mockContactInquiries: ContactInquiryItem[] = [
  {
    id: "INQ-201",
    name: "Aarav Patel",
    email: "aarav.patel@gmail.com",
    phone: "+91 98250 12345",
    subject: "Business Partnership",
    message: "Hello team, We operate a chain of 14 organic grocery stores in Gujarat and Maharashtra. We would like to explore a bulk verified listing partnership and promotional tie-up across your portal.",
    status: "New",
    createdAt: "15 mins ago",
  },
  {
    id: "INQ-202",
    name: "Pooja Deshmukh",
    email: "pooja.d@zenithtech.in",
    phone: "+91 98765 43210",
    subject: "Listing Support",
    message: "I registered our IT consultancy firm 'Zenith Systems' yesterday, but the verification process seems pending on our account. Please assist in activating our listing.",
    status: "New",
    createdAt: "1 hour ago",
  },
  {
    id: "INQ-203",
    name: "Vikram Singhania",
    email: "vikram@singhaniagroup.com",
    phone: "+91 99099 87654",
    subject: "Advertising & Sponsorship",
    message: "We want to sponsor the top banner space on the Mumbai and Delhi directory pages for the upcoming Q4 festive period. Could you share the current ad rate card and impression metrics?",
    status: "Replied",
    createdAt: "Yesterday, 3:30 PM",
    replyText: "Hello Vikram, Thank you for reaching out! We have emailed our Q4 Media Kit and banner ad pricing to your email address.",
    repliedAt: "Yesterday, 5:15 PM",
  },
  {
    id: "INQ-204",
    name: "Neha Sundaram",
    email: "neha.sundaram@gmail.com",
    phone: "+91 97123 45678",
    subject: "General Inquiry",
    message: "Does your platform offer an API or bulk export option to verify whether vendor listings in Ahmedabad have active GST registrations?",
    status: "New",
    createdAt: "Yesterday, 11:20 AM",
  },
  {
    id: "INQ-205",
    name: "Karan Johar",
    email: "karan.studio@mumbaiarts.org",
    phone: "+91 98980 11223",
    subject: "Technical Issue",
    message: "When uploading high-resolution 4K portfolio images on our Photography listing, the image upload hangs at 99%. Could you check your file size thresholds?",
    status: "Replied",
    createdAt: "Oct 27, 2026",
    replyText: "Hi Karan, We have resolved the file size timeout on the CDN. Max upload size is 10MB per image. Please try re-uploading now.",
    repliedAt: "Oct 27, 2026",
  },
  {
    id: "INQ-206",
    name: "Rohan Varma",
    email: "rohan@varmafoods.co",
    phone: "+91 94280 55667",
    subject: "Business Partnership",
    message: "Interested in onboarding all our cloud kitchen outlets across Bengaluru under a single franchise corporate account. Please connect with our marketing lead.",
    status: "Archived",
    createdAt: "Oct 25, 2026",
    replyText: "Account executive Raj assigned to schedule a demo call with your team.",
    repliedAt: "Oct 26, 2026",
  },
  {
    id: "INQ-207",
    name: "Dr. Ananya Sen",
    email: "ananya.sen@senclinic.org",
    phone: "+91 98795 33445",
    subject: "Listing Support",
    message: "Our clinic address moved from Salt Lake Sector 1 to Sector 5 Kolkata. The edit form asks for re-verification document upload. Where do I upload the new municipal license?",
    status: "New",
    createdAt: "Oct 24, 2026",
  },
  {
    id: "INQ-208",
    name: "Deepak Chawla",
    email: "deepak.c@chawlalaw.in",
    phone: "+91 91234 56789",
    subject: "Other",
    message: "Requesting removal of an outdated duplicate listing created by a previous employee under 'Chawla Legal Associates'.",
    status: "Replied",
    createdAt: "Oct 22, 2026",
    replyText: "The duplicate listing LST-902 has been merged with your primary verified account.",
    repliedAt: "Oct 23, 2026",
  },
]

// ----------------------------------------------------
// Blog Data
// ----------------------------------------------------
export interface BlogItem {
  id: string
  title: string
  slug: string
  category: string
  author: string
  authorRole?: string
  authorAvatar?: string
  authorSocialLinks?: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
  }
  tags?: string[]
  image: string
  excerpt: string
  content: string
  views: number
  status: "Published" | "Draft"
  publishedAt: string
  createdAt: string
}

export interface BlogCategoryItem {
  id: string
  name: string
  slug: string
  description?: string
  status: "Active" | "Inactive"
  createdAt?: string
}

export const mockBlogCategories: BlogCategoryItem[] = [
  {
    id: "bcat-1",
    name: "Business Tips",
    slug: "business-tips",
    description: "Actionable strategies and operational insights for local businesses.",
    status: "Active",
    createdAt: "Oct 15, 2026",
  },
  {
    id: "bcat-2",
    name: "Local Guides",
    slug: "local-guides",
    description: "Curated neighborhood recommendations, dining spots, and city guides.",
    status: "Active",
    createdAt: "Oct 16, 2026",
  },
  {
    id: "bcat-3",
    name: "Marketing & SEO",
    slug: "marketing-seo",
    description: "Local SEO, citation building, and digital marketing tutorials.",
    status: "Active",
    createdAt: "Oct 18, 2026",
  },
  {
    id: "bcat-4",
    name: "Market Trends",
    slug: "market-trends",
    description: "Consumer behavior shifts and retail industry analysis in India.",
    status: "Active",
    createdAt: "Oct 20, 2026",
  },
  {
    id: "bcat-5",
    name: "Platform News",
    slug: "platform-news",
    description: "Updates, new directory features, and platform announcements.",
    status: "Active",
    createdAt: "Oct 22, 2026",
  },
]

export const BLOG_CATEGORIES = [
  "Business Tips",
  "Local Guides",
  "Marketing & SEO",
  "Market Trends",
  "Platform News",
] as const

export const mockBlogs: BlogItem[] = [
  {
    id: "blog-1",
    title: "10 Proven Strategies to Scale Your Local Business Footfall in 2026",
    slug: "10-proven-strategies-scale-local-business-2026",
    category: "Business Tips",
    author: "Raj Sharma",
    authorRole: "Senior Business Strategist",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    authorSocialLinks: {
      linkedin: "https://linkedin.com/in/rajsharma",
      twitter: "https://twitter.com/rajsharma",
      instagram: "https://instagram.com/rajsharma",
      facebook: "https://facebook.com/rajsharma",
    },
    tags: ["business-growth", "local-seo", "footfall", "marketing"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    excerpt: "Discover essential offline and local SEO tactics to convert local online searches into recurring walk-in customers.",
    content: "In the modern digital age, having an online footprint is no longer optional for brick-and-mortar storefronts. Local search intent has risen by over 300% in India across Tier 1 and Tier 2 cities. By optimizing your Google Business profile, actively maintaining high ratings on directory portals like IndianListingBucket, and offering localized seasonal promotions, merchants can unlock exponential footfall growth.",
    views: 3420,
    status: "Published",
    publishedAt: "Oct 28, 2026",
    createdAt: "Oct 28, 2026",
  },
  {
    id: "blog-2",
    title: "The Comprehensive Guide to Getting Your Business Verified",
    slug: "comprehensive-guide-getting-business-verified",
    category: "Platform News",
    author: "Editorial Team",
    authorRole: "Listing Operations",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    authorSocialLinks: {
      linkedin: "https://linkedin.com/company/indianlistingbucket",
      twitter: "https://twitter.com/indianlisting",
    },
    tags: ["verification", "trust-badge", "compliance", "directory-guides"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    excerpt: "Everything you need to know about the blue checkmark badge, required documentation, and directory ranking benefits.",
    content: "A verified badge builds immediate trust with consumers browsing thousands of listings. Verified vendors experience a 4.2x higher contact rate and inquiry volume compared to unverified profiles. In this guide, we walk through the simple 3-step verification process: uploading your GST or Udhyam registration, validating the address with a utility receipt, and phone verification.",
    views: 2890,
    status: "Published",
    publishedAt: "Oct 25, 2026",
    createdAt: "Oct 25, 2026",
  },
  {
    id: "blog-3",
    title: "How Ahmedabad Restaurants Are Revolutionizing Fine Dining Experiences",
    slug: "ahmedabad-restaurants-revolutionizing-fine-dining",
    category: "Local Guides",
    author: "Priya Varma",
    authorRole: "Food & Lifestyle Curator",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    authorSocialLinks: {
      instagram: "https://instagram.com/priyavarma",
    },
    tags: ["ahmedabad", "restaurants", "foodie", "local-guides"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    excerpt: "A culinary journey exploring heritage fusion, artisanal cafes, and sustainable gastronomical trends in Gujarat's commercial hub.",
    content: "Ahmedabad's dining landscape has transformed dynamically over the last three years. From heritage havelis serving authentic regional thalis with contemporary plating to rooftop artisanal coffee roasters in Bodakdev and Prahlad Nagar, local entrepreneurs are blending cultural culinary roots with modern hospitality standards.",
    views: 1940,
    status: "Published",
    publishedAt: "Oct 21, 2026",
    createdAt: "Oct 21, 2026",
  },
  {
    id: "blog-4",
    title: "Festive Season Advertising: Maximum ROI on Directory Banners",
    slug: "festive-season-advertising-maximum-roi-directory-banners",
    category: "Marketing & SEO",
    author: "Raj Sharma",
    authorRole: "Senior Business Strategist",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    tags: ["festive-ads", "roi", "marketing-branding", "banners"],
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    excerpt: "Learn how targeted homepage banners and featured category spots boost brand awareness during Diwali and festive peaks.",
    content: "During festive periods, consumer spending reaches its highest seasonal peak. Directory advertisements allow targeted exposure at the exact moment customers are actively looking for local retail discounts, jewelry showrooms, and banquet halls. Learn our best creative practices for click-through rate optimization.",
    views: 1450,
    status: "Published",
    publishedAt: "Oct 18, 2026",
    createdAt: "Oct 18, 2026",
  },
  {
    id: "blog-5",
    title: "Mastering Customer Feedback: How to Handle Negative Reviews Gracefully",
    slug: "mastering-customer-feedback-handle-negative-reviews",
    category: "Business Tips",
    author: "Editorial Team",
    authorRole: "Customer Success Lead",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    tags: ["reviews", "customer-retention", "reputation", "tips"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    excerpt: "Turn unhappy customers into loyal brand ambassadors through prompt, empathetic, and professional public responses.",
    content: "Receiving a 1-star or 2-star review can feel disheartening, but research proves that potential customers pay more attention to HOW a business responds than the negative review itself. A polite, solution-oriented response demonstrates transparency and care.",
    views: 890,
    status: "Draft",
    publishedAt: "Draft",
    createdAt: "Oct 29, 2026",
  },
  {
    id: "blog-6",
    title: "Understanding Micro-Influencer Collaborations for Small Retail Outlets",
    slug: "understanding-micro-influencer-collaborations-retail",
    category: "Market Trends",
    author: "Aakash Mehta",
    authorRole: "Social Media Strategist",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    tags: ["influencers", "hyperlocal", "retail", "branding"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    excerpt: "Why hyper-local micro-influencers with 5k-20k followers drive higher conversions than celebrity sponsorships.",
    content: "Hyperlocal marketing relies on genuine neighborhood community engagement. Local micro-influencers connect with audiences who live within a 5km radius of your business, resulting in higher authentic engagement and affordable campaign budgets for boutique businesses.",
    views: 0,
    status: "Draft",
    publishedAt: "Draft",
    createdAt: "Oct 30, 2026",
  },
]

// ----------------------------------------------------
// Subscription Plans Data
// ----------------------------------------------------
export interface SubscriptionPlanItem {
  id: string
  name: string
  tag: string
  icon?: string
  price: number | string
  period: string
  popular?: boolean
  headline: string
  description: string
  servicesLimit: number
  includedFeatures: string[]
  status: "Active" | "Inactive"
  createdAt?: string
}

export const mockSubscriptionPlans: SubscriptionPlanItem[] = [
  {
    id: "plan-1",
    tag: "PACKAGE 1",
    name: "Free Listing",
    icon: "🏢",
    price: 0,
    period: "/ forever",
    popular: false,
    headline: "Get Started for Free",
    description: "Add your business to our directory at absolutely no cost. Perfect for businesses just starting their online journey.",
    servicesLimit: 0,
    includedFeatures: [
      "Unlimited listing duration with a no-follow website link.",
    ],
    status: "Active",
    createdAt: "Oct 01, 2026",
  },
  {
    id: "plan-2",
    tag: "PACKAGE 2",
    name: "Featured Listing",
    icon: "⭐",
    price: 199,
    period: "/ 3 months",
    popular: true,
    headline: "Maximum Visibility for Your Business",
    description: "Featured Listing includes listing for unlimited days, Featured listing on homepage, Featured listing on featured page, and priority placement in category and search results.",
    servicesLimit: 5,
    includedFeatures: [
      "Add up to 5 Services & Products.",
      "Unlimited listing duration with a do-follow website link.",
      "Featured listing on the homepage.",
      "Business highlighting on the category pages.",
      "Featured listing on the featured page.",
      "Business highlighting in search results.",
    ],
    status: "Active",
    createdAt: "Oct 01, 2026",
  },
  {
    id: "plan-3",
    tag: "PACKAGE 3",
    name: "Featured Pro",
    icon: "🚀",
    price: 499,
    period: "/ 3 months",
    popular: false,
    headline: "Maximum Power for Growing Brands",
    description: "Featured Pro includes listing for unlimited days, Featured listing on homepage, Featured listing on featured page, and priority placement in category and search results.",
    servicesLimit: 10,
    includedFeatures: [
      "Add up to 10 Services & Products.",
      "Unlimited listing duration with a do-follow website link.",
      "Featured listing on the homepage.",
      "Business highlighting on the category pages.",
      "Featured listing on the featured page.",
      "Business highlighting in search results.",
    ],
    status: "Active",
    createdAt: "Oct 01, 2026",
  },
  {
    id: "plan-4",
    tag: "PACKAGE 4",
    name: "Banner Ads",
    icon: "🖼️",
    price: "Custom",
    period: "Pricing",
    popular: false,
    headline: "Instant Brand Recognition",
    description: "Banner ads target local customers and help to build brand recognition immediately. Your banner appears across relevant pages reaching thousands of daily visitors.",
    servicesLimit: 0,
    includedFeatures: [
      "High-visibility banner placements",
      "Targeted to your city or category",
      "Homepage & category page banners",
      "Custom creative design support",
      "Flexible duration (7 / 30 / 90 days)",
      "Click-through tracking & reporting",
      "Mobile-responsive ad formats",
    ],
    status: "Active",
    createdAt: "Oct 01, 2026",
  },
]

// ----------------------------------------------------
// Banner Ads Inquiries Data
// ----------------------------------------------------
export interface BannerAdInquiryItem {
  id: string
  name: string
  email: string
  mobile: string
  bannerType: "Header Banner" | "Footer Banner" | "Side Banner" | "Blog Page Banner" | "All in One"
  width: string
  height: string
  notes?: string
  status: "New" | "Confirmed" | "Rejected"
  createdAt: string
}

export const mockBannerAdInquiries: BannerAdInquiryItem[] = [
  {
    id: "INQ-BA-101",
    name: "Vikram Malhotra",
    email: "vikram.m@zenithdigital.in",
    mobile: "+91 98201 44321",
    bannerType: "Header Banner",
    width: "728px",
    height: "90px",
    notes: "We want to run a festive campaign on the homepage header for 30 days starting next week.",
    status: "New",
    createdAt: "Oct 30, 2026",
  },
  {
    id: "INQ-BA-102",
    name: "Sneha Patel",
    email: "sneha.p@apexhealthcare.org",
    mobile: "+91 94260 78190",
    bannerType: "Side Banner",
    width: "300px",
    height: "250px",
    notes: "Targeting healthcare & medical category in Ahmedabad. Interested in a 3-month contract.",
    status: "Confirmed",
    createdAt: "Oct 29, 2026",
  },
  {
    id: "INQ-BA-103",
    name: "Rajesh Kulkarni",
    email: "rajesh@kulkarniauto.com",
    mobile: "+91 98902 33441",
    bannerType: "All in One",
    width: "Responsive",
    height: "Multi-size",
    notes: "Need full-site brand coverage across Pune listings. Please share discounted pricing package.",
    status: "New",
    createdAt: "Oct 28, 2026",
  },
  {
    id: "INQ-BA-104",
    name: "Ananya Deshmukh",
    email: "ananya.d@urbanstyles.co",
    mobile: "+91 97654 11223",
    bannerType: "Blog Page Banner",
    width: "728px",
    height: "300px",
    notes: "In-content banner for shopping and fashion guides. Creative graphic is already ready.",
    status: "Confirmed",
    createdAt: "Oct 27, 2026",
  },
  {
    id: "INQ-BA-105",
    name: "Harish Iyer",
    email: "harish@speedycourier.in",
    mobile: "+91 98450 99887",
    bannerType: "Footer Banner",
    width: "728px",
    height: "90px",
    notes: "Budget is only ₹500 for 1 month, looking for cheap placement.",
    status: "Rejected",
    createdAt: "Oct 25, 2026",
  },
  {
    id: "INQ-BA-106",
    name: "Pooja Singhania",
    email: "pooja@royalgems.in",
    mobile: "+91 98112 66778",
    bannerType: "Header Banner",
    width: "970px",
    height: "250px",
    notes: "Billboard header banner for premium jewelry launch in Delhi NCR.",
    status: "New",
    createdAt: "Oct 24, 2026",
  },
]

// ----------------------------------------------------
// Services & Products Inquiries Data
// (Customer leads sent from listing pages on website)
// ----------------------------------------------------
export interface ServiceProductInquiryItem {
  id: string
  fullName: string
  email: string
  phone: string
  service: string
  listingId: string
  listingName: string
  businessOwnerName: string
  businessOwnerEmail?: string
  businessOwnerPhone?: string
  category: string
  city: string
  preferredContact: "WhatsApp" | "Phone"
  message: string
  status: "Pending" | "Resolved" | "Rejected"
  createdAt: string
}

export const mockServiceProductInquiries: ServiceProductInquiryItem[] = [
  {
    id: "INQ-SP-501",
    fullName: "Rohan Varma",
    email: "rohan.varma@gmail.com",
    phone: "+91 98201 55678",
    service: "Deluxe Sea-Facing Suite (2 Nights)",
    listingId: "LST-1082",
    listingName: "Taj Mahal Palace Suites",
    businessOwnerName: "Rajesh Kothari",
    businessOwnerEmail: "rajesh.k@gmail.com",
    businessOwnerPhone: "+91 98251 44320",
    category: "Hotels & Stays",
    city: "Mumbai, MH",
    preferredContact: "WhatsApp",
    message: "Hi, I am looking to book a sea-facing deluxe suite for my parents' anniversary on the upcoming weekend (Nov 7-9). Need confirmation on early check-in and complimentary breakfast package.",
    status: "Pending",
    createdAt: "Today, 11:20 AM",
  },
  {
    id: "INQ-SP-502",
    fullName: "Meera Krishnan",
    email: "meera.krishnan@techwave.io",
    phone: "+91 94481 23091",
    service: "Full Body Executive Health Checkup",
    listingId: "LST-1081",
    listingName: "Apex Healthcare & Diagnostics",
    businessOwnerName: "Amitabh Sen",
    businessOwnerEmail: "amitabh@biznest.in",
    businessOwnerPhone: "+91 98980 12345",
    category: "Health & Medical",
    city: "Bengaluru, KA",
    preferredContact: "Phone",
    message: "Need to book senior citizen comprehensive health screening for two persons with home blood sample collection. Please share schedule availability for this Saturday morning.",
    status: "Resolved",
    createdAt: "Yesterday, 04:15 PM",
  },
  {
    id: "INQ-SP-503",
    fullName: "Kabir Nambiar",
    email: "kabir.nambiar@creatives.co",
    phone: "+91 99102 88410",
    service: "Limited Edition Sneaker Customization",
    listingId: "LST-1080",
    listingName: "Urban Kicks & Streetwear",
    businessOwnerName: "Sameer Malhotra",
    businessOwnerEmail: "sameer.m@urbankicks.in",
    businessOwnerPhone: "+91 99100 55412",
    category: "Shopping & Retail",
    city: "Delhi, NCR",
    preferredContact: "WhatsApp",
    message: "Want custom hand-painted anime artwork on Nike Dunk Lows. Please share quotation and turnaround timeline. My shoe size is UK 9.",
    status: "Pending",
    createdAt: "Oct 29, 2026",
  },
  {
    id: "INQ-SP-504",
    fullName: "Sunita Agarwal",
    email: "sunita.agarwal@hotmail.com",
    phone: "+91 98795 66120",
    service: "Rooftop Private Banquet Dining (35 Guests)",
    listingId: "LST-1079",
    listingName: "Royal Spice Fine Dining",
    businessOwnerName: "Vikram Singhania",
    businessOwnerEmail: "vikram@singhaniagroup.com",
    businessOwnerPhone: "+91 98250 11990",
    category: "Food & Restaurants",
    city: "Ahmedabad, GJ",
    preferredContact: "Phone",
    message: "Inquiry for private family dinner party on Nov 15th evening. Require customized Jain and North Indian buffet menu. Please contact to discuss decor and advance booking.",
    status: "Resolved",
    createdAt: "Oct 28, 2026",
  },
  {
    id: "INQ-SP-505",
    fullName: "Devendra Patil",
    email: "devendra@patilfoundry.com",
    phone: "+91 98220 77114",
    service: "Custom SaaS MVP & Cloud Migration",
    listingId: "LST-1078",
    listingName: "Zenith Digital Solutions",
    businessOwnerName: "Amitabh Sen",
    businessOwnerEmail: "amitabh@biznest.in",
    businessOwnerPhone: "+91 98980 12345",
    category: "IT & Software",
    city: "Pune, MH",
    preferredContact: "Phone",
    message: "We are building an ERP workflow for manufacturing units and require backend architecture design with React frontend. Please share your portfolio and consultation availability.",
    status: "Rejected",
    createdAt: "Oct 27, 2026",
  },
  {
    id: "INQ-SP-506",
    fullName: "Ayesha Khan",
    email: "ayesha.khan92@gmail.com",
    phone: "+91 97240 33819",
    service: "Bridal Moroccan Hair Spa & Makeover",
    listingId: "LST-1088",
    listingName: "Aura Unisex Salon & Spa",
    businessOwnerName: "Kavita Rao",
    businessOwnerEmail: "kavita.rao@yahoo.com",
    businessOwnerPhone: "+91 94260 77651",
    category: "Beauty & Spa",
    city: "Ahmedabad, GJ",
    preferredContact: "WhatsApp",
    message: "Looking for bridal pre-wedding package for bride plus 3 bridesmaids. Can you share the service checklist and date booking availability for December 1st week?",
    status: "Pending",
    createdAt: "Oct 26, 2026",
  },
  {
    id: "INQ-SP-507",
    fullName: "Arun Joshi",
    email: "arun.joshi@novasoft.com",
    phone: "+91 98450 11200",
    service: "Organic Farm-to-Table Corporate Catering",
    listingId: "LST-1085",
    listingName: "Greenleaf Organic Bistro",
    businessOwnerName: "Pooja Varma",
    businessOwnerEmail: "pooja.v@outlook.com",
    businessOwnerPhone: "+91 97234 88129",
    category: "Food & Restaurants",
    city: "Bengaluru, KA",
    preferredContact: "WhatsApp",
    message: "Interested in weekly organic meal boxes for our 40-member design team in Indiranagar. Please send corporate pricing options.",
    status: "Resolved",
    createdAt: "Oct 24, 2026",
  },
]

// ----------------------------------------------------
// Services & Products Catalog Data
// (Offerings added by owners of approved listings)
// ----------------------------------------------------
export interface ServiceProductItem {
  id: string
  name: string
  category: string
  description: string
  price: number
  popular: boolean
  status: "Active" | "Inactive"
  image: string
  listingId: string
  listingName: string
  listingCategory: string 
  businessOwnerName: string
  city: string
  createdAt: string
}

export const mockServicesProducts: ServiceProductItem[] = [
  {
    id: "SP-101",
    name: "Royal Heritage Courtyard Suite",
    category: "Suites & Rooms",
    description: "Opulent royal suite overlooking the central palace courtyard with private 24/7 butler service and jacuzzi.",
    price: 25000,
    popular: true,
    status: "Active",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=60",
    listingId: "LST-1082",
    listingName: "Taj Mahal Palace Suites",
    listingCategory: "Hotels & Stays",
    businessOwnerName: "Rajesh Kothari",
    city: "Mumbai, MH",
    createdAt: "Oct 12, 2026",
  },
  {
    id: "SP-102",
    name: "Executive Full Body Screening Package",
    category: "Health & Diagnostics",
    description: "Comprehensive 85-parameter biochemical blood screening, ECG, digital chest X-ray, and senior physician consultation.",
    price: 4999,
    popular: true,
    status: "Active",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=60",
    listingId: "LST-1081",
    listingName: "Apex Healthcare & Diagnostics",
    listingCategory: "Health & Medical",
    businessOwnerName: "Amitabh Sen",
    city: "Bengaluru, KA",
    createdAt: "Oct 14, 2026",
  },
  {
    id: "SP-103",
    name: "Air Jordan Hand-Painted Custom Artwork",
    category: "Custom Footwear",
    description: "Custom anime, graffiti, or minimalist hand-painted leather artwork sealed with scratch-resistant waterproof acrylic finisher.",
    price: 12500,
    popular: true,
    status: "Active",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=60",
    listingId: "LST-1080",
    listingName: "Urban Kicks & Streetwear",
    listingCategory: "Shopping & Retail",
    businessOwnerName: "Sameer Malhotra",
    city: "Delhi, NCR",
    createdAt: "Oct 16, 2026",
  },
  {
    id: "SP-104",
    name: "Royal Mughlai Grand Thali Experience",
    category: "Specialty Dining",
    description: "Grand 12-course slow-cooked Awadhi and Mughlai culinary degustation served in traditional copper silverware.",
    price: 1850,
    popular: false,
    status: "Inactive",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60",
    listingId: "LST-1079",
    listingName: "Royal Spice Fine Dining",
    listingCategory: "Food & Restaurants",
    businessOwnerName: "Vikram Singhania",
    city: "Ahmedabad, GJ",
    createdAt: "Oct 18, 2026",
  },
  {
    id: "SP-105",
    name: "Full-Stack SaaS MVP Architecture Sprint",
    category: "IT & Software",
    description: "2-week rapid development sprint delivering production-ready multi-tenant SaaS MVP with React, Node, and PostgreSQL.",
    price: 85000,
    popular: false,
    status: "Active",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
    listingId: "LST-1078",
    listingName: "Zenith Digital Solutions",
    listingCategory: "IT & Software",
    businessOwnerName: "Amitabh Sen",
    city: "Pune, MH",
    createdAt: "Oct 20, 2026",
  },
  {
    id: "SP-106",
    name: "Bridal Moroccan Argan Oil Hair Spa",
    category: "Hair & Beauty",
    description: "Deep conditioning steam treatment with pure cold-pressed Moroccan argan oil, scalp massage, and ozone therapy.",
    price: 3200,
    popular: true,
    status: "Active",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=60",
    listingId: "LST-1088",
    listingName: "Aura Unisex Salon & Spa",
    listingCategory: "Beauty & Spa",
    businessOwnerName: "Kavita Rao",
    city: "Ahmedabad, GJ",
    createdAt: "Oct 22, 2026",
  },
  {
    id: "SP-107",
    name: "Weekly Farm-Fresh Organic Salad Bowl Plan",
    category: "Organic Food",
    description: "Subscription package of 5 nutrient-dense organic hydroponic microgreen bowls with cold-pressed dressings.",
    price: 2100,
    popular: false,
    status: "Inactive",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60",
    listingId: "LST-1085",
    listingName: "Greenleaf Organic Bistro",
    listingCategory: "Food & Restaurants",
    businessOwnerName: "Pooja Varma",
    city: "Bengaluru, KA",
    createdAt: "Oct 25, 2026",
  },
]




