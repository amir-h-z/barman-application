import { useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

interface LoginSuccessAnimationProps {
    isVisible: boolean;
    onComplete: () => void;
}

export function LoginSuccessAnimation({ isVisible, onComplete }: LoginSuccessAnimationProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onComplete();
            }, 3500); // انیمیشن به مدت ۳.۵ ثانیه نمایش داده می‌شود

            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.5
                }}
            >
                {/* آیکون موفقیت با انیمیشن */}
                <motion.div
                    className="mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 400,
                        damping: 15
                    }}
                >
                    <div className="w-20 h-20 bg-[#0A0A0A] rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-12 h-12 text-[#E5E5E5]" />
                    </div>
                </motion.div>

                {/* پیام موفقیت */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                >
                    <h2 className="text-xl font-semibold text-[#0A0A0A] mb-2">
                        با موفقیت وارد شدید
                    </h2>
                </motion.div>

                {/* نقاط متحرک لودینگ */}
                <motion.div
                    className="flex justify-center gap-1 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                >
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-2 h-2 bg-[#0A0A0A] rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}