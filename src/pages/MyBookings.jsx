import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  Hotel,
  MapPin,
  Search,
  ShieldCheck,
  Ticket,
  XCircle,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { apiRequest } from "../api/api";
import "./MyBookings.css";

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"];

function getBookingId(booking) {
  return String(booking?._id || booking?.id || "");
}

function getBookingReference(booking) {
  return String(
    booking?.bookingReference ||
      booking?.reference ||
      booking?._id ||
      booking?.id ||
      "N/A"
  );
}

function getBookingType(booking) {
  const value = String(
    booking?.type ||
      booking?.service ||
      booking?.bookingType ||
      ""
  ).toLowerCase();

  if (value.includes("bus")) return "Bus";
  if (value.includes("hotel")) return "Hotel";
  if (value.includes("cab") || value.includes("car")) return "Cab";
  if (value.includes("insurance")) return "Insurance";

  const details = booking?.details || {};

  if (booking?.checkIn || booking?.hotelName || details?.checkIn) {
    return "Hotel";
  }

  if (booking?.busName || booking?.seatType || details?.busName) {
    return "Bus";
  }

  if (booking?.cabName || booking?.vehicleName || details?.vehicleName) {
    return "Cab";
  }

  return "Travel";
}

function getBookingTitle(booking) {
  const details = booking?.details || {};

  return (
    booking?.title ||
    booking?.tourName ||
    booking?.hotelName ||
    booking?.busName ||
    booking?.cabName ||
    booking?.vehicleName ||
    details?.title ||
    details?.hotelName ||
    details?.busName ||
    details?.vehicleName ||
    `${getBookingType(booking)} Booking`
  );
}

function getBookingDate(booking) {
  const details = booking?.details || {};

  return (
    booking?.travelDate ||
    booking?.date ||
    booking?.checkIn ||
    booking?.departureDate ||
    details?.travelDate ||
    details?.checkIn ||
    ""
  );
}

function getBookingStatus(booking) {
  const status = String(booking?.status || "").toLowerCase();

  if (status.includes("cancel")) return "Cancelled";
  if (status.includes("complete")) return "Completed";

  const date = getBookingDate(booking);

  if (date) {
    const dateOnly = String(date).slice(0, 10);
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    if (dateOnly < today) return "Completed";
  }

  return "Upcoming";
}

function formatDate(date) {
  if (!date) return "Date not available";

  const value = String(date).slice(0, 10);
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  const amount = Number(value ?? 0);

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function getTypeIcon(type) {
  switch (type) {
    case "Bus":
      return Ticket;
    case "Hotel":
      return Hotel;
    case "Cab":
      return CarFront;
    case "Insurance":
      return ShieldCheck;
    default:
      return MapPin;
  }
}

function normalizeBooking(booking) {
  const details =
    booking?.details && typeof booking.details === "object"
      ? booking.details
      : {};

  const displayType = getBookingType(booking);
  const displayDate = getBookingDate(booking);

  return {
    ...booking,
    id: getBookingId(booking),
    bookingReference: getBookingReference(booking),
    displayType,
    displayTitle: getBookingTitle(booking),
    displayStatus: getBookingStatus(booking),
    displayDate,
    from:
      booking?.from ||
      details?.from ||
      details?.source ||
      details?.origin ||
      "",
    to:
      booking?.to ||
      details?.to ||
      details?.destination ||
      "",
    destination:
      booking?.destination ||
      details?.destination ||
      booking?.location ||
      "",
    travellers:
      booking?.travellers ??
      booking?.guests ??
      booking?.seats ??
      details?.travellers ??
      details?.guests ??
      details?.seats ??
      1,
    amount:
      booking?.amount ??
      booking?.totalPrice ??
      booking?.price ??
      details?.amount ??
      0,
  };
}

function MyBookings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState("");
  const [error, setError] = useState("");

  const loadBookings = useCallback(async ({ showLoading = false } = {}) => {
    if (showLoading) {
      setRefreshing(true);
    }

    setError("");

    try {
      // Check the current login session using the backend cookie.
      const meResponse = await apiRequest("/auth/me");
      const currentUser = meResponse?.user || meResponse;

      if (!currentUser?._id && !currentUser?.id && !currentUser?.email) {
        navigate("/login", {
          replace: true,
          state: { from: "/my-bookings" },
        });
        return;
      }

      setUser(currentUser);

      // The backend returns only bookings belonging to this authenticated user.
      const response = await apiRequest("/bookings");

      const bookingList = Array.isArray(response)
        ? response
        : Array.isArray(response?.bookings)
          ? response.bookings
          : [];

      const normalized = bookingList
        .map(normalizeBooking)
        .sort((a, b) => {
          const dateA = new Date(
            a.createdAt || a.displayDate || 0
          ).getTime();

          const dateB = new Date(
            b.createdAt || b.displayDate || 0
          ).getTime();

          return dateB - dateA;
        });

      setBookings(normalized);
    } catch (err) {
      if (
        err?.status === 401 ||
        /please login|session expired|invalid authentication/i.test(
          err?.message || ""
        )
      ) {
        setUser(null);
        navigate("/login", {
          replace: true,
          state: { from: "/my-bookings" },
        });
        return;
      }

      setError(
        err?.message ||
          "Bookings load nahi ho paayin. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesFilter =
        activeFilter === "All" ||
        booking.displayStatus === activeFilter;

      const searchableText = [
        booking.id,
        booking.bookingReference,
        booking.displayTitle,
        booking.destination,
        booking.from,
        booking.to,
        booking.displayType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableText.includes(query);
    });
  }, [bookings, activeFilter, searchText]);

  const summary = useMemo(
    () => ({
      total: bookings.length,
      upcoming: bookings.filter(
        (booking) => booking.displayStatus === "Upcoming"
      ).length,
      completed: bookings.filter(
        (booking) => booking.displayStatus === "Completed"
      ).length,
      cancelled: bookings.filter(
        (booking) => booking.displayStatus === "Cancelled"
      ).length,
    }),
    [bookings]
  );

  const handleCancelBooking = async (booking) => {
    if (booking.displayStatus !== "Upcoming") {
      window.alert("Only upcoming bookings can be cancelled.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${booking.bookingReference}?`
    );

    if (!confirmed) return;

    setCancellingId(booking.id);
    setError("");

    try {
      // Cancellation is processed by the backend, not localStorage.
      await apiRequest(
        `/bookings/${encodeURIComponent(booking.id)}/cancel`,
        {
          method: "PATCH",
        }
      );

      await loadBookings();

      window.alert("Booking cancellation request processed.");
    } catch (err) {
      setError(
        err?.message ||
          "Booking cancel nahi ho paayi. Please try again."
      );
    } finally {
      setCancellingId("");
    }
  };

  if (loading) {
    return (
      <div className="my-bookings-page">
        <div className="my-bookings-loading">
          <RefreshCw size={22} className="my-bookings-spin" />
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-bookings-page">
        <div className="my-bookings-loading">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">
        <div className="my-bookings-header">
          <button
            type="button"
            className="my-bookings-back"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>

          <div className="my-bookings-title-row">
            <div>
              <span className="my-bookings-eyebrow">
                YOUR TRAVEL DASHBOARD
              </span>

              <h1>My Bookings</h1>

              <p>
                Manage your trips, reservations and travel insurance.
              </p>
            </div>

            <button
              type="button"
              className="my-bookings-refresh"
              onClick={() => loadBookings({ showLoading: true })}
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
                className={refreshing ? "my-bookings-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="my-bookings-error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => loadBookings({ showLoading: true })}
            >
              Try Again
            </button>
          </div>
        )}

        <div className="my-bookings-stats">
          <div className="my-booking-stat">
            <div className="my-booking-stat-icon total">
              <Wallet size={21} />
            </div>
            <div>
              <span>Total Bookings</span>
              <strong>{summary.total}</strong>
            </div>
          </div>

          <div className="my-booking-stat">
            <div className="my-booking-stat-icon upcoming">
              <Clock3 size={21} />
            </div>
            <div>
              <span>Upcoming</span>
              <strong>{summary.upcoming}</strong>
            </div>
          </div>

          <div className="my-booking-stat">
            <div className="my-booking-stat-icon completed">
              <CheckCircle2 size={21} />
            </div>
            <div>
              <span>Completed</span>
              <strong>{summary.completed}</strong>
            </div>
          </div>

          <div className="my-booking-stat">
            <div className="my-booking-stat-icon cancelled">
              <XCircle size={21} />
            </div>
            <div>
              <span>Cancelled</span>
              <strong>{summary.cancelled}</strong>
            </div>
          </div>
        </div>

        <section className="my-bookings-panel">
          <div className="my-bookings-panel-heading">
            <div>
              <h2>Your Trips</h2>
              <p>
                {filteredBookings.length} booking
                {filteredBookings.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <label className="my-bookings-search">
              <Search size={17} />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search booking or destination"
                aria-label="Search bookings"
              />
            </label>
          </div>

          <div className="my-bookings-filters">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                <span>
                  {filter === "All"
                    ? summary.total
                    : summary[filter.toLowerCase()]}
                </span>
              </button>
            ))}
          </div>

          {filteredBookings.length > 0 ? (
            <div className="my-bookings-list">
              {filteredBookings.map((booking) => {
                const Icon = getTypeIcon(booking.displayType);
                const statusClass = booking.displayStatus.toLowerCase();

                const routeText =
                  booking.from && booking.to
                    ? `${booking.from} → ${booking.to}`
                    : booking.destination || booking.location || "";

                const travellerCount = Number(booking.travellers || 1);

                return (
                  <article className="my-booking-card" key={booking.id}>
                    <div className="my-booking-card-main">
                      <div className="my-booking-type-icon">
                        <Icon size={24} />
                      </div>

                      <div className="my-booking-info">
                        <div className="my-booking-type-line">
                          <span>{booking.displayType}</span>
                          <span
                            className={`my-booking-status ${statusClass}`}
                          >
                            {booking.displayStatus}
                          </span>
                        </div>

                        <h3>{booking.displayTitle}</h3>

                        {routeText && (
                          <p className="my-booking-route">
                            <MapPin size={15} />
                            {routeText}
                          </p>
                        )}

                        <div className="my-booking-meta">
                          <span>
                            <CalendarDays size={15} />
                            {formatDate(booking.displayDate)}
                          </span>

                          <span>
                            <UsersIcon />
                            {travellerCount}{" "}
                            {travellerCount === 1
                              ? "Traveller"
                              : "Travellers"}
                          </span>
                        </div>

                        <p className="my-booking-reference">
                          Booking ID:{" "}
                          <strong>{booking.bookingReference}</strong>
                        </p>
                      </div>

                      <div className="my-booking-price">
                        <span>Total Amount</span>
                        <strong>{formatCurrency(booking.amount)}</strong>

                        <span
                          className={`my-booking-payment ${
                            String(booking.paymentStatus || "")
                              .toLowerCase()
                              .includes("paid")
                              ? "paid"
                              : ""
                          }`}
                        >
                          {booking.paymentStatus || "Payment status unavailable"}
                        </span>
                      </div>
                    </div>

                    <div className="my-booking-card-footer">
                      <span>
                        Booked on{" "}
                        {formatDate(
                          booking.createdAt
                            ? String(booking.createdAt).slice(0, 10)
                            : ""
                        )}
                      </span>

                      <div className="my-booking-actions">
                        {booking.displayStatus === "Upcoming" && (
                          <button
                            type="button"
                            className="my-booking-cancel"
                            disabled={cancellingId === booking.id}
                            onClick={() => handleCancelBooking(booking)}
                          >
                            {cancellingId === booking.id
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </button>
                        )}

                        <Link
                          to={`/booking-details/${encodeURIComponent(
                            booking.id
                          )}`}
                          state={{ booking }}
                          className="my-booking-details"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="my-bookings-empty">
              <div className="my-bookings-empty-icon">
                <CalendarDays size={32} />
              </div>

              <h3>
                {bookings.length === 0
                  ? "No bookings yet"
                  : "No matching bookings"}
              </h3>

              <p>
                {bookings.length === 0
                  ? "Your bookings will appear here once they are saved to your account."
                  : "Try another search term or change the selected filter."}
              </p>

              {bookings.length === 0 ? (
                <Link to="/" className="my-bookings-explore">
                  Explore Trips
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <button
                  type="button"
                  className="my-bookings-explore"
                  onClick={() => {
                    setSearchText("");
                    setActiveFilter("All");
                  }}
                >
                  Clear Search and Filters
                </button>
              )}
            </div>
          )}
        </section>

        <div className="my-bookings-help">
          <ShieldCheck size={19} />
          <p>
            Keep your booking ID handy when contacting customer support.
            Refunds, when applicable, are subject to the booking provider's
            cancellation policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function UsersIcon() {
  return <span className="my-bookings-users-symbol">♙</span>;
}

export default MyBookings;