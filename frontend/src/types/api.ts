// فیلترهای قابل اعمال روی لیست بارها
export interface LoadFilters {
    dateRange?: { from?: Date; to?: Date };
    priceRange?: [number, number];
    truckType?: string;
    cargoType?: string;
    weightRange?: [number, number];
    origin?: string;
    destination?: string;
}

// داده‌های مورد نیاز برای ایجاد یک بار جدید
export type NewLoadData = Omit<Load, 'id' | 'ownerName' | 'coordinates' | 'date'> & {
    // در API، آدرس‌ها به صورت تودرتو ارسال می‌شوند
    origin: { province: string; city: string; address: string };
    destination: { province: string; city: string; address: string };
};

// فیلترهای قابل اعمال روی لیست سفرها
export interface TripFilters {
    status?: 'ongoing' | 'completed' | 'cancelled';
    search?: string;
}

// نوع وضعیت سفر برای به‌روزرسانی
export type TripStatus = 'loading' | 'in-transit' | 'delivery' | 'completed';

// داده‌های مورد نیاز برای ثبت امتیاز
export interface RatingPayload {
    targetUserId: string;
    rating: number;
    comment?: string;
    positiveTags?: string[];
    negativeTags?: string[];
}

// فیلترهای قابل اعمال روی لیست تراکنش‌ها
export interface TransactionFilters {
    type?: 'income' | 'expense';
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
}