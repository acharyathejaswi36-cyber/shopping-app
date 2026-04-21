import { MdOutlineLocalShipping, MdOutlineSupportAgent } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { TbRefresh } from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi";
import { FiUserPlus } from "react-icons/fi";
import { PiSparkle } from "react-icons/pi";

const features = [
  { icon: <MdOutlineLocalShipping size={32} color="#e8ff47" />, title: "Fast Delivery", desc: "Get your orders delivered in 2-3 business days nationwide." },
  { icon: <RiSecurePaymentLine size={32} color="#e8ff47" />, title: "Secure Checkout", desc: "Your payment info is always encrypted and protected." },
  { icon: <TbRefresh size={32} color="#e8ff47" />, title: "Easy Returns", desc: "Changed your mind? Return within 30 days, no questions asked." },
  { icon: <MdOutlineSupportAgent size={32} color="#e8ff47" />, title: "24/7 Support", desc: "Our team is always here to help you anytime, anywhere." },
];

const Home = ({ setPage }) => {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 2rem", position: "relative", overflow: "hidden" }}>

        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(232,255,71,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-block", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "100px", padding: "6px 18px", marginBottom: "2rem" }}>
          <span style={{ color: "#e8ff47", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
            <PiSparkle size={14} />
            New Collection Available
          </span>
        </div>

        <h1 style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1.05, margin: "0 0 1.5rem", letterSpacing: "-2px", maxWidth: 900 }}>
          Shop Smarter,<br />
          <span style={{ color: "#e8ff47" }}>Live Better</span>
        </h1>

        <p style={{ color: "#666", fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: 500, margin: "0 0 3rem", lineHeight: 1.7 }}>
          Discover thousands of products curated just for you. Fast delivery, easy returns, and unbeatable prices.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => setPage("shop")}
            style={{ background: "#e8ff47", border: "none", borderRadius: "12px", padding: "16px 36px", cursor: "pointer", color: "#0a0a0a", fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px", transition: "transform 0.2s", display: "flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Browse Products <HiArrowRight size={18} />
          </button>

          <button
            onClick={() => setPage("register")}
            style={{ background: "transparent", border: "1px solid #333", borderRadius: "12px", padding: "16px 36px", cursor: "pointer", color: "#fff", fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}
          >
            <FiUserPlus size={18} /> Create Account
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {features.map((f, i) => (
          <div key={i}
            style={{ background: "#111", border: "1px solid transparent", borderRadius: "16px", padding: "2rem", transition: "box-shadow 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 24px rgba(232,255,71,0.15), 0 0 48px rgba(232,255,71,0.05)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ marginBottom: "1rem" }}>{f.icon}</div>
            <h3 style={{ color: "#fff", margin: "0 0 0.5rem", fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>{f.title}</h3>
            <p style={{ color: "#666", margin: 0, lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;