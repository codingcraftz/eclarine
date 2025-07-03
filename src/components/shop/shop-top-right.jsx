import React from "react";
import { useDispatch } from "react-redux";
// internal
import { Filter } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import { handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";

const ShopTopRight = ({ selectHandleFilter }) => {
  const dispatch = useDispatch();
  return (
    <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
      <div className="tp-shop-top-select">
        <NiceSelect
          options={[
            { value: "기본 정렬", text: "기본 정렬" },
            { value: "가격 낮은순", text: "가격 낮은순" },
            { value: "가격 높은순", text: "가격 높은순" },
            { value: "신상품순", text: "신상품순" },
            { value: "할인상품", text: "할인상품" },
          ]}
          defaultCurrent={0}
          onChange={selectHandleFilter}
          name="기본 정렬"
        />
      </div>
      <div className="tp-shop-top-filter">
        <button
          onClick={() => dispatch(handleFilterSidebarOpen())}
          type="button"
          className="tp-filter-btn"
        >
          <span>
            <Filter />
          </span>{" "}
          필터
        </button>
      </div>
    </div>
  );
};

export default ShopTopRight;
