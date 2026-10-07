import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  Ticket,
  Users,
  X,
} from "lucide-react";

import bookings from "../data/bookings";
import "./MyBookings.css";

const filters = [
  "All",
  "Upcoming",
  "Completed",
  "Cancelled",
];

function MyBookings() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesFilter =
        activeFilter === "All" ||
        booking.status === activeFilter;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        booking.id.toLowerCase().includes(searchText) ||
        booking.tourName.toLowerCase().includes(searchText) ||
        booking.destination.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Upcoming":
        return "status-upcoming";

      case "Completed":
        return "status-completed";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">

        {/* Header */}
        <div className="bookings-header">
          <div>
            <span className="bookings-label">
              MANAGE YOUR TRIPS
            </span>

            <h1>My Bookings</h1>

            <p>
              View, manage and track all your travel bookings
              in one place.
            </p>
          </div>

          <Link
            to="/tours"
            className="book-new-trip-button"
          >
            Explore Tours
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Search */}
        <div className="booking-search-card">
          <div className="booking-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search by booking ID, tour or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="booking-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={
                activeFilter === filter
                  ? "booking-filter active"
                  : "booking-filter"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}

              <span>
                {filter === "All"
                  ? bookings.length
                  : bookings.filter(
                      (booking) =>
                        booking.status === filter
                    ).length}
              </span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="booking-results-header">
          <h2>
            {activeFilter === "All"
              ? "All Bookings"
              : `${activeFilter} Bookings`}
          </h2>

          <span>
            {filteredBookings.length} booking
            {filteredBookings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Booking List */}
        {filteredBookings.length > 0 ? (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div
                className="booking-card"
                key={booking.id}
              >
                {/* Image */}
                <div className="booking-image-wrapper">
                  <img
                    src={booking.image}
                    alt={booking.tourName}
                    className="booking-image"
                  />

                  <span
                    className={`booking-status ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Content */}
                <div className="booking-content">

                  <div className="booking-main-info">
                    <div>
                      <span className="booking-id">
                        Booking ID: {booking.id}
                      </span>

                      <h3>{booking.tourName}</h3>

                      <div className="booking-location">
                        <MapPin size={15} />
                        {booking.destination}
                      </div>
                    </div>
                  </div>

                  <div className="booking-meta">

                    <div className="booking-meta-item">
                      <CalendarDays size={16} />

                      <div>
                        <span>Travel Date</span>
                        <strong>
                          {booking.travelDate}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-meta-item">
                      <Clock3 size={16} />

                      <div>
                        <span>Duration</span>
                        <strong>
                          {booking.duration}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-meta-item">
                      <Users size={16} />

                      <div>
                        <span>Travellers</span>
                        <strong>
                          {booking.travellers}
                        </strong>
                      </div>
                    </div>

                  </div>

                  <div className="booking-bottom">

                    <div className="booking-price">
                      <span>Total Amount</span>

                      <strong>
                        ₹
                        {booking.amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <small>
                        {booking.paymentStatus}
                      </small>
                    </div>

                    <Link
                      to={`/booking-details/${booking.id}`}
                      state={{ booking }}
                      className="view-booking-button"
                    >
                      <Ticket size={16} />
                      View Details
                      <ChevronRight size={16} />
                    </Link>

                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bookings-empty">

            <div className="empty-icon">
              <Ticket size={34} />
            </div>

            <h3>No bookings found</h3>

            <p>
              {search
                ? "Try searching with another booking ID, tour or destination."
                : "You don't have any bookings in this category."}
            </p>

            <Link
              to="/tours"
              className="empty-button"
            >
              Explore Tours
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;