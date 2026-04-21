import { useState } from "react";
import { AppProvider, useApp } from "./components/AppContext";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Login from "./components/login/register/Login";
import Register from "./components/login/register/Register";
import ForgotPassword from "./components/login/register/ForgotPassword";
import Shop from "./components/Shop";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Orders from "./components/Orders";

const AppInner = () => {
  const { user } = useApp();
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = (p) => {
    if ((p === "cart" || p === "orders") && !user) {
      setPage("login");
      return;
    }
    setPage(p);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <Home setPage={navigate} />;
      case "login": return <Login setPage={navigate} />;
      case "register": return <Register setPage={navigate} />;
      case "forgot": return <ForgotPassword setPage={navigate} />;
      case "shop": return <Shop setPage={navigate} setSelectedProduct={setSelectedProduct} />;
      case "product": return <ProductDetail productId={selectedProduct} setPage={navigate} />;
      case "cart": return <Cart setPage={navigate} />;
      case "orders": return <Orders setPage={navigate} />;
      default: return <Home setPage={navigate} />;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar page={page} setPage={navigate} />
      <main>{renderPage()}</main>
      <Toast />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <AppInner />
  </AppProvider>
);

export default App;
