// auth
export const REGISTER = "/api/auth/register";
export const LOGIN = "/api/auth/login";
export const FORGOT_PASSWORD = "/api/auth/forgot-password";
export const RESET_PASSWORD = "/api/auth/reset-password";

// otp
export const SEND_OTP = "/api/otp/send";
export const VERIFY_OTP = "/api/otp/verify";

// categories
export const GET_ALL_CATEGORIES = "/api/categories";
export const GET_CATEGORY_BY_ID = (categoryId) => `/api/categories/${categoryId}`;
export const GET_PRODUCTS_BY_CATEGORY = (categoryId) => `/api/categories/${categoryId}/products`; // ← was missing

// products
export const GET_ALL_PRODUCTS = "/api/products";
export const GET_PRODUCT_BY_ID = (productId) => `/api/products/${productId}`;
export const ADD_PRODUCT = "/api/products";
export const UPDATE_PRODUCT = (productId) => `/api/products/${productId}`;
export const DELETE_PRODUCT = (productId) => `/api/products/${productId}`;

// cart
export const GET_CART = "/api/cart/";
export const ADD_TO_CART = "/api/cart/";
export const UPDATE_CART = (productId) => `/api/cart/${productId}`;
export const REMOVE_FROM_CART = (productId) => `/api/cart/${productId}`;
export const CLEAR_CART = "/api/cart/";

// orders
export const PLACE_ORDER = "/api/orders/";
export const GET_USER_ORDERS = "/api/orders/";
export const GET_ORDER_BY_ID = (orderId) => `/api/orders/${orderId}`;
export const CANCEL_ORDER = (orderId) => `/api/orders/${orderId}/cancel`;
export const UPDATE_ORDER_STATUS = (orderId) => `/api/orders/${orderId}/status`;