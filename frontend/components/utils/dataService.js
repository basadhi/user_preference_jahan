import { apiService } from './apiService.js';

export async function authenticateUser(email, password) {
  try {
    const response = await apiService.post('/login/', {
      email: email,
      password: password
    });
    
    if (response.token) {
     
      localStorage.setItem('authToken', response.token);
      
     
      const userData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        username: response.user.username
      };
      
      localStorage.setItem('loggedUser', JSON.stringify(userData));
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.response) {
      if (error.response.status === 401) {
        return 'invalid_password';
      } else if (error.response.status === 404) {
        return null; // User not found
      }
    }
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const response = await apiService.post('/signup/', {
      email: userData.email,
      password: userData.password,
      password2: userData.password, // For confirmation
      first_name: userData.first_name,
      last_name: userData.last_name
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      return response.user;
    }
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.email || error.response.data.password || 'Registration failed');
    }
    throw error;
  }
} 