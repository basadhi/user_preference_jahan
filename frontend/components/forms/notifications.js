import { apiService } from '../utils/apiService.js';

export const NotificationsForm = {
  id: "notifications_settings_cell",
  responsive: true,
  css: "notifications-form",
  scroll: "y",
  adaptivity: true,
  type: "clean",
  minHeight: 600,
  
  defaultValues: {
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    newsletter_subscriptions: false,
    notification_sound: "default",
    sound_mode: "keep",
    text_preview: true,
    media_preview: true,
    mute_notifications: false,
    message_tone: "Default",
    group_tone: "Default"
  },
  
  rows: [
    {
      template: `
        <div class="settings-header">
          <h1 class="settings-title">Notification Settings</h1>
          <p class="settings-subtitle">Customize how you receive notifications</p>
        </div>
      `,
      height: 90,
      css: "settings-header-container",
    },
    {
      view: "form",
      id: "notificationForm",
      scroll: false,
      paddingX: 20,
      paddingY: 20,
      elementsConfig: {
        labelPosition: "left",
        labelWidth: 160
      },
      elements: [
        // Main responsive grid container
        {
          view: "layout",
          type: "space",
          paddingX: 10,
          paddingY: 10,
          responsive: "notifications_layout",
          cols: [
            // Left column - Alert & Sound Settings
            {
              minWidth: 320,
              gravity: 1,
              rows: [
                // Alert Preferences Card
                {
                  view: "fieldset",
                  label: "Alert Preferences",
                  css: "modern-fieldset alert-preferences",
                  body: {
                    paddingX: 20,
                    paddingY: 15,
                    rows: [
                      {
                        view: "checkbox",
                        label: "Email Notifications",
                        name: "email_notifications",
                        labelWidth: 160,
                        tooltip: "Receive notifications via email",
                        tabFocus: true,
                        height: 45,
                        css: "modern-checkbox",
                        on: {
                          onChange: function() {
                            savePreferences();
                          }
                        }
                      },
                      {
                        view: "checkbox",
                        label: "SMS Notifications",
                        name: "sms_notifications",
                        labelWidth: 160,
                        tooltip: "Receive notifications via text message",
                        tabFocus: true,
                        height: 45,
                        css: "modern-checkbox",
                        on: {
                          onChange: function() {
                            savePreferences();
                          }
                        }
                      },
                      {
                        view: "checkbox",
                        label: "Push Notifications",
                        name: "push_notifications",
                        labelWidth: 160,
                        tooltip: "Receive push notifications on your device",
                        tabFocus: true,
                        height: 45,
                        css: "modern-checkbox",
                        on: {
                          onChange: function() {
                            savePreferences();
                          }
                        }
                      },
                      {
                        view: "checkbox",
                        label: "Newsletter Subscription",
                        name: "newsletter_subscriptions",
                        labelWidth: 160,
                        tooltip: "Receive newsletter emails",
                        tabFocus: true,
                        height: 45,
                        css: "modern-checkbox"
                      }
                    ]
                  }
                },
                
                { height: 20 }, // Spacer
                
                // Sound Settings Card
                {
                  view: "fieldset",
                  label: "Sound Settings",
                  css: "modern-fieldset sound-settings",
                  body: {
                    paddingX: 20,
                    paddingY: 15,
                    rows: [
                      {
                        view: "combo",
                        label: "Notification Sound",
                        name: "notification_sound",
                        labelWidth: 160,
                        options: [
                          { id: "default", value: "Default" },
                          { id: "chime", value: "Chime" },
                          { id: "beep", value: "Beep" },
                          { id: "silent", value: "Silent" }
                        ],
                        tabFocus: true,
                        tooltip: "Choose your notification sound",
                        height: 45,
                        css: "modern-combo",
                        on: {
                          onChange: function() {
                            savePreferences();
                          }
                        }
                      },
                      {
                        view: "segmented",
                        label: "Sound Mode",
                        name: "sound_mode",
                        labelWidth: 160,
                        options: [
                          { id: "mute", value: "Mute" },
                          { id: "keep", value: "Keep Sound" }
                        ],
                        tabFocus: true,
                        tooltip: "Configure sound mode",
                        height: 45,
                        css: "modern-segmented"
                      }
                    ]
                  }
                }
              ]
            },
            
            // Responsive spacer
            { 
              width: 30,
              css: "column-spacer"
            },
            
            // Right column - Preview & Tone Settings
            {
              minWidth: 320,
              gravity: 1,
              rows: [
                // Preview Settings Card
                {
                  view: "fieldset",
                  label: "Preview Settings",
                  css: "modern-fieldset preview-settings",
                  body: {
                    paddingX: 20,
                    paddingY: 15,
                    rows: [
                      {
                        view: "switch",
                        label: "Text Preview",
                        name: "text_preview",
                        labelWidth: 160,
                        onLabel: "On",
                        offLabel: "Off",
                        tabFocus: true,
                        tooltip: "Show text previews in notifications",
                        height: 45,
                        css: "modern-switch"
                      },
                      {
                        view: "switch",
                        label: "Media Preview",
                        name: "media_preview",
                        labelWidth: 160,
                        onLabel: "On",
                        offLabel: "Off",
                        tabFocus: true,
                        tooltip: "Show media previews in notifications",
                        height: 45,
                        css: "modern-switch"
                      },
                      {
                        view: "switch",
                        label: "Mute All Notifications",
                        name: "mute_notifications",
                        labelWidth: 160,
                        onLabel: "On",
                        offLabel: "Off",
                        tabFocus: true,
                        tooltip: "Temporarily silence all notifications",
                        height: 45,
                        css: "modern-switch"
                      }
                    ]
                  }
                },
                
                { height: 20 }, // Spacer
                
                // Notification Tones Card
                {
                  view: "fieldset",
                  label: "Notification Tones",
                  css: "modern-fieldset tone-settings",
                  body: {
                    paddingX: 20,
                    paddingY: 15,
                    rows: [
                      {
                        view: "layout",
                        height: 50,
                        cols: [
                          {
                            view: "label",
                            label: "Message Tone",
                            width: 120,
                            css: "tone-label"
                          },
                          {
                            view: "button",
                            type: "icon",
                            icon: "mdi mdi-play-circle",
                            width: 40,
                            height: 40,
                            click: () => window.playMessageTone && window.playMessageTone(),
                            tabFocus: true,
                            tooltip: "Play message tone sample",
                            css: "play-button modern-play-btn"
                          },
                          {
                            view: "richselect",
                            name: "message_tone",
                            options: ["Default", "Chime", "Beep", "Custom"],
                            value: "Default",
                            tabFocus: true,
                            css: "tone-select modern-select",
                            gravity: 1
                          }
                        ]
                      },
                      { height: 10 },
                      {
                        view: "layout",
                        height: 50,
                        cols: [
                          {
                            view: "label",
                            label: "Group Tone",
                            width: 120,
                            css: "tone-label"
                          },
                          {
                            view: "button",
                            type: "icon",
                            icon: "mdi mdi-play-circle",
                            width: 40,
                            height: 40,
                            click: () => window.playGroupTone && window.playGroupTone(),
                            tabFocus: true,
                            tooltip: "Play group tone sample",
                            css: "play-button modern-play-btn"
                          },
                          {
                            view: "richselect",
                            name: "group_tone",
                            options: ["Default", "Chime", "Beep", "Custom"],
                            value: "Default",
                            tabFocus: true,
                            css: "tone-select modern-select",
                            gravity: 1
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        },
        
        { height: 30 }, // Spacer before buttons
        
        // Action Buttons
        {
          view: "layout",
          height: 60,
          paddingX: 20,
          cols: [
            { gravity: 1 }, // Flexible spacer
            {
              view: "button",
              id: "save_button",
              value: "Save Changes(alt+s)",
              minWidth: 120,
              height: 45,
              css: "primary-button",
              tabFocus: true,
              tooltip: "Save your notification settings",
              hotkey: "alt+s",
              click: function () {
                const form = $$("notificationForm");
                if (form) {
                  const values = form.getValues();
                  console.log("Saving settings:", values);
                  
                  // Simulate API call
                  webix.message({
                    type: "success",
                    text: "Notification settings saved successfully!",
                    expire: 3000
                  });
                }
              }
            },
            {
              view: "button",
              id: "reset_button",
              value: "Reset to Default",
              minWidth: 150,
              height: 45,
              css: "reset-button modern-btn-secondary",
              tabFocus: true,
              tooltip: "Reset all settings to default values",
              hotkey: "alt+r",
              click: function () {
                const form = $$("notificationForm");
                if (form) {
                  form.clear();
                  form.setValues(NotificationsForm.defaultValues);
                  webix.message({
                    type: "info",
                    text: "Settings reset to default values",
                    expire: 3000
                  });
                }
              }
            },
            { width: 15 }, // Fixed spacer
            // {
            //   view: "button",
            //   id: "save_button",
            //   value: "Save Changes(alt+s)",
            //   minWidth: 120,
            //   height: 45,
            //   css: "primary-button",
            //   tabFocus: true,
            //   tooltip: "Save your notification settings",
            //   hotkey: "alt+s",
            //   click: function () {
            //     const form = $$("notificationForm");
            //     if (form) {
            //       const values = form.getValues();
            //       console.log("Saving settings:", values);
                  
            //       // Simulate API call
            //       webix.message({
            //         type: "success",
            //         text: "Notification settings saved successfully!",
            //         expire: 3000
            //       });
            //     }
            //   }
            // }
          ]
        }
      ]
    }
  ],

  on: {
    onViewResize: function () {
      this.adjust();
      this.callEvent("onResponsiveUpdate");
    },

    onAfterRender: function () {
      // Initialize form with default values
      const form = $$("notificationForm");
      if (form) {
        form.setValues(this.config.defaultValues);
      }

      // Set up keyboard navigation
      this.setupKeyboardNavigation();
      
      // Set up sound playback functions
      this.setupSoundPlayback();
      
      // Apply responsive behavior
      this.setupResponsiveBehavior();
      
      // Add modern styles
      this.addModernStyles();
    },

    onResponsiveUpdate: function() {
      const width = this.$width || window.innerWidth;
      const layout = $$("notifications_layout");
      
      if (width < 768) {
        // Mobile: Stack columns vertically
        if (layout && layout.config.cols) {
          layout.define("rows", layout.config.cols);
          layout.define("cols", []);
          // Hide spacer in mobile
          const spacer = layout.queryView({ css: "column-spacer" });
          if (spacer) spacer.hide();
        }
      } else {
        // Desktop/Tablet: Side by side columns
        if (layout && layout.config.rows) {
          layout.define("cols", layout.config.rows);
          layout.define("rows", []);
          // Show spacer in desktop
          const spacer = layout.queryView({ css: "column-spacer" });
          if (spacer) spacer.show();
        }
      }
      
      if (layout) {
        layout.refresh();
      }
    }
  },

  // Helper methods
  setupKeyboardNavigation: function() {
    if (webix.UIManager) {
      // Enhanced keyboard navigation
      webix.UIManager.addHotKey("tab", (view) => {
        const next = webix.UIManager.getNext(view);
        if (next) webix.UIManager.setFocus(next);
      });

      webix.UIManager.addHotKey("shift+tab", (view) => {
        const prev = webix.UIManager.getPrev(view);
        if (prev) webix.UIManager.setFocus(prev);
      });

      webix.UIManager.addHotKey("enter", (view) => {
        if (view && view.config) {
          if (view.config.view === "button") {
            view.callEvent("onItemClick", []);
          } else if (["checkbox", "switch"].includes(view.config.view)) {
            view.setValue(!view.getValue());
          }
        }
      });
    }
  },

  setupSoundPlayback: function() {
    window.playMessageTone = () => {
      const form = $$("notificationForm");
      if (!form) return;

      const tone = form.getValues().message_tone || "Default";
      console.log("Playing message tone:", tone);
      
      webix.message({
        type: "info",
        text: `Playing ${tone} message tone`,
        expire: 2000
      });

      // Simulate sound playback
      try {
        const audio = new Audio(`/sounds/${tone.toLowerCase()}.mp3`);
        audio.play().catch(e => console.log("Audio playback not available in demo"));
      } catch (e) {
        console.log("Audio playback not available in demo");
      }
    };

    window.playGroupTone = () => {
      const form = $$("notificationForm");
      if (!form) return;

      const tone = form.getValues().group_tone || "Default";
      console.log("Playing group tone:", tone);
      
      webix.message({
        type: "info", 
        text: `Playing ${tone} group tone`,
        expire: 2000
      });

      try {
        const audio = new Audio(`/sounds/${tone.toLowerCase()}.mp3`);
        audio.play().catch(e => console.log("Audio playback not available in demo"));
      } catch (e) {
        console.log("Audio playback not available in demo");
      }
    };
  },

  setupResponsiveBehavior: function() {
    // Set up responsive observer
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        this.callEvent("onResponsiveUpdate");
      });
      
      if (this.$view) {
        resizeObserver.observe(this.$view);
      }
    }

    // Initial responsive setup
    setTimeout(() => {
      this.callEvent("onResponsiveUpdate");
    }, 100);
  },

  addModernStyles: function() {
    if (!document.getElementById("modern-notification-styles")) {
      const style = document.createElement('style');
      style.id = "modern-notification-styles";
      style.textContent = `
        .notifications-form {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .settings-header-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px 12px 0 0;
        }

        .settings-header {
          padding: 20px;
          text-align: center;
          color: white;
        }

        .settings-title {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .settings-subtitle {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
          font-weight: 300;
        }

        .modern-fieldset {
          background: white;
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .modern-fieldset:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .modern-fieldset .webix_fieldset_label {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 16px;
          border-radius: 12px 12px 0 0;
          margin: 0;
        }

        .modern-checkbox, .modern-switch {
          border-bottom: 1px solid #f0f2f5;
          transition: background-color 0.2s ease;
        }

        .modern-checkbox:hover, .modern-switch:hover {
          background-color: #f8f9fa;
        }

        .modern-checkbox:last-child, .modern-switch:last-child {
          border-bottom: none;
        }

        .modern-combo, .modern-select {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          transition: border-color 0.2s ease;
        }

        .modern-combo:focus, .modern-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .modern-segmented {
          border-radius: 8px;
          overflow: hidden;
        }

        .modern-play-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .modern-play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .modern-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .modern-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
        }

        .modern-btn-secondary {
          background: white;
          color: #6c757d;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .modern-btn-secondary:hover {
          background: #f8f9fa;
          border-color: #dee2e6;
          transform: translateY(-1px);
        }

        .tone-label {
          font-weight: 500;
          color: #495057;
          display: flex;
          align-items: center;
        }

        .column-spacer {
          background: transparent;
        }

        @media (max-width: 767px) {
          .settings-title {
            font-size: 24px;
          }
          
          .column-spacer {
            display: none;
          }
          
          .modern-fieldset {
            margin-bottom: 15px;
          }
        }

        /* WebIX specific overrides */
        .webix_view.notifications-form {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        /* Improve form element spacing */
        .webix_form .webix_view {
          margin-bottom: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

async function loadPreferences() {
  try {
    const response = await apiService.get('/preferences/', 
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      }
    );
    if (response.data) {
      const preferences = response.data;
      
      $$("notificationForm").setValues({
        email_notifications: preferences.email_notifications,
        sms_notifications: preferences.sms_notifications,
        push_notifications: preferences.push_notifications,
        notification_sound: preferences.notification_sound,
        notification_vibration: preferences.notification_vibration,
        notification_light: preferences.notification_light
      });
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
    webix.message({ type: "error", text: "Failed to load preferences" });
  }
}

async function savePreferences() {
  try {
    const form = $$("notificationForm");
    const values = form.getValues();
    
    const preferences = {
      email_notifications: values.email_notifications,
      sms_notifications: values.sms_notifications,
      push_notifications: values.push_notifications,
      notification_sound: values.notification_sound,
      notification_vibration: values.notification_vibration,
      notification_light: values.notification_light
    };
    
    await apiService.put('/preferences/', preferences, 
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      }
    );
    webix.message({ type: "success", text: "Notification preferences saved successfully!" });
  } catch (error) {
    console.error('Error saving preferences:', error);
    webix.message({ type: "error", text: "Failed to save preferences" });
  }
}