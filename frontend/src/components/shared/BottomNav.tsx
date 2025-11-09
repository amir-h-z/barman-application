import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface TabItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface BottomNavProps {
    activeTab: string;
    tabs: TabItem[];
    onTabChange: (tabId: string) => void;
}

export function BottomNav({ activeTab, tabs, onTabChange }: BottomNavProps) {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    // اگر تب فعالی پیدا نشد، اولین تب به عنوان فعال در نظر گرفته می‌شود
    const validActiveIndex = activeIndex !== -1 ? activeIndex : 0;
    const tabWidthPercentage = 100 / tabs.length;

    return (
        <>
            {/* یک فاصله امن برای جلوگیری از همپوشانی محتوا با نویگیشن */}
            <div className="h-20" />

            {/* نویگیشن شناور مدرن */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed bottom-4 left-4 right-4 z-50"
            >
                <div className="mx-auto max-w-sm">
                    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 rounded-2xl shadow-2xl shadow-black/25 dark:shadow-black/50 p-1">

                        {/* پس‌زمینه متحرک برای تب فعال */}
                        <motion.div
                            layoutId="activeTabBackground" // یک layoutId یکتا برای انیمیشن
                            className="absolute bg-primary rounded-xl"
                            initial={false}
                            animate={{
                                right: `calc(${validActiveIndex * tabWidthPercentage}% + 4px)`,
                                width: `calc(${tabWidthPercentage}% - 8px)`,
                                top: "4px",
                                height: "calc(100% - 8px)"
                            }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 400
                            }}
                        />

                        {/* آیتم‌های نویگیشن */}
                        <div className="relative flex items-center justify-between">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => onTabChange(tab.id)}
                                        className="relative flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl focus:outline-none"
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", damping: 15, stiffness: 300 }}
                                    >
                                        {/* کانتینر آیکون و لیبل */}
                                        <motion.div
                                            className="relative flex flex-col items-center gap-1"
                                            animate={isActive ? { y: -2 } : { y: 0 }}
                                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                        >
                                            {/* آیکون */}
                                            <motion.div
                                                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "w-5 h-5 transition-colors duration-200",
                                                        isActive
                                                            ? "text-primary-foreground"
                                                            : "text-muted-foreground"
                                                    )}
                                                />
                                            </motion.div>

                                            {/* لیبل */}
                                            <motion.span
                                                className={cn(
                                                    "text-xs font-medium transition-colors duration-200 whitespace-nowrap",
                                                    isActive
                                                        ? "text-primary-foreground"
                                                        : "text-muted-foreground"
                                                )}
                                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 1 }}
                                                transition={{ type: "spring", damping: 30, stiffness: 250 }}
                                            >
                                                {tab.label}
                                            </motion.span>
                                        </motion.div>

                                        {/* افکت موجی هنگام کلیک */}
                                        <motion.div
                                            className="absolute inset-0 rounded-xl"
                                            initial={false}
                                            animate={isActive ? {
                                                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
                                            } : {}}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* یک لایه گرادینت ظریف برای زیبایی */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                    </div>
                </div>
            </motion.div>
        </>
    );
}