import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import logo from "@assets/img/logo/main_logo.png";
import pay from "@assets/img/footer/footer-pay.png";
import social_data from "@/data/social-data";
import { Email, Location } from "@/svg";

const Footer = ({ style_2 = false, style_3 = false, primary_style = false }) => {
  return (
    <footer>
      <div
        className={`tp-footer-area ${
          primary_style ? "tp-footer-style-2 tp-footer-style-primary tp-footer-style-6" : ""
        } ${style_2 ? "tp-footer-style-2" : style_3 ? "tp-footer-style-2 tp-footer-style-3" : ""}`}
        data-bg-color={`${style_2 ? "footer-bg-white" : "footer-bg-grey"}`}
      >
        <div className="tp-footer-top pt-95 pb-40">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-1 mb-50">
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" />
                      </Link>
                    </div>
                    <p className="tp-footer-desc">
                      에끌라린은 고품질의 실버, 골드, 써지컬 스틸 등 다양한 소재의 프리미엄
                      악세서리를 제공하는 전문 쇼핑몰입니다. (구름섬컴퍼니 운영)
                    </p>
                    <div className="tp-footer-social">
                      {social_data.map((s) => (
                        <a href={s.link} key={s.id} target="_blank">
                          <i className={s.icon}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-2 mb-50">
                  <h4 className="tp-footer-widget-title">내 계정</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      <li>
                        <a href="#">주문 조회</a>
                      </li>
                      <li>
                        <a href="#">배송 정보</a>
                      </li>
                      <li>
                        <a href="#">위시리스트</a>
                      </li>
                      <li>
                        <a href="#">내 계정</a>
                      </li>
                      <li>
                        <a href="#">주문 내역</a>
                      </li>
                      <li>
                        <a href="#">반품/교환</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-3 mb-50">
                  <h4 className="tp-footer-widget-title">고객 서비스</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                      {/* 추후 페이지 개발 예정 */}
                      {/* <li>
                          <a href="#">회사 소개</a>
                        </li>
                        <li>
                          <a href="#">채용 정보</a>
                        </li> */}
                      <li>
                        <Link href="/privacy-policy">개인정보처리방침</Link>
                      </li>
                      <li>
                        <Link href="/terms-of-service">이용약관</Link>
                      </li>
                      {/* 추후 페이지 개발 예정 */}
                      {/* <li>
                          <a href="#">공지사항</a>
                        </li>
                        <li>
                          <a href="#">문의하기</a>
                        </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-4 mb-50">
                  <h4 className="tp-footer-widget-title">문의하기</h4>
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-talk mb-20">
                      <span>궁금한 점이 있으신가요?</span>
                      <h4>
                        <a
                          href="http://pf.kakao.com/_qxcWrn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          카카오톡 상담하기
                        </a>
                      </h4>
                    </div>
                    <div className="tp-footer-contact">
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Email />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p>
                            <a href="mailto:9851248@gmail.com">9851248@gmail.com</a>
                          </p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <i className="fa-solid fa-phone"></i>
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p>
                            <a href="tel:02-1234-5678">02-1234-5678</a>
                          </p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Location />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p>
                            <a href="https://maps.google.com" target="_blank">
                              [12175] 경기 남양주시 화도읍 마석중앙로37번길 45
                              <br />
                              (마석우리, 별나라프라자) 504호
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tp-footer-bottom">
          <div className="container">
            <div className="tp-footer-bottom-wrapper">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-footer-copyright">
                    <p>
                      © {new Date().getFullYear()} 에끌라린 (구름섬컴퍼니). All Rights Reserved |
                      대표자: 박준영 | 사업자번호: 632-07-03327 | 통신판매업: 2025-화도수동-0427
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-footer-payment text-md-end">
                    <p>
                      <Image src={pay} alt="pay" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
