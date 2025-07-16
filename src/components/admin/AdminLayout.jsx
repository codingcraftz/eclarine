import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminLayout = ({ children, activeTab = "dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: "fas fa-tachometer-alt", path: "/admin" },
    { id: "products", label: "상품 관리", icon: "fas fa-box", path: "/admin/products" },
    { id: "orders", label: "주문 관리", icon: "fas fa-shopping-cart", path: "/admin/orders" },
    { id: "users", label: "회원 관리", icon: "fas fa-users", path: "/admin/users" },
    { id: "coupons", label: "쿠폰 관리", icon: "fas fa-ticket-alt", path: "/admin/coupons" },
    { id: "analytics", label: "분석", icon: "fas fa-chart-bar", path: "/admin/analytics" },
    { id: "delivery", label: "배송 관리", icon: "fas fa-truck", path: "/admin/delivery" },
  ];

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 로그아웃 로직 (로컬 스토리지 클리어 등)
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    }
  };

  return (
    <>
      <Head>
        <title>
          에끌라린 관리자 - {menuItems.find((item) => item.id === activeTab)?.label || "관리자"}
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-layout">
        {/* 사이드바 오버레이 (모바일) */}
        {sidebarOpen && (
          <div className="sidebar-overlay d-lg-none" onClick={() => setSidebarOpen(false)} />
        )}

        {/* 사이드바 */}
        <nav className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <Link href="/admin" className="d-flex align-items-center text-decoration-none">
              <div className="logo-icon">
                <i className="fas fa-gem text-primary"></i>
              </div>
              <span className="logo-text">에끌라린</span>
            </Link>
          </div>

          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`sidebar-menu-item ${activeTab === item.id ? "active" : ""}`}
              >
                <i className={`${item.icon} sidebar-menu-icon`}></i>
                <span className="sidebar-menu-text">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="sidebar-footer">
            <button className="sidebar-menu-item sidebar-logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt sidebar-menu-icon"></i>
              <span className="sidebar-menu-text">로그아웃</span>
            </button>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main className="main-content">
          {/* 상단 헤더 */}
          <header className="main-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-link d-lg-none me-3"
                  onClick={() => setSidebarOpen(true)}
                >
                  <i className="fas fa-bars"></i>
                </button>
                <h1 className="page-title mb-0">
                  {menuItems.find((item) => item.id === activeTab)?.label || "관리자"}
                </h1>
              </div>

              <div className="header-actions">
                <Link href="/" className="btn btn-outline-primary me-3">
                  <i className="fas fa-home me-2"></i>
                  사이트 보기
                </Link>
                <div className="admin-info">
                  <span className="admin-name">관리자</span>
                  <div className="admin-avatar">
                    <i className="fas fa-user-shield"></i>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* 페이지 콘텐츠 */}
          <div className="page-content">{children}</div>
        </main>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
        }

        .sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 1050;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .sidebar-open {
          transform: translateX(0);
        }

        @media (min-width: 992px) {
          .sidebar {
            position: static;
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-icon {
          font-size: 1.5rem;
          margin-right: 0.75rem;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
        }

        .sidebar-menu {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
        }

        .sidebar-menu-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .sidebar-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .sidebar-menu-item.active {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border-right: 3px solid white;
        }

        .sidebar-menu-icon {
          width: 20px;
          margin-right: 0.75rem;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-logout-btn {
          color: rgba(255, 255, 255, 0.6);
        }

        .sidebar-logout-btn:hover {
          color: #ff6b6b;
          background-color: rgba(255, 107, 107, 0.1);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 0;
        }

        @media (min-width: 992px) {
          .main-content {
            margin-left: 280px;
          }
        }

        .main-header {
          background: white;
          padding: 1rem 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid #e9ecef;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .admin-info {
          display: flex;
          align-items: center;
        }

        .admin-name {
          margin-right: 0.75rem;
          font-weight: 500;
          color: #6c757d;
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .page-content {
          flex: 1;
          padding: 0;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .main-header {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.25rem;
          }

          .admin-name {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default AdminLayout;
