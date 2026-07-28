// ============================================
// APP CONTEXT - Global App State including Offline Mode
// ============================================
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { isOnline } from "@/services/fallbackService";

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're in fallback mode
  const checkFallbackStatus = useCallback(async () => {
    const online = isOnline();
    setIsNetworkOnline(online);

    // If network is offline, definitely use fallback
    if (!online) {
      setOfflineMode(true);
      return;
    }

    // Try to make a simple request to check Firebase
    try {
      // If we get here, network is working
      setOfflineMode(false);
    } catch (error) {
      // Network error, enable fallback
      setOfflineMode(true);
    }
  }, []);

  // Manual toggle for fallback mode
  const enableFallback = useCallback(() => {
    setOfflineMode(true);
  }, []);

  const disableFallback = useCallback(() => {
    setOfflineMode(false);
  }, []);

  // Check on mount and online/offline events
  useEffect(() => {
    checkFallbackStatus();
    setIsLoading(false);

    const handleOnline = () => {
      setIsNetworkOnline(true);
      // Try to disable fallback when network comes back
      checkFallbackStatus();
    };

    const handleOffline = () => {
      setIsNetworkOnline(false);
      setOfflineMode(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkFallbackStatus]);

  const value = {
    offlineMode,
    isNetworkOnline,
    isLoading,
    enableFallback,
    disableFallback,
    checkFallbackStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
