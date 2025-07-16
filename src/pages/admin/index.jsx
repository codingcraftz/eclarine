import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 간단한 하드코딩된 인증
    if (credentials.username === "admin" && credentials.password === "admin123") {
      // 세션 저장
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          username: "admin",
          role: "admin",
          loginTime: new Date().toISOString(),
        })
      );

      // 대시보드로 리다이렉트
      router.push("/admin/dashboard");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>에끌라린 관리자 로그인</title>
        <meta name="description" content="에끌라린 쇼핑몰 관리자 로그인" />
      </Head>

      <div
        className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* 배경 패턴 */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <div
            className="position-absolute rounded-circle"
            style={{
              width: "24rem",
              height: "24rem",
              top: "-12rem",
              left: "-12rem",
              background: "linear-gradient(45deg, #0989FF, #BD844C)",
            }}
          />
          <div
            className="position-absolute rounded-circle"
            style={{
              width: "20rem",
              height: "20rem",
              bottom: "-10rem",
              right: "-10rem",
              background: "linear-gradient(45deg, #678E61, #0989FF)",
            }}
          />
          <div
            className="position-absolute rounded-circle"
            style={{
              width: "16rem",
              height: "16rem",
              top: "33%",
              right: "25%",
              background: "linear-gradient(45deg, #BD844C, #678E61)",
            }}
          />
        </div>

        <div className="container position-relative" style={{ zIndex: 10 }}>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              {/* 메인 로그인 카드 */}
              <div
                className="card shadow-lg border-0 rounded-4 overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              >
                {/* 브랜드 헤더 */}
                <div
                  className="text-center py-5 px-4"
                  style={{ background: "linear-gradient(to right, #f8fafc, #e0f2fe)" }}
                >
                  <div className="mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3 shadow-lg mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                      }}
                    >
                      <span className="text-white fs-3 fw-bold">E</span>
                    </div>
                    <h1 className="fs-2 fw-bold text-primary mb-2">ECLARINE</h1>
                    <p className="text-muted small">프리미엄 주얼리 관리 시스템</p>
                  </div>
                </div>

                {/* 로그인 폼 */}
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    {/* 관리자 아이디 */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">관리자 아이디</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          name="username"
                          value={credentials.username}
                          onChange={handleChange}
                          placeholder="관리자 아이디를 입력하세요"
                          required
                          className="form-control form-control-lg bg-light border-2 rounded-3"
                          style={{ paddingRight: "3rem" }}
                        />
                        <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                          <svg
                            className="text-muted"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">비밀번호</label>
                      <div className="position-relative">
                        <input
                          type="password"
                          name="password"
                          value={credentials.password}
                          onChange={handleChange}
                          placeholder="비밀번호를 입력하세요"
                          required
                          className="form-control form-control-lg bg-light border-2 rounded-3"
                          style={{ paddingRight: "3rem" }}
                        />
                        <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                          <svg
                            className="text-muted"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                      <div
                        className="alert alert-danger d-flex align-items-center mb-3"
                        role="alert"
                      >
                        <svg
                          className="me-2"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {error}
                      </div>
                    )}

                    {/* 로그인 버튼 */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-lg w-100 fw-semibold py-3 rounded-3 shadow-sm"
                      style={{
                        background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                        border: "none",
                        color: "white",
                      }}
                    >
                      {isLoading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <div
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></div>
                          로그인 중...
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                          <svg
                            className="me-2"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          관리자 로그인
                        </div>
                      )}
                    </button>
                  </form>

                  {/* 브랜드 메시지 */}
                  <div className="mt-4 text-center">
                    <div
                      className="bg-light rounded-3 p-3 border"
                      style={{ borderColor: "rgba(13, 110, 253, 0.25)" }}
                    >
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <svg
                          className="text-primary me-2"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span className="small fw-semibold text-primary">에끌라린 관리 시스템</span>
                      </div>
                      <p className="small text-primary mb-0">
                        프리미엄 주얼리 브랜드의 전문적인 관리 도구
                      </p>
                    </div>
                  </div>

                  {/* 테스트 계정 정보 */}
                  <div className="mt-3 text-center">
                    <div
                      className="rounded-3 p-3 border"
                      style={{
                        backgroundColor: "rgba(255, 193, 7, 0.1)",
                        borderColor: "rgba(255, 193, 7, 0.25)",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <svg
                          className="text-warning me-2"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="small fw-semibold text-warning">테스트 계정</span>
                      </div>
                      <p className="small text-warning mb-0">ID: admin / PW: admin123</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 링크 */}
              <div className="text-center mt-4">
                <p className="small" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  © 2024 에끌라린 (구름섬컴퍼니). All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
