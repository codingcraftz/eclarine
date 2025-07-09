import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import AdminLayout from "../../../components/admin/AdminLayout";

const ProductRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    sku: "",
    category: "",
    tags: "",
    status: "in-stock",
    img: "",
    imageURLs: [],
  });
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const categories = [
    { id: "jewelry", name: "Jewelry" },
    { id: "all-silver", name: "All Silver" },
    { id: "gold", name: "Gold" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target.result);
        setFormData((prev) => ({
          ...prev,
          img: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    const urls = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        urls.push({
          color: { name: "Default", clrCode: "#000000" },
          img: e.target.result,
        });

        if (previews.length === files.length) {
          setGalleryPreviews(previews);
          setFormData((prev) => ({
            ...prev,
            imageURLs: urls,
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const generateSKU = () => {
    const prefix = "ECL";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "상품명을 입력해주세요.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "상품 설명을 입력해주세요.";
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "올바른 가격을 입력해주세요.";
    }

    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = "올바른 재고 수량을 입력해주세요.";
    }

    if (!formData.category) {
      newErrors.category = "카테고리를 선택해주세요.";
    }

    if (!formData.img) {
      newErrors.img = "메인 이미지를 업로드해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // SKU 자동 생성
      const sku = formData.sku || generateSKU();

      // 선택된 카테고리 정보
      const selectedCategory = categories.find((cat) => cat.id === formData.category);

      // 상품 데이터 구성
      const productData = {
        _id: `prod_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discount: formData.discount ? Number(formData.discount) : 0,
        quantity: Number(formData.quantity),
        sku: sku,
        status: formData.status,
        img: formData.img,
        imageURLs: formData.imageURLs,
        category: {
          name: selectedCategory.name,
          id: selectedCategory.id,
        },
        brand: {
          name: "ECLARINE",
          id: "brand_eclarine",
        },
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        additionalInformation: [
          { key: "Material", value: "Sterling Silver" },
          { key: "Origin", value: "Korea" },
          { key: "Care", value: "Avoid moisture and chemicals" },
        ],
        reviews: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 실제로는 Supabase에 저장
      console.log("상품 등록 데이터:", productData);

      // 성공 시뮬레이션
      setTimeout(() => {
        alert("상품이 성공적으로 등록되었습니다!");
        router.push("/admin/products");
      }, 1000);
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>상품 등록 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="products">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">새 상품 등록</h1>
            <p className="mt-1 text-sm text-gray-600">
              에끌라린 쇼핑몰에 새로운 상품을 등록합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 기본 정보 */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">기본 정보</h3>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      상품명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="예: 올실버 진주토끼 귀걸이"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      SKU (자동 생성)
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="비워두면 자동 생성됩니다"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    상품 설명 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="상품에 대한 자세한 설명을 입력해주세요"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      가격 (원) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="32000"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">할인율 (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      재고 수량 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="50"
                      min="0"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      카테고리 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">카테고리를 선택하세요</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">상태</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="in-stock">판매중</option>
                      <option value="out-of-stock">품절</option>
                      <option value="discontinued">단종</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="실버, 귀걸이, 진주, 토끼"
                  />
                </div>
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">이미지</h3>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    메인 이미지 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {mainImagePreview ? (
                        <div className="relative">
                          <Image
                            src={mainImagePreview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="mx-auto rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setMainImagePreview("");
                              setFormData((prev) => ({ ...prev, img: "" }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                              <span>메인 이미지 업로드</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  {errors.img && <p className="mt-1 text-sm text-red-600">{errors.img}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    갤러리 이미지 (선택사항)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {galleryPreviews.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={preview}
                                alt={`Gallery ${index + 1}`}
                                width={120}
                                height={120}
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                              <span>갤러리 이미지 업로드</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryImagesChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">여러 이미지를 선택할 수 있습니다</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    등록 중...
                  </div>
                ) : (
                  "상품 등록"
                )}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};

export default ProductRegister;
