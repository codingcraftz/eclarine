import { supabaseService } from "../lib/supabase";

// 기본 이미지 경로
export const DEFAULT_PRODUCT_IMAGE = "/assets/img/product/product-1.jpg";
export const DEFAULT_LOGO_IMAGE = "/assets/img/logo/favicon.png";

/**
 * 이미지 URL을 안전하게 처리하는 함수
 * @param {string} imagePath - 이미지 경로
 * @param {string} fallbackImage - 기본 이미지 경로
 * @returns {string} 처리된 이미지 URL
 */
export const getImageUrl = (imagePath, fallbackImage = DEFAULT_PRODUCT_IMAGE) => {
  // 이미지 경로가 없는 경우
  if (!imagePath || imagePath === null || imagePath === undefined) {
    return fallbackImage;
  }

  // 문자열이 아닌 경우
  if (typeof imagePath !== "string") {
    return fallbackImage;
  }

  // 빈 문자열이나 공백만 있는 경우
  if (imagePath.trim() === "") {
    return fallbackImage;
  }

  // 특수문자가 포함된 잘못된 경로 처리
  const hasSpecialChars =
    imagePath.includes("⁢") ||
    imagePath.charCodeAt(0) === 8290 ||
    /[\u200B-\u200D\uFEFF\u2060-\u206F]/.test(imagePath);

  if (hasSpecialChars) {
    console.warn("잘못된 이미지 경로 감지 (특수문자 포함):", imagePath);
    return fallbackImage;
  }

  // 이미 전체 URL인 경우 그대로 반환
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // 절대 경로로 시작하는 경우 (예: /assets/items/1.jpeg)
  if (imagePath.startsWith("/assets/") || imagePath.startsWith("assets/")) {
    // 실제 파일이 존재하지 않으므로 기본 이미지 반환
    return fallbackImage;
  }

  // Supabase Storage URL 생성 시도
  try {
    const url = supabaseService.getImageUrl(imagePath);
    return url || fallbackImage;
  } catch (error) {
    console.error("이미지 URL 생성 오류:", error);
    return fallbackImage;
  }
};

/**
 * 갤러리 이미지 배열을 안전하게 처리하는 함수
 * @param {Array} galleryImages - 갤러리 이미지 배열
 * @returns {Array} 처리된 이미지 URL 배열
 */
export const getGalleryImages = (galleryImages) => {
  if (!Array.isArray(galleryImages)) {
    return [];
  }

  return galleryImages
    .filter((img) => img && typeof img === "string" && img.trim() !== "")
    .map((img) => getImageUrl(img))
    .filter((url) => url !== DEFAULT_PRODUCT_IMAGE); // 기본 이미지는 갤러리에서 제외
};

/**
 * 상품 이미지 정보를 안전하게 처리하는 함수
 * @param {Object} product - 상품 정보
 * @returns {Object} 처리된 이미지 정보
 */
export const getProductImages = (product) => {
  if (!product) {
    return {
      featuredImage: DEFAULT_PRODUCT_IMAGE,
      galleryImages: [],
    };
  }

  const featuredImage = getImageUrl(product.featured_image);
  const galleryImages = getGalleryImages(product.gallery_images);

  return {
    featuredImage,
    galleryImages,
  };
};
