import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserProfileItemProps {
    name: string;
    avatar?: string;
    size?: 'sm' | 'md' | 'lg';
    showStatus?: boolean;
    isOnline?: boolean;
    className?: string;
    userType?: 'cargo-owner' | 'driver' | 'transport-company';
}

// تابع کمکی برای تعیین رنگ‌ها بر اساس نوع کاربر
const getUserTypeColors = (type: 'cargo-owner' | 'driver' | 'transport-company') => {
    switch (type) {
        case 'cargo-owner':
            return {
                bgColor: '#F7EDFE', // بنفش روشن
                textColor: '#8E4EC6', // بنفش تیره
            };
        case 'driver':
            return {
                bgColor: '#EDF2FE', // آبی روشن
                textColor: '#3E63DD', // آبی تیره
            };
        case 'transport-company':
            return {
                bgColor: '#FFEFD6', // نارنجی روشن
                textColor: '#F76B15', // نارنجی تیره
            };
        default:
            return {
                bgColor: '#F7EDFE',
                textColor: '#8E4EC6',
            };
    }
};

export function UserProfileItem({
                                    name,
                                    avatar,
                                    size = 'md',
                                    showStatus = false,
                                    isOnline = false,
                                    className = '',
                                    userType = 'cargo-owner' // مقدار پیش‌فرض
                                }: UserProfileItemProps) {

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const colors = getUserTypeColors(userType);

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative flex-shrink-0">
                <Avatar className={sizeClasses[size]}>
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback
                        style={{
                            backgroundColor: colors.bgColor,
                            color: colors.textColor,
                            fontSize: size === 'sm' ? '0.875rem' : '1rem'
                        }}
                    >
                        {/* نمایش حرف اول نام و نام خانوادگی */}
                        {name?.split(' ').slice(0, 2).map(n => n[0]).join('') || name[0]}
                    </AvatarFallback>
                </Avatar>
                {showStatus && (
                    <div className={cn(
                        "absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-background",
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                    )}></div>
                )}
            </div>
            <div className="flex-1 min-w-0 text-right">
                <h3 className="font-medium truncate">{name}</h3>
                {showStatus && (
                    <p className="text-sm text-muted-foreground">
                        {isOnline ? 'آنلاین' : 'آفلاین'}
                    </p>
                )}
            </div>
        </div>
    );
}