import React, { memo } from "react";
import { Hero as HeroComponent } from "../pages/Hero";
import useAppActions from "../hooks/useAppActions";

const HeroContainer: React.FC = () => {
    const { handleLogin, handleSignup } = useAppActions();

    return (
        <HeroComponent onLoginClick={handleLogin} onSignupClick={handleSignup} />
    );
};

// Memoized for performance (prevents unnecessary re-renders)
export default memo(HeroContainer);
