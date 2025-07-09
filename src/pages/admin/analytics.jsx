import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";

const Analytics = () => {
  return (
    <>
      <Head>
        <title>통계/분석 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="analytics">
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">통계/분석</h1>
            <p className="mt-1 text-sm text-gray-600">
              매출, 방문자, 상품 등 다양한 통계와 분석 데이터를 제공합니다.
            </p>
          </div>

          {/* 임시 컨텐츠 */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">분석 대시보드</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📈</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">통계/분석 기능</h3>
                <p className="text-gray-500 mb-4">
                  매출 분석, 고객 행동 분석, 상품 성과 분석 등의 기능이 제공됩니다.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-600">
                    <strong>구현 예정 기능:</strong>
                    <br />
                    • 매출 통계 및 차트
                    <br />
                    • 방문자 분석
                    <br />
                    • 상품 판매 성과 분석
                    <br />
                    • 고객 구매 패턴 분석
                    <br />
                    • 월별/연별 리포트
                    <br />• 실시간 현황 대시보드
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

export default Analytics;
