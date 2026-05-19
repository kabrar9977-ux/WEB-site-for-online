// Authentication helper functions for all pages

function updateNavigation() {
    const session = JSON.parse(localStorage.getItem('userSession')) || 
                   JSON.parse(sessionStorage.getItem('userSession'));
    
    const navLinks = document.querySelector('.navbar div:last-child');
    
    if (session) {
        // User is logged in - show My Account instead of Login
        const loginLink = navLinks.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.href = 'account.html';
            loginLink.textContent = 'My Account';
            loginLink.classList.remove('active');
        }
        
        // Add logout functionality if not already present
        if (!navLinks.querySelector('.logout-link')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.className = 'logout-link';
            logoutLink.onclick = function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('userSession');
                    sessionStorage.removeItem('userSession');
                    window.location.reload();
                }
            };
            navLinks.appendChild(logoutLink);
        }
        
        // Update active state for account page
        if (window.location.pathname.includes('account.html')) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
            });
            const accountLink = navLinks.querySelector('a[href="account.html"]');
            if (accountLink) {
                accountLink.classList.add('active');
            }
        }
    } else {
        // User is not logged in - show Login
        const accountLink = navLinks.querySelector('a[href="account.html"]');
        if (accountLink) {
            accountLink.href = 'login.html';
            accountLink.textContent = 'Login';
            accountLink.classList.remove('active');
        }
        
        // Remove logout link if present
        const logoutLink = navLinks.querySelector('.logout-link');
        if (logoutLink) {
            logoutLink.remove();
        }
        
        // Update active state for login page
        if (window.location.pathname.includes('login.html')) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
            });
            const loginLink = navLinks.querySelector('a[href="login.html"]');
            if (loginLink) {
                loginLink.classList.add('active');
            }
        }
    }
}

// Check if user is logged in
function isLoggedIn() {
    return !!(JSON.parse(localStorage.getItem('userSession')) || 
              JSON.parse(sessionStorage.getItem('userSession')));
}

// Get current user session
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('userSession')) || 
           JSON.parse(sessionStorage.getItem('userSession'));
}

// Logout function
function logout() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    window.location.href = 'login.html';
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});

// Also update navigation when storage changes (for multi-tab support)
window.addEventListener('storage', function(e) {
    if (e.key === 'userSession') {
        updateNavigation();
    }
});
