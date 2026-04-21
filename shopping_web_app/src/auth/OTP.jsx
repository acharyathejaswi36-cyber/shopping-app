import { useState, useRef, useEffect } from "react";
import * as api from "../api/api";
import { useApp } from "../context/AppContext";

const OTP_LENGTH = 6;

const OTP = ({ email, onVerified, onBack }) => {
  const { showToast } = useApp();
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  const [secondsLeft, setSecondsLeft] = useState(299);
  const [resendable, setResendable] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    inputRefs.current[0]?.focus();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setResendable(false);
    setSecondsLeft(299);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setResendable(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[i] = val;
    setDigits(updated);
    setStatus(null);
    if (val && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const updated = Array(OTP_LENGTH).fill("");
    text.split("").forEach((ch, idx) => (updated[idx] = ch));
    setDigits(updated);
    const next = Math.min(text.length, OTP_LENGTH - 1);
    inputRefs.current[next]?.focus();
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setStatus({ msg: "Please enter all 6 digits", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await api.verifyOtp(email, otp);
      setStatus({ msg: "Email verified successfully!", type: "success" });
      setTimeout(() => onVerified?.(), 800);
    } catch (err) {
      setStatus({ msg: err.message || "Invalid code. Try again.", type: "error" });
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.sendOtp(email);
      showToast("New OTP sent!");
      setDigits(Array(OTP_LENGTH).fill(""));
      setStatus(null);
      startTimer();
      inputRefs.current[0]?.focus();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const isSuccess = status?.type === "success";
  const isError = status?.type === "error";

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem"
    }}>
      <div style={{
        width: "100%", maxWidth: 420, background: "#111",
        border: "1px solid #1e1e1e", borderRadius: "20px", padding: "2.5rem 2rem"
      }}>

        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "#1a2a1a", border: "1px solid #2a4a2a",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem", fontSize: 26
        }}>✉️</div>

        <h2 style={{
          color: "#fff", fontFamily: "'DM Serif Display', serif",
          fontSize: 28, margin: "0 0 0.5rem", textAlign: "center", letterSpacing: "-0.5px"
        }}>Check your email</h2>
        <p style={{ color: "#666", fontSize: 14, textAlign: "center", lineHeight: 1.6, margin: "0 0 2rem" }}>
          We sent a 6-digit code to<br />
          <span style={{ color: "#fff", fontWeight: 600 }}>{email}</span>
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "1.5rem" }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              disabled={isSuccess}
              style={{
                width: 46, height: 54, textAlign: "center",
                fontSize: 22, fontWeight: 700,
                background: "#0a0a0a",
                border: `1px solid ${isSuccess ? "#4aff91" : isError && !d ? "#ff4747" : "#2a2a2a"}`,
                borderRadius: "10px", color: "#fff",
                outline: "none", transition: "border-color 0.2s",
                caretColor: "#e8ff47",
              }}
              onFocus={(e) => {
                if (!isSuccess) e.target.style.borderColor = "#e8ff47";
              }}
              onBlur={(e) => {
                if (!isSuccess && !(isError && !d))
                  e.target.style.borderColor = "#2a2a2a";
              }}
            />
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#555", marginBottom: "1.5rem" }}>
          {secondsLeft > 0
            ? <>Code expires in <span style={{ color: "#888", fontWeight: 600 }}>{formatTime(secondsLeft)}</span></>
            : "Code has expired."
          }
        </p>

        <button
          onClick={handleVerify}
          disabled={loading || isSuccess}
          style={{
            width: "100%", background: isSuccess ? "#1a2a1a" : "#e8ff47",
            border: "none", borderRadius: "10px", padding: "14px",
            cursor: loading || isSuccess ? "not-allowed" : "pointer",
            color: isSuccess ? "#4aff91" : "#0a0a0a",
            fontWeight: 800, fontSize: 15, marginBottom: "12px",
            opacity: loading ? 0.7 : 1, transition: "background 0.2s, color 0.2s"
          }}
        >
          {loading ? "Verifying..." : isSuccess ? "Verified!" : "Verify Code"}
        </button>

        {status && (
          <p style={{
            textAlign: "center", fontSize: 13, margin: "0 0 1rem",
            color: isSuccess ? "#4aff91" : "#ff4747"
          }}>
            {status.msg}
          </p>
        )}

        <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: "0 0 1rem" }}>
          Didn't receive it?{" "}
          <button
            onClick={handleResend}
            disabled={!resendable}
            style={{
              background: "none", border: "none", padding: 0,
              fontSize: 13, fontWeight: 600, cursor: resendable ? "pointer" : "not-allowed",
              color: resendable ? "#e8ff47" : "#444", transition: "color 0.2s"
            }}
          >
            Resend code
          </button>
        </p>

        {onBack && (
          <div style={{ textAlign: "center" }}>
            <button onClick={onBack} style={{
              background: "none", border: "none", color: "#555",
              fontSize: 13, cursor: "pointer"
            }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTP;
