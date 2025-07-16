import React from "react";

const noticeStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(255,255,255,0.97)",
  zIndex: 99999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Jost', 'Roboto', sans-serif",
};

const boxStyle = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: "16px",
  padding: "48px 32px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const DevNotice = () => (
  <div style={noticeStyle}>
    <div style={boxStyle}>
      <h1 style={{ fontSize: "2.2rem", marginBottom: 16, color: "#BD844C" }}>에끌라린</h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: 12 }}>현재 사이트는 개발중입니다</h2>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>
        더 나은 서비스를 위해 준비 중입니다.
        <br />
        곧 멋진 모습으로 찾아뵙겠습니다.
        <br />
        문의: <a href="mailto:info@eclarine.com">9851248@gmail.com</a>
      </p>
    </div>
  </div>
);

export default DevNotice;
