import React, { useState } from "react";
import dynamic from "next/dynamic";
import { supabaseService } from "../lib/supabase";
import { notifySuccess } from "../utils/toast";
import { ToastContainer } from "../utils/toast";

const DaumPostcode = dynamic(() => import("react-daum-postcode"), { ssr: false });

const initialState = {
  nickname: "",
  name: "",
  phone: "",
  address: "",
  addressDetail: "",
  payment: "계좌이체",
  request: "",
  files: [],
  amount: "",
};

const paymentOptions = [
  {
    label: "계좌이체 (카카오뱅크 3333-16-4570159 박*영)",
    value: "계좌이체",
  },
  {
    label: "카드결제 (폼 작성 완료 후 카카오톡으로 결제링크 요청부탁 드립니다.)",
    value: "카드결제",
  },
];

// 계좌정보 상수 분리
const accountInfo = {
  bank: "카카오뱅크",
  accountNumber: "3333164570159",
  accountDisplay: "카카오뱅크 3333-16-4570159",
  accountHolder: "박*영",
  tossOrigin: "에끌라린주문서",
  kakaoPayUrl: "https://qr.kakaopay.com/Ej9QfqGLl",
};
const tossUrl = `supertoss://send?bank=${encodeURIComponent(accountInfo.bank)}&accountNo=${
  accountInfo.accountNumber
}&origin=${encodeURIComponent(accountInfo.tossOrigin)}`;

const FormPage = () => {
  const [form, setForm] = useState(initialState);
  const [showPostcode, setShowPostcode] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [lastPayment, setLastPayment] = useState("");

  // 주소 검색 완료
  const handleComplete = (data) => {
    setForm({ ...form, address: data.address });
    setShowPostcode(false);
  };

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 전화번호 자동 하이픈 처리
    if (name === "phone") {
      let onlyNum = value.replace(/[^0-9]/g, "").slice(0, 11);
      let formatted = onlyNum;
      if (onlyNum.length >= 3 && onlyNum.length <= 7) {
        formatted = onlyNum.replace(/(\d{3})(\d{1,4})/, "$1-$2");
      } else if (onlyNum.length > 7) {
        formatted = onlyNum.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
      }
      setForm({ ...form, [name]: formatted });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 파일 업로드 (여러 번 추가 가능)
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // 중복 파일 방지(이름+사이즈 기준)
    const allFiles = [...form.files, ...newFiles].filter(
      (file, idx, arr) => arr.findIndex((f) => f.name === file.name && f.size === file.size) === idx
    );
    setForm({ ...form, files: allFiles });
    e.target.value = null; // 같은 파일 다시 선택 가능하게
  };

  // 파일 개별 삭제
  const handleRemoveFile = (idx) => {
    setForm({ ...form, files: form.files.filter((_, i) => i !== idx) });
  };

  // 필수값 검증
  const validate = () => {
    const newErrors = {};
    if (!form.nickname) newErrors.nickname = "유튜브 닉네임을 입력해주세요.";
    if (!form.name) newErrors.name = "이름을 입력해주세요.";
    if (!form.phone) newErrors.phone = "전화번호를 입력해주세요.";
    if (!form.address) newErrors.address = "주소를 입력해주세요.";
    if (form.files.length === 0) newErrors.files = "캡쳐사진을 업로드해주세요.";
    if (!form.payment) newErrors.payment = "결제 방법을 선택해주세요.";
    if (!form.amount) newErrors.amount = "금액을 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);
    try {
      // 1. 파일 업로드
      let captureUrls = [];
      if (form.files.length > 0) {
        const uploadResults = await supabaseService.uploadOrderCaptures(form.files);
        captureUrls = uploadResults.map((r) => r.publicUrl);
      }
      // 2. 주문 데이터 저장
      const orderData = {
        nickname: form.nickname,
        name: form.name,
        phone: form.phone,
        address: form.address,
        address_detail: form.addressDetail,
        payment: form.payment,
        request: form.request,
        status: "결제확인대기",
        capture_urls: captureUrls,
        amount: form.amount,
      };
      await supabaseService.createOrderForm(orderData);
      setLastPayment(form.payment);
      setShowSubmitModal(true);
      setForm(initialState);
    } catch (err) {
      setSubmitError("주문 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        style={{
          maxWidth: 520,
          margin: "40px auto",
          padding: 24,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#BD844C", marginBottom: 8 }}>
          💎 에끌라린 주문서 ✨
        </h1>
        <p style={{ fontSize: "1rem", color: "#333", marginBottom: 24 }}>
          안녕하세요 :)
          <br />
          에끌라린 제품을 주문해주셔서 감사합니다.
          <br />
          정확한 배송과 빠른 확인을 위해 아래 내용을 꼼꼼히 작성해주세요.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>유튜브 닉네임 *</label>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className="form-control"
            />
            {errors.nickname && <div style={{ color: "red", fontSize: 13 }}>{errors.nickname}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>이름 *</label>
            <input name="name" value={form.name} onChange={handleChange} className="form-control" />
            {errors.name && <div style={{ color: "red", fontSize: 13 }}>{errors.name}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>전화번호 *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control phone-input"
              placeholder="예시: 010-1234-5678"
            />
            <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
              숫자만 입력해 주세요. 자동으로 -가 입력됩니다.
            </div>
            {errors.phone && <div style={{ color: "red", fontSize: 13 }}>{errors.phone}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>주소 *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                name="address"
                value={form.address}
                readOnly
                className="form-control"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPostcode(true)}
                className="btn btn-outline-secondary btn-sm"
              >
                주소검색
              </button>
            </div>
            {showPostcode && (
              <div style={{ marginTop: 8 }}>
                <DaumPostcode
                  onComplete={handleComplete}
                  autoClose
                  style={{ border: "1px solid #eee" }}
                />
              </div>
            )}
            <input
              name="addressDetail"
              value={form.addressDetail}
              onChange={handleChange}
              className="form-control mt-2"
              placeholder="상세주소"
            />
            {errors.address && <div style={{ color: "red", fontSize: 13 }}>{errors.address}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>캡쳐사진(다중 업로드) *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
            {errors.files && <div style={{ color: "red", fontSize: 13 }}>{errors.files}</div>}
            {form.files.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {form.files.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      width: 70,
                      height: 70,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #eee",
                      background: "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        border: 0,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                      title="삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>금액 *</label>
            <input
              name="amount"
              value={form.amount}
              onChange={(e) => {
                // 숫자만 입력
                const v = e.target.value.replace(/[^0-9]/g, "");
                setForm({ ...form, amount: v });
              }}
              className="form-control amount-input"
              placeholder="예시: 50000"
              inputMode="numeric"
            />
            <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
              주문 금액을 숫자로 입력해 주세요.
            </div>
            {errors.amount && <div style={{ color: "red", fontSize: 13 }}>{errors.amount}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>결제 방법 *</label>
            <div>
              {paymentOptions.map((opt) => (
                <div key={opt.value} style={{ marginBottom: 4 }}>
                  <label style={{ fontWeight: 400 }}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.payment === opt.value}
                      onChange={handleChange}
                      style={{ marginRight: 6 }}
                    />
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
            {/* 계좌 복사/카카오페이/TOSS 송금 버튼: 계좌이체 선택 시만 노출 */}
            {form.payment === "계좌이체" && (
              <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end" }}>
                <a
                  href={tossUrl}
                  style={{
                    background: "#0064FF",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 15,
                    padding: "6px 14px",
                    textDecoration: "none",
                    display: "inline-block",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  TOSS 송금
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(accountInfo.accountDisplay);
                    notifySuccess("계좌번호가 복사되었습니다.");
                  }}
                  style={{
                    background: "#eee",
                    color: "#222",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 15,
                    padding: "6px 14px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  계좌 복사하기
                </button>
              </div>
            )}
            {errors.payment && <div style={{ color: "red", fontSize: 13 }}>{errors.payment}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>요청사항(선택)</label>
            <textarea
              name="request"
              value={form.request}
              onChange={handleChange}
              className="form-control"
              rows={2}
              placeholder="요청사항을 입력해주세요."
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ background: "#BD844C", border: 0 }}
            disabled={loading}
          >
            {loading ? "제출 중..." : "주문서 제출"}
          </button>
          {submitError && <div style={{ color: "red", marginTop: 8 }}>{submitError}</div>}
        </form>
        {showSubmitModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                maxWidth: 340,
                width: "90vw",
                padding: 28,
                textAlign: "center",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: "#BD844C", marginBottom: 10 }}>
                에끌라린 입니다.
              </div>
              <div style={{ fontSize: 16, color: "#333", marginBottom: 18 }}>
                소중한 주문 정말 감사합니다!
                <br />
                빠르게 확인 후 안내드릴 예정입니다.
              </div>
              {lastPayment === "카드결제" && (
                <div
                  style={{
                    fontSize: 15,
                    color: "#3C1E1E",
                    marginBottom: 16,
                    background: "#FEE500",
                    borderRadius: 10,
                    padding: 16,
                    fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span role="img" aria-label="kakao" style={{ fontSize: 22 }}>
                      🟡
                    </span>
                    카카오톡 카드결제 안내
                  </span>
                  <a
                    href="http://pf.kakao.com/_qxcWrn/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#3C1E1E",
                      color: "#FEE500",
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 16,
                      padding: "8px 18px",
                      margin: "10px 0 8px 0",
                      textDecoration: "none",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      letterSpacing: 0.5,
                    }}
                  >
                    카카오톡으로 결제링크 요청하기
                  </a>
                  <span style={{ fontSize: 15, color: "#3C1E1E", fontWeight: 400 }}>
                    위 버튼에서 <b>성함/금액</b>을 남겨주시면
                    <br />
                    빠르게 결제 링크를 전송드리겠습니다!
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                style={{
                  marginTop: 8,
                  background: "#BD844C",
                  color: "#fff",
                  border: 0,
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "8px 24px",
                  cursor: "pointer",
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}
        <div
          style={{
            marginTop: 32,
            fontSize: 14,
            color: "#444",
            background: "#f9f7f3",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <b>📦 배송 안내</b>
          <br />
          기본 배송은 주문 확인 후 영업일 기준 최대 7일 정도 소요될 수 있습니다.
          <br />
          주문 제작 상품의 경우, 제작 기간으로 인해 조금 더 시간이 걸릴 수 있는 점 양해
          부탁드립니다.
          <br />
          <br />
          <b>에끌라린 라이브 방송 교환/환불 정책</b>
          <br />
          1. <b>교환 및 환불 안내</b>
          <br />
          라이브 방송 중 구매하신 제품은 단순 변심에 의한 교환 및 환불이 어렵습니다.
          <br />
          구매 전 신중한 결정 부탁드립니다.
          <br />
          <br />
          2. <b>제품 불량 관련</b>
          <br />
          상품 수령 후 3일 이내 불량 여부를 확인해 주세요.
          <br />
          이후 접수되는 건은 사용에 의한 손상으로 간주되어 처리되지 않을 수 있습니다.
          <br />
          <br />
          3. <b>불량 처리 방식</b>
          <br />
          불량이 확인될 경우, 동일 상품으로 1회 교환해드립니다.
          <br />
          해당 상품의 재고가 없을 경우, 환불로 대체될 수 있습니다.
          <br />
          <br />
          4. <b>배송비 및 거래 취소 기준</b>
          <br />
          배송비 미입금 시 배송이 지연되거나 취소될 수 있습니다.
          <br />
          반복적인 주문 취소 고객은 주문이 제한될 수 있습니다.
          <br />
          <br />
          5. <b>주문 정보 정확성 필수</b>
          <br />
          주문서 작성 시, 성함/주소/연락처/닉네임 등의 정보는 반드시 정확하게 입력해주세요.
          <br />
          오기재로 인한 오배송은 고객님 부담으로 처리됩니다.
          <br />
        </div>
        <style jsx global>{`
          .phone-input::placeholder {
            color: #bbb !important;
            opacity: 1;
          }
        `}</style>
      </div>
    </>
  );
};

export default FormPage;
