import { useState } from "react";
import { supabase } from "../../lib/supabase";

const ImageUpload = ({ orderId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    try {
      setUploading(true);

      // 1. Storage에 이미지 업로드
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `order-images/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("orders").upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. 이미지 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("orders").getPublicUrl(filePath);

      // 3. order_form_images 테이블에 저장
      const { error: dbError } = await supabase.from("order_form_images").insert({
        order_id: orderId,
        image_url: publicUrl,
        image_status: "준비전",
      });

      if (dbError) throw dbError;

      // 4. 성공 콜백
      onUploadComplete(publicUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            uploadImage(e.target.files[0]);
          }
        }}
        disabled={uploading}
        style={{ display: "none" }}
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        style={{
          padding: "8px 16px",
          background: "#f0f0f0",
          borderRadius: "4px",
          cursor: uploading ? "wait" : "pointer",
          display: "inline-block",
        }}
      >
        {uploading ? "업로드 중..." : "이미지 업로드"}
      </label>
    </div>
  );
};

export default ImageUpload;
