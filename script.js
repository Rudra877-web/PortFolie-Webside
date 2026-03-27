(function(){
  const LATENCY_MIN = 150;
  const LATENCY_JITTER = 200;

  const state = {
    products: [],
    filtered: [],
    cart: [],
    category: 'all',
    term: ''
  };

  const els = {
    productGrid: document.getElementById('productGrid'),
    resultsCount: document.getElementById('resultsCount'),
    cartCount: document.getElementById('cartCount'),
    cartDrawer: document.getElementById('cartDrawer'),
    cartBackdrop: document.getElementById('cartBackdrop'),
    cartItems: document.getElementById('cartItems'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTotal: document.getElementById('cartTotal'),
    cartButton: document.getElementById('cartButton'),
    closeCart: document.getElementById('closeCart'),
    openCartInline: document.getElementById('openCartInline'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    categoryPills: document.getElementById('categoryPills'),
    categorySelect: document.getElementById('categorySelect'),
    searchForm: document.getElementById('searchForm'),
    searchInput: document.getElementById('searchInput')
  };

  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const currency = (value) => {
    const num = Number(value);
    return `₹${Number.isFinite(num) ? num.toLocaleString('en-IN') : '0'}`;
  };
  const delay = (result) => new Promise((resolve) => setTimeout(() => resolve(clone(result)), LATENCY_MIN + Math.random()*LATENCY_JITTER));

  const catalogRepository = (() => {
    const products = [
      { id: 'echo-sphere', title: 'Echo Sphere Smart Speaker', price: 3999, previousPrice: 7499, rating: 4.6, reviews: 1204, category: 'electronics', badge: 'Lightning deal', image: 'https://images.unsplash.com/photo-1582719478171-2f3df999cd78?auto=format&fit=crop&w=1000&q=80', description: 'Alexa-enabled 360° smart speaker with immersive bass and room tuning.' },
      { id: 'noise-pro', title: 'Noise-Pro ANC Headphones', price: 7999, previousPrice: 12999, rating: 4.5, reviews: 870, category: 'electronics', badge: 'Prime exclusive', image: 'https://images.unsplash.com/photo-1519669556878-63bdad8a6c9b?auto=format&fit=crop&w=1000&q=80', description: 'Wireless noise cancelling headphones with 35h battery life and multipoint.' },
      { id: 'kindle-paper', title: 'Kindle Paperwhite 11th Gen', price: 11999, previousPrice: 13999, rating: 4.8, reviews: 2150, category: 'books', badge: 'Best seller', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80', description: 'Glare-free 6.8" E Ink display, warm light, USB-C, and weeks of battery life.' },
      { id: 'fire-stick', title: 'Fire TV Stick 4K Max', price: 5999, previousPrice: 6999, rating: 4.7, reviews: 1900, category: 'electronics', badge: '4K UHD', image: 'https://images.unsplash.com/photo-1582719478248-54e9f2af8c89?auto=format&fit=crop&w=1000&q=80', description: 'Streaming stick with Wi‑Fi 6, Dolby Vision, and Alexa voice remote.' },
      { id: 'air-fryer', title: 'Instant Air Fryer 6L', price: 9499, previousPrice: 12999, rating: 4.4, reviews: 760, category: 'home', badge: 'Top rated', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80', description: 'Family-sized air fryer with smart presets and easy-clean basket.' },
      { id: 'desk-lamp', title: 'Nordic Glow Desk Lamp', price: 2499, previousPrice: 3299, rating: 4.3, reviews: 540, category: 'home', badge: 'New arrival', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80', description: 'Dimmable LED desk lamp with warm glow, USB-C port, and memory mode.' },
      { id: 'fitness-watch', title: 'PulseFit Smartwatch', price: 5499, previousPrice: 7999, rating: 4.2, reviews: 1320, category: 'lifestyle', badge: 'Health', image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1000&q=80', description: '24/7 heart-rate tracking, SpO2 monitoring, GPS, and 7-day battery.' },
      { id: 'organic-kit', title: 'Daily Essentials Pantry Kit', price: 1899, previousPrice: 2299, rating: 4.5, reviews: 980, category: 'essentials', badge: 'Value pack', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', description: 'Staples bundle with grains, cold-pressed oil, spices, and snacks.' },
      { id: 'gaming-chair', title: 'Aero Gaming Chair', price: 12999, previousPrice: 15999, rating: 4.4, reviews: 410, category: 'gaming', badge: 'Ergonomic', image: 'https://images.unsplash.com/photo-1587202372775-98927f1dcd7b?auto=format&fit=crop&w=1000&q=80', description: 'PU leather gaming chair with 3D armrests, lumbar support, and recline.' },
      { id: 'denim-jacket', title: 'Essential Denim Jacket', price: 2999, previousPrice: 3499, rating: 4.1, reviews: 620, category: 'fashion', badge: 'Wardrobe staple', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80', description: 'Classic medium-wash denim jacket with stretch and inner pockets.' },
      { id: 'bestseller-book', title: 'Atomic Habits Hardcover', price: 1699, previousPrice: 1999, rating: 4.9, reviews: 5120, category: 'books', badge: 'Best seller', image: 'https://images.unsplash.com/photo-1496104679561-38dede3b0eba?auto=format&fit=crop&w=1000&q=80', description: 'Transformative habit-building guide by James Clear, #1 best-seller.' }
    ];

    const filter = (term, category) => {
      const search = term?.toLowerCase().trim();
      const filtered = products.filter((p) => {
        const matchesCategory = category === 'all' || p.category === category;
        if(!search) return matchesCategory;
        return matchesCategory && (p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
      });
      return delay(filtered);
    };

    return {
      fetchAll: () => delay(products),
      filter,
      find: (id) => Promise.resolve(products.find((p) => p.id === id)),
      snapshot: () => clone(products)
    };
  })();

  const cartRepository = (() => {
    const KEY = 'amazonia-cart';
    let cache = [];

    const load = () => {
      try {
        const raw = localStorage.getItem(KEY);
        cache = raw ? JSON.parse(raw) : [];
      } catch(err) {
        cache = [];
      }
      return cache;
    };

    const persist = () => {
      try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch(err) { /* ignore */ }
    };

    load();

    return {
      all: () => clone(cache),
      add(id) {
        const existing = cache.find((c) => c.id === id);
        if(existing) existing.qty += 1; else cache.push({ id, qty: 1 });
        persist();
        return clone(cache);
      },
      update(id, qty) {
        cache = cache.reduce((acc, item) => {
          if(item.id !== id) return acc.concat(item);
          if(qty > 0) acc.push({ id, qty });
          return acc;
        }, []);
        persist();
        return clone(cache);
      },
      clear() {
        cache = [];
        persist();
        return clone(cache);
      }
    };
  })();

  const renderProducts = (list) => {
    if(!els.productGrid) return;
    els.productGrid.innerHTML = '';
    list.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-media" style="background-image:url('${product.image}')"></div>
        <div class="product-title">${product.title}</div>
        <div class="product-meta">
          <span>${product.rating.toFixed(1)} ★ (${product.reviews} reviews)</span>
          <span class="badge">${product.badge}</span>
        </div>
        <div class="price-row">
          <span class="price">${currency(product.price)}</span>
          <span class="small-muted">M.R.P <s>${currency(product.previousPrice)}</s></span>
        </div>
        <div class="card-actions">
          <button class="btn secondary" data-add="${product.id}">Add to cart</button>
          <span class="quantity-chip">${product.category}</span>
        </div>
      `;
      els.productGrid.appendChild(card);
    });

    if(els.resultsCount) els.resultsCount.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
  };

  const openCart = () => {
    els.cartDrawer?.classList.remove('hidden');
    requestAnimationFrame(() => {
      els.cartDrawer?.classList.add('active');
      els.cartDrawer?.setAttribute('aria-hidden', 'false');
    });
  };

  const closeCart = () => {
    els.cartDrawer?.classList.remove('active');
    els.cartDrawer?.setAttribute('aria-hidden', 'true');
    setTimeout(() => els.cartDrawer?.classList.add('hidden'), 220);
  };

  const updateCartBadge = (count) => {
    if(els.cartCount) els.cartCount.textContent = count;
  };

  const renderCart = () => {
    if(!els.cartItems) return;
    els.cartItems.innerHTML = '';
    const idToProduct = new Map(state.products.map((p) => [p.id, p]));
    let subtotal = 0;
    let itemCount = 0;

    state.cart.forEach((item) => {
      const product = idToProduct.get(item.id);
      if(!product) return;
      subtotal += product.price * item.qty;
      itemCount += item.qty;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-thumb" style="background-image:url('${product.image}')"></div>
        <div>
          <div class="cart-title">${product.title}</div>
          <div class="cart-meta">
            <span>${currency(product.price)}</span>
            <span>${product.rating.toFixed(1)} ★</span>
          </div>
          <div class="cart-meta">
            <div class="cart-qty" data-id="${product.id}">
              <button data-action="dec" aria-label="Decrease quantity">-</button>
              <span>${item.qty}</span>
              <button data-action="inc" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-btn" data-action="remove" data-id="${product.id}">Remove</button>
          </div>
        </div>
      `;
      els.cartItems.appendChild(row);
    });

    const empty = itemCount === 0;
    els.cartEmpty?.classList.toggle('hidden', !empty);
    els.cartItems?.classList.toggle('hidden', empty);

    const formatted = currency(subtotal);
    if(els.cartSubtotal) els.cartSubtotal.textContent = formatted;
    if(els.cartTotal) els.cartTotal.textContent = formatted;
    updateCartBadge(itemCount);
  };

  const syncCartAndRender = (newCart) => {
    state.cart = newCart;
    renderCart();
  };

  const applyFilters = async () => {
    const category = state.category;
    const term = state.term;
    const filtered = await catalogRepository.filter(term, category);
    state.filtered = filtered;
    renderProducts(filtered);
  };

  const handleAddToCart = (id) => {
    syncCartAndRender(cartRepository.add(id));
    const announcer = document.getElementById('srAnnouncer');
    if(announcer) announcer.textContent = 'Added to cart';
  };

  const bindEvents = () => {
    els.productGrid?.addEventListener('click', (e) => {
      const target = e.target.closest('[data-add]');
      if(target) handleAddToCart(target.getAttribute('data-add'));
    });

    document.querySelector('.summary-card [data-add]')?.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-add');
      handleAddToCart(id);
    });

    els.cartButton?.addEventListener('click', openCart);
    els.openCartInline?.addEventListener('click', openCart);
    els.closeCart?.addEventListener('click', closeCart);
    els.cartBackdrop?.addEventListener('click', closeCart);

    els.cartItems?.addEventListener('click', (e) => {
      const action = e.target.getAttribute('data-action');
      if(!action) return;
      const id = e.target.getAttribute('data-id') || e.target.closest('[data-id]')?.getAttribute('data-id');
      const existing = state.cart.find((c) => c.id === id);
      if(!existing) return;

      if(action === 'inc') syncCartAndRender(cartRepository.add(id));
      if(action === 'dec') syncCartAndRender(cartRepository.update(id, Math.max(0, existing.qty - 1)));
      if(action === 'remove') syncCartAndRender(cartRepository.update(id, 0));
    });

    els.checkoutBtn?.addEventListener('click', () => {
      alert('Checkout flow mocked. Persisted cart items stay in place for this demo.');
    });

    els.searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.term = els.searchInput?.value || '';
      applyFilters();
    });

    let searchDebounce;
    els.searchInput?.addEventListener('input', (e) => {
      state.term = e.target.value;
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(applyFilters, 200);
    });

    els.categorySelect?.addEventListener('change', (e) => {
      state.category = e.target.value;
      applyFilters();
    });

    els.categoryPills?.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-category]');
      if(!pill) return;
      state.category = pill.getAttribute('data-category');
      document.querySelectorAll('.pill').forEach((p) => p.classList.toggle('active', p === pill));
      if(els.categorySelect) els.categorySelect.value = state.category;
      applyFilters();
    });

    document.getElementById('signInBtn')?.addEventListener('click', () => {
      alert('Sign-in is simulated for this clone. Use the cart to explore interactions.');
    });
  };

  const init = async () => {
    state.cart = cartRepository.all();
    state.products = await catalogRepository.fetchAll();
    state.filtered = state.products;
    renderProducts(state.filtered);
    renderCart();
    bindEvents();
  };

  init();
})();
