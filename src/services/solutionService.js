// ============================================
// SOLUTION SERVICE
// Điện Mặt Trời Nhật Minh
// Fetches active solutions from Firestore with fallback
// ============================================
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/services/firebase";
import { fetchWithFallback } from "@/services/fallbackService";

// Fallback data when offline or Firestore unavailable
const FALLBACK_SOLUTIONS = [
  {
    id: "sol-1",
    slug: "smart-lighting",
    title: "Chiếu sáng thông minh",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
  },
  {
    id: "sol-2",
    slug: "smart-security",
    title: "An ninh thông minh",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
  },
  {
    id: "sol-3",
    slug: "smart-climate",
    title: "Điều hòa thông minh",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
  },
  {
    id: "sol-4",
    slug: "smart-entertainment",
    title: "Giải trí thông minh",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
  },
  {
    id: "sol-5",
    slug: "energy-management",
    title: "Quản lý năng lượng",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
  },
];

const COLLECTION = "solutions";

/**
 * Fetch all active solutions from Firestore
 * Falls back to local data if Firestore is unavailable
 */
export const getActiveSolutions = async () => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return FALLBACK_SOLUTIONS;

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.warn("[solutionService] Firestore unavailable, using fallback:", error.message);
    return FALLBACK_SOLUTIONS;
  }
};

/**
 * Fetch a single solution by slug
 */
export const getSolutionBySlug = async (slug) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("slug", "==", slug),
      where("isActive", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return FALLBACK_SOLUTIONS.find((s) => s.slug === slug) || null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.warn("[solutionService] getSolutionBySlug failed:", error.message);
    return FALLBACK_SOLUTIONS.find((s) => s.slug === slug) || null;
  }
};
