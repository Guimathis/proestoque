import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

// Use o IP da sua máquina local na rede para que o Expo Go no celular consiga acessar a API
const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333/api';

export const api = axios.create({
  baseURL,
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}> = [];

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('@Proestoque:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (!originalConfig._retry && !originalConfig.url?.includes('/auth/refresh')) {
        originalConfig._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = await AsyncStorage.getItem('@Proestoque:refreshToken');

          if (!refreshToken) {
            isRefreshing = false;
            return Promise.reject(error);
          }

          try {
            const response = await axios.post(`${baseURL}/auth/refresh`, {
              refreshToken,
            });

            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            await AsyncStorage.setItem('@Proestoque:token', newToken);
            await AsyncStorage.setItem('@Proestoque:refreshToken', newRefreshToken);

            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

            failedRequestsQueue.forEach((request) => request.onSuccess(newToken));
            failedRequestsQueue = [];

            if (originalConfig.headers) {
              originalConfig.headers.Authorization = `Bearer ${newToken}`;
            }
            return api(originalConfig);
          } catch (err) {
            failedRequestsQueue.forEach((request) => request.onFailure(err as AxiosError));
            failedRequestsQueue = [];

            await AsyncStorage.removeItem('@Proestoque:token');
            await AsyncStorage.removeItem('@Proestoque:refreshToken');
            await AsyncStorage.removeItem('@Proestoque:user');

            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              if (originalConfig.headers) {
                originalConfig.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }
    }

    return Promise.reject(error);
  }
);
