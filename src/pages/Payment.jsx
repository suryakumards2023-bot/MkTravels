import "./Payment.css";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  Wallet,
  Building2,
  TicketPercent,
  CalendarDays,
  Users,
  User,
  Star,
} from "lucide-react";

import tours from "../data/tours";
import "./Payment.css";

const Payment = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const tour =
    location.state?.tour ||
    tours.find((item) => String(item.id) === String(id));

  const booking = location.state?.booking || {
    fullName: "",
    email: "",
    mobile: "",
    travelDate: "",
    adults: 1,
    children: 0,
    infants: 0,
  };

  const initialTotal =
    location.state?.totalPrice || tour?.price || 0;

  const [paymentMethod, setPaymentMethod] =
    useState("card");

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const [upiId, setUpiId] = useState("");

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] =
    useState(false);
  const [couponError, setCouponError] =
    useState("");

  const [paymentError, setPaymentError] =
    useState("");

  const [isPaid, setIsPaid] =
    useState(false);


  /* =========================================
     COUPON
  ========================================= */

  const discount =
    couponApplied ? Math.round(initialTotal * 0.1) : 0;

  const finalAmount =
    initialTotal - discount;


  /* =========================================
     APPLY COUPON
  ========================================= */

  const applyCoupon = () => {
    setCouponError("");

    if (!coupon.trim()) {
      setCouponError("Enter a coupon code");
      return;
    }

    if (coupon.trim().toUpperCase() === "TRAVEL10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code");
    }
  };


  /* =========================================
     CARD INPUT
  ========================================= */

  const handleCardChange = (event) => {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (name === "expiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 4);

      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) +
          "/" +
          formattedValue.slice(2);
      }
    }

    if (name === "cvv") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 3);
    }

    setCardData((previous) => ({
      ...previous,
      [name]: formattedValue,
    }));

    setPaymentError("");
  };


  /* =========================================
     PAYMENT VALIDATION
  ========================================= */

  const validatePayment = () => {

    if (paymentMethod === "card") {

      const cardNumber =
        cardData.cardNumber.replace(/\s/g, "");

      if (cardNumber.length !== 16) {
        return "Please enter a valid 16-digit card number.";
      }

      if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
        return "Please enter a valid expiry date.";
      }

      if (cardData.cvv.length !== 3) {
        return "Please enter a valid 3-digit CVV.";
      }

      if (!cardData.name.trim()) {
        return "Please enter the name on card.";
      }
    }


    if (paymentMethod === "upi") {

      if (!upiId.trim()) {
        return "Please enter your UPI ID.";
      }

      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        return "Please enter a valid UPI ID.";
      }
    }

    return "";
  };


  /* =========================================
     PAY NOW
  ========================================= */

  const handlePayment = () => {

    const error = validatePayment();

    if (error) {
      setPaymentError(error);
      return;
    }

    setPaymentError("");

    /*
      Demo payment success.
      Real payment gateway integration
      will be added later.
    */

    setIsPaid(true);
  };


  /* =========================================
     TOUR NOT FOUND
  ========================================= */

  if (!tour) {
    return (
      <div className="payment-not-found">

        <h2>
          Booking Not Found
        </h2>

        <p>
          We could not find the selected tour.
        </p>

        <Link
          to="/tours"
          className="payment-back-button"
        >
          <ArrowLeft size={17} />
          Back to Tours
        </Link>

      </div>
    );
  }


  /* =========================================
     PAYMENT SUCCESS
  ========================================= */

  if (isPaid) {

    const bookingId =
      `MKT${Date.now().toString().slice(-8)}`;

    return (
      <div className="payment-success-page">

        <div className="success-card">

          <div className="success-icon">
            <Check size={38} />
          </div>

          <span className="success-label">
            PAYMENT SUCCESSFUL
          </span>

          <h1>
            Booking Confirmed!
          </h1>

          <p className="success-message">
            Your tour has been successfully booked.
            We have sent the booking details to your
            email address.
          </p>


          <div className="booking-confirmation">

            <div className="confirmation-row">
              <span>Booking ID</span>
              <strong>{bookingId}</strong>
            </div>

            <div className="confirmation-row">
              <span>Tour</span>
              <strong>{tour.name}</strong>
            </div>

            <div className="confirmation-row">
              <span>Destination</span>
              <strong>
                {tour.destination}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>Travel Date</span>
              <strong>
                {booking.travelDate
                  ? new Date(
                      booking.travelDate
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Not specified"}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>Travellers</span>
              <strong>
                {(booking.adults || 1) +
                  (booking.children || 0) +
                  (booking.infants || 0)}
              </strong>
            </div>

            <div className="confirmation-row total">
              <span>Amount Paid</span>
              <strong>
                ₹{finalAmount.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>


          <div className="success-contact">

            <Mail size={16} />

            <span>
              Booking confirmation sent to{" "}
              <strong>
                {booking.email || "your email"}
              </strong>
            </span>

          </div>


          <div className="success-actions">

            <Link
              to="/"
              className="success-home-button"
            >
              Go to Home
            </Link>

            <Link
              to="/tours"
              className="success-tours-button"
            >
              Explore More Tours
            </Link>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="payment-page">

      <div className="payment-container">


        {/* =====================================
            BACK
        ===================================== */}

        <Link
          to={`/booking/${tour.id}`}
          className="payment-back-link"
        >
          <ArrowLeft size={17} />
          Back to Booking
        </Link>


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="payment-header">

          <div>

            <span className="payment-label">
              SECURE CHECKOUT
            </span>

            <h1>
              Payment
            </h1>

            <p>
              Complete your payment to confirm
              your booking.
            </p>

          </div>

          <div className="payment-secure">

            <Lock size={16} />

            Secure Payment

          </div>

        </div>


        {/* =====================================
            MAIN LAYOUT
        ===================================== */}

        <div className="payment-layout">


          {/* ===================================
              LEFT PAYMENT
          =================================== */}

          <div className="payment-main">


            {/* PAYMENT METHODS */}

            <section className="payment-card">

              <div className="payment-card-heading">

                <div className="payment-heading-icon">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2>
                    Select Payment Method
                  </h2>

                  <p>
                    Choose your preferred payment
                    option.
                  </p>
                </div>

              </div>


              {/* METHOD TABS */}

              <div className="payment-methods">

                <button
                  type="button"
                  className={
                    paymentMethod === "card"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                >
                  <CreditCard size={20} />

                  <span>
                    Card
                  </span>
                </button>


                <button
                  type="button"
                  className={
                    paymentMethod === "upi"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                >
                  <Smartphone size={20} />

                  <span>
                    UPI
                  </span>
                </button>


                <button
                  type="button"
                  className={
                    paymentMethod === "netbanking"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() =>
                    setPaymentMethod("netbanking")
                  }
                >
                  <Building2 size={20} />

                  <span>
                    Net Banking
                  </span>
                </button>


                <button
                  type="button"
                  className={
                    paymentMethod === "wallet"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() =>
                    setPaymentMethod("wallet")
                  }
                >
                  <Wallet size={20} />

                  <span>
                    Wallet
                  </span>
                </button>

              </div>


              {/* =================================
                  CARD
              ================================= */}

              {paymentMethod === "card" && (

                <div className="payment-method-content">

                  <div className="payment-method-title">

                    <h3>
                      Card Details
                    </h3>

                    <span>
                      Visa / Mastercard / RuPay
                    </span>

                  </div>


                  <div className="payment-form">


                    <div className="payment-input-group full">

                      <label>
                        Card Number
                      </label>

                      <div className="payment-input">

                        <CreditCard size={17} />

                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                        />

                      </div>

                    </div>


                    <div className="payment-input-group">

                      <label>
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        inputMode="numeric"
                      />

                    </div>


                    <div className="payment-input-group">

                      <label>
                        CVV
                      </label>

                      <input
                        type="password"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="•••"
                        inputMode="numeric"
                      />

                    </div>


                    <div className="payment-input-group full">

                      <label>
                        Name on Card
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={cardData.name}
                        onChange={handleCardChange}
                        placeholder="Enter name as on card"
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* =================================
                  UPI
              ================================= */}

              {paymentMethod === "upi" && (

                <div className="payment-method-content">

                  <div className="payment-method-title">

                    <h3>
                      Pay with UPI
                    </h3>

                    <span>
                      Google Pay, PhonePe, Paytm & more
                    </span>

                  </div>


                  <div className="upi-options">

                    <div className="upi-option">
                      <span className="upi-logo google">
                        G
                      </span>
                      Google Pay
                    </div>

                    <div className="upi-option">
                      <span className="upi-logo phonepe">
                        P
                      </span>
                      PhonePe
                    </div>

                    <div className="upi-option">
                      <span className="upi-logo paytm">
                        P
                      </span>
                      Paytm
                    </div>

                  </div>


                  <div className="payment-input-group full">

                    <label>
                      UPI ID
                    </label>

                    <div className="payment-input">

                      <Smartphone size={17} />

                      <input
                        type="text"
                        value={upiId}
                        onChange={(event) => {
                          setUpiId(
                            event.target.value
                          );
                          setPaymentError("");
                        }}
                        placeholder="example@upi"
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* =================================
                  NET BANKING
              ================================= */}

              {paymentMethod === "netbanking" && (

                <div className="payment-method-content">

                  <div className="payment-method-title">

                    <h3>
                      Select Your Bank
                    </h3>

                    <span>
                      You will be redirected to your
                      bank's website.
                    </span>

                  </div>


                  <div className="bank-grid">

                    <button
                      type="button"
                      className="bank-option"
                    >
                      SBI
                    </button>

                    <button
                      type="button"
                      className="bank-option"
                    >
                      HDFC
                    </button>

                    <button
                      type="button"
                      className="bank-option"
                    >
                      ICICI
                    </button>

                    <button
                      type="button"
                      className="bank-option"
                    >
                      Axis
                    </button>

                    <button
                      type="button"
                      className="bank-option"
                    >
                      Kotak
                    </button>

                    <button
                      type="button"
                      className="bank-option"
                    >
                      Other Banks
                    </button>

                  </div>

                </div>

              )}


              {/* =================================
                  WALLET
              ================================= */}

              {paymentMethod === "wallet" && (

                <div className="payment-method-content">

                  <div className="payment-method-title">

                    <h3>
                      Select Wallet
                    </h3>

                    <span>
                      Choose your preferred wallet.
                    </span>

                  </div>


                  <div className="wallet-grid">

                    <button
                      type="button"
                      className="wallet-option"
                    >
                      <Wallet size={20} />
                      Paytm Wallet
                    </button>

                    <button
                      type="button"
                      className="wallet-option"
                    >
                      <Wallet size={20} />
                      Amazon Pay
                    </button>

                    <button
                      type="button"
                      className="wallet-option"
                    >
                      <Wallet size={20} />
                      Mobikwik
                    </button>

                    <button
                      type="button"
                      className="wallet-option"
                    >
                      <Wallet size={20} />
                      Freecharge
                    </button>

                  </div>

                </div>

              )}


              {/* ERROR */}

              {paymentError && (

                <div className="payment-error">
                  {paymentError}
                </div>

              )}


              {/* PAY BUTTON */}

              <button
                type="button"
                className="pay-now-button"
                onClick={handlePayment}
              >
                <Lock size={16} />

                Pay ₹
                {finalAmount.toLocaleString("en-IN")}

              </button>


              <div className="payment-protection">

                <ShieldCheck size={17} />

                <span>
                  Your payment information is encrypted
                  and secure.
                </span>

              </div>

            </section>


            {/* ===================================
                COUPON
            =================================== */}

            <section className="payment-card coupon-card">

              <div className="coupon-heading">

                <div className="coupon-icon">
                  <TicketPercent size={19} />
                </div>

                <div>
                  <h2>
                    Have a Coupon?
                  </h2>

                  <p>
                    Apply a coupon and save on your
                    booking.
                  </p>
                </div>

              </div>


              <div className="coupon-form">

                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => {
                    setCoupon(event.target.value);
                    setCouponApplied(false);
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  disabled={couponApplied}
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponApplied}
                >
                  {couponApplied
                    ? "Applied"
                    : "Apply"}
                </button>

              </div>


              {couponError && (
                <span className="coupon-error">
                  {couponError}
                </span>
              )}


              {couponApplied && (
                <div className="coupon-success">
                  <Check size={14} />
                  TRAVEL10 applied — You saved ₹
                  {discount.toLocaleString("en-IN")}
                </div>
              )}

            </section>

          </div>


          {/* ===================================
              RIGHT SUMMARY
          =================================== */}

          <aside className="payment-summary">


            {/* TOUR */}

            <div className="payment-tour">

              <img
                src={tour.image}
                alt={tour.name}
              />

              <div>

                <h3>
                  {tour.name}
                </h3>

                <span>
                  <MapPin size={13} />
                  {tour.destination}
                </span>

                <span className="payment-tour-rating">
                  <Star
                    size={12}
                    fill="currentColor"
                  />
                  {tour.rating}
                </span>

              </div>

            </div>


            {/* BOOKING DETAILS */}

            <div className="summary-details">

              <h3>
                Booking Details
              </h3>


              <div className="summary-detail-row">

                <CalendarDays size={15} />

                <span>
                  Travel Date
                </span>

                <strong>
                  {booking.travelDate
                    ? new Date(
                        booking.travelDate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Not selected"}
                </strong>

              </div>


              <div className="summary-detail-row">

                <Users size={15} />

                <span>
                  Travellers
                </span>

                <strong>
                  {(booking.adults || 1) +
                    (booking.children || 0) +
                    (booking.infants || 0)}
                </strong>

              </div>


              <div className="summary-detail-row">

                <span>
                  Duration
                </span>

                <strong>
                  {tour.duration}
                </strong>

              </div>

            </div>


            {/* PRICE */}

            <div className="payment-price">

              <h3>
                Price Summary
              </h3>


              <div className="payment-price-row">

                <span>
                  Package Price
                </span>

                <strong>
                  ₹
                  {initialTotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {couponApplied && (

                <div className="payment-price-row discount">

                  <span>
                    Coupon Discount
                  </span>

                  <strong>
                    - ₹
                    {discount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              )}


              <div className="payment-divider" />


              <div className="payment-total">

                <span>
                  Total Payable
                </span>

                <strong>
                  ₹
                  {finalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <small>
                Inclusive of applicable charges
              </small>

            </div>


            {/* CUSTOMER */}

            <div className="customer-summary">

              <h3>
                Traveller
              </h3>

              <div>
                <User size={14} />

                <span>
                  {booking.fullName || "Primary Traveller"}
                </span>
              </div>

              <div>
                <Mail size={14} />

                <span>
                  {booking.email || "Email"}
                </span>
              </div>

              <div>
                <Phone size={14} />

                <span>
                  {booking.mobile
                    ? `+91 ${booking.mobile}`
                    : "Mobile"}
                </span>
              </div>

            </div>


            {/* SECURE */}

            <div className="payment-summary-security">

              <ShieldCheck size={19} />

              <div>

                <strong>
                  100% Secure Payment
                </strong>

                <span>
                  Your transaction is protected.
                </span>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
};

export default Payment;