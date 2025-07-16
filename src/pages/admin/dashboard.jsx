import React from "react";
import { useRouter } from "next/router";

const AdminDashboard = () => {
  const router = useRouter();
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#BD844C", marginBottom: 24 }}>
        에끌라린 관리자
      </h2>
      <button
        onClick={() => router.push("/admin/order-form")}
        style={{
          background: "#0989FF",
          color: "#fff",
          fontSize: 18,
          padding: "16px 0",
          border: 0,
          borderRadius: 8,
          width: "100%",
          marginBottom: 16,
        }}
      >
        주문서 관리 바로가기
      </button>
      <div style={{ color: "#888", fontSize: 14, marginTop: 24 }}>
        <b>관리자 기능 준비중</b>
        <br />
        (추후 더 많은 관리 기능이 추가될 예정입니다)
      </div>
    </div>
  );
};

export default AdminDashboard;
