import { settings } from "./settings.js";

function isUserLoggedIn() {
    const authToken = localStorage.getItem("authToken");
    const loggedUser = localStorage.getItem("loggedUser");
    
    return authToken && loggedUser && authToken.trim() !== "" && loggedUser !== "null";
}

function getLoggedUserData() {
    try {
        const loggedUser = localStorage.getItem("loggedUser");
        if (loggedUser && loggedUser !== "null") {
            return JSON.parse(loggedUser);
        }
    } catch (error) {
        console.error("Error parsing logged user data:", error);
    }
    return null;
}

function updateUIForLoginStatus() {
    const settingsButton = $$("settings_button");
    const topNavSettings = $$("top_nav_settings");
    const topNavLogout = $$("top_nav_logout");
    const topNavLogin = $$("top_nav_login");
    const loginForm = $$("login_form");
    const userDashboard = $$("user_dashboard_card");
    const loggedUser = getLoggedUserData();
    const isLoggedIn = isUserLoggedIn();
    
    if (settingsButton) {
        if (isLoggedIn && loggedUser) {
            settingsButton.show();
        } else {
            settingsButton.hide();
        }
    }
    
    // Update top navigation visibility
    if (topNavSettings) {
        if (isLoggedIn) {
            topNavSettings.show();
        } else {
            topNavSettings.hide();
        }
    }
    
    if (topNavLogout) {
        if (isLoggedIn) {
            topNavLogout.show();
        } else {
            topNavLogout.hide();
        }
    }
    
    if (topNavLogin) {
        if (!isLoggedIn) {
            topNavLogin.show();
        } else {
            topNavLogin.hide();
        }
    }
    
    // Toggle between login form and user dashboard
    if (loginForm && userDashboard) {
        if (isLoggedIn) {
            loginForm.hide();
            userDashboard.show();
        } else {
            loginForm.show();
            userDashboard.hide();
        }
    }
    
    // Update header template to reflect current login status
    const headerTemplate = $$("header_template");
    if (headerTemplate) {
        headerTemplate.refresh();
    }
    
    // Update user info in top nav
    const userInfo = $$("top_nav_user_info");
    if (userInfo) {
        userInfo.refresh();
    }
    
    // Refresh user dashboard content
    if (userDashboard && isLoggedIn) {
        userDashboard.refresh();
    }
}

// Add the CSS styles first
const headerStyles = `
    .modern-header-banner {
        position: relative;
        overflow: hidden;
    }

    .header-content {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header-background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('../assets/images/5568706.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 1;
    }

    .header-background-image::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.3) 100%
        );
        z-index: 2;
    }

    .header-content-inner {
        position: relative;
        z-index: 3;
        text-align: center;
        color: white;
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .header-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        line-height: 1.2;
    }

    .subtitle {
        font-size: 1.2rem;
        font-weight: 400;
        opacity: 0.9;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        line-height: 1.4;
    }

    /* User Dashboard Styles */
    .user-dashboard {
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .dashboard-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .dashboard-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-size: 20px;
        font-weight: bold;
    }

    .dashboard-user-info h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }

    .dashboard-user-info p {
        margin: 2px 0 0 0;
        opacity: 0.8;
        font-size: 14px;
    }

    .dashboard-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
    }

    .stat-item {
        background: rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        backdrop-filter: blur(10px);
    }

    .stat-number {
        display: block;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .stat-label {
        font-size: 12px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .dashboard-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    .dashboard-btn {
        flex: 1;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    }

    .dashboard-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .dashboard-btn i {
        margin-right: 6px;
    }

    .recent-activity {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .activity-title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 10px;
        opacity: 0.9;
    }

    .activity-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        font-size: 13px;
        opacity: 0.8;
    }

    .activity-icon {
        width: 20px;
        margin-right: 10px;
        text-align: center;
    }
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.textContent = headerStyles;
document.head.appendChild(styleSheet);

export const HomeUI = {
    id: "home_ui",
    type: "clean",
    scroll: false, 
    css: "modern-home-ui",
    rows: [
        // Top Navigation Bar - Fixed dimensions
        {
            view: "toolbar",
            id: "top_navigation",
            height: 64,
            css: "modern-top-nav",
            paddingX: 24,
            cols: [
                // App Logo - Fixed width
                {
                    view: "template",
                    id: "app_logo",
                    width: 240,
                    css: "app-logo-container",
                    template: `
                        <div class="logo-content">
                            <span class="mdi mdi-shield-account logo-icon"></span>
                            <span class="logo-text">User Preferences</span>
                        </div>
                    `
                },
                // Flexible spacer
                {},
                // User info section - Fixed width for proper alignment
                {
                    view: "template",
                    id: "top_nav_user_info",
                    width: 140,
                    height: 20,
                    css: "user-info-container",
                    template: function() {
                        const loggedUser = getLoggedUserData();
                        const isLoggedIn = isUserLoggedIn();
                        
                        if (isLoggedIn && loggedUser) {
                            const profileImage = localStorage.getItem("profileImage") || 

                            window.profileImageData || 
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format";
                            return `
                                <div class="user-info">
                                    <div class="user-avatar">
                                        <img class="avatar" src="${profileImage}"  
                                         alt="User Avatar" 
                                         style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e0e0;"/>
                                    </div>
                                    <div class="user-details">
                                        <span class="user-name">${loggedUser.displayName || loggedUser.firstName || loggedUser.lastName || 'User'}</span>
                                        <span class="user-status">Online</span>
                                    </div>
                                </div>
                            `;
                        }
                        return '<div class="user-info-placeholder"></div>';
                    }
                },
              
                {
                    view: "layout",
                    type: "clean",
                    width: 152,
                    height: 64,
                    cols: [
                        {
                            view: "button",
                            id: "top_nav_login",
                            type: "icon",
                            icon: "mdi mdi-login",
                            width: 40,
                            height: 40,
                            css: "webix_primary top-nav-btn",
                            tooltip: "Login",
                            hidden: isUserLoggedIn(),
                            click: function() {
                                try {
                                    $$("main_content").setValue("login");
                                } catch (error) {
                                    console.error("Navigation error:", error);
                                    window.showView && window.showView("login");
                                }
                            }
                        },
                        { width: 8 },
                        {
                            view: "button",
                            id: "top_nav_settings",
                            type: "icon",
                            icon: "mdi mdi-cog",
                            width: 40,
                            height: 40,
                            hotkey: "s",
                            css: "webix_info top-nav-btn",
                            tooltip: "Settings",
                            hidden: !isUserLoggedIn(),
                            click: function() {
                                try {
                                    $$("main_content").setValue("settings_page");
                                } catch (error) {
                                    console.error("Navigation error:", error);
                                    window.showView && window.showView("settings_page");
                                }
                            }
                        },
                        { width: 8 },
                        {
                            view: "button",
                            id: "top_nav_logout",
                            type: "icon",
                            icon: "mdi mdi-logout",
                            width: 40,
                            height: 40,
                            css: "webix_danger top-nav-btn",
                            tooltip: "Logout",
                            hidden: !isUserLoggedIn(),
                            click: async function() {
                                try {
                                    const { logoutUser } = await import("./utils/dataService.js");
                                    
                                    await logoutUser();
                                    
                                    webix.message({ type: "success", text: "Logged out successfully!" });
                                    
                                    updateUIForLoginStatus();
                                    
                                    setTimeout(() => {
                                        location.reload();
                                    }, 1000);
                                    
                                } catch (error) {
                                    console.error("Logout error:", error);
                                    localStorage.removeItem("authToken");
                                    localStorage.removeItem("loggedUser");
                                    sessionStorage.removeItem("currentLoggedin");
                                    
                                    webix.message({ type: "info", text: "Logged out locally" });
                                    updateUIForLoginStatus();
                                    location.reload();
                                }
                            }
                        },
                        { width: 16 }  // Right padding
                    ]
                }
            ]
        },
        
        // Header Banner - Fixed height with proper content scaling
        {
            view: "template",
            id: "header_template",
            height: 280,
            css: "modern-header-banner",
            template: function() {
                const loggedUser = getLoggedUserData();
                const isLoggedIn = isUserLoggedIn();
                
                return `
            <div class="header-content">
                <div class="header-background-image"></div>
                <div class="header-content-inner">
                    <div class="header-text">
                        <h1 class="header-title">
                            ${isLoggedIn && loggedUser 
                                ? `Welcome back, ${loggedUser.displayName||loggedUser.firstName || loggedUser.username || 'User' || userProfile.full_name }!` 
                                : "Welcome to User Preferences!"
                            }
                        </h1>
                        <p class="subtitle">
                            ${isLoggedIn 
                                ? "Your personal preferences at a glance" 
                                : "Please log in to access your personalized dashboard"
                            }
                        </p>
                    </div>
                </div>
            </div>
        `;
            }
        },

        // Main Content Area - Improved layout structure
        {
            view: "scrollview",
            scroll: "y",
            body: {
                view: "layout",
                type: "clean",
                paddingX: 32,
                paddingY: 32,
                rows: [
                    {
                        view: "layout",
                        type: "clean",
                        cols: [
                            // Left Column - Login/Dashboard Cards
                            {
                                view: "layout",
                                width: 360,
                                rows: [
                                    // Login Form (shown when not logged in)
                                    {
                                        view: "form",
                                        id: "login_form",
                                        hidden: isUserLoggedIn(),
                                        css: "modern-login-card",
                                        paddingX: 24,
                                        paddingY: 24,
                                        elements: [
                                            {
                                                view: "template",
                                                height: 60,
                                                css: "card-header-template",
                                                template: "<h2 class='card-title'>Account Access</h2>"
                                            },
                                            { height: 16 },
                                            {
                                                view: "button",
                                                id: "login_button",
                                                value: "Login",
                                                icon: "mdi mdi-login",
                                                css: "webix_primary btn-modern",
                                                height: 48,
                                                click: function() {
                                                    try {
                                                        $$("main_content").setValue("login");
                                                    } catch (error) {
                                                        console.error("Navigation error:", error);
                                                        window.showView && window.showView("login");
                                                    }
                                                }
                                            },
                                            { height: 12 },
                                            {
                                                view: "button",
                                                id: "signup_button",
                                                value: "Sign Up",
                                                icon: "mdi mdi-account-plus",
                                                css: "webix_secondary btn-modern",
                                                height: 48,
                                                click: function() {
                                                    try {
                                                        $$("main_content").setValue("signup");
                                                    } catch (error) {
                                                        console.error("Navigation error:", error);
                                                        window.showView && window.showView("signup");
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                   
                                    {
                                        view: "template",
                                        id: "user_dashboard_card",
                                        hidden: !isUserLoggedIn(),
                                        css: "modern-dashboard-card",
                                        height: 300,
                                        scroll: "y",
                                        minHeight: 300,
                                        maxHeight: 400,
                                        template: function() {
                                            const loggedUser = getLoggedUserData();
                                            const isLoggedIn = isUserLoggedIn();
                                            
                                            if (!isLoggedIn || !loggedUser) return "";
                                            
                                            const userName = loggedUser.firstName || loggedUser.username || loggedUser.first_name || 'User';
                                            const userEmail = loggedUser.email || 'user@example.com';
                                            const userInitials = userName.substring(0, 2).toUpperCase();
                                            const loginDate = new Date().toLocaleDateString();
                                            
                                            return `
                                                <div class="user-dashboard">
                                                    <div class="dashboard-header">
                                                        <div class="dashboard-avatar">${userInitials}</div>
                                                        <div class="dashboard-user-info">
                                                            <h3>${userName}</h3>
                                                            <p>${userName}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="dashboard-stats">
                                                        <div class="stat-item">
                                                            <span class="stat-number">12</span>
                                                            <span class="stat-label">Settings</span>
                                                        </div>
                                                        <div class="stat-item">
                                                            <span class="stat-number">3</span>
                                                            <span class="stat-label">Alerts</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="dashboard-actions">
                                                        <div class="dashboard-btn" onclick="$$('main_content').setValue('settings_page')">
                                                            <i class="mdi mdi-cog"></i>Settings
                                                        </div>
                                                        <div class="dashboard-btn" onclick="$$('main_content').setValue('profile')">
                                                            <i class="mdi mdi-account"></i>Profile
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="recent-activity">
                                                        <div class="activity-title">Recent Activity</div>
                                                        <div class="activity-item">
                                                            <i class="mdi mdi-login activity-icon"></i>
                                                            Last login: ${loginDate}
                                                        </div>
                                                        <div class="activity-item">
                                                            <i class="mdi mdi-shield-check activity-icon"></i>
                                                            Security settings updated
                                                        </div>
                                                        <div class="activity-item">
                                                            <i class="mdi mdi-bell activity-icon"></i>
                                                            Notifications enabled
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    },
                                    {}  
                                ]
                            },
                          
                            { width: 32 },
                           
                            {
                                view: "layout",
                                rows: [
                                   
                                    {
                                        view: "template",
                                        id: "info_card_template",
                                        height: 130,
                                        css: "modern-info-card",
                                        template: function() {
                                            const loggedUser = getLoggedUserData();
                                            const isLoggedIn = isUserLoggedIn();
                                            
                                            return `
                                                <div class="info-content">
                                                    <div class="info-icon-container">
                                                        <span class="mdi mdi-information-outline info-icon"></span>
                                                    </div>
                                                    <div class="info-text">
                                                        <h3 class="info-title">Quick Info</h3>
                                                        <p class="info-description">${isLoggedIn && loggedUser
                                                            ? `Welcome ${loggedUser.username || loggedUser.firstName}! Access and adjust your security preferences. Manage your account settings and notification preferences from the settings panel.`
                                                            : "Log in or sign up to access your personalized dashboard and security settings."}
                                                        </p>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    },
                                   
                                    { height: 2 },
                                    
                                    {
                                        view: "template",
                                        height: 180,
                                        css: "modern-feature-card",
                                        template: `
                                            <div class="feature-content">
                                                <div class="feature-icon-container">
                                                    <span class="mdi mdi-shield-check feature-icon"></span>
                                                </div>
                                                <div class="feature-text">
                                                    <h3 class="feature-title">User Preferences Features</h3>
                                                    <ul class="feature-list">
                                                        <li>Real-time security monitoring</li>
                                                        <li>Customizable alert preferences</li>
                                                        <li>Comprehensive activity logs</li>
                                                        <li>Advanced privacy controls</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        `
                                    },
                                    {}  
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ],
    on: {
        onShow: function() {
            
            updateUIForLoginStatus();
            
            this.adjustLayout();
            webix.event(window, "resize", () => this.adjustLayout());
        },
        onAfterShow: function() {
         
            setTimeout(() => {
                updateUIForLoginStatus();
            }, 100);
        }
    },
    adjustLayout: function() {
        const width = window.innerWidth;
        
       
        if (width < 768) {
          
            const logoTemplate = $("app_logo");
            if (logoTemplate) {
                logoTemplate.define("width", 160);
                logoTemplate.refresh();
            }
            
            const userInfo = $("top_nav_user_info");
            if (userInfo) {
                userInfo.define("width", 140);
                userInfo.refresh();
            }
        } else if (width < 1024) {
           
            const logoTemplate = $("app_logo");
            if (logoTemplate) {
                logoTemplate.define("width", 200);
                logoTemplate.refresh();
            }
            
            const userInfo = $("top_nav_user_info");
            if (userInfo) {
                userInfo.define("width", 160);
                userInfo.refresh();
            }
        } else {
            
            const logoTemplate = $("app_logo");
            if (logoTemplate) {
                logoTemplate.define("width", 240);
                logoTemplate.refresh();
            }
            
            const userInfo = $("top_nav_user_info");
            if (userInfo) {
                userInfo.define("width", 180);
                userInfo.refresh();
            }
        }
    }
};


if (typeof window !== 'undefined') {
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken' || e.key === 'loggedUser') {
            
            updateUIForLoginStatus();
        }
    });
    
    
    window.updateHomeUIForLoginStatus = updateUIForLoginStatus;
}
export function refreshUserInfo() {
  if ($$("top_nav_user_info")) {
    $$("top_nav_user_info").refresh();
  }
}


window.addEventListener('profileUpdated', function(event) {
  refreshUserInfo();
});