import Image from "next/image";
import { useState, useEffect } from "react";
import PopupVideo from "../common/popup-video";

// Supabase Storage public URL 생성 함수
const getImageUrl = (path) => {
  if (!path) return "/assets/img/product/product-1.jpg";
  if (path.startsWith("http")) return path;
  return `https://twkqjhsoxiktglspades.supabase.co/storage/v1/object/public/${path}`;
};

const DetailsThumbWrapper = ({
  imageURLs,
  handleImageActive,
  activeImg,
  imgWidth = 416,
  imgHeight = 480,
  videoId = false,
  status,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
        <nav>
          <div className="nav nav-tabs flex-sm-column">
            {imageURLs?.map((item, i) => (
              <button
                key={i}
                className={`nav-link ${item.img === activeImg ? "active" : ""}`}
                onClick={() => handleImageActive(item)}
              >
                <Image
                  src={item.img}
                  alt="image"
                  width={78}
                  height={100}
                  style={{ width: "100%", height: "100%" }}
                />
              </button>
            ))}
          </div>
        </nav>
        <div className="tab-content m-img">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative">
              <Image
                src={getImageUrl(activeImg)}
                alt="product img"
                width={imgWidth}
                height={imgHeight}
              />
              <div className="tp-product-badge">
                {status === "out-of-stock" && <span className="product-hot">out-stock</span>}
              </div>
              {videoId && (
                <div
                  onClick={() => setIsVideoOpen(true)}
                  className="tp-product-details-thumb-video"
                >
                  <a className="tp-product-details-thumb-video-btn cursor-pointer popup-video">
                    <i className="fas fa-play"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal popup start */}
      {videoId && (
        <PopupVideo isVideoOpen={isVideoOpen} setIsVideoOpen={setIsVideoOpen} videoId={videoId} />
      )}
      {/* modal popup end */}
    </>
  );
};

export default DetailsThumbWrapper;
