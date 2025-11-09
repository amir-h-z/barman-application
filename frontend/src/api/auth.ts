import apiClient from './index';
import type { User } from '@/types';


export const loginRequest = async (identifier: string, role: string): Promise<{ message: string }> => {
    try {
        const response = await apiClient.post('/auth/login', { identifier, role });
        return response.data;
    } catch (error) {
        console.error('Error during login request:', error);
        throw error;
    }
};


export const verifyOtp = async (identifier: string, otp: string): Promise<{ user: User; token: string }> => {
    try {
        const response = await apiClient.post('/auth/verify', { identifier, otp });

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error('Error during OTP verification:', error);
        throw error;
    }
};


export const getMe = async (): Promise<User> => {
    try {
        const response = await apiClient.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
};