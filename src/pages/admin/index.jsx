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

  // 관리자 계정 정보(코드 외부에서 관리 가능)
  const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || "admin";
  const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PW || "admin123";

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

    // 하드코딩된 인증 (UI에 노출X)
    if (credentials.username === ADMIN_ID && credentials.password === ADMIN_PW) {
      // 세션 저장
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          username: ADMIN_ID,
          role: "admin",
          loginTime: new Date().toISOString(),
        })
      );

      // 대시보드로 이동
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
          minHeight: "100vh",
          padding: "0 8px",
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

        <div
          className="container position-relative"
          style={{ zIndex: 10, maxWidth: 420, width: "100%" }}
        >
          <div className="row justify-content-center">
            <div className="col-12">
              {/* 메인 로그인 카드 */}
              <div
                className="card shadow-lg border-0 rounded-4 overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", minWidth: 0 }}
              >
                {/* 브랜드 헤더 */}
                <div
                  className="text-center py-4 px-2"
                  style={{ background: "linear-gradient(to right, #f8fafc, #e0f2fe)" }}
                >
                  <div className="mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3 shadow-lg mb-2"
                      style={{
                        width: "64px",
                        height: "64px",
                        background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                      }}
                    >
                      <span className="text-white fs-3 fw-bold" style={{ fontSize: 32 }}>
                        E
                      </span>
                    </div>
                    <h1 className="fs-4 fw-bold text-primary mb-1" style={{ fontSize: 22 }}>
                      ECLARINE
                    </h1>
                    <p className="text-muted small" style={{ fontSize: 13 }}>
                      프리미엄 주얼리 관리 시스템
                    </p>
                  </div>
                </div>

                {/* 로그인 폼 */}
                <div className="card-body p-3">
                  <form onSubmit={handleSubmit}>
                    {/* 관리자 아이디 */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: 15 }}>
                        관리자 아이디
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        placeholder="관리자 아이디를 입력하세요"
                        required
                        className="form-control form-control-lg bg-light border-2 rounded-3"
                        style={{ fontSize: 15, padding: "12px 16px" }}
                        autoComplete="username"
                      />
                    </div>

                    {/* 비밀번호 */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: 15 }}>
                        비밀번호
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                        required
                        className="form-control form-control-lg bg-light border-2 rounded-3"
                        style={{ fontSize: 15, padding: "12px 16px" }}
                        autoComplete="current-password"
                      />
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                      <div
                        className="alert alert-danger d-flex align-items-center mb-3"
                        role="alert"
                        style={{ fontSize: 14 }}
                      >
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      style={{
                        background: "#BD844C",
                        border: 0,
                        fontSize: 16,
                        padding: "12px 0",
                        borderRadius: 8,
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
