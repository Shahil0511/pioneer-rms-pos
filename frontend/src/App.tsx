import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Header } from "./components/customComponents/headers/BannerPage";
import { AuthModal } from "./components/customComponents/authModals/AuthModals";
import { Hero } from "./pages/Hero";
import { Dashboard } from "./components/pageComponents/Dashboard";
import { ProtectedRoute } from "./components/customComponents/ProtectedRoute/ProtectedRoute";
import {
  toggleAuthModal,
  setActiveAuthForm,
  logout,
  setFormData
} from "./store/slices/authSlice";
import { toggleTheme, setTheme } from "./store/slices/themeSlice";
import Manager from "./pages/Manager";

const AppContent = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const { mode: theme } = useAppSelector((state) => state.theme);
  const {
    isAuthenticated,
    showAuthModal,
    activeAuthForm,
    formData,
  } = useAppSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);

  // Initial setup on mount
  useEffect(() => {
    setMounted(true);

    // Check for system preferred theme
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    dispatch(setTheme(savedTheme || (systemPrefersDark ? "dark" : "light")));

    // Token check is handled by redux-persist, so no need to manually check it here
  }, [dispatch]);

  // Apply theme changes to DOM
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogin = () => {
    dispatch(setActiveAuthForm("login"));
    dispatch(toggleAuthModal(true));
  };

  const handleSignup = () => {
    dispatch(setActiveAuthForm("signup"));
    dispatch(toggleAuthModal(true));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleAuthFormDataChange = (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    dispatch(setFormData(data));
  };

  const handleAuthSuccess = (userData: any) => {
    console.log("Auth success called with userData:", userData);

    // Ensure userData has a role, default to CUSTOMER if not provided
    const userRole = userData?.role || "CUSTOMER";

    // Store the token and role in localStorage
    localStorage.setItem("authToken", userData.token);
    localStorage.setItem("userRole", userRole);

    // Determine target route based on user role
    let targetRoute = '/';
    switch (userRole) {
      case "SUPER_ADMIN":
      case "ADMIN":
        targetRoute = '/admin/dashboard';
        break;
      case "MANAGER":
        targetRoute = '/manager/dashboard';
        break;
      case "KITCHEN":
        targetRoute = '/kitchen/dashboard';
        break;
      case "DELIVERY":
        targetRoute = '/delivery/dashboard';
        break;
      case "CUSTOMER":
      default:
        targetRoute = '/customer/dashboard';
    }

    console.log("Navigating to:", targetRoute);

    // Close the modal
    dispatch(toggleAuthModal(false));

    // Navigate immediately
    navigate(targetRoute);
  };

  const handleSwitchForm = (formType: "login" | "signup") => {
    dispatch(setActiveAuthForm(formType));
  };

  if (!mounted) {
    return null;
  }

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

      <Routes>
        <Route path="/" element={
          <Hero
            onLoginClick={handleLogin}
            onSignupClick={handleSignup}
          />
        } />

        {/* Protected routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <Dashboard role="ADMIN" userName={""} />
          </ProtectedRoute>
        } />

        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            {/* <Dashboard role="MANAGER" userName={""} /> */}
            <Manager />
          </ProtectedRoute>
        } />

        <Route path="/kitchen/dashboard" element={
          <ProtectedRoute allowedRoles={["KITCHEN"]}>
            <Dashboard role="KITCHEN" userName={""} />
          </ProtectedRoute>
        } />

        <Route path="/delivery/dashboard" element={
          <ProtectedRoute allowedRoles={["DELIVERY"]}>
            <Dashboard role="DELIVERY" userName={""} />
          </ProtectedRoute>
        } />

        <Route path="/customer/dashboard" element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <Dashboard role="CUSTOMER" userName={""} />
          </ProtectedRoute>
        } />
      </Routes>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          activeAuthForm={activeAuthForm}
          onClose={() => dispatch(toggleAuthModal(false))}
          onAuthSuccess={handleAuthSuccess}
          onSwitchForm={handleSwitchForm}
          formData={formData}
          onFormDataChange={handleAuthFormDataChange}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;