// utils/dataService.js

// Base API service
export const apiService = {
    baseUrl: "http://127.0.0.1:8000", // Django backend URL
    
    async request(endpoint, method = "GET", data = null) {
      const url = this.baseUrl + endpoint;
      const headers = {
        "Content-Type": "application/json"
      };
      
      // Add authorization header if token exists
      const token = localStorage.getItem("authToken");
      if (token) {
        headers["Authorization"] = `Token ${token}`;  // Django REST framework uses Token auth
      }
      
      const options = {
        method,
        headers
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      try {
        const response = await fetch(url, options);
        
        // Parse JSON response if available
        let responseData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
        
        // Handle API error responses
        if (!response.ok) {
          const error = new Error(responseData.message || "API request failed");
          error.response = {
            status: response.status,
            data: responseData
          };
          throw error;
        }
        
        return responseData;
      } catch (error) {
        console.error("API Request Error:", error);
        throw error;
      }
    },
    
    get(endpoint) {
      return this.request(endpoint);
    },
    
    post(endpoint, data) {
      return this.request(endpoint, "POST", data);
    },
    
    put(endpoint, data) {
      return this.request(endpoint, "PUT", data);
    },
    
    delete(endpoint) {
      return this.request(endpoint, "DELETE");
    }
  };
  
  /**
   * Authenticate user with Django backend
   * @param {string} email User's email
   * @param {string} password User's password
   * @returns {Promise<Object|null>} User data if authenticated, null if not found, "invalid_password" if incorrect password
   */
  export async function authenticateUser(email, password) {
    try {
      const response = await apiService.post('/login/', {
        email: email,
        password: password
      });
      
      // If login is successful, store the token
      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
        
        // Store user data
        const userData = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          username: response.user.username
        };
        
        localStorage.setItem("loggedUser", JSON.stringify(userData));
        return userData;
      }
      
      return null;
    } catch (error) {
      // Check specific error cases
      if (error.response && error.response.status === 401) {
        return "invalid_password";
      }
      
      // Re-throw for other errors
      throw error;
    }
  }
  
  /**
   * Register a new user
   * @param {object} userData User registration data
   * @returns {Promise<Object>} Registered user data
   */
  export async function registerUser(userData) {
    try {
      const response = await apiService.post('/signup/', {
        username: userData.email, // Using email as username
        email: userData.email,
        password: userData.password,
        password2: userData.password, // Confirm password field required by Django
        first_name: userData.firstName || "",
        last_name: userData.lastName || ""
      });
      
      // Store the token on successful registration
      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
      }
      
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }
  
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  export async function getUserProfile() {
    try {
      return await apiService.get('/profile/');
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
  
  /**
   * Logout the current user
   * @returns {Promise<Object>} Logout response
   */
  export async function logoutUser() {
    try {
      const response = await apiService.post('/logout/');
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedUser");
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }