import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { ArrowRight } from "lucide-react";
import barmanLogo from '@/assets/barman-logo.png';

interface PhoneInputFormProps {
    onSubmit: (phone: string) => void;
    onBack: () => void;
}

export function PhoneInputForm({ onSubmit, onBack }: PhoneInputFormProps) {
    const [phone, setPhone] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const formatPhoneNumber = (value: string): string => {
        const persianToEnglish = (str: string) => {
            const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
            const englishDigits = '0123456789';
            return str.replace(/[۰-۹]/g, (w) => englishDigits[persianDigits.indexOf(w)]);
        };

        const numericValue = persianToEnglish(value).replace(/\D/g, '');

        if (numericValue.length <= 4) return numericValue;
        if (numericValue.length <= 7) return `${numericValue.slice(0, 4)} ${numericValue.slice(4)}`;
        if (numericValue.length <= 11) return `${numericValue.slice(0, 4)} ${numericValue.slice(4, 7)} ${numericValue.slice(7)}`;
        return `${numericValue.slice(0, 4)} ${numericValue.slice(4, 7)} ${numericValue.slice(7, 11)}`;
    };

    const getCleanPhoneNumber = (formatted: string): string => {
        return formatted.replace(/\s/g, '');
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        if (getCleanPhoneNumber(formatted).length <= 11) {
            setPhone(formatted);
        }
    };

    const handleSubmit = async () => {
        const cleanPhone = getCleanPhoneNumber(phone);
        if (cleanPhone.length !== 11) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        onSubmit(cleanPhone);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const isSubmitDisabled = getCleanPhoneNumber(phone).length !== 11 || isLoading;

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
            <div className="flex flex-col gap-9">
                <div className="flex items-center justify-between p-4">
                    <Button variant="ghost" onClick={onBack} className="w-10 h-10 hover:bg-muted">
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex flex-col items-center">
                    <img src={barmanLogo} alt="بارمن" className="w-25 h-25 object-contain rounded-2xl" />
                    <h1 className="text-3xl font-bold text-foreground mt-2">بارمن</h1>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-6">
                <div className="w-full max-w-md mx-auto">
                    <div className="text-right space-y-3 mt-16">
                        <h2 className="text-2xl font-medium text-foreground">شماره موبایل</h2>
                        <p className="text-muted-foreground">لطفا شماره همراه خود را وارد کنید.</p>
                    </div>

                    <div className="mt-12">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="numeric"
                                placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                                value={phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="w-full bg-transparent border-0 outline-0 text-center text-lg tracking-wider py-3 px-0 placeholder:text-muted-foreground placeholder:text-center"
                                dir="ltr"
                                maxLength={13}
                            />
                            <div className="relative h-0.5 bg-border overflow-hidden">
                                <div
                                    className={`absolute inset-0 bg-foreground transition-transform duration-300 origin-center ${
                                        isFocused ? 'scale-x-100' : 'scale-x-0'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 mt-auto bg-white sticky bottom-0">
                <div className="w-full max-w-md mx-auto">
                    <Button
                        onClick={handleSubmit}
                        className="w-full h-12"
                        disabled={isSubmitDisabled}
                    >
                        {isLoading ? <LoadingDots /> : 'ارسال کد'}
                    </Button>
                </div>
            </div>
        </div>
    );
}