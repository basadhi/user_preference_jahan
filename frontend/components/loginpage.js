import { authenticateUser } from "./utils/dataService.js";
import {applyPreferences} from "./forms/theme.js";

if (!window.showView) {
    window.showView = function(viewId) {
        $$("main_content").setValue(viewId);
    };
}

export const LoginPage = {
  id: "login",
  type: "space",
  rows:[ {gravity:1},
  {
  cols: [
    {
      gravity: 1,
    },
    {
      view: "form",
      id: "login_page_form",
      borderless: true,
      width: Math.min(window.innerWidth * 0.8, 400),
      elements: [
        {
          view: "toolbar",
          height: 50,
          borderless: true,
          elements: [
            {
                view: "button",
                type: "icon",
                icon: "mdi mdi-arrow-left",
                width: 40,
                css: "transparent-button",
                click: function() {
                  showView("home_ui");
                }
              },
            {
              view: "label",
              label: "Log in / Sign in",
              align: "center",
            },
            {
                view: "button",
                type: "icon",
                icon: "mdi mdi-home",    
                tooltip: "Go to Home Page",
                width: 40,               
                click: function () {
                  try {
                    showView("home_ui");
                  } catch (error) {
                    console.error("Navigation error:", error);
                    
                  }
                },
              }
          ],
        },
        {
          view: "text",
          name: "email",
          placeholder: "Email",
          required: true,
          validate: webix.rules.isEmail,
          invalidMessage: "Please enter a valid email address",
        },
        {
          view: "text",
          type: "password",
          name: "password",
          placeholder: "Password",
          required: true,
          invalidMessage: "Password cannot be empty",
        },
        {
          view: "template",
          template: "<a href='#' class='forgot-password'>Forgot Password?</a>",
          height: 40,
          borderless: true,
          onClick: {
            "forgot-password": function () {
              // showView("forgotpassword");
            },
          },
        },
        {
          view: "button",
          value: "Log in",
          hotkey: "enter",
          height: 50,
          click: async function () {
            const form = $$("login_page_form");

            if (!form.validate()) {
              webix.message({
                type: "error",
                text: "Please enter valid details.",
              });
              return;
            }

            const values = form.getValues();
            // Show loading indicator
            webix.message({type:"info", text:"Logging in...", expire: 1000});
            
            try {
              const result = await authenticateUser(values.email, values.password);
              console.log("Authentication result:", result);

              // Handle different response formats from your authenticateUser function
              let user, preferences;
              
              if (result && typeof result === 'object') {
                if (result.user && result.preferences) {
                  // If result has both user and preferences
                  user = result.user;
                  preferences = result.preferences;
                } else if (result.id || result.email) {
                  // If result is the user object directly
                  user = result;
                  preferences = result.preferences || null;
                } else {
                  user = result;
                }
              } else {
                user = result;
              }

              if (user === null) {
                webix.modalbox({
                  title: "Not Registered",
                  text: "You are not registered. Redirecting to Sign Up page...",
                  buttons: ["OK"],
                  callback: function (result) {
                      showView("signup");
                  }
                });
              } else if (user === "invalid_password") {
                webix.message({
                  type: "error",
                  text: "Invalid email or password.",
                  expire: 3000
                });
              } else if (user && (user.id || user.email)) {
                // Successful login
                webix.message({ 
                  type: "success", 
                  text: "Login successful!",
                  expire: 2000
                });

                const savedPrefs = preferences;
                      if (savedPrefs) {
                        applyPreferences(savedPrefs);

                        // Optional: save individual keys in localStorage if used elsewhere
                        localStorage.setItem("theme", savedPrefs.theme);
                        localStorage.setItem("fontFamily", savedPrefs.font_family);
                        localStorage.setItem("primaryColor", savedPrefs.primary_color);
                        localStorage.setItem("animations", savedPrefs.animations_enabled.toString());
                      }


                sessionStorage.setItem("currentLoggedin", JSON.stringify({ 
                  email: user.email || values.email 
                }));

                localStorage.setItem("loggedUser", JSON.stringify({
                      "id": user.id,
                      "username": user.username,
                      "email": user.email,
                      "firstName": user.firstName,
                      "lastName": user.lastName
                      
                  }));

                localStorage.setItem("loginResponse", JSON.stringify(user));
                if (user.token || user.auth_token || user.access_token) {
                        localStorage.setItem("authToken", user.token || user.auth_token || user.access_token);
                      }
      

                try {
    
                const preferences = await fetchUserPreferences(user.id);
                if (preferences) {
                  localStorage.setItem("preferences", JSON.stringify(preferences));
                }
              } catch (error) {
                console.warn("Failed to fetch preferences:", error);
              }
               
                
                // Navigate to home page after a short delay
                setTimeout(() => {
                  showView("home_ui");
                  location.reload();
                }, 1000);
              } else {
                // Unknown response format
                console.error("Unexpected user data format:", user);
                webix.message({
                  type: "error",
                  text: "Login failed. Unexpected response format.",
                  expire: 3000
                });
              }
            } catch (error) {
              console.error("Login Error:", error);
              let errorMessage = "Login failed. Please try again.";
              
              if (error.response && error.response.data) {
                if (typeof error.response.data === 'string') {
                  errorMessage = error.response.data;
                } else if (error.response.data.message) {
                  errorMessage = error.response.data.message;
                } else if (error.response.data.non_field_errors) {
                  errorMessage = error.response.data.non_field_errors[0];
                } else if (error.response.data.detail) {
                  errorMessage = error.response.data.detail;
                }
              } else if (error.message) {
                errorMessage = error.message;
              }
              
              webix.message({
                type: "error",
                text: errorMessage,
                expire: 4000
              });
            }
          },
        },
        { height: 15 },
        {
          view: "template",
          template:
            "<div class='signup-text'>Create an Account. <a href='#' class='signup-link'>Sign up</a></div>",
          height: 40,
          borderless: true,
          onClick: {
            "signup-link": function () {
              showView("signup");
            },
          },
        },
        {gravity: 1},
      ],
    },
    {
      gravity: 1,
    },
  ],
},
{
  gravity:1
}
],
};