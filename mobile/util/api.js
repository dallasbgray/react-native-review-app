import { AsyncStorage } from 'react-native';
import { navigate } from './NavigationService';

const AUTH_TOKEN = 'ReviewApp::AUTH_TOKEN';
//const BASE_URL = "http://localhost:3000";
//const BASE_URL = "http://10.0.0.134:3000";
//const BASE_URL = "http://73.169.45.200:3000";
const BASE_URL = "http://192.168.1.179:3000";

export const saveAuthToken = token => {
  if (!token) {
    return AsyncStorage.removeItem(AUTH_TOKEN);
  }

  return AsyncStorage.setItem(AUTH_TOKEN, token);
};

export const hasAuthToken = () => {
  return AsyncStorage.getItem(AUTH_TOKEN).then(token => {
    if (token) {
      return true;
    }

    return false;
  });
};

export const reviewApi = (path, options = {}) => {
  return AsyncStorage.getItem(AUTH_TOKEN).then(token => {
    const completeOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      completeOptions.headers.authorization = `Bearer ${token}`;
    }

    return fetch(`${BASE_URL}/api${path}`, completeOptions).then(async res => {
      const responseJson = await res.json();

      if (res.ok) {
        return responseJson;
      }

      if (res.status === 401) {
        navigate('Auth');
        saveAuthToken();
      }

      throw new Error(responseJson.error);
    })
      .catch(error => {
        // Log to sentry
        console.warn('ERROR: ', `${BASE_URL}/api${path}`, error);

        throw new Error(error);
      });
  });
};