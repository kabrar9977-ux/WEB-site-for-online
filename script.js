function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) {
        return;
    }
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badge.textContent = count;
    badge.style.display = count ? 'inline-flex' : 'none';
}

function addToCart(name, price) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartBadge();
    alert(name + ' added to cart!');
}

function showCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartButtons = document.getElementById('cartButtons');

    if (!cartItems || !cartTotal || !cartButtons) {
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0 SAR';
        cartButtons.style.display = 'none';
        updateCartBadge();
        return;
    }

    cartButtons.style.display = 'block';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <div class="cart-quantity">${item.price} SAR</div>
                </div>
                <button class="small-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    cartTotal.textContent = total + ' SAR';
    updateCartBadge();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    showCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    showCart();
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    window.location.href = 'Checkout.html';
}

function filterProducts() {
    const searchText = document.getElementById('searchBox')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('categoryFilter')?.value || 'all';
    const products = document.getElementsByClassName('product-box');

    for (let product of products) {
        const productName = product.getAttribute('data-name')?.toLowerCase() || '';
        const productCategory = product.getAttribute('data-category') || '';
        const matchesSearch = productName.includes(searchText);
        const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
        product.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
    }
}

function applySearchAndCategoryFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search') || '';
    const category = params.get('category') || 'all';
    const searchBox = document.getElementById('searchBox');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchBox) {
        searchBox.value = searchQuery;
    }
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    if (searchBox || categoryFilter) {
        filterProducts();
    }
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        performSearch(event.target.closest('.search-bar'));
    }
}

function performSearch(container) {
    const input = container?.querySelector('input[type=text]') || document.getElementById('searchInput');
    if (!input) {
        return;
    }
    const value = input.value.trim();
    if (!value) {
        return;
    }
    window.location.href = `products.html?search=${encodeURIComponent(value)}`;
}

function sendContactMessage(event) {
    if (event) {
        event.preventDefault();
    }
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
        alert('Please fill in your name, email and message to send a request.');
        return;
    }

    alert(`Thanks, ${name}! Your message has been sent. We will contact you at ${email}.`);
    document.getElementById('contactForm')?.reset();
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    if (window.location.pathname.includes('products.html')) {
        applySearchAndCategoryFromQuery();
    }
    if (window.location.pathname.includes('cart.html')) {
        showCart();
    }
});