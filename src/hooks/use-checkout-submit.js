import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
//internal import
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import {
  useCreatePaymentIntentMutation,
  useSaveOrderMutation,
} from "@/redux/features/order/orderApi";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";

const useCheckoutSubmit = () => {
  // offerCoupons
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  // addOrder
  const [saveOrder, {}] = useSaveOrderMutation();
  // createPaymentIntent
  const [createPaymentIntent, {}] = useCreatePaymentIntentMutation();
  // cart_products
  const { cart_products } = useSelector((state) => state.cart);
  // user
  const { user } = useSelector((state) => state.auth);
  // shipping_info
  const { shipping_info } = useSelector((state) => state.order);
  // total amount
  const { total, setTotal } = useCartInfo();
  // couponInfo
  const [couponInfo, setCouponInfo] = useState({});
  //cartTotal
  const [cartTotal, setCartTotal] = useState("");
  // minimumAmount
  const [minimumAmount, setMinimumAmount] = useState(0);
  // shippingCost
  const [shippingCost, setShippingCost] = useState(0);
  // remoteAreaCost (도서산간 추가비용)
  const [remoteAreaCost, setRemoteAreaCost] = useState(0);
  // discountAmount
  const [discountAmount, setDiscountAmount] = useState(0);
  // discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState(0);
  // discountProductType
  const [discountProductType, setDiscountProductType] = useState("");
  // isCheckoutSubmit
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  // cardError
  const [cardError, setCardError] = useState("");
  // clientSecret
  const [clientSecret, setClientSecret] = useState("");
  // showCard
  const [showCard, setShowCard] = useState(false);
  // coupon apply message
  const [couponApplyMsg, setCouponApplyMsg] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  let couponRef = useRef("");

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || cart_products.length === 0) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, discountAmount, cart_products]);

  //calculate total and discount value
  useEffect(() => {
    const result = cart_products?.filter((p) => p.productType === discountProductType);
    const discountProductTotal = result?.reduce(
      (preValue, currentValue) => preValue + currentValue.price * currentValue.orderQuantity,
      0
    );
    let totalValue = "";
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(discountProductTotal * (discountPercentage / 100));
    totalValue = Number(subTotal - discountTotal);
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
    discountAmount,
    cartTotal,
  ]);

  // create payment intent
  useEffect(() => {
    if (cartTotal) {
      createPaymentIntent({
        price: parseInt(cartTotal),
      })
        .then((data) => {
          setClientSecret(data?.data?.clientSecret);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [createPaymentIntent, cartTotal]);

  // handleCouponCode
  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("쿠폰 코드를 입력해주세요!");
      return;
    }
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return notifyError("문제가 발생했습니다");
    }
    const result = offerCoupons?.filter((coupon) => coupon.couponCode === couponRef.current?.value);

    if (result.length < 1) {
      notifyError("유효한 쿠폰을 입력해주세요!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("이 쿠폰은 유효하지 않습니다!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      notifyError(
        `이 쿠폰을 사용하려면 최소 ${result[0].minimumAmount.toLocaleString()}원이 필요합니다!`
      );
      return;
    } else {
      // notifySuccess(
      //   `쿠폰 ${result[0].title}이 ${result[0].productType}에 적용되었습니다!`
      // );
      setCouponApplyMsg(`쿠폰 ${result[0].title}이 ${result[0].productType}에 적용되었습니다!`);
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountProductType(result[0].productType);
      setDiscountPercentage(result[0].discountPercentage);
      dispatch(set_coupon(result[0]));
      setTimeout(() => {
        couponRef.current.value = "";
        setCouponApplyMsg("");
      }, 5000);
    }
  };

  // 기본 배송비 자동 계산 (8만원 미만 3,000원, 이상 무료)
  useEffect(() => {
    const baseShipping = total >= 80000 ? 0 : 3000;
    setShippingCost(baseShipping + remoteAreaCost);
  }, [total, remoteAreaCost]);

  // handleShippingCost (도서산간 추가비용만 처리)
  const handleShippingCost = (remoteAreaAdditionalCost) => {
    setRemoteAreaCost(remoteAreaAdditionalCost);
  };

  //set values
  useEffect(() => {
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("country", shipping_info.country);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("zipCode", shipping_info.zipCode);
    setValue("contactNo", shipping_info.contactNo);
    setValue("email", shipping_info.email);
    setValue("orderNote", shipping_info.orderNote);
  }, [user, setValue, shipping_info, router]);

  // submitHandler
  const submitHandler = async (data) => {
    dispatch(set_shipping(data));
    setIsCheckoutSubmit(true);

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: data.shippingOption,
      status: "Pending",
      cart: cart_products,
      paymentMethod: data.payment,
      subTotal: total,
      shippingCost: shippingCost,
      discount: discountAmount,
      totalAmount: cartTotal,
      orderNote: data.orderNote,
      user: `${user?._id}`,
    };
    if (data.payment === "Card") {
      if (!stripe || !elements) {
        return;
      }
      const card = elements.getElement(CardElement);
      if (card == null) {
        return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: card,
      });
      if (error && !paymentMethod) {
        setCardError(error.message);
        setIsCheckoutSubmit(false);
      } else {
        setCardError("");
        const orderData = {
          ...orderInfo,
          cardInfo: paymentMethod,
        };

        return handlePaymentWithStripe(orderData);
      }
    }
    if (data.payment === "COD") {
      saveOrder({
        ...orderInfo,
      }).then((res) => {
        if (res?.error) {
        } else {
          localStorage.removeItem("cart_products");
          localStorage.removeItem("couponInfo");
          setIsCheckoutSubmit(false);
          notifySuccess("주문이 확인되었습니다!");
          router.push(`/order/${res.data?.order?._id}`);
        }
      });
    }
  };

  // handlePaymentWithStripe
  const handlePaymentWithStripe = async (order) => {
    try {
      const { paymentIntent, error: intentErr } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.firstName,
            email: user?.email,
          },
        },
      });
      if (intentErr) {
        notifyError(intentErr.message);
      } else {
        // notifySuccess("결제가 성공적으로 처리되었습니다");
      }

      const orderData = {
        ...order,
        paymentIntent,
      };

      saveOrder({
        ...orderData,
      }).then((result) => {
        if (result?.error) {
        } else {
          localStorage.removeItem("couponInfo");
          notifySuccess("주문이 확인되었습니다!");
          router.push(`/order/${result.data?.order?._id}`);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    cardError,
    submitHandler,
    stripe,
    handleSubmit,
    clientSecret,
    setClientSecret,
    cartTotal,
    isCheckoutSubmit,
    couponApplyMsg,
    showCard,
    setShowCard,
  };
};

export default useCheckoutSubmit;
