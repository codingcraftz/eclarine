import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
// internal
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";

const ShopListItem = ({ product }) => {
  const { id, featured_image, category, title, reviews, price, compare_price, tags, description } =
    product || {};
  const dispatch = useDispatch();
  const [ratingVal, setRatingVal] = useState(0);

  // 할인율 계산
  const discountPercentage =
    compare_price && compare_price > price
      ? Math.round(((compare_price - price) / compare_price) * 100)
      : 0;

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  return (
    <div className="tp-product-list-item d-md-flex">
      <div className="tp-product-list-thumb p-relative fix">
        <Link href={`/product-details/${id}`}>
          <Image
            src={featured_image || "/assets/img/product/product-1.jpg"}
            alt="product img"
            width={350}
            height={310}
          />
        </Link>

        {/* 할인 배지 */}
        {discountPercentage > 0 && (
          <div className="tp-product-badge">
            <span className="product-discount">-{discountPercentage}%</span>
          </div>
        )}

        {/* <!-- product action --> */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
              onClick={() => dispatch(handleProductModal(product))}
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">Quick View</span>
            </button>
            <button
              type="button"
              onClick={() => handleWishlistProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-to-wishlist-btn"
            >
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">Add To Wishlist</span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-list-content">
        <div className="tp-product-content-2 pt-15">
          <div className="tp-product-tag-2">
            {tags?.map((t, i) => (
              <a key={i} href="#">
                {t}
              </a>
            ))}
          </div>
          <h3 className="tp-product-title-2">
            <Link href={`/product-details/${id}`}>{title}</Link>
          </h3>
          <div className="tp-product-rating-icon tp-product-rating-icon-2">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
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
          <p>{description && description.substring(0, 100)}</p>
          <div className="tp-product-list-add-to-cart">
            <button
              onClick={() => handleAddProduct(product)}
              className="tp-product-list-add-to-cart-btn"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListItem;
