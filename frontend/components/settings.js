import { AccountForm } from "../components/forms/account.js";
import { NotificationsForm } from "../components/forms/notifications.js";
import { PrivacyForm } from "../components/forms/privacy.js";
import { ThemeForm } from "../components/forms/theme.js";

export const settings = {
    id: "settings_page",
    responsive: true,
    type: "clean",
    rows: [
        {
            view: "toolbar",
            responsive: true,
            cols: [
                {
                view: "button",
                type: "icon",
                icon: "mdi mdi-arrow-left",
                label: "Back",
                width: 100,
                css: "webix_primary",
                click: function () {
                    $$("main_content").setValue("home_ui"); // ✅ Replace with your home view ID
                }
            },
                { 
                    view: "segmented", 
                    id: "settingsNavigation",
                    multiview: true,
                    options: [
                        { value: "Account", id: "account_settings_cell" },
                        { value: "Privacy", id: "privacy_settings_cell" },
                        { value: "Notifications", id: "notifications_settings_cell" },
                        {value: "Theme", id:"theme_settings_cell"}
                    ],
                    on: {
                        onChange: function(newv) {
                            $$("settingsMultiview").setValue(newv);
                        }
                    }
                }
            ]
        },
        {
            view: "multiview", 
            id: "settingsMultiview",
            cells: [
                { 
                    id: "account_settings_cell", 
                    ...AccountForm,
                    responsive: true
                },
                { 
                    id: "privacy_settings_cell", 
                    ...PrivacyForm,
                    responsive: true
                },
                { 
                    id: "notifications_settings_cell", 
                    ...NotificationsForm,
                    responsive: true
                },
                { 
                    id: "theme_settings_cell", 
                    ...ThemeForm,
                    responsive: true
                }
            ]
        }
    ],
    // Responsive configuration
    responsiveConfig: {
        mobile: {
            breakpoint: 600,
            params: {
                layout: {
                    type: "space"
                }
            }
        },
        tablet: {
            breakpoint: 1024,
            params: {
                layout: {
                    type: "wide"
                }
            }
        }
    },
    
    // Dynamic responsiveness handler
    on: {
        onAfterRender: function() {
            // Manage mobile menu visibility
            const width = this.getParentView().config.width || window.innerWidth;
            const mobileMenuToggle = $$("mobileMenuToggle");
            const settingsNavigation = $$("settingsNavigation");

            if (width < 600) {
                // Mobile view
                mobileMenuToggle.show();
                settingsNavigation.hide();
            } else {
                // Desktop/Tablet view
                mobileMenuToggle.hide();
                settingsNavigation.show();
            }
        }
    }
};

// Mobile menu popup for small screens
if (!$$("settingsMobileMenu")) {
    webix.ui({
        view: "popup",
        id: "settingsMobileMenu",
        width: 250,
        body: {
            view: "list",
            select: true,
            data: [
                { id: "account_settings_cell", value: "Account", icon: "user" },
                { id: "privacy_settings_cell", value: "Privacy", icon: "lock" },
                { id: "notifications_settings_cell", value: "Notifications", icon: "bell" },
                { id: "theme_settings_cell", value: "Appearance", icon: "paint-brush" }
            ],
            template: "<div class='mobile-menu-item'><span class='webix_icon fa-#icon#'></span> #value#</div>",
            on: {
                onItemClick: function(id) {
                    $$("settingsNavigation").setValue(id);
                    $$("settingsMultiview").setValue(id);
                    $$("settingsMobileMenu").hide();
                }
            }
        }
    });
}

// Optional: Add responsive CSS
webix.html.addStyle(`
    .mobile-menu-item {
        display: flex;
        align-items: center;
        padding: 10px;
    }
    .mobile-menu-item .webix_icon {
        margin-right: 10px;
    }
`);

// Utility function for view switching
function switchSettingsView(viewId) {
    try {
        const settingsMultiview = $$("settingsMultiview");
        const settingsNavigation = $$("settingsNavigation");
        
        if (settingsMultiview && settingsNavigation) {
            settingsMultiview.setValue(viewId);
            settingsNavigation.setValue(viewId);
        }
    } catch (error) {
        console.error("Error switching settings view:", error);
    }
}

window.showsettingsView = function (viewId) {
    $$("settingsView").setValue(viewId);
};

if ($$("settings")) {
    $$("settings").attachEvent("onKeyPress", function (key, e) {
      switch (key) {
        case 65: // 'A' key
          if (e.altKey) {
            showSettingsView("account_settings_cell");
          }
          break;
        case 80: // 'P' key
          if (e.altKey) {
            showSettingsView("privacy_settings_cell");
          }
          break;
        case 78: // 'N' key
          if (e.altKey) {
            showSettingsView("notifications_settings_cell");
          }
          break;
      }
    });
  }