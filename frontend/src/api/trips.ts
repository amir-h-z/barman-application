import apiClient from './index';
import { Trip, TripFilters, TripStatus, RatingPayload } from '@/types';


export const getTrips = async (filters: TripFilters): Promise<Trip[]> => {
    try {
        const response = await apiClient.get('/trips', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
};


export const getTripDetails = async (tripId: string): Promise<Trip> => {
    try {
        const response = await apiClient.get(`/trips/${tripId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for trip ${tripId}:`, error);
        throw error;
    }
};


export const updateTripStatus = async (tripId: string, status: TripStatus): Promise<Trip> => {
    try {
        const response = await apiClient.patch(`/trips/${tripId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating status for trip ${tripId}:`, error);
        throw error;
    }
};


export const submitTripRating = async (tripId: string, ratingData: RatingPayload): Promise<{ message: string }> => {
    try {
        const response = await apiClient.post(`/trips/${tripId}/rate`, ratingData);
        return response.data;
    } catch (error) {
        console.error(`Error submitting rating for trip ${tripId}:`, error);
        throw error;
    }
};