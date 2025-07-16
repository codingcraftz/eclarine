import React from "react";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { add_cart_product } from "../../../redux/features/cartSlice";
import { add_to_wishlist } from "../../../redux/features/wishlist-slice";
import { getImageUrl } from "../../../utils/image-utils";

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();

  if (!product) {
    return null;
  }

  // 상품 데이터 매핑
  const {
    id,
    title,
    slug,
    price,
    compare_price,
    featured_image,
    rating = 0,
    rating_count = 0,
    status,
    quantity = 0,
    tags = [],
    categories,
    brands,
  } = product;

  // 재고 상태 확인
  const isOutOfStock = status === "out-of-stock" || status === "inactive" || quantity === 0;

  // 할인율 계산
  const discountPercentage =
    compare_price && compare_price > price
      ? Math.round(((compare_price - price) / compare_price) * 100)
      : 0;

  // 장바구니 추가
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    dispatch(
      add_cart_product({
        id,
        title,
        price,
        image: getImageUrl(featured_image),
        quantity: 1,
      })
    );
  };

  // 위시리스트 추가
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    dispatch(
      add_to_wishlist({
        id,
        title,
        price,
        image: getImageUrl(featured_image),
      })
    );
  };

  return (
    <div className="tp-product-item-2 mb-40">
      <div className="tp-product-thumb-2 p-relative z-index-1 fix">
        <Link href={`/product-details/${id}`}>
          <div className="product-image-wrapper">
            <Image
              src={getImageUrl(featured_image)}
              alt={title || "상품 이미지"}
              width={300}
              height={300}
              className="product-image"
              priority={false}
              style={{ objectFit: "cover", width: "100%", height: "300px", borderRadius: "8px" }}
            />
          </div>
        </Link>

        {/* 상품 배지 */}
        <div className="tp-product-badge">
          {discountPercentage > 0 && (
            <span className="product-discount-badge">-{discountPercentage}%</span>
          )}
          {isOutOfStock && <span className="product-out-stock">품절</span>}
        </div>

        {/* 상품 액션 버튼 */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              className="tp-product-action-btn-2 tp-product-add-cart-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              title={isOutOfStock ? "품절된 상품입니다" : "장바구니에 추가"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.93795 5.34749L4.54095 12.5195C4.58495 13.0715 5.03594 13.4855 5.58695 13.4855H5.59095H16.5019H16.5039C17.0249 13.4855 17.4699 13.0975 17.5359 12.5825L18.4939 6.02349C18.5159 5.86749 18.4689 5.71149 18.3619 5.58849C18.2559 5.46649 18.1019 5.39549 17.9439 5.39549H17.9349H5.29295L5.16795 4.27949C5.11195 3.68649 4.65595 3.21649 4.06095 3.21649H1.93795C1.52295 3.21649 1.18795 3.55149 1.18795 3.96649C1.18795 4.38149 1.52295 4.71649 1.93795 4.71649H4.06095C4.23295 4.71649 4.38195 4.84749 4.40195 5.01949L4.41595 5.12649L3.93795 5.34749Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.1979 16.9013C14.8589 16.9013 15.3969 17.4393 15.3969 18.1003C15.3969 18.7613 14.8589 19.2993 14.1979 19.2993C13.5369 19.2993 12.9989 18.7613 12.9989 18.1003C12.9989 17.4393 13.5369 16.9013 14.1979 16.9013Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.12891 16.9013C7.78991 16.9013 8.32791 17.4393 8.32791 18.1003C8.32791 18.7613 7.78991 19.2993 7.12891 19.2993C6.46791 19.2993 5.92991 18.7613 5.92991 18.1003C5.92991 17.4393 6.46791 16.9013 7.12891 16.9013Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <button
              type="button"
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
              onClick={handleAddToWishlist}
              title="위시리스트에 추가"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.99486 4.93014C8.49535 3.18262 5.99481 2.71255 4.11602 4.31275C2.23723 5.91295 1.97273 8.58914 3.44815 10.4138C4.67486 11.9303 8.38733 15.3619 9.60407 16.4549C9.78538 16.6234 10.0441 16.6234 10.2254 16.4549C11.4421 15.3619 15.1546 11.9303 16.3813 10.4138C17.8567 8.58914 17.6222 5.89611 15.7134 4.31275C13.8047 2.72939 11.4944 3.18262 9.99486 4.93014Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="tp-product-content-2 pt-15">
        <div className="tp-product-tag-2">
          {tags && tags.length > 0 && <span>{tags[0]}</span>}
          {categories && <span>{categories.name}</span>}
          {brands && <span>{brands.name}</span>}
        </div>

        <h3 className="tp-product-title-2">
          <Link href={`/product-details/${id}`}>{title || "상품명 없음"}</Link>
        </h3>

        <div className="tp-product-rating-icon tp-product-rating-icon-2">
          <Rating allowFraction size={16} initialValue={rating} readonly />
          <span className="tp-product-rating-text">({rating_count || 0}개 리뷰)</span>
        </div>

        <div className="tp-product-price-wrapper-2">
          {compare_price && compare_price > price ? (
            <>
              <span className="tp-product-price-2 new-price">₩{price?.toLocaleString()}</span>
              <span className="tp-product-price-2 old-price">
                ₩{compare_price?.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="tp-product-price-2 new-price">₩{price?.toLocaleString()}</span>
          )}
        </div>

        {isOutOfStock && (
          <div className="tp-product-stock-status mt-10">
            <span className="out-of-stock-text">품절</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .product-image-wrapper {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
          border-radius: 8px;
          aspect-ratio: 1/1;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
          border-radius: 8px;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        .tp-product-badge {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 3;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          pointer-events: none;
        }

        .product-discount-badge {
          margin: 12px 0 0 12px;
          background: rgba(255, 44, 44, 0.92);
          color: #fff;
          padding: 6px 14px;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          letter-spacing: 0.5px;
          z-index: 4;
          border: 1px solid #fff;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          pointer-events: auto;
        }

        .product-out-stock {
          margin: 16px 0 0 8px;
          background: #666;
          color: white;
          padding: 8px 14px;
          font-size: 1.1rem;
          border-radius: 8px;
          font-weight: 700;
          z-index: 4;
          border: 2px solid #fff;
        }

        .out-of-stock-text {
          color: #ff4444;
          font-weight: 600;
          font-size: 14px;
        }

        .tp-product-action-btn-2:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tp-product-action-btn-2:disabled:hover {
          transform: none;
        }

        .tp-product-tag-2 span {
          margin-right: 10px;
          color: #666;
          font-size: 13px;
        }

        .tp-product-tag-2 span:not(:last-child):after {
          content: "•";
          margin-left: 10px;
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default ProductItem;
