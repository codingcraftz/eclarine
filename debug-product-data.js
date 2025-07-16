import { supabase } from "./src/lib/supabase.js";

async function checkProductData() {
  try {
    console.log("상품 데이터 확인 중...");

    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, featured_image, gallery_images")
      .limit(5);

    if (error) {
      console.error("오류:", error);
      return;
    }

    console.log("상품 데이터:", products);

    products.forEach((product, index) => {
      console.log(`\n--- 상품 ${index + 1} ---`);
      console.log("제목:", product.title);
      console.log("featured_image:", product.featured_image);
      console.log("gallery_images:", product.gallery_images);

      if (product.featured_image) {
        console.log("featured_image 타입:", typeof product.featured_image);
        console.log("featured_image 길이:", product.featured_image?.length);
        console.log("featured_image 시작 문자:", product.featured_image?.charCodeAt(0));
      }
    });
  } catch (error) {
    console.error("실행 오류:", error);
  }
}

checkProductData();
