import { JetView } from "webix-jet";
import { AccountForm } from "../components/forms/account.js";
import { NotificationsForm } from "../components/forms/notifications.js";
import { PrivacyForm } from "../components/forms/privacy.js";
import { ThemeForm } from "../components/forms/theme.js";

export default class SettingsView extends JetView {
    config() {
        return {
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
                            click: () => {
                                this.show("home"); 
                            }
                        },
                        { 
                            view: "segmented", 
                            id: "settingsNavigation",
                            localId: "navigation",
                            multiview: true,
                            options: [
                                { value: "Account", id: "account_settings_cell" },
                                { value: "Privacy", id: "privacy_settings_cell" },
                                { value: "Notifications", id: "notifications_settings_cell" },
                                { value: "Theme", id: "theme_settings_cell" }
                            ],
                            on: {
                                onChange: (newv) => {
                                    this.$$("multiview").setValue(newv);
                                }
                            }
                        },
                        {
                            view: "button",
                            type: "icon",
                            icon: "mdi mdi-menu",
                            id: "mobileMenuToggle",
                            localId: "mobileToggle",
                            width: 40,
                            css: "webix_primary",
                            hidden: true,
                            click: () => {
                                this.showMobileMenu();
                            }
                        }
                    ]
                },
                {
                    view: "multiview", 
                    id: "settingsMultiview",
                    localId: "multiview",
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
            ]
        };
    }

    init() {
       
        this.createMobileMenu();
        
     
        this.setupKeyboardShortcuts();
        
     
        this.setupResponsiveHandler();
        
      
        this.$$("navigation").setValue("account_settings_cell");
        this.$$("multiview").setValue("account_settings_cell");
    }

    ready() {
       
        this.handleResponsiveLayout();
    }

    createMobileMenu() {
        if (!this.mobileMenu) {
            this.mobileMenu = webix.ui({
                view: "popup",
                id: "settingsMobileMenu_" + this.config.id,
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
                        onItemClick: (id) => {
                            this.switchSettingsView(id);
                            this.mobileMenu.hide();
                        }
                    }
                }
            });

            
            this.addMobileMenuStyles();
        }
    }

    addMobileMenuStyles() {
        if (!this.stylesAdded) {
            webix.html.addStyle(`
                .mobile-menu-item {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                }
                .mobile-menu-item .webix_icon {
                    margin-right: 10px;
                }
                
                @media (max-width: 600px) {
                    .settings-toolbar .webix_segmented {
                        display: none !important;
                    }
                    .settings-toolbar .mobile-toggle {
                        display: block !important;
                    }
                }
                
                @media (min-width: 601px) {
                    .settings-toolbar .mobile-toggle {
                        display: none !important;
                    }
                }
            `);
            this.stylesAdded = true;
        }
    }

    setupResponsiveHandler() {
        this.resizeHandler = webix.debounce(() => {
            this.handleResponsiveLayout();
        }, 100);

        webix.event(window, "resize", this.resizeHandler);
    }

    handleResponsiveLayout() {
        const width = window.innerWidth;
        const navigation = this.$$("navigation");
        const mobileToggle = this.$$("mobileToggle");

        if (width < 600) {
           
            if (navigation) navigation.hide();
            if (mobileToggle) mobileToggle.show();
        } else {
           
            if (navigation) navigation.show();
            if (mobileToggle) mobileToggle.hide();
        }

        
        this.getRoot().resize();
    }

    showMobileMenu() {
        if (this.mobileMenu) {
            const toggle = this.$$("mobileToggle");
            if (toggle) {
                this.mobileMenu.show(toggle.getNode());
            }
        }
    }

    switchSettingsView(viewId) {
        try {
            const multiview = this.$$("multiview");
            const navigation = this.$$("navigation");

            if (multiview) {
                multiview.setValue(viewId);
            }
            
            if (navigation) {
                navigation.setValue(viewId);
            }
        } catch (error) {
            console.error("Error switching settings view:", error);
        }
    }

    setupKeyboardShortcuts() {
        this.keyHandler = (e) => {
            if (e.altKey) {
                switch (e.key.toUpperCase()) {
                    case "A":
                        this.switchSettingsView("account_settings_cell");
                        e.preventDefault();
                        break;
                    case "P":
                        this.switchSettingsView("privacy_settings_cell");
                        e.preventDefault();
                        break;
                    case "N":
                        this.switchSettingsView("notifications_settings_cell");
                        e.preventDefault();
                        break;
                    case "T":
                        this.switchSettingsView("theme_settings_cell");
                        e.preventDefault();
                        break;
                }
            }
        };

        webix.event(document, "keydown", this.keyHandler);
    }

    
    showAccountSettings() {
        this.switchSettingsView("account_settings_cell");
    }

    showPrivacySettings() {
        this.switchSettingsView("privacy_settings_cell");
    }

    showNotificationSettings() {
        this.switchSettingsView("notifications_settings_cell");
    }

    showThemeSettings() {
        this.switchSettingsView("theme_settings_cell");
    }

    
    urlChange(view) {
        if (view.params && view.params.tab) {
            const tabMap = {
                'account': 'account_settings_cell',
                'privacy': 'privacy_settings_cell',
                'notifications': 'notifications_settings_cell',
                'theme': 'theme_settings_cell'
            };
            
            const cellId = tabMap[view.params.tab];
            if (cellId) {
                this.switchSettingsView(cellId);
            }
        }
    }

    destroy() {
       
        if (this.resizeHandler) {
            webix.eventRemove(this.resizeHandler);
        }
        
        if (this.keyHandler) {
            webix.eventRemove(this.keyHandler);
        }

       
        if (this.mobileMenu) {
            this.mobileMenu.destructor();
        }

        super.destroy();
    }
}