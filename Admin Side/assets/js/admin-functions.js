// Admin Side JavaScript Functions

// Global Variables
let currentUser = JSON.parse(localStorage.getItem('adminUser')) || null;
let isLoading = false;

// Utility Functions
function showLoading(show = true) {
    isLoading = show;
    const loadingElements = document.querySelectorAll('.loading-spinner');
    loadingElements.forEach(el => {
        el.style.display = show ? 'inline-block' : 'none';
    });
}

function showNotification(message, type = 'success', duration = 3000) {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type === 'success' ? 'success' : 'danger'}-custom position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// Add CSS for notifications
const notificationCSS = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Form Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

function validateRequired(value) {
    return value && value.toString().trim() !== '';
}

function validatePrice(price) {
    return !isNaN(price) && parseFloat(price) > 0;
}

// Form Validation Handler
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const errors = [];
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.getAttribute('id');
        
        // Remove previous error styling
        field.classList.remove('is-invalid');
        
        if (!validateRequired(value)) {
            field.classList.add('is-invalid');
            errors.push(`${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
            isValid = false;
        } else {
            // Type-specific validation
            if (field.type === 'email' && !validateEmail(value)) {
                field.classList.add('is-invalid');
                errors.push(`Please enter a valid email address`);
                isValid = false;
            }
            
            if (field.type === 'tel' && !validatePhone(value)) {
                field.classList.add('is-invalid');
                errors.push(`Please enter a valid phone number`);
                isValid = false;
            }
            
            if (field.getAttribute('data-type') === 'price' && !validatePrice(value)) {
                field.classList.add('is-invalid');
                errors.push(`Please enter a valid price`);
                isValid = false;
            }
        }
    });
    
    // Show errors if any
    if (!isValid) {
        showNotification(errors[0], 'error');
    }
    
    return isValid;
}

// Authentication Functions
function checkAuth() {
    if (!currentUser) {
        window.location.href = '../Admin Side/login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('adminUser');
    sessionStorage.clear();
    window.location.href = '../Admin Side/login.html';
}

// Navigation Functions
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Data Management Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Sample Data Functions
function getSampleProducts() {
    return JSON.parse(localStorage.getItem('adminProducts')) || [
        {
            id: 1,
            name: 'Samsung Galaxy S24',
            price: 75999,
            category: 'Smartphones',
            stock: 25,
            status: 'active',
            image: 'samsung-s24.jpg',
            description: 'Latest Samsung flagship smartphone'
        },
        {
            id: 2,
            name: 'iPhone 15 Pro',
            price: 134900,
            category: 'Smartphones',
            stock: 15,
            status: 'active',
            image: 'iphone-15-pro.jpg',
            description: 'Apple latest iPhone with Pro features'
        },
        {
            id: 3,
            name: 'MacBook Air',
            price: 99900,
            category: 'Laptops',
            stock: 8,
            status: 'active',
            image: 'macbook-air.jpg',
            description: 'Lightweight laptop for professionals'
        }
    ];
}

function getSampleOrders() {
    return JSON.parse(localStorage.getItem('adminOrders')) || [
        {
            id: 'ORD001',
            customerName: 'Rahul Sharma',
            customerEmail: 'rahul@email.com',
            total: 75999,
            status: 'pending',
            date: new Date().toISOString(),
            items: [
                { name: 'Samsung Galaxy S24', price: 75999, quantity: 1 }
            ],
            address: 'Mumbai, Maharashtra'
        },
        {
            id: 'ORD002',
            customerName: 'Priya Patel',
            customerEmail: 'priya@email.com',
            total: 99900,
            status: 'processing',
            date: new Date(Date.now() - 86400000).toISOString(),
            items: [
                { name: 'MacBook Air', price: 99900, quantity: 1 }
            ],
            address: 'Ahmedabad, Gujarat'
        }
    ];
}

function getSampleUsers() {
    return JSON.parse(localStorage.getItem('adminUsers')) || [
        {
            id: 1,
            name: 'Rahul Sharma',
            email: 'rahul@email.com',
            phone: '9876543210',
            city: 'Mumbai',
            state: 'Maharashtra',
            joinDate: '2024-01-15',
            status: 'active',
            totalOrders: 5,
            totalSpent: 250000
        },
        {
            id: 2,
            name: 'Priya Patel',
            email: 'priya@email.com',
            phone: '9123456789',
            city: 'Ahmedabad',
            state: 'Gujarat',
            joinDate: '2024-02-20',
            status: 'active',
            totalOrders: 3,
            totalSpent: 150000
        }
    ];
}

// Statistics Functions
function calculateStats() {
    const orders = getSampleOrders();
    const products = getSampleProducts();
    const users = getSampleUsers();
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.date).toDateString();
        const today = new Date().toDateString();
        return orderDate === today;
    }).length;
    
    return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        todayOrders,
        averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    };
}

// Chart Functions (Simple implementation)
function createSimpleChart(canvasId, data, type = 'bar') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (type === 'bar') {
        drawBarChart(ctx, data, width, height);
    } else if (type === 'line') {
        drawLineChart(ctx, data, width, height);
    }
}

function drawBarChart(ctx, data, width, height) {
    const maxValue = Math.max(...data.values);
    const barWidth = width / data.labels.length - 10;
    const padding = 40;
    
    ctx.fillStyle = '#3b82f6';
    
    data.values.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - padding * 2);
        const x = index * (barWidth + 10) + 5;
        const y = height - padding - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[index], x + barWidth/2, height - 10);
        ctx.fillText(value.toString(), x + barWidth/2, y - 5);
        
        ctx.fillStyle = '#3b82f6';
    });
}

// Initialize functions
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation
    setActiveNav();
    
    // Check authentication for protected pages
    const protectedPages = ['dashboard.html', 'products.html', 'orders.html', 'users.html', 'settings.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }
    
    // Initialize tooltips if Bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

// Export functions for global use
window.AdminPanel = {
    showLoading,
    showNotification,
    validateForm,
    checkAuth,
    logout,
    formatCurrency,
    formatDate,
    formatDateTime,
    getSampleProducts,
    getSampleOrders,
    getSampleUsers,
    calculateStats,
    createSimpleChart
};