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
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className="w-96 h-96 rounded-full absolute -top-48 -left-48"
              style={{ background: "linear-gradient(45deg, #0989FF, #BD844C)" }}
            />
            <div
              className="w-80 h-80 rounded-full absolute -bottom-40 -right-40"
              style={{ background: "linear-gradient(45deg, #678E61, #0989FF)" }}
            />
            <div
              className="w-64 h-64 rounded-full absolute top-1/3 right-1/4"
              style={{ background: "linear-gradient(45deg, #BD844C, #678E61)" }}
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* 메인 로그인 카드 */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* 브랜드 헤더 */}
            <div className="text-center py-8 px-8 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-4">
                  <span className="text-white text-2xl font-bold">E</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ECLARINE
                </h1>
                <p className="text-slate-600 text-sm mt-2">프리미엄 주얼리 관리 시스템</p>
              </div>
            </div>

            {/* 로그인 폼 */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 관리자 아이디 */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    관리자 아이디
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      placeholder="관리자 아이디를 입력하세요"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-800 placeholder-slate-400"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-slate-400"
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
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">비밀번호</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="비밀번호를 입력하세요"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-800 placeholder-slate-400"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-slate-400"
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
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      로그인 중...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
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
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-center mb-2">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
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
                    <span className="text-sm font-semibold text-blue-700">
                      에끌라린 관리 시스템
                    </span>
                  </div>
                  <p className="text-xs text-blue-600">
                    프리미엄 주얼리 브랜드의 전문적인 관리 도구
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="text-center mt-6">
            <p className="text-white/80 text-sm">
              © 2024 에끌라린 (구름섬컴퍼니). All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
