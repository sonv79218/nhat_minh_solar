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
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

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
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in admin
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Kiểm tra role trong Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        setAdminUser({ uid: user.uid, ...userDoc.data() });
        return { success: true, user: { uid: user.uid, ...userDoc.data() } };
      } else {
        // Không phải admin - logout
        await signOut(auth);
        setAdminUser(null);
        return {
          success: false,
          error: "Bạn không có quyền truy cập Admin",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Đăng nhập thất bại";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/user-disabled":
          errorMessage = "Tài khoản đã bị vô hiệu hóa";
          break;
        case "auth/user-not-found":
          errorMessage = "Email không tồn tại";
          break;
        case "auth/wrong-password":
          errorMessage = "Mật khẩu không đúng";
          break;
        case "auth/invalid-credential":
          errorMessage = "Email hoặc mật khẩu không đúng";
          break;
        case "auth/too-many-requests":
          errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau";
          break;
        default:
          errorMessage = error.message || "Đăng nhập thất bại";
      }

      return { success: false, error: errorMessage };
    }
  };

  // Sign out admin
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAdminUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return adminUser !== null && adminUser.role === "admin";
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Kiểm tra role trong Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setAdminUser({ uid: user.uid, ...userDoc.data() });
          } else {
            setAdminUser(null);
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    adminUser,
    loading,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
