import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { TrendingUp, Building2, Truck } from "lucide-react";
import { toast } from "sonner";
import barmanLogo from '@/assets/barman-logo.png';

// آیکون سفارشی راننده که در پروژه اصلی بود
const DriverIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="38.8" cy="20.8" r="18.3" fill="currentColor"/>
        <path d="M62.3,51.5c-2.3-3.9-5.9-6.9-10.1-8.5c-3.9,2.4-8.5,3.8-13.4,3.8s-9.5-1.4-13.4-3.8c-6.7,2.5-11.8,8.5-12.7,15.9     l-1.9,19.2c-0.2,2.4,1.5,4.5,3.9,4.7c6.7,0.7,18,1.1,28.6,1c-0.6-2.2-0.9-4.4-0.9-6.8C42.4,64.7,50.9,54.3,62.3,51.5z" fill="currentColor"/>
        <path d="M68.8,56.6c-11.3,0-20.4,9.2-20.4,20.4s9.2,20.4,20.4,20.4c11.3,0,20.5-9.2,20.5-20.4S80.1,56.6,68.8,56.6z M54.8,70     c2.7-5.3,8-8.6,14-8.6c5.9,0,11.3,3.3,14,8.6c0.3,0.6,0.2,1.3-0.2,1.8c-0.4,0.5-1.1,0.7-1.8,0.5c-3.7-1.1-7.8-1.7-12-1.7     c-4.2,0-8.3,0.6-12,1.7c-0.6,0.2-1.3,0-1.8-0.5C54.6,71.3,54.5,70.6,54.8,70z M64.4,91.3c-0.5,0.3-1.1,0.4-1.7,0.2     c-4.3-1.8-7.5-5.3-8.9-9.7c-0.3-0.8,0.2-1.7,1-2c0.6-0.2,1.2-0.4,1.8-0.6c0.8-0.2,1.7,0.1,2,0.9c1.1,2.4,3,4.3,5.3,5.4     c0.6,0.3,0.9,0.8,1,1.4l0.2,3.1C65.2,90.5,64.9,91,64.4,91.3z M68.8,81.6c-1.8,0-3.3-1.5-3.3-3.3c0-1.8,1.5-3.3,3.3-3.3     c1.8,0,3.3,1.5,3.3,3.3C72,80.2,70.6,81.6,68.8,81.6z M74.8,91.5c-0.6,0.2-1.2,0.2-1.7-0.2c-0.5-0.3-0.7-0.9-0.7-1.4l0.2-3.1     c0-0.6,0.4-1.2,1-1.4c2.3-1.1,4.2-3,5.3-5.4c0.3-0.6,0.9-0.9,1.5-0.9c0.2,0,0.3,0,0.5,0.1c0.6,0.2,1.2,0.4,1.7,0.6     c0.8,0.3,1.3,1.2,1,2C82.3,86.2,79.1,89.7,74.8,91.5z" fill="currentColor"/>
    </svg>
);

interface RoleSelectionProps {
    onRoleSelect: (role: string) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const roles = [
        { id: "driver", title: "راننده", icon: DriverIcon, description: "برای رانندگان ماشین سنگین" },
        { id: "cargo-owner", title: "صاحب بار", icon: Truck, description: "برای افرادی که بار دارند و نیاز به راننده دارند" },
        { id: "transport-company", title: "شرکت حمل و نقل", icon: Building2, description: "برای شرکت‌هایی که خدمات حمل و نقل ارائه می‌دهند" },
        { id: "marketer", title: "بازاریاب", icon: TrendingUp, description: "برای افرادی که به دنبال بارهای حمل و نقل هستند" }
    ];

    const handleRoleClick = (roleId: string) => {
        setSelectedRole(roleId);
    };

    const handleContinue = async () => {
        if (!selectedRole) {
            toast.error('لطفاً یک نقش انتخاب کنید');
            return;
        }
        if (selectedRole === 'marketer') {
            toast.info('بخش بازاریاب در حال توسعه است');
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        onRoleSelect(selectedRole);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
            <div className="flex-1 flex flex-col p-4">
                <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
                    <div className="text-center" style={{ marginTop: '80px' }}>
                        <img src={barmanLogo} alt="بارمن" className="w-25 h-25 object-contain rounded-2xl mx-auto" />
                        <h1 className="text-3xl font-bold text-foreground mt-2 mb-2">بارمن</h1>
                        <p className="text-muted-foreground mt-6">لطفا نقش خود را انتخاب کنید</p>
                    </div>

                    <div className="space-y-4 mt-8 flex-1">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            const isSelected = selectedRole === role.id;

                            return (
                                <div
                                    key={role.id}
                                    onClick={() => handleRoleClick(role.id)}
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? 'border-2 border-primary bg-primary/5'
                                            : 'border-2 border-border hover:bg-muted/50'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 p-3 rounded-full ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-right space-y-1">
                                            <h3 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                                {role.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {role.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white sticky bottom-0">
                <div className="w-full max-w-md mx-auto">
                    <Button
                        onClick={handleContinue}
                        className="w-full h-12"
                        disabled={!selectedRole || isLoading}
                    >
                        {isLoading ? <LoadingDots /> : 'ادامه'}
                    </Button>
                </div>
            </div>
        </div>
    );
}