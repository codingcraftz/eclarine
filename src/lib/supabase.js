import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 헬퍼 함수들
export const supabaseService = {
  // 상품 관련
  async getAllProducts() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;
    return data;
  },

  async getProductById(id) {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async getProductsByType(type) {
    const { data, error } = await supabase.from("products").select("*").eq("type", type);

    if (error) throw error;
    return data;
  },

  // 주문 관련
  async createOrder(orderData) {
    const { data, error } = await supabase.from("orders").insert([orderData]).select();

    if (error) throw error;
    return data[0];
  },

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // 카테고리 관련
  async getCategories() {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) throw error;
    return data;
  },

  // 쿠폰 관련
  async getCoupons() {
    const { data, error } = await supabase.from("coupons").select("*").eq("active", true);

    if (error) throw error;
    return data;
  },
};
