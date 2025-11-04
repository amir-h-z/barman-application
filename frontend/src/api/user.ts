import apiClient from './index';
import { UserProfile } from '@/types';

export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const response = await apiClient.get<UserProfile>('/users/me/profile');
        return response.data;
    } catch (error) {
        console.error('خطا در دریافت اطلاعات پروفایل کاربر:', error);
        throw error;
    }
};


export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
        const response = await apiClient.put<UserProfile>('/users/me/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('خطا در به‌روزرسانی پروفایل کاربر:', error);
        throw error;
    }
};


export const uploadProfileDocument = async (type: string, file: File): Promise<{ message: string; filePath: string }> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await apiClient.post('/users/me/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`خطا در آپلود فایل ${type}:`, error);
        throw error;
    }
};


export const addPatoghDriver = async (driverCode: string): Promise<{ id: string; name: string; code: string }> => {
    try {
        const response = await apiClient.post('/users/me/patogh-drivers', { driverCode });
        return response.data;
    } catch (error) {
        console.error('خطا در افزودن راننده پاتوقی:', error);
        throw error;
    }
};


export const removePatoghDriver = async (driverId: string): Promise<{ message: string }> => {
    try {
        const response = await apiClient.delete(`/users/me/patogh-drivers/${driverId}`);
        return response.data;
    } catch (error) {
        console.error(`خطا در حذف راننده پاتوقی با شناسه ${driverId}:`, error);
        throw error;
    }
};