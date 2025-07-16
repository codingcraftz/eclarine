import React, { useEffect, useState } from "react";
import { supabaseService, supabase } from "../../lib/supabase";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const statusOptions = [
  { value: "결제확인대기", label: "결제확인대기" },
  { value: "결제확인", label: "결제확인" },
  { value: "발송준비", label: "발송준비" },
  { value: "발송완료", label: "발송완료" },
];

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 700;
}

// 토스트 알림 컴포넌트 추가
function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        background: type === "error" ? "#ff4d4f" : "#0989FF",
        color: "#fff",
        padding: "12px 28px",
        borderRadius: 8,
        fontWeight: 500,
        fontSize: 16,
        zIndex: 9999,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

const statusColor = {
  결제확인대기: "#888",
  결제확인: "#0989FF",
  발송준비: "#FF9800",
  발송완료: "#4CAF50",
};

// 주문일 포맷 함수 추가
function formatOrderDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const hh = d.getHours();
  const min = d.getMinutes();
  return `${yy}. ${mm < 10 ? "0" + mm : mm}. ${dd}. ${hh < 10 ? "0" + hh : hh}:${
    min < 10 ? "0" + min : min
  }`;
}

const AdminOrderFormPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgError, setImgError] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [filterStatus, setFilterStatus] = useState("전체");
  const statusFilterOptions = [
    { value: "전체", label: "전체" },
    { value: "결제확인대기", label: "결제대기" },
    { value: "발송준비", label: "발송준비" },
    { value: "발송완료", label: "발송완료" },
  ];
  // 정렬 및 검색 상태 추가
  const [orderAsc, setOrderAsc] = useState(false); // false: 내림차순(최신순), true: 오름차순(과거순)
  const [searchText, setSearchText] = useState("");

  // 검색 및 정렬 적용된 주문 목록
  const filteredOrders = (
    filterStatus === "전체" ? orders : orders.filter((o) => o.status === filterStatus)
  )
    .filter((o) => {
      if (!searchText.trim()) return true;
      const q = searchText.trim().toLowerCase();
      return (
        (o.name && o.name.toLowerCase().includes(q)) ||
        (o.nickname && o.nickname.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (orderAsc) {
        return new Date(a.created_at) - new Date(b.created_at);
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  const [toast, setToast] = useState({ message: "", type: "success" });
  // Lightbox 상태
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // 1. 주문 삭제 함수 추가
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("정말 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.")) return;
    try {
      const { error } = await supabase.from("order_form").delete().eq("id", orderId);
      if (error) throw error;
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setShowModal(false);
      setToast({ message: "주문이 삭제되었습니다.", type: "success" });
    } catch (err) {
      setToast({ message: "삭제 중 오류 발생", type: "error" });
    } finally {
      setTimeout(() => setToast({ message: "", type: "success" }), 2000);
    }
  };

  // 2. 주문 수정 상태 및 함수 추가
  const [editMode, setEditMode] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const startEditOrder = () => {
    setEditOrder({ ...selectedOrder });
    setEditMode(true);
  };
  const cancelEditOrder = () => {
    setEditMode(false);
    setEditOrder(null);
  };
  const handleEditInput = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({ ...prev, [name]: value }));
  };
  const saveEditOrder = async () => {
    if (!window.confirm("정말 수정하시겠습니까?")) return;
    try {
      const { error } = await supabase
        .from("order_form")
        .update({
          nickname: editOrder.nickname,
          name: editOrder.name,
          phone: editOrder.phone,
          address: editOrder.address,
          address_detail: editOrder.address_detail,
          payment: editOrder.payment,
          request: editOrder.request,
          amount: editOrder.amount,
        })
        .eq("id", editOrder.id);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => (o.id === editOrder.id ? { ...o, ...editOrder } : o)));
      setSelectedOrder((prev) => ({ ...prev, ...editOrder }));
      setEditMode(false);
      setEditOrder(null);
      setToast({ message: "수정이 완료되었습니다.", type: "success" });
    } catch (err) {
      setToast({ message: "수정 중 오류 발생", type: "error" });
    } finally {
      setTimeout(() => setToast({ message: "", type: "success" }), 2000);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("order_form")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data);
    } catch (err) {
      setError("주문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    setIsMobileView(isMobile());
    const handleResize = () => setIsMobileView(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 상태 변경
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("order_form")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      setToast({ message: "상태가 변경되었습니다.", type: "success" });
    } catch (err) {
      setToast({ message: "상태 변경 중 오류 발생", type: "error" });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setToast({ message: "", type: "success" }), 2000);
    }
  };

  // 주문 상세 모달 열기
  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setImgError("");
  };
  const closeOrderModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setImgError("");
  };

  // 이미지 업로드
  const handleImageUpload = async (e) => {
    setImgError("");
    setImgUploading(true);
    try {
      const files = Array.from(e.target.files);
      const uploadResults = await supabaseService.uploadOrderCaptures(files);
      const newUrls = uploadResults.map((r) => r.publicUrl);
      // DB에 추가
      const updatedUrls = [...(selectedOrder.capture_urls || []), ...newUrls];
      const { error } = await supabaseService.supabase
        .from("order_form")
        .update({ capture_urls: updatedUrls })
        .eq("id", selectedOrder.id);
      if (error) throw error;
      setSelectedOrder((prev) => ({ ...prev, capture_urls: updatedUrls }));
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, capture_urls: updatedUrls } : o))
      );
    } catch (err) {
      setImgError("이미지 업로드 실패: " + (err.message || ""));
    } finally {
      setImgUploading(false);
    }
  };

  // 이미지 삭제
  const handleImageDelete = async (url, idx) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setImgUploading(true);
    setImgError("");
    try {
      // 파일 경로 추출
      const path = url.split("/order-captures/")[1];
      await supabaseService.supabase.storage.from("order-captures").remove([path]);
      // DB에서 제거
      const updatedUrls = selectedOrder.capture_urls.filter((u, i) => i !== idx);
      const { error } = await supabaseService.supabase
        .from("order_form")
        .update({ capture_urls: updatedUrls })
        .eq("id", selectedOrder.id);
      if (error) throw error;
      setSelectedOrder((prev) => ({ ...prev, capture_urls: updatedUrls }));
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, capture_urls: updatedUrls } : o))
      );
    } catch (err) {
      setImgError("이미지 삭제 실패: " + (err.message || ""));
    } finally {
      setImgUploading(false);
    }
  };

  // 주문 상세 카드/모달
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    return (
      <div
        className="modal-backdrop"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={closeOrderModal}
      >
        <div
          className="modal-content"
          style={{
            background: "#fff",
            borderRadius: 12,
            maxWidth: 420,
            width: "95vw",
            padding: 24,
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeOrderModal}
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              background: "none",
              border: 0,
              fontSize: 22,
              color: "#888",
            }}
          >
            &times;
          </button>
          <h3 style={{ color: "#BD844C", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
            주문 상세
          </h3>
          <div style={{ fontSize: 15, marginBottom: 8, color: "#222" }}>
            <b>주문일:</b> {formatOrderDate(selectedOrder.created_at)}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>닉네임:</b>{" "}
            {editMode ? (
              <input name="nickname" value={editOrder.nickname ?? ""} onChange={handleEditInput} />
            ) : (
              selectedOrder.nickname
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>이름:</b>{" "}
            {editMode ? (
              <input name="name" value={editOrder.name ?? ""} onChange={handleEditInput} />
            ) : (
              selectedOrder.name
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>전화번호:</b>{" "}
            {editMode ? (
              <input name="phone" value={editOrder.phone ?? ""} onChange={handleEditInput} />
            ) : (
              selectedOrder.phone
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8, color: "#222" }}>
            <b>주소:</b>{" "}
            {editMode ? (
              <>
                <input
                  name="address"
                  value={editOrder.address ?? ""}
                  onChange={handleEditInput}
                  style={{ width: 180, fontSize: 15, color: "#222", fontWeight: 400 }}
                />
                <input
                  name="address_detail"
                  value={editOrder.address_detail ?? ""}
                  onChange={handleEditInput}
                  placeholder="상세주소"
                  style={{
                    marginLeft: 6,
                    width: 100,
                    fontSize: 15,
                    color: "#222",
                    fontWeight: 400,
                  }}
                />
              </>
            ) : (
              <>
                <span style={{ fontSize: 15, color: "#222", fontWeight: 400 }}>
                  {selectedOrder.address}
                </span>
                {selectedOrder.address_detail && (
                  <span style={{ marginLeft: 6, fontSize: 15, color: "#222", fontWeight: 400 }}>
                    {selectedOrder.address_detail}
                  </span>
                )}
              </>
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>금액:</b>{" "}
            {editMode ? (
              <input name="amount" value={editOrder.amount ?? ""} onChange={handleEditInput} />
            ) : selectedOrder.amount ? (
              Number(selectedOrder.amount).toLocaleString() + "원"
            ) : (
              "-"
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>결제방법:</b>{" "}
            {editMode ? (
              <select name="payment" value={editOrder.payment ?? ""} onChange={handleEditInput}>
                <option value="계좌이체">계좌이체</option>
                <option value="카드결제">카드결제</option>
              </select>
            ) : (
              selectedOrder.payment
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>상태:</b>{" "}
            <select
              value={selectedOrder.status}
              onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
              style={{ minWidth: 100 }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>요청사항:</b>{" "}
            {editMode ? (
              <textarea
                name="request"
                value={editOrder.request ?? ""}
                onChange={handleEditInput}
                rows={2}
                style={{ width: 220 }}
              />
            ) : (
              selectedOrder.request || <span style={{ color: "#aaa" }}>없음</span>
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>캡쳐사진:</b>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {selectedOrder.capture_urls && selectedOrder.capture_urls.length > 0 ? (
              selectedOrder.capture_urls.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #eee",
                    background: "#fafafa",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setLightboxImages(selectedOrder.capture_urls.map((u) => ({ src: u })));
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={url}
                    alt="캡쳐"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(url, idx);
                    }}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      border: 0,
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span style={{ color: "#aaa" }}>없음</span>
            )}
          </div>
          <div style={{ marginBottom: 8 }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imgUploading}
              style={{ width: "100%" }}
            />
            {imgUploading && <div style={{ color: "#0989FF", fontSize: 13 }}>업로드 중...</div>}
            {imgError && <div style={{ color: "red", fontSize: 13 }}>{imgError}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
            {!editMode ? (
              <>
                <button
                  onClick={startEditOrder}
                  style={{
                    background: "#0989FF",
                    color: "#fff",
                    border: 0,
                    borderRadius: 6,
                    padding: "7px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  수정하기
                </button>
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  style={{
                    background: "#ff4d4f",
                    color: "#fff",
                    border: 0,
                    borderRadius: 6,
                    padding: "7px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  삭제하기
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={saveEditOrder}
                  style={{
                    background: "#4CAF50",
                    color: "#fff",
                    border: 0,
                    borderRadius: 6,
                    padding: "7px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
                <button
                  onClick={cancelEditOrder}
                  style={{
                    background: "#888",
                    color: "#fff",
                    border: 0,
                    borderRadius: 6,
                    padding: "7px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 모바일 카드형 UI 개선: 상태 드롭다운 추가
  const renderMobileList = (list) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {list.map((order) => (
        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            padding: 16,
            fontSize: 15,
            minWidth: 0,
          }}
        >
          <div style={{ fontWeight: 700, color: "#BD844C", marginBottom: 4, fontSize: 18 }}>
            {order.nickname}{" "}
            <span style={{ color: "#888", fontWeight: 400, fontSize: 14 }}>({order.name})</span>
          </div>
          <div style={{ color: "#666", fontSize: 13, marginBottom: 4 }}>
            {formatOrderDate(order.created_at)}
          </div>
          <div style={{ marginBottom: 4 }}>
            <b>금액:</b> {order.amount ? Number(order.amount).toLocaleString() + "원" : "-"}
          </div>
          <div style={{ marginBottom: 4 }}>
            <b>상태:</b>{" "}
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              disabled={updatingId === order.id}
              style={{
                minWidth: 110,
                color: statusColor[order.status] || "#333",
                fontWeight: 600,
                border: updatingId === order.id ? "1.5px solid #0989FF" : "1px solid #ccc",
                background: updatingId === order.id ? "#f0f8ff" : "#fff",
                borderRadius: 6,
                padding: "2px 8px",
                outline: "none",
                marginLeft: 4,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ color: statusColor[opt.value] }}>
                  {opt.label}
                </option>
              ))}
            </select>
            {updatingId === order.id && (
              <span style={{ marginLeft: 6, color: "#0989FF", fontSize: 13 }}>⏳</span>
            )}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>주소:</b> {order.address}{" "}
            <span style={{ color: "#888" }}>{order.address_detail}</span>
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>결제방법:</b> {order.payment}
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>캡쳐사진:</b> {order.capture_urls?.length || 0}장
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {order.capture_urls &&
              order.capture_urls.length > 0 &&
              order.capture_urls.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "inline-block",
                    width: 48,
                    height: 48,
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid #eee",
                    background: "#fafafa",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setLightboxImages(order.capture_urls.map((u) => ({ src: u })));
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={url}
                    alt="캡쳐"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => openOrderModal(order)}
              style={{
                background: "#f3f4f6",
                color: "#0989FF",
                border: 0,
                borderRadius: 6,
                padding: "6px 14px",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              상세 보기
            </button>
          </div>
        </div>
      ))}
      {showModal && renderOrderDetail()}
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 12 }}>
      <h2
        style={{ fontSize: "1.4rem", fontWeight: 700, color: "#BD844C", margin: "16px 0 24px 0" }}
      >
        에끌라린 주문서 관리
      </h2>
      {/* 상태별 필터 버튼 + 검색/정렬 UI */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {statusFilterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            style={{
              background: filterStatus === opt.value ? "#0989FF" : "#f3f4f6",
              color: filterStatus === opt.value ? "#fff" : "#333",
              border: 0,
              borderRadius: 6,
              padding: "8px 16px",
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
        {/* 검색 input */}
        <input
          type="text"
          placeholder="이름/닉네임 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            marginLeft: 12,
            padding: "7px 12px",
            border: "1px solid #ccc",
            borderRadius: 6,
            fontSize: 15,
            minWidth: 160,
          }}
        />
        {/* 정렬 토글 버튼 */}
        <button
          onClick={() => setOrderAsc((v) => !v)}
          style={{
            marginLeft: 4,
            background: "#f3f4f6",
            color: "#333",
            border: 0,
            borderRadius: 6,
            padding: "8px 14px",
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer",
          }}
          title={orderAsc ? "주문일 오름차순" : "주문일 내림차순"}
        >
          {orderAsc ? "▲ 오래된순" : "▼ 최신순"}
        </button>
      </div>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div>주문 내역이 없습니다.</div>
      ) : isMobileView ? (
        renderMobileList(filteredOrders)
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            className="table table-bordered"
            style={{ fontSize: 15, background: "#fff", minWidth: 900 }}
          >
            <thead style={{ background: "#f9f7f3" }}>
              <tr>
                <th>주문일</th>
                <th>닉네임</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>주소</th>
                <th>결제방법</th>
                <th>상태</th>
                <th>캡쳐사진</th>
                <th>금액</th>
                <th>요청사항</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ cursor: "pointer" }}>
                  <td onClick={() => openOrderModal(order)}>{formatOrderDate(order.created_at)}</td>
                  <td onClick={() => openOrderModal(order)}>{order.nickname}</td>
                  <td onClick={() => openOrderModal(order)}>{order.name}</td>
                  <td onClick={() => openOrderModal(order)}>{order.phone}</td>
                  <td onClick={() => openOrderModal(order)}>
                    {order.address}
                    <br />
                    <span style={{ color: "#888", fontSize: 13 }}>{order.address_detail}</span>
                  </td>
                  <td onClick={() => openOrderModal(order)}>{order.payment}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      style={{
                        minWidth: 110,
                        color: statusColor[order.status] || "#333",
                        fontWeight: 600,
                        border: updatingId === order.id ? "1.5px solid #0989FF" : "1px solid #ccc",
                        background: updatingId === order.id ? "#f0f8ff" : "#fff",
                        borderRadius: 6,
                        padding: "2px 8px",
                        outline: "none",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          style={{ color: statusColor[opt.value] }}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {updatingId === order.id && (
                      <span style={{ marginLeft: 6, color: "#0989FF", fontSize: 13 }}>⏳</span>
                    )}
                  </td>
                  <td onClick={() => openOrderModal(order)}>
                    {order.capture_urls && order.capture_urls.length > 0 ? (
                      <span
                        style={{ textDecoration: "underline", color: "#0989FF", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImages(order.capture_urls.map((u) => ({ src: u })));
                          setLightboxIndex(0);
                          setLightboxOpen(true);
                        }}
                      >
                        {order.capture_urls.length}장
                      </span>
                    ) : (
                      <span style={{ color: "#aaa" }}>없음</span>
                    )}
                  </td>
                  <td onClick={() => openOrderModal(order)}>
                    {order.amount ? Number(order.amount).toLocaleString() + "원" : "-"}
                  </td>
                  <td
                    style={{ maxWidth: 180, wordBreak: "break-all" }}
                    onClick={() => openOrderModal(order)}
                  >
                    {order.request}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && renderOrderDetail()}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxImages}
        index={lightboxIndex}
        styles={{ container: { zIndex: 30000 } }}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
};

export default AdminOrderFormPage;
