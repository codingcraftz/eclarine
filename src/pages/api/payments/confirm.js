const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { paymentKey, orderId, amount } = req.body;

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ message: "필수 파라미터가 누락되었습니다." });
  }

  try {
    // 토스페이먼츠 API 호출을 위한 인증 헤더 생성
    const encryptedSecretKey = Buffer.from(secretKey + ":").toString("base64");

    // 결제 승인 API 호출
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // 토스페이먼츠 에러 응답 처리
      console.error("토스페이먼츠 결제 승인 실패:", result);
      return res.status(response.status).json({
        code: result.code,
        message: result.message || "결제 승인 처리 중 오류가 발생했습니다.",
      });
    }

    // 성공 응답
    return res.status(200).json(result);
  } catch (error) {
    console.error("결제 승인 처리 중 오류:", error);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "결제 승인 처리 중 오류가 발생했습니다.",
    });
  }
}
