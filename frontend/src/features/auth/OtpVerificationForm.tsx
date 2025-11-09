import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LoadingDots } from "@/components/shared/LoadingDots";
import barmanLogo from '@/assets/barman-logo.png';
import { toast } from "sonner";

interface OtpVerificationFormProps {
    identifier: string; // شماره تلفن یا ایمیل
    onVerify: (otp: string) => void;
    onBack: () => void;
    isLoading: boolean;
}

export function OtpVerificationForm({ identifier, onVerify, onBack, isLoading }: OtpVerificationFormProps) {
    const [code, setCode] = useState<string[]>(['', '', '', '', '']);
    const [error, setError] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(120);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // افکت برای مدیریت تایمر
    useEffect(() => {
        if (timeLeft === 0) return;
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    // افکت برای فوکوس خودکار روی اولین اینپوت
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // افکت برای ارسال خودکار کد پس از پر شدن تمام فیلدها
    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            const otp = code.join('');
            if (otp === '00000') {
                setError('کد وارد شده نامعتبر است');
            } else {
                onVerify(otp);
            }
        }
    }, [code, onVerify]);

    const handleCodeChange = (index: number, value: string) => {
        const persianToEnglish = (str: string) => {
            const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
            const englishDigits = '0123456789';
            return str.replace(/[۰-۹]/g, (w) => englishDigits[persianDigits.indexOf(w)]);
        };

        const numericValue = persianToEnglish(value).replace(/\D/g, '');

        if (numericValue.length <= 1) {
            const newCode = [...code];
            newCode[index] = numericValue;
            setCode(newCode);

            if (error) setError('');

            // حرکت به فیلد بعدی
            if (numericValue && index < 4) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            // حرکت به فیلد قبلی
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendCode = () => {
        if (timeLeft === 0) {
            setTimeLeft(120);
            setCode(['', '', '', '', '']);
            setError('');
            inputRefs.current[0]?.focus();
            toast.success("کد تایید مجدداً ارسال شد");
            // در اینجا باید تابع API برای ارسال مجدد کد فراخوانی شود
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isSubmitDisabled = !code.every(digit => digit !== '') || isLoading;

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
                        <h2 className="text-2xl font-medium text-foreground">کد تایید</h2>
                        <p className="text-muted-foreground">کد ۵ رقمی ارسال شده به {identifier} را وارد کنید.</p>
                        <Button variant="link" onClick={onBack} className="text-sm p-0 h-auto">
                            تغییر شماره یا ایمیل
                        </Button>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="flex justify-between items-center w-full gap-3" dir="ltr">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <div key={index} className="flex-1 relative">
                                    <input
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={code[index]}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-full bg-transparent border-0 outline-0 text-center text-xl font-bold py-3 px-0"
                                        disabled={isLoading}
                                    />
                                    <div className="relative h-0.5 bg-border overflow-hidden">
                                        <div
                                            className={`absolute inset-0 bg-foreground transition-transform duration-300 origin-center ${code[index] ? 'scale-x-100' : 'scale-x-0'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {error && <p className="text-sm text-destructive text-right mt-2">{error}</p>}
                    </div>

                    <div className="text-right mt-6">
                        {timeLeft > 0 ? (
                            <p className="text-sm text-muted-foreground">ارسال مجدد کد تا {formatTime(timeLeft)}</p>
                        ) : (
                            <div className="text-sm">
                                <span className="text-muted-foreground">کدی دریافت نکردید؟ </span>
                                <Button variant="link" onClick={handleResendCode} className="p-0 h-auto font-medium">
                                    ارسال مجدد کد
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 mt-auto bg-white sticky bottom-0">
                <div className="w-full max-w-md mx-auto">
                    <Button
                        onClick={() => onVerify(code.join(''))}
                        className="w-full h-12"
                        disabled={isSubmitDisabled}
                    >
                        {isLoading ? <LoadingDots /> : 'ورود'}
                    </Button>
                </div>
            </div>
        </div>
    );
}