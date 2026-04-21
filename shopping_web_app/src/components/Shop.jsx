import { useState, useEffect, useCallback } from "react";
import { useApp } from "./AppContext";
import { AxiosInstance } from "../helper/AxiosInstance";
import { GET_ALL_PRODUCTS, GET_ALL_CATEGORIES, GET_PRODUCTS_BY_CATEGORY } from "../endpoints/EndPoints.jsx";
import { BsCart3 } from "react-icons/bs";
import { FiSearch, FiAlertTriangle } from "react-icons/fi";
import { MdOutlineStorefront } from "react-icons/md";
import { TbMoodEmpty } from "react-icons/tb";

const Shop = ({ setPage, setSelectedProduct }) => {
  const { doAddToCart, user, showToast } = useApp();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await AxiosInstance.get(GET_ALL_CATEGORIES);
        setCategories(data);
      } catch {
        showToast("Failed to load categories", "error");
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCat === "all" ? GET_ALL_PRODUCTS : GET_PRODUCTS_BY_CATEGORY(selectedCat);
      const { data } = await AxiosInstance.get(url);
      setProducts(selectedCat === "all" ? data.products : data);
    } catch {
      setError("Failed to load products");
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedCat]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async (productId) => {
    if (!user) { showToast("Please login first", "error"); setPage("login"); return; }
    try { await doAddToCart(productId); } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: "64px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>

        <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <MdOutlineStorefront size={36} color="#e8ff47" />
          <div>
            <h1 style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: "0 0 0.25rem", letterSpacing: "-1px" }}>All Products</h1>
            <p style={{ color: "#666", margin: 0 }}>{filtered.length} items found</p>
          </div>
        </div>

        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <FiSearch size={18} color="#666" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "14px 18px 14px 44px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#e8ff47"} onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <CatPill label="All" active={selectedCat === "all"} onClick={() => setSelectedCat("all")} />
          {categories.map(c => <CatPill key={c._id} label={c.name} active={selectedCat === c._id} onClick={() => setSelectedCat(c._id)} />)}
        </div>

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "5rem", color: "#ff4747" }}>
            <FiAlertTriangle size={48} style={{ marginBottom: "1rem" }} />
            <p>{error}</p>
            <button onClick={fetchProducts} style={{ background: "#e8ff47", border: "none", borderRadius: "8px", padding: "10px 24px", cursor: "pointer", fontWeight: 700, marginTop: "1rem" }}>Retry</button>
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {filtered.map(p => <ProductCard key={p._id} product={p} onView={() => { setSelectedProduct(p._id); setPage("product"); }} onAdd={() => handleAdd(p._id)} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem", color: "#555" }}>
            <TbMoodEmpty size={52} style={{ marginBottom: "1rem" }} />
            <p style={{ fontSize: 16 }}>No products found</p>
          </div>
        )}

      </div>
    </div>
  );
};

const CatPill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{ background: active ? "#e8ff47" : "#111", border: `1px solid ${active ? "#e8ff47" : "#2a2a2a"}`, borderRadius: "100px", padding: "8px 18px", cursor: "pointer", color: active ? "#0a0a0a" : "#888", fontWeight: active ? 700 : 400, fontSize: 13, textTransform: "capitalize", transition: "all 0.2s" }}>{label}</button>
);

export const ProductCard = ({ product, onView, onAdd }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    try { await onAdd(); } finally { setAdding(false); }
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "16px", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s", transform: hovered ? "translateY(-4px)" : "none", borderColor: hovered ? "#333" : "#1e1e1e" }}>

      <div onClick={onView} style={{ height: 220, background: "#1a1a1a", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.image ? <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "unset" }} /> : <BsCart3 size={64} color="#2a2a2a" />}
        {product.stock === 0 && <div style={{ position: "absolute", top: 12, right: 12, background: "#ff4747", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>OUT OF STOCK</div>}
        {product.stock > 0 && product.stock <= 5 && <div style={{ position: "absolute", top: 12, right: 12, background: "#ff9a3c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100 }}>Only {product.stock} left</div>}
      </div>

      <div style={{ padding: "1.2rem" }}>
        <h3 onClick={onView} style={{ color: "#fff", margin: "0 0 0.4rem", fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h3>
        {product.description && <p style={{ color: "#666", margin: "0 0 1rem", fontSize: 13, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#e8ff47", fontSize: 20, fontWeight: 800 }}>₹{product.price?.toLocaleString()}</span>
          <button onClick={handleAdd} disabled={product.stock === 0 || adding} style={{ display: "flex", alignItems: "center", gap: "6px", background: product.stock === 0 ? "#222" : "#e8ff47", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: product.stock === 0 ? "not-allowed" : "pointer", color: product.stock === 0 ? "#555" : "#0a0a0a", fontWeight: 700, fontSize: 13, opacity: adding ? 0.7 : 1, transition: "opacity 0.2s" }}>
            <BsCart3 size={14} />
            {adding ? "Adding..." : product.stock === 0 ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "16px", overflow: "hidden" }}>
    <div style={{ height: 220, background: "#1a1a1a", animation: "pulse 1.5s infinite" }} />
    <div style={{ padding: "1.2rem" }}>
      <div style={{ height: 16, background: "#1a1a1a", borderRadius: 8, marginBottom: 8 }} />
      <div style={{ height: 12, background: "#1a1a1a", borderRadius: 8, width: "60%", marginBottom: 16 }} />
      <div style={{ height: 36, background: "#1a1a1a", borderRadius: 8 }} />
    </div>
  </div>
);

export default Shop;