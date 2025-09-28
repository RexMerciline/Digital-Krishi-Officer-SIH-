/**
 * Farmer Query Chatbot - Main Application
 * Mobile-first AI assistant for farmers with voice support, weather, market prices, and calculations
 */

// Application State
const AppState = {
    currentLang: 'en',
    currentTab: 'chat',
    isVoiceRecording: false,
    isVoiceAssistantActive: false,
    selectedImage: null,
    weatherData: null,
    marketData: null,
    governmentSchemes: [],
    chatMessages: [],
    voiceSettings: {
        language: 'en-IN',
        rate: 1,
        pitch: 1
    }
};

// Internationalization (i18n) Data
const translations = {
    en: {
        'tab.chat': 'Chat',
        'tab.weather': 'Weather',
        'tab.market': 'Market',
        'tab.calculator': 'Calculator',
        'tab.voice': 'Voice',
        'chat.placeholder': 'Ask about crops, weather, prices...',
        'voice.listening': 'Listening...',
        'voice.ready': 'Ready to listen',
        'voice.start': 'Start Assistant',
        'voice.stop': 'Stop Assistant',
        'voice.title': 'Voice Assistant',
        'voice.subtitle': 'Speak naturally in English, Hindi, or Malayalam',
        'voice.settings': 'Voice Settings',
        'voice.language': 'Voice Language',
        'voice.speed': 'Speech Speed',
        'voice.pitch': 'Voice Pitch',
        'voice.commands_title': 'Sample Commands',
        'weather.title': 'Weather Forecast',
        'weather.advice_title': 'Farming Advice',
        'market.title': 'Market Prices & Predictions',
        'market.current_price': 'Current Price',
        'market.prediction': '7-Day Prediction',
        'market.advice_title': 'Market Advice',
        'calculator.title': 'Profit Calculator',
        'calculator.subtitle': 'Calculate your crop profits and explore government schemes',
        'calculator.crop': 'Crop Type',
        'calculator.quantity': 'Quantity (Quintals)',
        'calculator.cost_price': 'Cost Price (₹/Quintal)',
        'calculator.selling_price': 'Selling Price (₹/Quintal)',
        'calculator.scheme': 'Government Scheme',
        'calculator.calculate': 'Calculate Profit',
        'calculator.result_title': 'Calculation Result',
        'calculator.total_cost': 'Total Cost',
        'calculator.total_revenue': 'Total Revenue',
        'calculator.subsidy': 'Subsidy',
        'calculator.net_profit': 'Net Profit',
        'calculator.scheme_details': 'Scheme Details'
    },
    hi: {
        'tab.chat': 'चैट',
        'tab.weather': 'मौसम',
        'tab.market': 'बाज़ार',
        'tab.calculator': 'गणना',
        'tab.voice': 'आवाज़',
        'chat.placeholder': 'फसल, मौसम, कीमतों के बारे में पूछें...',
        'voice.listening': 'सुन रहे हैं...',
        'voice.ready': 'सुनने के लिए तैयार',
        'voice.start': 'सहायक शुरू करें',
        'voice.stop': 'सहायक रोकें',
        'voice.title': 'आवाज़ सहायक',
        'voice.subtitle': 'अंग्रेजी, हिंदी या मलयालम में स्वाभाविक रूप से बोलें',
        'voice.settings': 'आवाज़ सेटिंग्स',
        'voice.language': 'आवाज़ की भाषा',
        'voice.speed': 'बोलने की गति',
        'voice.pitch': 'आवाज़ की पिच',
        'voice.commands_title': 'उदाहरण कमांड',
        'weather.title': 'मौसम पूर्वानुमान',
        'weather.advice_title': 'खेती की सलाह',
        'market.title': 'बाज़ार कीमतें और पूर्वानुमान',
        'market.current_price': 'वर्तमान कीमत',
        'market.prediction': '7-दिन का पूर्वानुमान',
        'market.advice_title': 'बाज़ार सलाह',
        'calculator.title': 'लाभ कैलकुलेटर',
        'calculator.subtitle': 'अपनी फसल का लाभ गणना करें और सरकारी योजनाओं का पता लगाएं',
        'calculator.crop': 'फसल का प्रकार',
        'calculator.quantity': 'मात्रा (क्विंटल)',
        'calculator.cost_price': 'लागत मूल्य (₹/क्विंटल)',
        'calculator.selling_price': 'बिक्री मूल्य (₹/क्विंटल)',
        'calculator.scheme': 'सरकारी योजना',
        'calculator.calculate': 'लाभ की गणना करें',
        'calculator.result_title': 'गणना परिणाम',
        'calculator.total_cost': 'कुल लागत',
        'calculator.total_revenue': 'कुल आय',
        'calculator.subsidy': 'सब्सिडी',
        'calculator.net_profit': 'शुद्ध लाभ',
        'calculator.scheme_details': 'योजना विवरण'
    },
    ml: {
        'tab.chat': 'ചാറ്റ്',
        'tab.weather': 'കാലാവസ്ഥ',
        'tab.market': 'മാർക്കറ്റ്',
        'tab.calculator': 'കാൽക്കുലേറ്റർ',
        'tab.voice': 'ശബ്ദം',
        'chat.placeholder': 'വിളകൾ, കാലാവസ്ഥ, വിലകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...',
        'voice.listening': 'കേൾക്കുന്നു...',
        'voice.ready': 'കേൾക്കാൻ തയ്യാർ',
        'voice.start': 'സഹായി ആരംഭിക്കുക',
        'voice.stop': 'സഹായി നിർത്തുക',
        'voice.title': 'ശബ്ദ സഹായി',
        'voice.subtitle': 'ഇംഗ്ലീഷ്, ഹിന്ദി അല്ലെങ്കിൽ മലയാളത്തിൽ സ്വാഭാവികമായി സംസാരിക്കുക',
        'voice.settings': 'ശബ്ദ ക്രമീകരണങ്ങൾ',
        'voice.language': 'ശബ്ദ ഭാഷ',
        'voice.speed': 'സംസാര വേഗത',
        'voice.pitch': 'ശബ്ദ പിച്ച്',
        'voice.commands_title': 'സാമ്പിൾ കമാൻഡുകൾ',
        'weather.title': 'കാലാവസ്ഥാ പ്രവചനം',
        'weather.advice_title': 'കാർഷിക ഉപദേശം',
        'market.title': 'മാർക്കറ്റ് വിലകളും പ്രവചനങ്ങളും',
        'market.current_price': 'നിലവിലെ വില',
        'market.prediction': '7-ദിവസത്തെ പ്രവചനം',
        'market.advice_title': 'മാർക്കറ്റ് ഉപദേശം',
        'calculator.title': 'ലാഭ കാൽക്കുലേറ്റർ',
        'calculator.subtitle': 'നിങ്ങളുടെ വിള ലാഭം കണക്കാക്കുകയും സർക്കാർ പദ്ധതികൾ പര്യവേക്ഷണം ചെയ്യുകയും ചെയ്യുക',
        'calculator.crop': 'വിള തരം',
        'calculator.quantity': 'അളവ് (ക്വിന്റലുകൾ)',
        'calculator.cost_price': 'ചെലവ് വില (₹/ക്വിന്റൽ)',
        'calculator.selling_price': 'വിൽപ്പന വില (₹/ക്വിന്റൽ)',
        'calculator.scheme': 'സർക്കാർ പദ്ധതി',
        'calculator.calculate': 'ലാഭം കണക്കാക്കുക',
        'calculator.result_title': 'കണക്കുകൂട്ടൽ ഫലം',
        'calculator.total_cost': 'മൊത്തം ചെലവ്',
        'calculator.total_revenue': 'മൊത്തം വരുമാനം',
        'calculator.subsidy': 'സബ്സിഡി',
        'calculator.net_profit': 'അറ്റ ​​ലാഭം',
        'calculator.scheme_details': 'പദ്ധതി വിശദാംശങ്ങൾ'
    }
};

// Add to your translations object
const laborEquipmentTranslations = {
    en: {
        'tab.labor': 'Labor',
        'tab.equipment': 'Equipment',
        'labor.title': 'Contact Agricultural Labor',
        'labor.subtitle': 'Find skilled workers for your farming needs',
        'labor.search': 'Search Labor',
        'labor.post_requirement': 'Post Labor Requirement',
        'labor.post_title': 'Post Labor Requirement',
        'labor.type': 'Labor Type',
        'labor.workers_needed': 'Number of Workers',
        'labor.duration': 'Duration (Days)',
        'labor.daily_wage': 'Daily Wage (₹)',
        'labor.start_date': 'Start Date',
        'labor.work_location': 'Work Location',
        'labor.description': 'Work Description',
        'labor.contact': 'Contact Number',
        'labor.post': 'Post Requirement',
        'equipment.title': 'Farm Equipment Rental & Sales',
        'equipment.subtitle': 'Find tractors, harvesters, and other farming equipment',
        'equipment.search': 'Search Equipment',
        'equipment.post_ad': 'Post Equipment Ad',
        'equipment.post_title': 'Post Equipment Advertisement',
        'equipment.type': 'Equipment Type',
        'equipment.category': 'Category',
        'equipment.ad_title': 'Advertisement Title',
        'equipment.brand': 'Brand',
        'equipment.model': 'Model',
        'equipment.year': 'Year',
        'equipment.hours': 'Working Hours',
        'equipment.price': 'Price (₹)',
        'equipment.price_type': 'Price Type',
        'equipment.location': 'Location',
        'equipment.description': 'Description',
        'equipment.contact': 'Contact Number',
        'equipment.images': 'Equipment Images',
        'equipment.post': 'Post Advertisement'
    },
    hi: {
        'tab.labor': 'मजदूर',
        'tab.equipment': 'उपकरण',
        'labor.title': 'कृषि मजदूरों से संपर्क करें',
        'labor.subtitle': 'अपनी खेती की जरूरतों के लिए कुशल मजदूर खोजें',
        'equipment.title': 'कृषि उपकरण किराया और बिक्री',
        'equipment.subtitle': 'ट्रैक्टर, हार्वेस्टर और अन्य खेती के उपकरण खोजें'
    },
    ml: {
        'tab.labor': 'തൊഴിലാളി',
        'tab.equipment': 'ഉപകരണങ്ങൾ',
        'labor.title': 'കാർഷിക തൊഴിലാളികളെ ബന്ധപ്പെടുക',
        'labor.subtitle': 'നിങ്ങളുടെ കൃഷിയുടെ ആവശ്യങ്ങൾക്കായി വിദഗ്ധരായ തൊഴിലാളികളെ കണ്ടെത്തുക',
        'equipment.title': 'കാർഷിക ഉപകരണ വാടകയും വിൽപ്പനയും',
        'equipment.subtitle': 'ട്രാക്ടറുകൾ, ഹാർവെസ്റ്ററുകൾ, മറ്റ് കൃഷി ഉപകരണങ്ങൾ കണ്ടെത്തുക'
    }
};

// Merge with existing translations
Object.keys(laborEquipmentTranslations).forEach(lang => {
    if (translations[lang]) {
        Object.assign(translations[lang], laborEquipmentTranslations[lang]);
    }
});

// Labor Functions
function initializeLaborFeatures() {
    setupLaborEventListeners();
    loadLaborData();
}

function setupLaborEventListeners() {
    $('#search-labor')?.addEventListener('click', searchLabor);
    $('#post-labor-need')?.addEventListener('click', openLaborModal);
    $('#close-labor-modal')?.addEventListener('click', closeLaborModal);
    $('#labor-requirement-form')?.addEventListener('submit', submitLaborRequirement);
    
    // Close modal on backdrop click
    $('#labor-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'labor-modal') {
            closeLaborModal();
        }
    });
}

function searchLabor() {
    const laborType = $('#labor-type').value;
    const location = $('#labor-location').value;
    
    showToast('Searching for available labor...', 'success');
    
    // Simulate search delay
    setTimeout(() => {
        loadLaborData(laborType, location);
    }, 1000);
}

function loadLaborData(type = 'all', location = 'nearby') {
    fetch('sample-data.json')
        .then(response => response.json())
        .then(data => {
            let laborData = data.labor || [];

            // Apply filters
            if (type !== 'all') {
                laborData = laborData.filter(labor => labor.type === type);
            }
            if (location !== 'nearby') {
                laborData = laborData.filter(labor =>
                    labor.location.toLowerCase() === location.toLowerCase()
                );
            }

            displayLaborResults(laborData);
        })
        .catch(error => console.error('Error loading labor data:', error));
}

function loadEquipmentData(type = 'all', category = 'all', location = 'nearby') {
    fetch('sample-data.json')
        .then(response => response.json())
        .then(data => {
            let equipmentData = data.equipment || [];

            // Apply filters
            if (type !== 'all') {
                equipmentData = equipmentData.filter(eq => eq.type === type);
            }
            if (category !== 'all') {
                equipmentData = equipmentData.filter(eq => eq.category === category);
            }
            if (location !== 'nearby') {
                equipmentData = equipmentData.filter(eq =>
                    eq.location.toLowerCase() === location.toLowerCase()
                );
            }

            displayEquipmentResults(equipmentData);
        })
        .catch(error => console.error('Error loading equipment data:', error));
}


function displayLaborResults(laborData) {
    const container = $('#labor-results');
    
    if (laborData.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3>No labor found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = laborData.map(labor => `
        <div class="labor-card">
            <div class="labor-card-header">
                <span class="labor-type">${formatLaborType(labor.type)}</span>
                ${labor.available ? '<div class="labor-availability"><i class="fas fa-circle"></i> Available</div>' : ''}
            </div>
            
            <div class="labor-details">
                <div class="labor-name">${labor.name}</div>
                <div class="labor-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${labor.location}</span>
                </div>
                <div class="labor-info">
                    <div><strong>Experience:</strong> ${labor.experience} years</div>
                    <div><strong>Rating:</strong> ⭐ ${labor.rating}</div>
                </div>
                <div class="labor-description">${labor.description}</div>
            </div>
            
            <div class="labor-footer">
                <div class="labor-wage">₹${labor.dailyWage}/day</div>
                <button class="contact-btn" onclick="contactLabor('${labor.contact}', '${labor.name}')">
                    <i class="fas fa-phone"></i>
                    Contact
                </button>
            </div>
        </div>
    `).join('');
}

function formatLaborType(type) {
    const types = {
        'field-worker': 'Field Worker',
        'tractor-operator': 'Tractor Operator',
        'harvester': 'Harvesting Specialist',
        'irrigation': 'Irrigation Technician',
        'crop-specialist': 'Crop Specialist',
        'pesticide-applicator': 'Pesticide Applicator'
    };
    return types[type] || type;
}

function openLaborModal() {
    $('#labor-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLaborModal() {
    $('#labor-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    $('#labor-requirement-form').reset();
}

function submitLaborRequirement(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const requirementData = {
        laborType: formData.get('req-labor-type'),
        workersCount: formData.get('req-workers-count'),
        duration: formData.get('req-duration'),
        wage: formData.get('req-wage'),
        startDate: formData.get('req-start-date'),
        location: formData.get('req-location'),
        description: formData.get('req-description'),
        contact: formData.get('req-contact')
    };
    
    // Simulate submission
    showToast('Labor requirement posted successfully!', 'success');
    closeLaborModal();
    
    // You can add actual API call here
    console.log('Labor requirement:', requirementData);
}

function contactLabor(phone, name) {
    if (confirm(`Call ${name} at ${phone}?`)) {
        window.open(`tel:${phone}`);
    }
}

// Equipment Functions
function initializeEquipmentFeatures() {
    setupEquipmentEventListeners();
    loadEquipmentData();
}

function setupEquipmentEventListeners() {
    $('#search-equipment')?.addEventListener('click', searchEquipment);
    $('#post-equipment-ad')?.addEventListener('click', openEquipmentModal);
    $('#close-equipment-modal')?.addEventListener('click', closeEquipmentModal);
    $('#equipment-ad-form')?.addEventListener('submit', submitEquipmentAd);
    
    // Close modal on backdrop click
    $('#equipment-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'equipment-modal') {
            closeEquipmentModal();
        }
    });
}

function searchEquipment() {
    const equipmentType = $('#equipment-type').value;
    const category = $('#equipment-category').value;
    const location = $('#equipment-location').value;
    
    showToast('Searching for equipment...', 'success');
    
    // Simulate search delay
    setTimeout(() => {
        loadEquipmentData(equipmentType, category, location);
    }, 1000);
}

function loadEquipmentData(type = 'all', category = 'all', location = 'nearby') {
    let filteredData = mockEquipmentData;
    
    if (type !== 'all') {
        filteredData = filteredData.filter(equipment => equipment.type === type);
    }
    
    if (category !== 'all') {
        filteredData = filteredData.filter(equipment => equipment.category === category);
    }
    
    if (location !== 'nearby') {
        filteredData = filteredData.filter(equipment => 
            equipment.location.toLowerCase() === location.toLowerCase()
        );
    }
    
    displayEquipmentResults(filteredData);
}

function displayEquipmentResults(equipmentData) {
    const container = $('#equipment-results');
    
    if (equipmentData.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-tractor" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3>No equipment found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = equipmentData.map(equipment => `
        <div class="equipment-card">
            <div class="equipment-image">
                <span>${equipment.image}</span>
                <span class="equipment-category category-${equipment.category}">
                    ${equipment.category === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
            </div>
            
            <div class="equipment-content">
                <div class="equipment-title">${equipment.title}</div>
                
                <div class="equipment-specs">
                    <div><strong>Brand:</strong> ${equipment.brand}</div>
                    <div><strong>Year:</strong> ${equipment.year}</div>
                    <div><strong>Model:</strong> ${equipment.model}</div>
                    <div><strong>Hours:</strong> ${equipment.hours}</div>
                </div>
                
                <div class="equipment-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${equipment.location}</span>
                </div>
                
                <div class="equipment-description">${equipment.description}</div>
                
                <div class="equipment-footer">
                    <div class="equipment-price">
                        ₹${equipment.price.toLocaleString()}
                        <span class="price-unit">/${equipment.priceType.replace('per-', '')}</span>
                    </div>
                    <button class="contact-btn" onclick="contactEquipmentOwner('${equipment.contact}', '${equipment.title}')">
                        <i class="fas fa-phone"></i>
                        Contact
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openEquipmentModal() {
    $('#equipment-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeEquipmentModal() {
    $('#equipment-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    $('#equipment-ad-form').reset();
}

function submitEquipmentAd(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const adData = {
        equipmentType: formData.get('ad-equipment-type'),
        category: formData.get('ad-category'),
        title: formData.get('ad-title'),
        brand: formData.get('ad-brand'),
        model: formData.get('ad-model'),
        year: formData.get('ad-year'),
        hours: formData.get('ad-hours'),
        price: formData.get('ad-price'),
        priceType: formData.get('ad-price-type'),
        location: formData.get('ad-location'),
        description: formData.get('ad-description'),
        contact: formData.get('ad-contact')
    };
    
    // Simulate submission
    showToast('Equipment advertisement posted successfully!', 'success');
    closeEquipmentModal();
    
    // You can add actual API call here
    console.log('Equipment ad:', adData);
}

function contactEquipmentOwner(phone, title) {
    if (confirm(`Contact owner of "${title}" at ${phone}?`)) {
        window.open(`tel:${phone}`);
    }
}

// Update the main initialization function
function initializeApp() {
    // ... existing initialization code ...
    
    // Initialize new features
    initializeLaborFeatures();
    initializeEquipmentFeatures();
    
    // ... rest of existing code ...
}

// Update tab switching to handle new tabs
function switchTab(tabName) {
    // Hide all panels

    $$('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Remove active class from all tabs

    $$('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    // Show selected panel
    const selectedPanel = $(`#${tabName}-panel`);
    const selectedTab = $(`.tab-btn[data-tab="${tabName}"]`);
    
    if (selectedPanel && selectedTab) {
        selectedPanel.classList.add('active');
        selectedTab.classList.add('active');
        selectedTab.setAttribute('aria-selected', 'true');
        
        AppState.currentTab = tabName;
        
        // Load data for specific tabs
        if (tabName === 'labor') {
            loadLaborData();
        } else if (tabName === 'equipment') {
            loadEquipmentData();
        } else if (tabName === 'weather') {
            loadWeatherData();
        } else if (tabName === 'market') {
            loadMarketData();
        }
    }
}


// Mock Data

const mockWeatherData = {
    5: [
        { date: '2024-01-15', high: 28, low: 15, condition: 'Sunny', humidity: 65, precipitation: 0, wind: 12, icon: '☀️' },
        { date: '2024-01-16', high: 30, low: 17, condition: 'Partly Cloudy', humidity: 70, precipitation: 10, wind: 15, icon: '⛅' },
        { date: '2024-01-17', high: 26, low: 14, condition: 'Rainy', humidity: 85, precipitation: 80, wind: 20, icon: '🌧️' },
        { date: '2024-01-18', high: 24, low: 12, condition: 'Overcast', humidity: 78, precipitation: 40, wind: 18, icon: '☁️' },
        { date: '2024-01-19', high: 27, low: 16, condition: 'Clear', humidity: 60, precipitation: 0, wind: 10, icon: '☀️' }
    ],
    10: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: Math.floor(Math.random() * 15) + 20,
        low: Math.floor(Math.random() * 10) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Overcast'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 60,
        precipitation: Math.floor(Math.random() * 100),
        wind: Math.floor(Math.random() * 15) + 5,
        icon: ['☀️', '☁️', '🌧️', '⛅'][Math.floor(Math.random() * 4)]
    })),
    15: Array.from({ length: 15 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: Math.floor(Math.random() * 15) + 20,
        low: Math.floor(Math.random() * 10) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Overcast'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 60,
        precipitation: Math.floor(Math.random() * 100),
        wind: Math.floor(Math.random() * 15) + 5,
        icon: ['☀️', '☁️', '🌧️', '⛅'][Math.floor(Math.random() * 4)]
    }))
};

const mockMarketData = {
    rice: { current: 2450, predicted: 2580, change: 5.2, confidence: 78, history: [2300, 2320, 2350, 2380, 2400, 2430, 2450] },
    wheat: { current: 2150, predicted: 2280, change: 3.8, confidence: 72, history: [2050, 2070, 2090, 2110, 2130, 2140, 2150] },
    sugarcane: { current: 320, predicted: 340, change: 6.2, confidence: 85, history: [300, 305, 310, 315, 318, 319, 320] },
    cotton: { current: 5800, predicted: 6100, change: 4.1, confidence: 68, history: [5500, 5550, 5600, 5650, 5700, 5750, 5800] },
    maize: { current: 1850, predicted: 1920, change: -2.1, confidence: 75, history: [1900, 1890, 1880, 1870, 1860, 1855, 1850] },
    groundnut: { current: 4200, predicted: 4350, change: 7.5, confidence: 80, history: [3900, 3950, 4000, 4050, 4100, 4150, 4200] }
};

// Utility Functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
}

function translate(key, lang = AppState.currentLang) {
    return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
}

function updateTranslations() {
    $$('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
    
    $$('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    $('#toast-container').appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Chat Functions
function addMessage(text, isUser = false, image = null) {
    const messagesContainer = $('#chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const time = new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    let imageHtml = '';
    if (image) {
        imageHtml = `<img src="${image}" alt="Uploaded image" class="message-image">`;
    }
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            ${isUser ? '👤' : '🤖'}
        </div>
        <div class="message-content">
            ${imageHtml}
            <p class="message-text">${text}</p>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Animate message entrance
    gsap.fromTo(messageElement, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.3 }
    );
    
    AppState.chatMessages.push({ text, isUser, image, time });
}

function showTypingIndicator() {
    const messagesContainer = $('#chat-messages');
    const typingElement = document.createElement('div');
    typingElement.className = 'message bot typing';
    typingElement.id = 'typing-indicator';
    
    typingElement.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = $('#typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function processMessage(text, image = null) {
    showTypingIndicator();
    
    // Simulate AI processing time
    setTimeout(() => {
        hideTypingIndicator();
        
        const response = generateResponse(text, image);
        addMessage(response, false);
        
        // Speak response if voice assistant is active
        if (AppState.isVoiceAssistantActive) {
            speakText(response);
        }
    }, 1500 + Math.random() * 1000);
}

function generateResponse(text, image = null) {
    const lowerText = text.toLowerCase();
    
    if (image) {
        return analyzeImage(image);
    }
    
    // Weather queries
    if (lowerText.includes('weather') || lowerText.includes('rain') || lowerText.includes('temperature')) {
        return generateWeatherResponse(lowerText);
    }
    
    // Market price queries
    if (lowerText.includes('price') || lowerText.includes('market') || lowerText.includes('mandi')) {
        return generateMarketResponse(lowerText);
    }
    
    // Crop advice
    if (lowerText.includes('disease') || lowerText.includes('pest') || lowerText.includes('fertilizer')) {
        return generateCropAdviceResponse(lowerText);
    }
    
    // Scheme queries
    if (lowerText.includes('scheme') || lowerText.includes('subsidy') || lowerText.includes('government')) {
        return generateSchemeResponse(lowerText);
    }
    
    // Default response
    return generateDefaultResponse();
}

function generateWeatherResponse(text) {
    const responses = [
        "Based on the current weather forecast, expect partly cloudy conditions with temperatures around 25-28°C. Good conditions for field work! 🌤️",
        "The weather looks favorable for the next few days. However, there's a chance of light rain on Wednesday - perfect for irrigation planning. 🌦️",
        "Current weather is ideal for crop maintenance. Make sure to check for pests during this warm period. Temperature: 27°C, Humidity: 65%. ☀️"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateMarketResponse(text) {
    const responses = [
        "Current rice prices in Delhi Mandi: ₹2,450/quintal (+5.2% from yesterday). Market trend is positive - good time to sell! 📈",
        "Wheat prices are steady at ₹2,150/quintal. Predicted to rise by 6% in the next 7 days. Consider holding your stock. 💰",
        "Today's market update: Cotton prices showing strong growth at ₹5,800/quintal. High demand from textile mills. 📊"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateCropAdviceResponse(text) {
    const responses = [
        "For pest control, try neem oil spray (2ml/liter water) early morning. Also check for yellow sticky traps to monitor pest population. 🌿",
        "Yellowing leaves could indicate nitrogen deficiency. Apply urea (46% N) at 50kg/hectare or use organic compost. Monitor soil pH level. 🍃",
        "This season, focus on balanced NPK fertilizer (19:19:19) at 100kg/hectare. Split application: 50% at sowing, 25% at tillering, 25% at flowering. 🌱"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateSchemeResponse(text) {
    const responses = [
        "PM-KISAN scheme provides ₹6,000/year in 3 installments. Eligible farmers get ₹2,000 every 4 months directly to bank account. 💰",
        "Soil Health Card scheme offers free soil testing. Contact your nearest Krishi Vigyan Kendra for soil sample collection. 🧪",
        "Crop insurance under PMFBY covers yield losses. Premium: 2% for Kharif, 1.5% for Rabi crops. Claim within 72 hours of crop loss. 🛡️"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateDefaultResponse() {
    const responses = [
        "I'm here to help with your farming questions! Ask me about weather, crop prices, diseases, or government schemes. 🌾",
        "Hello! I can assist you with weather forecasts, market prices, crop advice, and profit calculations. What would you like to know? 🤝",
        "Hi there! I'm your farming assistant. I can help with crop guidance, weather updates, market trends, and more. How can I help today? 👨‍🌾"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function analyzeImage(imageData) {
    // Mock image analysis - replace with real AI model integration
    const analyses = [
        "Image analysis: Detected healthy rice crop with good grain formation. Harvest recommended in 2-3 weeks when 80% grains turn golden. 🌾✅",
        "Leaf analysis shows possible nitrogen deficiency (yellowing). Recommend immediate nitrogen fertilizer application and increase watering frequency. 🍃⚠️",
        "Pest detection: Found signs of aphids on crop leaves. Use neem oil spray (5ml/L water) or release ladybugs for biological control. 🐛🔍",
        "Soil condition looks good with adequate moisture. Continue current irrigation schedule. Watch for weeds in the next 2 weeks. 🌱💧"
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
}

// Voice Functions
function initializeVoiceFeatures() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech recognition not supported');
        showToast('Voice recognition not supported in this browser', 'warning');
        return;
    }
    
    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        showToast('Voice synthesis not supported in this browser', 'warning');
        return;
    }
    
    setupVoiceRecognition();
    setupVoiceSynthesis();
}

function setupVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    window.recognition = new SpeechRecognition();
    
    window.recognition.continuous = false;
    window.recognition.interimResults = false;
    window.recognition.lang = AppState.voiceSettings.language;
    
    window.recognition.onstart = () => {
        AppState.isVoiceRecording = true;
        $('#voice-toggle').classList.add('active');
        $('#voice-recording').classList.remove('hidden');
        updateVoiceStatus('Listening...');
    };
    
    window.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        $('#chat-input').value = text;
        processVoiceCommand(text);
    };
    
    window.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        showToast('Voice recognition error. Please try again.', 'error');
        stopVoiceRecording();
    };
    
    window.recognition.onend = () => {
        stopVoiceRecording();
    };
}

function setupVoiceSynthesis() {
    // Voice synthesis is ready
    console.log('Voice synthesis initialized');
}

function startVoiceRecording() {
    if (!window.recognition) return;
    
    try {
        window.recognition.start();
    } catch (error) {
        console.error('Could not start voice recognition:', error);
        showToast('Could not start voice recording', 'error');
    }
}

function stopVoiceRecording() {
    AppState.isVoiceRecording = false;
    $('#voice-toggle').classList.remove('active');
    $('#voice-recording').classList.add('hidden');
    
    if (window.recognition) {
        window.recognition.stop();
    }
}

function speakText(text, lang = AppState.voiceSettings.language) {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = AppState.voiceSettings.rate;
    utterance.pitch = AppState.voiceSettings.pitch;
    
    // Find appropriate voice
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) || voices[0];
    if (voice) utterance.voice = voice;
    
    speechSynthesis.speak(utterance);
}

function processVoiceCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    // Navigation commands
    if (lowerCommand.includes('show weather') || lowerCommand.includes('weather forecast')) {
        switchTab('weather');
        speakText('Showing weather forecast');
        return;
    }
    
    if (lowerCommand.includes('show market') || lowerCommand.includes('market price')) {
        switchTab('market');
        speakText('Showing market prices');
        return;
    }
    
    if (lowerCommand.includes('calculate profit') || lowerCommand.includes('calculator')) {
        switchTab('calculator');
        speakText('Opening profit calculator');
        return;
    }
    
    // Regular chat processing
    addMessage(command, true);
    processMessage(command);
}

function startVoiceAssistant() {
    AppState.isVoiceAssistantActive = true;
    $('.assistant-avatar').classList.add('active');
    $('#start-voice-assistant').classList.add('hidden');
    $('#stop-voice-assistant').classList.remove('hidden');
    updateVoiceStatus('Voice assistant active');
    
    speakText('Hello! I am your farming assistant. You can ask me about weather, market prices, or crop advice.');
}

function stopVoiceAssistant() {
    AppState.isVoiceAssistantActive = false;
    $('.assistant-avatar').classList.remove('active');
    $('#start-voice-assistant').classList.remove('hidden');
    $('#stop-voice-assistant').classList.add('hidden');
    
    updateVoiceStatus('Ready to listen');
    
    speechSynthesis.cancel();
}

function updateVoiceStatus(status) {
    $('#assistant-status').textContent = status;
}

// Weather Functions
function loadWeatherData(days = 5) {
    const data = mockWeatherData[days];
    displayWeatherCards(data);
    generateWeatherAdvice(data);
}

function displayWeatherCards(data) {
    const container = $('#weather-content');
    container.innerHTML = '';
    
    data.forEach(day => {
        const card = document.createElement('div');
        card.className = 'weather-card';
        
        card.innerHTML = `
            <div class="weather-date">${formatDate(day.date)}</div>
            <div class="weather-main">
                <div class="weather-icon">${day.icon}</div>
                <div class="weather-temp">
                    <div class="temp-high">${day.high}°C</div>
                    <div class="temp-low">${day.low}°C</div>
                </div>
            </div>
            <div class="weather-details">
                <div>Humidity: ${day.humidity}%</div>
                <div>Rain: ${day.precipitation}%</div>
                <div>Wind: ${day.wind} km/h</div>
                <div>Condition: ${day.condition}</div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function generateWeatherAdvice(data) {
    const adviceContainer = $('#weather-advice-content');
    const today = data[0];
    const upcoming = data.slice(1, 3);
    
    let advice = [];
    
    // Temperature-based advice
    if (today.high > 35) {
        advice.push({
            icon: '🔥',
            title: 'High Temperature Alert',
            description: 'Increase irrigation frequency. Provide shade for sensitive crops. Harvest early morning or evening.',
            risk: 'high'
        });
    } else if (today.high < 15) {
        advice.push({
            icon: '🥶',
            title: 'Cold Weather Warning',
            description: 'Protect crops from frost. Use mulching. Delay transplanting of sensitive seedlings.',
            risk: 'medium'
        });
    }
    
    // Rain-based advice
    const rainDays = upcoming.filter(day => day.precipitation > 60);
    if (rainDays.length > 0) {
        advice.push({
            icon: '🌧️',
            title: 'Heavy Rain Expected',
            description: 'Ensure proper drainage. Delay spraying operations. Cover harvested crops. Check for fungal diseases.',
            risk: 'medium'
        });
    } else if (data.every(day => day.precipitation < 20)) {
        advice.push({
            icon: '☀️',
            title: 'Dry Conditions',
            description: 'Monitor soil moisture. Plan irrigation schedule. Watch for pest activity. Good time for field operations.',
            risk: 'low'
        });
    }
    
    // Default positive advice
    if (advice.length === 0) {
        advice.push({
            icon: '✅',
            title: 'Favorable Conditions',
            description: 'Weather conditions are optimal for farming activities. Continue regular field monitoring and maintenance.',
            risk: 'low'
        });
    }
    
    adviceContainer.innerHTML = advice.map(item => `
        <div class="advice-item">
            <i class="fas fa-exclamation-triangle">${item.icon}</i>
            <div class="advice-text">
                <div class="advice-title">${item.title}</div>
                <div class="advice-description">${item.description}</div>
                <span class="risk-level risk-${item.risk}">Risk: ${item.risk}</span>
            </div>
        </div>
    `).join('');
}

// Market Functions
function loadMarketData() {
    const crop = $('#crop-select').value;
    const market = $('#market-select').value;
    
    const data = mockMarketData[crop];
    displayMarketData(data, crop);
    createPriceChart(data, crop);
    generateMarketAdvice(data, crop);
}

function displayMarketData(data, crop) {
    $('#current-price').textContent = formatCurrency(data.current);
    $('#predicted-price').textContent = formatCurrency(data.predicted);
    
    const changeElement = $('.price-change');
    changeElement.className = `price-change ${data.change >= 0 ? 'positive' : 'negative'}`;
    changeElement.innerHTML = `
        <i class="fas fa-arrow-${data.change >= 0 ? 'up' : 'down'}"></i>
        <span>${data.change >= 0 ? '+' : ''}${data.change.toFixed(1)}% from yesterday</span>
    `;
    
    $('.prediction-confidence span').textContent = `Confidence: ${data.confidence}%`;
}

function createPriceChart(data, crop) {
    const ctx = $('#price-chart').getContext('2d');
    
    // Destroy existing chart
    if (window.marketChart) {
        window.marketChart.destroy();
    }
    
    const labels = data.history.map((_, i) => `Day ${i - 6}`);
    labels[labels.length - 1] = 'Today';
    
    // Add prediction
    const futureLabels = ['Day +1', 'Day +2', 'Day +3', 'Day +4', 'Day +5', 'Day +6', 'Day +7'];
    const allLabels = [...labels, ...futureLabels];
    
    // Generate prediction data
    const currentPrice = data.current;
    const predictedPrice = data.predicted;
    const predictionData = [];
    for (let i = 0; i < 7; i++) {
        const progress = i / 6;
        predictionData.push(currentPrice + (predictedPrice - currentPrice) * progress);
    }
    
    const allData = [...data.history, ...predictionData];
    
    window.marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allLabels,
            datasets: [{
                label: `${crop.charAt(0).toUpperCase() + crop.slice(1)} Price`,
                data: allData,
                borderColor: '#0b6b2b',
                backgroundColor: 'rgba(11, 107, 43, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: allLabels.map((_, i) => i < labels.length ? '#0b6b2b' : '#f6c34a'),
                pointBorderColor: allLabels.map((_, i) => i < labels.length ? '#0b6b2b' : '#f6c34a'),
                pointRadius: 5,
                segment: {
                    borderDash: (ctx) => ctx.p0DataIndex >= labels.length - 1 ? [5, 5] : undefined,
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
}

function generateMarketAdvice(data, crop) {
    const adviceContainer = $('#market-advice-content');
    let advice = '';
    
    if (data.change > 5) {
        advice = `<div class="advice-item">
            <i class="fas fa-trending-up" style="color: #22c55e;"></i>
            <div class="advice-text">
                <div class="advice-title">Strong Price Growth</div>
                <div class="advice-description">
                    ${crop.charAt(0).toUpperCase() + crop.slice(1)} prices are rising strongly (+${data.change.toFixed(1)}%). 
                    Consider selling now or wait for predicted peak at ${formatCurrency(data.predicted)} in 7 days.
                </div>
            </div>
        </div>`;
    } else if (data.change < -3) {
        advice = `<div class="advice-item">
            <i class="fas fa-trending-down" style="color: #ef4444;"></i>
            <div class="advice-text">
                <div class="advice-title">Price Decline Alert</div>
                <div class="advice-description">
                    ${crop.charAt(0).toUpperCase() + crop.slice(1)} prices are falling (${data.change.toFixed(1)}%). 
                    Hold inventory if possible. Market expected to recover to ${formatCurrency(data.predicted)} soon.
                </div>
            </div>
        </div>`;
    } else {
        advice = `<div class="advice-item">
            <i class="fas fa-balance-scale" style="color: #0b6b2b;"></i>
            <div class="advice-text">
                <div class="advice-title">Stable Market Conditions</div>
                <div class="advice-description">
                    ${crop.charAt(0).toUpperCase() + crop.slice(1)} prices are stable. 
                    Good time for planned sales. Predicted growth to ${formatCurrency(data.predicted)} in next week.
                </div>
            </div>
        </div>`;
    }
    
    adviceContainer.innerHTML = advice;
}

// Calculator Functions
function loadGovernmentSchemes() {
    // Mock government schemes data
    AppState.governmentSchemes = [
        {
            id: 'pmkisan',
            name: 'PM-KISAN',
            description: 'Direct income support of ₹6,000 per year to all farmer families',
            subsidyType: 'fixed',
            subsidyAmount: 6000,
            eligibility: 'All small and marginal farmer families'
        },
        {
            id: 'pmfby',
            name: 'Pradhan Mantri Fasal Bima Yojana',
            description: 'Crop insurance scheme with premium subsidy',
            subsidyType: 'percentage',
            subsidyAmount: 2.0,
            eligibility: 'All farmers growing notified crops'
        },
        {
            id: 'kcc',
            name: 'Kisan Credit Card',
            description: 'Credit facility for agriculture and allied activities',
            subsidyType: 'interest',
            subsidyAmount: 7.0,
            eligibility: 'Farmers with land ownership documents'
        },
        {
            id: 'soil_health',
            name: 'Soil Health Card Scheme',
            description: 'Free soil testing and recommendations',
            subsidyType: 'service',
            subsidyAmount: 0,
            eligibility: 'All farmers'
        }
    ];
    
    const schemeSelect = $('#scheme-select');
    schemeSelect.innerHTML = '<option value="">Select Scheme (Optional)</option>';
    
    AppState.governmentSchemes.forEach(scheme => {
        const option = document.createElement('option');
        option.value = scheme.id;
        option.textContent = scheme.name;
        schemeSelect.appendChild(option);
    });
}

function calculateProfit() {
    const formData = new FormData($('#profit-form'));
    
    const crop = formData.get('crop');
    const quantity = parseFloat(formData.get('quantity')); // Quantity in kilograms
    const costPrice = parseFloat(formData.get('costPrice')); // Price per kg
    const sellingPrice = parseFloat(formData.get('sellingPrice')); // Price per kg
    const schemeId = formData.get('scheme');
    
    if (!quantity || !costPrice || !sellingPrice) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const totalCost = quantity * costPrice;  // Total cost in ₹
    const totalRevenue = quantity * sellingPrice; // Total revenue in ₹
    let subsidyAmount = 0;
    let selectedScheme = null;
    
    if (schemeId) {
        selectedScheme = AppState.governmentSchemes.find(s => s.id === schemeId);
        if (selectedScheme) {
            switch (selectedScheme.subsidyType) {
                case 'fixed':
                    subsidyAmount = selectedScheme.subsidyAmount;
                    break;
                case 'percentage':
                    subsidyAmount = totalRevenue * (selectedScheme.subsidyAmount / 100);
                    break;
                case 'interest':
                    // Assume loan amount is 50% of total cost
                    const loanAmount = totalCost * 0.5;
                    const annualSaving = loanAmount * (selectedScheme.subsidyAmount / 100);
                    subsidyAmount = annualSaving / 4; // Quarterly benefit
                    break;
            }
        }
    }
    
    const netProfit = totalRevenue - totalCost + subsidyAmount;
    
    displayCalculationResult({
        totalCost,
        totalRevenue,
        subsidyAmount,
        netProfit,
        scheme: selectedScheme
    });
    
    $('#calculation-result').classList.remove('hidden');
    
    // Animate results
    gsap.fromTo('#calculation-result', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5 }
    );
}

function displayCalculationResult(result) {
    $('#total-cost').textContent = formatCurrency(result.totalCost);
    $('#total-revenue').textContent = formatCurrency(result.totalRevenue);
    $('#subsidy-amount').textContent = formatCurrency(result.subsidyAmount);
    $('#net-profit').textContent = formatCurrency(result.netProfit);
    
    // Update profit card color based on profit/loss
    const profitCard = $('.profit-card');
    if (result.netProfit >= 0) {
        profitCard.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    } else {
        profitCard.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    // Show scheme information if applicable
    const schemeInfo = $('#scheme-info');
    if (result.scheme) {
        $('#scheme-description').innerHTML = `
            <strong>${result.scheme.name}</strong><br>
            ${result.scheme.description}<br>
            <em>Eligibility: ${result.scheme.eligibility}</em>
        `;
        schemeInfo.classList.remove('hidden');
    } else {
        schemeInfo.classList.add('hidden');
    }
}


// Image Functions
function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        AppState.selectedImage = imageData;
        
        // Show preview
        $('#preview-image').src = imageData;
        $('#image-preview').classList.remove('hidden');
        
        showToast('Image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
}

function removeSelectedImage() {
    AppState.selectedImage = null;
    $('#image-preview').classList.add('hidden');
    $('#image-input').value = '';
}

function sendImageMessage() {
    if (!AppState.selectedImage) return;
    
    addMessage('Image analysis requested', true, AppState.selectedImage);
    processMessage('Analyze this image', AppState.selectedImage);
    
    removeSelectedImage();
}

// Tab Management
function switchTab(tabName) {
    // Update tab buttons
    $$('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    $(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    $(`.tab-btn[data-tab="${tabName}"]`).setAttribute('aria-selected', 'true');
    
    // Update tab panels
    $$('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    $(`#${tabName}-panel`).classList.add('active');
    AppState.currentTab = tabName;
    
    // Load tab-specific data
    switch (tabName) {
        case 'weather':
            loadWeatherData(5);
            break;
        case 'market':
            loadMarketData();
            break;
        case 'calculator':
            loadGovernmentSchemes();
            break;
    }
    
    // Animate tab transition
    gsap.fromTo(`#${tabName}-panel`, 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.3 }
    );
}

// Language Management
function switchLanguage(lang) {
    AppState.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update UI
    const langDisplay = {
        'en': 'EN',
        'hi': 'हि',
        'ml': 'മ'
    };
    
    $('#current-lang').textContent = langDisplay[lang];
    updateTranslations();
    
    // Update voice settings
    const voiceLangs = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'ml': 'ml-IN'
    };
    
    AppState.voiceSettings.language = voiceLangs[lang];
    $('#voice-language').value = voiceLangs[lang];
    
    if (window.recognition) {
        window.recognition.lang = voiceLangs[lang];
    }
    
    showToast(`Language changed to ${lang.toUpperCase()}`, 'success');
}

// Event Handlers
function setupEventHandlers() {
    // Loading screen
    setTimeout(() => {
        $('#loading-screen').style.display = 'none';
        $('#app').classList.remove('hidden');
        
        // Animate app entrance
        gsap.fromTo('#app', 
            { opacity: 0, scale: 0.95 }, 
            { opacity: 1, scale: 1, duration: 0.5 }
        );
    }, 2000);
    
    // Language switcher
    $('#lang-btn').addEventListener('click', () => {
        $('#lang-dropdown').classList.toggle('hidden');
    });
    
    $$('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            switchLanguage(lang);
            $('#lang-dropdown').classList.add('hidden');
        });
    });
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-switcher')) {
            $('#lang-dropdown').classList.add('hidden');
        }
    });
    
    // Tab navigation
    $$('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Chat input
    $('#chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    $('#send-btn').addEventListener('click', sendMessage);
    
    // Voice controls
    $('#voice-toggle').addEventListener('click', () => {
        if (AppState.isVoiceRecording) {
            stopVoiceRecording();
        } else {
            startVoiceRecording();
        }
    });
    
    $('#stop-recording').addEventListener('click', stopVoiceRecording);
    
    // Image upload
    $('#image-upload-btn').addEventListener('click', () => {
        $('#image-input').click();
    });
    
    $('#image-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });
    
    $('#remove-image').addEventListener('click', removeSelectedImage);
    
    // Weather controls
    $$('.weather-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.weather-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const days = parseInt(btn.getAttribute('data-days'));
            loadWeatherData(days);
        });
    });
    
    $('#refresh-weather').addEventListener('click', () => {
        const activeDays = $('.weather-tab-btn.active').getAttribute('data-days');
        loadWeatherData(parseInt(activeDays));
        showToast('Weather data refreshed', 'success');
        
        // Animate refresh button
        gsap.to('#refresh-weather', { rotation: 360, duration: 0.5 });
    });
    
    $('#location-select').addEventListener('change', () => {
        const activeDays = $('.weather-tab-btn.active').getAttribute('data-days');
        loadWeatherData(parseInt(activeDays));
    });
    
    // Market controls
    $('#crop-select').addEventListener('change', loadMarketData);
    $('#market-select').addEventListener('change', loadMarketData);
    
    // Calculator
    $('#profit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        calculateProfit();
    });
    
    // Voice assistant controls
    $('#start-voice-assistant').addEventListener('click', startVoiceAssistant);
    $('#stop-voice-assistant').addEventListener('click', stopVoiceAssistant);
    
    // Voice settings
    $('#voice-language').addEventListener('change', (e) => {
        AppState.voiceSettings.language = e.target.value;
        if (window.recognition) {
            window.recognition.lang = e.target.value;
        }
    });
    
    $('#voice-speed').addEventListener('input', (e) => {
        AppState.voiceSettings.rate = parseFloat(e.target.value);
        $('#speed-display').textContent = e.target.value + 'x';
    });
    
    $('#voice-pitch').addEventListener('input', (e) => {
        AppState.voiceSettings.pitch = parseFloat(e.target.value);
        $('#pitch-display').textContent = e.target.value;
    });
}

function sendMessage() {
    const input = $('#chat-input');
    const text = input.value.trim();
    
    if (!text && !AppState.selectedImage) return;
    
    if (AppState.selectedImage) {
        sendImageMessage();
    } else {
        addMessage(text, true);
        processMessage(text);
    }
    
    input.value = '';
}

// Initialization
function initializeApp() {
    console.log('Farmer Query Chatbot initializing...');
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
    
    // Setup event handlers
    setupEventHandlers();
    
    // Initialize voice features
    initializeVoiceFeatures();
    
    // Add welcome message
    setTimeout(() => {
        addMessage("🌱 Welcome to Farmer Assistant! I'm here to help you with weather forecasts, market prices, crop advice, and profit calculations. How can I assist you today?", false);
    }, 500);
    
    // Initialize default tab content
    loadWeatherData(5);
    loadMarketData();
    loadGovernmentSchemes();
    
    console.log('Farmer Query Chatbot initialized successfully');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
