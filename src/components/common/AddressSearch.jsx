import { useState } from "react";
import DaumPostcode from "react-daum-postcode";

const AddressSearch = ({ onComplete, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onComplete({
      zonecode: data.zonecode,
      address: fullAddress,
      jibunAddress: data.jibunAddress,
      roadAddress: data.roadAddress,
    });
    setIsOpen(false);
  };

  return (
    <div className="address-search">
      <button type="button" onClick={() => setIsOpen(true)} className="address-search-button">
        주소 검색
      </button>

      {isOpen && (
        <div className="address-search-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>주소 검색</h3>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="close-button"
              >
                ✕
              </button>
            </div>
            <DaumPostcode
              onComplete={handleComplete}
              style={{
                width: "100%",
                height: "450px",
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .address-search-button {
          padding: 8px 16px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .address-search-button:hover {
          background-color: #e9ecef;
        }

        .address-search-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #dee2e6;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          color: #6c757d;
        }

        .close-button:hover {
          color: #343a40;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 16px;
            max-height: calc(100vh - 32px);
          }
        }
      `}</style>
    </div>
  );
};

export default AddressSearch;
