import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Moon, Sun, Smartphone, ArrowRight } from "lucide-react";
// import { Settings } from "lucide-react";
import { toast } from "sonner";

interface SettingsSectionProps {
    userRole: 'driver' | 'cargo-owner' | 'transport-company';
    onBack: () => void;
}

export function SettingsSection({ userRole, onBack }: SettingsSectionProps) {
    const [notifications, setNotifications] = useState({ newItems: true, messages: true, updates: true, system: false });
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
        toast.success("تنظیمات اعلان‌ها به‌روزرسانی شد");
    };

    const getNotificationLabels = () => {
        switch(userRole) {
            case 'driver': return { newItems: 'بارهای جدید', updates: 'یادآوری سفرها' };
            case 'cargo-owner': return { newItems: 'رانندگان جدید', updates: 'به‌روزرسانی تحویل' };
            case 'transport-company': return { newItems: 'بارهای جدید', updates: 'به‌روزرسانی بارنامه' };
            default: return { newItems: '', updates: '' };
        }
    };

    const labels = getNotificationLabels();

    return (
        <div className="min-h-screen bg-background">
            <div className="fixed top-0 left-0 right-0 bg-white border-b px-4 py-3 z-10">
                <div className="flex items-center justify-center relative">
                    <button onClick={onBack} className="absolute right-0 p-1"><ArrowRight className="w-5 h-5"/></button>
                    <h1 className="text-primary text-base">تنظیمات</h1>
                </div>
            </div>

            <div className="pt-20 pb-6 px-4 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/>اعلان‌ها</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between"><div className="text-right flex-1"><div className="font-medium">{labels.newItems}</div></div><Switch checked={notifications.newItems} onCheckedChange={c => handleNotificationChange('newItems', c)}/></div>
                        <div className="flex items-center justify-between"><div className="text-right flex-1"><div className="font-medium">پیام‌های چت</div></div><Switch checked={notifications.messages} onCheckedChange={c => handleNotificationChange('messages', c)}/></div>
                        <div className="flex items-center justify-between"><div className="text-right flex-1"><div className="font-medium">{labels.updates}</div></div><Switch checked={notifications.updates} onCheckedChange={c => handleNotificationChange('updates', c)}/></div>
                        <div className="flex items-center justify-between"><div className="text-right flex-1"><div className="font-medium">به‌روزرسانی‌های سیستم</div></div><Switch checked={notifications.system} onCheckedChange={c => handleNotificationChange('system', c)}/></div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5"/>تنظیمات ظاهری</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="font-medium">تم برنامه</div>
                            <Select value={theme} onValueChange={(v: 'light' | 'dark') => setTheme(v)}>
                                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light"><div className="flex items-center gap-2"><Sun className="w-4 h-4"/>روشن</div></SelectItem>
                                    <SelectItem value="dark" disabled><div className="flex items-center gap-2"><Moon className="w-4 h-4"/>تاریک</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5"/>اطلاعات برنامه</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">نسخه برنامه</span><span>۱.۲.۱۳</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">آخرین به‌روزرسانی</span><span>۱۴۰۳/۰۸/۲۰</span></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}