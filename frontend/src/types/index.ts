// تعریف نقش‌های کاربری در برنامه
export type UserRole = 'driver' | 'cargo-owner' | 'transport-company';

// اطلاعات پایه کاربر که پس از لاگین دریافت می‌شود
export interface User {
    id: string;
    phone?: string;
    email?: string;
    companyId?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    role: UserRole;
    isProfileComplete: boolean;
    avatar?: string;
}

// اطلاعات کامل پروفایل کاربر (شامل تمام فیلدهای ممکن برای همه نقش‌ها)
export interface UserProfile extends User {
    nationalId?: string;
    address?: {
        province: string;
        city: string;
        line: string;
        postalCode?: string;
    };
    // فیلدهای مخصوص راننده
    licenseNumber?: string;
    licenseType?: string;
    licenseIssueDate?: string;
    licenseExpiry?: string;
    smartCardNumber?: string;
    smartCardIssueDate?: string;
    vehicle?: {
        model: string;
        year: string;
        plateNumber: string;
        capacity: number;
    };
    patoghDrivers?: { id: string; name: string; code: string }[];
}

// اطلاعات یک بار
export interface Load {
    id: string;
    cargoType: string;
    price: number;
    weight: number;
    truckType: string;
    origin: string;
    destination: string;
    originProvince: string;
    destinationProvince: string;
    originAddress?: string;
    destinationAddress?: string;
    description: string;
    date: string; // تاریخ بارگیری
    ownerName: string;
    truckCount?: number;
    remainingCapacity?: number;
    coordinates: {
        origin: { lat: number; lng: number };
        destination: { lat: number; lng: number };
    };
    // فیلدهای اضافی که در کدهای اصلی بودند
    sender?: { firstName: string; lastName: string; phone: string } | 'self';
    receiver?: { firstName: string; lastName: string; phone: string } | 'self';
    isSenderMyself?: boolean;
    isReceiverMyself?: boolean;
    loadingDate?: string;
    loadingTime?: string;
}

// اطلاعات یک سفر (باری که در حال حمل یا تکمیل شده است)
export interface Trip {
    id: string;
    cargoType: string;
    price: number;
    origin: string;
    destination: string;
    weight: number;
    truckType: string;
    date: string; // تاریخ شروع
    deliveryDate?: string;
    status: 'ongoing' | 'completed' | 'cancelled';
    progress?: number;
    cargoOwnerName?: string;
    driverName?: string;
    transportCompany?: string;
    billOfLadingNumber?: string;
    loadingCode?: string;
    // اطلاعات تکمیلی برای صفحه جزئیات
    originCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
    originAddress?: string;
    destinationAddress?: string;
    receiverName?: string;
    receiverPhone?: string;
}

// اطلاعات یک حساب بانکی
export interface BankAccount {
    id: string;
    iban: string;
    bankName: string;
    isActive: boolean;
}

// اطلاعات موجودی کیف پول
export interface WalletBalance {
    amount: number;
    currency: 'IRT' | 'IRR';
}

// اطلاعات یک تراکنش
export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    status: 'completed' | 'pending';
}

// اطلاعات یک گفتگو در چت
export interface Conversation {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isOnline: boolean;
    userType: UserRole;
}

// اطلاعات یک پیام در چت
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}