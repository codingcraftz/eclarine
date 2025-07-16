import { useState, useRef } from "react";
import Image from "next/image";
import { DEFAULT_PRODUCT_IMAGE } from "../../utils/image-utils";

const ImageUpload = ({
  onImagesChange,
  existingImages = [],
  onExistingImageRemove,
  maxImages = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError("");

    // 파일 검증
    const validFiles = files.filter((file) => {
      if (!acceptedTypes.includes(file.type)) {
        setError(`지원되지 않는 파일 형식입니다: ${file.name}`);
        return false;
      }
      if (file.size > maxFileSize) {
        setError(`파일 크기가 너무 큽니다: ${file.name} (최대 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 최대 이미지 개수 체크
    const totalImages = selectedImages.length + existingImages.length + validFiles.length;
    if (totalImages > maxImages) {
      setError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    // 미리보기 URL 생성
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // 부모 컴포넌트에 전달
    onImagesChange([...selectedImages, ...validFiles]);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      // 기존 이미지 제거
      const imageToRemove = existingImages[index];
      if (onExistingImageRemove) {
        onExistingImageRemove(imageToRemove);
      }
      return;
    }

    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    // 메모리 누수 방지를 위해 URL.revokeObjectURL 호출
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedImages(newSelectedImages);
    setPreviewUrls(newPreviewUrls);
    onImagesChange(newSelectedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const totalImagesCount = existingImages.length + selectedImages.length;

  return (
    <div className="image-upload-container">
      <div className="mb-3">
        <label className="form-label">상품 이미지 업로드</label>
        <small className="text-muted d-block">
          최대 {maxImages}개, 파일당 최대 5MB (JPG, PNG, WebP)
        </small>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* 이미지 미리보기 그리드 */}
      <div className="row g-3 mb-3">
        {/* 기존 이미지들 */}
        {existingImages.map((imageUrl, index) => (
          <div key={`existing-${index}`} className="col-md-3 col-sm-4 col-6">
            <div className="image-preview-card position-relative">
              <div className="image-preview-wrapper">
                <Image
                  src={imageUrl || DEFAULT_PRODUCT_IMAGE}
                  alt={`기존 이미지 ${index + 1}`}
                  width={200}
                  height={200}
                  className="img-fluid rounded"
                  style={{ objectFit: "cover", height: "150px" }}
                  onError={(e) => {
                    e.target.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                onClick={() => removeImage(index, true)}
                style={{ zIndex: 2 }}
                title="이미지 삭제"
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="badge bg-secondary position-absolute bottom-0 start-0 m-1">
                기존 이미지
              </div>
            </div>
          </div>
        ))}

        {/* 새로 선택한 이미지들 */}
        {previewUrls.map((url, index) => (
          <div key={`new-${index}`} className="col-md-3 col-sm-4 col-6">
            <div className="image-preview-card position-relative">
              <div className="image-preview-wrapper">
                <Image
                  src={url}
                  alt={`새 이미지 ${index + 1}`}
                  width={200}
                  height={200}
                  className="img-fluid rounded"
                  style={{ objectFit: "cover", height: "150px" }}
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                onClick={() => removeImage(index, false)}
                style={{ zIndex: 2 }}
                title="이미지 삭제"
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="badge bg-primary position-absolute bottom-0 start-0 m-1">
                새 이미지
              </div>
            </div>
          </div>
        ))}

        {/* 업로드 버튼 */}
        {totalImagesCount < maxImages && (
          <div className="col-md-3 col-sm-4 col-6">
            <div
              className="upload-placeholder d-flex flex-column align-items-center justify-content-center rounded border-2 border-dashed"
              onClick={openFileDialog}
              style={{
                height: "150px",
                cursor: "pointer",
                borderColor: "#dee2e6",
                backgroundColor: "#f8f9fa",
              }}
            >
              <i className="fas fa-plus fa-2x text-muted mb-2"></i>
              <span className="text-muted">이미지 추가</span>
              <small className="text-muted mt-1">
                {totalImagesCount}/{maxImages}
              </small>
            </div>
          </div>
        )}
      </div>

      {/* 이미지가 하나도 없는 경우 안내 */}
      {totalImagesCount === 0 && (
        <div className="text-center p-4 border rounded bg-light">
          <i className="fas fa-image fa-3x text-muted mb-3"></i>
          <h6 className="text-muted">이미지를 업로드해주세요</h6>
          <p className="text-muted small mb-3">상품의 대표 이미지를 선택해주세요</p>
          <button type="button" className="btn btn-primary" onClick={openFileDialog}>
            <i className="fas fa-upload me-2"></i>첫 번째 이미지 업로드
          </button>
        </div>
      )}

      {/* 파일 입력 (숨김) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedTypes.join(",")}
        multiple
        className="d-none"
      />

      {/* 업로드 진행 상태 */}
      {uploading && (
        <div className="text-center">
          <div className="spinner-border text-primary me-2" role="status">
            <span className="visually-hidden">업로드 중...</span>
          </div>
          <span>이미지 업로드 중...</span>
        </div>
      )}

      {/* 도움말 */}
      <div className="mt-3">
        <div className="alert alert-info">
          <h6 className="alert-heading">
            <i className="fas fa-info-circle me-2"></i>
            이미지 업로드 안내
          </h6>
          <ul className="mb-0 small">
            <li>첫 번째 이미지가 상품의 대표 이미지로 사용됩니다</li>
            <li>이미지는 자동으로 최적화되어 저장됩니다</li>
            <li>권장 이미지 크기: 800x600px 이상</li>
            <li>업로드 후 이미지 순서를 변경하려면 삭제 후 다시 업로드해주세요</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .image-preview-card {
          transition: transform 0.2s;
        }
        .image-preview-card:hover {
          transform: translateY(-2px);
        }
        .image-preview-wrapper {
          overflow: hidden;
          border-radius: 0.375rem;
        }
        .upload-placeholder:hover {
          background-color: #e9ecef !important;
          border-color: #adb5bd !important;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
