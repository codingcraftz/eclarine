import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AdminLayout from "../../../../components/admin/AdminLayout";
import ImageUpload from "../../../../components/admin/ImageUpload";
import { supabaseService } from "../../../../lib/supabase";
import {
  getImageUrl,
  getGalleryImages,
  DEFAULT_PRODUCT_IMAGE,
} from "../../../../utils/image-utils";

const ProductEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    price: "",
    compare_price: "",
    quantity: "",
    sku: "",
    category_id: "",
    brand_id: "",
    tags: "",
    status: "active",
    weight: "",
    dimensions: "",
    is_featured: false,
    is_popular: false,
    is_bestseller: false,
    meta_title: "",
    meta_description: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (id) {
      loadProduct();
      loadCategoriesAndBrands();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoadingProduct(true);
      const product = await supabaseService.getProductById(id);

      if (product) {
        setFormData({
          title: product.title || "",
          description: product.description || "",
          short_description: product.short_description || "",
          price: product.price || "",
          compare_price: product.compare_price || "",
          quantity: product.quantity || "",
          sku: product.sku || "",
          category_id: product.category_id || "",
          brand_id: product.brand_id || "",
          tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
          status: product.status || "active",
          weight: product.weight || "",
          dimensions: product.dimensions || "",
          is_featured: product.is_featured || false,
          is_popular: product.is_popular || false,
          is_bestseller: product.is_bestseller || false,
          meta_title: product.meta_title || "",
          meta_description: product.meta_description || "",
        });

        // 기존 이미지 설정 (이미지 처리 유틸리티 사용)
        const images = [];
        if (product.featured_image) {
          const processedFeaturedImage = getImageUrl(product.featured_image);
          if (processedFeaturedImage !== DEFAULT_PRODUCT_IMAGE) {
            images.push(processedFeaturedImage);
          }
        }
        if (product.gallery_images && Array.isArray(product.gallery_images)) {
          const processedGalleryImages = getGalleryImages(product.gallery_images);
          images.push(...processedGalleryImages);
        }
        setExistingImages(images);
      }
    } catch (error) {
      console.error("상품 로딩 오류:", error);
      alert("상품을 불러오는데 실패했습니다.");
      router.push("/admin/products");
    } finally {
      setLoadingProduct(false);
    }
  };

  const loadCategoriesAndBrands = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        supabaseService.getCategories(),
        supabaseService.getBrands(),
      ]);
      setCategories(categoriesData || []);
      setBrands(brandsData || []);
    } catch (error) {
      console.error("카테고리/브랜드 로딩 오류:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImagesChange = (images) => {
    setSelectedImages(images);
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };

  const handleExistingImageRemove = (imageUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setImagesToDelete((prev) => [...prev, imageUrl]);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
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

    if (!formData.category_id) {
      newErrors.category_id = "카테고리를 선택해주세요.";
    }

    if (existingImages.length === 0 && selectedImages.length === 0) {
      newErrors.images = "최소 1개의 상품 이미지가 필요합니다.";
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
      // 새로운 이미지 업로드
      let newImageUrls = [];
      if (selectedImages.length > 0) {
        const uploadResults = await supabaseService.uploadMultipleImages(selectedImages);
        newImageUrls = uploadResults.map((result) => result.publicUrl);
      }

      // 삭제할 이미지들 처리
      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map((imageUrl) => {
            // URL에서 파일 경로 추출
            const urlParts = imageUrl.split("/");
            const fileName = urlParts[urlParts.length - 1];
            const filePath = `products/${fileName}`;
            return supabaseService.deleteImage(filePath);
          })
        );
      }

      // 최종 이미지 URL 배열 생성
      const allImageUrls = [...existingImages, ...newImageUrls];

      const slug = generateSlug(formData.title);

      // 상품 데이터 구성
      const productData = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        short_description: formData.short_description,
        sku: formData.sku,
        price: Number(formData.price),
        compare_price: formData.compare_price ? Number(formData.compare_price) : null,
        quantity: Number(formData.quantity),
        weight: formData.weight ? Number(formData.weight) : null,
        dimensions: formData.dimensions || null,
        status: formData.status,
        featured_image: allImageUrls[0] || null,
        gallery_images: allImageUrls.length > 1 ? allImageUrls.slice(1) : [],
        category_id: formData.category_id || null,
        brand_id: formData.brand_id || null,
        is_featured: formData.is_featured,
        is_popular: formData.is_popular,
        is_bestseller: formData.is_bestseller,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.short_description,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      // Supabase에 상품 업데이트
      await supabaseService.updateProduct(id, productData);

      alert("상품이 성공적으로 수정되었습니다!");
      router.push("/admin/products");
    } catch (error) {
      console.error("상품 수정 오류:", error);
      alert("상품 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <AdminLayout activeTab="products">
        <div className="container-fluid p-4">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>상품 수정 - 에끌라린 관리자</title>
      </Head>

      <AdminLayout activeTab="products">
        <div className="container-fluid p-4">
          {/* 페이지 헤더 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">상품 수정</h1>
              <p className="text-muted">기존 상품 정보를 수정할 수 있습니다.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="btn btn-outline-secondary"
            >
              <i className="fas fa-arrow-left me-2"></i>
              목록으로
            </button>
          </div>

          {/* 상품 수정 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* 왼쪽 컬럼 - 기본 정보 */}
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">기본 정보</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label">상품명 *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`form-control ${errors.title ? "is-invalid" : ""}`}
                          placeholder="상품명을 입력해주세요"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">SKU</label>
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="SKU"
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">짧은 설명</label>
                        <textarea
                          name="short_description"
                          value={formData.short_description}
                          onChange={handleInputChange}
                          className="form-control"
                          rows={3}
                          placeholder="상품의 짧은 설명을 입력해주세요"
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">상품 설명 *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className={`form-control ${errors.description ? "is-invalid" : ""}`}
                          rows={8}
                          placeholder="상품의 상세한 설명을 입력해주세요"
                        />
                        {errors.description && (
                          <div className="invalid-feedback">{errors.description}</div>
                        )}
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">태그</label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="태그를 쉼표로 구분해서 입력해주세요 (예: 반지, 골드, 다이아몬드)"
                        />
                        <small className="text-muted">쉼표(,)로 구분하여 입력해주세요</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 이미지 업로드 */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">상품 이미지</h5>
                  </div>
                  <div className="card-body">
                    <ImageUpload
                      onImagesChange={handleImagesChange}
                      existingImages={existingImages}
                      onExistingImageRemove={handleExistingImageRemove}
                      maxImages={5}
                    />
                    {errors.images && <div className="text-danger mt-2">{errors.images}</div>}
                  </div>
                </div>

                {/* SEO 정보 */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">SEO 정보</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label">메타 제목</label>
                        <input
                          type="text"
                          name="meta_title"
                          value={formData.meta_title}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="비워두면 상품명으로 자동 설정됩니다"
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">메타 설명</label>
                        <textarea
                          name="meta_description"
                          value={formData.meta_description}
                          onChange={handleInputChange}
                          className="form-control"
                          rows={3}
                          placeholder="비워두면 짧은 설명으로 자동 설정됩니다"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽 컬럼 - 가격 및 재고 */}
              <div className="col-lg-4">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">가격 정보</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">판매 가격 *</label>
                      <div className="input-group">
                        <span className="input-group-text">₩</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`form-control ${errors.price ? "is-invalid" : ""}`}
                          placeholder="0"
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">정가 (할인 전 가격)</label>
                      <div className="input-group">
                        <span className="input-group-text">₩</span>
                        <input
                          type="number"
                          name="compare_price"
                          value={formData.compare_price}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="0"
                        />
                      </div>
                      <small className="text-muted">
                        판매 가격보다 높게 설정하면 할인율이 표시됩니다
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">중량 (g)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">치수 정보</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">치수</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="예: 10cm x 5cm x 2cm"
                      />
                      <small className="text-muted">
                        상품의 치수를 입력해주세요 (예: 10cm x 5cm x 2cm)
                      </small>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">재고 관리</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">재고 수량 *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                        placeholder="0"
                      />
                      {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">분류 정보</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">카테고리 *</label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                      >
                        <option value="">카테고리 선택</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <div className="invalid-feedback">{errors.category_id}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">브랜드</label>
                      <select
                        name="brand_id"
                        value={formData.brand_id}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">브랜드 선택</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">상품 설정</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">상품 상태</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="active">판매중</option>
                        <option value="inactive">품절</option>
                        <option value="draft">임시저장</option>
                      </select>
                    </div>

                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        name="is_featured"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="is_featured">
                        추천 상품
                      </label>
                    </div>

                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        name="is_popular"
                        id="is_popular"
                        checked={formData.is_popular}
                        onChange={handleInputChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="is_popular">
                        인기 상품
                      </label>
                    </div>

                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        name="is_bestseller"
                        id="is_bestseller"
                        checked={formData.is_bestseller}
                        onChange={handleInputChange}
                        className="form-check-input"
                      />
                      <label className="form-check-label" htmlFor="is_bestseller">
                        베스트셀러
                      </label>
                    </div>
                  </div>
                </div>

                {/* 저장 버튼 */}
                <div className="d-grid gap-2">
                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        수정 중...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        상품 수정
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/admin/products")}
                    className="btn btn-outline-secondary"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
};

export default ProductEdit;
