import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../../../components/admin/AdminLayout";
import { supabaseService } from "../../../lib/supabase";
import { getImageUrl, DEFAULT_LOGO_IMAGE } from "../../../utils/image-utils";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, filterStatus]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, count } = await supabaseService.getProductsWithPagination(
        currentPage,
        itemsPerPage,
        searchTerm,
        filterStatus
      );

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("상품 로딩 오류:", err);
      setError("상품 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await supabaseService.updateProduct(productId, { status: newStatus });
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, status: newStatus } : product
        )
      );
    } catch (err) {
      console.error("상품 상태 업데이트 오류:", err);
      alert("상태 업데이트에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async (productId, productTitle) => {
    if (window.confirm(`"${productTitle}" 상품을 삭제하시겠습니까?`)) {
      try {
        await supabaseService.deleteProduct(productId);
        setProducts((prev) => prev.filter((product) => product.id !== productId));
        alert("상품이 삭제되었습니다.");
      } catch (err) {
        console.error("상품 삭제 오류:", err);
        alert("상품 삭제에 실패했습니다.");
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "badge bg-success",
      inactive: "badge bg-secondary",
      draft: "badge bg-warning",
    };

    const labels = {
      active: "판매중",
      inactive: "품절",
      draft: "임시저장",
    };

    return (
      <span className={badges[status] || "badge bg-secondary"}>{labels[status] || status}</span>
    );
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  if (loading) {
    return (
      <AdminLayout activeTab="products">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>상품 관리 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="products">
        <div className="container-fluid p-4">
          {/* 페이지 헤더 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">상품 관리</h1>
              <p className="text-muted">등록된 상품들을 관리하고 수정할 수 있습니다.</p>
            </div>
            <Link
              href="/admin/products/register"
              className="btn btn-primary"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              <i className="fas fa-plus me-2"></i>새 상품 등록
            </Link>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* 필터 및 검색 */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <input
                    type="text"
                    placeholder="상품명 또는 SKU로 검색..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <select
                    value={filterStatus}
                    onChange={handleStatusFilterChange}
                    className="form-select"
                  >
                    <option value="all">모든 상태</option>
                    <option value="active">판매중</option>
                    <option value="inactive">품절</option>
                    <option value="draft">임시저장</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">상품 목록 ({totalCount}개)</h5>
              <small className="text-muted">
                {totalPages > 1 && `${currentPage} / ${totalPages} 페이지`}
              </small>
            </div>

            {products.length === 0 ? (
              <div className="card-body text-center py-5">
                <div className="mb-4" style={{ fontSize: "4rem" }}>
                  📦
                </div>
                <h5 className="mb-3">상품이 없습니다</h5>
                <p className="text-muted mb-4">조건에 맞는 상품을 찾을 수 없습니다.</p>
                <Link href="/admin/products/register" className="btn btn-primary">
                  첫 번째 상품을 등록해보세요 →
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">상품 정보</th>
                        <th scope="col">SKU</th>
                        <th scope="col">가격</th>
                        <th scope="col">재고</th>
                        <th scope="col">판매량</th>
                        <th scope="col">상태</th>
                        <th scope="col">등록일</th>
                        <th scope="col" className="text-end">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <Image
                                  src={getImageUrl(product.featured_image, DEFAULT_LOGO_IMAGE)}
                                  alt={product.title}
                                  width={48}
                                  height={48}
                                  className="rounded object-cover"
                                  style={{ width: "48px", height: "48px" }}
                                />
                              </div>
                              <div>
                                <div className="fw-medium" style={{ maxWidth: "200px" }}>
                                  {product.title}
                                </div>
                                <small className="text-muted">
                                  {product.categories?.name || "카테고리 없음"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <code className="text-dark">{product.sku}</code>
                          </td>
                          <td>
                            <strong>₩{Number(product.price).toLocaleString()}</strong>
                            {product.compare_price && (
                              <div>
                                <small className="text-muted text-decoration-line-through">
                                  ₩{Number(product.compare_price).toLocaleString()}
                                </small>
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={product.quantity < 10 ? "text-danger fw-medium" : ""}>
                              {product.quantity}개
                            </span>
                            {product.quantity < 10 && (
                              <small className="d-block text-warning">
                                <i className="fas fa-exclamation-triangle me-1"></i>재고 부족
                              </small>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-info">{product.sales_count || 0}개</span>
                          </td>
                          <td>{getStatusBadge(product.status)}</td>
                          <td>
                            <small className="text-muted">
                              {new Date(product.created_at).toLocaleDateString("ko-KR")}
                            </small>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() =>
                                  (window.location.href = `/admin/products/edit/${product.id}`)
                                }
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteProduct(product.id, product.title)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="card-footer">
                    <nav aria-label="상품 목록 페이지네이션">
                      <ul className="pagination justify-content-center mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            이전
                          </button>
                        </li>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const pageNumber =
                            currentPage <= 3 ? i + 1 : Math.max(1, currentPage - 2) + i;
                          if (pageNumber > totalPages) return null;
                          return (
                            <li
                              key={pageNumber}
                              className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            </li>
                          );
                        })}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            다음
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ProductsManagement;
