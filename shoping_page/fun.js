// ============================================================
// DATA MANAGEMENT
// ============================================================
let currentUser = null;
let cart = [];

function getProducts() {
    const prods = localStorage.getItem('sh_products');
    return prods ? JSON.parse(prods) : [];
}

function saveProducts(products) {
    localStorage.setItem('sh_products', JSON.stringify(products));
}

function getUsers() {
    const users = localStorage.getItem('sh_users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('sh_users', JSON.stringify(users));
}

function getOrders() {
    const orders = localStorage.getItem('sh_orders');
    return orders ? JSON.parse(orders) : [];
}

function saveOrders(orders) {
    localStorage.setItem('sh_orders', JSON.stringify(orders));
}

function getNotifs() {
    const notifs = localStorage.getItem('sh_notifs');
    return notifs ? JSON.parse(notifs) : [];
}

function saveNotifs(notifs) {
    localStorage.setItem('sh_notifs', JSON.stringify(notifs));
}

function getEmailConfig() {
    const cfg = localStorage.getItem('sh_emailcfg');
    return cfg ? JSON.parse(cfg) : {};
}

// --- NEW: Delivery Boy Data Management ---
function getDeliveryBoys() {
    const drivers = localStorage.getItem('sh_drivers');
    return drivers ? JSON.parse(drivers) : [];
}

function saveDeliveryBoys(drivers) {
    localStorage.setItem('sh_drivers', JSON.stringify(drivers));
}

// ============================================================
// INITIALIZE DATA
// ============================================================
function initData() {
    if (!localStorage.getItem('sh_products')) {
        const products = [
            {id: 1, name: 'The Eternal Thinker', cat: 'Bronze', price: 1299, oldPrice: 1599, stock: 3, artist: 'Marco Bellucci', desc: 'A masterful interpretation of Rodin\'s iconic work, crafted in premium cast bronze with exquisite detail.', img: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=400', badge: 'bestseller', rating: 4.9, created: Date.now() - 100000},
            {id: 2, name: 'Serenity Marble Bust', cat: 'Marble', price: 2499, oldPrice: null, stock: 2, artist: 'Sofia Marchetti', desc: 'Carved from pure Carrara marble, this serene bust captures the timeless beauty of classical sculpture.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', badge: 'new', rating: 5.0, created: Date.now() - 80000},
            {id: 3, name: 'Ancient Warrior', cat: 'Stone', price: 899, oldPrice: 1200, stock: 7, artist: 'Dimitri Kostas', desc: 'A powerful warrior figure carved from authentic travertine stone.', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', badge: 'sale', rating: 4.7, created: Date.now() - 60000},
            {id: 4, name: 'Abstract Flow', cat: 'Abstract', price: 649, oldPrice: null, stock: 12, artist: 'Yuki Tanaka', desc: 'A fluid abstract form capturing the essence of movement.', img: 'https://images.unsplash.com/photo-1558618047-3f85faa037af?w=400', badge: '', rating: 4.6, created: Date.now() - 40000},
            {id: 5, name: 'The Dancing Maiden', cat: 'Bronze', price: 1850, oldPrice: 2200, stock: 1, artist: 'Isabelle Fontaine', desc: 'An elegant dancing figure in rich patinated bronze.', img: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400', badge: 'sale', rating: 4.8, created: Date.now() - 30000},
            {id: 6, name: 'Forest Spirit', cat: 'Wood', price: 445, oldPrice: null, stock: 5, artist: 'James Clearwater', desc: 'Hand-carved from century-old oak, this mystical figure channels the ancient spirit of the forest.', img: 'https://images.unsplash.com/photo-1553532434-5ab5b6b84993?w=400', badge: 'new', rating: 4.5, created: Date.now() - 20000}
        ];
        saveProducts(products);
    }
    
    if (!localStorage.getItem('sh_users')) {
        const users = [
            {id: 1, first: 'Admin', last: 'User', email: 'admin@sculpture.com', pass: 'admin123', role: 'admin', lastLogin: new Date().toISOString(), online: true, orders: []},
            {id: 2, first: 'Jane', last: 'Smith', email: 'jane@test.com', pass: 'pass123', role: 'user', lastLogin: new Date(Date.now() - 3600000).toISOString(), online: false, orders: []},
            // Default delivery boy
            {id: 3, first: 'Dave', last: 'Driver', email: 'driver@sculpture.com', pass: 'driver123', role: 'delivery', lastLogin: new Date().toISOString(), online: false, orders: []}
        ];
        saveUsers(users);
    }
    
    // Seed default delivery boy data
    if (!localStorage.getItem('sh_drivers')) {
        saveDeliveryBoys([
            { id: 3, name: 'Dave Driver', phone: '+1 555-0199', vehicle: 'VAN-01', status: 'Available', activeOrders: 0 }
        ]);
    }

    if (!localStorage.getItem('sh_orders')) saveOrders([]);
    if (!localStorage.getItem('sh_cart')) localStorage.setItem('sh_cart', JSON.stringify([]));
    if (!localStorage.getItem('sh_notifs')) saveNotifs([]);
    
    const session = localStorage.getItem('sh_session');
    if (session) {
        currentUser = JSON.parse(session);
        updateNav();
    }
    
    cart = JSON.parse(localStorage.getItem('sh_cart') || '[]');
    updateCartBadge();
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function toast(msg, type = 'info', icon = 'ℹ️') {
    const container = document.getElementById('toastContainer');
    const toastEl = document.createElement('div');
    toastEl.className = `toast ${type}`;
    toastEl.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    container.appendChild(toastEl);
    setTimeout(() => {
        toastEl.style.opacity = '0';
        setTimeout(() => toastEl.remove(), 300);
    }, 3000);
}

// ============================================================
// VIEW MANAGEMENT
// ============================================================
function showView(view) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    const views = {
        home: 'viewHome',
        shop: 'viewShop',
        checkout: 'viewCheckout',
        orders: 'viewOrders',
        admin: 'viewAdmin',
        delivery: 'viewDelivery' // Added Delivery View
    };
    
    const targetEl = document.getElementById(views[view]);
    if(targetEl) targetEl.classList.add('active');
    
    if (view === 'home') renderHome();
    if (view === 'shop') renderShop();
    if (view === 'checkout') renderCheckout();
    if (view === 'orders') renderMyOrders();
    if (view === 'admin') renderAdmin();
    if (view === 'delivery') renderDeliveryDashboard();
    
    window.scrollTo(0, 0);
}

function showMyOrders() {
    if (!currentUser) {
        openModal('loginModal');
        toast('Please log in to view orders', 'info', 'ℹ️');
        return;
    }
    showView('orders');
}

function toggleMenu() {
    var nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

// ============================================================
// MODAL MANAGEMENT
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function switchModal(closeId, openId) {
    closeModal(closeId);
    setTimeout(() => openModal(openId), 150);
}

function openAddProductModal() {
    document.getElementById('prodModalTitle').textContent = 'Add New Product';
    document.getElementById('editProductId').value = '';
    ['pName', 'pPrice', 'pOldPrice', 'pStock', 'pArtist', 'pDesc', 'pImageUrl', 'pBadge'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('pCat').value = 'Bronze';
    document.getElementById('pRating').value = '4.5';
    openModal('addProductModal');
}
function closeAddProductModal() { closeModal('addProductModal'); }

// ============================================================
// AUTHENTICATION
// ============================================================
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;
    const users = getUsers();
    const user = users.find(u => u.email === email && u.pass === pass);
    
    if (!user) {
        toast('Invalid credentials', 'error', '❌');
        return;
    }
    
    user.lastLogin = new Date().toISOString();
    user.online = true;
    saveUsers(users);
    localStorage.setItem('sh_session', JSON.stringify(user));
    currentUser = user;
    closeModal('loginModal');
    updateNav();
    toast(`Welcome back, ${user.first}! 👋`, 'success', '✅');
    
    // Route user based on role
    if (user.role === 'admin') showView('admin');
    else if (user.role === 'delivery') showView('delivery');
    else showView('home');
}

function register() {
    const first = document.getElementById('regFirst').value.trim();
    const last = document.getElementById('regLast').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    
    if (!first || !last || !email || !pass) return toast('Please fill all fields', 'error', '❌');
    if (pass.length < 6) return toast('Password must be at least 6 characters', 'error', '❌');
    
    const users = getUsers();
    if (users.find(u => u.email === email)) return toast('Email already registered', 'error', '❌');
    
    const newUser = {
        id: Date.now(), first, last, email, pass, role: 'user',
        lastLogin: new Date().toISOString(), online: true, orders: []
    };
    
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem('sh_session', JSON.stringify(newUser));
    currentUser = newUser;
    closeModal('registerModal');
    updateNav();
    toast(`Welcome to SculptureHaven, ${first}! 🎉`, 'success', '🎉');
    showView('home');
}

function logout() {
    if (currentUser) {
        const users = getUsers();
        const user = users.find(u => u.id === currentUser.id);
        if (user) { user.online = false; saveUsers(users); }
    }
    currentUser = null;
    localStorage.removeItem('sh_session');
    cart = [];
    localStorage.setItem('sh_cart', JSON.stringify([]));
    updateCartBadge();
    updateNav();
    showView('home');
    toast('Logged out successfully', 'info', '👋');
}

function updateNav() {
    const elements = {
        loginBtn: document.getElementById('loginBtn'),
        registerBtn: document.getElementById('registerBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        myOrdersBtn: document.getElementById('myOrdersBtn'),
        adminNavBtn: document.getElementById('adminNavBtn'),
        deliveryNavBtn: document.getElementById('deliveryNavBtn')
    };
    
    if (currentUser) {
        if(elements.loginBtn) elements.loginBtn.style.display = 'none';
        if(elements.registerBtn) elements.registerBtn.style.display = 'none';
        if(elements.logoutBtn) {
            elements.logoutBtn.style.display = 'block';
            elements.logoutBtn.textContent = `Logout (${currentUser.first})`;
        }
        
        if(elements.myOrdersBtn) elements.myOrdersBtn.style.display = currentUser.role === 'user' ? 'block' : 'none';
        if(elements.adminNavBtn) elements.adminNavBtn.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        if(elements.deliveryNavBtn) elements.deliveryNavBtn.style.display = currentUser.role === 'delivery' ? 'block' : 'none';
    } else {
        if(elements.loginBtn) elements.loginBtn.style.display = 'block';
        if(elements.registerBtn) elements.registerBtn.style.display = 'block';
        if(elements.logoutBtn) elements.logoutBtn.style.display = 'none';
        if(elements.myOrdersBtn) elements.myOrdersBtn.style.display = 'none';
        if(elements.adminNavBtn) elements.adminNavBtn.style.display = 'none';
        if(elements.deliveryNavBtn) elements.deliveryNavBtn.style.display = 'none';
    }
}

// ============================================================
// PRODUCT FUNCTIONS
// ============================================================
function stars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star${i <= Math.round(rating) ? '' : ' empty'}">★</span>`;
    }
    return `<div class="pc-rating">${starsHtml} <span style="color:var(--text);font-size:0.7rem">(${rating})</span></div>`;
}

function productCard(p) {
    const badgeHtml = p.badge && p.badge !== 'bestseller' ? `<div class="badge ${p.badge}">${p.badge.toUpperCase()}</div>` : '';
    const oldPriceHtml = p.oldPrice ? `<span class="old">$${p.oldPrice.toLocaleString()}</span>` : '';
    return `
        <div class="product-card" onclick="openProduct(${p.id})">
            ${badgeHtml}
            <img src="${p.img}" onerror="this.src='https://via.placeholder.com/400x300?text=Sculpture'" alt="${p.name}">
            <div class="pc-body">
                <div class="pc-cat">${p.cat}</div>
                <div class="pc-name">${p.name}</div>
                ${stars(p.rating)}
                <div class="pc-desc">${p.desc.substring(0, 80)}...</div>
                <div class="pc-footer">
                    <div class="pc-price">$${p.price.toLocaleString()}${oldPriceHtml}</div>
                    <button class="pc-add" onclick="event.stopPropagation();addToCart(${p.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `;
}

function renderHome() {
    const products = getProducts();
    const categories = [...new Set(products.map(p => p.cat))];
    const homeCats = document.getElementById('homeCats');
    if (homeCats) {
        homeCats.innerHTML = `<div class="cat-pill active" onclick="filterHomeByCat(null, this)">All</div>` +
            categories.map(c => `<div class="cat-pill" onclick="filterHomeByCat('${c}', this)">${c}</div>`).join('');
    }
    renderFeatured(products);
}

function renderFeatured(products) {
    const grid = document.getElementById('featuredGrid');
    if (grid) grid.innerHTML = products.map(p => productCard(p)).join('');
}

function filterHomeByCat(cat, el) {
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    const products = cat ? getProducts().filter(p => p.cat === cat) : getProducts();
    renderFeatured(products);
}

function renderShop(filteredProducts = null) {
    const products = filteredProducts || getProducts();
    const resultCount = document.getElementById('shopResultCount');
    if (resultCount) resultCount.textContent = `${products.length} piece${products.length !== 1 ? 's' : ''} found`;
    
    const shopGrid = document.getElementById('shopGrid');
    if (shopGrid) {
        shopGrid.innerHTML = products.length ? products.map(p => productCard(p)).join('') : 
            '<div style="grid-column:1/-1;text-align:center;padding:60px">No sculptures found.</div>';
    }
    
    const catFilters = document.getElementById('catFilters');
    if (catFilters && !catFilters.innerHTML) {
        const categories = [...new Set(getProducts().map(p => p.cat))];
        catFilters.innerHTML = categories.map(c => `
            <label class="cat-check">
                <input type="checkbox" value="${c}" onchange="applyFilters()"> ${c}
            </label>
        `).join('');
    }
}

function applyFilters() {
    let products = getProducts();
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    const checkedCats = [...document.querySelectorAll('#catFilters input:checked')].map(cb => cb.value);
    if (checkedCats.length) products = products.filter(p => checkedCats.includes(p.cat));
    
    const sortBy = document.getElementById('sortBy').value;
    if (sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') products.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'newest') products.sort((a, b) => b.created - a.created);
    
    renderShop(products);
}

function clearFilters() {
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.querySelectorAll('#catFilters input').forEach(cb => cb.checked = false);
    document.getElementById('sortBy').value = 'default';
    renderShop();
}

function doSearch() {
    const query = document.getElementById('navSearch').value.toLowerCase();
    if (!query) return renderShop();
    const products = getProducts().filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.cat.toLowerCase().includes(query) || 
        p.desc.toLowerCase().includes(query)
    );
    showView('shop');
    renderShop(products);
}

function openProduct(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;
    
    const starsHtml = stars(product.rating);
    const oldPriceHtml = product.oldPrice ? `<span style="text-decoration:line-through;margin-left:10px">$${product.oldPrice.toLocaleString()}</span>` : '';
    
    document.getElementById('pdGrid').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem">
            <div><img src="${product.img}" style="width:100%;border-radius:0.5rem" onerror="this.src='https://via.placeholder.com/500x400'"></div>
            <div>
                <div class="pc-cat">${product.cat}</div>
                <h2>${product.name}</h2>
                ${starsHtml}
                <div style="font-size:1.5rem;color:var(--gold);margin:1rem 0">$${product.price.toLocaleString()}${oldPriceHtml}</div>
                <p>${product.desc}</p>
                <div style="margin:1rem 0;padding:1rem;background:var(--dark4);border-radius:0.5rem">
                    <p><strong>Artist:</strong> ${product.artist}</p>
                    <p><strong>Stock:</strong> ${product.stock > 0 ? product.stock + ' available' : 'Out of stock'}</p>
                </div>
                <div style="display:flex;gap:1rem;align-items:center">
                    <div style="display:flex;align-items:center;gap:0.5rem">
                        <button onclick="changeQty(-1)" style="width:32px;height:32px;background:var(--dark4);border:none;border-radius:0.25rem;cursor:pointer">-</button>
                        <span id="pdQty">1</span>
                        <button onclick="changeQty(1)" style="width:32px;height:32px;background:var(--dark4);border:none;border-radius:0.25rem;cursor:pointer">+</button>
                    </div>
                    <button class="form-submit" style="margin:0;width:auto;padding:0.75rem 2rem" onclick="addToCartFromModal(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    openModal('productModal');
}

function changeQty(delta) {
    const qtySpan = document.getElementById('pdQty');
    let qty = Math.max(1, parseInt(qtySpan.textContent) + delta);
    qtySpan.textContent = qty;
}

function addToCartFromModal(productId) {
    addToCart(productId, parseInt(document.getElementById('pdQty').textContent));
    closeModal('productModal');
}

// ============================================================
// CART FUNCTIONS
// ============================================================
function toggleCart() {
    document.getElementById('cartOverlay').classList.toggle('open');
    document.getElementById('cartDrawer').classList.toggle('open');
    renderCart();
}

function addToCart(productId, qty = 1) {
    if (!currentUser) {
        openModal('loginModal');
        return toast('Please log in to add items', 'info', 'ℹ️');
    }
    const existing = cart.find(item => item.id === productId);
    if (existing) existing.qty += qty;
    else cart.push({id: productId, qty: qty});
    
    localStorage.setItem('sh_cart', JSON.stringify(cart));
    updateCartBadge();
    toast('Added to cart! 🛒', 'success', '✅');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('sh_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

function updateCartQty(productId, qty) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty = Math.max(1, qty);
        localStorage.setItem('sh_cart', JSON.stringify(cart));
        renderCart();
    }
}

function updateCartBadge() {
    document.getElementById('cartBadge').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
    const products = getProducts();
    return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.qty : 0);
    }, 0);
}

function renderCart() {
    const products = getProducts();
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cart.length) {
        cartItems.innerHTML = '<div style="text-align:center;padding:2rem">Your cart is empty</div>';
        cartFooter.innerHTML = '';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        return `
            <div class="cart-item">
                <img src="${product.img}" onerror="this.src='https://via.placeholder.com/60'">
                <div class="ci-info">
                    <div class="ci-name">${product.name}</div>
                    <div class="ci-price">$${(product.price * item.qty).toLocaleString()}</div>
                    <div class="ci-qty">
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty - 1})">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
                    </div>
                </div>
                <button class="ci-remove" onclick="removeFromCart(${item.id})">🗑</button>
            </div>
        `;
    }).join('');
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08;
    
    cartFooter.innerHTML = `
        <div class="cart-total-row"><span>Subtotal</span><span>$${subtotal.toLocaleString()}</span></div>
        <div class="cart-total-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '$' + shipping}</span></div>
        <div class="cart-total-row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="cart-total-row big"><span>Total</span><span>$${(subtotal + shipping + tax).toFixed(2)}</span></div>
        <button class="cart-checkout-btn" onclick="goCheckout()">Proceed to Checkout</button>
    `;
}

function goCheckout() {
    if (!currentUser) return (toggleCart(), openModal('loginModal'), toast('Please log in to checkout', 'info'));
    if (!cart.length) return toast('Your cart is empty', 'error', '❌');
    toggleCart();
    showView('checkout');
}

// ============================================================
// CHECKOUT FUNCTIONS (UPDATED WITH PHONE NUMBER)
// ============================================================
function renderCheckout() {
    if (!cart.length) return (showView('shop'), toast('Your cart is empty', 'info'));
    
    const products = getProducts();
    document.getElementById('checkoutItems').innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `<div class="os-item"><span>${product.name} × ${item.qty}</span><span>$${(product.price * item.qty).toLocaleString()}</span></div>`;
    }).join('');
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08;
    
    document.getElementById('osSubtotal').textContent = '$' + subtotal.toLocaleString();
    document.getElementById('osShipping').textContent = shipping === 0 ? 'Free' : '$' + shipping;
    document.getElementById('osTax').textContent = '$' + tax.toFixed(2);
    document.getElementById('osTotal').textContent = '$' + (subtotal + shipping + tax).toFixed(2);
    
    if (currentUser) {
        document.getElementById('shpFirst').value = currentUser.first || '';
        document.getElementById('shpLast').value = currentUser.last || '';
        document.getElementById('shpEmail').value = currentUser.email || '';
        // Pre-fill phone if you ever add it to the user profile
        if(document.getElementById('shpPhone')) {
             document.getElementById('shpPhone').value = currentUser.phone || '';
        }
    }
}

function placeOrder() {
    const first = document.getElementById('shpFirst').value.trim();
    const last = document.getElementById('shpLast').value.trim();
    const email = document.getElementById('shpEmail').value.trim();
    const phone = document.getElementById('shpPhone').value.trim(); // NEW: Grab phone
    const addr = document.getElementById('shpAddr').value.trim();
    const city = document.getElementById('shpCity').value.trim();
    const zip = document.getElementById('shpZip').value.trim();
    
    // NEW: Check that phone is filled out
    if (!first || !last || !email || !phone || !addr || !city || !zip) {
        return toast('Please fill all shipping fields, including phone number', 'error', '❌');
    }
    
    const products = getProducts();
    const subtotal = getCartTotal();
    const shippingCost = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    
    const order = {
        id: 'SH-' + Date.now(),
        userId: currentUser.id,
        userName: `${first} ${last}`,
        userEmail: email,
        userPhone: phone, // NEW: Save phone to the order
        items: cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return { id: item.id, name: product.name, img: product.img, price: product.price, qty: item.qty };
        }),
        shipping: {addr, city, zip},
        subtotal, shippingCost, tax, total,
        status: 'pending',
        deliveryBoyId: null, // Track assigned driver
        date: new Date().toISOString()
    };
    
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) product.stock -= item.qty;
    });
    saveProducts(products);
    addNotification(`New order ${order.id} from ${order.userName} - $${total.toFixed(2)}`);
    
    cart = [];
    localStorage.setItem('sh_cart', JSON.stringify(cart));
    updateCartBadge();
    showReceipt(order);
    toast(`Order placed! ID: ${order.id} 🎉`, 'success', '🎉');
}

function showReceipt(order) {
    document.getElementById('receiptContent').innerHTML = `
        <div class="receipt-box">
            <div class="receipt-logo"><h2>SculptureHaven</h2><p>FINE ART SCULPTURES</p></div>
            <hr class="receipt-divider">
            <div class="receipt-row"><strong>Order ID:</strong> ${order.id}</div>
            <div class="receipt-row"><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</div>
            <div class="receipt-row"><strong>Customer:</strong> ${order.userName}</div>
            <div class="receipt-row"><strong>Phone:</strong> ${order.userPhone}</div> <hr class="receipt-divider">
            <h3>Items</h3>
            ${order.items.map(item => `<div class="receipt-item"><span>${item.name} × ${item.qty}</span><span>$${(item.price * item.qty).toLocaleString()}</span></div>`).join('')}
            <hr class="receipt-divider">
            <div class="receipt-row"><span>TOTAL:</span> <span>$${order.total.toFixed(2)}</span></div>
            <div class="receipt-footer" style="margin-top:1rem;text-align:center"><p>Thank you for your purchase!</p></div>
        </div>
    `;
    openModal('receiptModal');
}

// ============================================================
// ORDER FUNCTIONS
// ============================================================
function renderMyOrders() {
    const orders = getOrders().filter(o => o.userId === currentUser?.id);
    const list = document.getElementById('myOrdersList');
    
    if (!orders.length) return list.innerHTML = '<div style="text-align:center;padding:60px">No orders yet. Start shopping!</div>';
    
    list.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-card-head">
                <div><strong>${order.id}</strong><div class="order-date">${new Date(order.date).toLocaleDateString()}</div></div>
                <span class="status-badge status-${order.status === 'delivered' ? 'delivered' : 'processing'}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-items-preview">
                ${order.items.slice(0, 3).map(item => `<img class="order-thumb" src="${item.img}" onerror="this.src='https://via.placeholder.com/48'">`).join('')}
            </div>
            <div class="order-card-foot">
                <div class="order-total">$${order.total.toFixed(2)}</div>
                <button class="form-submit" style="width:auto;padding:0.5rem 1rem" onclick="viewOrderReceipt('${order.id}')">View Receipt</button>
            </div>
        </div>
    `).join('');
}
function viewOrderReceipt(orderId) {
    const order = getOrders().find(o => o.id === orderId);
    if (order) showReceipt(order);
}

// ============================================================
// ADMIN FUNCTIONS
// ============================================================
function renderAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        showView('home');
        toast('Admin access required', 'error', '❌');
        return;
    }
    document.getElementById('adminWelcome').textContent = `${currentUser.first} ${currentUser.last}`;
    adminSection('dashboard');
}

function adminSection(section) {
    ['adminDashboard', 'adminProducts', 'adminOrders', 'adminUsers', 'adminNotifications', 'adminDelivery'].forEach(s => {
        const el = document.getElementById(s);
        if(el) el.classList.remove('active');
    });
    
    const activeEl = document.getElementById(`admin${section.charAt(0).toUpperCase() + section.slice(1)}`);
    if(activeEl) activeEl.classList.add('active');
    
    document.querySelectorAll('.admin-nav-item').forEach((item) => {
        item.classList.remove('active');
        // Handle variations in text matching
        if (item.textContent.toLowerCase().includes(section.toLowerCase())) {
            item.classList.add('active');
        }
    });
    
    if (section === 'dashboard') renderAdminDashboard();
    if (section === 'products') renderAdminProducts();
    if (section === 'orders') renderAdminOrders();
    if (section === 'users') renderAdminUsers();
    if (section === 'delivery') renderAdminDelivery();
    if (section === 'notifications') renderAdminNotifications();
}

function renderAdminDashboard() {
    const orders = getOrders();
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    
    document.getElementById('adminStatsCards').innerHTML = `
        <div class="stat-card"><div class="sc-icon">💰</div><div class="sc-val">$${revenue.toFixed(0)}</div><div class="sc-lbl">Total Revenue</div></div>
        <div class="stat-card"><div class="sc-icon">📦</div><div class="sc-val">${orders.length}</div><div class="sc-lbl">Total Orders</div><div style="font-size:0.8rem">${pending} pending</div></div>
        <div class="stat-card"><div class="sc-icon">🗿</div><div class="sc-val">${getProducts().length}</div><div class="sc-lbl">Products</div></div>
        <div class="stat-card"><div class="sc-icon">👥</div><div class="sc-val">${getUsers().length}</div><div class="sc-lbl">Users</div></div>
    `;
    
    document.getElementById('recentOrdersTable').innerHTML = orders.slice(0, 5).map(o => `
        <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--dark4)">
            <div><strong>${o.id}</strong><br><span style="font-size:0.75rem">${o.userName}</span></div>
            <span class="status-badge status-${o.status === 'delivered' ? 'delivered' : 'processing'}">${o.status}</span>
            <span style="color:var(--gold)">$${o.total.toFixed(0)}</span>
        </div>
    `).join('') || '<p>No orders yet</p>';
}

function renderAdminProducts() {
    document.querySelector('#adminProductsTable tbody').innerHTML = getProducts().map(p => `
        <tr>
            <td><img src="${p.img}" style="width:50px;height:50px;object-fit:cover;border-radius:4px" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td><strong>${p.name}</strong><br><span style="font-size:0.75rem;color:var(--text)">${p.artist}</span></td>
            <td>${p.cat}</td><td style="color:var(--gold)">$${p.price.toLocaleString()}</td>
            <td style="color:${p.stock > 0 ? 'var(--green)' : 'var(--red)'}">${p.stock}</td>
            <td>
                <button onclick="editProduct(${p.id})" style="background:var(--gold);border:none;padding:0.25rem 0.75rem;border-radius:4px;cursor:pointer;margin-right:0.5rem">Edit</button>
                <button onclick="deleteProduct(${p.id})" style="background:var(--red);border:none;padding:0.25rem 0.75rem;border-radius:4px;cursor:pointer;color:white">Delete</button>
            </td>
        </tr>
    `).join('');
}

function editProduct(id) {
    const p = getProducts().find(p => p.id === id);
    if (!p) return;
    document.getElementById('prodModalTitle').textContent = 'Edit Product';
    document.getElementById('editProductId').value = p.id;
    document.getElementById('pName').value = p.name;
    document.getElementById('pCat').value = p.cat;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pOldPrice').value = p.oldPrice || '';
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pArtist').value = p.artist;
    document.getElementById('pDesc').value = p.desc;
    document.getElementById('pImageUrl').value = p.img;
    document.getElementById('pBadge').value = p.badge || '';
    document.getElementById('pRating').value = p.rating;
    openModal('addProductModal');
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    saveProducts(getProducts().filter(p => p.id !== id));
    renderAdminProducts();
    toast('Product deleted', 'info', '🗑');
}

function saveProduct() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('pName').value.trim();
    const price = parseFloat(document.getElementById('pPrice').value);
    if (!name || !price) return toast('Name and price are required', 'error', '❌');
    
    const pData = {
        name, cat: document.getElementById('pCat').value, price, 
        oldPrice: parseFloat(document.getElementById('pOldPrice').value) || null,
        stock: parseInt(document.getElementById('pStock').value) || 0,
        artist: document.getElementById('pArtist').value.trim(), desc: document.getElementById('pDesc').value.trim(),
        img: document.getElementById('pImageUrl').value.trim(), badge: document.getElementById('pBadge').value,
        rating: parseFloat(document.getElementById('pRating').value) || 4.5
    };
    
    const products = getProducts();
    if (id) {
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) products[index] = {...products[index], ...pData};
    } else {
        products.push({ id: Date.now(), ...pData, created: Date.now() });
    }
    
    saveProducts(products);
    closeAddProductModal();
    renderAdminProducts();
    toast('Product saved!', 'success', '✅');
}

// ============================================================
// ADMIN ORDERS & ASSIGNMENT
// ============================================================
function renderAdminOrders() {
    const orders = getOrders();
    const drivers = getDeliveryBoys();
    
    document.querySelector('#adminOrdersTable tbody').innerHTML = orders.map(o => {
        const driver = drivers.find(d => d.id == o.deliveryBoyId);
        const driverName = driver ? driver.name : 'Not Assigned';
        
        return `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td><div>${o.userName}</div><div style="font-size:0.75rem">${o.userEmail}</div></td>
                <td>${o.items.length} item(s)</td>
                <td style="color:var(--gold)">$${o.total.toFixed(2)}</td>
                <td style="font-size:0.8rem">${new Date(o.date).toLocaleDateString()}</td>
                <td><span class="status-badge status-${o.status === 'delivered' ? 'delivered' : 'processing'}">${o.status}</span></td>
                <td>${driverName}</td>
                <td>
                    ${!o.deliveryBoyId && (o.status === 'pending' || o.status === 'processing') ? 
                      `<button onclick="openAssignModal('${o.id}')" style="background:var(--gold);border:none;padding:0.25rem 0.75rem;border-radius:4px;cursor:pointer;margin-right:5px;">Assign</button>` 
                      : ''}
                    <button onclick="viewOrderReceipt('${o.id}')" style="background:var(--dark4);border:1px solid #666;padding:0.25rem 0.75rem;border-radius:4px;cursor:pointer;color:white;">Receipt</button>
                </td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="8" style="text-align:center">No orders yet</td></tr>';
}

function renderAdminUsers() {
    const orders = getOrders();
    document.querySelector('#adminUsersTable tbody').innerHTML = getUsers().map(u => `
        <tr>
            <td><strong>${u.first} ${u.last}</strong></td><td>${u.email}</td>
            <td><span class="status-badge status-${u.role === 'admin' ? 'delivered' : 'processing'}">${u.role.toUpperCase()}</span></td>
            <td>${u.online ? 'Online' : 'Offline'}</td><td style="font-size:0.8rem">${new Date(u.lastLogin).toLocaleString()}</td>
            <td style="color:var(--gold)">${orders.filter(o => o.userId === u.id).length}</td>
        </tr>
    `).join('');
}

// --- NEW: Admin Delivery Boy Management ---
function renderAdminDelivery() {
    const drivers = getDeliveryBoys();
    const tbody = document.querySelector('#adminDeliveryBoysTable tbody');
    if(!tbody) return;
    
    tbody.innerHTML = drivers.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${d.phone}</td>
            <td>${d.vehicle}</td>
            <td><span style="color:${d.status==='Available'?'#2ecc71':'#e74c3c'}">${d.status}</span></td>
            <td>${d.activeOrders}</td>
            <td><button onclick="removeDeliveryBoy(${d.id})" style="background:#e74c3c;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">Remove</button></td>
        </tr>
    `).join('') || '<tr><td colspan="7" style="text-align:center">No Delivery Boys added yet.</td></tr>';
}

function saveDeliveryBoy() {
    const name = document.getElementById('dbName').value.trim();
    const phone = document.getElementById('dbPhone').value.trim();
    const email = document.getElementById('dbEmail').value.trim();
    const vehicle = document.getElementById('dbVehicle').value.trim();
    const pass = document.getElementById('dbPassword').value;

    if(!name || !email || !pass) return toast('Name, Email, and Password are required', 'error', '❌');

    const users = getUsers();
    if(users.find(u => u.email === email)) return toast('Email already exists', 'error', '❌');

    const newId = Date.now();
    
    // 1. Save as a user so they can login
    users.push({ 
        id: newId, 
        first: name.split(' ')[0], 
        last: name.split(' ').slice(1).join(' ') || '', 
        email, 
        pass, 
        role: 'delivery', 
        lastLogin: new Date().toISOString(), 
        online: false, 
        orders: [] 
    });
    
    // 2. Save in Delivery Boy roster
    const drivers = getDeliveryBoys();
    drivers.push({ id: newId, name, phone, vehicle, status: 'Available', activeOrders: 0 });

    saveUsers(users);
    saveDeliveryBoys(drivers);
    
    closeModal('addDeliveryBoyModal');
    toast('Delivery Boy Added Successfully', 'success', '✅');
    renderAdminDelivery();
}

function removeDeliveryBoy(id) {
    if(!confirm("Are you sure you want to remove this delivery boy?")) return;
    
    let drivers = getDeliveryBoys();
    drivers = drivers.filter(d => d.id !== id);
    saveDeliveryBoys(drivers);
    
    let users = getUsers();
    users = users.filter(u => u.id !== id);
    saveUsers(users);
    
    toast('Delivery Boy Removed', 'info', '🗑');
    renderAdminDelivery();
}

// --- NEW: Order Assignment Logic ---
function openAssignModal(orderId) {
    document.getElementById('assignOrderId').value = orderId;
    const drivers = getDeliveryBoys();
    const selectDropdown = document.getElementById('dbSelectDropdown');
    
    selectDropdown.innerHTML = '<option value="">-- Choose Driver --</option>' + 
        drivers.map(d => `<option value="${d.id}">${d.name} (${d.vehicle}) - Active: ${d.activeOrders}</option>`).join('');
    
    openModal('assignDeliveryModal');
}

function confirmAssignment() {
    const orderId = document.getElementById('assignOrderId').value;
    const dbId = parseInt(document.getElementById('dbSelectDropdown').value);

    if(!dbId) return toast('Select a driver first', 'error', '❌');

    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if(order) {
        order.deliveryBoyId = dbId;
        order.status = "Out for Delivery";
        saveOrders(orders);
    }

    const drivers = getDeliveryBoys();
    const driver = drivers.find(d => d.id === dbId);
    if(driver) {
        driver.activeOrders++;
        saveDeliveryBoys(drivers);
    }

    addNotification(`Order ${orderId} assigned to driver ${driver.name}`);

    closeModal('assignDeliveryModal');
    toast(`Order assigned to ${driver.name}`, 'success', '🚚');
    renderAdminOrders();
    renderAdminDelivery();
}


// ============================================================
// DELIVERY BOY DASHBOARD (UPDATED - NO POPUP)
// ============================================================
function renderDeliveryDashboard() {
    if (!currentUser || currentUser.role !== 'delivery') return;
    
    document.getElementById('deliveryBoyWelcome').textContent = currentUser.first;
    
    const myOrders = getOrders().filter(o => o.deliveryBoyId === currentUser.id);
    const pending = myOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    const completed = myOrders.filter(o => o.status === 'delivered');

    document.getElementById('delPendingCount').textContent = pending.length;
    document.getElementById('delCompletedCount').textContent = completed.length;

    const tbody = document.querySelector('#deliveryBoyOrdersTable tbody');
    if(!tbody) return;

    tbody.innerHTML = myOrders.map(o => `
        <tr>
            <td><strong>${o.id}</strong></td>
            <td>
                <strong>${o.userName}</strong><br>
                <span style="font-size:0.85rem; color:#888;">📧 ${o.userEmail || 'No email'}</span><br>
                <span style="font-size:0.85rem; color:#888;">📞 ${o.userPhone || 'Not provided'}</span>
            </td>
            <td>
                ${o.shipping.addr}<br>
                <span style="font-size:0.8rem; color:#888;">${o.shipping.city}, ${o.shipping.zip}</span>
            </td>
            <td>$${o.total.toFixed(2)}</td>
            <td><span class="status-badge status-${o.status === 'delivered' ? 'delivered' : 'processing'}">${o.status.toUpperCase()}</span></td>
            <td>
                <select onchange="updateDeliveryOrderStatus('${o.id}', this.value)" style="padding: 6px; border-radius: 4px; border: 1px solid #ccc; background: white; color: black; cursor: pointer;">
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center">No assigned orders yet.</td></tr>';
}

function updateDeliveryOrderStatus(orderId, newStatus) {
    // REMOVED: The confirm() popup has been removed. 
    // The status will now update immediately when selected.

    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if(order) {
        const oldStatus = order.status;
        order.status = newStatus;
        saveOrders(orders);
        
        // Update the driver's "Active Orders" count based on the status change
        const drivers = getDeliveryBoys();
        const driver = drivers.find(d => d.id === currentUser.id);
        
        if(driver) {
            const wasActive = (oldStatus !== 'delivered' && oldStatus !== 'cancelled');
            const isNowActive = (newStatus !== 'delivered' && newStatus !== 'cancelled');
            
            // If it was active but is now completed/cancelled, decrease count
            if (wasActive && !isNowActive && driver.activeOrders > 0) {
                driver.activeOrders--;
            } 
            // If it was completed/cancelled but is now moved back to active, increase count
            else if (!wasActive && isNowActive) {
                driver.activeOrders++;
            }
            saveDeliveryBoys(drivers);
        }
        
        addNotification(`Order ${orderId} was marked as ${newStatus} by Driver ${currentUser.first}`);
        
        // We still show the quiet, non-interrupting toast notification at the bottom
        toast(`Order updated to ${newStatus}!`, 'success', '📦');
        renderDeliveryDashboard();
    }
}

// ============================================================
// ADMIN NOTIFICATIONS
// ============================================================
function renderAdminNotifications() {
    const cfg = getEmailConfig();
    document.getElementById('adminEmail').value = cfg.adminEmail || '';
    
    document.getElementById('notifLog').innerHTML = getNotifs().map(n => `
        <div style="background:var(--dark4);padding:0.75rem;border-radius:8px;margin-bottom:0.5rem">
            <div>📧 ${n.msg}</div>
            <div style="font-size:0.7rem;color:var(--text);margin-top:0.25rem">${new Date(n.time).toLocaleString()}</div>
        </div>
    `).join('') || '<p>No notifications yet</p>';
}

function saveEmailConfig() {
    localStorage.setItem('sh_emailcfg', JSON.stringify({ adminEmail: document.getElementById('adminEmail').value }));
    toast('Email configuration saved!', 'success', '✅');
}

function addNotification(msg) {
    const notifs = getNotifs();
    notifs.unshift({msg, time: Date.now()});
    if (notifs.length > 50) notifs.pop();
    saveNotifs(notifs);
}

// ============================================================
// WINDOW ONLOAD INITIALIZATION
// ============================================================
window.addEventListener('load', () => {
    initData();
    renderHome();
    
    const payCard = document.getElementById('payCard');
    if (payCard) {
        payCard.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 16);
            e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
        });
    }
    
    const payExp = document.getElementById('payExp');
    if (payExp) {
        payExp.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
            e.target.value = v;
        });
    }
});