import { parseISO } from 'date-fns-jalali';

/**
 * یک تاریخ (آبجکت Date یا رشته ISO) را به فرمت شمسی 'yyyy/MM/dd' تبدیل می‌کند.
 * @param {Date | string} date - تاریخ ورودی
 * @returns {string} - رشته تاریخ فرمت شده
 */
export const formatDateToPersian = (date: Date | string): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        // 'u-nu-latn' باعث می‌شود اعداد به صورت انگلیسی (لاتین) نمایش داده شوند
        return dateObj.toLocaleDateString('fa-IR-u-nu-latn', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\//g, '/'); // اطمینان از فرمت اسلش
    } catch (error) {
        console.error("خطا در فرمت‌دهی تاریخ:", error);
        return '-';
    }
};

/**
 * یک تاریخ را به فرمت زمان 'HH:mm' تبدیل می‌کند.
 * @param {Date | string} date - تاریخ ورودی
 * @returns {string} - رشته زمان فرمت شده
 */
export const formatTimeToHM = (date: Date | string): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return dateObj.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    } catch (error) {
        console.error("خطا در فرمت‌دهی زمان:", error);
        return '-';
    }
};

/**
 * بررسی می‌کند که آیا یک تاریخ منقضی شده است یا خیر.
 * @param {Date | string} date - تاریخ ورودی
 * @returns {boolean} - `true` اگر تاریخ در گذشته باشد
 */
export const isDateExpired = (date: Date | string): boolean => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        // زمان را صفر می‌کنیم تا فقط روزها مقایسه شوند
        today.setHours(0, 0, 0, 0);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj < today;
    } catch (error) {
        console.error("خطا در بررسی انقضای تاریخ:", error);
        return false;
    }
};

/**
 * اعداد فارسی یا عربی در یک رشته را به انگلیسی تبدیل می‌کند.
 * این تابع در تمام فیلدهای ورودی عددی استفاده می‌شود.
 * @param {string} str - رشته ورودی
 * @returns {string} - رشته با اعداد انگلیسی
 */
export const convertPersianToEnglishDigits = (str: string): string => {
    if (!str) return '';
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
    const englishDigits = '0123456789';

    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)])
        .replace(/[٠-٩]/g, (char) => englishDigits[arabicDigits.indexOf(char)]);
};

/**
 * یک رشته عددی را به فرمت شماره تلفن (xxxx xxx xxxx) در می‌آورد.
 * @param {string} phone - شماره تلفن بدون فرمت
 * @returns {string} - شماره تلفن فرمت شده
 */
export const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = convertPersianToEnglishDigits(phone).replace(/\D/g, '');
    if (cleanPhone.length !== 11) return phone;

    return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
};

/**
 * یک رشته عددی را به فرمت شماره شبا (IRxx xxxx ....) در می‌آورد.
 * @param {string} iban - شماره شبا بدون فرمت
 * @returns {string} - شماره شبا فرمت شده
 */
export const formatIban = (iban: string): string => {
    const cleanIban = iban.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanIban.startsWith('IR') || cleanIban.length !== 26) return iban;

    return `IR${cleanIban.slice(2).replace(/(.{4})/g, '$1 ').trim()}`;
};