import type { Load, Trip } from '@/types';

export const MOCK_LOADS: Load[] = [
    {
        id: '1', cargoType: 'کاشی و سرامیک', price: 25000000, weight: 22, truckType: 'تریلی کفی',
        origin: 'یزد', destination: 'تهران', originProvince: 'یزد', destinationProvince: 'تهران',
        description: 'بارگیری فوری، نیاز به راننده مجرب.', date: '1403/09/20', ownerName: 'شرکت کاشی نمونه',
        coordinates: { origin: { lat: 31.8974, lng: 54.3675 }, destination: { lat: 35.6892, lng: 51.3890 } }
    },
    {
        id: '2', cargoType: 'مواد غذایی', price: 18000000, weight: 10, truckType: 'کامیون یخچال‌دار',
        origin: 'شیراز', destination: 'اصفهان', originProvince: 'فارس', destinationProvince: 'اصفهان',
        description: 'حمل مواد غذایی فاسد شدنی.', date: '1403/09/21', ownerName: 'کارخانه لبنیات پاک',
        coordinates: { origin: { lat: 29.5918, lng: 52.5837 }, destination: { lat: 32.6539, lng: 51.6660 } }
    },
];

export const MOCK_ONGOING_TRIPS: Trip[] = [
    { id: 't1', cargoType: 'میلگرد', price: 30000000, origin: 'اصفهان', destination: 'مشهد', weight: 24, truckType: 'تریلی کفی', date: '1403/09/18', status: 'ongoing', progress: 65, cargoOwnerName: 'فولاد مبارکه', originCoords: { lat: 32.6539, lng: 51.6660 }, destinationCoords: { lat: 36.2605, lng: 59.6168 } },
];

export const MOCK_COMPLETED_TRIPS: Trip[] = [
    { id: 't2', cargoType: 'گندم', price: 22000000, origin: 'اهواز', destination: 'تهران', weight: 25, truckType: 'کمپرسی', date: '1403/09/12', deliveryDate: '1403/09/15', status: 'completed', cargoOwnerName: 'شرکت غلات ایران', originCoords: { lat: 31.3183, lng: 48.6706 }, destinationCoords: { lat: 35.6892, lng: 51.3890 } },
];

export const MOCK_REQUEST_LOADS: Load[] = [ MOCK_LOADS[0] ];
export const MOCK_REJECTED_LOADS: Load[] = [ MOCK_LOADS[1] ];

export const MOCK_SINGLE_TRIP: Trip = MOCK_ONGOING_TRIPS[0];

export const MOCK_DRIVER_TRANSACTIONS = [];
export const MOCK_CARGO_OWNER_TRANSACTIONS = [];