import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileLayout } from '@/features/profile/ProfileLayout';
import { UserAccountSection } from '@/features/profile/UserAccountSection';
import { WalletSection } from '@/features/profile/WalletSection';
import { BankingSection } from '@/features/profile/BankingSection';
import { SettingsSection } from '@/features/profile/SettingsSection';
import { HelpSupportSection } from '@/features/profile/HelpSupportSection';
import { LoadingDots } from '@/components/shared/LoadingDots';

type ProfileSection = 'main' | 'account' | 'wallet' | 'banking' | 'settings' | 'help';

export function ProfilePage() {
    const { user, logout } = useAuth();
    const { profile, updateProfile, isLoading } = useUserProfile();
    const [currentSection, setCurrentSection] = useState<ProfileSection>('main');

    const handleSectionChange = (section: ProfileSection) => {
        setCurrentSection(section);
    };

    if (isLoading || !profile || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingDots />
            </div>
        );
    }

    // انتخاب بخش مورد نظر برای نمایش
    switch (currentSection) {
        case 'account':
            return (
                <UserAccountSection
                    userRole={user.role}
                    profileData={profile}
                    onProfileUpdate={updateProfile}
                    identifier={user.role === 'transport-company' ? user.email! : user.phone!}
                    onBack={() => setCurrentSection('main')}
                />
            );
        case 'wallet':
            return <WalletSection userRole={user.role} onBack={() => setCurrentSection('main')} />;
        case 'banking':
            return <BankingSection userRole={user.role} onBack={() => setCurrentSection('main')} />;
        case 'settings':
            return <SettingsSection userRole={user.role} onBack={() => setCurrentSection('main')} />;
        case 'help':
            return <HelpSupportSection userRole={user.role} onBack={() => setCurrentSection('main')} />;
        case 'main':
        default:
            return (
                <ProfileLayout
                    user={profile}
                    onLogout={logout}
                    onSectionChange={handleSectionChange}
                />
            );
    }
}