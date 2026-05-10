export interface Product {
  id: number
  name: string
  name_ar: string
  category: string
  price: number
  price_old: number | null
  image_url: string
  image_gradient: string
  badge: string | null
  specs: string[]
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  stock_text: string
  rating: number
  rating_count: number
  is_deal: boolean
}

export const STATIC_PRODUCTS: Product[] = [
  { id: 1,  name: 'PlayStation 5 Slim',      name_ar: 'بلايستيشن 5 سليم',       category: 'playstation', price: 2499, price_old: 2899, image_url: '/products/p1-ps5-slim.png',         image_gradient: 'ps-gradient',   badge: 'sale',       specs: ['1TB SSD','4K 120fps','DualSense'],             stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.9, rating_count: 214, is_deal: true  },
  { id: 2,  name: 'Xbox Series S',            name_ar: 'إكس بوكس سيريس إس',      category: 'xbox',        price: 1299, price_old: 1499, image_url: '/products/p2-xbox-series-s.png',     image_gradient: 'xbox-gradient', badge: 'hot',        specs: ['512GB','1440p','Game Pass'],                   stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.7, rating_count: 189, is_deal: true  },
  { id: 3,  name: 'DualSense Controller',     name_ar: 'دوال سينس',               category: 'accessories', price: 349,  price_old: 429,  image_url: '/products/p3-dualsense.png',         image_gradient: 'ps-gradient',   badge: 'sale',       specs: ['Haptic','Adaptive L2/R2','USB-C'],             stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.8, rating_count: 156, is_deal: true  },
  { id: 4,  name: 'RTX 4060 Ti 8GB',         name_ar: 'RTX 4060 تي',             category: 'pc',          price: 2199, price_old: 2599, image_url: '/products/p4-rtx4060ti.png',         image_gradient: 'pc-gradient',   badge: 'hot',        specs: ['8GB GDDR6','DLSS 3','4K Ready'],               stock_status: 'low_stock',  stock_text: 'آخر 3 قطع · Low Stock',        rating: 4.6, rating_count: 98,  is_deal: true  },
  { id: 5,  name: 'DualSense Edge',           name_ar: 'دوال سينس إيدج',          category: 'accessories', price: 699,  price_old: null, image_url: '/products/p5-dualsense-edge.png',    image_gradient: 'ps-gradient',   badge: 'new',        specs: ['Pro Sticks','Back Buttons','Custom Profiles'], stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.9, rating_count: 87,  is_deal: false },
  { id: 6,  name: 'PS5 Media Remote',         name_ar: 'ريموت ميديا PS5',         category: 'accessories', price: 149,  price_old: null, image_url: '/products/p6-ps5-media-remote.png',  image_gradient: 'ps-gradient',   badge: null,         specs: ['IR Control','USB-C','Voice'],                  stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.5, rating_count: 63,  is_deal: false },
  { id: 7,  name: 'PlayStation Plus 12M',     name_ar: 'بلايستيشن بلس سنة',       category: 'games',       price: 199,  price_old: 249,  image_url: '/products/p7-psplus.png',            image_gradient: 'ps-gradient',   badge: 'sale',       specs: ['100+ Games','Online MP','Monthly Games'],      stock_status: 'in_stock',   stock_text: 'رقمي · Digital',                rating: 4.8, rating_count: 312, is_deal: false },
  { id: 8,  name: 'Xbox Elite Controller S2', name_ar: 'إكس بوكس إيليت S2',      category: 'accessories', price: 649,  price_old: null, image_url: '/products/p8-xbox-elite.png',        image_gradient: 'xbox-gradient', badge: 'bestseller', specs: ['Rubberized Grip','Hair Trigger Lock','40hr Battery'], stock_status: 'in_stock', stock_text: 'متوفر · In Stock', rating: 4.8, rating_count: 143, is_deal: false },
  { id: 9,  name: 'Game Pass Ultimate 3M',    name_ar: 'جيم باس ألتيميت 3 شهور', category: 'games',       price: 179,  price_old: 219,  image_url: '/products/p9-gamepass.png',          image_gradient: 'xbox-gradient', badge: 'sale',       specs: ['400+ Games','EA Play','Cloud Gaming'],         stock_status: 'in_stock',   stock_text: 'رقمي · Digital',                rating: 4.9, rating_count: 428, is_deal: false },
  { id: 10, name: 'Logitech G Pro X Headset', name_ar: 'سماعة لوجيتك G Pro X',   category: 'accessories', price: 449,  price_old: null, image_url: '/products/p10-headset.png',          image_gradient: 'pc-gradient',   badge: null,         specs: ['Blue VO!CE Mic','DTS 7.1','50mm Drivers'],    stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.7, rating_count: 201, is_deal: false },
  { id: 11, name: 'Corsair K70 RGB TKL',      name_ar: 'كيبورد كورسير K70',       category: 'accessories', price: 389,  price_old: 449,  image_url: '/products/p11-keyboard.png',         image_gradient: 'pc-gradient',   badge: 'sale',       specs: ['Cherry MX','PBT Keycaps','TKL Form'],          stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.6, rating_count: 118, is_deal: false },
  { id: 12, name: 'FC 26 PS5',                name_ar: 'فيفا 26 PS5',             category: 'games',       price: 85,   price_old: null, image_url: '/products/p12-fc26.png',             image_gradient: 'games-gradient',badge: 'new',        specs: ['PS5 Native','Online Seasons','HyperMotion3'], stock_status: 'in_stock',   stock_text: 'رقمي وفيزيائي · Digital & Disc', rating: 4.4, rating_count: 89,  is_deal: false },
  { id: 13, name: 'Spider-Man 2 PS5',         name_ar: 'سبايدرمان 2 PS5',         category: 'games',       price: 199,  price_old: 249,  image_url: '/products/p13-spiderman2.png',       image_gradient: 'ps-gradient',   badge: 'sale',       specs: ['PS5 Exclusive','4K 60fps','DualSense Haptics'], stock_status: 'in_stock', stock_text: 'متوفر · In Stock',              rating: 4.9, rating_count: 267, is_deal: false },
  { id: 14, name: 'Forza Horizon 5 Xbox',     name_ar: 'فورزا هورايزن 5',         category: 'games',       price: 149,  price_old: null, image_url: '/products/p14-forza.png',            image_gradient: 'xbox-gradient', badge: null,         specs: ['4K 60fps','Expansions Included','Xbox/PC'],   stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.8, rating_count: 334, is_deal: false },
  { id: 15, name: 'LG 27GP850 165Hz',         name_ar: 'شاشة LG 27GP850',         category: 'monitors',    price: 1899, price_old: 2199, image_url: '/products/p15-lg-monitor.png',       image_gradient: 'acc-gradient',  badge: 'hot',        specs: ['27"','165Hz','QHD 1440p','1ms'],               stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.7, rating_count: 76,  is_deal: false },
  { id: 16, name: 'Samsung Odyssey G5 32"',   name_ar: 'شاشة سامسونج أوديسي G5', category: 'monitors',    price: 2299, price_old: null, image_url: '/products/p16-samsung-monitor.png',  image_gradient: 'acc-gradient',  badge: 'new',        specs: ['32"','165Hz','QHD','Curved'],                 stock_status: 'low_stock',  stock_text: 'آخر 2 قطع · Low Stock',        rating: 4.8, rating_count: 54,  is_deal: false },
]

export const CATEGORY_ICONS: Record<string, string> = {
  playstation: 'fab fa-playstation',
  xbox:        'fab fa-xbox',
  pc:          'fas fa-microchip',
  games:       'fas fa-compact-disc',
  accessories: 'fas fa-headset',
  monitors:    'fas fa-tv',
}

export const CATEGORY_GRADIENTS: Record<string, string> = {
  playstation: 'ps-gradient',
  xbox:        'xbox-gradient',
  pc:          'pc-gradient',
  games:       'games-gradient',
  accessories: 'acc-gradient',
  monitors:    'acc-gradient',
}

export const CATEGORY_LABELS: Record<string, string> = {
  playstation: 'PlayStation',
  xbox:        'Xbox',
  pc:          'PC Gaming',
  games:       'Games',
  accessories: 'Accessories',
  monitors:    'Monitors',
}
