import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";

const OrdersManagement = () => {
  return (
    <>
      <Head>
        <title>주문 관리 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="orders">
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
            <p className="mt-1 text-sm text-gray-600">
              고객 주문 현황을 관리하고 배송 상태를 업데이트할 수 있습니다.
            </p>
          </div>

          {/* 임시 컨텐츠 */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">주문 목록</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">주문 관리 기능</h3>
                <p className="text-gray-500 mb-4">
                  주문 조회, 상태 변경, 배송 관리 등의 기능이 제공됩니다.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-600">
                    <strong>구현 예정 기능:</strong>
                    <br />
                    • 주문 목록 조회 및 검색
                    <br />
                    • 주문 상태 변경 (결제완료, 배송중, 배송완료)
                    <br />
                    • 주문 상세 정보 조회
                    <br />
                    • 배송 정보 관리
                    <br />• 주문 통계 및 분석
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

export default OrdersManagement;
