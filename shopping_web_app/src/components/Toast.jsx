import { useApp } from "./AppContext";

const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div style={{
      position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999,
      background: toast.type === "error" ? "#ff4747" : "#e8ff47",
      color: "#0a0a0a", padding: "12px 20px", borderRadius: "10px",
      fontWeight: 700, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      animation: "slideUp 0.3s ease",
    }}>
      {toast.message}
    </div>
  );
};

export default Toast;
