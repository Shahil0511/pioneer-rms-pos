import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  toggleAuthModal,
  setActiveAuthForm,
  logout,
  setFormData,
} from "../store/slices/authSlice";
import { toggleTheme } from "../store/slices/themeSlice";
import useAuthHandler from "./useAuthHandler";

export const useAppActions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleAuthSuccess: authSuccessHandler } = useAuthHandler();

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleLogin = useCallback(() => {
    dispatch(setActiveAuthForm("login"));
    dispatch(toggleAuthModal(true));
  }, [dispatch]);

  const handleSignup = useCallback(() => {
    dispatch(setActiveAuthForm("signup"));
    dispatch(toggleAuthModal(true));
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  const handleAuthFormDataChange = useCallback(
    (data: { email: string; password: string; name: string }) => {
      dispatch(setFormData(data));
    },
    [dispatch]
  );

  const handleAuthSuccess = useCallback(
    (userData: any) => {
      console.log("Auth success called with userData:", userData);
      authSuccessHandler({ userData });
      dispatch(toggleAuthModal(false));
    },
    [dispatch, authSuccessHandler]
  );

  const handleSwitchForm = useCallback(
    (formType: "login" | "signup") => {
      dispatch(setActiveAuthForm(formType));
    },
    [dispatch]
  );

  const handleCloseAuthModal = useCallback(() => {
    dispatch(toggleAuthModal(false));
  }, [dispatch]);

  return {
    handleThemeToggle,
    handleLogin,
    handleSignup,
    handleLogout,
    handleAuthFormDataChange,
    handleAuthSuccess,
    handleSwitchForm,
    handleCloseAuthModal,
  };
};

export default useAppActions;
