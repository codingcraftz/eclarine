import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";

const CouponsManagement = () => {
  return (
    <>
      <Head>
        <title>쿠폰 관리 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="coupons">
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">쿠폰 관리</h1>
            <p className="mt-1 text-sm text-gray-600">할인 쿠폰을 생성하고 관리할 수 있습니다.</p>
          </div>

          {/* 임시 컨텐츠 */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">쿠폰 목록</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎫</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">쿠폰 관리 기능</h3>
                <p className="text-gray-500 mb-4">
                  쿠폰 생성, 편집, 사용 현황 관리 등의 기능이 제공됩니다.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                  <p className="text-sm text-purple-600">
                    <strong>구현 예정 기능:</strong>
                    <br />
                    • 쿠폰 생성 및 편집
                    <br />
                    • 쿠폰 사용 현황 조회
                    <br />
                    • 쿠폰 유효기간 관리
                    <br />
                    • 쿠폰 사용 제한 설정
                    <br />• 쿠폰 효과 분석
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default CouponsManagement;
