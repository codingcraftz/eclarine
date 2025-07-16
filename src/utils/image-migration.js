import { supabaseService } from "../lib/supabase";

/**
 * 기존 정적 이미지를 Supabase Storage로 마이그레이션
 * @param {string} imageUrl - 기존 이미지 URL 또는 경로
 * @returns {Promise<string>} - 새로운 Supabase Storage URL
 */
export const migrateImageToStorage = async (imageUrl) => {
  try {
    // 이미 Supabase Storage URL인 경우 그대로 반환
    if (imageUrl && imageUrl.includes("supabase.co/storage")) {
      return imageUrl;
    }

    // 로컬 경로인 경우 공개 URL로 변환
    if (imageUrl && imageUrl.startsWith("/assets/")) {
      const publicUrl = `${window.location.origin}${imageUrl}`;

      // 이미지를 fetch하여 Storage에 업로드
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error("이미지를 불러올 수 없습니다");
      }

      const blob = await response.blob();
      const fileName = imageUrl.split("/").pop();
      const file = new File([blob], fileName, { type: blob.type });

      const uploadResult = await supabaseService.uploadImage(file);
      return uploadResult.publicUrl;
    }

    return imageUrl;
  } catch (error) {
    console.error("이미지 마이그레이션 오류:", error);
    return imageUrl; // 실패 시 원본 URL 반환
  }
};

/**
 * 여러 이미지를 일괄 마이그레이션
 * @param {string[]} imageUrls - 이미지 URL 배열
 * @returns {Promise<string[]>} - 마이그레이션된 URL 배열
 */
export const migrateMultipleImages = async (imageUrls) => {
  if (!Array.isArray(imageUrls)) {
    return [];
  }

  const migrationPromises = imageUrls.map((url) => migrateImageToStorage(url));
  const results = await Promise.allSettled(migrationPromises);

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      console.error(`이미지 마이그레이션 실패 (${imageUrls[index]}):`, result.reason);
      return imageUrls[index]; // 실패 시 원본 URL 반환
    }
  });
};

/**
 * 모든 상품의 이미지를 마이그레이션
 * @returns {Promise<void>}
 */
export const migrateAllProductImages = async () => {
  try {
    console.log("상품 이미지 마이그레이션 시작...");

    const products = await supabaseService.getAllProducts();
    let migratedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      const updatedProduct = { ...product };

      // 대표 이미지 마이그레이션
      if (product.featured_image && !product.featured_image.includes("supabase.co/storage")) {
        const newUrl = await migrateImageToStorage(product.featured_image);
        if (newUrl !== product.featured_image) {
          updatedProduct.featured_image = newUrl;
          needsUpdate = true;
        }
      }

      // 갤러리 이미지 마이그레이션
      if (product.gallery_images && Array.isArray(product.gallery_images)) {
        const newGalleryImages = await migrateMultipleImages(product.gallery_images);
        if (JSON.stringify(newGalleryImages) !== JSON.stringify(product.gallery_images)) {
          updatedProduct.gallery_images = newGalleryImages;
          needsUpdate = true;
        }
      }

      // 업데이트가 필요한 경우 저장
      if (needsUpdate) {
        await supabaseService.updateProduct(product.id, {
          featured_image: updatedProduct.featured_image,
          gallery_images: updatedProduct.gallery_images,
        });
        migratedCount++;
        console.log(`상품 "${product.title}" 이미지 마이그레이션 완료`);
      }
    }

    console.log(`마이그레이션 완료: ${migratedCount}개 상품 처리됨`);
  } catch (error) {
    console.error("상품 이미지 마이그레이션 실패:", error);
  }
};

/**
 * 이미지 URL이 유효한지 확인
 * @param {string} imageUrl - 확인할 이미지 URL
 * @returns {Promise<boolean>} - 유효성 여부
 */
export const validateImageUrl = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * 이미지 URL을 최적화된 형태로 변환
 * @param {string} imageUrl - 원본 이미지 URL
 * @param {Object} options - 최적화 옵션
 * @returns {string} - 최적화된 이미지 URL
 */
export const optimizeImageUrl = (imageUrl, options = {}) => {
  const { width = null, height = null, quality = 80, format = "webp" } = options;

  // Supabase Storage URL이 아닌 경우 그대로 반환
  if (!imageUrl || !imageUrl.includes("supabase.co/storage")) {
    return imageUrl;
  }

  // 향후 이미지 변환 서비스 연동 시 사용
  // 현재는 원본 URL 반환
  return imageUrl;
};

/**
 * 이미지 파일명에서 확장자 추출
 * @param {string} imageUrl - 이미지 URL
 * @returns {string} - 확장자 (예: 'jpg', 'png')
 */
export const getImageExtension = (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname;
    const parts = pathname.split(".");
    return parts[parts.length - 1].toLowerCase();
  } catch (error) {
    return "jpg"; // 기본값
  }
};

/**
 * 이미지 크기 정보 가져오기
 * @param {string} imageUrl - 이미지 URL
 * @returns {Promise<{width: number, height: number}>} - 이미지 크기
 */
export const getImageDimensions = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

/**
 * 이미지 URL 배열에서 중복 제거
 * @param {string[]} imageUrls - 이미지 URL 배열
 * @returns {string[]} - 중복이 제거된 URL 배열
 */
export const deduplicateImageUrls = (imageUrls) => {
  if (!Array.isArray(imageUrls)) {
    return [];
  }

  return [...new Set(imageUrls.filter((url) => url && url.trim()))];
};

/**
 * 이미지 URL을 안전한 형태로 변환
 * @param {string} imageUrl - 원본 이미지 URL
 * @returns {string} - 안전한 이미지 URL
 */
export const getSafeImageUrl = (imageUrl) => {
  // 빈 값이나 null인 경우 기본 이미지 반환
  if (!imageUrl || imageUrl.trim() === "") {
    return "/assets/img/product/product-placeholder.jpg";
  }

  // Supabase Storage URL인 경우 그대로 반환
  if (imageUrl.includes("supabase.co/storage")) {
    return imageUrl;
  }

  // 상대 경로인 경우 절대 경로로 변환
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // 기타 경우 기본 이미지 반환
  return "/assets/img/product/product-placeholder.jpg";
};
