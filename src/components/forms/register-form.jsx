import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [registerUser, {}] = useRegisterUserMutation();
  const router = useRouter();
  const { redirect } = router.query;
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then((result) => {
      if (result?.error) {
        notifyError("Register Failed");
      } else {
        notifySuccess(result?.data?.message);
        // router.push(redirect || "/");
      }
    });
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-login-input-wrapper">
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input
              {...register("name", { required: `이름을 입력해주세요!` })}
              id="name"
              name="name"
              type="text"
              placeholder="홍길동"
            />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="name">이름</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input
              {...register("email", { required: `이메일을 입력해주세요!` })}
              id="email"
              name="email"
              type="email"
              placeholder="example@eclarine.co.kr"
            />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="email">이메일 주소</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-login-input-box">
          <div className="p-relative">
            <div className="tp-login-input">
              <input
                {...register("password", { required: `비밀번호를 입력해주세요!` })}
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="최소 6자 이상"
              />
            </div>
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="password">비밀번호</label>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </div>
      </div>
      <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20">
        <div className="tp-login-remeber">
          <input
            {...register("remember", {
              required: `이용약관에 동의해주세요!`,
            })}
            id="remember"
            name="remember"
            type="checkbox"
          />
          <label htmlFor="remember">
            <a href="#">서비스 이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의합니다.
          </label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>
      <div className="tp-login-bottom">
        <button type="submit" className="tp-login-btn w-100">
          회원가입
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
