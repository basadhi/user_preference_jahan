import { apiService } from '../utils/apiService.js';

// Get token from localStorage
const getToken = () => localStorage.getItem("authToken");
window.changedFields = new Set();


export const AccountForm = {
  id: "account_settings_cell",
  responsive: true,
  minWidth: 320,
  rows: [
    {
      // Header section
      template: "<div class='page-header'><h1>Account Settings</h1><p>Manage your account information and preferences</p></div>",
      type: "header",
      height: 80,
      css: "modern-header"
    },
    {
      // Main content area
      cols: [
        {
          // Sidebar navigation
          view: "sidebar",
          id: "account_sidebar",
          width: 200,
          responsive: true,
          minWidth: 100,
          maxWidth: 350,
          gravity: 0.3,
          css: "modern-sidebar",
          data: [
            { 
              id: "profile", 
              value: "Profile Information", 
              icon: "wxi-user",
              badge: "" 
            },
            { 
              id: "personal", 
              value: "Personal Details", 
              icon: "wxi-info",
              badge: "" 
            },
            { 
              id: "security", 
              value: "Security & Password", 
              icon: "wxi-lock",
              badge: "" 
            }
          ],
          on: {
            onAfterSelect: function (id) {
              $$("account_content_multiview").setValue(id);
            }
          }
        },
        {
          // Spacer
          width: 20
        },
        {
          // Content area
          view: "multiview",
          id: "account_content_multiview",
          animate: { type: "slide", direction: "left" },
          gravity: 0.7,
          minWidth: 400,
          css: "content-area",
          cells: [
            {
              // Profile tab
              id: "profile",
              rows: [
                {
                  template: "<div class='section-header'><h2>Profile Information</h2><p>Update your basic profile details</p></div>",
                  type: "header",
                  height: 60,
                  css: "section-title"
                },
                {
                  view: "scrollview",
                  scroll: "y",
                  body: {
                    rows: [
                      {
                        // Profile image section
                        cols: [
                          {
                            rows: [
                              {
                                view: "template",
                                id: "profile_image_container",
                                template: function () {
                                    const existingImage = localStorage.getItem("profileImage") || window.profileImageData;
                                    const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                                    const imageSrc = existingImage || defaultImage;
                                    return `
                                    <div class="profile-image-wrapper">
                                      <div class="profile-image-container">
                                        <img id='profile-img'  class="profile-image" src="${imageSrc}" alt="Profile Image" onerror="this.onerror=null; this.src='${defaultImage}';">
                                        <div class="profile-image-overlay">
                                          <i class="wxi-camera"></i>
                                          <span>Change</span>
                                        </div>
                                      </div>
                                    </div>
                                  `;
                                },
                                height: 140,
                                css: "profile-image-section"
                              },
                              {
                                view: "uploader",
                                value: "Upload New Photo",
                                accept: "image/*",
                                multiple: false,
                                height: 40,
                                css: "upload-button",
                                on: {
                                  onBeforeFileAdd: function (file) {
                                    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
                                    if (!allowed.includes(file.file.type)) {
                                      webix.message({ type: "error", text: "Please upload a valid image file (PNG, JPG, GIF, WebP)" });
                                      return false;
                                    }
                                    if (file.file.size > 5 * 1024 * 1024) {
                                      webix.message({ type: "error", text: "File size must be less than 5MB" });
                                      return false;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = function (e) {
                                      document.getElementById("profile-img").src = e.target.result;
                                      const imageData = e.target.result; 
                                     

                                    localStorage.setItem("profileImage", imageData);
                                    window.profileImageData = e.target.result;
                                      $$("profile_image_container").refresh();
                                      showChangeIndicator("profile_image");
                                    };
                                    refreshUserInfo();
                                    reader.readAsDataURL(file.file);
                                    webix.message({ type: "success", text: "Image uploaded successfully!" });
                                    return false;
                                  }
                                }
                              }
                            ],
                            width: 200,
                            gravity: 0.4
                          },
                          {
                            width: 30
                          },
                          {
                            // Profile form
                            view: "form",
                            id: "profile_form",
                            gravity: 0.6,
                            minWidth: 300,
                            elementsConfig: {
                              labelWidth: 140,
                              labelAlign: "right"
                            },
                            elements: [
                              {
                                view: "text",
                                label: "Full Name",
                                name: "full_name",
                                placeholder: "Enter your full name",
                                css: "modern-input",
                                validate: webix.rules.isNotEmpty,
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("full_name");
                                  }
                                }
                              },
                              {
                                view: "text",
                                label: "Display Name",
                                name: "display_name",
                                placeholder: "How others see you",
                                css: "modern-input",
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("display_name");
                                    const currentUser = JSON.parse(localStorage.getItem("loggedUser")) || {};
                                    currentUser.displayName = this.getValue();
                                    localStorage.setItem("loggedUser", JSON.stringify(currentUser));
                                    currentUser.displayName = newValue;
                                    localStorage.setItem("loggedUser", JSON.stringify(currentUser));

                                  }
                                }
                              },
                              {
                                view: "text",
                                label: "Email Address",
                                name: "email",
                                type: "email",
                                value: JSON.parse(sessionStorage.getItem("currentLoggedin"))?.email || "",
                                disabled: true,
                                css: "modern-input disabled-field",
                                tooltip: "Email cannot be changed. Contact support if needed."
                              },
                              {
                                view: "text",
                                label: "Phone Number",
                                name: "phone",
                                placeholder: "+1 (555) 123-4567",
                                css: "modern-input",
                                validate: function (value) {
                                  return !value || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value);
                                },
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("phone");
                                  }
                                }
                              },
                              {
                                view: "text",
                                label: "Job Title",
                                name: "job_title",
                                placeholder: "Your current position",
                                css: "modern-input",
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("job_title");
                                  }
                                }
                              },
                              {
                                view: "textarea",
                                label: "Bio",
                                name: "bio",
                                placeholder: "Tell us about yourself...",
                                height: 80,
                                css: "modern-textarea",
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("bio");
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      },
                      {
                        height: 30
                      },
                      {
                        // Action buttons
                        cols: [
                          {},
                          {
                            view: "button",
                            value: "Reset Changes",
                            minWidth: 120,  
                            height: 45,
                            tooltip: "Reset(alt+r)",
                            hotkey: "alt+r",
                            css: "primary-button",
                            click: function () {
                              $$("profile_form").clear();
                              loadUserProfile();
                              clearChangeIndicators();
                            }
                          },
                          {
                            width: 10
                          },
                          {
                            view: "button",
                            value: "Save Profile",
                            minWidth: 120,  
                            height: 45,
                            tooltip: "Save Profile(alt+s)",
                            hotkey: "alt+s",
                            css: "primary-button",
                            click: async function () {
                              await saveProfile();
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            {
              // Personal details tab
              id: "personal",
              rows: [
                {
                  template: "<div class='section-header'><h2>Personal Details</h2><p>Manage your personal information</p></div>",
                  type: "header",
                  height: 60,
                  css: "section-title"
                },
                {
                  view: "scrollview",
                  scroll: "y",
                  body: {
                    rows: [
                      {
                        view: "form",
                        id: "personal_form",
                        elementsConfig: {
                          labelWidth: 140,
                          labelAlign: "right"
                        },
                        elements: [
                          {
                            cols: [
                              {
                                view: "datepicker",
                                label: "Date of Birth",
                                name: "date_of_birth",
                                format: "%d %M %Y",
                                css: "modern-input",
                                gravity: 1,
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("date_of_birth");
                                  }
                                }
                              },
                              {
                                width: 20
                              },
                              {
                                view: "richselect",
                                label: "Gender",
                                name: "gender",
                                css: "modern-select",
                                options: [
                                  { id: "male", value: "Male" },
                                  { id: "female", value: "Female" },
                                  { id: "other", value: "Other" },
                                  { id: "prefer_not_to_say", value: "Prefer not to say" }
                                ],
                                gravity: 1,
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("gender");
                                  }
                                }
                              }
                            ]
                          },
                          {
                            view: "richselect",
                            label: "Marital Status",
                            name: "marital_status",
                            css: "modern-select",
                            options: [
                              "Single",
                              "Married",
                              "Divorced",
                              "Widowed",
                              "In a relationship",
                              "Other"
                            ],
                            on: {
                              onChange: function() {
                                showChangeIndicator("marital_status");
                              }
                            }
                          },
                          {
                            view: "text",
                            label: "Occupation",
                            name: "occupation",
                            placeholder: "Your profession or job",
                            css: "modern-input",
                            on: {
                              onChange: function() {
                                showChangeIndicator("occupation");
                              }
                            }
                          },
                          {
                            view: "text",
                            label: "Company",
                            name: "company",
                            placeholder: "Where do you work?",
                            css: "modern-input",
                            on: {
                              onChange: function() {
                                showChangeIndicator("company");
                              }
                            }
                          },
                          {
                            view: "textarea",
                            label: "Address",
                            name: "address",
                            placeholder: "Your full address",
                            height: 80,
                            css: "modern-textarea",
                            on: {
                              onChange: function() {
                                showChangeIndicator("address");
                              }
                            }
                          },
                          {
                            cols: [
                              {
                                view: "text",
                                label: "City",
                                name: "city",
                                placeholder: "City",
                                css: "modern-input",
                                gravity: 1,
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("city");
                                  }
                                }
                              },
                              {
                                width: 20
                              },
                              {
                                view: "text",
                                label: "State/Province",
                                name: "state",
                                placeholder: "State",
                                css: "modern-input",
                                gravity: 1,
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("state");
                                  }
                                }
                              },
                              {
                                width: 20
                              },
                              {
                                view: "text",
                                label: "ZIP Code",
                                name: "zip_code",
                                placeholder: "12345",
                                css: "modern-input",
                                gravity: 0.7,
                                on: {
                                  onChange: function() {
                                    showChangeIndicator("zip_code");
                                  }
                                }
                              }
                            ]
                          },
                          {
                            view: "richselect",
                            label: "Country",
                            name: "country",
                            css: "modern-select",
                            options: [
                              "United States",
                              "Canada",
                              "United Kingdom",
                              "Australia",
                              "Germany",
                              "France",
                              "Other"
                            ],
                            on: {
                              onChange: function() {
                                showChangeIndicator("country");
                              }
                            }
                          }
                        ]
                      },
                      {
                        height: 30
                      },
                      {
                        cols: [
                          {},
                          {
                            view: "button",
                            value: "Reset",
                            minWidth: 120,  
                            height: 45,
                            css: "primary-button",
                            tooltip: "Reset(alt+r)",
                            hotkey: "alt+r",
                            click: function () {
                              $$("personal_form").clear();
                              loadPersonalDetails();
                              clearChangeIndicators();
                            }
                          },
                          {
                            width: 10
                          },
                          {
                            view: "button",
                            value: "Save Details",
                            minWidth: 120,  
                            height: 45,
                            css: "primary-button",
                            tooltip: "Save Details(alt+s)",
                            hotkey: "alt+s",
                            click: async function () {
                              await savePersonalDetails();
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            {
              // Security tab
              id: "security",
              rows: [
                {
                  template: "<div class='section-header'><h2>Security & Password</h2><p>Keep your account secure</p></div>",
                  type: "header",
                  height: 60,
                  css: "section-title"
                },
                {
                  view: "scrollview",
                  scroll: "y",
                  body: {
                    rows: [
                      {
                        view: "form",
                        id: "security_form",
                        elementsConfig: {
                          labelWidth: 160,
                          labelAlign: "right"
                        },
                        elements: [
                          {
                            template: "<div class='form-section-title'>Change Password</div>",
                            height: 40,
                            css: "form-section-header"
                          },
                          {
                            view: "text",
                            type: "password",
                            label: "Current Password",
                            name: "current_password",
                            placeholder: "Enter current password",
                            css: "modern-input",
                            validate: webix.rules.isNotEmpty
                          },
                          {
                            view: "text",
                            type: "password",
                            label: "New Password",
                            name: "new_password",
                            placeholder: "Enter new password",
                            css: "modern-input",
                            validate: function (value) {
                              return value.length >= 8;
                            }
                          },
                          {
                            view: "text",
                            type: "password",
                            label: "Confirm Password",
                            name: "confirm_password",
                            placeholder: "Confirm new password",
                            css: "modern-input",
                            validate: function (value) {
                              return value === $$("security_form").getValues().new_password;
                            }
                          },
                          {
                            template: `
                              <div class='password-requirements'>
                                <h4>Password Requirements:</h4>
                                <ul>
                                  <li>At least 8 characters long</li>
                                  <li>Contains uppercase and lowercase letters</li>
                                  <li>Contains at least one number</li>
                                  <li>Contains at least one special character</li>
                                </ul>
                              </div>
                            `,
                            height: 120,
                            css: "info-box"
                          },
                          {
                            height: 20
                          },
                          {
                            template: "<div class='form-section-title'>Two-Factor Authentication</div>",
                            height: 40,
                            css: "form-section-header"
                          },
                          {
                            view: "checkbox",
                            label: "Enable Two-Factor Authentication",
                            name: "two_factor_enabled",
                            css: "modern-checkbox",
                            on: {
                              onChange: function() {
                                showChangeIndicator("two_factor_enabled");
                              }
                            }
                          },
                          {
                            template: `
                              <div class='info-box'>
                                <p>Two-factor authentication adds an extra layer of security to your account by requiring a second form of verification.</p>
                              </div>
                            `,
                            height: 60,
                            css: "info-box"
                          }
                        ]
                      },
                      {
                        height: 30
                      },
                      {
                        cols: [
                          {},
                          {
                            view: "button",
                            value: "Update Security",
                            minWidth: 120,  
                            height: 45,
                            css: "primary-button",
                            tooltip: "Update Security(alt+s)",
                            hotkey: "alt+s",
                            click: async function () {
                              await updateSecurity();
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  on: {
    onShow: function() {
      loadUserProfile();
      loadPersonalDetails();
      loadSecuritySettings();
    }
  }
};

// API Functions
async function loadUserProfile() {
  try {
    const token = getToken();
    if (!token) {
      webix.message({ type: "error", text: "Please log in to access your profile" });
      return;
    }

    const response = await apiService.get('/preference/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (response.data) {
      $$("profile_form").setValues(response.data);
      
      // Load profile image if exists
      if (response.data.profile_image) {
        document.getElementById("profile-img").src = response.data.profile_image;
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    if (error.response && error.response.status === 401) {
      webix.message({ type: "error", text: "Your session has expired. Please log in again." });
      // Redirect to login if main_content exists
      if ($$("main_content")) {
        $$("main_content").setValue("login");
      }
    } else {
      webix.message({ type: "error", text: "Failed to load profile" });
    }
  }
}

async function loadPersonalDetails() {
  try {
    const token = getToken();
    if (!token) return;

    const response = await apiService.get('/preference/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (response.data) {
      $$("personal_form").setValues(response.data);
    }
  } catch (error) {
    console.error('Error loading personal details:', error);
    webix.message({ type: "error", text: "Failed to load personal details" });
  }
}

async function loadSecuritySettings() {
  try {
    const token = getToken();
    if (!token) return;

    const response = await apiService.get('/preference/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (response.data) {
      // Only load non-password fields
      const securityData = {
        two_factor_enabled: response.data.two_factor_enabled || false
      };
      $$("security_form").setValues(securityData);
    }
  } catch (error) {
    console.error('Error loading security settings:', error);
    webix.message({ type: "error", text: "Failed to load security settings" });
  }
}

async function saveProfile() {
  try {
    const token = getToken();
    if (!token) {
      webix.message({ type: "error", text: "Please log in to save your profile" });
      return;
    }

    const form = $$("profile_form");
    if (!form.validate()) {
      webix.message({ type: "error", text: "Please fill all the fields!" });
      return;
    }
    
    const values = form.getValues();
    
    // Add profile image if uploaded
    // if (window.profileImageData) {
    //   values.profile_image = window.profileImageData;
    // }

    await apiService.put('/preference/', values, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    webix.message({ type: "success", text: "Profile updated successfully!" });
    clearChangeIndicators();
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('profileUpdated', {
      detail: {
        displayName: values.display_name,
        fullName: values.full_name
      }
    }));
  } catch (error) {
    console.error('Error saving profile:', error);
    if (error.response && error.response.status === 401) {
      webix.message({ type: "error", text: "Your session has expired. Please log in again." });
      if ($$("main_content")) {
        $$("main_content").setValue("login");
      }
    } else {
      webix.message({ type: "error", text: "Failed to save profile" });
    }
  }
}

async function savePersonalDetails() {
  try {
    const token = getToken();
    if (!token) {
      webix.message({ type: "error", text: "Please log in to save your details" });
      return;
    }

    const values = $$("personal_form").getValues();
    
    await apiService.put('/preference/', values, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    webix.message({ type: "success", text: "Personal details saved successfully!" });
    clearChangeIndicators();
  } catch (error) {
    console.error('Error saving personal details:', error);
    if (error.response && error.response.status === 401) {
      webix.message({ type: "error", text: "Your session has expired. Please log in again." });
      if ($$("main_content")) {
        $$("main_content").setValue("login");
      }
    } else {
      webix.message({ type: "error", text: "Failed to save personal details" });
    }
  }
}

async function updateSecurity() {
  try {
    const token = getToken();
    if (!token) {
      webix.message({ type: "error", text: "Please log in to update security settings" });
      return;
    }

    const form = $$("security_form");
    const values = form.getValues();
    
    // Validate password fields if they're filled
    if (values.current_password || values.new_password || values.confirm_password) {
      if (!form.validate()) {
        webix.message({ type: "error", text: "Please fix the errors in the form" });
        return;
      }
      
      if (values.new_password !== values.confirm_password) {
        webix.message({ type: "error", text: "Passwords do not match" });
        return;
      }
      
      if (values.new_password.length < 8) {
        webix.message({ type: "error", text: "Password must be at least 8 characters long" });
        return;
      }
    }

    // Prepare data for API
    const updateData = {
      two_factor_enabled: values.two_factor_enabled
    };

    // Add password fields only if they're provided
    if (values.current_password && values.new_password) {
      updateData.current_password = values.current_password;
      updateData.new_password = values.new_password;
    }

    await apiService.put('/preference/', updateData, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    webix.message({ type: "success", text: "Security settings updated successfully!" });
    
    // Clear password fields
    form.setValues({ 
      current_password: "", 
      new_password: "", 
      confirm_password: "",
      two_factor_enabled: values.two_factor_enabled
    });
    
    clearChangeIndicators();
  } catch (error) {
    console.error('Error updating security:', error);
    if (error.response && error.response.status === 401) {
      webix.message({ type: "error", text: "Your session has expired. Please log in again." });
      if ($$("main_content")) {
        $$("main_content").setValue("login");
      }
    } else {
      webix.message({ type: "error", text: "Failed to update security settings" });
    }
  }
}

// Utility Functions
function showChangeIndicator(fieldName) {
  // Add visual indicator for changed fields
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (field) {
    field.classList.add('changed');
  }
}

function clearChangeIndicators() {
  // Remove all change indicators
  const changedFields = document.querySelectorAll('.changed');
  changedFields.forEach(field => {
    field.classList.remove('changed');
  });
  
  // Clear profile image data
  window.profileImageData = null;
}

// Initialize styles
const style = document.createElement('style');
style.textContent = `
  .changed {
    border-color: #4CAF50 !important;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2) !important;
  }

  .change-indicator {
    position: absolute;
    right: -25px;
    top: 50%;
    transform: translateY(-50%);
    color: #4CAF50;
    font-size: 16px;
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-50%) scale(0.8); }
    to { opacity: 1; transform: translateY(-50%) scale(1); }
  }

  .modern-input, .modern-select, .modern-textarea {
    position: relative;
    transition: all 0.3s ease;
  }

  .modern-input:focus, .modern-select:focus, .modern-textarea:focus {
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }

  .profile-image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .profile-image-container {
    position: relative;
    cursor: pointer;
  }

  .profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e0e0e0;
  }

  .profile-image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .profile-image-container:hover .profile-image-overlay {
    opacity: 1;
  }

  .disabled-field {
    background-color: #f5f5f5 !important;
    cursor: not-allowed !important;
  }

  .info-box {
    background: #f0f8ff;
    border: 1px solid #e3f2fd;
    border-radius: 4px;
    padding: 15px;
    margin: 10px 0;
  }

  .password-requirements {
    font-size: 14px;
  }

  .password-requirements h4 {
    margin: 0 0 10px 0;
    color: #333;
  }

  .password-requirements ul {
    margin: 0;
    padding-left: 20px;
  }

  .password-requirements li {
    margin-bottom: 5px;
    color: #666;
  }

  .form-section-header {
    font-weight: bold;
    color: #333;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
  }
`;

if (!document.head.querySelector('style[data-account-styles]')) {
  style.setAttribute('data-account-styles', 'true');
  document.head.appendChild(style);
}