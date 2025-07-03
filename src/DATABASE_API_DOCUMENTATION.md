# 📊 에끌라린 쇼핑몰 - 데이터베이스 API 문서

## 📋 **목차**

1. [API 시스템 개요](#api-시스템-개요)
2. [External API (기존)](#external-api-기존)
3. [Supabase API (신규)](#supabase-api-신규)
4. [로컬 상태 관리](#로컬-상태-관리)
5. [데이터 구조](#데이터-구조)
6. [사용 예시](#사용-예시)

---

## 🏗️ **API 시스템 개요**

현재 에끌라린 쇼핑몰은 **2개의 백엔드 시스템**을 사용하고 있습니다:

| API 시스템       | 상태                | 설명                 | Base URL                           |
| ---------------- | ------------------- | -------------------- | ---------------------------------- |
| **External API** | 🟡 기존 (병행 사용) | Shofy 백엔드 API     | `https://shofy-backend.vercel.app` |
| **Supabase API** | 🟢 신규 (권장)      | 자체 Supabase 백엔드 | Supabase 클라이언트                |

---

## 🌐 **External API (기존)**

### **📦 Product API** (`src/redux/features/productApi.js`)

| 엔드포인트                          | 메서드 | 설명             | Hook                                    |
| ----------------------------------- | ------ | ---------------- | --------------------------------------- |
| `/api/product/all`                  | GET    | 모든 상품 조회   | `useGetAllProductsQuery()`              |
| `/api/product/{type}`               | GET    | 타입별 상품 조회 | `useGetProductTypeQuery({type, query})` |
| `/api/product/offer`                | GET    | 할인 상품 조회   | `useGetOfferProductsQuery(type)`        |
| `/api/product/popular/{type}`       | GET    | 인기 상품 조회   | `useGetPopularProductByTypeQuery(type)` |
| `/api/product/top-rated`            | GET    | 높은 평점 상품   | `useGetTopRatedProductsQuery()`         |
| `/api/product/single-product/{id}`  | GET    | 단일 상품 조회   | `useGetProductQuery(id)`                |
| `/api/product/related-product/{id}` | GET    | 관련 상품 조회   | `useGetRelatedProductsQuery(id)`        |

**상품 데이터 구조:**

```json
{
  "_id": "string",
  "title": "string",
  "price": "number",
  "discount": "number",
  "category": "string",
  "brand": "string",
  "img": "string",
  "description": "string",
  "tags": ["string"],
  "rating": "number",
  "reviews": ["object"]
}
```

### **📂 Category API** (`src/redux/features/categoryApi.js`)

| 엔드포인트                  | 메서드 | 설명            | Hook                                   |
| --------------------------- | ------ | --------------- | -------------------------------------- |
| `/api/category/add`         | POST   | 카테고리 추가   | `useAddCategoryMutation()`             |
| `/api/category/show`        | GET    | 모든 카테고리   | `useGetShowCategoryQuery()`            |
| `/api/category/show/{type}` | GET    | 타입별 카테고리 | `useGetProductTypeCategoryQuery(type)` |

### **👤 Auth API** (`src/redux/features/auth/authApi.js`)

| 엔드포인트                          | 메서드 | 설명                 | Hook                                 |
| ----------------------------------- | ------ | -------------------- | ------------------------------------ |
| `/api/user/signup`                  | POST   | 회원가입             | `useRegisterUserMutation()`          |
| `/api/user/login`                   | POST   | 로그인               | `useLoginUserMutation()`             |
| `/api/user/me`                      | GET    | 내 정보 조회         | `useGetUserQuery()`                  |
| `/api/user/confirmEmail/{token}`    | GET    | 이메일 인증          | `useConfirmEmailQuery(token)`        |
| `/api/user/forget-password`         | PATCH  | 비밀번호 재설정      | `useResetPasswordMutation()`         |
| `/api/user/confirm-forget-password` | PATCH  | 비밀번호 재설정 확인 | `useConfirmForgotPasswordMutation()` |
| `/api/user/change-password`         | PATCH  | 비밀번호 변경        | `useChangePasswordMutation()`        |

### **🎫 Coupon API** (`src/redux/features/coupon/couponApi.js`)

| 엔드포인트    | 메서드 | 설명           | Hook                        |
| ------------- | ------ | -------------- | --------------------------- |
| `/api/coupon` | GET    | 할인 쿠폰 조회 | `useGetOfferCouponsQuery()` |

### **🏷️ Brand API** (`src/redux/features/brandApi.js`)

| 엔드포인트          | 메서드 | 설명             | Hook                        |
| ------------------- | ------ | ---------------- | --------------------------- |
| `/api/brand/active` | GET    | 활성 브랜드 조회 | `useGetActiveBrandsQuery()` |

### **⭐ Review API** (`src/redux/features/reviewApi.js`)

| 엔드포인트        | 메서드 | 설명      | Hook                     |
| ----------------- | ------ | --------- | ------------------------ |
| `/api/review/add` | POST   | 리뷰 추가 | `useAddReviewMutation()` |

### **📦 Order API** (`src/redux/features/order/orderApi.js`)

| 엔드포인트                         | 메서드 | 설명             | Hook                               |
| ---------------------------------- | ------ | ---------------- | ---------------------------------- |
| `/api/order/create-payment-intent` | POST   | 결제 의도 생성   | `useCreatePaymentIntentMutation()` |
| `/api/order/saveOrder`             | POST   | 주문 저장        | `useSaveOrderMutation()`           |
| `/api/user-order`                  | GET    | 사용자 주문 조회 | `useGetUserOrdersQuery()`          |
| `/api/user-order/{id}`             | GET    | 특정 주문 조회   | `useGetUserOrderByIdQuery(id)`     |

---

## 🗄️ **Supabase API (신규) - 권장**

### **📦 Product API** (`src/redux/features/supabase-product-api.js`)

| 함수명               | 설명             | Hook                                         | 테이블       |
| -------------------- | ---------------- | -------------------------------------------- | ------------ |
| `getAllProducts`     | 모든 상품 조회   | `useGetAllProductsQuery()`                   | `products`   |
| `getProductById`     | ID로 상품 조회   | `useGetProductByIdQuery(id)`                 | `products`   |
| `getProductsByType`  | 타입별 상품 조회 | `useGetProductsByTypeQuery({type, filters})` | `products`   |
| `getPopularProducts` | 인기 상품 조회   | `useGetPopularProductsQuery(type)`           | `products`   |
| `getOfferProducts`   | 할인 상품 조회   | `useGetOfferProductsQuery(type)`             | `products`   |
| `getCategories`      | 카테고리 조회    | `useGetCategoriesQuery()`                    | `categories` |

**Supabase 상품 데이터 구조:**

```json
{
  "id": "uuid",
  "title": "string",
  "slug": "string",
  "price": "decimal",
  "original_price": "decimal",
  "discount": "integer",
  "category_id": "uuid",
  "brand_id": "uuid",
  "description": "text",
  "short_description": "text",
  "tags": "text[]",
  "status": "active|inactive",
  "quantity": "integer",
  "is_featured": "boolean",
  "is_popular": "boolean",
  "is_bestseller": "boolean",
  "rating": "decimal",
  "image_urls": "text[]",
  "attributes": "jsonb",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### **👤 Auth API** (`src/redux/features/supabase-auth-api.js`)

| 함수명             | 설명              | Hook                            | 기능          |
| ------------------ | ----------------- | ------------------------------- | ------------- |
| `signUp`           | 회원가입          | `useSignUpMutation()`           | Supabase Auth |
| `signIn`           | 로그인            | `useSignInMutation()`           | Supabase Auth |
| `signInWithGoogle` | Google 로그인     | `useSignInWithGoogleMutation()` | OAuth         |
| `signOut`          | 로그아웃          | `useSignOutMutation()`          | Supabase Auth |
| `resetPassword`    | 비밀번호 재설정   | `useResetPasswordMutation()`    | Supabase Auth |
| `updatePassword`   | 비밀번호 업데이트 | `useUpdatePasswordMutation()`   | Supabase Auth |
| `updateProfile`    | 프로필 업데이트   | `useUpdateProfileMutation()`    | Supabase Auth |
| `getCurrentUser`   | 현재 사용자 조회  | `useGetCurrentUserQuery()`      | Supabase Auth |

### **📦 Order API** (`src/redux/features/supabase-order-api.js`)

| 함수명              | 설명               | Hook                               | 테이블                  |
| ------------------- | ------------------ | ---------------------------------- | ----------------------- |
| `createOrder`       | 주문 생성          | `useCreateOrderMutation()`         | `orders`, `order_items` |
| `getUserOrders`     | 사용자 주문 조회   | `useGetUserOrdersQuery(userId)`    | `orders`                |
| `getOrderById`      | 특정 주문 조회     | `useGetOrderByIdQuery(orderId)`    | `orders`                |
| `updateOrderStatus` | 주문 상태 업데이트 | `useUpdateOrderStatusMutation()`   | `orders`                |
| `savePaymentInfo`   | 결제 정보 저장     | `useSavePaymentInfoMutation()`     | `payments`              |
| `getRecentOrders`   | 최근 주문들        | `useGetRecentOrdersQuery({limit})` | `orders`                |

**Supabase 주문 데이터 구조:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "order_number": "string",
  "total_amount": "decimal",
  "tax_amount": "decimal",
  "shipping_amount": "decimal",
  "discount_amount": "decimal",
  "status": "pending|processing|shipped|delivered|cancelled",
  "payment_status": "pending|completed|failed",
  "payment_method": "string",
  "shipping_address": "jsonb",
  "billing_address": "jsonb",
  "notes": "text",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "order_items": [
    {
      "id": "uuid",
      "order_id": "uuid",
      "product_id": "uuid",
      "quantity": "integer",
      "price": "decimal",
      "total": "decimal"
    }
  ]
}
```

---

## 🏪 **로컬 상태 관리**

### **🛒 Cart Slice** (`src/redux/features/cartSlice.js`)

```javascript
// 로컬스토리지 연동 장바구니 관리
const cartSlice = {
  cart_products: [],
  functions: [
    "add_cart_product", // 장바구니에 상품 추가
    "quantity_decrement", // 수량 감소
    "clear_cart", // 장바구니 비우기
    "get_cart_products", // 장바구니 상품 조회
    "remove_cart_product", // 장바구니에서 상품 제거
  ],
};
```

### **❤️ Wishlist Slice** (`src/redux/features/wishlist-slice.js`)

```javascript
// 위시리스트 관리
const wishlistSlice = {
  wishlist: [],
  functions: [
    "add_to_wishlist", // 위시리스트 추가
    "remove_wishlist_product", // 위시리스트에서 제거
  ],
};
```

### **🔍 Compare Slice** (`src/redux/features/compareSlice.js`)

```javascript
// 상품 비교 기능
const compareSlice = {
  compare_list: [],
  functions: [
    "add_to_compare", // 비교 목록에 추가
    "remove_compare_product", // 비교 목록에서 제거
  ],
};
```

### **🎫 Coupon Slice** (`src/redux/features/coupon/couponSlice.js`)

```javascript
// 쿠폰 정보 관리
const couponSlice = {
  coupon_info: undefined,
  functions: [
    "set_coupon", // 쿠폰 설정
    "get_coupons", // 쿠폰 조회
  ],
};
```

### **📦 Order Slice** (`src/redux/features/order/orderSlice.js`)

```javascript
// 주문 관련 정보 관리
const orderSlice = {
  shipping_info: {},
  stripe_client_secret: "",
  functions: [
    "set_shipping", // 배송 정보 설정
    "get_shipping", // 배송 정보 조회
    "set_client_secret", // Stripe 클라이언트 시크릿 설정
  ],
};
```

---

## 🗃️ **Supabase 데이터베이스 구조**

### **🗂️ 주요 테이블**

| 테이블명          | 설명          | 주요 컬럼                                                       |
| ----------------- | ------------- | --------------------------------------------------------------- |
| `brands`          | 브랜드 정보   | `id`, `name`, `slug`, `logo_url`, `description`                 |
| `categories`      | 카테고리 정보 | `id`, `name`, `slug`, `parent_id`, `image_url`                  |
| `products`        | 상품 정보     | `id`, `title`, `price`, `category_id`, `brand_id`, `image_urls` |
| `user_profiles`   | 사용자 프로필 | `id`, `user_id`, `full_name`, `phone`, `address`                |
| `user_addresses`  | 사용자 주소   | `id`, `user_id`, `type`, `address_line_1`, `city`, `country`    |
| `orders`          | 주문 정보     | `id`, `user_id`, `total_amount`, `status`, `payment_status`     |
| `order_items`     | 주문 상품     | `id`, `order_id`, `product_id`, `quantity`, `price`             |
| `payments`        | 결제 정보     | `id`, `order_id`, `payment_method`, `transaction_id`, `amount`  |
| `coupons`         | 쿠폰 정보     | `id`, `code`, `discount_type`, `discount_value`, `expiry_date`  |
| `wishlists`       | 위시리스트    | `id`, `user_id`, `product_id`                                   |
| `product_reviews` | 상품 리뷰     | `id`, `product_id`, `user_id`, `rating`, `comment`              |
| `cart_items`      | 장바구니      | `id`, `user_id`, `product_id`, `quantity`                       |

### **🪣 Storage 버킷**

| 버킷명            | 설정    | 용도                 |
| ----------------- | ------- | -------------------- |
| `product-images`  | Public  | 상품 이미지          |
| `category-images` | Public  | 카테고리 이미지      |
| `brand-logos`     | Public  | 브랜드 로고          |
| `user-avatars`    | Private | 사용자 프로필 이미지 |
| `review-images`   | Public  | 리뷰 첨부 이미지     |
| `documents`       | Private | 영수증/문서          |

---

## 💡 **사용 예시**

### **상품 조회 (Supabase - 권장)**

```javascript
import { useGetAllProductsQuery } from "@/redux/features/supabase-product-api";

function ProductList() {
  const { data: products, isLoading, error } = useGetAllProductsQuery();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      {products?.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.price.toLocaleString()}원</p>
        </div>
      ))}
    </div>
  );
}
```

### **장바구니 관리**

```javascript
import { useDispatch } from "react-redux";
import { add_cart_product } from "@/redux/features/cartSlice";

function AddToCartButton({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(add_cart_product(product));
  };

  return <button onClick={handleAddToCart}>장바구니 담기</button>;
}
```

### **사용자 인증 (Supabase)**

```javascript
import { useSignInMutation } from "@/redux/features/supabase-auth-api";

function LoginForm() {
  const [signIn, { isLoading }] = useSignInMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn({
        email: "user@example.com",
        password: "password123",
      }).unwrap();
      // 로그인 성공
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* 폼 필드들 */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
```

---

## 🔄 **데이터 마이그레이션 계획**

### **현재 상태**

- ✅ Supabase DB 스키마 완성
- ✅ Supabase API 엔드포인트 구현
- ✅ MOCK 데이터 준비 완료
- 🟡 External API와 병행 운영 중

### **권장 사항**

1. **우선순위**: Supabase API 사용을 권장
2. **마이그레이션**: 점진적으로 External API → Supabase API 전환
3. **데이터**: MOCK 데이터를 실제 DB에 입력 후 사용

---

## 📞 **문의 및 업데이트**

이 문서는 **2024년 12월** 기준으로 작성되었으며, API 변경사항이 있을 경우 업데이트가 필요합니다.

**주요 변경 사항:**

- `External API`: 기존 Shofy 백엔드 (유지보수 모드)
- `Supabase API`: 신규 자체 백엔드 (적극 개발 중)
- `MOCK Data`: 악세서리 전문 데이터로 구성

---

**📝 마지막 업데이트:** 2024년 12월  
**📧 문의:** 9851248@gmail.com (구름섬컴퍼니)  
**🏢 회사:** 구름섬컴퍼니 (에끌라린 운영)  
**📍 주소:** [12175] 경기 남양주시 화도읍 마석중앙로37번길 45 (마석우리, 별나라프라자) 504호
