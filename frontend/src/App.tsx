import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/customComponents/headers/BannerPage";
import { AuthModal } from "./components/customComponents/authModals/AuthModals";
import { Hero } from "./pages/Hero";
import { Dashboard } from "./components/pageComponents/Dashboard";
import { ProtectedRoute } from "./components/customComponents/ProtectedRoute/ProtectedRoute";

type AuthFormData = {
  email: string;
  password: string;
  name: string;
};

const AppContent = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeAuthForm, setActiveAuthForm] = useState<"login" | "signup">("login");
  const [authFormData, setAuthFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    name: ""
  });

  // Check authentication status on mount
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }

    // Theme initialization
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogin = () => {
    setActiveAuthForm("login");
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setActiveAuthForm("signup");
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleAuthFormDataChange = (data: AuthFormData) => {
    setAuthFormData(data);
  };

  const handleAuthSuccess = (userData: any) => {
    console.log("Authentication successful:", userData);
    if (userData.token) {
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userRole", userData.role);
      setIsAuthenticated(true);

      // Redirect based on role
      switch (userData.role) {
        case "SUPER_ADMIN":
        case "ADMIN":
          navigate('/admin/dashboard');
          break;
        case "MANAGER":
          navigate('/manager/dashboard');
          break;
        case "KITCHEN":
          navigate('/kitchen/dashboard');
          break;
        case "DELIVERY":
          navigate('/delivery/dashboard');
          break;
        case "CUSTOMER":
          navigate('/customer/dashboard');
          break;
        default:
          navigate('/');
      }
    }
    setShowAuthModal(false);
  };

  const handleSwitchForm = (formType: "login" | "signup") => {
    setActiveAuthForm(formType);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
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
            <Dashboard role="ADMIN" />
          </ProtectedRoute>
        } />

        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <Dashboard role="MANAGER" />
          </ProtectedRoute>
        } />

        <Route path="/kitchen/dashboard" element={
          <ProtectedRoute allowedRoles={["KITCHEN"]}>
            <Dashboard role="KITCHEN" />
          </ProtectedRoute>
        } />

        <Route path="/delivery/dashboard" element={
          <ProtectedRoute allowedRoles={["DELIVERY"]}>
            <Dashboard role="DELIVERY" />
          </ProtectedRoute>
        } />

        <Route path="/customer/dashboard" element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <Dashboard role="CUSTOMER" />
          </ProtectedRoute>
        } />
      </Routes>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          activeAuthForm={activeAuthForm}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onSwitchForm={handleSwitchForm}
          formData={authFormData}
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