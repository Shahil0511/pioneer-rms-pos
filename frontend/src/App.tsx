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
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [activeAuthForm, setActiveAuthForm] = useState<"login" | "signup">("login");
  const [authFormData, setAuthFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    name: ""
  });

  // Theme handling
  useEffect(() => {
    setMounted(true);
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

  const handleAuthFormDataChange = (data: AuthFormData) => {
    setAuthFormData(data);
  };

  const handleAuthSuccess = (userData: any) => {
    console.log("Authentication successful:", userData);
    if (userData.token) {
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userRole", userData.role);

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
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleSwitchForm = (formType: "login" | "signup") => {
    setActiveAuthForm(formType);
    setShowLogin(formType === "login");
    setShowSignup(formType === "signup");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        setActiveAuthForm={setActiveAuthForm}
        setShowLogin={setShowLogin}
        setShowSignup={setShowSignup}
      />

      <Routes>
        <Route path="/" element={
          <Hero
            onLoginClick={() => {
              setActiveAuthForm("login");
              setShowLogin(true);
            }}
            onSignupClick={() => {
              setActiveAuthForm("signup");
              setShowSignup(true);
            }}
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
      {(showLogin || showSignup) && (
        <AuthModal
          activeAuthForm={activeAuthForm}
          onClose={() => {
            setShowLogin(false);
            setShowSignup(false);
          }}
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