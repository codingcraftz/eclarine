import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import WishlistItem from "./wishlist-item";

const WishlistArea = () => {
  const { wishlist } = useSelector((state) => state.wishlist);
  return (
    <>
      <section className="tp-cart-area pb-120">
        <div className="container">
          {wishlist.length === 0 && (
            <div className="text-center pt-50">
              <h3>위시리스트가 비어있습니다</h3>
              <Link href="/shop" className="tp-cart-checkout-btn mt-20">
                쇼핑 계속하기
              </Link>
            </div>
          )}
          {wishlist.length > 0 && (
            <div className="row">
              <div className="col-xl-12">
                <div className="tp-cart-list mb-45 mr-30">
                  <table className="table">
                    <thead>
                      <tr>
                        <th colSpan="2" className="tp-cart-header-product">
                          상품
                        </th>
                        <th className="tp-cart-header-price">가격</th>
                        <th className="tp-cart-header-quantity">수량</th>
                        <th>액션</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlist.map((item, i) => (
                        <WishlistItem key={i} product={item} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="tp-cart-bottom">
                  <div className="row align-items-end">
                    <div className="col-xl-6 col-md-4">
                      <div className="tp-cart-update">
                        <Link href="/cart" className="tp-cart-update-btn">
                          장바구니로 이동
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WishlistArea;
