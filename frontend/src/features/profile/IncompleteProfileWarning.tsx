import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { UserRole } from "@/types"; // فرض می‌شود این تایپ تعریف شده است

interface IncompleteProfileWarningProps {
    userRole: UserRole;
    onGoToProfile: () => void;
}

// آبجکتی برای نگهداری پیام‌های مختلف بر اساس نقش کاربر
const MESSAGES = {
    driver: {
        title: "اطلاعات پروفایل ناقص است",
        description: "برای مشاهده بارها و شروع سفر، ابتدا باید اطلاعات شخصی و گواهینامه خود را در حساب کاربری تکمیل کنید.",
    },
    'cargo-owner': {
        title: "اطلاعات شما ناقص است",
        description: "برای ثبت بار جدید و مشاهده درخواست‌ها، لطفاً اطلاعات شخصی خود را در حساب کاربری تکمیل نمایید.",
    },
    'transport-company': {
        title: "پروفایل شرکت ناقص است",
        description: "برای استفاده از امکانات سامانه، ابتدا باید اطلاعات شرکت و آدرس خود را در حساب کاربری تکمیل کنید.",
    },
};

export function IncompleteProfileWarning({ userRole, onGoToProfile }: IncompleteProfileWarningProps) {
    const messages = MESSAGES[userRole] || MESSAGES['cargo-owner']; // استفاده از یک پیام پیش‌فرض

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-sm text-center">
                <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <CardTitle>{messages.title}</CardTitle>
                    <CardDescription className="leading-relaxed pt-2">
                        {messages.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onGoToProfile} className="w-full">
                        تکمیل اطلاعات حساب کاربری
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}