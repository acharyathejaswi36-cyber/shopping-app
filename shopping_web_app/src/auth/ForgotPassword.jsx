import { useState } from "react";
import { useApp } from "../../AppContext";
import { AuthLayout, Field, SubmitBtn } from "./login/login/register/Login";
import { AxiosInstance } from "../../../helper/AxiosInstance";
import { SEND_OTP, VERIFY_OTP, RESET_PASSWORD } from "../../../endpoints/EndPoints";
import { FiMail, FiShield, FiLock, FiArrowLeft } from "react-icons/fi";
import { TbRefresh } from "react-icons/tb";

const ForgotPassword = ({ setPage }) => {
  const { showToast } = useApp();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (err) => showToast(err?.response?.data?.message || "Something went wrong", "error");

  const sendOtp = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await AxiosInstance.post(SEND_OTP, { email });
      showToast("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AxiosInstance.post(VERIFY_OTP, { email, otp });
      showToast("OTP verified!");
      setStep(3);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AxiosInstance.post(RESET_PASSWORD, { email, newPassword });
      showToast("Password reset successfully!");
      setPage("login");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Email", "Verify OTP", "New Password"];

  return (
    <AuthLayout title="Reset Password" subtitle="We'll help you get back in">
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 4, background: i + 1 <= step ? "#e8ff47" : "#2a2a2a", marginBottom: 6, transition: "background 0.3s" }} />
            <span style={{ color: i + 1 <= step ? "#e8ff47" : "#555", fontSize: 11, fontWeight: 600 }}>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={sendOtp}>
          <Field label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" icon={<FiMail size={15} />} />
          <SubmitBtn loading={loading} label="Send OTP" />
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp}>
          <p style={{ color: "#666", fontSize: 14, marginBottom: "1.5rem" }}>
            OTP sent to <strong style={{ color: "#fff" }}>{email}</strong>
          </p>
          <Field label="Enter OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" icon={<FiShield size={15} />} />
          <SubmitBtn loading={loading} label="Verify OTP" />
          <button type="button" onClick={sendOtp} style={{ width: "100%", background: "transparent", border: "none", color: "#666", fontSize: 14, cursor: "pointer", marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <TbRefresh size={15} /> Resend OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPass}>
          <Field label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" icon={<FiLock size={15} />} />
          <SubmitBtn loading={loading} label="Reset Password" />
        </form>
      )}

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button onClick={() => setPage("login")} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FiArrowLeft size={14} /> Back to Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;