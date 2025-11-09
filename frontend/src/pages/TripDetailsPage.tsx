// start of src/pages/TripDetailsPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripDetails } from '@/hooks/useTripDetails';
import { useAuth } from '@/contexts/AuthContext';
import { TripDetails } from '@/features/trips/TripDetails';
import { TripRatingForm } from '@/features/trips/TripRatingForm';
import { LoadingDots } from '@/components/shared/LoadingDots';
import type { Trip } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function TripDetailsPage() {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { trip, isLoading } = useTripDetails(tripId || null);

    const [showRatingForm, setShowRatingForm] = useState(false);
    // const [completedTrip, setCompletedTrip] = useState<Trip | null>(null);

    const handleBack = () => {
        navigate(-1); // بازگشت به صفحه قبل
    };

    const handleTripCompleted = (tripData: Trip) => {
        toast.success(`سفر ${tripData.cargoType} با موفقیت به پایان رسید.`);
        setShowRatingForm(true);
    };

    const handleRatingComplete = () => {
        toast.info("از بازخورد شما سپاسگزاریم.");
        setShowRatingForm(false);
        // هدایت کاربر به صفحه اصلی سفرها پس از ثبت امتیاز
        if (user?.role) {
            navigate(`/${user.role}/trips`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingDots />
            </div>
        );
    }

    if (!trip || !user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p>سفر مورد نظر یافت نشد.</p>
                <Button onClick={handleBack}>بازگشت</Button>
            </div>
        );
    }

    if (showRatingForm) {
        if (user.role !== 'driver' && user.role !== 'cargo-owner') {
            toast.error("نقش شما برای امتیازدهی معتبر نیست.");
            // به صورت خودکار به صفحه قبل برمی‌گردیم
            navigate(-1);
            return null; // چیزی رندر نکن
        }

        return (
            <TripRatingForm
                trip={trip}
                userRole={user.role} // اکنون این پراپرتی type-safe است
                onComplete={handleRatingComplete}
                onBack={() => setShowRatingForm(false)}
            />
        );
    }

    return (
        <TripDetails
            tripId={trip.id}
            onBack={handleBack}
            onTripCompleted={handleTripCompleted}
        />
    );
}