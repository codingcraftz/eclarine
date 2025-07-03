import React from "react";
import Image from "next/image";
import Link from "next/link";

const FooterSimple = () => {
  return (
    <footer>
      <div
        className="tp-footer-area"
        style={{ backgroundColor: "#f8f9fa", padding: "40px 0 20px" }}
      >
        <div className="container">
          {/* 메인 푸터 영역 */}
          <div className="row mb-4">
            {/* 좌측 - 고객센터 */}
            <div className="col-lg-4 col-md-6 mb-3">
              <div className="tp-footer-simple-section">
                <h5 className="mb-3" style={{ fontSize: "16px", fontWeight: "600" }}>
                  고객센터
                </h5>
                <div className="mb-2">
                  <strong>카카오톡 특상담</strong>
                </div>
                <div>
                  <a
                    href="http://pf.kakao.com/_qxcWrn"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    카카오톡 상담하기
                  </a>
                </div>
              </div>
            </div>

            {/* 중앙 - 무통장 계좌안내 */}
            <div className="col-lg-4 col-md-6 mb-3">
              <div className="tp-footer-simple-section">
                <h5 className="mb-3" style={{ fontSize: "16px", fontWeight: "600" }}>
                  무통장 계좌안내
                </h5>
                <div className="mb-1">
                  <strong>KB국민은행 430502014057008</strong>
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>(예금주: 박준영)</div>
              </div>
            </div>

            {/* 우측 - 약관 */}
            <div className="col-lg-4 col-md-12 mb-3">
              <div className="tp-footer-simple-section">
                <div>
                  <div className="mb-2">
                    <Link
                      href="/terms-of-service"
                      style={{ color: "#333", textDecoration: "none", fontSize: "14px" }}
                    >
                      이용약관
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/privacy-policy"
                      style={{ color: "#333", textDecoration: "none", fontSize: "14px" }}
                    >
                      개인정보보호방침
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <hr style={{ margin: "20px 0", borderColor: "#e0e0e0" }} />

          {/* 하단 회사정보 */}
          <div className="row">
            <div className="col-12">
              <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
                <div className="mb-2">
                  <strong>구름섬컴퍼니</strong> 대표자 박준영 이메일
                  <a href="mailto:9851248@gmail.com" style={{ color: "#666" }}>
                    {" "}
                    9851248@gmail.com
                  </a>
                  사업자번호 632-07-03327 통신판매업신고번호 2025-화도수동-0427
                </div>
                <div className="mb-2">
                  주소 [12175] 경기 남양주시 화도읍 마석중앙로37번길 45 (마석우리, 별나라프라자)
                  504호
                </div>
                <div
                  style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e0e0e0" }}
                >
                  <span style={{ color: "#333" }}>Copyright © 에끌라린. All Rights Reserved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSimple;
