import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";

// setting
function ProfileSetting({ active, handleActive }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push("/");
  };
  return (
    <div className="tp-header-top-menu-item tp-header-setting">
      <span
        onClick={() => handleActive("setting")}
        className="tp-header-setting-toggle"
        id="tp-header-setting-toggle"
      >
        설정
      </span>
      <ul className={active === "setting" ? "tp-setting-list-open" : ""}>
        <li>
          <Link href="/profile">내 계정</Link>
        </li>
        <li>
          <Link href="/wishlist">위시리스트</Link>
        </li>
        <li>
          <Link href="/cart">장바구니</Link>
        </li>
        <li>
          {!user?.name && (
            <Link href="/login" className="cursor-pointer">
              로그인
            </Link>
          )}
          {user?.name && (
            <a onClick={handleLogout} className="cursor-pointer">
              로그아웃
            </a>
          )}
        </li>
      </ul>
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState("");
  // handle active
  const handleActive = (type) => {
    if (type === active) {
      setIsActive("");
    } else {
      setIsActive(type);
    }
  };
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      <ProfileSetting active={active} handleActive={handleActive} />
    </div>
  );
};

export default HeaderTopRight;
