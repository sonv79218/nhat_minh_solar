// ============================================
// USE OFFLINE MODE - Hook to detect offline/fallback mode
// ============================================
import { useState, useEffect, useCallback } from "react";
import { isOnline } from "../services/fallbackService";

const useOfflineMode = () => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState(Date.now());

  // Check online status
  const checkOnlineStatus = useCallback(() => {
    const online = isOnline();
    setIsNetworkOnline(online);
    if (online) {
      setLastOnline(Date.now());
    }
    return online;
  }, []);

  // Set fallback mode manually (e.g., when Firestore errors occur)
  const enableFallbackMode = useCallback(() => {
    setOfflineMode(true);
  }, []);

  const disableFallbackMode = useCallback(() => {
    setOfflineMode(false);
  }, []);

  useEffect(() => {
    // Initial check
    checkOnlineStatus();

    // Listen to online/offline events
    const handleOnline = () => {
      setIsNetworkOnline(true);
      setLastOnline(Date.now());
      // Don't auto-disable offlineMode - let user decide or check Firestore
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
  }, [checkOnlineStatus]);

  return {
    offlineMode,
    isNetworkOnline,
    lastOnline,
    enableFallbackMode,
    disableFallbackMode,
    checkOnlineStatus,
    timeSinceOnline: Date.now() - lastOnline,
  };
};

export default useOfflineMode;
