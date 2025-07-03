import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabaseService } from "@/lib/supabase";

export const supabaseProductApi = createApi({
  reducerPath: "supabaseProductApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Products", "Product", "Categories"],
  endpoints: (builder) => ({
    // 모든 상품 조회
    getAllProducts: builder.query({
      async queryFn() {
        try {
          const data = await supabaseService.getAllProducts();
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Products"],
    }),

    // 상품 ID로 조회
    getProductById: builder.query({
      async queryFn(id) {
        try {
          const data = await supabaseService.getProductById(id);
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // 타입별 상품 조회
    getProductsByType: builder.query({
      async queryFn({ type, filters = {} }) {
        try {
          let data = await supabaseService.getProductsByType(type);

          // 필터 적용 (가격, 카테고리 등)
          if (filters.minPrice) {
            data = data.filter((product) => product.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            data = data.filter((product) => product.price <= filters.maxPrice);
          }
          if (filters.category) {
            data = data.filter((product) => product.category === filters.category);
          }

          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Products"],
    }),

    // 인기 상품 조회
    getPopularProducts: builder.query({
      async queryFn(type) {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("type", type)
            .eq("is_popular", true)
            .limit(10);

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Products"],
    }),

    // 할인 상품 조회
    getOfferProducts: builder.query({
      async queryFn(type) {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("type", type)
            .gt("discount", 0)
            .order("discount", { ascending: false });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Products"],
    }),

    // 카테고리 조회
    getCategories: builder.query({
      async queryFn() {
        try {
          const data = await supabaseService.getCategories();
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByTypeQuery,
  useGetPopularProductsQuery,
  useGetOfferProductsQuery,
  useGetCategoriesQuery,
} = supabaseProductApi;
