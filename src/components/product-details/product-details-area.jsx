import React, { useState, useEffect } from "react";
import DetailsThumbWrapper from "./details-thumb-wrapper";
import DetailsWrapper from "./details-wrapper";
import { useDispatch } from "react-redux";
import DetailsTabNav from "./details-tab-nav";
import RelatedProducts from "./related-products";

const ProductDetailsArea = ({ productItem }) => {
  const { featured_image, gallery_images, videoId, status, weight, dimensions } = productItem || {};
  // featured_image + gallery_images를 합쳐 imageURLs 배열 생성
  const imageURLs = [
    ...(featured_image ? [{ img: featured_image }] : []),
    ...(Array.isArray(gallery_images) ? gallery_images.map((img) => ({ img })) : []),
  ];
  const [activeImg, setActiveImg] = useState(featured_image);
  const dispatch = useDispatch();
  // active image change when featured_image change
  useEffect(() => {
    setActiveImg(featured_image);
  }, [featured_image]);

  // handle image active
  const handleImageActive = (item) => {
    setActiveImg(item.img);
  };
  // 부가 정보 배열 생성
  const additionalInformation = [];
  if (weight) additionalInformation.push({ key: "중량", value: weight + "g" });
  if (dimensions) additionalInformation.push({ key: "사이즈", value: dimensions });
  return (
    <section className="tp-product-details-area">
      <div className="tp-product-details-top pb-115">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-6">
              {/* product-details-thumb-wrapper start */}
              <DetailsThumbWrapper
                activeImg={activeImg}
                handleImageActive={handleImageActive}
                imageURLs={imageURLs}
                imgWidth={580}
                imgHeight={670}
                videoId={videoId}
                status={status}
              />
              {/* product-details-thumb-wrapper end */}
            </div>
            <div className="col-xl-5 col-lg-6">
              {/* product-details-wrapper start */}
              <DetailsWrapper
                productItem={{
                  ...productItem,
                  category: productItem.category || productItem.categories || {},
                  additionalInformation,
                }}
                handleImageActive={handleImageActive}
                activeImg={activeImg}
                detailsBottom={true}
              />
              {/* product-details-wrapper end */}
            </div>
          </div>
        </div>
      </div>

      {/* product details description */}
      <div className="tp-product-details-bottom pb-140">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <DetailsTabNav product={{ ...productItem, additionalInformation }} />
            </div>
          </div>
        </div>
      </div>
      {/* product details description */}

      {/* related products start */}
      <section className="tp-related-product pt-95 pb-50">
        <div className="container">
          <div className="row">
            <div className="tp-section-title-wrapper-6 text-center mb-40">
              <span className="tp-section-title-pre-6">추천 상품</span>
              <h3 className="tp-section-title-6">이런 상품은 어떠세요?</h3>
            </div>
          </div>
          <div className="row">
            <RelatedProducts id={productItem?.id} />
          </div>
        </div>
      </section>
      {/* related products end */}
    </section>
  );
};

export default ProductDetailsArea;
