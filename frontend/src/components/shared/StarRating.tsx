import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    className?: string;
}

// کامپوننت داخلی برای رندر یک ستاره
const Star = ({ fillPercentage }: { fillPercentage: number }) => {
    // یک ID یکتا برای گرادینت هر ستاره برای جلوگیری از تداخل
    const gradientId = `grad-${Math.random()}`;

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={`url(#${gradientId})`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    {/* بخش پر شده ستاره */}
                    <stop offset={`${fillPercentage}%`} stopColor="#FFE629" />
                    {/* بخش خالی ستاره */}
                    <stop offset={`${fillPercentage}%`} stopColor="#E5E5E5" />
                </linearGradient>
            </defs>
            <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
            />
        </svg>
    );
};

export function StarRating({ rating, className = "" }: StarRatingProps) {
    return (
        <div className={cn("flex items-center", className)} dir="ltr">
            {[...Array(5)].map((_, index) => {
                const starNumber = index + 1;
                let fillPercentage = 0;

                if (rating >= starNumber) {
                    fillPercentage = 100; // ستاره کامل
                } else if (rating > starNumber - 1) {
                    // محاسبه درصد برای ستاره نیمه‌پر
                    fillPercentage = (rating - (starNumber - 1)) * 100;
                }

                return <Star key={index} fillPercentage={fillPercentage} />;
            })}
        </div>
    );
}