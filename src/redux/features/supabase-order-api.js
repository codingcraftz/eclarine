import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabase";

export const supabaseOrderApi = createApi({
  reducerPath: "supabaseOrderApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    // 주문 생성
    createOrder: builder.mutation({
      async queryFn(orderData) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .insert([
              {
                ...orderData,
                created_at: new Date().toISOString(),
                status: "pending",
              },
            ])
            .select()
            .single();

          if (error) throw error;

          // 주문 아이템들도 함께 저장
          if (orderData.items && orderData.items.length > 0) {
            const orderItems = orderData.items.map((item) => ({
              order_id: data.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            }));

            const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

            if (itemsError) throw itemsError;
          }

          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["Orders"],
    }),

    // 사용자의 모든 주문 조회
    getUserOrders: builder.query({
      async queryFn(userId) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select(
              `
              *,
              order_items (
                *,
                products (
                  id,
                  title,
                  image,
                  price
                )
              )
            `
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Orders"],
    }),

    // 특정 주문 조회
    getOrderById: builder.query({
      async queryFn(orderId) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select(
              `
              *,
              order_items (
                *,
                products (
                  id,
                  title,
                  image,
                  price
                )
              )
            `
            )
            .eq("id", orderId)
            .single();

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // 주문 상태 업데이트
    updateOrderStatus: builder.mutation({
      async queryFn({ orderId, status }) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .update({
              status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)
            .select()
            .single();

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }, "Orders"],
    }),

    // 결제 정보 저장
    savePaymentInfo: builder.mutation({
      async queryFn({ orderId, paymentData }) {
        try {
          const { data, error } = await supabase
            .from("payments")
            .insert([
              {
                order_id: orderId,
                payment_method: paymentData.payment_method,
                transaction_id: paymentData.transaction_id,
                amount: paymentData.amount,
                status: paymentData.status,
                created_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (error) throw error;

          // 주문 상태도 업데이트
          await supabase
            .from("orders")
            .update({
              status: "paid",
              payment_status: "completed",
            })
            .eq("id", orderId);

          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["Orders"],
    }),

    // 최근 주문들 (대시보드용)
    getRecentOrders: builder.query({
      async queryFn({ limit = 5 }) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useSavePaymentInfoMutation,
  useGetRecentOrdersQuery,
} = supabaseOrderApi;
