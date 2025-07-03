import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

// Supabase APIs
import { supabaseProductApi } from "./features/supabase-product-api";
import { supabaseAuthApi } from "./features/supabase-auth-api";
import { supabaseOrderApi } from "./features/supabase-order-api";

// 기존 슬라이스들
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cartSlice";
import compareSlice from "./features/compareSlice";
import productModalSlice from "./features/productModalSlice";
import shopFilterSlice from "./features/shop-filter-slice";
import wishlistSlice from "./features/wishlist-slice";
import couponSlice from "./features/coupon/couponSlice";
import orderSlice from "./features/order/orderSlice";

const store = configureStore({
  reducer: {
    // 기존 API (필요시 유지)
    [apiSlice.reducerPath]: apiSlice.reducer,

    // Supabase APIs
    [supabaseProductApi.reducerPath]: supabaseProductApi.reducer,
    [supabaseAuthApi.reducerPath]: supabaseAuthApi.reducer,
    [supabaseOrderApi.reducerPath]: supabaseOrderApi.reducer,

    // 기존 슬라이스들
    auth: authSlice,
    productModal: productModalSlice,
    shopFilter: shopFilterSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    compare: compareSlice,
    coupon: couponSlice,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      supabaseProductApi.middleware,
      supabaseAuthApi.middleware,
      supabaseOrderApi.middleware,
    ]),
});

export default store;
