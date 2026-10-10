
import "./Payment.css";

import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

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
  CarFront,
  Clock,
  Bus,
  Hotel,
  Shield,
} from "lucide-react";

import tours from "../data/tours";

const Payment = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const type = (params.get("type") || "tour").toLowerCase();

  // -----------------------------------------
  // BOOKING TYPE
  // -----------------------------------------

  const isCabBooking = type === "cab";
  const isBusBooking = type === "bus";
  const isHotelBooking = type === "hotel";
  const isInsuranceBooking = type === "insurance";
  const isTourBooking =
    !isCabBooking &&
    !isBusBooking &&
    !isHotelBooking &&
    !isInsuranceBooking;

  // -----------------------------------------
  // COMMON BOOKING DETAILS
  // -----------------------------------------

  const item = {
    id:
      params.get("cabId") ||
      params.get("busId") ||
      params.get("hotelId") ||
      params.get("insuranceId") ||
      id ||
      "",

    name:
      params.get("name") ||
      params.get("hotelName") ||
      params.get("planName") ||
      "",

    price: Number(params.get("price") || 0),

    from: params.get("from") || "",
    to: params.get("to") || "",

    date:
      params.get("date") ||
      params.get("travelDate") ||
      params.get("checkIn") ||
      "",

    time: params.get("time") || "",
    departure: params.get("departure") || "",
    arrival: params.get("arrival") || "",
    duration: params.get("duration") || "",

    vehicle: params.get("vehicle") || "Cab",
    subtitle: params.get("subtitle") || "",
    seatType: params.get("seatType") || "Seater",
    ac: params.get("ac") === "true",

    seats: Number(params.get("seats") || 1),
    travellers: Number(
      params.get("travellers") ||
      params.get("guests") ||
      params.get("members") ||
      params.get("seats") ||
      1
    ),

    checkIn: params.get("checkIn") || "",
    checkOut: params.get("checkOut") || "",
    rooms: Number(params.get("rooms") || 1),
    guests: Number(params.get("guests") || 1),

    plan: params.get("plan") || params.get("planName") || "",
    coverage: params.get("coverage") || "",
    durationLabel: params.get("durationLabel") || "",
  };

  // -----------------------------------------
  // TOUR DETAILS
  // -----------------------------------------

  const tour = isTourBooking
    ? location.state?.tour ||
      tours.find((tourItem) => String(tourItem.id) === String(id))
    : null;

  // -----------------------------------------
  // CUSTOMER DETAILS
  // -----------------------------------------

  const booking = {
    fullName:
      params.get("fullName") ||
      location.state?.booking?.fullName ||
      "",
    email:
      params.get("email") ||
      location.state?.booking?.email ||
      "",
    mobile:
      params.get("mobile") ||
      location.state?.booking?.mobile ||
      "",
    travelDate:
      item.date ||
      location.state?.booking?.travelDate ||
      "",
    adults: Number(
      params.get("travellers") ||
      params.get("seats") ||
      params.get("guests") ||
      location.state?.booking?.adults ||
      1
    ),
    children: Number(
      location.state?.booking?.children || 0
    ),
    infants: Number(
      location.state?.booking?.infants || 0
    ),
  };

  const initialTotal = Number(
    isTourBooking
      ? location.state?.totalPrice ?? tour?.price ?? 0
      : item.price
  );

  const bookingTitle = isCabBooking
    ? item.name || "Selected Cab"
    : isBusBooking
    ? item.name || "Selected Bus"
    : isHotelBooking
    ? item.name || "Selected Hotel"
    : isInsuranceBooking
    ? item.name || "Travel Insurance"
    : tour?.name || "Tour Package";

  const bookingSubtitle = isCabBooking
    ? item.vehicle
    : isBusBooking
    ? `${item.ac ? "AC" : "Non-AC"} ${item.seatType}`
    : isHotelBooking
    ? item.subtitle || "Hotel Reservation"
    : isInsuranceBooking
    ? item.plan || item.subtitle || "Insurance Plan"
    : tour?.destination || "";

  const dateLabel = isHotelBooking ? "Check-in Date" : "Travel Date";

  // -----------------------------------------
  // PAYMENT STATE
  // -----------------------------------------

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  // -----------------------------------------
  // PRICE AND COUPON
  // -----------------------------------------

  const discount = couponApplied
    ? Math.round(initialTotal * 0.1)
    : 0;

  const finalAmount = Math.max(0, initialTotal - discount);

  const applyCoupon = () => {
    setCouponError("");

    if (!coupon.trim()) {
      setCouponError("Enter a coupon code.");
      return;
    }

    if (coupon.trim().toUpperCase() === "TRAVEL10") {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code.");
    }
  };

  // -----------------------------------------
  // CARD INPUT FORMATTING
  // -----------------------------------------

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
      formattedValue = value.replace(/\D/g, "").slice(0, 4);

      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) +
          "/" +
          formattedValue.slice(2);
      }
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardData((previous) => ({
      ...previous,
      [name]: formattedValue,
    }));

    setPaymentError("");
  };

  // -----------------------------------------
  // PAYMENT VALIDATION
  // -----------------------------------------

  const validatePayment = () => {
    if (initialTotal <= 0) {
      return "Booking price is missing. Please select your booking again.";
    }

    if (paymentMethod === "card") {
      const cardNumber = cardData.cardNumber.replace(/\s/g, "");

      if (!/^\d{16}$/.test(cardNumber)) {
        return "Please enter a valid 16-digit card number.";
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry)) {
        return "Please enter expiry in MM/YY format.";
      }

      if (!/^\d{3}$/.test(cardData.cvv)) {
        return "Please enter a valid 3-digit CVV.";
      }

      if (!cardData.name.trim()) {
        return "Please enter the name on your card.";
      }
    }

    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        return "Please enter your UPI ID.";
      }

      if (!/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
        return "Please enter a valid UPI ID.";
      }
    }

    if (paymentMethod === "netbanking" && !selectedBank) {
      return "Please select a bank.";
    }

    if (paymentMethod === "wallet" && !selectedWallet) {
      return "Please select a wallet.";
    }

    return "";
  };

  const handlePayment = () => {
    const error = validatePayment();

    if (error) {
      setPaymentError(error);
      return;
    }

    setPaymentError("");

    // Demo only: no real payment is processed.
    setIsPaid(true);
  };

  // -----------------------------------------
  // HELPERS
  // -----------------------------------------

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not selected";

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const travellerCount =
    (Number(booking.adults) || 0) +
    (Number(booking.children) || 0) +
    (Number(booking.infants) || 0);

  const goBack = () => {
    if (isTourBooking) {
      navigate(`/booking/${tour.id}`);
      return;
    }

    // Return to the previous booking form with its current details.
    navigate(-1);
  };

  const explorePath = isCabBooking
    ? "/cabs"
    : isBusBooking
    ? "/bus-result"
    : isHotelBooking
    ? "/hotel-results"
    : isInsuranceBooking
    ? "/insurance-results"
    : "/tours";

  const exploreLabel = isCabBooking
    ? "Explore More Cabs"
    : isBusBooking
    ? "Search More Buses"
    : isHotelBooking
    ? "Explore More Hotels"
    : isInsuranceBooking
    ? "Explore Insurance"
    : "Explore More Tours";

    
  // -----------------------------------------
  // EXPLORE MORE / SEARCH MORE BUSES
  // -----------------------------------------

  const handleExploreMore = () => {
    if (isBusBooking) {
      const searchParams = new URLSearchParams();

      searchParams.set("type", "bus");
      searchParams.set("from", item.from || "");
      searchParams.set("to", item.to || "");
      searchParams.set("date", item.date || "");

      navigate(`/bus-result?${searchParams.toString()}`);
      return;
    }

    navigate(explorePath);
  };


  const isBookingMissing =
    isTourBooking
      ? !tour
      : !item.id || initialTotal <= 0;

  // -----------------------------------------
  // BOOKING NOT FOUND
  // -----------------------------------------

  if (isBookingMissing) {
    return (
      <div className="payment-not-found">
        <h2>Booking Details Not Found</h2>
        <p>
          Booking details or price are missing. Please return to the
          results page and select your booking again.
        </p>

        <Link
          to={explorePath}
          className="payment-back-button"
        >
          <ArrowLeft size={17} />
          Back to {exploreLabel}
        </Link>
      </div>
    );
  }

  // -----------------------------------------
  // PAYMENT SUCCESS
  // -----------------------------------------

  if (isPaid) {
    const bookingId = `MKT${Date.now().toString().slice(-8)}`;

    return (
      <div className="payment-success-page">
        <div className="success-card">
          <div className="success-icon">
            <Check size={38} />
          </div>

          <span className="success-label">
            PAYMENT SUCCESSFUL
          </span>

          <h1>Booking Confirmed!</h1>

          <p className="success-message">
            Your {isCabBooking
              ? "cab"
              : isBusBooking
              ? "bus"
              : isHotelBooking
              ? "hotel"
              : isInsuranceBooking
              ? "insurance"
              : "tour"}{" "}
            booking has been confirmed in this demo.
          </p>

          <div className="booking-confirmation">
            <div className="confirmation-row">
              <span>Booking ID</span>
              <strong>{bookingId}</strong>
            </div>

            <div className="confirmation-row">
              <span>
                {isCabBooking
                  ? "Cab"
                  : isBusBooking
                  ? "Bus"
                  : isHotelBooking
                  ? "Hotel"
                  : isInsuranceBooking
                  ? "Insurance Plan"
                  : "Tour"}
              </span>
              <strong>{bookingTitle}</strong>
            </div>

            {isTourBooking && (
              <div className="confirmation-row">
                <span>Destination</span>
                <strong>{tour.destination}</strong>
              </div>
            )}

            {isCabBooking && (
              <>
                <div className="confirmation-row">
                  <span>Vehicle</span>
                  <strong>{item.vehicle}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Pickup</span>
                  <strong>{item.from || "Not specified"}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Drop</span>
                  <strong>{item.to || "Not specified"}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Pickup Time</span>
                  <strong>{item.time || "Not specified"}</strong>
                </div>
              </>
            )}

            {isBusBooking && (
              <>
                <div className="confirmation-row">
                  <span>Route</span>
                  <strong>
                    {item.from || "Not specified"} →{" "}
                    {item.to || "Not specified"}
                  </strong>
                </div>
                <div className="confirmation-row">
                  <span>Departure</span>
                  <strong>{item.departure || "Not specified"}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Seat Type</span>
                  <strong>{item.seatType}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Seats</span>
                  <strong>{item.seats}</strong>
                </div>
              </>
            )}

            {isHotelBooking && (
              <>
                <div className="confirmation-row">
                  <span>Check-in</span>
                  <strong>{formatDate(item.checkIn || item.date)}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Check-out</span>
                  <strong>{formatDate(item.checkOut)}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Rooms</span>
                  <strong>{item.rooms}</strong>
                </div>
                <div className="confirmation-row">
                  <span>Guests</span>
                  <strong>{item.guests}</strong>
                </div>
              </>
            )}

            {isInsuranceBooking && (
              <>
                <div className="confirmation-row">
                  <span>Plan</span>
                  <strong>{item.plan || item.subtitle || "Standard Plan"}</strong>
                </div>
                {item.coverage && (
                  <div className="confirmation-row">
                    <span>Coverage</span>
                    <strong>{item.coverage}</strong>
                  </div>
                )}
              </>
            )}

            <div className="confirmation-row">
              <span>{dateLabel}</span>
              <strong>
                {formatDate(booking.travelDate)}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>
                {isHotelBooking
                  ? "Guests"
                  : isBusBooking
                  ? "Seats"
                  : "Travellers"}
              </span>
              <strong>
                {isHotelBooking
                  ? item.guests
                  : isBusBooking
                  ? item.seats
                  : travellerCount || item.travellers || 1}
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
              Customer email:{" "}
              <strong>{booking.email || "Not provided"}</strong>
            </span>
          </div>

            
  <div className="success-actions">
    <Link to="/" className="success-home-button">
      Go to Home
    </Link>

    <button
      type="button"
      className="success-tours-button"
      onClick={handleExploreMore}
    >
      {isBusBooking && <Bus size={17} />}
      {exploreLabel}
    </button>
  </div>

        </div>
      </div>
    );
  }

  // -----------------------------------------
  // PAYMENT PAGE
  // -----------------------------------------

  return (
    <div className="payment-page">
      <div className="payment-container">
        <button
          type="button"
          onClick={goBack}
          className="payment-back-link"
        >
          <ArrowLeft size={17} />
          Back to Booking
        </button>

        <div className="payment-header">
          <div>
            <span className="payment-label">SECURE CHECKOUT</span>
            <h1>Payment</h1>
            <p>
              Complete your payment to confirm your booking.
            </p>
          </div>

          <div className="payment-secure">
            <Lock size={16} />
            Secure Payment
          </div>
        </div>

        <div className="payment-layout">
          <div className="payment-main">
            {/* PAYMENT METHODS */}

            <section className="payment-card">
              <div className="payment-card-heading">
                <div className="payment-heading-icon">
                  <CreditCard size={19} />
                </div>
                <div>
                  <h2>Select Payment Method</h2>
                  <p>Choose your preferred payment option.</p>
                </div>
              </div>

              <div className="payment-methods">
                <button
                  type="button"
                  className={
                    paymentMethod === "card"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() => {
                    setPaymentMethod("card");
                    setPaymentError("");
                  }}
                >
                  <CreditCard size={20} />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === "upi"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() => {
                    setPaymentMethod("upi");
                    setPaymentError("");
                  }}
                >
                  <Smartphone size={20} />
                  <span>UPI</span>
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === "netbanking"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() => {
                    setPaymentMethod("netbanking");
                    setPaymentError("");
                  }}
                >
                  <Building2 size={20} />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === "wallet"
                      ? "method-button active"
                      : "method-button"
                  }
                  onClick={() => {
                    setPaymentMethod("wallet");
                    setPaymentError("");
                  }}
                >
                  <Wallet size={20} />
                  <span>Wallet</span>
                </button>
              </div>

              {/* CARD */}

              {paymentMethod === "card" && (
                <div className="payment-method-content">
                  <div className="payment-method-title">
                    <h3>Card Details</h3>
                    <span>Visa / Mastercard / RuPay</span>
                  </div>

                  <div className="payment-form">
                    <div className="payment-input-group full">
                      <label>Card Number</label>
                      <div className="payment-input">
                        <CreditCard size={17} />
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          autoComplete="cc-number"
                        />
                      </div>
                    </div>

                    <div className="payment-input-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                      />
                    </div>

                    <div className="payment-input-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="•••"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                      />
                    </div>

                    <div className="payment-input-group full">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        name="name"
                        value={cardData.name}
                        onChange={handleCardChange}
                        placeholder="Enter name as on card"
                        autoComplete="cc-name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI */}

              {paymentMethod === "upi" && (
                <div className="payment-method-content">
                  <div className="payment-method-title">
                    <h3>Pay with UPI</h3>
                    <span>Google Pay, PhonePe, Paytm & more</span>
                  </div>

                  <div className="upi-options">
                    <div className="upi-option">
                      <span className="upi-logo google">G</span>
                      Google Pay
                    </div>
                    <div className="upi-option">
                      <span className="upi-logo phonepe">P</span>
                      PhonePe
                    </div>
                    <div className="upi-option">
                      <span className="upi-logo paytm">P</span>
                      Paytm
                    </div>
                  </div>

                  <div className="payment-input-group full">
                    <label>UPI ID</label>
                    <div className="payment-input">
                      <Smartphone size={17} />
                      <input
                        type="text"
                        value={upiId}
                        onChange={(event) => {
                          setUpiId(event.target.value);
                          setPaymentError("");
                        }}
                        placeholder="example@upi"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NET BANKING */}

              {paymentMethod === "netbanking" && (
                <div className="payment-method-content">
                  <div className="payment-method-title">
                    <h3>Select Your Bank</h3>
                    <span>Demo bank selection only.</span>
                  </div>

                  <div className="bank-grid">
                    {[
                      "SBI",
                      "HDFC",
                      "ICICI",
                      "Axis",
                      "Kotak",
                      "Other Banks",
                    ].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        className={
                          selectedBank === bank
                            ? "bank-option active"
                            : "bank-option"
                        }
                        onClick={() => {
                          setSelectedBank(bank);
                          setPaymentError("");
                        }}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* WALLET */}

              {paymentMethod === "wallet" && (
                <div className="payment-method-content">
                  <div className="payment-method-title">
                    <h3>Select Wallet</h3>
                    <span>Demo wallet selection only.</span>
                  </div>

                  <div className="wallet-grid">
                    {[
                      "Paytm Wallet",
                      "Amazon Pay",
                      "Mobikwik",
                      "Freecharge",
                    ].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        className={
                          selectedWallet === wallet
                            ? "wallet-option active"
                            : "wallet-option"
                        }
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setPaymentError("");
                        }}
                      >
                        <Wallet size={20} />
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="payment-error">
                  {paymentError}
                </div>
              )}

              <button
                type="button"
                className="pay-now-button"
                onClick={handlePayment}
              >
                <Lock size={16} />
                Pay ₹{finalAmount.toLocaleString("en-IN")}
              </button>

              <div className="payment-protection">
                <ShieldCheck size={17} />
                <span>
                  Demo checkout only. No real payment is processed.
                </span>
              </div>
            </section>

            {/* COUPON */}

            <section className="payment-card coupon-card">
              <div className="coupon-heading">
                <div className="coupon-icon">
                  <TicketPercent size={19} />
                </div>
                <div>
                  <h2>Have a Coupon?</h2>
                  <p>Apply a coupon and save on your booking.</p>
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
                  {couponApplied ? "Applied" : "Apply"}
                </button>
              </div>

              {couponError && (
                <span className="coupon-error">{couponError}</span>
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

          {/* RIGHT SUMMARY */}

          <aside className="payment-summary">
            <div className="payment-tour">
              {isTourBooking && tour?.image ? (
                <img src={tour.image} alt={tour.name} />
              ) : (
                <div className="payment-tour-image-placeholder">
                  {isCabBooking && <CarFront size={34} />}
                  {isBusBooking && <Bus size={34} />}
                  {isHotelBooking && <Hotel size={34} />}
                  {isInsuranceBooking && <Shield size={34} />}
                </div>
              )}

              <div>
                <h3>{bookingTitle}</h3>

                <span>
                  {isTourBooking ? (
                    <>
                      <MapPin size={13} />
                      {tour.destination}
                    </>
                  ) : (
                    bookingSubtitle
                  )}
                </span>

                {isTourBooking && (
                  <span className="payment-tour-rating">
                    <Star size={12} fill="currentColor" />
                    {tour.rating}
                  </span>
                )}
              </div>
            </div>

            {/* BOOKING DETAILS */}

            <div className="summary-details">
              <h3>Booking Details</h3>

              <div className="summary-detail-row">
                <CalendarDays size={15} />
                <span>{dateLabel}</span>
                <strong>
                  {formatDate(booking.travelDate)}
                </strong>
              </div>

              {isBusBooking && (
                <>
                  <div className="summary-detail-row">
                    <MapPin size={15} />
                    <span>From</span>
                    <strong>{item.from || "Not specified"}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <MapPin size={15} />
                    <span>To</span>
                    <strong>{item.to || "Not specified"}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <Clock size={15} />
                    <span>Departure</span>
                    <strong>{item.departure || "Not specified"}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <Users size={15} />
                    <span>Seats</span>
                    <strong>{item.seats}</strong>
                  </div>
                </>
              )}

              {isCabBooking && (
                <>
                  <div className="summary-detail-row">
                    <MapPin size={15} />
                    <span>Pickup</span>
                    <strong>{item.from || "Not specified"}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <MapPin size={15} />
                    <span>Drop</span>
                    <strong>{item.to || "Not specified"}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <Clock size={15} />
                    <span>Pickup Time</span>
                    <strong>{item.time || "Not specified"}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <Users size={15} />
                    <span>Travellers</span>
                    <strong>{item.travellers}</strong>
                  </div>
                </>
              )}

              {isHotelBooking && (
                <>
                  <div className="summary-detail-row">
                    <CalendarDays size={15} />
                    <span>Check-out</span>
                    <strong>{formatDate(item.checkOut)}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <Hotel size={15} />
                    <span>Rooms</span>
                    <strong>{item.rooms}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <Users size={15} />
                    <span>Guests</span>
                    <strong>{item.guests}</strong>
                  </div>
                </>
              )}

              {isInsuranceBooking && (
                <>
                  <div className="summary-detail-row">
                    <Shield size={15} />
                    <span>Plan</span>
                    <strong>{item.plan || "Standard Plan"}</strong>
                  </div>
                  {item.coverage && (
                    <div className="summary-detail-row">
                      <ShieldCheck size={15} />
                      <span>Coverage</span>
                      <strong>{item.coverage}</strong>
                    </div>
                  )}
                  {item.durationLabel && (
                    <div className="summary-detail-row">
                      <Clock size={15} />
                      <span>Duration</span>
                      <strong>{item.durationLabel}</strong>
                    </div>
                  )}
                </>
              )}

              {isTourBooking && (
                <>
                  <div className="summary-detail-row">
                    <Users size={15} />
                    <span>Travellers</span>
                    <strong>{travellerCount || 1}</strong>
                  </div>
                  <div className="summary-detail-row">
                    <Clock size={15} />
                    <span>Duration</span>
                    <strong>{tour.duration}</strong>
                  </div>
                </>
              )}
            </div>

            {/* PRICE SUMMARY */}

            <div className="payment-price">
              <h3>Price Summary</h3>

              <div className="payment-price-row">
                <span>
                  {isCabBooking
                    ? "Cab Fare"
                    : isBusBooking
                    ? "Bus Fare"
                    : isHotelBooking
                    ? "Hotel Price"
                    : isInsuranceBooking
                    ? "Insurance Premium"
                    : "Package Price"}
                </span>
                <strong>
                  ₹{initialTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              {couponApplied && (
                <div className="payment-price-row discount">
                  <span>Coupon Discount</span>
                  <strong>
                    - ₹{discount.toLocaleString("en-IN")}
                  </strong>
                </div>
              )}

              <div className="payment-divider" />

              <div className="payment-total">
                <span>Total Payable</span>
                <strong>
                  ₹{finalAmount.toLocaleString("en-IN")}
                </strong>
              </div>

              <small>Inclusive of applicable charges</small>
            </div>

            {/* CUSTOMER DETAILS */}

            <div className="customer-summary">
              <h3>Customer Details</h3>

              <div>
                <User size={14} />
                <span>{booking.fullName || "Name not provided"}</span>
              </div>

              <div>
                <Mail size={14} />
                <span>{booking.email || "Email not provided"}</span>
              </div>

              <div>
                <Phone size={14} />
                <span>
                  {booking.mobile
                    ? `+91 ${booking.mobile}`
                    : "Mobile not provided"}
                </span>
              </div>
            </div>

            {/* SECURITY */}

            <div className="payment-summary-security">
              <ShieldCheck size={19} />
              <div>
                <strong>Secure Checkout</strong>
                <span>Demo payment flow for your booking.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Payment;