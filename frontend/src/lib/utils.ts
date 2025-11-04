import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * یک تابع کمکی برای ترکیب شرطی و بهینه کلاس‌های Tailwind CSS.
 * این تابع ابتدا کلاس‌ها را با `clsx` ترکیب کرده و سپس با `tailwind-merge`
 * تداخل‌ها را برطرف می‌کند تا استایل نهایی همیشه صحیح باشد.
 * @param {...ClassValue[]} inputs - لیستی از کلاس‌ها (رشته، آبجکت یا آرایه)
 * @returns {string} - رشته نهایی و بهینه شده کلاس‌ها
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}