import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    User as UserIcon,
    Wallet,
    CreditCard,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft
} from "lucide-react";
import { StarRating } from "@/components/shared/StarRating";
import type { UserProfile } from "@/types";

type ProfileSection = 'account' | 'wallet' | 'banking' | 'settings' | 'help';

interface ProfileLayoutProps {
    user: UserProfile | null;
    onLogout: () => void;
    onSectionChange: (section: ProfileSection) => void;
}

export function ProfileLayout({ user, onLogout, onSectionChange }: ProfileLayoutProps) {
    if (!user) return null;

    const getRoleSpecificId = () => {
        switch (user.role) {
            case 'driver':
                return `کد راننده: DR-${user.phone?.slice(-4)}-${user.nationalId?.slice(-3) || '000'}`;
            case 'cargo-owner':
                return `کد صاحب بار: CO-${user.phone?.slice(-4)}-${user.nationalId?.slice(-3) || '000'}`;
            case 'transport-company':
                return `شناسه شرکت: ${user.companyId}`;
            default:
                return '';
        }
    };

    const menuItems = [
        { id: 'account', title: 'حساب کاربری', icon: UserIcon, colorClass: 'text-blue-600', bgColorClass: 'bg-blue-100' },
        { id: 'wallet', title: 'کیف پول و تراکنش ها', icon: Wallet, colorClass: 'text-green-600', bgColorClass: 'bg-green-100' },
        { id: 'banking', title: 'اطلاعات بانکی', icon: CreditCard, colorClass: 'text-purple-600', bgColorClass: 'bg-purple-100' },
        { id: 'settings', title: 'تنظیمات', icon: Settings, colorClass: 'text-orange-600', bgColorClass: 'bg-orange-100' },
        { id: 'help', title: 'راهنما و پشتیبانی', icon: HelpCircle, colorClass: 'text-cyan-600', bgColorClass: 'bg-cyan-100' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="pt-6 pb-24 px-4 space-y-4">
                <Card>
                    <CardContent className="px-6 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                <UserIcon className="w-8 h-8" />
                            </div>
                            <div className="flex-1 space-y-1 text-right">
                                <div className="font-medium text-lg">
                                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.companyName || 'کاربر بارمن')}
                                </div>
                                <div className="text-sm text-muted-foreground">{getRoleSpecificId()}</div>
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="text-sm text-muted-foreground">۴.۵۸</span>
                                    <StarRating rating={4.58} />
                                    <span className="text-sm text-muted-foreground">:امتیاز</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-0">
                    <CardContent className="p-0">
                        {menuItems.map((item, index) => (
                            <div key={item.id}>
                                <button
                                    onClick={() => onSectionChange(item.id as ProfileSection)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                                    <div className="flex items-center gap-3 text-right">
                                        <span className="font-medium">{item.title}</span>
                                        <div className={`w-10 h-10 ${item.bgColorClass} rounded-full flex items-center justify-center`}>
                                            <item.icon className={`w-5 h-5 ${item.colorClass}`} />
                                        </div>
                                    </div>
                                </button>
                                {index < menuItems.length - 1 && <Separator />}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={onLogout}
                >
                    <LogOut className="w-5 h-5" />
                    خروج از حساب کاربری
                </Button>
            </div>
        </div>
    );
}