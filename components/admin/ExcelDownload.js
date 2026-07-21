'use client';

// 택배 양식의 받는분 구간(D~H열)만 뽑는다 — 시트에 그대로 붙여넣게.
const HEADER = ['받는분성명', '받는분전화번호', '받는분주소(전체, 분할)', '수량', '품명'];
const ITEM_NAME = '악세서리';

const escapeCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function ExcelDownload({ forms, statusLabel }) {
  const download = () => {
    const rows = forms.map((f) => [
      f.name,
      f.phone,
      [f.address, f.addressDetail].filter(Boolean).join(' '),
      1,
      ITEM_NAME,
    ]);

    const csv = [HEADER, ...rows].map((r) => r.map(escapeCell).join(',')).join('\r\n');

    // BOM 없이 저장하면 엑셀이 한글을 깨서 읽는다
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const a = document.createElement('a');
    a.href = url;
    a.download = `에끌라린-${statusLabel}-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 pb-4">
      <button
        onClick={download}
        disabled={forms.length === 0}
        className="w-full text-[15px] font-bold text-white bg-[#1A1A1A] rounded-2xl py-3.5 disabled:opacity-40"
      >
        엑셀 다운로드 · {forms.length}건
      </button>
      <p className="mt-2 text-center text-[12px] text-[#9A9A95]">
        지금 보이는 목록만 받아요. 받는분 성명·전화번호·주소·수량·품명 순서라 택배 양식 D열에 그대로 붙여넣으면 돼요.
      </p>
    </div>
  );
}
