import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { orderId, paymentKey, amount, orderItems, shippingInfo, userId } = req.body;

  // 필수 데이터 검증
  if (!orderId || !paymentKey || !amount || !orderItems || !shippingInfo) {
    console.error("필수 데이터 누락:", { orderId, paymentKey, amount, orderItems, shippingInfo });
    return res.status(400).json({
      message: "필수 데이터가 누락되었습니다.",
      details: {
        orderId: !orderId,
        paymentKey: !paymentKey,
        amount: !amount,
        orderItems: !orderItems,
        shippingInfo: !shippingInfo,
      },
    });
  }

  try {
    console.log("주문 생성 시도:", {
      orderId,
      amount,
      itemCount: orderItems.length,
      shippingInfo: {
        ...shippingInfo,
        email: shippingInfo.email ? "***" : undefined,
        phone: shippingInfo.phone ? "***" : undefined,
      },
    });

    // 주문 정보 저장
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        payment_key: paymentKey,
        payment_status: "DONE",
        payment_method: "TOSS_PAYMENTS",
        paid_amount: amount,
        paid_at: new Date().toISOString(),
        total_amount: amount,
        items: orderItems,
        shipping_address: shippingInfo,
        user_id: userId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase 주문 저장 실패:", error);
      throw error;
    }

    console.log("주문 생성 성공:", { orderId, amount });
    return res.status(200).json(data);
  } catch (error) {
    console.error("주문 생성 중 오류:", error);

    // Supabase 에러 상세 정보 포함
    if (error.code) {
      return res.status(500).json({
        message: "주문 정보 저장 중 오류가 발생했습니다.",
        code: error.code,
        details: error.message,
      });
    }

    return res.status(500).json({
      message: "주문 정보 저장 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
}
