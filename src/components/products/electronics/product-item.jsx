import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
// internal
import { Cart, QuickView, Wishlist } from "@/svg";
import Timer from "@/components/common/timer";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";

const ProductItem = ({ product, offer_style = false }) => {
  const { id, featured_image, category, title, reviews, price, compare_price, status, offerDate } =
    product || {};
  console.log(status);
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd.id === id);
  const isAddedToWishlist = wishlist.some((prd) => prd.id === id);
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
    <>
      <div
        className={`${
          offer_style ? "tp-product-offer-item" : "mb-25"
        } tp-product-item transition-3`}
      >
        <div className="tp-product-thumb p-relative fix">
          <Link href={`/product-details/${id}`}>
            <Image
              src={featured_image || "/assets/img/product/product-1.jpg"}
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              alt="product-electronic"
            />

            <div className="tp-product-badge">
              {status === "out-of-stock" && <span className="product-hot">out-stock</span>}
              {discountPercentage > 0 && (
                <span className="product-discount">-{discountPercentage}%</span>
              )}
            </div>
          </Link>

          {/*  product action */}
          <div className="tp-product-action">
            <div className="tp-product-action-item d-flex flex-column">
              {isAddedToCart ? (
                <Link
                  href="/cart"
                  className={`tp-product-action-btn ${
                    isAddedToCart ? "active" : ""
                  } tp-product-add-cart-btn`}
                >
                  <Cart /> <span className="tp-product-tooltip">View Cart</span>
                </Link>
              ) : (
                <button
                  onClick={() => handleAddProduct(product)}
                  type="button"
                  className={`tp-product-action-btn ${
                    isAddedToCart ? "active" : ""
                  } tp-product-add-cart-btn`}
                  disabled={status === "out-of-stock"}
                >
                  <Cart />

                  <span className="tp-product-tooltip">Add to Cart</span>
                </button>
              )}
              <button
                onClick={() => dispatch(handleProductModal(product))}
                type="button"
                className="tp-product-action-btn tp-product-quick-view-btn"
              >
                <QuickView />

                <span className="tp-product-tooltip">Quick View</span>
              </button>
              <button
                type="button"
                className={`tp-product-action-btn ${
                  isAddedToWishlist ? "active" : ""
                } tp-product-add-to-wishlist-btn`}
                onClick={() => handleWishlistProduct(product)}
                disabled={status === "out-of-stock"}
              >
                <Wishlist />
                <span className="tp-product-tooltip">Add To Wishlist</span>
              </button>
            </div>
          </div>
        </div>
        {/*  product content */}
        <div className="tp-product-content">
          <div className="tp-product-category">
            <a href="#">{category?.name}</a>
          </div>
          <h3 className="tp-product-title">
            <Link href={`/product-details/${id}`}>{title}</Link>
          </h3>
          <div className="tp-product-rating d-flex align-items-center">
            <div className="tp-product-rating-icon">
              <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
            </div>
            <div className="tp-product-rating-text">
              <span>({reviews && reviews.length > 0 ? reviews.length : 0} Review)</span>
            </div>
          </div>
          <div className="tp-product-price-wrapper">
            {compare_price && compare_price > price ? (
              <>
                <span className="tp-product-price new-price">₩{price?.toLocaleString()}</span>
                <span className="tp-product-price old-price">
                  ₩{compare_price?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="tp-product-price new-price">
                ₩{parseFloat(price).toLocaleString()}
              </span>
            )}
          </div>
          {offer_style && (
            <div className="tp-product-countdown">
              <div className="tp-product-countdown-inner">
                {dayjs().isAfter(offerDate?.endDate) ? (
                  <ul>
                    <li>
                      <span>{0}</span> Day
                    </li>
                    <li>
                      <span>{0}</span> Hrs
                    </li>
                    <li>
                      <span>{0}</span> Min
                    </li>
                    <li>
                      <span>{0}</span> Sec
                    </li>
                  </ul>
                ) : (
                  <Timer expiryTimestamp={new Date(offerDate?.endDate)} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductItem;
