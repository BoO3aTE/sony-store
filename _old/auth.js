/* ============================================
   AUTH.JS — Supabase Auth + Wishlist
   Loaded via defer after supabase CDN in <head>
   Runs before DOMContentLoaded — sets window.sbClient
   ============================================ */

const _SUPA_URL  = 'https://joszupwaztftjlimwfap.supabase.co';
const _SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvc3p1cHdhenRmdGpsaW13ZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjkwOTcsImV4cCI6MjA5MzkwNTA5N30.pFEGxo_hftGKvtLG0uUfQbBGrwbO_ECFSBCvtuzv86I';

// Create shared client immediately (supabase CDN is loaded before this via defer order)
if (window.supabase && !window.sbClient) {
  window.sbClient = window.supabase.createClient(_SUPA_URL, _SUPA_KEY);
}

/* ---- Wishlist state ---- */
let _wishlistIds = new Set();

/* ============================================
   AUTH STATE + HEADER UI
   ============================================ */
async function _initAuth() {
  const client = window.sbClient;
  if (!client) return;

  // Auth state listener (fires on sign in / sign out / token refresh)
  client.auth.onAuthStateChange(async (event, session) => {
    _updateHeaderUI(session?.user || null);
    if (event === 'SIGNED_IN') {
      await _loadWishlist();
    } else if (event === 'SIGNED_OUT') {
      _clearWishlistUI();
    }
  });

  // Read current session on page load
  const { data: { user } } = await client.auth.getUser();
  _updateHeaderUI(user);
  if (user) await _loadWishlist();
}

function _updateHeaderUI(user) {
  const btn = document.getElementById('accountBtn');
  if (!btn) return;

  if (user) {
    const initial = (user.email || 'U')[0].toUpperCase();
    const name    = user.user_metadata?.full_name || user.email.split('@')[0];
    btn.href      = '#';
    btn.innerHTML = `<div class="user-avatar">${initial}</div><span class="user-name-label">${name}</span>`;
    btn.onclick   = (e) => { e.preventDefault(); _toggleUserMenu(user); };
  } else {
    btn.href      = 'signin.html';
    btn.innerHTML = `<i class="fas fa-user"></i><span>Sign In</span>`;
    btn.onclick   = null;
  }
}

function _toggleUserMenu(user) {
  const existing = document.getElementById('authUserMenu');
  if (existing) { existing.remove(); return; }

  const name = user.user_metadata?.full_name || user.email;
  const menu = document.createElement('div');
  menu.id = 'authUserMenu';
  menu.className = 'user-dropdown';
  menu.innerHTML = `
    <div class="user-dropdown-header">
      <div class="user-dropdown-avatar">${(user.email||'U')[0].toUpperCase()}</div>
      <div>
        <div class="user-dropdown-name">${name}</div>
        <div class="user-dropdown-email">${user.email}</div>
      </div>
    </div>
    <div class="user-dropdown-divider"></div>
    <button class="user-dropdown-item" onclick="window._openWishlistSidebar()">
      <i class="fas fa-heart"></i> My Wishlist <span class="user-dropdown-badge" id="menuWishlistCount">${_wishlistIds.size}</span>
    </button>
    <div class="user-dropdown-divider"></div>
    <button class="user-dropdown-item danger" onclick="window.authSignOut()">
      <i class="fas fa-sign-out-alt"></i> Sign Out
    </button>
  `;

  const btn = document.getElementById('accountBtn');
  btn.parentElement.style.position = 'relative';
  btn.parentElement.appendChild(menu);

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function _close(e) {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.remove();
        document.removeEventListener('click', _close);
      }
    });
  }, 0);
}

/* ============================================
   WISHLIST CRUD
   ============================================ */
async function _loadWishlist() {
  const client = window.sbClient;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return;

  const { data } = await client
    .from('wishlist')
    .select('product_id')
    .eq('user_id', user.id);

  _wishlistIds = new Set((data || []).map(r => r.product_id));
  _updateWishlistBadge();
  _syncHeartButtons();
}

function _syncHeartButtons() {
  document.querySelectorAll('.product-wishlist[data-pid]').forEach(btn => {
    const pid = parseInt(btn.dataset.pid);
    _applyHeartState(btn, _wishlistIds.has(pid));
  });
}

function _applyHeartState(btn, active) {
  const icon = btn.querySelector('i');
  if (!icon) return;
  if (active) {
    btn.classList.add('active');
    icon.classList.replace('far', 'fas');
  } else {
    btn.classList.remove('active');
    icon.classList.replace('fas', 'far');
  }
}

function _updateWishlistBadge() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) badge.textContent = _wishlistIds.size || 0;
  // keep dropdown count in sync
  const menuBadge = document.getElementById('menuWishlistCount');
  if (menuBadge) menuBadge.textContent = _wishlistIds.size;
}

function _clearWishlistUI() {
  _wishlistIds = new Set();
  _updateWishlistBadge();
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    _applyHeartState(btn, false);
  });
}

/* Public: called from bindCardEvents in script.js */
window.toggleWishlistItem = async function(productId, btn) {
  const client = window.sbClient;
  if (!client) return;

  const { data: { user } } = await client.auth.getUser();

  if (!user) {
    // Not signed in — redirect to sign-in and come back
    sessionStorage.setItem('afterSignIn', window.location.href);
    window.location.href = 'signin.html';
    return;
  }

  const pid = parseInt(productId);
  if (_wishlistIds.has(pid)) {
    // Remove
    await client.from('wishlist').delete()
      .eq('user_id', user.id)
      .eq('product_id', pid);
    _wishlistIds.delete(pid);
    _applyHeartState(btn, false);
  } else {
    // Add
    await client.from('wishlist').insert({ user_id: user.id, product_id: pid });
    _wishlistIds.add(pid);
    _applyHeartState(btn, true);
  }

  _updateWishlistBadge();
  _renderWishlistSidebar(); // refresh sidebar if open
};

/* ============================================
   WISHLIST SIDEBAR
   ============================================ */
window._openWishlistSidebar = function() {
  const sidebar = document.getElementById('wishlistSidebar');
  const overlay = document.getElementById('wishlistOverlay');
  if (!sidebar || !overlay) return;

  // Close user dropdown
  document.getElementById('authUserMenu')?.remove();

  sidebar.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  _renderWishlistSidebar();
};

window._closeWishlistSidebar = function() {
  document.getElementById('wishlistSidebar')?.classList.remove('active');
  document.getElementById('wishlistOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
};

async function _renderWishlistSidebar() {
  const body = document.getElementById('wishlistItems');
  if (!body) return;

  if (_wishlistIds.size === 0) {
    body.innerHTML = `
      <div class="wishlist-empty">
        <i class="fas fa-heart-crack"></i>
        <p>Your wishlist is empty</p>
        <small>Click the ♡ on any product to save it here</small>
      </div>`;
    return;
  }

  const client = window.sbClient;
  const { data } = await client
    .from('products')
    .select('id, name, price, category')
    .in('id', [..._wishlistIds]);

  if (!data || data.length === 0) { body.innerHTML = ''; return; }

  const ICONS = {
    playstation: 'fab fa-playstation',
    xbox:        'fab fa-xbox',
    pc:          'fas fa-microchip',
    games:       'fas fa-compact-disc',
    accessories: 'fas fa-headset',
  };
  const GRADS = {
    playstation: 'ps-gradient',
    xbox:        'xbox-gradient',
    pc:          'pc-gradient',
    games:       'games-gradient',
    accessories: 'acc-gradient',
  };

  body.innerHTML = data.map(p => `
    <div class="wishlist-item">
      <div class="wishlist-item-img ${GRADS[p.category]||'ps-gradient'}">
        <i class="${ICONS[p.category]||'fas fa-box'}"></i>
      </div>
      <div class="wishlist-item-info">
        <div class="wishlist-item-name">${p.name}</div>
        <div class="wishlist-item-price">${p.price.toLocaleString()} LYD</div>
      </div>
      <button class="wishlist-item-remove" title="Remove" data-pid="${p.id}">
        <i class="fas fa-heart"></i>
      </button>
    </div>
  `).join('');

  body.querySelectorAll('.wishlist-item-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pid = parseInt(btn.dataset.pid);
      const fakeBtn = { querySelector: () => null, classList: { has: () => true, remove: ()=>{}, add: ()=>{} } };
      await window.toggleWishlistItem(pid, fakeBtn);
      _renderWishlistSidebar();
    });
  });
}

/* ============================================
   SIGN OUT
   ============================================ */
window.authSignOut = async function() {
  await window.sbClient.auth.signOut();
  window.location.reload();
};

/* ============================================
   WISHLIST ICON CLICK — header button
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  _initAuth();

  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const client = window.sbClient;
      if (!client) return;
      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        sessionStorage.setItem('afterSignIn', window.location.href);
        window.location.href = 'signin.html';
      } else {
        window._openWishlistSidebar();
      }
    });
  }

  const overlay = document.getElementById('wishlistOverlay');
  if (overlay) overlay.addEventListener('click', window._closeWishlistSidebar);
});
