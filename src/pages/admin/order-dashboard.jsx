import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

const statusList = [
  { key: "결제확인대기", label: "결제대기", color: "#888" },
  { key: "발송준비", label: "발송준비", color: "#FF9800" },
  { key: "발송완료", label: "발송완료", color: "#4CAF50" },
];

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    fetchOrders();
  }, [dateRange]);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("order_form")
      .select("*")
      .gte("created_at", dateRange.start + "T00:00:00")
      .lte("created_at", dateRange.end + "T23:59:59")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  // 상태별 집계
  const statusSummary = statusList.map((s) => {
    const filtered = orders.filter((o) => o.status === s.key);
    const totalAmount = filtered.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    return { ...s, count: filtered.length, totalAmount };
  });
  // 전체 매출
  const totalSales = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  // 최근 주문 5건
  const recentOrders = orders.slice(0, 5);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#BD844C", marginBottom: 18 }}>
        에끌라린 주문 대시보드
      </h2>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <span style={{ fontWeight: 500 }}>기간:</span>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange((r) => ({ ...r, start: e.target.value }))}
          style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <span>~</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange((r) => ({ ...r, end: e.target.value }))}
          style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
        />
      </div>
      <div style={{ display: "flex", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
        {statusSummary.map((s) => (
          <div
            key={s.key}
            style={{
              background: "#f9f7f3",
              borderRadius: 10,
              padding: "18px 28px",
              minWidth: 180,
              boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              color: s.color,
              fontWeight: 700,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 16, color: "#333", fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 28, margin: "8px 0 4px 0" }}>{s.count}건</div>
            <div style={{ fontSize: 15, color: "#BD844C" }}>{s.totalAmount.toLocaleString()}원</div>
          </div>
        ))}
        <div
          style={{
            background: "#fffbe7",
            borderRadius: 10,
            padding: "18px 28px",
            minWidth: 180,
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            color: "#BD844C",
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 16, color: "#333", fontWeight: 500 }}>총 매출(합계)</div>
          <div style={{ fontSize: 28, margin: "8px 0 4px 0" }}>{totalSales.toLocaleString()}원</div>
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>최근 주문 5건</div>
        <table
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            fontSize: 15,
          }}
        >
          <thead style={{ background: "#f9f7f3" }}>
            <tr>
              <th style={{ padding: 8 }}>주문일</th>
              <th style={{ padding: 8 }}>닉네임</th>
              <th style={{ padding: 8 }}>이름</th>
              <th style={{ padding: 8 }}>금액</th>
              <th style={{ padding: 8 }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#aaa", padding: 16 }}>
                  최근 주문이 없습니다.
                </td>
              </tr>
            ) : (
              recentOrders.map((o) => (
                <tr key={o.id}>
                  <td style={{ padding: 8 }}>{formatDate(o.created_at)}</td>
                  <td style={{ padding: 8 }}>{o.nickname}</td>
                  <td style={{ padding: 8 }}>{o.name}</td>
                  <td style={{ padding: 8 }}>
                    {o.amount ? Number(o.amount).toLocaleString() + "원" : "-"}
                  </td>
                  <td style={{ padding: 8 }}>{o.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {loading && <div style={{ color: "#888", marginTop: 18 }}>로딩 중...</div>}
    </div>
  );
};

export default OrderDashboard;
