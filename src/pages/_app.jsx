import store from "@/redux/store";
import { Provider } from "react-redux";
import ReactModal from "react-modal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "../styles/index.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";
import DevNotice from "@/components/common/DevNotice";
import { useRouter } from "next/router";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

// stripePromise
const NEXT_PUBLIC_STRIPE_KEY =
  "pk_test_51NYXCFGndYsQkAEFifIbJH64sZFMDpF7DcLYvUUN2az3VdK1M7qVPo7Z2j9rhunf3Pd0C3aFLENIxFriJWwx1P6a00lQFqaoc6";
const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_KEY);
const NEXT_PUBLIC_GOOGLE_CLIENT_ID =
  "375198830790-6lk26c7frudnqee2b55ge7fkbco1nkma.apps.googleusercontent.com";
export default function App({ Component, pageProps }) {
  const router = require("next/router").useRouter ? require("next/router").useRouter() : null;
  const pathname = router ? router.pathname : "";
  const isAdminOrForm = pathname === "/form" || pathname.startsWith("/admin");
  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <div id="root">
            {/* 개발중 안내: /form, /admin 및 하위 경로는 예외 */}
            {router && !isAdminOrForm && <DevNotice />}
            <Component {...pageProps} />
          </div>
        </Elements>
      </Provider>
    </GoogleOAuthProvider>
  );
}
