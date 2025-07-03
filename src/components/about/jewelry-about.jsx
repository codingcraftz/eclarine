import React from "react";
import Link from "next/link";
import Image from "next/image";
// internal
import about_img from "@assets/img/about/about-1.jpg";
import about_thumb from "@assets/img/about/about-2.jpg";
import { ArrowRightLong } from "@/svg";

const JewelryAbout = () => {
  return (
    <>
      <section className="tp-about-area pt-125 pb-180">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-6">
              <div className="tp-about-thumb-wrapper p-relative mr-35">
                <div className="tp-about-thumb m-img">
                  <Image src={about_img} alt="about_img" />
                </div>
                <div className="tp-about-thumb-2">
                  <Image src={about_thumb} alt="about_thumb" />
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6">
              <div className="tp-about-wrapper pl-80 pt-75 pr-60">
                <div className="tp-section-title-wrapper-4 mb-50">
                  <span className="tp-section-title-pre-4">에끌라린 소개</span>
                  <h3 className="tp-section-title-4 fz-50">프리미엄 악세서리 컬렉션</h3>
                </div>
                <div className="tp-about-content pl-120">
                  <p>
                    에끌라린은 품질과 디자인을 모두 만족시키는 프리미엄 악세서리 전문 브랜드입니다.{" "}
                    <br /> 써지컬 스틸, 925 실버, 14K 골드 등 안전하고 고급스러운 소재만을 사용하여
                    알레르기 걱정 없이 착용할 수 있는 제품들을 선보입니다.
                  </p>

                  <div className="tp-about-btn">
                    <Link href="/contact" className="tp-btn">
                      고객센터 <ArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JewelryAbout;
