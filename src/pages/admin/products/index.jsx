import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../../../components/admin/AdminLayout";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // 실제로는 Supabase에서 데이터를 가져올 예정
    // 지금은 임시 데이터 설정
    setTimeout(() => {
      setProducts([
        {
          _id: "prod_pearl_rabbit_001",
          title: "올실버 진주토끼 귀걸이",
          sku: "ECL-PR-001",
          price: 32000,
          quantity: 42,
          sold: 8,
          status: "in-stock",
          img: "https://via.placeholder.com/400x400?text=Product+1",
          category: { name: "All Silver" },
          createdAt: "2024-01-15",
        },
        {
          _id: "prod_cross_necklace_001",
          title: "올실버 십자가 목걸이",
          sku: "ECL-CN-001",
          price: 34000,
          quantity: 25,
          sold: 5,
          status: "in-stock",
          img: "https://via.placeholder.com/400x400?text=Product+2",
          category: { name: "All Silver" },
          createdAt: "2024-01-16",
        },
        {
          _id: "prod_chain_bracelet_001",
          title: "블링블링 실버 체인 팔찌",
          sku: "ECL-CB-001",
          price: 96000,
          quantity: 13,
          sold: 2,
          status: "in-stock",
          img: "https://via.placeholder.com/400x400?text=Product+3",
          category: { name: "All Silver" },
          createdAt: "2024-01-17",
        },
        {
          _id: "prod_daisy_earring_001",
          title: "데이지 실버 딱붙 귀걸이",
          sku: "ECL-DE-001",
          price: 18000,
          quantity: 75,
          sold: 25,
          status: "in-stock",
          img: "https://via.placeholder.com/400x400?text=Product+4",
          category: { name: "All Silver" },
          createdAt: "2024-01-18",
        },
        {
          _id: "prod_heart_gem_earring_001",
          title: "올실버 하트 보석 귀걸이",
          sku: "ECL-HGE-001",
          price: 33000,
          quantity: 28,
          sold: 12,
          status: "in-stock",
          img: "https://via.placeholder.com/400x400?text=Product+5",
          category: { name: "All Silver" },
          createdAt: "2024-01-19",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (productId, newStatus) => {
    // 실제로는 Supabase 업데이트 API 호출
    setProducts((prev) =>
      prev.map((product) =>
        product._id === productId ? { ...product, status: newStatus } : product
      )
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      "in-stock": "bg-green-100 text-green-800",
      "out-of-stock": "bg-red-100 text-red-800",
      discontinued: "bg-gray-100 text-gray-800",
    };

    const labels = {
      "in-stock": "판매중",
      "out-of-stock": "품절",
      discontinued: "단종",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badges[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout activeTab="products">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
              <p className="mt-1 text-sm text-gray-600">
                등록된 상품들을 관리하고 수정할 수 있습니다.
              </p>
            </div>
            <Link
              href="/admin/products/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span className="mr-2">➕</span>새 상품 등록
            </Link>
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="상품명 또는 SKU로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">모든 상태</option>
                  <option value="in-stock">판매중</option>
                  <option value="out-of-stock">품절</option>
                  <option value="discontinued">단종</option>
                </select>
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                상품 목록 ({filteredProducts.length}개)
              </h3>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">상품이 없습니다</h3>
                <p className="text-gray-500 mb-4">조건에 맞는 상품을 찾을 수 없습니다.</p>
                <Link
                  href="/admin/products/register"
                  className="text-purple-600 hover:text-purple-500"
                >
                  첫 번째 상품을 등록해보세요 →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상품 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        가격
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        재고
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        판매량
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        등록일
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <Image
                                src={product.img}
                                alt={product.title}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {product.title}
                              </div>
                              <div className="text-sm text-gray-500">{product.category.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₩{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={product.quantity < 10 ? "text-red-600 font-medium" : ""}>
                            {product.quantity}개
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.sold}개
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(product.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-purple-600 hover:text-purple-900">수정</button>
                            <button className="text-red-600 hover:text-red-900">삭제</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ProductsManagement;
