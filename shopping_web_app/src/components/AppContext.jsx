import {createContext,useContext,useState,useEffect,useCallback,useMemo,} from "react";
import { AxiosInstance } from "../helper/AxiosInstance";
import { ADD_TO_CART, GET_CART, LOGIN } from "../endpoints/EndPoints";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [toast, setToast] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (token && storedUser) setUser(storedUser);
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

 

const fetchCart = useCallback(async () => {
  try {
    setCartLoading(true);
    const { data } = await AxiosInstance.get(GET_CART);
    setCart(data);
  } catch (error) {
    setCart({ items: [] });
  } finally {
    setCartLoading(false);
  }
}, []);

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user, fetchCart]);

  const doLogin = useCallback(async (email, password) => {
    try {
      const { data } = await AxiosInstance.post(LOGIN, { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      showToast(error?.response?.data?.message || "Login failed", "error");
      throw error;
    }
  }, [showToast]);

  const doLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCart({ items: [] });
  }, []);

  const doAddToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await AxiosInstance.post(ADD_TO_CART, { productId, quantity });
      await fetchCart();
      showToast("Added to cart!");
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to add to cart", "error");
      throw error;
    }
  }, [fetchCart, showToast]);

  const cartCount = useMemo(
    () => cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
    [cart]
  );

  return (
    <AppContext.Provider value={{user,cart,setCart, cartCount,toast,fetchCart,doLogin,doLogout,doAddToCart,showToast,}}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);