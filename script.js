/* ============================================
   SONY STORE — JavaScript + Supabase
   ============================================ */

// ==========================================
// SUPABASE CLIENT
// ==========================================
const SUPABASE_URL = 'https://joszupwaztftjlimwfap.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvc3p1cHdhenRmdGpsaW13ZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkwOTcsImV4cCI6MjA5MzkwNTA5N30.pFEGxo_hftGKvtLG0uUfQbBGrwbO_ECFSBCvtuzv86I';

let db;

function initSupabase() {
  db = window.sbClient || (window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null);

  if (!db) {
    let retries = 0;
    const retry = setInterval(() => {
      db = window.sbClient || (window.supabase
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        : null);
      retries++;
      if (db) {
        clearInterval(retry);
        loadDeals();
        loadBestSellers();
      } else if (retries >= 10) {
        clearInterval(retry);
        const dealsGrid = document.getElementById('dealsGrid');
        const productsGrid = document.getElementById('productsGrid');
        if (dealsGrid) dealsGrid.innerHTML = '<p class="grid-empty">Unable to load deals. Please refresh the page.</p>';
        if (productsGrid) productsGrid.innerHTML = '<p class="grid-empty">Unable to load products. Please refresh the page.</p>';
      }
    }, 500);
  }
}

// ==========================================
// CATEGORY MAPS
// ==========================================
const CATEGORY_ICONS = {
  playstation: 'fab fa-playstation',
  xbox:        'fab fa-xbox',
  pc:          'fas fa-microchip',
  games:       'fas fa-compact-disc',
  accessories: 'fas fa-headset',
  monitors:    'fas fa-tv',
};

const CATEGORY_GRADIENTS = {
  playstation: 'ps-gradient',
  xbox:        'xbox-gradient',
  pc:          'pc-gradient',
  games:       'games-gradient',
  accessories: 'acc-gradient',
  monitors:    'acc-gradient',
};

const CATEGORY_LABELS = {
  playstation: 'PlayStation',
  xbox:        'Xbox',
  pc:          'PC Gaming',
  games:       'Games',
  accessories: 'Accessories',
  monitors:    'Monitors',
};

// ==========================================
// STATIC PRODUCT DATA (synced from Supabase)
// ==========================================
const STATIC_PRODUCTS = [
  { id: 1,  name: 'PlayStation 5 Slim',       name_ar: 'بلايستيشن 5 سليم',        category: 'playstation', price: 2499, price_old: 2899, image_url: 'products/p1-ps5-slim.png',          image_gradient: 'ps-gradient',    badge: 'sale',       specs: ['1TB SSD','4K 120fps','DualSense'],          stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.9, rating_count: 214, is_deal: true  },
  { id: 2,  name: 'Xbox Series S',             name_ar: 'إكس بوكس سيريس إس',       category: 'xbox',        price: 1299, price_old: 1499, image_url: 'products/p2-xbox-series-s.png',      image_gradient: 'xbox-gradient',  badge: 'hot',        specs: ['512GB','1440p','Game Pass'],                stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.7, rating_count: 189, is_deal: true  },
  { id: 3,  name: 'DualSense Controller',      name_ar: 'دوال سينس',                category: 'accessories', price: 349,  price_old: 429,  image_url: 'products/p3-dualsense.png',          image_gradient: 'ps-gradient',    badge: 'sale',       specs: ['Haptic','Adaptive L2/R2','USB-C'],          stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.8, rating_count: 156, is_deal: true  },
  { id: 4,  name: 'RTX 4060 Ti 8GB',          name_ar: 'RTX 4060 تي',              category: 'pc',          price: 2199, price_old: 2599, image_url: 'products/p4-rtx4060ti.png',          image_gradient: 'pc-gradient',    badge: 'hot',        specs: ['8GB GDDR6','DLSS 3','4K Ready'],            stock_status: 'low_stock',  stock_text: 'آخر 3 قطع · Low Stock',        rating: 4.6, rating_count: 98,  is_deal: true  },
  { id: 5,  name: 'DualSense Edge',            name_ar: 'دوال سينس إيدج',           category: 'accessories', price: 699,  price_old: null, image_url: 'products/p5-dualsense-edge.png',     image_gradient: 'ps-gradient',    badge: 'new',        specs: ['Pro Sticks','Back Buttons','Custom Profiles'], stock_status: 'in_stock', stock_text: 'متوفر · In Stock',              rating: 4.9, rating_count: 87,  is_deal: false },
  { id: 6,  name: 'PS5 Media Remote',          name_ar: 'ريموت ميديا PS5',          category: 'accessories', price: 149,  price_old: null, image_url: 'products/p6-ps5-media-remote.png',   image_gradient: 'ps-gradient',    badge: null,         specs: ['IR Control','USB-C','Voice'],               stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.5, rating_count: 63,  is_deal: false },
  { id: 7,  name: 'PlayStation Plus 12M',      name_ar: 'بلايستيشن بلس سنة',        category: 'games',       price: 199,  price_old: 249,  image_url: 'products/p7-psplus.png',             image_gradient: 'ps-gradient',    badge: 'sale',       specs: ['100+ Games','Online MP','Monthly Games'],   stock_status: 'in_stock',   stock_text: 'رقمي · Digital',                rating: 4.8, rating_count: 312, is_deal: false },
  { id: 8,  name: 'Xbox Elite Controller S2',  name_ar: 'إكس بوكس إيليت S2',       category: 'accessories', price: 649,  price_old: null, image_url: 'products/p8-xbox-elite.png',         image_gradient: 'xbox-gradient',  badge: 'bestseller', specs: ['Rubberized Grip','Hair Trigger Lock','40hr Battery'], stock_status: 'in_stock', stock_text: 'متوفر · In Stock', rating: 4.8, rating_count: 143, is_deal: false },
  { id: 9,  name: 'Game Pass Ultimate 3M',     name_ar: 'جيم باس ألتيميت 3 شهور',  category: 'games',       price: 179,  price_old: 219,  image_url: 'products/p9-gamepass.png',           image_gradient: 'xbox-gradient',  badge: 'sale',       specs: ['400+ Games','EA Play','Cloud Gaming'],      stock_status: 'in_stock',   stock_text: 'رقمي · Digital',                rating: 4.9, rating_count: 428, is_deal: false },
  { id: 10, name: 'Logitech G Pro X Headset',  name_ar: 'سماعة لوجيتك G Pro X',    category: 'accessories', price: 449,  price_old: null, image_url: 'products/p10-headset.png',           image_gradient: 'pc-gradient',    badge: null,         specs: ['Blue VO!CE Mic','DTS 7.1','50mm Drivers'],  stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.7, rating_count: 201, is_deal: false },
  { id: 11, name: 'Corsair K70 RGB TKL',       name_ar: 'كيبورد كورسير K70',        category: 'accessories', price: 389,  price_old: 449,  image_url: 'products/p11-keyboard.png',          image_gradient: 'pc-gradient',    badge: 'sale',       specs: ['Cherry MX','PBT Keycaps','TKL Form'],       stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.6, rating_count: 118, is_deal: false },
  { id: 12, name: 'FC 26 PS5',                 name_ar: 'فيفا 26 PS5',              category: 'games',       price: 85,   price_old: null, image_url: 'products/p12-fc26.png',              image_gradient: 'games-gradient', badge: 'new',        specs: ['PS5 Native','Online Seasons','HyperMotion3'], stock_status: 'in_stock',  stock_text: 'رقمي وفيزيائي · Digital & Disc', rating: 4.4, rating_count: 89,  is_deal: false },
  { id: 13, name: 'Spider-Man 2 PS5',          name_ar: 'سبايدرمان 2 PS5',          category: 'games',       price: 199,  price_old: 249,  image_url: 'products/p13-spiderman2.png',        image_gradient: 'ps-gradient',    badge: 'sale',       specs: ['PS5 Exclusive','4K 60fps','DualSense Haptics'], stock_status: 'in_stock', stock_text: 'متوفر · In Stock',              rating: 4.9, rating_count: 267, is_deal: false },
  { id: 14, name: 'Forza Horizon 5 Xbox',      name_ar: 'فورزا هورايزن 5',          category: 'games',       price: 149,  price_old: null, image_url: 'products/p14-forza.png',             image_gradient: 'xbox-gradient',  badge: null,         specs: ['4K 60fps','Expansions Included','Xbox/PC'],  stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.8, rating_count: 334, is_deal: false },
  { id: 15, name: 'LG 27GP850 165Hz',          name_ar: 'شاشة LG 27GP850',          category: 'monitors',    price: 1899, price_old: 2199, image_url: 'products/p15-lg-monitor.png',        image_gradient: 'acc-gradient',   badge: 'hot',        specs: ['27"','165Hz','QHD 1440p','1ms'],            stock_status: 'in_stock',   stock_text: 'متوفر · In Stock',              rating: 4.7, rating_count: 76,  is_deal: false },
  { id: 16, name: 'Samsung Odyssey G5 32"',    name_ar: 'شاشة سامسونج أوديسي G5',  category: 'monitors',    price: 2299, price_old: null, image_url: 'products/p16-samsung-monitor.png',   image_gradient: 'acc-gradient',   badge: 'new',        specs: ['32"','165Hz','QHD','Curved'],              stock_status: 'low_stock',  stock_text: 'آخر 2 قطع · Low Stock',        rating: 4.8, rating_count: 54,  is_deal: false },
];

// ==========================================
// PRODUCT CARD RENDERER
// ==========================================
function renderProductCard(product) {
  const cat      = product.category || 'accessories';
  const icon     = CATEGORY_ICONS[cat]    || 'fas fa-box';
  const gradient = product.image_gradient || CATEGORY_GRADIENTS[cat] || 'ps-gradient';
  const catLabel = CATEGORY_LABELS[cat]   || cat;
  const emoji    = product.image_emoji    || '';

  const priceOld   = product.price_old || product.original_price || null;
  const priceCur   = parseFloat(product.price);
  const hasDiscount = priceOld && parseFloat(priceOld) > priceCur;
  const discountPct = hasDiscount ? Math.round((1 - priceCur / parseFloat(priceOld)) * 100) : 0;

  const isInStock  = product.stock_status === 'in_stock' || product.in_stock === true;
  const isLowStock = product.stock_status === 'low_stock';
  const isOut      = !isInStock && !isLowStock;

  // Badge
  const badgeMap = { sale: `badge-sale`, hot: `badge-hot`, new: `badge-new`, bestseller: `badge-bestseller` };
  const badgeRaw = product.badge || '';
  const badgeClass = badgeMap[badgeRaw] || 'badge-sale';
  let badgeText = badgeRaw === 'sale' ? `-${discountPct}%`
    : badgeRaw === 'hot'        ? '🔥 Hot'
    : badgeRaw === 'new'        ? '✨ New'
    : badgeRaw === 'bestseller' ? '⭐ Best'
    : (hasDiscount && !badgeRaw ? `-${discountPct}%` : badgeRaw);
  const badgesHtml = badgeText
    ? `<div class="product-badges"><span class="${badgeClass}">${badgeText}</span></div>`
    : '';

  // Stock
  const stockHtml = isOut      ? `<div class="product-stock out-of-stock"><i class="fas fa-circle-xmark"></i> Out of Stock</div>`
    : isLowStock ? `<div class="product-stock low-stock"><i class="fas fa-circle-dot"></i> ${product.stock_text || 'Low Stock'}</div>`
    : `<div class="product-stock in-stock"><i class="fas fa-circle-check"></i> ${product.stock_text || 'In Stock'}</div>`;

  // Specs
  const specsHtml = Array.isArray(product.specs) && product.specs.length
    ? `<div class="product-specs">${product.specs.slice(0, 3).map(s => `<span class="spec-chip">${s}</span>`).join('')}</div>`
    : '';

  // Rating
  const ratingHtml = product.rating
    ? `<div class="product-rating"><span class="stars">★</span> ${parseFloat(product.rating).toFixed(1)} <span class="rating-count">(${(product.rating_count || 0).toLocaleString()})</span></div>`
    : '';

  // Pricing
  const priceOldHtml = hasDiscount
    ? `<span class="price-old">${parseFloat(priceOld).toLocaleString()} LYD</span>`
    : '';
  const savePctHtml = hasDiscount
    ? `<span class="price-save">-${discountPct}%</span>`
    : '';

  const addBtnDisabled = isOut ? ' disabled' : '';
  const addBtnLabel    = isOut
    ? 'Out of Stock'
    : '<i class="fas fa-shopping-cart"></i> Add to Cart';

  // Build image block — real photo when available, gradient fallback otherwise
  const imgBlock = product.image_url
    ? `<div class="product-image-wrap ${gradient}">
         <img
           src="${product.image_url}"
           alt="${product.name}"
           class="product-real-img"
           loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
         >
         <div class="product-img-fallback" style="display:none">
           <i class="${icon}"></i>
         </div>
       </div>`
    : `<div class="product-image-placeholder ${gradient}">
         <i class="${icon}"></i>
       </div>`;

  return `
    <div class="product-card${isOut ? ' out-of-stock' : ''}" data-category="${cat}" data-id="${product.id}">
      <div class="product-image">
        ${imgBlock}
      </div>
      ${badgesHtml}
      <button class="product-wishlist" aria-label="Add to wishlist" data-pid="${product.id}">
        <i class="far fa-heart"></i>
      </button>
      <div class="product-info">
        <div class="product-category">${catLabel}</div>
        <h3 class="product-name">${product.name}</h3>
        ${specsHtml}
        ${ratingHtml}
        ${stockHtml}
        <div class="product-pricing">
          <span class="price-current">${priceCur.toLocaleString()} LYD</span>
          ${priceOldHtml}
          ${savePctHtml}
        </div>
        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}"${addBtnDisabled}>
          ${addBtnLabel}
        </button>
      </div>
    </div>`;
}

// ==========================================
// LOAD DEALS (from static data, instant)
// ==========================================
function loadDeals() {
  const grid = document.getElementById('dealsGrid');
  if (!grid) return;
  const deals = STATIC_PRODUCTS.filter(p => p.is_deal);
  if (!deals.length) {
    grid.innerHTML = '<p class="grid-empty">No deals available right now.</p>';
    return;
  }
  grid.innerHTML = deals.map(renderProductCard).join('');
  bindCardEvents(grid);
}

// ==========================================
// LOAD BEST SELLERS (from static data, instant)
// ==========================================
let allProducts = [...STATIC_PRODUCTS];

// ==========================================
// EXPANDING CARDS — vanilla port of React
// ExpandingCards component
// ==========================================
const EXP_CAT_ICONS = {
  playstation: 'fab fa-playstation',
  xbox:        'fab fa-xbox',
  pc:          'fas fa-microchip',
  games:       'fas fa-compact-disc',
  accessories: 'fas fa-headset',
  monitors:    'fas fa-desktop',
};

function renderExpandingCard(product, isActive) {
  const cat     = product.category || 'accessories';
  const icon    = EXP_CAT_ICONS[cat] || 'fas fa-box';
  const priceF  = parseFloat(product.price).toLocaleString();
  const oldF    = product.price_old ? `<span class="exp-card-price-old">${parseFloat(product.price_old).toLocaleString()} LYD</span>` : '';
  const specs   = (product.specs || []).slice(0, 3).map(s => `<span class="exp-card-spec">${s}</span>`).join('');
  const rating  = product.rating ? `<span class="exp-card-star">★</span> ${parseFloat(product.rating).toFixed(1)} <span style="color:rgba(255,255,255,0.4)">(${(product.rating_count||0).toLocaleString()})</span>` : '';
  const waMsg   = encodeURIComponent(`السلام عليكم، أريد طلب: ${product.name}\nالسعر: ${priceF} LYD`);
  const imgHtml = product.image_url
    ? `<img class="exp-card-img" src="${product.image_url}" alt="${product.name}" loading="lazy">`
    : `<div class="exp-card-img ${product.image_gradient||'ps-gradient'}" style="position:absolute;inset:0;width:100%;height:100%;"></div>`;

  return `
    <li class="exp-card${isActive ? ' active' : ''}" data-category="${cat}" data-id="${product.id}" tabindex="0">
      <div class="exp-card-strip"></div>
      ${imgHtml}
      <div class="exp-card-overlay"></div>
      <span class="exp-card-side-title">${product.name}</span>
      <div class="exp-card-content">
        <div class="exp-card-icon"><i class="${icon}"></i></div>
        <div class="exp-card-name">${product.name}</div>
        <div class="exp-card-price-row">
          <span class="exp-card-price">${priceF} LYD</span>
          ${oldF}
        </div>
        ${rating ? `<div class="exp-card-rating">${rating}</div>` : ''}
        <div class="exp-card-specs">${specs}</div>
        <div class="exp-card-actions">
          <button class="exp-card-btn exp-card-btn-primary add-to-cart-btn" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <a href="https://wa.me/218913518615?text=${waMsg}"
             target="_blank" rel="noopener"
             class="exp-card-btn exp-card-btn-wa"
             onclick="event.stopPropagation()">
            <i class="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </li>`;
}

let _expandResizeHandler = null;

function initExpandingCards(products) {
  const wrapper = document.getElementById('productsGrid');
  if (!wrapper) return;

  // Tear down previous resize listener
  if (_expandResizeHandler) {
    window.removeEventListener('resize', _expandResizeHandler, { passive: true });
    _expandResizeHandler = null;
  }

  wrapper.innerHTML = '';

  if (!products.length) {
    wrapper.innerHTML = '<p class="grid-empty"><i class="fas fa-search"></i> No products found in this category.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'expanding-cards';
  ul.id = 'expandingCardsList';
  ul.innerHTML = products.map((p, i) => renderExpandingCard(p, i === 0)).join('');
  wrapper.appendChild(ul);

  let activeIndex = 0;
  const isDesktop = () => window.innerWidth >= 768;

  function applyGrid() {
    const cards = ul.querySelectorAll('.exp-card');
    const frParts = Array.from(cards).map((_, i) => i === activeIndex ? '5fr' : '1fr').join(' ');
    if (isDesktop()) {
      ul.style.gridTemplateColumns = frParts;
      ul.style.gridTemplateRows   = '1fr';
    } else {
      ul.style.gridTemplateRows   = frParts;
      ul.style.gridTemplateColumns = '1fr';
    }
    cards.forEach((card, i) => card.classList.toggle('active', i === activeIndex));
  }

  ul.querySelectorAll('.exp-card').forEach((card, i) => {
    card.addEventListener('mouseenter', () => { activeIndex = i; applyGrid(); });
    card.addEventListener('click',      () => { activeIndex = i; applyGrid(); });
    card.addEventListener('focus',      () => { activeIndex = i; applyGrid(); });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activeIndex = i; applyGrid(); }
    });
  });

  // Add-to-cart inside expanding cards
  ul.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.exp-card');
      const pid  = parseInt(card.dataset.id);
      const prod = allProducts.find(p => p.id === pid);
      if (prod) addToCart(prod, card, btn);
    });
  });

  // Wishlist hearts if any
  ul.querySelectorAll('.product-wishlist[data-pid]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      window.toggleWishlistItem?.(btn.dataset.pid, btn);
    });
  });

  _expandResizeHandler = () => applyGrid();
  window.addEventListener('resize', _expandResizeHandler, { passive: true });

  applyGrid(); // initial layout
}

function loadBestSellers() {
  initExpandingCards(allProducts);
  initFilterTabs();
}

// ==========================================
// FILTER TABS — re-render expanding cards
// ==========================================
function initFilterTabs() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter   = tab.dataset.filter;
      const filtered = filter === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === filter || (filter === 'pc' && p.category === 'pc'));
      initExpandingCards(filtered);
    });
  });
}

// ==========================================
// BIND CARD EVENTS (add-to-cart + wishlist)
// ==========================================
function bindCardEvents(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const productId = parseInt(card.dataset.id);
      const product = allProducts.find(p => p.id === productId)
        || { id: productId, name: card.querySelector('.product-name').textContent, price: 0, category: card.dataset.category };

      addToCart(product, card, btn);
    });
  });

  container.querySelectorAll('.product-wishlist').forEach(btn => {
    // auth.js handles wishlist via window.toggleWishlistItem
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const pid  = card?.dataset.id;
      if (pid && window.toggleWishlistItem) {
        window.toggleWishlistItem(parseInt(pid), btn);
      }
    });
  });
}

// ==========================================
// CART FUNCTIONALITY
// ==========================================
let cart = [];
let wishlistCount = 0;

function openCart() {
  document.getElementById('cartOverlay').classList.add('active');
  document.getElementById('cartSidebar').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('active');
  document.getElementById('cartSidebar').classList.remove('active');
  document.body.style.overflow = '';
}

function renderCart() {
  const cartBadge = document.getElementById('cartBadge');
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');

  cartBadge.textContent = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Your cart is empty</p>
        <a href="#featured" class="btn btn-primary" onclick="document.getElementById('cartOverlay').click()">Start Shopping</a>
      </div>`;
    cartFooter.style.display = 'none';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-image ${CATEGORY_GRADIENTS[item.category] || 'ps-gradient'}">
        <i class="${CATEGORY_ICONS[item.category] || 'fas fa-box'}"></i>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price.toLocaleString()} LYD</div>
      </div>
      <button class="cart-item-remove" data-index="${index}">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = total.toLocaleString() + ' LYD';
  cartFooter.style.display = '';

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.splice(parseInt(btn.dataset.index), 1);
      renderCart();
    });
  });
}

function addToCart(product, card, btn) {
  cart.push({ id: product.id, name: product.name, price: product.price, category: product.category });
  renderCart();

  btn.innerHTML = '<i class="fas fa-check"></i> Added!';
  btn.style.background = 'var(--success)';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    btn.style.background = '';
  }, 1500);

  openCart();
  setTimeout(closeCart, 1200);
}

// ==========================================
// CHECKOUT — save order inquiry + WhatsApp
// ==========================================
async function checkout() {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const itemsList = cart.map(i => `• ${i.name} — ${i.price.toLocaleString()} LYD`).join('\n');
  const message = `طلب جديد من متجر Microsoft:\n${itemsList}\n\nالإجمالي: ${total.toLocaleString()} LYD`;

  if (db) {
    await db.from('order_inquiries').insert({
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price })),
      total_price: total,
      status: 'pending',
    });
  }

  const waUrl = `https://wa.me/218913518615?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// ==========================================
// NEWSLETTER FORM — Supabase insert
// ==========================================
async function handleNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const email = input.value.trim();

  if (!email) return;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  if (db) {
    const { error } = await db.from('newsletter_subscriptions').insert({ email });
    if (error && error.code !== '23505') {
      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
      btn.style.background = 'var(--danger, #ef4444)';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
      return;
    }
  }

  btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
  btn.style.background = 'var(--success)';
  input.value = '';
  input.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
    btn.style.background = '';
    btn.disabled = false;
    input.disabled = false;
  }, 3000);
}

// ==========================================
// MAIN — DOMContentLoaded
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // Load products instantly from static data
  loadDeals();
  loadBestSellers();

  // Init Supabase in background (used for writes: newsletter, wishlist, orders)
  initSupabase();

  // ==========================================
  // HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  // ==========================================
  // HERO VIDEO — SCROLL PARALLAX + GLITCH FX
  // ==========================================
  const heroSection  = document.getElementById('heroSection');
  const heroVideoWrap = document.getElementById('heroVideoWrap');
  const heroBgVideo  = document.getElementById('heroBgVideo');

  // Spawn floating particles over the video background
  (function spawnParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const COLORS = ['#7c3aed','#3b82f6','#06b6d4','#8b5cf6','#e11d48','#f59e0b'];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const size = Math.random() * 5 + 1.5;
      const drift = (Math.random() - 0.5) * 200;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        bottom:${-Math.random()*20}%;
        background:${COLORS[Math.floor(Math.random()*COLORS.length)]};
        box-shadow: 0 0 ${size*3}px ${COLORS[Math.floor(Math.random()*COLORS.length)]};
        --drift: ${drift}px;
        animation-duration: ${8 + Math.random()*12}s;
        animation-delay: ${-Math.random()*15}s;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  })();

  // Scroll-driven video parallax
  let rafPending = false;
  function updateHeroVideoScroll() {
    if (!heroSection) return;
    const heroH = heroSection.offsetHeight;
    const scrollY = window.scrollY;
    const progress = Math.min(Math.max(scrollY / heroH, 0), 1);
    heroSection.style.setProperty('--scroll-p', progress);

    // Extra: add a subtle 3D tilt as you start scrolling (0–20% only)
    if (heroVideoWrap) {
      const tilt = progress < 0.2 ? progress * 8 : 0;
      heroVideoWrap.style.transform = progress < 0.05
        ? 'none'
        : `perspective(800px) rotateX(${tilt}deg)`;
    }
    rafPending = false;
  }

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 400);

    // Throttle via rAF
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateHeroVideoScroll);
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // MOBILE NAV TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  mobileToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });

  // ==========================================
  // SPOTLIGHT CARD — pointer tracker
  // Updates --x/--y/--xp/--yp on every .product-card
  // so the CSS radial-gradient spotlight follows the mouse.
  // Matches the React GlowCard component logic exactly.
  // ==========================================
  (function initSpotlightCards() {
    let rafId = null;
    let lastX = -9999, lastY = -9999;

    function applySpotlight(cards, x, y) {
      const xp = x / window.innerWidth;
      const yp = y / window.innerHeight;
      cards.forEach(card => {
        card.style.setProperty('--x',  x.toFixed(1));
        card.style.setProperty('--y',  y.toFixed(1));
        card.style.setProperty('--xp', xp.toFixed(4));
        card.style.setProperty('--yp', yp.toFixed(4));
      });
      rafId = null;
    }

    document.addEventListener('pointermove', e => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const cards = document.querySelectorAll('.product-card');
        applySpotlight(cards, lastX, lastY);
      });
    }, { passive: true });

    // Show the border glow only when the pointer enters a card
    document.addEventListener('pointerover', e => {
      const card = e.target.closest?.('.product-card');
      if (card) card.classList.add('glow-active');
    }, { passive: true });

    document.addEventListener('pointerout', e => {
      const card = e.target.closest?.('.product-card');
      if (card && !card.contains(e.relatedTarget)) {
        card.classList.remove('glow-active');
      }
    }, { passive: true });
  })();

  // ==========================================
  // HERO SLIDER
  // ==========================================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startAutoSlide() {
    slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
  prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.slide)); resetAutoSlide(); });
  });

  startAutoSlide();

  // ==========================================
  // DEAL TIMER
  // ==========================================
  const dealTimer = document.getElementById('dealTimer');
  let dH = 7, dM = 42, dS = 18;

  setInterval(() => {
    dS--;
    if (dS < 0) { dS = 59; dM--; }
    if (dM < 0) { dM = 59; dH--; }
    if (dH < 0) { dH = 23; dM = 59; dS = 59; }
    dealTimer.textContent = `${String(dH).padStart(2,'0')}:${String(dM).padStart(2,'0')}:${String(dS).padStart(2,'0')}`;
  }, 1000);

  // ==========================================
  // SEARCH AUTOCOMPLETE
  // ==========================================
  const searchInput = document.getElementById('searchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');

  const suggestions = [
    { icon: 'fab fa-playstation', text: 'PlayStation 5 Pro' },
    { icon: 'fab fa-playstation', text: 'PS5 DualSense Controller' },
    { icon: 'fab fa-xbox',        text: 'Xbox Series X' },
    { icon: 'fab fa-xbox',        text: 'Xbox Game Pass Ultimate' },
    { icon: 'fas fa-microchip',   text: 'RTX 4070 Ti Super' },
    { icon: 'fas fa-microchip',   text: 'RTX 5080' },
    { icon: 'fas fa-headset',     text: 'SteelSeries Arctis Nova Pro' },
    { icon: 'fas fa-keyboard',    text: 'Corsair K100 RGB' },
    { icon: 'fas fa-display',     text: 'Samsung Odyssey OLED G9' },
    { icon: 'fas fa-compact-disc','text': 'GTA VI' },
    { icon: 'fas fa-compact-disc','text': 'EA Sports FC 26' },
    { icon: 'fas fa-chair',       text: 'Secretlab TITAN Evo' },
  ];

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length < 2) { searchSuggestions.classList.remove('active'); return; }

    const matches = suggestions.filter(s => s.text.toLowerCase().includes(query)).slice(0, 6);
    if (!matches.length) { searchSuggestions.classList.remove('active'); return; }

    searchSuggestions.innerHTML = matches.map(s =>
      `<div class="search-suggestion"><i class="${s.icon}"></i><span>${s.text}</span></div>`
    ).join('');
    searchSuggestions.classList.add('active');
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => searchSuggestions.classList.remove('active'), 200);
  });

  searchSuggestions.addEventListener('click', (e) => {
    const s = e.target.closest('.search-suggestion');
    if (s) { searchInput.value = s.querySelector('span').textContent; searchSuggestions.classList.remove('active'); }
  });

  // ==========================================
  // CART UI BINDINGS
  // ==========================================
  document.getElementById('cartBtn').addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

  renderCart();

  // ==========================================
  // NEWSLETTER
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletter);

  // ==========================================
  // NAV LINK — SCROLL + FILTER
  // ==========================================
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = document.getElementById('header')?.offsetHeight || 120;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-link[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const category = link.dataset.category;

      if (category === 'all') {
        // Hot Deals → scroll to flash deals section
        scrollToSection('deals');
      } else {
        // Any category → filter first, then scroll to Best Sellers
        const tab = document.querySelector(`.filter-tab[data-filter="${category}"]`);
        if (tab) {
          tab.click();
        } else {
          document.querySelector('.filter-tab[data-filter="all"]')?.click();
        }
        setTimeout(() => scrollToSection('featured'), 50);
      }
    });
  });

  // ==========================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ==========================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.category-card, .trust-feature, .blog-card, .payment-method').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ==========================================
  // ESC TO CLOSE CART
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

});
