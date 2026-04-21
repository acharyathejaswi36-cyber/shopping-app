import { useState } from "react";
import { useApp } from "../../../AppContext";
import { FiMail, FiLock } from "react-icons/fi";

const Login = ({ setPage }) => {
  const { doLogin, showToast } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await doLogin(form.email, form.password); 
      showToast("Welcome back!");
      setPage("home");
    } catch (err) {
      showToast(err?.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handle}>
        <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" icon={<FiMail size={15} />} />
        <Field label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" icon={<FiLock size={15} />} />
        <SubmitBtn loading={loading} label="Sign In" />
      </form>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <span style={{ color: "#666", fontSize: 14 }}>No account? </span>
        <button onClick={() => setPage("register")} style={linkBtn}>Register here</button>
      </div>
      <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
        <button onClick={() => setPage("forgot")} style={linkBtn}>Forgot password?</button>
      </div>
    </AuthLayout>
  );
};

export const AuthLayout = ({ title, subtitle, children }) => (
  <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "84px 2rem 2rem" }}>
    <div style={{ width: "100%", maxWidth: 420, background: "#111", border: "1px solid #1e1e1e", borderRadius: "20px", padding: "2.5rem" }}>
      <h2 style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", fontSize: 32, margin: "0 0 0.5rem", letterSpacing: "-1px" }}>{title}</h2>
      <p style={{ color: "#666", margin: "0 0 2rem", fontSize: 15 }}>{subtitle}</p>
      {children}
    </div>
  </div>
);

export const Field = ({ label, type, value, onChange, placeholder, icon }) => (
  <div style={{ marginBottom: "1.2rem" }}>
    <label style={{ display: "block", color: "#999", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>{label}</label>
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {icon && <span style={{ position: "absolute", left: 12, color: "#555", display: "flex", alignItems: "center", pointerEvents: "none" }}>{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: "10px", padding: icon ? "12px 14px 12px 36px" : "12px 14px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={(e) => (e.target.style.borderColor = "#e8ff47")}
        onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
      />
    </div>
  </div>
);

export const SubmitBtn = ({ loading, label }) => (
  <button type="submit" disabled={loading} style={{ width: "100%", background: "#e8ff47", border: "none", borderRadius: "10px", padding: "14px", cursor: loading ? "not-allowed" : "pointer", color: "#0a0a0a", fontWeight: 800, fontSize: 15, marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}>
    {loading ? "Please wait..." : label}
  </button>
);

const linkBtn = { background: "transparent", border: "none", color: "#e8ff47", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 };

export default Login;