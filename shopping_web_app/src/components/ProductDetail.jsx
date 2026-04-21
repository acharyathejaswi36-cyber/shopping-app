import { useState, useEffect } from "react";
import { useApp } from "./AppContext";
import { AxiosInstance } from "../helper/AxiosInstance";
import { GET_PRODUCT_BY_ID } from "../endpoints/EndPoints";

const ProductDetail = ({ productId, setPage }) => {
  const { doAddToCart, user, showToast } = useApp();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await AxiosInstance.get(
          GET_PRODUCT_BY_ID(productId)
        );
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAdd = async () => {
    if (!user) {
      showToast("Please login first", "error");
      setPage("login");
      return;
    }

    try {
      await doAddToCart(product._id, qty);
      showToast("Added to cart", "success");
    } catch (err) {
      showToast("Failed to add to cart", "error");
    }
  };

  if (loading) {
    return (
      <div style={loaderStyle}>
        <div style={{ color: "#666" }}>Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        
        <button onClick={() => setPage("shop")} style={backBtn}>
          Back to Shop
        </button>

        <div style={gridStyle}>
          
          <div style={imageBox}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={imgStyle}
              />
            ) : (
              <span style={{ fontSize: 100 }}>🛍️</span>
            )}
          </div>

          <div>
            <span style={categoryTag}>
              {product.category?.name || "Uncategorized"}
            </span>

            <h1 style={titleStyle}>{product.name}</h1>

            <p style={descStyle}>
              {product.description || "No description available."}
            </p>

            <h2 style={priceStyle}>
              ₹{product.price?.toLocaleString()}
            </h2>

            <p style={{ color: "#888" }}>
              Stock:{" "}
              <span style={{
                color:
                  product.stock > 5
                    ? "#4aff91"
                    : product.stock > 0
                    ? "#ff9a3c"
                    : "#ff4747",
                fontWeight: "bold",
              }}>
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </span>
            </p>

            {product.stock > 0 && (
              <div style={qtyWrapper}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={qtyBtn}
                >
                  −
                </button>

                <span style={qtyText}>{qty}</span>

                <button
                  onClick={() =>
                    setQty(Math.min(product.stock, qty + 1))
                  }
                  style={qtyBtn}
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              style={{
                ...addBtn,
                background:
                  product.stock === 0 ? "#222" : "#e8ff47",
                color:
                  product.stock === 0 ? "#555" : "#000",
                cursor:
                  product.stock === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: "100vh",
  background: "#0a0a0a",
  paddingTop: "64px",
};

const wrapperStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "3rem 2rem",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "4rem",
};

const imageBox = {
  background: "#111",
  borderRadius: "20px",
  overflow: "hidden",
  aspectRatio: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const titleStyle = {
  color: "#fff",
  fontSize: "2rem",
};

const descStyle = {
  color: "#888",
  marginBottom: "1rem",
};

const priceStyle = {
  color: "#e8ff47",
  fontSize: "2rem",
};

const categoryTag = {
  background: "#1a1a1a",
  padding: "5px 10px",
  borderRadius: "20px",
  color: "#aaa",
};

const qtyWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  margin: "1rem 0",
};

const qtyBtn = {
  background: "#222",
  color: "#fff",
  border: "none",
  padding: "10px",
  cursor: "pointer",
};

const qtyText = {
  color: "#fff",
};

const addBtn = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
};

const backBtn = {
  marginBottom: "1rem",
  background: "transparent",
  color: "#aaa",
  border: "1px solid #333",
  padding: "8px 12px",
  cursor: "pointer",
};

const loaderStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0a0a0a",
};

export default ProductDetail;