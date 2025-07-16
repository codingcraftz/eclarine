import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 헬퍼 함수들
export const supabaseService = {
  // 상품 관련
  async getAllProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getProductById(id) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getProductsByType(type) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .eq("type", type);

    if (error) throw error;
    return data;
  },

  // 홈페이지용 상품 조회 함수들
  async getPopularProducts(limit = 8) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .eq("status", "active")
      .eq("is_popular", true)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getBestsellerProducts(limit = 8) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .eq("status", "active")
      .eq("is_bestseller", true)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getFeaturedProducts(limit = 8) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .eq("status", "active")
      .eq("is_featured", true)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getProductsByCategory(categorySlug, limit = null) {
    let query = supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .eq("status", "active")
      .eq("categories.slug", categorySlug)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getActiveProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // 관리자용 상품 관리
  async createProduct(productData) {
    const { data, error } = await supabase.from("products").insert([productData]).select().single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id, productData) {
    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  },

  async getProductsWithPagination(page = 1, limit = 10, search = "", status = "") {
    let query = supabase.from("products").select(
      `
        *,
        categories (
          id,
          name,
          slug
        ),
        brands (
          id,
          name,
          slug
        )
      `,
      { count: "exact" }
    );

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    // 상태 필터
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;
    return { data, count };
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

  async getAllOrders() {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // 각 주문에 대해 사용자 정보를 별도로 가져오기
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        if (order.user_id) {
          const { data: userProfile } = await supabase
            .from("user_profiles")
            .select("name, email, phone")
            .eq("id", order.user_id)
            .single();

          return {
            ...order,
            user_profiles: userProfile,
          };
        }
        return order;
      })
    );

    return ordersWithUsers;
  },

  // 카테고리 관련
  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data;
  },

  async createCategory(categoryData) {
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 브랜드 관련
  async getBrands() {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  async createBrand(brandData) {
    const { data, error } = await supabase.from("brands").insert([brandData]).select().single();

    if (error) throw error;
    return data;
  },

  // 쿠폰 관련
  async getCoupons() {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createCoupon(couponData) {
    const { data, error } = await supabase.from("coupons").insert([couponData]).select().single();

    if (error) throw error;
    return data;
  },

  // 통계 관련
  async getDashboardStats() {
    const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    ]);

    // 총 매출 계산
    const { data: revenueData, error: revenueError } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "completed");

    const totalRevenue =
      revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    // 재고 부족 상품 수
    const { count: lowStockCount, error: lowStockError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .lt("quantity", 10);

    // 신규 주문 수 (오늘)
    const today = new Date().toISOString().split("T")[0];
    const { count: newOrdersCount, error: newOrdersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today);

    return {
      totalProducts: productsResponse.count || 0,
      totalOrders: ordersResponse.count || 0,
      totalUsers: usersResponse.count || 0,
      totalRevenue: totalRevenue,
      lowStockProducts: lowStockCount || 0,
      newOrders: newOrdersCount || 0,
    };
  },

  // 최근 주문 가져오기
  async getRecentOrders(limit = 5) {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // 각 주문에 대해 사용자 정보를 별도로 가져오기
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        if (order.user_id) {
          const { data: userProfile } = await supabase
            .from("user_profiles")
            .select("name, email, phone")
            .eq("id", order.user_id)
            .single();

          return {
            ...order,
            user_profiles: userProfile,
          };
        }
        return order;
      })
    );

    return ordersWithUsers;
  },

  // 재고 부족 상품 가져오기
  async getLowStockProducts(limit = 10) {
    const { data, error } = await supabase
      .from("products")
      .select("id, title, quantity, low_stock_threshold")
      .lt("quantity", 10)
      .order("quantity", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Storage 관련 함수들
  // 이미지 업로드
  async uploadImage(file, bucket = "product-images", folder = "products") {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) throw error;

      // 공개 URL 생성
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return {
        path: filePath,
        publicUrl: publicData.publicUrl,
      };
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      throw error;
    }
  },

  // 이미지 삭제
  async deleteImage(filePath, bucket = "product-images") {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("이미지 삭제 오류:", error);
      throw error;
    }
  },

  // 이미지 URL 가져오기
  getImageUrl(filePath, bucket = "product-images") {
    if (!filePath) return null;

    // 이미 전체 URL인 경우
    if (filePath.startsWith("http")) {
      return filePath;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  },

  // 여러 이미지 업로드
  async uploadMultipleImages(files, bucket = "product-images", folder = "products") {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, bucket, folder));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("여러 이미지 업로드 오류:", error);
      throw error;
    }
  },

  // 이미지 리사이징 (선택사항 - 클라이언트에서 처리)
  async resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;

        // 비율 계산
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        const newWidth = width * ratio;
        const newHeight = height * ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  },

  // 상품 이미지 업데이트 (기존 이미지 삭제 후 새 이미지 업로드)
  async updateProductImages(productId, newImages, oldImagePaths = []) {
    try {
      // 기존 이미지 삭제
      if (oldImagePaths.length > 0) {
        await Promise.all(oldImagePaths.map((path) => this.deleteImage(path)));
      }

      // 새 이미지 업로드
      const uploadResults = await this.uploadMultipleImages(newImages);

      // 상품 정보 업데이트
      const imageUrls = uploadResults.map((result) => result.publicUrl);
      const { data, error } = await supabase
        .from("products")
        .update({
          featured_image: imageUrls[0] || null,
          gallery_images: imageUrls.length > 1 ? imageUrls.slice(1) : [],
        })
        .eq("id", productId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("상품 이미지 업데이트 오류:", error);
      throw error;
    }
  },

  // 주문서용 캡쳐사진 업로드
  async uploadOrderCaptures(files) {
    // order-captures 버킷, order-forms 폴더에 저장
    return this.uploadMultipleImages(files, "order-captures", "order-forms");
  },

  // 주문서(order_form) 생성
  async createOrderForm(orderData) {
    const { data, error } = await supabase.from("order_form").insert([orderData]).select().single();
    if (error) throw error;
    return data;
  },
};
