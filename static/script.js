// Pixel Perfection - Cyberpunk UI JavaScript

// Theme variants
const themes = {
    purple: {
        primary: '#8b00ff',
        secondary: '#5d00b8',
        neonPink: '#ff00ff',
        neonBlue: '#00ffff',
        neonPurple: '#b300ff'
    },
    blue: {
        primary: '#0080ff',
        secondary: '#0056b8',
        neonPink: '#ff0080',
        neonBlue: '#00d4ff',
        neonPurple: '#8000ff'
    },
    pink: {
        primary: '#ff0080',
        secondary: '#b80056',
        neonPink: '#ff00d4',
        neonBlue: '#00ffff',
        neonPurple: '#ff00ff'
    }
};

let currentTheme = 'purple';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initFormValidation();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize notifications
    checkForNotifications();
});

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateInput(this);
            });
            
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
        
        // Password confirmation validation
        const password = form.querySelector('input[name="password"]');
        const confirmPassword = form.querySelector('input[name="confirm_password"]');
        
        if (password && confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                if (this.value !== password.value) {
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                } else {
                    this.classList.add('valid');
                    this.classList.remove('invalid');
                }
            });
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill all fields correctly', 'error');
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    let isValid = false;
    
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } else if (type === 'password') {
        isValid = value.length >= 6;
    } else if (name === 'username' || name === 'full_name') {
        isValid = value.length >= 3;
    } else {
        isValid = value.length > 0;
    }
    
    if (isValid) {
        input.classList.add('valid');
        input.classList.remove('invalid');
    } else if (value.length > 0) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    } else {
        input.classList.remove('valid', 'invalid');
    }
    
    return isValid;
}

// Search Functionality
function initSearch() {
    const searchBox = document.querySelector('.search-box');
    
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.gallery-card, .card');
            
            cards.forEach(card => {
                const title = card.querySelector('h3, .card-title');
                const text = card.textContent.toLowerCase();
                
                if (text.includes(searchTerm)) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Theme Toggle
function initThemeToggle() {
    // Create theme toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<button class="theme-btn" onclick="cycleTheme()">🎨</button>';
        document.body.appendChild(themeToggle);
    }
}

function cycleTheme() {
    const themeOrder = ['purple', 'blue', 'pink'];
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    currentTheme = themeOrder[nextIndex];
    
    applyTheme(currentTheme);
    showNotification(`Theme changed to ${currentTheme}!`, 'success');
}

function applyTheme(themeName) {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    root.style.setProperty('--primary-purple', theme.primary);
    root.style.setProperty('--secondary-purple', theme.secondary);
    root.style.setProperty('--neon-pink', theme.neonPink);
    root.style.setProperty('--neon-blue', theme.neonBlue);
    root.style.setProperty('--neon-purple', theme.neonPurple);
}

// Notifications
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

function checkForNotifications() {
    // Check URL parameters for success/error messages
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success) {
        showNotification(decodeURIComponent(success), 'success');
    }
    if (error) {
        showNotification(decodeURIComponent(error), 'error');
    }
}

// Gallery Image Upload Preview
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Admin Functions
function deleteUser(username) {
    if (confirm(`Are you sure you want to delete user: ${username}?`)) {
        showNotification(`User ${username} deleted!`, 'success');
        // Add actual delete logic here
    }
}

function blockUser(username) {
    if (confirm(`Are you sure you want to block user: ${username}?`)) {
        showNotification(`User ${username} blocked!`, 'success');
        // Add actual block logic here
    }
}

// Smooth scroll for navigation
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

// Add parallax effect to background
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('body::before');
            if (parallax) {
                document.body.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Add glitch effect on hover for titles
document.querySelectorAll('h1, h2').forEach(title => {
    title.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease-in-out';
    });
    
    title.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.focus();
        }
    }
    
    // Ctrl/Cmd + T for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        cycleTheme();
    }
});

// Add CSS for glitch animation
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(style);
