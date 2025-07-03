import { useState } from "react";
// internal
import { Search } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";

const HeaderSearchForm = () => {
  const { setSearchText, setCategory, handleSubmit, searchText } = useSearchFormSubmit();

  // selectHandle
  const selectCategoryHandle = (e) => {
    setCategory(e.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-header-search-wrapper d-flex align-items-center">
        <div className="tp-header-search-box">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
            placeholder="악세서리를 검색하세요..."
          />
        </div>
        <div className="tp-header-search-category">
          <NiceSelect
            options={[
              { value: "Select Category", text: "카테고리 선택" },
              { value: "silver", text: "실버" },
              { value: "surgical", text: "써지컬 스틸" },
              { value: "gold", text: "골드" },
              { value: "titanium", text: "티타늄" },
              { value: "piercing", text: "피어싱" },
            ]}
            defaultCurrent={0}
            onChange={selectCategoryHandle}
            name="카테고리 선택"
          />
        </div>
        <div className="tp-header-search-btn">
          <button type="submit">
            <Search />
          </button>
        </div>
      </div>
    </form>
  );
};

export default HeaderSearchForm;
