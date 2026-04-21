import { useState, useEffect } from "react";
import { useApp } from "./AppContext";
import { AxiosInstance } from "../helper/AxiosInstance";
import { GET_USER_ORDERS, CANCEL_ORDER } from "../endpoints/EndPoints";
import { MdOutlineReceiptLong, MdOutlineShoppingBag } from "react-icons/md";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FiPackage } from "react-icons/fi";
import { TbShoppingCartX } from "react-icons/tb";

const statusColors = {
  PLACED: { bg: "#1a2a1a", color: "#4aff91", border: "#2a4a2a" },
  SHIPPED: { bg: "#1a1a2a", color: "#47a3ff", border: "#2a2a4a" },
  DELIVERED: { bg: "#2a2a1a", color: "#e8ff47", border: "#4a4a2a" },
  CANCELLED: { bg: "#2a1a1a", color: "#ff4747", border: "#4a2a2a" },
};

const Orders = ({ setPage }) => {
  const { showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await AxiosInstance.get(GET_USER_ORDERS);
        setOrders(data);
      } catch (err) {
        showToast(err?.response?.data?.message || "Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancel = async (orderId) => {
    try {
      await AxiosInstance.patch(CANCEL_ORDER(orderId));
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: "CANCELLED" } : o));
      showToast("Order cancelled");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to cancel order", "error");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#666" }}>Loading orders...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: "64px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 2rem" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <MdOutlineReceiptLong size={36} color="#e8ff47" />
          <h1 style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", margin: 0 }}>My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <FiPackage size={72} color="#2a2a2a" style={{ marginBottom: "1.5rem" }} />
            <h2 style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", marginBottom: "0.75rem" }}>No orders yet</h2>
            <p style={{ color: "#666", marginBottom: "2rem" }}>Start shopping to see your orders here.</p>
            <button onClick={() => setPage("shop")} style={{ background: "#e8ff47", border: "none", borderRadius: "12px", padding: "14px 32px", cursor: "pointer", color: "#0a0a0a", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <MdOutlineShoppingBag size={18} /> Shop Now
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {orders.map(order => {
              const sc = statusColors[order.status] || statusColors.PLACED;
              const isOpen = expanded === order._id;

              return (
                <div key={order._id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "16px", overflow: "hidden" }}>

                  <div onClick={() => setExpanded(isOpen ? null : order._id)} style={{ padding: "1.2rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                        <div style={{ color: "#666", fontSize: 13 }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ color: "#e8ff47", fontWeight: 700, fontSize: 16 }}>₹{order.totalAmount.toLocaleString()}</span>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{order.status}</span>
                      {isOpen ? <BsChevronUp size={16} color="#555" /> : <BsChevronDown size={16} color="#555" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid #1e1e1e", padding: "1.2rem 1.5rem" }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center", paddingBottom: "1rem", marginBottom: "1rem", borderBottom: i < order.items.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                          <div style={{ width: 56, height: 56, background: "#1a1a1a", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                            {item.product?.image
                              ? <img src={item.product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : <MdOutlineShoppingBag size={24} color="#2a2a2a" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{item.product?.name || "Product"}</div>
                            <div style={{ color: "#666", fontSize: 13 }}>Qty: {item.quantity}</div>
                          </div>
                          <div style={{ color: "#ccc", fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}

                      {order.status === "PLACED" && (
                        <button onClick={() => cancel(order._id)} style={{ background: "transparent", border: "1px solid #ff4747", borderRadius: "8px", padding: "8px 20px", cursor: "pointer", color: "#ff4747", fontWeight: 600, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <TbShoppingCartX size={16} /> Cancel Order
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;