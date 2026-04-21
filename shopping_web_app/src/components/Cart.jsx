import { useState } from "react";
import * as api from "./Api";
import { useApp } from "./AppContext";
import { AxiosInstance } from "../helper/AxiosInstance";
import { CLEAR_CART, PLACE_ORDER, REMOVE_FROM_CART, UPDATE_CART } from "../endpoints/EndPoints";

const Cart = ({ setPage }) => {
  const { cart, fetchCart, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    setLoading(true);
    try {
      await AxiosInstance.put(
        UPDATE_CART(productId),
        { quantity: qty }
      );

      await fetchCart();
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (productId) => {
    setLoading(true);
    try {
      await AxiosInstance.delete(REMOVE_FROM_CART(productId));

      await fetchCart();
      showToast("Item removed");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove item", "error");
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    setLoading(true);
    try {
      await AxiosInstance.delete(CLEAR_CART);

      await fetchCart();
      showToast("Cart cleared");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to clear cart", "error");
    } finally {
      setLoading(false);
    }
  };

 const placeOrder = async () => {
  if (!cart?.items || cart.items.length === 0) {
    showToast("Cart is empty", "error");
    return;
  }

  setPlacingOrder(true);

  try {
    const response = await AxiosInstance.post(PLACE_ORDER);

    console.log("Order success:", response.data);

    await fetchCart(); 

    showToast("Order placed successfully!");
    setPage("orders");

  } catch (err) {
    console.log("Order error:", err.response?.data);

    showToast(
      err.response?.data?.message || "Order failed",
      "error"
    );
  } finally {
    setPlacingOrder(false);
  }
};

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: "64px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <h1 style={{
            color: "#fff", fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)", margin: 0
          }}>Your Cart</h1>
          {items.length > 0 && (
            <button onClick={clear} style={{
              background: "transparent", border: "1px solid #333", borderRadius: "8px",
              padding: "8px 16px", cursor: "pointer", color: "#888", fontSize: 13
            }}>Clear All</button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: 72, marginBottom: "1.5rem" }}>🛒</div>
            <h2 style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", marginBottom: "0.75rem" }}>Your cart is empty</h2>
            <p style={{ color: "#666", marginBottom: "2rem" }}>Looks like you haven't added anything yet.</p>
            <button onClick={() => setPage("shop")} style={{
              background: "#e8ff47", border: "none", borderRadius: "12px",
              padding: "14px 32px", cursor: "pointer", color: "#0a0a0a", fontWeight: 800
            }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map(({ product, quantity }) => product && (
                <div key={product._id} style={{
                  background: "#111", border: "1px solid #1e1e1e",
                  borderRadius: "16px", padding: "1.2rem",
                  display: "flex", gap: "1.2rem", alignItems: "center"
                }}>
                  <div style={{
                    width: 80, height: 80, background: "#1a1a1a", borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, overflow: "hidden"
                  }}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 32 }}>🛍️</span>
                    }
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "#fff", margin: "0 0 0.3rem", fontSize: 15, fontWeight: 600 }}>{product.name}</h3>
                    <span style={{ color: "#e8ff47", fontWeight: 700 }}>₹{product.price?.toLocaleString()}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button onClick={() => updateQty(product._id, quantity - 1)} style={qBtn}>−</button>
                    <span style={{ color: "#fff", width: 28, textAlign: "center", fontWeight: 600 }}>{quantity}</span>
                    <button onClick={() => updateQty(product._id, quantity + 1)} style={qBtn}>+</button>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <div style={{ color: "#fff", fontWeight: 700, marginBottom: 8 }}>
                      ₹{(product.price * quantity).toLocaleString()}
                    </div>
                    <button onClick={() => remove(product._id)} style={{
                      background: "transparent", border: "none", color: "#ff4747",
                      cursor: "pointer", fontSize: 18
                    }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              background: "#111", border: "1px solid #1e1e1e",
              borderRadius: "20px", padding: "1.8rem", position: "sticky", top: 80
            }}>
              <h2 style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", margin: "0 0 1.5rem", fontSize: 22 }}>
                Order Summary
              </h2>

              {items.map(({ product, quantity }) => product && (
                <div key={product._id} style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: "0.75rem"
                }}>
                  <span style={{ color: "#888", fontSize: 14 }}>{product.name} × {quantity}</span>
                  <span style={{ color: "#ccc", fontSize: 14 }}>₹{(product.price * quantity).toLocaleString()}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid #2a2a2a", margin: "1.5rem 0", paddingTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Total</span>
                  <span style={{ color: "#e8ff47", fontWeight: 800, fontSize: 22 }}>₹{total.toLocaleString()}</span>
                </div>

                <button onClick={placeOrder} disabled={placingOrder} style={{
                  width: "100%", background: "#e8ff47", border: "none", borderRadius: "12px",
                  padding: "16px", cursor: placingOrder ? "not-allowed" : "pointer",
                  color: "#0a0a0a", fontWeight: 800, fontSize: 16, opacity: placingOrder ? 0.7 : 1
                }}>
                  {placingOrder ? "Placing Order..." : "Place Order →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const qBtn = {
  background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "6px",
  width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: 16
};

export default Cart;
