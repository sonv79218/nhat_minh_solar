// ============================================
// ADMIN AUTH CONTEXT
// Chỉ dành cho admin authentication
// ============================================
import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/services/firebase";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in — chỉ xác thực Firebase Auth, không kiểm tra Firestore
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("[Auth] login error:", error.code, error.message);

      switch (error.code) {
        case "auth/invalid-email":
          return { success: false, error: "Email không hợp lệ" };
        case "auth/user-disabled":
          return { success: false, error: "Tài khoản đã bị vô hiệu hóa" };
        case "auth/user-not-found":
          return { success: false, error: "Email không tồn tại" };
        case "auth/wrong-password":
          return { success: false, error: "Mật khẩu không đúng" };
        case "auth/invalid-credential":
          return { success: false, error: "Email hoặc mật khẩu không đúng" };
        case "auth/too-many-requests":
          return { success: false, error: "Quá nhiều lần thử. Vui lòng thử lại sau" };
        case "auth/network-request-failed":
          return { success: false, error: "Lỗi mạng. Vui lòng kiểm tra kết nối internet." };
        default:
          return {
            success: false,
            error: error.message || "Đăng nhập thất bại",
          };
      }
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("[Auth] logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // Listen to auth state changes — chỉ theo dõi Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
