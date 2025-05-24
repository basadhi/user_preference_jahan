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
}

export const HomeUI = {
    id: "home_ui",
    type: "clean",
    scroll: true, 
    css: "modern-home-ui",
    rows: [
        // Top Navigation Bar
        {
            view: "toolbar",
            id: "top_navigation",
            height: 60,
            css: "modern-top-nav",
            cols: [
                {
                    view: "template",
                    id: "app_logo",
                    width: 200,
                    css: "app-logo-container",
                    template: `
                        <div class="logo-content">
                            <span class="mdi mdi-shield-account logo-icon"></span>
                            <span class="logo-text">User Preferences</span>
                        </div>
                    `
                },
                {},  // Spacer to push right content to the right
                {
                    view: "template",
                    id: "top_nav_user_info",
                    width: 150,
                    height: 40,
                    css: "user-info-container",
                    template: function() {
                        const loggedUser = getLoggedUserData();
                        const isLoggedIn = isUserLoggedIn();
                        
                        if (isLoggedIn && loggedUser) {
                            return `
                                <div class="user-info">
                                    <div class="user-avatar">
                                        <img class="avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&auto=format" alt="User Avatar" />
                                    </div>
                                    <div class="user-details">
                                        <span class="user-name">${loggedUser.first_name || loggedUser.username || 'User'}</span>
                                        <span class="user-status">Online</span>
                                    </div>
                                </div>
                            `;
                        }
                        return '';
                    }
                },
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
                { width: 20 }  // Right margin
            ]
        },
        
        // Modern Header with background image and welcome text
        {
            view: "template",
            id: "header_template",
            height: 325,
            css: "modern-header-banner",
            template: function() {
                const loggedUser = getLoggedUserData();
                const isLoggedIn = isUserLoggedIn();
                
                return `
                    <div class="header-content">
                        <div class="header-content-inner">
                            <div class="avatar-container">
                                <img class="avatar" src="../assets/images/4957136_4957136.jpg" alt="User Avatar" />
                            </div>
                            <div class="header-text">
                                <h1 class="header-title">
                                    ${isLoggedIn && loggedUser 
                                        ? `Welcome back, ${loggedUser.firstName || loggedUser.username || 'User' || userProfile.full_name }!` 
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

        // Main Content Area
        {
            view: "scrollview",
            scroll: "y",
            body: {
                type: "clean",
                rows: [
                    // Card layout for content
                    {
                        type: "clean",
                        cols: [
                            { gravity: 0.5, minWidth: 20 },  // Left margin
                            {
                                // Left column
                                gravity: 2,
                                minWidth: 300,
                                rows: [
                                    {
                                        view: "form",
                                        id: "login_form",
                                        hidden: isUserLoggedIn(),
                                        css: "modern-login-card",
                                        elements: [
                                            {
                                                view: "template",
                                                height: 70,
                                                hidden: isUserLoggedIn(),
                                                template: function() {
                                                    return isUserLoggedIn() 
                                                        ? "<h2>Account Dashboard</h2>" 
                                                        : "<h2>Account Access</h2>";
                                                }
                                            },
                                            {
                                                view: "button",
                                                id: "login_button",
                                                value: "Login",
                                                hidden: isUserLoggedIn(),
                                                icon: "mdi mdi-login",
                                                css: "webix_primary btn-modern",
                                                height: 50,
                                                click: function() {
                                                    try {
                                                        $$("main_content").setValue("login");
                                                    } catch (error) {
                                                        console.error("Navigation error:", error);
                                                        window.showView && window.showView("login");
                                                    }
                                                }
                                            },
                                            { height: 15 },
                                            {
                                                view: "button",
                                                id: "signup_button",
                                                value: "Sign Up",
                                                hidden: isUserLoggedIn(),
                                                icon: "mdi mdi-account-plus",
                                                css: "webix_secondary btn-modern",
                                                height: 50,
                                                click: function() {
                                                    try {
                                                        $$("main_content").setValue("signup");
                                                    } catch (error) {
                                                        console.error("Navigation error:", error);
                                                        window.showView && window.showView("signup");
                                                    }
                                                }
                                            },
                                            // { height: 15 },
                                            // {
                                            //     view: "button",
                                            //     id: "settings_button",
                                            //     value: "Settings",
                                            //     icon: "mdi mdi-cog",
                                            //     hidden: true,
                                            //     css: "webix_info btn-modern",
                                            //     height: 50,
                                            //     click: function() {
                                            //         try {
                                            //             $$("main_content").setValue("settings_page");
                                            //         } catch (error) {
                                            //             console.error("Navigation error:", error);
                                            //             window.showView && window.showView("settings_page");
                                            //         }
                                            //     }
                                            // },
                                            // { height: 15 },
                                            // {
                                            //     view: "button",
                                            //     id: "logout_button",
                                            //     value: "Logout",
                                            //     icon: "mdi mdi-logout",
                                            //     hidden: true,
                                            //     css: "webix_danger btn-modern",
                                            //     height: 50,
                                            //     click: async function() {
                                            //         try {
                                            //             const { logoutUser } = await import("./utils/dataService.js");
                                                        
                                            //             await logoutUser();
                                                        
                                            //             webix.message({ type: "success", text: "Logged out successfully!" });
                                                        
                                            //             updateUIForLoginStatus();
                                                        
                                            //             setTimeout(() => {
                                            //                 location.reload();
                                            //             }, 1000);
                                                        
                                            //         } catch (error) {
                                            //             console.error("Logout error:", error);
                                            //             localStorage.removeItem("authToken");
                                            //             localStorage.removeItem("loggedUser");
                                            //             sessionStorage.removeItem("currentLoggedin");
                                                        
                                            //             webix.message({ type: "info", text: "Logged out locally" });
                                            //             updateUIForLoginStatus();
                                            //             location.reload();
                                            //         }
                                            //     }
                                            // }
                                        ]
                                    },
                                    // { height: 30 }  // Bottom spacing
                                ]
                            },
                            { width: 30 },  // Spacing between columns
                            {
                                // Right column with info cards
                                gravity: 3,
                                minWidth: 300,
                                rows: [
                                    {
                                        view: "template",
                                        id: "info_card_template",
                                        height: 180,
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
                                                        <h3>Quick Info</h3>
                                                        <p>${isLoggedIn && loggedUser
                                                            ? `Welcome ${loggedUser.username || loggedUser.firstName}! Access and adjust your security preferences. Manage your account settings and notification preferences from the settings panel.`
                                                            : "Log in or sign up to access your personalized dashboard and security settings."}
                                                        </p>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    },
                                    { height: 20 },
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
                                                    <h3>User Preferences Features</h3>
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
                                    { height: 30 }  // Bottom spacing
                                ]
                            },
                            { gravity: 0.2, minWidth: 20 }  // Right margin
                        ]
                    }
                ]
            }
        }
    ],
    on: {
        onShow: function() {
            // Update UI based on current login status
            updateUIForLoginStatus();
            
            // Add responsive behavior
            this.adjustLayout();
            webix.event(window, "resize", () => this.adjustLayout());
        },
        onAfterShow: function() {
            // Double-check login status after view is fully shown
            setTimeout(() => {
                updateUIForLoginStatus();
            }, 100);
        }
    },
    adjustLayout: function() {
        const width = window.innerWidth;
        // Responsive layout adjustments can be added here if needed
    }
};

// Listen for storage changes (when user logs in/out in another tab)
if (typeof window !== 'undefined') {
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken' || e.key === 'loggedUser') {
            // Update UI when storage changes
            updateUIForLoginStatus();
        }
    });
    
    // Make the update function globally available for use in other components
    window.updateHomeUIForLoginStatus = updateUIForLoginStatus;
}