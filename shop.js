// Machine Shop JavaScript

// Global Variables
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    search: '',
    category: 'all',
    price: 'all'
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const productsGrid = document.getElementById('productsGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Initialize Shop
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.products-section')) {
        initializeShop();
    }
});

function initializeShop() {
    loadProducts();
    setupShopEventListeners();
    initializeFilters();
}

function setupShopEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter dropdowns
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', handlePriceFilter);
    }
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
}

function loadProducts() {
    // Get all product cards from DOM
    const productCards = document.querySelectorAll('.product-card');
    allProducts = Array.from(productCards).map((card, index) => {
        return {
            element: card,
            title: card.querySelector('.product-title')?.textContent || '',
            description: card.querySelector('.product-desc')?.textContent || '',
            category: card.getAttribute('data-category') || 'all',
            price: parseInt(card.getAttribute('data-price')) || 0,
            index: index
        };
    });
    
    filteredProducts = [...allProducts];
    updateProductDisplay();
}

function initializeFilters() {
    // Show only first 6 products initially
    showProducts(6);
}

function handleSearch(event) {
    currentFilters.search = event.target.value.toLowerCase();
    applyFilters();
}

function handleCategoryFilter(event) {
    currentFilters.category = event.target.value;
    applyFilters();
}

function handlePriceFilter(event) {
    currentFilters.price = event.target.value;
    applyFilters();
}

function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Search filter
        const matchesSearch = currentFilters.search === '' || 
            product.title.toLowerCase().includes(currentFilters.search) ||
            product.description.toLowerCase().includes(currentFilters.search);
        
        // Category filter
        const matchesCategory = currentFilters.category === 'all' || 
            product.category === currentFilters.category;
        
        // Price filter
        let matchesPrice = true;
        if (currentFilters.price !== 'all') {
            switch (currentFilters.price) {
                case 'low':
                    matchesPrice = product.price < 50000;
                    break;
                case 'medium':
                    matchesPrice = product.price >= 50000 && product.price <= 200000;
                    break;
                case 'high':
                    matchesPrice = product.price > 200000;
                    break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    updateProductDisplay();
}

function updateProductDisplay() {
    // Hide all products first
    allProducts.forEach(product => {
        product.element.style.display = 'none';
        product.element.classList.add('hidden');
    });
    
    // Show filtered products
    if (filteredProducts.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
        showProducts(Math.min(6, filteredProducts.length));
    }
    
    // Update load more button
    updateLoadMoreButton();
}

function showProducts(count) {
    const visibleProducts = filteredProducts.slice(0, count);
    
    visibleProducts.forEach((product, index) => {
        product.element.style.display = 'block';
        product.element.classList.remove('hidden');
        
        // Add staggered animation
        setTimeout(() => {
            product.element.style.opacity = '1';
            product.element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function loadMoreProducts() {
    const currentlyVisible = filteredProducts.filter(product => 
        !product.element.classList.contains('hidden')
    ).length;
    
    const nextBatch = Math.min(6, filteredProducts.length - currentlyVisible);
    
    if (nextBatch > 0) {
        showProducts(currentlyVisible + nextBatch);
        updateLoadMoreButton();
    }
}

function updateLoadMoreButton() {
    if (!loadMoreBtn) return;
    
    const visibleCount = filteredProducts.filter(product => 
        !product.element.classList.contains('hidden')
    ).length;
    
    if (visibleCount >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

function showEmptyState() {
    if (productsGrid) {
        const emptyState = document.querySelector('.empty-state');
        if (!emptyState) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            `;
            productsGrid.appendChild(emptyDiv);
        }
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

function hideEmptyState() {
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
}

// Product Purchase Function
function buyProduct(productId, sellerUrl) {
    // Track purchase intent
    if (window.KrishiApp) {
        window.KrishiApp.trackEvent('Shop', 'Purchase Intent', productId);
    }
    
    // Show confirmation dialog
    const confirmation = confirm(
        currentLanguage === 'hi' 
            ? 'आप विक्रेता की वेबसाइट पर पुनर्निर्देशित होंगे। क्या आप जारी रखना चाहते हैं?'
            : 'You will be redirected to the seller\'s website. Do you want to continue?'
    );
    
    if (confirmation) {
        // Show loading state
        const clickedBtn = event.target.closest('.buy-btn');
        if (clickedBtn) {
            const originalText = clickedBtn.innerHTML;
            clickedBtn.innerHTML = `
                <div class="spinner"></div>
                <span>${currentLanguage === 'hi' ? 'पुनर्निर्देशित कर रहे हैं...' : 'Redirecting...'}</span>
            `;
            clickedBtn.disabled = true;
            
            setTimeout(() => {
                // Open seller website
                window.open(sellerUrl, '_blank');
                
                // Restore button state
                clickedBtn.innerHTML = originalText;
                clickedBtn.disabled = false;
                
                // Show success message
                if (window.KrishiApp) {
                    window.KrishiApp.showNotification(
                        currentLanguage === 'hi' 
                            ? 'विक्रेता की वेबसाइट खोली गई है!'
                            : 'Seller website opened!',
                        'success'
                    );
                }
            }, 1500);
        }
    }
}

// Product Comparison (Future Feature)
let comparisonList = [];

function addToComparison(productId) {
    if (comparisonList.includes(productId)) {
        removeFromComparison(productId);
        return;
    }
    
    if (comparisonList.length >= 3) {
        if (window.KrishiApp) {
            window.KrishiApp.showNotification(
                'You can compare maximum 3 products at a time',
                'warning'
            );
        }
        return;
    }
    
    comparisonList.push(productId);
    updateComparisonUI();
    
    if (window.KrishiApp) {
        window.KrishiApp.showNotification('Product added to comparison', 'success');
    }
}

function removeFromComparison(productId) {
    comparisonList = comparisonList.filter(id => id !== productId);
    updateComparisonUI();
}

function updateComparisonUI() {
    // Update comparison buttons
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const compareBtn = card.querySelector('.compare-btn');
        
        if (compareBtn) {
            if (comparisonList.includes(productId)) {
                compareBtn.classList.add('active');
                compareBtn.innerHTML = '<i class="fas fa-check"></i> Added';
            } else {
                compareBtn.classList.remove('active');
                compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Compare';
            }
        }
    });
    
    // Update comparison counter
    const compareCounter = document.querySelector('.compare-counter');
    if (compareCounter) {
        compareCounter.textContent = comparisonList.length;
        compareCounter.style.display = comparisonList.length > 0 ? 'block' : 'none';
    }
}

// Wishlist Functionality (Future Feature)
let wishlist = JSON.parse(localStorage.getItem('krishiWishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        if (window.KrishiApp) {
            window.KrishiApp.showNotification('Removed from wishlist', 'info');
        }
    } else {
        wishlist.push(productId);
        if (window.KrishiApp) {
            window.KrishiApp.showNotification('Added to wishlist', 'success');
        }
    }
    
    localStorage.setItem('krishiWishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Product Rating Display
function displayRatings() {
    document.querySelectorAll('.product-rating').forEach(ratingEl => {
        const rating = parseFloat(ratingEl.getAttribute('data-rating')) || 0;
        const starsHtml = generateStars(rating);
        ratingEl.innerHTML = starsHtml;
    });
}

function generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    starsHtml += `<span class="rating-text">(${rating})</span>`;
    return starsHtml;
}

// Price Formatting
function formatProductPrices() {
    document.querySelectorAll('.current-price').forEach(priceEl => {
        const price = parseFloat(priceEl.textContent.replace(/[^\d]/g, ''));
        if (price) {
            priceEl.textContent = window.KrishiApp ? 
                window.KrishiApp.formatCurrency(price) : 
                `₹${price.toLocaleString('en-IN')}`;
        }
    });
    
    document.querySelectorAll('.original-price').forEach(priceEl => {
        const price = parseFloat(priceEl.textContent.replace(/[^\d]/g, ''));
        if (price) {
            priceEl.textContent = window.KrishiApp ? 
                window.KrishiApp.formatCurrency(price) : 
                `₹${price.toLocaleString('en-IN')}`;
        }
    });
}

// Filter Reset
function resetFilters() {
    currentFilters = {
        search: '',
        category: 'all',
        price: 'all'
    };
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    
    applyFilters();
}

// Product Quick View (Future Feature)
function showProductQuickView(productId) {
    // This would open a modal with detailed product information
    console.log('Quick view for product:', productId);
    
    if (window.KrishiApp) {
        window.KrishiApp.showNotification('Quick view feature coming soon!', 'info');
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.products-section')) {
        displayRatings();
        formatProductPrices();
        updateWishlistUI();
    }
});

// Export functions for global use
window.ShopApp = {
    buyProduct,
    addToComparison,
    toggleWishlist,
    resetFilters,
    showProductQuickView
};

// Make buyProduct available globally
window.buyProduct = buyProduct;