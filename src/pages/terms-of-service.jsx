import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import FooterSimple from "@/layout/footers/footer-simple";
import Wrapper from "@/layout/wrapper";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";

const TermsOfService = () => {
  return (
    <Wrapper>
      <SEO pageTitle="이용약관" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="이용약관" subtitle="Terms of Service" />

      <section className="tp-about-area pb-120 pt-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-about-wrapper">
                {/* 기본 정보 */}
                <div className="tp-about-content mb-40">
                  <h3 className="tp-about-title mb-20">이용약관</h3>
                  <p className="mb-30">
                    에끌라린(이하 &quot;회사&quot;)이 제공하는 인터넷 관련 서비스(이하
                    &lsquo;서비스&rsquo;)를 이용함에 있어 사이버몰과 이용자의 권리, 의무 및
                    책임사항을 규정함을 목적으로 합니다.
                  </p>
                  <div className="tp-about-info">
                    <ul>
                      <li>
                        <strong>상호:</strong> 에끌라린
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
                      <li>
                        <strong>카카오톡 상담:</strong> http://pf.kakao.com/_qxcWrn
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 제1조 목적 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제1조 (목적)</h4>
                  <p>
                    이 약관은 에끌라린(전자상거래 사업자)이 운영하는 사이버몰에서 제공하는 인터넷
                    관련 서비스(이하 &quot;서비스&quot;라 한다)를 이용함에 있어 사이버몰과 이용자의
                    권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                  </p>
                </div>

                {/* 제2조 정의 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제2조 (정의)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;이란 회사가 악세서리 등을 이용자에게 제공하기 위하여
                      컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의
                      영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
                    </li>
                    <li>
                      ② &quot;이용자&quot;란 &quot;사이버몰&quot;에 접속하여 이 약관에 따라
                      &quot;사이버몰&quot;이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                    </li>
                    <li>
                      ③ &quot;회원&quot;이란 &quot;사이버몰&quot;에 개인정보를 제공하여 회원등록을
                      한 자로서, &quot;사이버몰&quot;의 정보를 지속적으로 제공받으며,
                      &quot;사이버몰&quot;이 제공하는 서비스를 계속적으로 이용할 수 있는 자를
                      말합니다.
                    </li>
                    <li>
                      ④ &quot;비회원&quot;이란 회원에 가입하지 않고 &quot;사이버몰&quot;이 제공하는
                      서비스를 이용하는 자를 말합니다.
                    </li>
                  </ul>
                </div>

                {/* 제3조 약관의 명시와 설명 및 개정 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제3조 (약관의 명시와 설명 및 개정)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지
                      주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 팩스번호,
                      전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보보호책임자 등을
                      이용자가 쉽게 알 수 있도록 사이버몰의 초기 서비스화면에 게시합니다.
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;은 이 약관을 개정하는 경우에 적용일자 및 개정사유를
                      명시하여 현행약관과 함께 사이버몰의 초기화면에 그 적용일자 7일 이전부터
                      적용일자 전일까지 공지합니다.
                    </li>
                  </ul>
                </div>

                {/* 제4조 서비스의 제공 및 변경 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제4조 (서비스의 제공 및 변경)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;은 다음과 같은 업무를 수행합니다.
                      <ul className="tp-about-list ml-20 mt-10">
                        <li>- 악세서리 판매업</li>
                        <li>- 기타 &quot;사이버몰&quot;이 정하는 업무</li>
                      </ul>
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의
                      경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수
                      있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를 명시하여
                      현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.
                    </li>
                  </ul>
                </div>

                {/* 제5조 회원가입 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제5조 (회원가입)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① 이용자는 &quot;사이버몰&quot;이 정한 가입 양식에 따라 회원정보를 기입한 후
                      이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;은 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중
                      다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                      <ul className="tp-about-list ml-20 mt-10">
                        <li>
                          - 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
                        </li>
                        <li>- 등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                        <li>
                          - 기타 회원으로 등록하는 것이 &quot;사이버몰&quot;의 기술상 현저히 지장이
                          있다고 판단되는 경우
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* 제6조 구매신청 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제6조 (구매신청)</h4>
                  <p className="mb-15">
                    &quot;사이버몰&quot; 이용자는 다음 또는 이와 유사한 방법에 의하여 구매를
                    신청하며, &quot;사이버몰&quot;은 이용자가 구매신청을 함에 있어서 다음의 각
                    내용을 알기 쉽게 제공하여야 합니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>① 재화 등의 검색 및 선택</li>
                    <li>
                      ② 받는 사람의 성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력
                    </li>
                    <li>
                      ③ 약관내용, 청약철회권이 제한되는 서비스, 배송료·설치비 등의 비용부담과 관련한
                      내용에 대한 확인
                    </li>
                    <li>
                      ④ 이 약관에 동의하고 위 ③호의 사항을 확인하거나 거부하는 표시(예, 마우스 클릭)
                    </li>
                    <li>
                      ⑤ 재화등의 구매신청 및 이에 관한 확인 또는 &quot;사이버몰&quot;의 확인에 대한
                      동의
                    </li>
                    <li>⑥ 결제방법의 선택</li>
                  </ul>
                </div>

                {/* 제7조 계약의 성립 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제7조 (계약의 성립)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;은 제6조와 같은 구매신청에 대하여 다음 각 호에 해당하면
                      승낙하지 않을 수 있습니다.
                      <ul className="tp-about-list ml-20 mt-10">
                        <li>- 신청 내용에 허위, 기재누락, 오기가 있는 경우</li>
                        <li>
                          - 미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을
                          구매하는 경우
                        </li>
                        <li>
                          - 기타 구매신청에 승낙하는 것이 &quot;사이버몰&quot; 기술상 현저히 지장이
                          있다고 판단하는 경우
                        </li>
                      </ul>
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;의 승낙이 제12조제1항의 수신확인통지형태로 이용자에게
                      도달한 시점에 계약이 성립한 것으로 봅니다.
                    </li>
                  </ul>
                </div>

                {/* 제8조 지급방법 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제8조 (지급방법)</h4>
                  <p className="mb-15">
                    &quot;사이버몰&quot;에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각
                    호의 방법 중 가용한 방법으로 할 수 있습니다. 단, &quot;사이버몰&quot;은 이용자의
                    지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가하여 징수할 수
                    없습니다.
                  </p>
                  <ul className="tp-about-list">
                    <li>① 폰뱅킹, 인터넷뱅킹, 메일 뱅킹 등의 각종 계좌이체</li>
                    <li>② 선불카드, 직불카드, 신용카드 등의 각종 카드결제</li>
                    <li>③ 온라인무통장입금</li>
                    <li>④ 전자화폐에 의한 결제</li>
                    <li>⑤ 수령 시 대금지급</li>
                    <li>⑥ 마일리지 등 &quot;사이버몰&quot;이 지급한 포인트에 의한 결제</li>
                    <li>
                      ⑦ &quot;사이버몰&quot;과 계약을 맺었거나 &quot;사이버몰&quot;이 인정한
                      상품권에 의한 결제
                    </li>
                    <li>⑧ 기타 전자적 지급방법에 의한 대금지급 등</li>
                  </ul>
                </div>

                {/* 제9조 배송 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제9조 (배송)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;은 이용자와 재화등의 공급시기에 관하여 별도의 약정이
                      없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록
                      주문제작, 포장 등 기타의 필요한 조치를 취합니다.
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;은 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용
                      부담자, 수단별 배송기간 등을 명시합니다.
                    </li>
                    <li>
                      ③ 배송비 정책
                      <ul className="tp-about-list ml-20 mt-10">
                        <li>
                          - <strong>80,000원 이상 구매 시 무료배송</strong>
                        </li>
                        <li>- 80,000원 미만 구매 시 배송비 별도 부담</li>
                        <li>- 도서·산간 지역은 추가 배송비가 발생할 수 있습니다</li>
                      </ul>
                    </li>
                    <li>
                      ④ 만약 &quot;사이버몰&quot;이 약정 배송기간을 초과한 경우에는 그로 인한
                      이용자의 손해를 배상하여야 합니다.
                    </li>
                  </ul>
                </div>

                {/* 제10조 환불 및 취소 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제10조 (환불 및 취소)</h4>
                  <div className="tp-about-info">
                    <h5 className="mb-15">
                      <strong>🔄 청약철회 및 환불규정</strong>
                    </h5>
                    <ul className="tp-about-list mb-20">
                      <li>① 이용자는 상품을 받은 날로부터 7일 이내에 청약을 철회할 수 있습니다.</li>
                      <li>
                        ② 다음 각 호의 경우에는 &quot;사이버몰&quot;은 환불을 거부할 수 있습니다.
                        <ul className="tp-about-list ml-20 mt-10">
                          <li>- 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우</li>
                          <li>
                            - 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한
                            경우
                          </li>
                          <li>
                            - 시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히
                            감소한 경우
                          </li>
                          <li>- 복제가 가능한 재화등의 포장을 훼손한 경우</li>
                          <li>
                            - 개별 주문 제작되는 재화 등 청약철회시 &quot;사이버몰&quot;에게 회복할
                            수 없는 피해가 예상되는 경우
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <h5 className="mb-15">
                      <strong>💰 환불 처리 절차</strong>
                    </h5>
                    <ul className="tp-about-list mb-20">
                      <li>
                        ① 환불 신청은 카카오톡 상담(http://pf.kakao.com/_qxcWrn) 또는
                        이메일(9851248@gmail.com)로 접수 가능합니다.
                      </li>
                      <li>② 환불 승인 후 3영업일 이내에 결제 수단으로 환불 처리됩니다.</li>
                      <li>
                        ③ 신용카드로 결제한 경우 신용카드 승인을 취소하고, 기타 결제수단의 경우 해당
                        결제수단으로 환불합니다.
                      </li>
                      <li>
                        ④ 환불 시 배송비는 다음과 같이 처리됩니다.
                        <ul className="tp-about-list ml-20 mt-10">
                          <li>- 단순 변심: 고객 부담 (왕복 배송비)</li>
                          <li>- 상품 불량/오배송: 회사 부담</li>
                          <li>
                            - 80,000원 이상 구매 후 일부 환불 시: 무료배송 조건 미달 시 배송비 차감
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <h5 className="mb-15">
                      <strong>🔄 교환 및 반품</strong>
                    </h5>
                    <ul className="tp-about-list">
                      <li>① 교환은 동일 상품의 다른 옵션(사이즈, 색상 등)으로만 가능합니다.</li>
                      <li>
                        ② 반품 접수 후 상품을 다음 주소로 발송해주세요:
                        <br />
                        <strong>
                          [12175] 경기 남양주시 화도읍 마석중앙로37번길 45 (마석우리, 별나라프라자)
                          504호
                        </strong>
                      </li>
                      <li>
                        ③ 반품 상품은 원래 포장 상태를 유지해야 하며, 상품 태그 제거 시 교환/환불이
                        불가능합니다.
                      </li>
                      <li>
                        ④ 악세서리 특성상 위생상의 이유로 착용 후에는 교환/환불이 제한될 수
                        있습니다.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 제11조 라이브 방송 구매 특별 정책 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제11조 (라이브 방송 구매 특별 정책)</h4>
                  <div className="tp-about-info">
                    <p className="mb-20">
                      <strong>
                        에끌라린 라이브 방송을 통한 구매에는 다음과 같은 특별 정책이 적용됩니다.
                      </strong>
                    </p>

                    <h5 className="mb-15">
                      <strong>📺 라이브 방송 구매 안내</strong>
                    </h5>
                    <ul className="tp-about-list mb-20">
                      <li>
                        ① <strong>교환 및 환불 제한:</strong> 라이브 방송 중 구매하신 제품은 단순
                        변심에 의한 교환 및 환불이 어렵습니다. 구매 전 신중한 결정 부탁드립니다.
                      </li>
                      <li>
                        ② <strong>제품 불량 확인 기한:</strong> 상품 수령 후 3일 이내 불량 여부를
                        확인해 주세요. 이후 접수되는 건은 사용에 의한 손상으로 간주되어 처리되지
                        않을 수 있습니다.
                      </li>
                      <li>
                        ③ <strong>불량 처리 방식:</strong> 불량이 확인될 경우, 동일 상품으로 1회
                        교환해드립니다. 해당 상품의 재고가 없을 경우, 환불로 대체될 수 있습니다.
                      </li>
                    </ul>

                    <h5 className="mb-15">
                      <strong>🎯 당첨 및 주문 관리</strong>
                    </h5>
                    <ul className="tp-about-list mb-20">
                      <li>
                        ① <strong>주문 자동 취소 사유:</strong>
                        <ul className="tp-about-list ml-20 mt-10">
                          <li>- 당첨되지 않은 번호로의 주문</li>
                          <li>- 발송 전 불량 확인</li>
                          <li>- 방송일로부터 3일 경과된 주문</li>
                        </ul>
                      </li>
                      <li>
                        ② <strong>배송비 및 거래 취소:</strong> 배송비 미입금 시 배송이 지연되거나
                        취소될 수 있습니다.
                      </li>
                      <li>
                        ③ <strong>주문 제한:</strong> 반복적인 주문 취소 고객은 당첨되더라도 주문이
                        제한될 수 있습니다.
                      </li>
                    </ul>

                    <h5 className="mb-15">
                      <strong>📝 주문 정보 정확성</strong>
                    </h5>
                    <ul className="tp-about-list">
                      <li>
                        ① 주문서 작성 시 다음 정보를 정확하게 입력해주세요:
                        <ul className="tp-about-list ml-20 mt-10">
                          <li>- 수령자 성함</li>
                          <li>- 주소</li>
                          <li>- 연락처</li>
                          <li>- 당첨번호 / 닉네임</li>
                        </ul>
                      </li>
                      <li>
                        ② <strong>오배송 책임:</strong> 정보 오기재로 인한 오배송은 고객님 부담으로
                        처리됩니다.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 제12조 개인정보보호 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제12조 (개인정보보호)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;은 이용자의 개인정보 수집시 서비스제공을 위하여 필요한
                      범위에서 최소한의 개인정보를 수집합니다.
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;은 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지
                      않습니다.
                    </li>
                    <li>
                      ③ &quot;사이버몰&quot;은 이용자의 개인정보를 수집·이용하는 때에는 당해
                      이용자에게 그 목적을 고지하고 동의를 받습니다.
                    </li>
                    <li>
                      ④ &quot;사이버몰&quot;은 수집된 개인정보를 목적외의 용도로 이용할 수 없으며,
                      새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는
                      이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                    </li>
                  </ul>
                </div>

                {/* 제13조 면책조항 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제13조 (면책조항)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;은 천재지변 또는 이에 준하는 불가항력으로 인하여
                      서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;은 이용자의 귀책사유로 인한 서비스 이용의 장애에
                      대하여는 책임을 지지 않습니다.
                    </li>
                    <li>
                      ③ &quot;사이버몰&quot;은 이용자가 서비스를 이용하여 기대하는 손익이나 서비스를
                      통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
                    </li>
                  </ul>
                </div>

                {/* 제14조 준거법 및 재판관할 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">제14조 (준거법 및 재판관할)</h4>
                  <ul className="tp-about-list">
                    <li>
                      ① &quot;사이버몰&quot;과 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은
                      민사소송법상의 관할법원에 제기합니다.
                    </li>
                    <li>
                      ② &quot;사이버몰&quot;과 이용자간에 제기된 전자상거래 소송에는 한국법을
                      적용합니다.
                    </li>
                  </ul>
                </div>

                {/* 부칙 */}
                <div className="tp-about-content mb-30">
                  <h4 className="mb-15">부칙</h4>
                  <p>이 약관은 2024년 12월 24일부터 시행됩니다.</p>
                  <p className="mt-15">
                    <strong>📞 고객센터:</strong> 9851248@gmail.com
                    <br />
                    <strong>💬 카카오톡 상담:</strong>{" "}
                    <a href="http://pf.kakao.com/_qxcWrn" target="_blank">
                      http://pf.kakao.com/_qxcWrn
                    </a>
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

export default TermsOfService;
