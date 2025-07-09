import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";

const UsersManagement = () => {
  return (
    <>
      <Head>
        <title>회원 관리 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="users">
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
            <p className="mt-1 text-sm text-gray-600">회원 정보를 조회하고 관리할 수 있습니다.</p>
          </div>

          {/* 임시 컨텐츠 */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">회원 목록</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">회원 관리 기능</h3>
                <p className="text-gray-500 mb-4">
                  회원 조회, 정보 수정, 권한 관리 등의 기능이 제공됩니다.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-600">
                    <strong>구현 예정 기능:</strong>
                    <br />
                    • 회원 목록 조회 및 검색
                    <br />
                    • 회원 상세 정보 조회
                    <br />
                    • 회원 활동 내역 조회
                    <br />
                    • 회원 등급 관리
                    <br />• 회원 통계 및 분석
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

export default UsersManagement;
