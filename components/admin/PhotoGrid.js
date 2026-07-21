'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import StatusSelect from '@/components/admin/StatusSelect';

const IMAGE_COLORS = {
  준비전: '#8A8A8A',
  준비완료: '#3F9C50',
  주문접수: '#2478D4',
  '주문접수 완료': '#8B4FC0',
};

export default function PhotoGrid({ images, updateImageStatus, statuses }) {
  const [viewer, setViewer] = useState(-1);

  const move = (delta) => setViewer((i) => (i + delta + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((im, i) => (
          <div key={im.id}>
            <button
              type="button"
              onClick={() => setViewer(i)}
              className="block w-full aspect-square rounded-xl overflow-hidden bg-[#F1EEE6]"
            >
              {/* MinIO 원본 — next/image 최적화 없이 그대로 띄운다 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
            <StatusSelect
              action={updateImageStatus}
              id={im.id}
              value={im.imageStatus}
              options={statuses}
              colors={IMAGE_COLORS}
              className="mt-1.5 w-full"
            />
          </div>
        ))}
      </div>

      {viewer >= 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button onClick={() => setViewer(-1)} className="absolute top-4 right-4 text-white/80 p-2">
            <X size={26} />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={() => move(-1)} className="absolute left-2 text-white/80 p-3">
                <ChevronLeft size={30} />
              </button>
              <button onClick={() => move(1)} className="absolute right-2 text-white/80 p-3">
                <ChevronRight size={30} />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[viewer].url} alt="" className="max-w-[92vw] max-h-[88vh] object-contain" />
          <div className="absolute bottom-5 text-white/70 text-[13px]">
            {viewer + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
