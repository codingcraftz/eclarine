import { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabaseService } from "@/lib/supabase";

// 통계 카드 컴포넌트
const StatCard = ({ title, value, icon, color, trend, trendValue, description }) => {
  const gradientStyles = {
    blue: { background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
    green: { background: "linear-gradient(135deg, #10b981, #059669)" },
    purple: { background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    orange: { background: "linear-gradient(135deg, #f59e0b, #d97706)" },
    pink: { background: "linear-gradient(135deg, #ec4899, #db2777)" },
    indigo: { background: "linear-gradient(135deg, #6366f1, #4f46e5)" },
  };

  return (
    <div
      className="card border-0 shadow-lg h-100"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-fill">
            <div className="d-flex align-items-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm me-3"
                style={{ width: "48px", height: "48px", ...gradientStyles[color] }}
              >
                <div className="text-white">{icon}</div>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">{title}</h6>
                <h3 className="mb-0 fw-bold text-dark">{value}</h3>
              </div>
            </div>
            {trend && (
              <div className="d-flex align-items-center">
                <div
                  className={`d-flex align-items-center px-2 py-1 rounded-pill small fw-medium ${
                    trend === "up"
                      ? "bg-success bg-opacity-10 text-success"
                      : "bg-danger bg-opacity-10 text-danger"
                  }`}
                >
                  {trend === "up" ? (
                    <svg
                      className="me-1"
                      width="12"
                      height="12"
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
                      className="me-1"
                      width="12"
                      height="12"
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
                <span className="text-muted ms-2 small">{description}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 최근 주문 아이템 컴포넌트
const RecentOrderItem = ({ order }) => {
  const statusStyles = {
    pending: { backgroundColor: "rgba(255, 193, 7, 0.1)", color: "#b45309" },
    processing: { backgroundColor: "rgba(13, 110, 253, 0.1)", color: "#0a58ca" },
    completed: { backgroundColor: "rgba(25, 135, 84, 0.1)", color: "#0f5132" },
    cancelled: { backgroundColor: "rgba(220, 53, 69, 0.1)", color: "#842029" },
  };

  const statusText = {
    pending: "결제 대기",
    processing: "배송 준비",
    completed: "배송 완료",
    cancelled: "주문 취소",
  };

  return (
    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-light hover-bg-light">
      <div className="d-flex align-items-center">
        <div
          className="d-flex align-items-center justify-content-center rounded-3 me-3"
          style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, #dbeafe, #ede9fe)",
          }}
        >
          <svg
            className="text-primary"
            width="24"
            height="24"
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
          <h6 className="mb-1 fw-medium">{order.customerName}</h6>
          <p className="mb-0 small text-muted">{order.product}</p>
        </div>
      </div>
      <div className="text-end">
        <h6 className="mb-1 fw-semibold">₩{order.amount.toLocaleString()}</h6>
        <span
          className="badge rounded-pill px-2 py-1 small fw-medium"
          style={statusStyles[order.status]}
        >
          {statusText[order.status]}
        </span>
      </div>
    </div>
  );
};

// 빠른 작업 버튼 컴포넌트
const QuickActionButton = ({ title, description, icon, color, onClick }) => {
  const gradientStyles = {
    blue: { background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
    green: { background: "linear-gradient(135deg, #10b981, #059669)" },
    purple: { background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    orange: { background: "linear-gradient(135deg, #f59e0b, #d97706)" },
    pink: { background: "linear-gradient(135deg, #ec4899, #db2777)" },
  };

  return (
    <button
      onClick={onClick}
      className="btn w-100 text-start p-3 border-0 shadow-sm rounded-3 mb-2"
      style={gradientStyles[color]}
    >
      <div className="d-flex align-items-center text-white">
        <div
          className="d-flex align-items-center justify-content-center rounded-2 me-3"
          style={{ width: "40px", height: "40px", backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          {icon}
        </div>
        <div>
          <h6 className="mb-1 fw-semibold small text-white">{title}</h6>
          <p className="mb-0 small" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            {description}
          </p>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // 통계 데이터 로딩
      const dashboardStats = await supabaseService.getDashboardStats();
      setStats(dashboardStats);

      // 최근 주문 데이터 로딩
      const recentOrdersData = await supabaseService.getRecentOrders(5);

      // 주문 데이터 포맷팅
      const formattedOrders = recentOrdersData.map((order) => ({
        id: order.id,
        customerName: order.user_profiles
          ? `${order.user_profiles.first_name || ""} ${order.user_profiles.last_name || ""}`.trim()
          : "고객",
        product: `주문 #${order.id}`,
        amount: order.total_amount,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString("ko-KR"),
      }));
      setRecentOrders(formattedOrders);

      // 재고 부족 상품 데이터 로딩
      const lowStockData = await supabaseService.getLowStockProducts(5);
      setLowStockItems(lowStockData || []);
    } catch (error) {
      console.error("대시보드 데이터 로딩 오류:", error);
      setError("대시보드 데이터를 불러오는데 실패했습니다.");

      // 오류 발생 시 기본 데이터 설정
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        newOrders: 0,
        lowStockProducts: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "새 상품 등록",
      description: "새로운 주얼리 상품을 추가하세요",
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="container-fluid">
          {/* 에러 메시지 */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* 로딩 상태 */}
          {loading && (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "300px" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* 페이지 헤더 */}
              <div className="row mb-4">
                <div className="col-12">
                  <div
                    className="card border-0 shadow-sm"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="mb-3 mb-md-0">
                          <h1 className="display-6 fw-bold text-primary mb-2">에끌라린 대시보드</h1>
                          <p className="text-muted mb-0">
                            프리미엄 주얼리 브랜드의 주요 지표와 현황을 한눈에 확인하세요
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="d-flex align-items-center px-3 py-2 rounded-3 border border-success border-opacity-25"
                            style={{ backgroundColor: "rgba(25, 135, 84, 0.1)" }}
                          >
                            <div
                              className="rounded-circle bg-success me-2"
                              style={{ width: "8px", height: "8px" }}
                            ></div>
                            <span className="small fw-medium text-success">실시간 연결</span>
                          </div>
                          <div
                            className="d-flex align-items-center px-3 py-2 rounded-3 border border-primary border-opacity-25"
                            style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                          >
                            <span className="small fw-medium text-primary">
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
                  </div>
                </div>
              </div>

              {/* 통계 카드 */}
              <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                  <StatCard
                    title="총 상품 수"
                    value={stats.totalProducts.toLocaleString()}
                    icon={
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                </div>
                <div className="col-md-6 col-lg-3">
                  <StatCard
                    title="총 주문 수"
                    value={stats.totalOrders.toLocaleString()}
                    icon={
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                </div>
                <div className="col-md-6 col-lg-3">
                  <StatCard
                    title="총 회원 수"
                    value={stats.totalUsers.toLocaleString()}
                    icon={
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                </div>
                <div className="col-md-6 col-lg-3">
                  <StatCard
                    title="총 매출"
                    value={`₩${Math.floor(stats.totalRevenue / 10000).toLocaleString()}만`}
                    icon={
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
              </div>

              {/* 메인 컨텐츠 그리드 */}
              <div className="row g-4">
                {/* 최근 주문 */}
                <div className="col-lg-8">
                  <div
                    className="card border-0 shadow-sm"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  >
                    <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between p-4">
                      <h5 className="mb-0 fw-bold">최근 주문</h5>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-primary me-2"
                          style={{ width: "12px", height: "12px", animation: "pulse 2s infinite" }}
                        ></div>
                        <span className="small text-muted">실시간 업데이트</span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex flex-column gap-3">
                        {recentOrders.map((order) => (
                          <RecentOrderItem key={order.id} order={order} />
                        ))}
                      </div>
                      <div className="mt-4">
                        <button
                          className="btn btn-outline-primary w-100 rounded-3 py-2"
                          style={{ backgroundColor: "rgba(13, 110, 253, 0.05)" }}
                        >
                          모든 주문 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 사이드바 영역 */}
                <div className="col-lg-4">
                  <div className="d-flex flex-column gap-4">
                    {/* 빠른 작업 */}
                    <div
                      className="card border-0 shadow-sm"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                    >
                      <div className="card-header bg-transparent border-bottom p-4">
                        <h5 className="mb-0 fw-bold">빠른 작업</h5>
                      </div>
                      <div className="card-body p-4">
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
                    <div
                      className="card border-0 shadow-sm"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                    >
                      <div className="card-header bg-transparent border-bottom p-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-2 me-3"
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: "rgba(220, 53, 69, 0.1)",
                            }}
                          >
                            <svg
                              className="text-danger"
                              width="16"
                              height="16"
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
                          <h5 className="mb-0 fw-bold">재고 부족 알림</h5>
                        </div>
                      </div>
                      <div className="card-body p-4">
                        <div className="d-flex flex-column gap-3">
                          {lowStockItems.map((item, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center justify-content-between p-3 rounded-3 border border-danger border-opacity-25"
                              style={{ backgroundColor: "rgba(220, 53, 69, 0.05)" }}
                            >
                              <div>
                                <h6 className="mb-1 fw-medium small">{item.name}</h6>
                                <p className="mb-0 small text-muted">재고: {item.stock}개</p>
                              </div>
                              <div
                                className="d-flex align-items-center justify-content-center rounded-2 text-danger fw-bold"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  backgroundColor: "rgba(220, 53, 69, 0.1)",
                                }}
                              >
                                <span className="small">{item.stock}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            className="btn btn-outline-danger w-100 rounded-3 py-2"
                            style={{ backgroundColor: "rgba(220, 53, 69, 0.05)" }}
                          >
                            재고 관리로 이동
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          .hover-bg-light:hover {
            background-color: rgba(248, 249, 250, 0.8) !important;
          }
        `}</style>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
