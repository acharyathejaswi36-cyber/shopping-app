import { useState } from "react";
import { useApp } from "./AppContext";
import { BsCart3, BsShop } from "react-icons/bs";
import { AiOutlineHome, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineReceiptLong } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";

const Navbar = ({ page, setPage }) => {
  const { user, cartCount, doLogout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (p) => { setPage(p); setMenuOpen(false); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "#0a0a0a", borderBottom: "1px solid #1e1e1e", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>

      <div onClick={() => nav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 32, height: 32, background: "#e8ff47", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#0a0a0a", fontSize: 16 }}>
          <HiOutlineShoppingBag size={18} />
        </div>
        <span style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", fontSize: 20, letterSpacing: "-0.5px" }}>ShopNest</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <NavBtn label="Home" icon={<AiOutlineHome size={16} />} active={page === "home"} onClick={() => nav("home")} />
        <NavBtn label="Shop" icon={<BsShop size={16} />} active={page === "shop"} onClick={() => nav("shop")} />
        {user && <NavBtn label="Orders" icon={<MdOutlineReceiptLong size={16} />} active={page === "orders"} onClick={() => nav("orders")} />}

        {user ? (
          <>
            <button onClick={() => nav("cart")} style={{ position: "relative", background: page === "cart" ? "#e8ff47" : "#1a1a1a", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", color: page === "cart" ? "#0a0a0a" : "#fff", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <BsCart3 size={18} />
              {cartCount > 0 && (
                <span style={{ background: "#ff4747", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={doLogout}
              style={{ background: "transparent", border: "1px solid #333", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#888", fontSize: 13, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#ff4747"; e.currentTarget.style.borderColor = "#ff4747"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; }}
            >
              <AiOutlineLogout size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavBtn label="Login" icon={<AiOutlineLogin size={16} />} active={page === "login"} onClick={() => nav("login")} />
            <button onClick={() => nav("register")} style={{ background: "#e8ff47", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", color: "#0a0a0a", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <FiUserPlus size={16} />
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const NavBtn = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} style={{ background: "transparent", border: "none", padding: "8px 14px", cursor: "pointer", color: active ? "#e8ff47" : "#888", fontSize: 14, fontWeight: active ? 600 : 400, borderRadius: "8px", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "6px" }}>
    {icon}
    {label}
  </button>
);

export default Navbar;