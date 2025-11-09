import apiClient from './index';
import type { Load } from '@/types';
import type { LoadFilters, NewLoadData } from '@/types';


export const getAvailableLoads = async (filters: LoadFilters): Promise<Load[]> => {
    try {
        const response = await apiClient.get('/loads', {
            params: filters,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching available loads:', error);
        throw error;
    }
};


export const getLoadDetails = async (loadId: string): Promise<Load> => {
    try {
        const response = await apiClient.get(`/loads/${loadId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for load ${loadId}:`, error);
        throw error;
    }
};


export const createLoad = async (loadData: NewLoadData): Promise<Load> => {
    try {
        const response = await apiClient.post('/loads', loadData);
        return response.data;
    } catch (error) {
        console.error('Error creating new load:', error);
        throw error;
    }
};


export const applyForLoad = async (loadId: string): Promise<{ message: string }> => {
    try {
        const response = await apiClient.post(`/loads/${loadId}/apply`);
        return response.data;
    } catch (error) {
        console.error(`Error applying for load ${loadId}:`, error);
        throw error;
    }
};