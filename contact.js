// Contact & Help Page JavaScript

// Global Variables
let chatWidgetOpen = false;
let chatMessages = [];
let isVoiceRecording = false;

// DOM Elements
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatMessages_el = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const contactForm = document.getElementById('contactForm');
const chatNotification = document.getElementById('chatNotification');

// Initialize Contact Page
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.contact-info') || document.querySelector('.quick-help')) {
        initializeContactPage();
    }
});

function initializeContactPage() {
    setupContactEventListeners();
    initializeChatWidget();
    initializeFAQ();
    setupFormValidation();
    
    // Auto-show chat notification
    setTimeout(() => {
        if (chatNotification) {
            chatNotification.style.display = 'flex';
        }
    }, 3000);
}

function setupContactEventListeners() {
    // Chat toggle button
    if (chatToggle) {
        chatToggle.addEventListener('click', toggleChatWidget);
    }
    
    // Chat input
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    // Quick help cards
    document.querySelectorAll('.help-card').forEach(card => {
        card.addEventListener('click', function() {
            const cardType = this.classList.contains('emergency') ? 'emergency' : 'help';
            handleQuickHelpClick(cardType);
        });
    });
}

// Chat Widget Functions
function initializeChatWidget() {
    // Add initial bot message
    addChatMessage('bot', currentLanguage === 'hi' 
        ? 'नमस्ते! मैं आपका डिजिटल कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?' 
        : 'Hello! I\'m your Digital Krishi Assistant. How can I help you today?'
    );
}

function toggleChatWidget() {
    chatWidgetOpen = !chatWidgetOpen;
    
    if (chatWidget) {
        chatWidget.classList.toggle('active', chatWidgetOpen);
    }
    
    if (chatWidgetOpen) {
        // Focus on input
        setTimeout(() => {
            if (chatInput) {
                chatInput.focus();
            }
        }, 300);
        
        // Hide notification
        if (chatNotification) {
            chatNotification.style.display = 'none';
        }
        
        // Track event
        trackChatEvent('Widget Opened');
    } else {
        trackChatEvent('Widget Closed');
    }
}

function closeChatWidget() {
    chatWidgetOpen = false;
    if (chatWidget) {
        chatWidget.classList.remove('active');
    }
}

function startChat() {
    if (!chatWidgetOpen) {
        toggleChatWidget();
    }
    
    // Add welcome message if needed
    if (chatMessages.length === 1) {
        setTimeout(() => {
            addChatMessage('bot', currentLanguage === 'hi' 
                ? 'आप किसी भी कृषि संबंधी प्रश्न के बारे में पूछ सकते हैं - मौसम, कीट नियंत्रण, बाजार मूल्य, या सरकारी योजनाएं।'
                : 'You can ask me about any farming questions - weather, pest control, market prices, or government schemes.'
            );
        }, 1000);
    }
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage('user', message);
    
    // Clear input
    chatInput.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addChatMessage('bot', response);
    }, 1000 + Math.random() * 1000);
    
    // Track event
    trackChatEvent('Message Sent', message);
}

function addChatMessage(sender, text) {
    if (!chatMessages_el) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    chatMessages_el.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
    
    // Store message
    chatMessages.push({ sender, text, timestamp: Date.now() });
    
    // Limit message history
    if (chatMessages.length > 50) {
        chatMessages = chatMessages.slice(-50);
        const firstMessage = chatMessages_el.querySelector('.message');
        if (firstMessage) {
            firstMessage.remove();
        }
    }
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Common farming-related responses
    const responses = {
        weather: currentLanguage === 'hi' 
            ? 'मौसम की जानकारी के लिए, होम पेज पर "मौसम अलर्ट" फीचर का उपयोग करें। यह आपको वास्तविक समय मौसम अपडेट प्रदान करता है।'
            : 'For weather information, use the "Weather Alerts" feature on the home page. It provides real-time weather updates for your location.',
        
        pest: currentLanguage === 'hi' 
            ? 'कीट नियंत्रण के लिए, आप अपनी फसल की फोटो भेज सकते हैं और हमारा AI सिस्टम कीटों की पहचान करके उपचार सुझाएगा।'
            : 'For pest control, you can send photos of your crops and our AI system will identify pests and suggest treatments.',
        
        price: currentLanguage === 'hi' 
            ? 'बाजार मूल्य की जानकारी के लिए "बाजार मूल्य ट्रैकिंग" फीचर का उपयोग करें। यह लाइव मंडी भाव प्रदान करता है।'
            : 'For market prices, use the "Market Price Tracking" feature. It provides live mandi rates and best selling locations.',
        
        loan: currentLanguage === 'hi' 
            ? 'सरकारी ऋण और योजनाओं की जानकारी के लिए "ऋण और सरकारी योजनाएं" सेक्शन देखें। सभी योजनाओं की अपडेटेड जानकारी मिलेगी।'
            : 'For government loans and schemes, check the "Loans & Government Schemes" section. You\'ll find updated information about all available schemes.',
        
        machine: currentLanguage === 'hi' 
            ? 'कृषि मशीनों के लिए हमारी "मशीन शॉप" पर जाएं। वहां आपको सभी प्रकार के कृषि उपकरण मिलेंगे।'
            : 'For farming machines, visit our "Machine Shop". You\'ll find all types of agricultural equipment there.',
        
        help: currentLanguage === 'hi' 
            ? 'मैं आपकी निम्नलिखित में मदद कर सकता हूं:\n- मौसम की जानकारी\n- कीट नियंत्रण\n- बाजार मूल्य\n- सरकारी योजनाएं\n- कृषि उपकरण\nआप कुछ भी पूछ सकते हैं!'
            : 'I can help you with:\n- Weather information\n- Pest control\n- Market prices\n- Government schemes\n- Farm equipment\nFeel free to ask anything!'
    };
    
    // Check for keywords
    if (message.includes('weather') || message.includes('मौसम')) {
        return responses.weather;
    } else if (message.includes('pest') || message.includes('कीट') || message.includes('disease')) {
        return responses.pest;
    } else if (message.includes('price') || message.includes('मूल्य') || message.includes('market') || message.includes('बाजार')) {
        return responses.price;
    } else if (message.includes('loan') || message.includes('ऋण') || message.includes('scheme') || message.includes('योजना')) {
        return responses.loan;
    } else if (message.includes('machine') || message.includes('equipment') || message.includes('मशीन') || message.includes('उपकरण')) {
        return responses.machine;
    } else if (message.includes('help') || message.includes('मदद') || message.includes('सहायता')) {
        return responses.help;
    } else {
        // Default response
        return currentLanguage === 'hi' 
            ? 'मुझे खुशी होगी आपकी मदद करने में! कृपया अधिक विस्तृत प्रश्न पूछें या हेल्पलाइन 1800-180-1551 पर कॉल करें।'
            : 'I\'d be happy to help! Please ask a more specific question or call our helpline at 1800-180-1551 for immediate assistance.';
    }
}

// FAQ Functions
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current FAQ
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Contact Form Functions
function setupFormValidation() {
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError({ target: field });
    
    let isValid = true;
    let errorMessage = '';
    
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = currentLanguage === 'hi' 
                    ? 'कृपया वैध ईमेल पता दर्ज करें'
                    : 'Please enter a valid email address';
            }
            break;
            
        case 'tel':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = currentLanguage === 'hi' 
                    ? 'कृपया वैध फोन नंबर दर्ज करें'
                    : 'Please enter a valid phone number';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
}

function clearFieldError(event) {
    const field = event.target;
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    
    field.parentNode.appendChild(errorEl);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
}

function handleContactFormSubmission(event) {
    event.preventDefault();
    
    // Validate form
    const formData = new FormData(contactForm);
    const isValid = validateContactForm(formData);
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <div class="spinner"></div>
        <span>${currentLanguage === 'hi' ? 'भेजा जा रहा है...' : 'Sending...'}</span>
    `;
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showFormMessage(
            currentLanguage === 'hi' 
                ? 'आपका संदेश सफलतापूर्वक भेजा गया है। हम जल्द ही आपसे संपर्क करेंगे।'
                : 'Your message has been sent successfully. We will contact you soon.',
            'success'
        );
        
        // Reset form
        contactForm.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Track event
        if (window.KrishiApp) {
            window.KrishiApp.trackEvent('Contact', 'Form Submitted', formData.get('category'));
        }
    }, 2000);
}

function validateContactForm(formData) {
    let isValid = true;
    
    // Required field validation
    const requiredFields = ['name', 'phone', 'category', 'message'];
    
    requiredFields.forEach(fieldName => {
        const value = formData.get(fieldName);
        if (!value || !value.trim()) {
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            showFieldError(field, currentLanguage === 'hi' 
                ? 'यह फील्ड आवश्यक है'
                : 'This field is required'
            );
            isValid = false;
        }
    });
    
    return isValid;
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessages = contactForm.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    // Insert at top of form
    contactForm.insertBefore(messageEl, contactForm.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Quick Help Functions
function handleQuickHelpClick(cardType) {
    if (cardType === 'emergency') {
        callEmergency();
    }
}

function callEmergency() {
    const phoneNumber = '1800-180-1551';
    
    if ('navigator' in window && 'userAgent' in navigator) {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            if (window.KrishiApp) {
                window.KrishiApp.showNotification(
                    `Emergency Helpline: ${phoneNumber}`,
                    'info'
                );
            }
        }
    }
    
    // Track emergency call
    if (window.KrishiApp) {
        window.KrishiApp.trackEvent('Contact', 'Emergency Call', phoneNumber);
    }
}

function startVoiceAssistant() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        if (window.KrishiApp) {
            window.KrishiApp.showNotification(
                currentLanguage === 'hi' 
                    ? 'वॉयस रिकॉग्निशन इस डिवाइस पर समर्थित नहीं है'
                    : 'Voice recognition is not supported on this device',
                'error'
            );
        }
        return;
    }
    
    if (isVoiceRecording) {
        stopVoiceRecording();
        return;
    }
    
    startVoiceRecording();
}

function startVoiceRecording() {
    isVoiceRecording = true;
    
    // Update UI
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
        voiceBtn.innerHTML = `
            <i class="fas fa-stop"></i>
            <span>${currentLanguage === 'hi' ? 'रोकें' : 'Stop'}</span>
        `;
        voiceBtn.classList.add('recording');
    }
    
    // Show notification
    if (window.KrishiApp) {
        window.KrishiApp.showNotification(
            currentLanguage === 'hi' 
                ? '🎙️ सुन रहा हूं... अपना प्रश्न बोलें'
                : '🎙️ Listening... Please speak your question',
            'info'
        );
    }
    
    // Simulate voice recognition
    setTimeout(() => {
        stopVoiceRecording();
        
        // Simulate recognition result
        const sampleQuestions = [
            currentLanguage === 'hi' ? 'मौसम की जानकारी चाहिए' : 'I need weather information',
            currentLanguage === 'hi' ? 'कीट नियंत्रण के बारे में बताएं' : 'Tell me about pest control'
        ];
        
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        
        if (window.KrishiApp) {
            window.KrishiApp.showNotification(
                `${currentLanguage === 'hi' ? 'सुना गया' : 'Heard'}: "${randomQuestion}"`,
                'success'
            );
        }
        
        // Open chat with the question
        if (!chatWidgetOpen) {
            toggleChatWidget();
        }
        
        setTimeout(() => {
            if (chatInput) {
                chatInput.value = randomQuestion;
                sendChatMessage();
            }
        }, 1000);
        
    }, 3000);
}

function stopVoiceRecording() {
    isVoiceRecording = false;
    
    // Update UI
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
        voiceBtn.innerHTML = `
            <i class="fas fa-microphone"></i>
            <span>${currentLanguage === 'hi' ? 'प्रश्न पूछें' : 'Ask Question'}</span>
        `;
        voiceBtn.classList.remove('recording');
    }
}

// Analytics
function trackChatEvent(action, label = '') {
    if (window.KrishiApp) {
        window.KrishiApp.trackEvent('Chat', action, label);
    }
}

// Export functions for global use
window.ContactApp = {
    toggleChatWidget,
    sendChatMessage,
    callEmergency,
    startVoiceAssistant,
    toggleFAQ
};

// Make functions available globally
window.startChat = startChat;
window.closeChatWidget = closeChatWidget;
window.sendChatMessage = sendChatMessage;
window.callEmergency = callEmergency;
window.startVoiceAssistant = startVoiceAssistant;
window.toggleFAQ = toggleFAQ;