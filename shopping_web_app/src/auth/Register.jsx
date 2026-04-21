import { useState } from "react";
import { useApp } from "../components/AppContext";
import { AuthLayout, Field, SubmitBtn } from "./Login";
import { AxiosInstance } from "../helper/AxiosInstance";
import { REGISTER } from "../endpoints/EndPoints";

const Register = ({ setPage }) => {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AxiosInstance.post(REGISTER, form);
      showToast("Account created! Please login.");
      setPage("login");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <AuthLayout title="Create account" subtitle="Join ShopNest today">
        <form onSubmit={handle}>
          <Field label="Full Name" type="text" value={form.name} onChange={upd("name")} placeholder="John Doe" />
          <Field label="Email" type="email" value={form.email} onChange={upd("email")} placeholder="you@email.com" />
          <Field label="Mobile" type="tel" value={form.mobile} onChange={upd("mobile")} placeholder="+91 9876543210" />
          <Field label="Password" type="password" value={form.password} onChange={upd("password")} placeholder="••••••••" />
          <SubmitBtn loading={loading} label="Create Account" />
        </form>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <span style={{ color: "#666", fontSize: 14 }}>Already have an account? </span>
          <button onClick={() => setPage("login")} style={{ background: "transparent", border: "none", color: "#e8ff47", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 }}>Sign in</button>
        </div>
      </AuthLayout>
    </div>
  );
};

export default Register;