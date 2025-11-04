import { useParams, useNavigate } from 'react-router-dom';
import { TripDetails } from '@/features/trips/TripDetails';
import { TripRatingForm } from '@/features/trips/TripRatingForm'; // کامپوننت فرم امتیازدهی
import { useTripDetails } from '@/hooks/useTripDetails';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingDots } from '@/components/shared/LoadingDots';
import { Trip } from '@/types';
import { useState } from 'react';

type TripView = 'details' | 'rating';

export function TripDetailsPage() {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [view, setView] = useState<TripView>('details');

    // واکشی داده‌های سفر با استفاده از هوک
    const { trip, isLoading, isError } = useTripDetails(tripId || null);

    const handleBack = () => {
        if (user?.role) {
            navigate(`/${user.role}/trips`);
        } else {
            navigate('/');
        }
    };

    const handleTripCompleted = (completedTrip: Trip) => {
        // تغییر نما به فرم امتیازدهی
        setView('rating');
    };

    const handleRatingComplete = () => {
        // پس از ثبت امتیاز، کاربر به صفحه اصلی داشبورد هدایت می‌شود
        if (user?.role) {
            navigate(`/${user.role}/available-loads`, { state: { showPaymentAlert: true, amount: trip?.price } });
        } else {
            navigate('/');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingDots />
            </div>
        );
    }

    if (isError || !trip) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h2 className="text-xl font-semibold text-destructive">خطا</h2>
                <p className="text-muted-foreground">اطلاعات این سفر یافت نشد.</p>
                <Button onClick={handleBack} variant="outline" className="mt-4">
                    بازگشت به لیست سفرها
                </Button>
            </div>
        );
    }

    if (view === 'rating') {
        return (
            <TripRatingForm
                trip={trip}
                userRole={user!.role} // در این مرحله کاربر قطعا وجود دارد
                onComplete={handleRatingComplete}
                onBack={() => setView('details')} // امکان بازگشت به جزئیات
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