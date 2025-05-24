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
    // System: use prefers-color-scheme media query
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
  
  // Apply to all webix elements safely
  try {
    // Apply to all webix views
    const webixElements = document.querySelectorAll('.webix_view, .webix_el_box, .webix_el_text, .webix_el_label');
    webixElements.forEach(element => {
      element.style.fontFamily = font;
    });
  } catch (error) {
    console.warn('Error applying font to Webix elements:', error);
  }
}

// Default preferences
const DEFAULT_PREFERENCES = {
  theme: "system",
  font_family: "Arial, sans-serif",
  primary_color: "#1CA1C1",
  animations_enabled: true
};

function applyPreferences(preferences) {
  applyThemeMode(preferences.theme);
  applyFontFamily(preferences.font_family);
  applyPrimaryColor(preferences.primary_color);
  toggleAnimations(preferences.animations_enabled);
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
                        template: "<img src='https://cdn-icons-png.flaticon.com/512/919/919828.png' style='width:100px'>",
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
                  // Action buttons
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
                        css: "webix_primary",
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
                    // Also load preferences when the form is first rendered
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
]
};

async function loadPreferences() {
  try {
    // First, try to load from localStorage immediately for faster UI response
    loadFromLocalStorage();
    
    // Then try to load from server to get the latest preferences
    const response = await apiService.get('/api/preferences/');
    if (response.data) {
      const serverPreferences = response.data;
      
      // Apply server preferences and update form
      const preferences = {
        theme: serverPreferences.theme,
        font_family: serverPreferences.font_family,
        primary_color: serverPreferences.primary_color,
        animations_enabled: serverPreferences.animations_enabled
      };
      
      applyPreferences(preferences);
      $("appearanceForm").setValues(preferences);
      
      // Update localStorage with server data
      localStorage.setItem("theme", preferences.theme);
      localStorage.setItem("fontFamily", preferences.font_family);
      localStorage.setItem("primaryColor", preferences.primary_color);
      localStorage.setItem("animations", preferences.animations_enabled.toString());
    }
  } catch (error) {
    console.error('Error loading preferences from server:', error);
    // Continue using localStorage data (already loaded above)
    console.log('Using localStorage preferences as fallback');
  }
}

function loadFromLocalStorage() {
  // Try to get preferences from the stored JSON object first
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
  
  // Fallback to individual localStorage items if JSON parsing failed
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
  
  // Update form if it exists
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
    
    // Save to localStorage first
    localStorage.setItem("theme", preferences.theme);
    localStorage.setItem("fontFamily", preferences.font_family);
    localStorage.setItem("primaryColor", preferences.primary_color);
    localStorage.setItem("animations", preferences.animations_enabled.toString());
    
    // Apply preferences immediately
    applyPreferences(preferences);
    
    // Save to server
    await apiService.put('/preference/', preferences, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
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
          // Apply default preferences
          applyPreferences(DEFAULT_PREFERENCES);
          
          // Update form with default values
          $$("appearanceForm").setValues(DEFAULT_PREFERENCES);
          
          // Clear localStorage
          localStorage.removeItem("theme");
          localStorage.removeItem("fontFamily");
          localStorage.removeItem("primaryColor");
          localStorage.removeItem("animations");
          
          // Save defaults to server
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