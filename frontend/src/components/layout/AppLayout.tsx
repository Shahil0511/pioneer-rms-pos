import { ReactNode, memo } from "react";
import { useAppSelector } from "../../store/hooks";
import { Header } from "../customComponents/headers/BannerPage";
import { AuthModal } from "../customComponents/authModals/AuthModals";
import useThemeSetup from "../../hooks/useThemeSetup";
import useThemeEffect from "../../hooks/useThemeEffect";
import useAppActions from "../../hooks/useAppActions";

type AppLayoutProps = {
    children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    // Setup theme and get mounted state
    const { mounted } = useThemeSetup();
    const { theme } = useThemeEffect();

    // Get app actions
    const {
        handleThemeToggle,
        handleLogin,
        handleSignup,
        handleLogout,
        handleAuthFormDataChange,
        handleAuthSuccess,
        handleSwitchForm,
        handleCloseAuthModal
    } = useAppActions();

    // Redux state
    const {
        isAuthenticated,
        showAuthModal,
        activeAuthForm,
        formData,
    } = useAppSelector((state) => state.auth);

    if (!mounted) return null;

    return (
        <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
            <Header
                theme={theme}
                toggleTheme={handleThemeToggle}
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                onSignup={handleSignup}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            {children}

            {/* Authentication Modal */}
            {showAuthModal && (
                <AuthModal
                    activeAuthForm={activeAuthForm}
                    onClose={handleCloseAuthModal}
                    onAuthSuccess={handleAuthSuccess}
                    onSwitchForm={handleSwitchForm}
                    formData={formData}
                    onFormDataChange={handleAuthFormDataChange}
                />
            )}
        </div>
    );
};

export default memo(AppLayout);
