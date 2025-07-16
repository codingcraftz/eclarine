import React from "react";
import Link from "next/link";
import LoginForm from "../forms/login-form";
import LoginShapes from "./login-shapes";
import { supabase } from "@/lib/supabase";

const handleKakaoLogin = async () => {
  await supabase.auth.signInWithOAuth({ provider: "kakao" });
};

const LoginArea = () => {
  return (
    <>
      <section className="tp-login-area pb-140 p-relative z-index-1 fix">
        <LoginShapes />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-30">
                  <h3 className="tp-login-title">에끌라린 로그인</h3>
                  <p>
                    아직 회원이 아니신가요?{" "}
                    <span>
                      <Link href="/register">무료 회원가입</Link>
                    </span>
                  </p>
                </div>
                <div className="tp-login-option">
                  <div className="tp-login-social mb-10 d-flex flex-wrap align-items-center justify-content-center">
                    <div className="tp-login-option-item has-kakao">
                      <button
                        type="button"
                        className="tp-login-social-btn kakao"
                        style={{
                          background: "#FEE500",
                          color: "#3C1E1E",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 18px",
                          fontWeight: 700,
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onClick={handleKakaoLogin}
                      >
                        {/* 아이콘 파일이 없으면 대체 텍스트 */}
                        <img
                          src="/assets/img/login/kakao.svg"
                          alt="카카오 로그인"
                          style={{ width: 22, height: 22, marginRight: 8 }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        카카오로 로그인
                      </button>
                    </div>
                  </div>
                  <div className="tp-login-mail text-center mb-40">
                    <p>또는 이메일로 로그인</p>
                  </div>
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginArea;
