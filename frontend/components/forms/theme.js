import { apiService } from '../utils/apiService.js';

function applyThemeMode(mode) {
  if (mode === "dark") {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme", "high-contrast-theme");
  } else if (mode === "light") {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme", "high-contrast-theme");
  } else if (mode === "high-contrast") {
    document.body.classList.add("high-contrast-theme");
    document.body.classList.remove("dark-theme", "light-theme");
  } else {
    
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyThemeMode("dark");
    } else {
      applyThemeMode("light");
    }
  }
  localStorage.setItem("theme", mode);
}

function applyPrimaryColor(color) {
  document.documentElement.style.setProperty('--webix-primary', color);
}

function toggleAnimations(enable) {
  if (!enable) {
    webix.ui.animate = false;
    document.body.classList.add("no-animations");
  } else {
    webix.ui.animate = true;
    document.body.classList.remove("no-animations");
  }
}

function applyFontFamily(font) {
  
  document.documentElement.style.setProperty('--webix-font-family', font);
 
  document.body.style.fontFamily = font;
  
  
  try {
  
    const webixElements = document.querySelectorAll('.webix_view, .webix_el_box, .webix_el_text, .webix_el_label');
    webixElements.forEach(element => {
      element.style.fontFamily = font;
    });
  } catch (error) {
    console.warn('Error applying font to Webix elements:', error);
  }
}


const DEFAULT_PREFERENCES = {
  theme: "system",
  font_family: "Arial, sans-serif",
  primary_color: "#1CA1C1",
  animations_enabled: true
};

export function applyPreferences(prefs) {
  document.body.setAttribute("data-theme", prefs.theme);
  document.body.style.fontFamily = prefs.font_family || "Arial, sans-serif";

  const root = document.documentElement;
  root.style.setProperty("--primary-color", prefs.primary_color || "#1CA1C1");

  if (prefs.animations_enabled) {
    document.body.classList.remove("no-animations");
  } else {
    document.body.classList.add("no-animations");
  }
}


export const ThemeForm = {
  type: "clean",
  rows: [
    {
      view: "template",
      type: "header",
      template: "<span class='mdi mdi-theme-light-dark'></span> Theme Settings",
      height: 50,
      css: "webix_header app_header"
    },
    {
      cols: [
        {
          view: "sidebar",
          id: "themeSidebar",
          width: 180,
          height: 500,
          data: [
            { id: "appearance", icon: "mdi mdi-palette", value: "Appearance" },
            { id: "layout", icon: "mdi mdi-view-dashboard-outline", value: "Layout" },
            { id: "accessibility", icon: "mdi mdi-eye", value: "Accessibility" }
          ],
          on: {
            onAfterSelect: function(id) {
              $$("themeFormMultiview").setValue(id);
            }
          }
        },
        {
          view: "multiview",
          id: "themeFormMultiview",
          height: 500,
          responsive: true,
          minWidth: 320,
          scroll: "y",
          cells: [
            {
              id: "appearance",
              rows: [
                {
                  view: "form",
                  id: "appearanceForm",
                  elements: [
                    {
                      cols: [
                        {
                          view: "radio",
                          label: "Theme",
                          labelWidth: 120,
                          name: "theme",
                          value: localStorage.getItem("theme") || "system",
                          options: [
                            { id: "light", value: "<span class='mdi mdi-weather-sunny'></span> Light Theme" },
                            { id: "dark", value: "<span class='mdi mdi-weather-night'></span> Dark Theme" },
                            { id: "high-contrast", value: "<span class='mdi mdi-contrast'></span> High Contrast" },
                            { id: "system", value: "<span class='mdi mdi-monitor'></span> System Default" }
                          ],
                          vertical: true,
                          height: 200,
                          css: "theme-radio-group",
                          on: {
                            onChange: function(newTheme) {
                              applyThemeMode(newTheme);
                            }
                          }
                        },
                        {
                          template: "<img src='../assets/images/5568706.jpg' style='width:100px'>",
                          borderless: true,
                          height: 200
                        }
                      ]
                    },
                    {
                      view: "select",
                      label: "Font Family",
                      labelWidth: 120,
                      name: "font_family",
                      value: localStorage.getItem("fontFamily") || "Arial, sans-serif",
                      options: [
                        { id: "Arial, sans-serif", value: "Arial" },
                        { id: "'Times New Roman', serif", value: "Times New Roman" },
                        { id: "'Courier New', monospace", value: "Courier New" },
                        { id: "'Segoe UI', sans-serif", value: "Segoe UI" },
                        { id: "'Roboto', sans-serif", value: "Roboto" },
                        { id: "'Open Sans', sans-serif", value: "Open Sans" }
                      ],
                      height: 40,
                      on: {
                        onChange: function() {
                          const values = $$("appearanceForm").getValues();
                          applyFontFamily(values.font_family);
                        }
                      }
                    },
                    {
                      view: "colorpicker",
                      label: "Primary Color",
                      labelWidth: 120,
                      name: "primary_color",
                      value: localStorage.getItem("primaryColor") || "#1CA1C1",
                      height: 40,
                      on: {
                        onChange: function() {
                          const values = $$("appearanceForm").getValues();
                          applyPrimaryColor(values.primary_color);
                        }
                      }
                    },
                    {
                      view: "switch",
                      label: "Enable Animations",
                      labelWidth: 150,
                      name: "animations_enabled",
                      value: localStorage.getItem("animations") === "true",
                      height: 40,
                      on: {
                        onChange: function() {
                          const values = $$("appearanceForm").getValues();
                          toggleAnimations(values.animations_enabled);
                        }
                      }
                    },
                  
                    {
                      height: 20
                    },
                    {
                      cols: [
                        {
                          view: "button",
                          value: "<span class='mdi mdi-content-save'></span> Save Preferences",
                          type: "form",
                          height: 45,
                          css: "primary-button",
                          click: function() {
                            savePreferences();
                          }
                        },
                        { width: 10 },
                        {
                          view: "button",
                          value: "<span class='mdi mdi-restore'></span> Reset to Default",
                          height: 45,
                          css: "webix_secondary",
                          click: function() {
                            resetToDefault();
                          }
                        }
                      ]
                    }
                  ],
                  on: {
                    onShow: function() {
                      loadPreferences();
                    },
                    onAfterRender: function() {
                    
                      loadPreferences();
                    }
                  }
                }
              ]
            },
            {
              id: "layout",
              template: "<div style='padding: 20px;'>Layout options coming soon...</div>",
              height: 500
            },
            {
              id: "accessibility",
              template: "<div style='padding: 20px;'>Accessibility options coming soon...</div>",
              height: 500
            }
          ]
        }
      ]
    }
  ],
  on: {
    onAfterRender: function() {
      this.adjustLayout();
      webix.event(window, "resize", () => this.adjustLayout());
    }
  },
  adjustLayout: function() {
    const width = window.innerWidth;
    const themeSidebar = $$("themeSidebar");
    const themeFormMultiview = $$("themeFormMultiview");
    const appearanceForm = $$("appearanceForm");

    // iPad Pro (1024x1366)
    if (width >= 1024 && width <= 1366) {
      if (themeSidebar) {
        themeSidebar.define("width", 220);
        themeSidebar.refresh();
      }
      if (themeFormMultiview) {
        themeFormMultiview.define("minWidth", 400);
        themeFormMultiview.refresh();
      }
      if (appearanceForm) {
        appearanceForm.define("elementsConfig", {
          labelWidth: 150
        });
        appearanceForm.refresh();
      }
    }
    // iPhone 12 Pro (390x844)
    else if (width <= 390) {
      if (themeSidebar) {
        themeSidebar.define("width", 140);
        themeSidebar.refresh();
      }
      if (themeFormMultiview) {
        themeFormMultiview.define("minWidth", 250);
        themeFormMultiview.refresh();
      }
      if (appearanceForm) {
        appearanceForm.define("elementsConfig", {
          labelWidth: 100
        });
        appearanceForm.refresh();
      }
    }
  }
};

// Add responsive styles
webix.html.addStyle(`
  /* iPad Pro specific styles */
  @media screen and (min-width: 1024px) and (max-width: 1366px) {
    .webix_header {
      font-size: 1.8rem;
      padding: 15px 25px;
    }
    
    .theme-radio-group {
      font-size: 16px;
    }
    
    .theme-radio-group .webix_radio_option {
      padding: 12px;
      margin-bottom: 10px;
    }
    
    .theme-radio-group .mdi {
      font-size: 20px;
      margin-right: 10px;
    }
    
    .primary-button, .webix_secondary {
      font-size: 16px;
      padding: 12px 20px;
    }
  }

  /* iPhone 12 Pro specific styles */
  @media screen and (max-width: 390px) {
    .webix_header {
      font-size: 1.4rem;
      padding: 10px 15px;
    }
    
    .theme-radio-group {
      font-size: 14px;
    }
    
    .theme-radio-group .webix_radio_option {
      padding: 8px;
      margin-bottom: 8px;
    }
    
    .theme-radio-group .mdi {
      font-size: 16px;
      margin-right: 8px;
    }
    
    .primary-button, .webix_secondary {
      font-size: 14px;
      padding: 8px 15px;
    }
    
    .webix_el_select, .webix_el_colorpicker, .webix_el_switch {
      height: 35px;
    }
  }
`);

async function loadPreferences() {
  try {
    
    loadFromLocalStorage();
    
   
    const response = await apiService.get('/preferences/');
    if (response.data) {
      const serverPreferences = response.data;
      
     
      const preferences = {
        theme: serverPreferences.theme,
        font_family: serverPreferences.font_family,
        primary_color: serverPreferences.primary_color,
        animations_enabled: serverPreferences.animations_enabled
      };
      
      applyPreferences(preferences);
      $("appearanceForm").setValues(preferences);
      
      
      localStorage.setItem("theme", preferences.theme);
      localStorage.setItem("fontFamily", preferences.font_family);
      localStorage.setItem("primaryColor", preferences.primary_color);
      localStorage.setItem("animations", preferences.animations_enabled.toString());
    }
  } catch (error) {
    console.error('Error loading preferences from server:', error);
   
    console.log('Using localStorage preferences as fallback');
  }
}

function loadFromLocalStorage() {
 
  let preferences = null;
  
  try {
    const storedPreferences = localStorage.getItem("preferences");
    if (storedPreferences) {
      const parsedPreferences = JSON.parse(storedPreferences);
      preferences = {
        theme: parsedPreferences.theme || localStorage.getItem("theme") || DEFAULT_PREFERENCES.theme,
        font_family: parsedPreferences.font_family || localStorage.getItem("fontFamily") || DEFAULT_PREFERENCES.font_family,
        primary_color: parsedPreferences.primary_color || localStorage.getItem("primaryColor") || DEFAULT_PREFERENCES.primary_color,
        animations_enabled: parsedPreferences.animations_enabled !== undefined ? parsedPreferences.animations_enabled : (localStorage.getItem("animations") === "true" || DEFAULT_PREFERENCES.animations_enabled)
      };
    }
  } catch (error) {
    console.warn('Error parsing stored preferences JSON:', error);
  }
  
  
  if (!preferences) {
    preferences = {
      theme: localStorage.getItem("theme") || DEFAULT_PREFERENCES.theme,
      font_family: localStorage.getItem("fontFamily") || DEFAULT_PREFERENCES.font_family,
      primary_color: localStorage.getItem("primaryColor") || DEFAULT_PREFERENCES.primary_color,
      animations_enabled: localStorage.getItem("animations") === "true" || DEFAULT_PREFERENCES.animations_enabled
    };
  }
  
  console.log('Loading preferences from localStorage:', preferences);
  applyPreferences(preferences);
  
 
  if ($("appearanceForm")) {
    $("appearanceForm").setValues(preferences);
  }
}

async function savePreferences() {
  try {
    const form = $$("appearanceForm");
    const values = form.getValues();
    
    const preferences = {
      theme: values.theme,
      font_family: values.font_family,
      primary_color: values.primary_color,
      animations_enabled: values.animations_enabled
    };
    
    
    localStorage.setItem("theme", preferences.theme);
    localStorage.setItem("fontFamily", preferences.font_family);
    localStorage.setItem("primaryColor", preferences.primary_color);
    localStorage.setItem("animations", preferences.animations_enabled.toString());
    
    
    applyPreferences(preferences);
    const storedPrefs = JSON.parse(localStorage.getItem("preferences"));
    const prefId = storedPrefs?.id;
    
    
    await apiService.put('/preference/', preferences, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });

    localStorage.setItem("preferences", JSON.stringify({ ...storedPrefs, ...preferences }));

    webix.message({ type: "success", text: "Preferences saved successfully!" });
  } catch (error) {
    console.error('Error saving preferences:', error);
    webix.message({ type: "error", text: "Failed to save preferences to server, but saved locally" });
  }
}

async function resetToDefault() {
  webix.confirm({
    title: "Reset to Default",
    text: "Are you sure you want to reset all theme settings to default values?",
    ok: "Yes, Reset",
    cancel: "Cancel",
    callback: async function(result) {
      if (result) {
        try {
          
          applyPreferences(DEFAULT_PREFERENCES);
          
       
          $$("appearanceForm").setValues(DEFAULT_PREFERENCES);
          
         
          localStorage.removeItem("theme");
          localStorage.removeItem("fontFamily");
          localStorage.removeItem("primaryColor");
          localStorage.removeItem("animations");
          
         
          await apiService.put('/preference/', DEFAULT_PREFERENCES, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });
          
          webix.message({ type: "success", text: "Settings reset to default successfully!" });
        } catch (error) {
          console.error('Error resetting preferences:', error);
          webix.message({ type: "error", text: "Failed to reset preferences on server, but reset locally" });
        }
      }
    }
  });
}