import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { supabase } from "@/lib/supabase";
import AddressSearch from "./AddressSearch";
import { toast } from "react-toastify";

const SavedAddresses = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipient_name: "",
    phone: "",
    address: "",
    address_detail: "",
    is_default: false,
  });
  const { user } = useSelector((state) => state.auth);

  // 전화번호 자동 하이픈
  const formatPhone = (value) => {
    const number = value.replace(/[^0-9]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 7) return number.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    return number.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
  };

  // 주소 목록 불러오기
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) {
        setAddresses([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAddresses(data || []);
      } catch (error) {
        console.error("주소 목록 불러오기 실패:", error);
        toast.error("주소 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  // 새 주소 추가
  const handleAddAddress = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!newAddress.recipient_name || !newAddress.phone || !newAddress.address) {
      toast.error("필수 정보를 모두 입력해주세요.");
      return;
    }

    try {
      // 기본 배송지로 설정하는 경우, 기존 기본 배송지 해제
      if (newAddress.is_default) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .eq("is_default", true);
      }

      // 새 주소 추가
      const { data, error } = await supabase
        .from("user_addresses")
        .insert({
          ...newAddress,
          user_id: user.id,
          phone: formatPhone(newAddress.phone),
        })
        .select()
        .single();

      if (error) throw error;

      setAddresses((prev) =>
        newAddress.is_default
          ? [data, ...prev.map((a) => ({ ...a, is_default: false }))]
          : [...prev, data]
      );
      setIsAddingNew(false);
      setNewAddress({
        recipient_name: "",
        phone: "",
        address: "",
        address_detail: "",
        is_default: false,
      });
      toast.success("배송지가 추가되었습니다.");
    } catch (error) {
      console.error("주소 추가 실패:", error);
      toast.error("배송지 추가에 실패했습니다.");
    }
  };

  // 주소 삭제
  const handleDeleteAddress = async (id) => {
    if (!confirm("이 배송지를 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", id);

      if (error) throw error;

      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("배송지가 삭제되었습니다.");
    } catch (error) {
      console.error("주소 삭제 실패:", error);
      toast.error("배송지 삭제에 실패했습니다.");
    }
  };

  // 기본 배송지 설정
  const handleSetDefault = async (id) => {
    try {
      // 기존 기본 배송지 해제
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true);

      // 새 기본 배송지 설정
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;

      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          is_default: a.id === id,
        }))
      );
      toast.success("기본 배송지로 설정되었습니다.");
    } catch (error) {
      console.error("기본 배송지 설정 실패:", error);
      toast.error("기본 배송지 설정에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">로딩중...</div>;
  }

  return (
    <div className="saved-addresses">
      {/* 주소 목록 */}
      {addresses.map((address) => (
        <div key={address.id} className={`address-item ${address.is_default ? "default" : ""}`}>
          <div className="address-content" onClick={() => onSelect(address)}>
            <div className="recipient-info">
              <span className="name">{address.recipient_name}</span>
              <span className="phone">{address.phone}</span>
              {address.is_default && <span className="default-badge">기본</span>}
            </div>
            <div className="address-text">
              {address.address}
              {address.address_detail && ` ${address.address_detail}`}
            </div>
          </div>
          <div className="address-actions">
            {!address.is_default && (
              <button
                type="button"
                onClick={() => handleSetDefault(address.id)}
                className="action-button"
              >
                기본 배송지로 설정
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDeleteAddress(address.id)}
              className="action-button delete"
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      {/* 새 주소 추가 폼 */}
      {isAddingNew ? (
        <div className="new-address-form">
          <h3>새 배송지 추가</h3>
          <div className="form-group">
            <label>받는 사람 *</label>
            <input
              type="text"
              value={newAddress.recipient_name}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  recipient_name: e.target.value,
                }))
              }
              placeholder="받는 사람 이름"
            />
          </div>
          <div className="form-group">
            <label>연락처 *</label>
            <input
              type="text"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  phone: formatPhone(e.target.value),
                }))
              }
              placeholder="010-0000-0000"
              maxLength={13}
            />
          </div>
          <div className="form-group">
            <label>주소 *</label>
            <div className="address-input">
              <input
                type="text"
                value={newAddress.address}
                readOnly
                placeholder="주소 검색을 눌러주세요"
              />
              <AddressSearch
                onComplete={(data) => {
                  setNewAddress((prev) => ({
                    ...prev,
                    address: data.address,
                  }));
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>상세주소</label>
            <input
              type="text"
              value={newAddress.address_detail}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  address_detail: e.target.value,
                }))
              }
              placeholder="상세주소를 입력해주세요"
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={newAddress.is_default}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    is_default: e.target.checked,
                  }))
                }
              />
              기본 배송지로 설정
            </label>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleAddAddress} className="save-button">
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setNewAddress({
                  recipient_name: "",
                  phone: "",
                  address: "",
                  address_detail: "",
                  is_default: false,
                });
              }}
              className="cancel-button"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setIsAddingNew(true)} className="add-address-button">
          + 새 배송지 추가
        </button>
      )}

      <style jsx>{`
        .saved-addresses {
          padding: 16px;
        }

        .address-item {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .address-item:hover {
          border-color: #adb5bd;
        }

        .address-item.default {
          border-color: #0064ff;
          background-color: #f8f9ff;
        }

        .recipient-info {
          margin-bottom: 8px;
        }

        .name {
          font-weight: bold;
          margin-right: 12px;
        }

        .phone {
          color: #495057;
        }

        .default-badge {
          background-color: #0064ff;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin-left: 8px;
        }

        .address-text {
          color: #495057;
          line-height: 1.5;
        }

        .address-actions {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }

        .action-button {
          padding: 4px 8px;
          border: none;
          background: none;
          color: #0064ff;
          cursor: pointer;
          font-size: 14px;
        }

        .action-button.delete {
          color: #dc3545;
        }

        .action-button:hover {
          text-decoration: underline;
        }

        .new-address-form {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }

        .new-address-form h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input[type="text"] {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group.checkbox {
          display: flex;
          align-items: center;
        }

        .form-group.checkbox label {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .address-input {
          display: flex;
          gap: 8px;
        }

        .address-input input {
          flex: 1;
        }

        .form-actions {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }

        .save-button,
        .cancel-button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .save-button {
          background-color: #0064ff;
          color: white;
        }

        .save-button:hover {
          background-color: #0052cc;
        }

        .cancel-button {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
        }

        .cancel-button:hover {
          background-color: #e9ecef;
        }

        .add-address-button {
          width: 100%;
          padding: 12px;
          background-color: #f8f9fa;
          border: 1px dashed #adb5bd;
          border-radius: 8px;
          color: #495057;
          cursor: pointer;
          font-size: 14px;
          margin-top: 16px;
        }

        .add-address-button:hover {
          background-color: #e9ecef;
        }

        @media (max-width: 768px) {
          .saved-addresses {
            padding: 12px;
          }

          .address-actions {
            flex-wrap: wrap;
          }

          .action-button {
            width: 100%;
            padding: 8px;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default SavedAddresses;
