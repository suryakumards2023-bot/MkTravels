import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Hotel,
  Mail,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Ticket,
  Trash2,
  User,
  Users,
  Utensils,
  Bus,
  CreditCard,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

import bookings from "../data/bookings";
import "./BookingDetails.css";

function BookingDetails() {
  const { id } = useParams();
  const location = useLocation();

  const booking =
    location.state?.booking ||
    bookings.find((item) => item.id === id);

  const [openDay, setOpenDay] = useState(1);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  if (!booking) {
    return (
      <div className="booking-details-page">
        <div className="booking-not-found">
          <div className="not-found-icon">
            <Ticket size={35} />
          </div>

          <h2>Booking Not Found</h2>

          <p>
            We could not find the booking you are looking for.
          </p>

          <Link to="/my-bookings">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const itinerary = [
    {
      day: 1,
      title: "Arrival & Hotel Check-in",
      description:
        `Arrive at ${booking.destination.split(",")[0]} and transfer to your hotel. Complete hotel check-in and spend the evening exploring nearby attractions.`,
      activities: [
        "Airport / Bus pickup",
        "Hotel check-in",
        "Welcome refreshments",
        "Evening leisure",
      ],
    },
    {
      day: 2,
      title: "Local Sightseeing",
      description:
        `Enjoy a full-day sightseeing experience covering the most popular attractions around ${booking.destination.split(",")[0]}.`,
      activities: [
        "Breakfast at hotel",
        "Local sightseeing",
        "Lunch",
        "Evening shopping / leisure",
      ],
    },
    {
      day: 3,
      title: "Adventure & Exploration",
      description:
        "Experience exciting activities and discover the natural beauty and culture of the destination.",
      activities: [
        "Breakfast",
        "Adventure activities",
        "Local experience",
        "Dinner",
      ],
    },
    {
      day: 4,
      title: "Leisure Day",
      description:
        "Relax and enjoy the destination at your own pace. Optional activities can be arranged on request.",
      activities: [
        "Breakfast",
        "Free time",
        "Optional activities",
        "Dinner",
      ],
    },
    {
      day: 5,
      title: "Departure",
      description:
        "Enjoy breakfast, check out from the hotel and proceed towards your departure point.",
      activities: [
        "Breakfast",
        "Hotel checkout",
        "Transfer",
        "Departure",
      ],
    },
  ];

  const handleDownloadTicket = () => {
    const ticketText = `
MK TRAVELS
================================

BOOKING CONFIRMATION

Booking ID: ${booking.id}
Tour: ${booking.tourName}
Destination: ${booking.destination}

Travel Date: ${booking.travelDate}
Duration: ${booking.duration}
Travellers: ${booking.travellers}

Customer Name: ${booking.customer.name}
Email: ${booking.customer.email}
Phone: ${booking.customer.phone}

Amount Paid: ₹${booking.amount.toLocaleString("en-IN")}
Payment Status: ${booking.paymentStatus}

================================
Thank you for booking with MK TRAVELS.
Have a wonderful journey!
`;

    const blob = new Blob([ticketText], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${booking.id}-ticket.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleCancelBooking = () => {
    setCancelled(true);
    setShowCancel(false);
  };

  return (
    <div className="booking-details-page">

      <div className="booking-details-container">

        {/* Back */}
        <Link
          to="/my-bookings"
          className="booking-details-back"
        >
          <ArrowLeft size={17} />
          Back to My Bookings
        </Link>

        {/* Header */}
        <div className="booking-details-header">

          <div>
            <span className="booking-details-label">
              BOOKING DETAILS
            </span>

            <h1>{booking.tourName}</h1>

            <div className="booking-header-location">
              <MapPin size={15} />
              {booking.destination}
            </div>
          </div>

          <div className="booking-header-actions">

            {!cancelled && (
              <button
                type="button"
                className="download-ticket-button"
                onClick={handleDownloadTicket}
              >
                <Download size={17} />
                Download Ticket
              </button>
            )}

            <span
              className={`details-status ${
                cancelled
                  ? "details-status-cancelled"
                  : booking.status === "Completed"
                  ? "details-status-completed"
                  : "details-status-upcoming"
              }`}
            >
              {cancelled ? "Cancelled" : booking.status}
            </span>

          </div>

        </div>

        {/* Main Layout */}
        <div className="booking-details-layout">

          {/* LEFT */}
          <main className="booking-details-main">

            {/* Booking Summary */}
            <section className="details-card booking-summary-card">

              <div className="summary-image-wrapper">
                <img
                  src={booking.image}
                  alt={booking.tourName}
                />
              </div>

              <div className="summary-tour-content">

                <span className="summary-booking-id">
                  Booking ID: {booking.id}
                </span>

                <h2>{booking.tourName}</h2>

                <div className="summary-location">
                  <MapPin size={15} />
                  {booking.destination}
                </div>

                <div className="summary-info-grid">

                  <div>
                    <CalendarDays size={17} />
                    <span>Travel Date</span>
                    <strong>{booking.travelDate}</strong>
                  </div>

                  <div>
                    <Clock3 size={17} />
                    <span>Duration</span>
                    <strong>{booking.duration}</strong>
                  </div>

                  <div>
                    <Users size={17} />
                    <span>Travellers</span>
                    <strong>{booking.travellers}</strong>
                  </div>

                </div>

              </div>

            </section>

            {/* Traveller Details */}
            <section className="details-card">

              <div className="details-section-title">
                <div className="details-title-icon">
                  <User size={19} />
                </div>

                <div>
                  <h2>Traveller Details</h2>
                  <p>Primary traveller information</p>
                </div>
              </div>

              <div className="traveller-grid">

                <div className="traveller-item">
                  <span>Name</span>
                  <strong>{booking.customer.name}</strong>
                </div>

                <div className="traveller-item">
                  <span>Travellers</span>
                  <strong>
                    {booking.travellers} Person
                    {booking.travellers > 1 ? "s" : ""}
                  </strong>
                </div>

                <div className="traveller-item">
                  <span>Email</span>
                  <strong>{booking.customer.email}</strong>
                </div>

                <div className="traveller-item">
                  <span>Phone</span>
                  <strong>{booking.customer.phone}</strong>
                </div>

              </div>

            </section>

            {/* Tour Overview */}
            <section className="details-card">

              <div className="details-section-title">
                <div className="details-title-icon">
                  <FileText size={19} />
                </div>

                <div>
                  <h2>Tour Overview</h2>
                  <p>Everything included in your trip</p>
                </div>
              </div>

              <div className="overview-grid">

                <div className="overview-item">
                  <CalendarDays size={20} />
                  <div>
                    <span>Duration</span>
                    <strong>{booking.duration}</strong>
                  </div>
                </div>

                <div className="overview-item">
                  <MapPin size={20} />
                  <div>
                    <span>Destination</span>
                    <strong>{booking.destination}</strong>
                  </div>
                </div>

                <div className="overview-item">
                  <Users size={20} />
                  <div>
                    <span>Travellers</span>
                    <strong>{booking.travellers}</strong>
                  </div>
                </div>

                <div className="overview-item">
                  <Ticket size={20} />
                  <div>
                    <span>Booking ID</span>
                    <strong>{booking.id}</strong>
                  </div>
                </div>

              </div>

            </section>

            {/* Hotel */}
            <section className="details-card">

              <div className="details-section-title">
                <div className="details-title-icon">
                  <Hotel size={19} />
                </div>

                <div>
                  <h2>Hotel / Stay</h2>
                  <p>Your accommodation details</p>
                </div>
              </div>

              <div className="service-detail">

                <div className="service-icon">
                  <Hotel size={23} />
                </div>

                <div className="service-content">
                  <h3>Premium 4-Star Hotel</h3>

                  <p>
                    Comfortable rooms with modern amenities
                    and convenient access to major attractions.
                  </p>

                  <div className="service-tags">
                    <span>✓ Breakfast Included</span>
                    <span>✓ Free Wi-Fi</span>
                    <span>✓ Room Service</span>
                  </div>
                </div>

              </div>

            </section>

            {/* Transport */}
            <section className="details-card">

              <div className="details-section-title">
                <div className="details-title-icon">
                  <Bus size={19} />
                </div>

                <div>
                  <h2>Transport</h2>
                  <p>Transfers and local transportation</p>
                </div>
              </div>

              <div className="service-detail">

                <div className="service-icon">
                  <Plane size={23} />
                </div>

                <div className="service-content">
                  <h3>Airport / Station Transfers</h3>

                  <p>
                    Comfortable private transfer between
                    airport, hotel and sightseeing locations.
                  </p>

                  <div className="service-tags">
                    <span>✓ Private Transfer</span>
                    <span>✓ AC Vehicle</span>
                    <span>✓ Local Transport</span>
                  </div>
                </div>

              </div>

            </section>

            {/* Meals */}
            <section className="details-card">

              <div className="details-section-title">
                <div className="details-title-icon">
                  <Utensils size={19} />
                </div>

                <div>
                  <h2>Meals</h2>
                  <p>Food and meal inclusions</p>
                </div>
              </div>

              <div className="meal-grid">

                <div className="meal-item">
                  <span>🍳</span>
                  <div>
                    <strong>Breakfast</strong>
                    <small>Daily</small>
                  </div>
                </div>

                <div className="meal-item">
                  <span>🍱</span>
                  <div>
                    <strong>Lunch</strong>
                    <small>Selected days</small>
                  </div>
                </div>

                <div className="meal-item">
                  <span>🍽️</span>
                  <div>
                    <strong>Dinner</strong>
                    <small>Daily</small>
                  </div>
                </div>

              </div>

            </section>

            {/* Itinerary */}
            <section className="details-card">

              <div className="details-section-title">
                <div className="details-title-icon">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h2>Day-wise Itinerary</h2>
                  <p>Your complete travel schedule</p>
                </div>
              </div>

              <div className="itinerary-list">

                {itinerary.map((item) => (
                  <div
                    className={`itinerary-item ${
                      openDay === item.day
                        ? "itinerary-open"
                        : ""
                    }`}
                    key={item.day}
                  >

                    <button
                      type="button"
                      className="itinerary-header"
                      onClick={() =>
                        setOpenDay(
                          openDay === item.day
                            ? null
                            : item.day
                        )
                      }
                    >

                      <div className="day-number">
                        Day {item.day}
                      </div>

                      <div className="itinerary-heading">
                        <strong>{item.title}</strong>
                      </div>

                      {openDay === item.day ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}

                    </button>

                    {openDay === item.day && (
                      <div className="itinerary-body">

                        <p>{item.description}</p>

                        <div className="activity-list">
                          {item.activities.map(
                            (activity, index) => (
                              <div
                                key={index}
                                className="activity-item"
                              >
                                <CheckCircle2 size={15} />
                                {activity}
                              </div>
                            )
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                ))}

              </div>

            </section>

          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="booking-details-sidebar">

            {/* Payment */}
            <section className="details-card payment-details-card">

              <div className="details-section-title">
                <div className="details-title-icon">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2>Payment Details</h2>
                  <p>Transaction information</p>
                </div>
              </div>

              <div className="payment-detail-row">
                <span>Tour Price</span>
                <strong>
                  ₹{booking.amount.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="payment-detail-row">
                <span>Discount</span>
                <strong className="discount-text">
                  ₹0
                </strong>
              </div>

              <div className="payment-detail-divider" />

              <div className="payment-detail-total">
                <span>Total Paid</span>

                <strong>
                  ₹{booking.amount.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="payment-status-box">
                <CheckCircle2 size={17} />

                <div>
                  <strong>{booking.paymentStatus}</strong>
                  <span>Payment successfully received</span>
                </div>
              </div>

            </section>

            {/* Contact */}
            <section className="details-card contact-card">

              <h2>Need Help?</h2>

              <p>
                Our travel experts are available to help
                you with your booking.
              </p>

              <a href="tel:+919876543210">
                <Phone size={16} />
                +91 98765 43210
              </a>

              <a href="mailto:support@mktravels.com">
                <Mail size={16} />
                support@mktravels.com
              </a>

            </section>

            {/* Protection */}
            <section className="booking-protection">

              <ShieldCheck size={22} />

              <div>
                <strong>Your booking is protected</strong>

                <p>
                  Your booking information is secure with
                  MK TRAVELS.
                </p>
              </div>

            </section>

            {/* Cancel */}
            {!cancelled &&
              booking.status !== "Completed" && (
                <button
                  type="button"
                  className="cancel-booking-button"
                  onClick={() => setShowCancel(true)}
                >
                  <Trash2 size={16} />
                  Cancel Booking
                </button>
              )}

          </aside>

        </div>
      </div>

      {/* Cancel Modal */}
      {showCancel && (
        <div className="cancel-modal-overlay">

          <div className="cancel-modal">

            <button
              type="button"
              className="modal-close"
              onClick={() => setShowCancel(false)}
            >
              <X size={19} />
            </button>

            <div className="cancel-modal-icon">
              <Trash2 size={25} />
            </div>

            <h2>Cancel Booking?</h2>

            <p>
              Are you sure you want to cancel this booking?
              This action cannot be undone.
            </p>

            <div className="cancel-modal-actions">

              <button
                type="button"
                className="keep-booking-button"
                onClick={() => setShowCancel(false)}
              >
                Keep Booking
              </button>

              <button
                type="button"
                className="confirm-cancel-button"
                onClick={handleCancelBooking}
              >
                Yes, Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default BookingDetails;