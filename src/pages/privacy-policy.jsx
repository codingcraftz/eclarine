import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import FooterSimple from "@/layout/footers/footer-simple";
import Wrapper from "@/layout/wrapper";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";

const PrivacyPolicy = () => {
  return (
    <Wrapper>
      <SEO pageTitle="개인정보처리방침" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="개인정보처리방침" subtitle="Privacy Policy" />

      <section className="tp-about-area pb-120 pt-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-about-wrapper">
                {/* 기본 정보 */}
                <div className="tp-about-content mb-40">
                  <h3 className="tp-about-title mb-20">개인정보처리방침</h3>
                  <p className="mb-30">
                    구름섬컴퍼니(이하 "회사")가 운영하는 에끌라린(이하 "서비스")은 개인정보보호법에
                    따라 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같이 개인정보처리방침을
                    수립·공개합니다.
                  </p>
                  <div className="tp-about-info">
                    <ul>
                      <li>
                        <strong>회사명:</strong> 구름섬컴퍼니
                      </li>
                      <li>
                        <strong>대표자:</strong> 박준영
                      </li>
                      <li>
                        <strong>사업자등록번호:</strong> 632-07-03327
                      </li>
                      <li>
                        <strong>통신판매업신고번호:</strong> 2025-화도수동-0427
                      </li>
                      <li>
                        <strong>주소:</strong> [12175] 경기 남양주시 화도읍 마석중앙로37번길 45
                        (마석우리, 별나라프라자) 504호
                      </li>
                      <li>
                        <strong>연락처:</strong> 9851248@gmail.com
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 1. 개인정보의 처리 목적 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">1. 개인정보의 처리 목적</h4>
                  <p className="mb-15">
                    회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는
                    다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
                    개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할
                    예정입니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>
                      • 회원가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인
                      식별·인증, 회원자격 유지·관리
                    </li>
                    <li>
                      • 상품·서비스 제공: 상품 배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공,
                      맞춤서비스 제공
                    </li>
                    <li>
                      • 마케팅 및 광고에 활용: 신상품 안내, 이벤트 정보 및 참여기회 제공, 광고성
                      정보 제공
                    </li>
                    <li>• 고객 상담 및 서비스 개선: 고객 문의사항 및 불만처리, 공지사항 전달</li>
                  </ul>
                </div>

                {/* 2. 개인정보의 처리 및 보유기간 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">2. 개인정보의 처리 및 보유기간</h4>
                  <p className="mb-15">
                    회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집
                    시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>
                      • 회원가입 및 관리: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이
                      진행중인 경우에는 해당 수사·조사 종료시까지)
                    </li>
                    <li>• 상품·서비스 제공: 상품·서비스 공급완료 및 요금결제·정산 완료시까지</li>
                    <li>• 전자상거래법에 따른 표시·광고, 계약내용 및 이행 등에 관한 기록: 5년</li>
                    <li>• 소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                    <li>• 대금결제 및 상품 등의 공급에 관한 기록: 5년</li>
                  </ul>
                </div>

                {/* 3. 처리하는 개인정보의 항목 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">3. 처리하는 개인정보의 항목</h4>
                  <p className="mb-15">회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                  <div className="tp-about-info">
                    <h5 className="mb-10">필수항목</h5>
                    <ul className="tp-about-list mb-20">
                      <li>• 회원가입: 이름, 이메일, 비밀번호, 휴대전화번호</li>
                      <li>• 상품주문: 수령인명, 배송주소, 연락처, 결제정보</li>
                      <li>• 고객상담: 이름, 연락처, 상담내용</li>
                    </ul>
                    <h5 className="mb-10">선택항목</h5>
                    <ul className="tp-about-list">
                      <li>• 생년월일, 성별 (맞춤 서비스 제공을 위함)</li>
                      <li>• 마케팅 수신동의 (이벤트 및 프로모션 정보 제공을 위함)</li>
                    </ul>
                  </div>
                </div>

                {/* 4. 개인정보의 제3자 제공 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">4. 개인정보의 제3자 제공</h4>
                  <p className="mb-15">
                    회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서
                    처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에
                    해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>• 배송업체: 상품 배송을 위한 수령인 정보 (이름, 주소, 연락처)</li>
                    <li>• 결제대행업체: 결제서비스 제공을 위한 결제정보</li>
                    <li>• 마케팅 서비스 업체: 마케팅 동의 시 이벤트 정보 제공을 위한 연락처</li>
                  </ul>
                </div>

                {/* 5. 개인정보의 파기 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">5. 개인정보의 파기</h4>
                  <p className="mb-15">
                    회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을
                    때에는 지체없이 해당 개인정보를 파기합니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>
                      • 파기절차: 파기 사유가 발생한 개인정보를 선정하고, 개인정보보호책임자의
                      승인을 받아 개인정보를 파기합니다.
                    </li>
                    <li>
                      • 파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을
                      사용하여 삭제합니다.
                    </li>
                  </ul>
                </div>

                {/* 6. 정보주체의 권리·의무 및 행사방법 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">6. 정보주체의 권리·의무 및 행사방법</h4>
                  <p className="mb-15">
                    정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수
                    있습니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>• 개인정보 처리현황 통지요구</li>
                    <li>• 개인정보 열람요구</li>
                    <li>• 개인정보 정정·삭제요구</li>
                    <li>• 개인정보 처리정지요구</li>
                  </ul>
                  <p className="mt-15">
                    위의 권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편,
                    모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이
                    조치하겠습니다.
                  </p>
                </div>

                {/* 7. 개인정보의 안전성 확보조치 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">7. 개인정보의 안전성 확보조치</h4>
                  <p className="mb-15">
                    회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한
                    기술적/관리적 및 물리적 조치를 하고 있습니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>• 개인정보 취급 직원의 최소화 및 교육</li>
                    <li>• 개인정보에 대한 접근 제한</li>
                    <li>
                      • 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여·변경·말소를
                      통한 개인정보에 대한 접근통제
                    </li>
                    <li>• 개인정보의 안전한 저장을 위한 저장데이터의 암호화</li>
                    <li>
                      • 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위한
                      보안시스템 설치
                    </li>
                  </ul>
                </div>

                {/* 8. 개인정보보호책임자 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">8. 개인정보보호책임자</h4>
                  <p className="mb-15">
                    회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                    정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를
                    지정하고 있습니다.
                  </p>
                  <div className="tp-about-info">
                    <ul>
                      <li>
                        <strong>개인정보보호책임자:</strong> 박준영
                      </li>
                      <li>
                        <strong>연락처:</strong> 9851248@gmail.com
                      </li>
                      <li>
                        <strong>카카오톡 상담:</strong> http://pf.kakao.com/_qxcWrn
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 9. 개인정보 처리방침의 변경 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">9. 개인정보 처리방침의 변경</h4>
                  <p className="mb-15">
                    이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의
                    추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여
                    고지할 것입니다.
                  </p>
                  <p>
                    <strong>본 방침은 2024년 12월 24일부터 적용됩니다.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSimple />
    </Wrapper>
  );
};

export default PrivacyPolicy;
