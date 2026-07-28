// ============================================
// USE CART HOOK
// Điện Mặt Trời Nhật Minh
// Simple cart state management using localStorage
// ============================================
import { useCallback, useMemo } from "react";
import { useToast } from "@/contexts/ToastContext";

const CART_KEY = "nhatminh_cart";

const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

const useCart = () => {
  const { showToast } = useToast();

  const items = useMemo(() => getCart(), []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      const cart = getCart();
      const existingIndex = cart.findIndex(
        (item) => item.id === product.id && item.variant === (product.variant || null)
      );

      let updated;
      if (existingIndex >= 0) {
        updated = cart.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            variant: product.variant || null,
            quantity,
          },
        ];
      }

      saveCart(updated);
      showToast(`${product.name} đã được thêm vào giỏ hàng`, "success");
    },
    [showToast]
  );

  const removeFromCart = useCallback((id) => {
    const updated = getCart().filter((item) => item.id !== id);
    saveCart(updated);
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      getCart().filter((item) => item.id !== id);
      saveCart(getCart().filter((item) => item.id !== id));
    } else {
      saveCart(
        getCart().map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const totalItems = useMemo(
    () => getCart().reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      getCart().reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return {
    items: getCart(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
};

export default useCart;
