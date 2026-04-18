/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "cart";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => safeParse(localStorage.getItem(CART_STORAGE_KEY), []));

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  };

  const addItem = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const productId = product?._id;
    if (!productId) return;

    persist(
      (() => {
        const next = [...items];
        const idx = next.findIndex((x) => x.productId === productId);
        const stock = typeof product.stock === "number" ? product.stock : undefined;
        if (idx >= 0) {
          const current = next[idx];
          const mergedQty = current.quantity + qty;
          next[idx] = {
            ...current,
            name: product.name ?? current.name,
            price: product.price ?? current.price,
            image: product.image ?? current.image,
            stock,
            quantity: stock != null ? Math.min(mergedQty, stock) : mergedQty,
          };
        } else {
          next.push({
            productId,
            name: product.name || "Product",
            price: Number(product.price) || 0,
            image: product.image || "",
            stock,
            quantity: stock != null ? Math.min(qty, stock) : qty,
          });
        }
        return next;
      })()
    );
  };

  const removeItem = (productId) => {
    persist(items.filter((x) => x.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    persist(
      items.map((x) => {
        if (x.productId !== productId) return x;
        const capped = x.stock != null ? Math.min(qty, x.stock) : qty;
        return { ...x, quantity: capped };
      })
    );
  };

  const clearCart = () => {
    persist([]);
  };

  const itemsCount = useMemo(() => items.reduce((sum, x) => sum + (Number(x.quantity) || 0), 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, x) => sum + (Number(x.price) || 0) * (Number(x.quantity) || 0), 0),
    [items]
  );

  const value = {
    items,
    itemsCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

