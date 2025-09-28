// Digital Krishi Officer - Main JavaScript

// Global Variables
let currentLanguage = 'en';
let mobileMenuOpen = false;

// DOM Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const languageBtn = document.getElementById('languageBtn');
const langDropdown = document.getElementById('langDropdown');
const currentLangSpan = document.getElementById('currentLang');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserPreferences();
});

// Initialize Application
function initializeApp() {
    // Set initial language
    updateLanguage(currentLanguage);
    
    // Initialize mobile menu
    setupMobileMenu();
    
    // Initialize language switcher
    setupLanguageSwitcher();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    console.log('Digital Krishi Officer initialized successfully!');
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Language switcher
    if (languageBtn) {
        languageBtn.addEventListener('click', toggleLanguageDropdown);
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll);
}

// Mobile Menu Functions
function setupMobileMenu() {
    if (mobileMenuToggle && navMenu) {
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    
    if (navMenu) {
        navMenu.classList.toggle('active', mobileMenuOpen);
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.classList.toggle('active', mobileMenuOpen);
    }
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    mobileMenuOpen = false;
    
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}

// Language Switcher Functions
function setupLanguageSwitcher() {
    // Set initial language display
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLanguage.toUpperCase();
    }
}

function toggleLanguageDropdown(event) {
    event.stopPropagation();
    
    if (langDropdown) {
        langDropdown.classList.toggle('show');
    }
}

function changeLanguage(lang) {
    currentLanguage = lang;
    updateLanguage(lang);
    
    // Update language display
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
    
    // Close dropdown
    if (langDropdown) {
        langDropdown.classList.remove('show');
    }
    
    // Save language preference
    localStorage.setItem('krishiLanguage', lang);
    
    console.log(`Language changed to: ${lang}`);
}

function updateLanguage(lang) {
    // Update all elements with data-lang attributes
    const elements = document.querySelectorAll(`[data-${lang}]`);
    
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll(`[data-${lang}-placeholder]`);
    placeholderElements.forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Update form options
    updateFormOptions(lang);
}

function updateFormOptions(lang) {
    const selectElements = document.querySelectorAll('select option[data-' + lang + ']');
    selectElements.forEach(option => {
        const text = option.getAttribute('data-' + lang);
        if (text) {
            option.textContent = text;
        }
    });
}

// Handle Outside Clicks
function handleOutsideClick(event) {
    // Close language dropdown
    if (langDropdown && !languageBtn.contains(event.target)) {
        langDropdown.classList.remove('show');
    }
    
    // Close mobile menu if clicking outside
    if (mobileMenuOpen && navMenu && !navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        closeMobileMenu();
    }
}

// Handle Window Resize
function handleWindowResize() {
    // Close mobile menu on larger screens
    if (window.innerWidth > 768 && mobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Reset mobile menu styles
    if (window.innerWidth > 768) {
        document.body.style.overflow = '';
    }
}

// Handle Scroll Events
function handleScroll() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backdropFilter = 'blur(10px)';
            header.style.backgroundColor = 'rgba(74, 124, 54, 0.95)';
        } else {
            header.style.backdropFilter = 'none';
            header.style.backgroundColor = '';
        }
    }
}

// Feature Functions
function openFeature(featureType) {
    const features = {
        weather: 'Weather alerts and forecasting system will be available here.',
        pest: 'AI-powered pest identification and treatment recommendations coming soon.',
        loans: 'Government loans and schemes information portal will be implemented.',
        market: 'Real-time market prices and trading information will be displayed here.',
        labour: 'Labor connection and workforce management system coming soon.',
        ai: 'Voice-enabled AI assistant for farming guidance.'
    };
    
    const message = features[featureType] || 'Feature coming soon!';
    
    if (featureType === 'ai') {
        startVoiceChat();
    } else {
        showNotification(message, 'info');
    }
}

function startVoiceChat() {
    // Check if speech recognition is supported
    if ('speechSynthesis' in window) {
        showNotification('🎙️ Voice Assistant activated! (Demo mode)', 'success');
        
        // Simulate voice response
        setTimeout(() => {
            const message = currentLanguage === 'hi' 
                ? 'नमस्ते किसान जी! मैं आपकी कैसे मदद कर सकता हूं?' 
                : 'Hello farmer! How can I help you today?';
            
            speakText(message);
        }, 1000);
    } else {
        showNotification('Voice recognition not supported on this device', 'error');
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        speechSynthesis.speak(utterance);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

function closeNotification(closeBtn) {
    const notification = closeBtn.closest('.notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy Loading for Images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Load User Preferences
function loadUserPreferences() {
    // Load saved language
    const savedLanguage = localStorage.getItem('krishiLanguage');
    if (savedLanguage && savedLanguage !== currentLanguage) {
        changeLanguage(savedLanguage);
    }
    
    // Load other preferences
    const theme = localStorage.getItem('krishiTheme');
    if (theme) {
        document.body.classList.add(`theme-${theme}`);
    }
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format Number (for prices, etc.)
function formatNumber(num, locale = 'en-IN') {
    return new Intl.NumberFormat(locale).format(num);
}

// Format Currency
function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(amount);
}

// Analytics (placeholder)
function trackEvent(category, action, label = '') {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    // Implement actual analytics tracking here
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You can send error reports to your analytics service here
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for use in other files
window.KrishiApp = {
    changeLanguage,
    showNotification,
    openFeature,
    startVoiceChat,
    formatCurrency,
    trackEvent
};