import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";

// 통계 카드 컴포넌트
const StatCard = ({ title, value, icon, color, trend, trendValue, description }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}
            >
              {icon}
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">{title}</h3>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
          </div>
          {trend && (
            <div className="flex items-center mt-3">
              <div
                className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {trend === "up" ? (
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                )}
                {trendValue}
              </div>
              <span className="text-xs text-slate-500 ml-2">{description}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 최근 주문 아이템 컴포넌트
const RecentOrderItem = ({ order }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusText = {
    pending: "결제 대기",
    processing: "배송 준비",
    completed: "배송 완료",
    cancelled: "주문 취소",
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium text-slate-800">{order.customerName}</p>
          <p className="text-sm text-slate-600">{order.product}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-slate-800">₩{order.amount.toLocaleString()}</p>
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[order.status]
          }`}
        >
          {statusText[order.status]}
        </span>
      </div>
    </div>
  );
};

// 빠른 작업 버튼 컴포넌트
const QuickActionButton = ({ title, description, icon, color, onClick }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 bg-gradient-to-r ${colorClasses[color]} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-left`}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-white/80">{description}</p>
        </div>
      </div>
    </button>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    newOrders: 0,
    lowStockProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    // 실제 데이터 로딩 시뮬레이션
    const loadData = async () => {
      // 통계 데이터 (실제로는 API 호출)
      setStats({
        totalProducts: 247,
        totalOrders: 1823,
        totalUsers: 892,
        totalRevenue: 45890000,
        newOrders: 23,
        lowStockProducts: 12,
      });

      // 최근 주문 데이터
      setRecentOrders([
        {
          id: 1,
          customerName: "김예린",
          product: "925 실버 목걸이",
          amount: 89000,
          status: "processing",
          date: "2024-01-15",
        },
        {
          id: 2,
          customerName: "박지민",
          product: "14K 골드 반지",
          amount: 340000,
          status: "pending",
          date: "2024-01-15",
        },
        {
          id: 3,
          customerName: "이서준",
          product: "써지컬 스틸 귀걸이",
          amount: 65000,
          status: "completed",
          date: "2024-01-14",
        },
        {
          id: 4,
          customerName: "최수진",
          product: "진주 브레이슬릿",
          amount: 150000,
          status: "processing",
          date: "2024-01-14",
        },
      ]);

      // 재고 부족 상품
      setLowStockItems([
        { name: "925 실버 하트 목걸이", stock: 3 },
        { name: "14K 골드 큐빅 반지", stock: 1 },
        { name: "써지컬 스틸 크로스 목걸이", stock: 2 },
        { name: "진주 드롭 귀걸이", stock: 4 },
      ]);
    };

    loadData();
  }, []);

  const quickActions = [
    {
      title: "새 상품 등록",
      description: "새로운 주얼리 상품을 추가하세요",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      color: "blue",
      onClick: () => (window.location.href = "/admin/products/register"),
    },
    {
      title: "주문 현황",
      description: "최신 주문을 확인하세요",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      color: "green",
      onClick: () => (window.location.href = "/admin/orders"),
    },
    {
      title: "재고 관리",
      description: "상품 재고를 업데이트하세요",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      color: "purple",
      onClick: () => (window.location.href = "/admin/products"),
    },
    {
      title: "고객 지원",
      description: "고객 문의를 처리하세요",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "orange",
      onClick: () => alert("고객 지원 기능 준비 중입니다."),
    },
  ];

  return (
    <>
      <Head>
        <title>대시보드 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="dashboard">
        <div className="space-y-8">
          {/* 페이지 헤더 */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  에끌라린 대시보드
                </h1>
                <p className="mt-2 text-slate-600">
                  프리미엄 주얼리 브랜드의 주요 지표와 현황을 한눈에 확인하세요
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-700">실시간 연결</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-xl border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">
                    {new Date().toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="총 상품 수"
              value={stats.totalProducts.toLocaleString()}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              }
              color="blue"
              trend="up"
              trendValue="+12%"
              description="지난 달 대비"
            />
            <StatCard
              title="총 주문 수"
              value={stats.totalOrders.toLocaleString()}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5"
                  />
                </svg>
              }
              color="green"
              trend="up"
              trendValue="+8%"
              description="지난 달 대비"
            />
            <StatCard
              title="총 회원 수"
              value={stats.totalUsers.toLocaleString()}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              }
              color="purple"
              trend="up"
              trendValue="+15%"
              description="지난 달 대비"
            />
            <StatCard
              title="총 매출"
              value={`₩${Math.floor(stats.totalRevenue / 10000).toLocaleString()}만`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              }
              color="orange"
              trend="up"
              trendValue="+23%"
              description="지난 달 대비"
            />
          </div>

          {/* 메인 컨텐츠 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 최근 주문 */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">최근 주문</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-600">실시간 업데이트</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <RecentOrderItem key={order.id} order={order} />
                    ))}
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 py-3 px-4 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-200">
                      모든 주문 보기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 사이드바 영역 */}
            <div className="space-y-6">
              {/* 빠른 작업 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">빠른 작업</h2>
                </div>
                <div className="p-6 space-y-4">
                  {quickActions.map((action, index) => (
                    <QuickActionButton
                      key={index}
                      title={action.title}
                      description={action.description}
                      icon={action.icon}
                      color={action.color}
                      onClick={action.onClick}
                    />
                  ))}
                </div>
              </div>

              {/* 재고 알림 */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">재고 부족 알림</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {lowStockItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200"
                      >
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-600">재고: {item.stock}개</p>
                        </div>
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">{item.stock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button className="w-full bg-gradient-to-r from-red-50 to-pink-50 text-red-700 py-3 px-4 rounded-xl hover:from-red-100 hover:to-pink-100 transition-all duration-200 border border-red-200">
                      재고 관리로 이동
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
