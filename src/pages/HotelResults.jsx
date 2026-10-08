import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Hotel,
  MapPin,
  CalendarDays,
  Users,
  Search,
  ArrowLeft,
  Star,
  ChevronDown,
} from "lucide-react";

import "./HotelResults.css";

const hotelList = [
  {
    id: 1,
    name: "The Grand Palace",
    location: "City Center",
    rating: 4.7,
    reviews: 1240,
    price: 2499,
    oldPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80",
    features: ["Free WiFi", "Breakfast", "AC"],
  },
  {
    id: 2,
    name: "Royal Comfort Hotel",
    location: "Main Market",
    rating: 4.5,
    reviews: 876,
    price: 1899,
    oldPrice: 2499,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=700&q=80",
    features: ["Free WiFi", "Parking", "AC"],
  },
  {
    id: 3,
    name: "Holiday Inn",
    location: "Near Tourist Area",
    rating: 4.8,
    reviews: 1560,
    price: 3299,
    oldPrice: 4199,
    image:
      "https://images.unsplash.com/photo-1601890944667-3f7c9c1a7e8c?auto=format&fit=crop&w=700&q=80",
    features: ["Pool", "Breakfast", "Free WiFi"],
  },
];

function HotelResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const destination =
    searchParams.get("destination") || "";

  const checkIn =
    searchParams.get("checkIn") || "";

  const checkOut =
    searchParams.get("checkOut") || "";

  const guests =
    searchParams.get("guests") || "2 Adults, 1 Room";

  const handleSearch = () => {
    if (!destination) {
      alert("Please enter city, area or property");
      return;
    }

    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date");
      return;
    }

    setSearchParams({
      destination,
      checkIn,
      checkOut,
      guests,
    });
  };

  const handleModifySearch = () => {
    navigate(
      `/?service=hotel&destination=${encodeURIComponent(
        destination
      )}&checkIn=${encodeURIComponent(
        checkIn
      )}&checkOut=${encodeURIComponent(
        checkOut
      )}&guests=${encodeURIComponent(guests)}`
    );
  };

  return (
    <div className="hotel-results-page">
      <div className="hotel-results-container">

        {/* BACK */}
        <button
          type="button"
          className="hotel-back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* ================= HOTEL SEARCH ================= */}
        <div className="hotel-search-box">

          {/* Destination */}
          <div className="hotel-search-field destination-field">
            <label>CITY, AREA or PROPERTY</label>

            <div className="hotel-field-value">
              <MapPin size={18} />

              <input
                type="text"
                value={destination}
                placeholder="Enter city, area or property"
                onChange={(e) =>
                  setSearchParams({
                    destination: e.target.value,
                    checkIn,
                    checkOut,
                    guests,
                  })
                }
              />
            </div>
          </div>

          {/* Check In */}
          <div className="hotel-search-field">
            <label>CHECK-IN</label>

            <div className="hotel-field-value">
              <CalendarDays size={17} />

              <input
                type="date"
                value={checkIn}
                onChange={(e) =>
                  setSearchParams({
                    destination,
                    checkIn: e.target.value,
                    checkOut,
                    guests,
                  })
                }
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="hotel-search-field">
            <label>CHECK-OUT</label>

            <div className="hotel-field-value">
              <CalendarDays size={17} />

              <input
                type="date"
                value={checkOut}
                onChange={(e) =>
                  setSearchParams({
                    destination,
                    checkIn,
                    checkOut: e.target.value,
                    guests,
                  })
                }
              />
            </div>
          </div>

          {/* Guests */}
          <div className="hotel-search-field">
            <label>ROOMS & GUESTS</label>

            <div className="hotel-field-value">
              <Users size={17} />

              <select
                value={guests}
                onChange={(e) =>
                  setSearchParams({
                    destination,
                    checkIn,
                    checkOut,
                    guests: e.target.value,
                  })
                }
              >
                <option value="1 Adult, 1 Room">
                  1 Adult, 1 Room
                </option>

                <option value="2 Adults, 1 Room">
                  2 Adults, 1 Room
                </option>

                <option value="2 Adults, 2 Rooms">
                  2 Adults, 2 Rooms
                </option>

                <option value="3 Adults, 1 Room">
                  3 Adults, 1 Room
                </option>

                <option value="4 Adults, 2 Rooms">
                  4 Adults, 2 Rooms
                </option>

                <option value="4 Adults, 3 Rooms">
                  4 Adults, 3 Rooms
                </option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>

          {/* Search */}
          <button
            type="button"
            className="hotel-search-main-btn"
            onClick={handleSearch}
          >
            <Search size={18} />
            SEARCH
          </button>
        </div>

        {/* ================= HEADER ================= */}
        <div className="hotel-result-top">

          <div>
            <h1>
              Hotels in{" "}
              {destination || "Your Destination"}
            </h1>

            <p>
              {checkIn || "Check-in"} →{" "}
              {checkOut || "Check-out"} • {guests}
            </p>
          </div>

          <button
            type="button"
            className="hotel-modify-btn"
            onClick={handleModifySearch}
          >
            Modify Search
          </button>
        </div>

        {/* ================= RESULTS ================= */}
        <div className="hotel-results-layout">

          {/* FILTER */}
          <aside className="hotel-filter-box">

            <h3>Filters</h3>

            <div className="hotel-filter-section">
              <h4>Property Type</h4>

              <label>
                <input type="checkbox" />
                Hotel
              </label>

              <label>
                <input type="checkbox" />
                Resort
              </label>

              <label>
                <input type="checkbox" />
                Guest House
              </label>
            </div>

            <hr />

            <div className="hotel-filter-section">
              <h4>Star Rating</h4>

              <label>
                <input type="checkbox" />
                5 Star
              </label>

              <label>
                <input type="checkbox" />
                4 Star
              </label>

              <label>
                <input type="checkbox" />
                3 Star
              </label>
            </div>

            <hr />

            <div className="hotel-filter-section">
              <h4>Price</h4>

              <label>
                <input type="checkbox" />
                Under ₹2,000
              </label>

              <label>
                <input type="checkbox" />
                ₹2,000 - ₹3,000
              </label>

              <label>
                <input type="checkbox" />
                Above ₹3,000
              </label>
            </div>

          </aside>

          {/* HOTEL LIST */}
          <main className="hotel-list">

            <div className="hotel-list-heading">
              <strong>
                {hotelList.length} Hotels Available
              </strong>

              <button type="button">
                Sort by: Recommended
                <ChevronDown size={15} />
              </button>
            </div>

            {hotelList.map((hotel) => (
              <div
                className="hotel-result-card"
                key={hotel.id}
              >

                <img
                  src={hotel.image}
                  alt={hotel.name}
                />

                <div className="hotel-result-info">

                  <div className="hotel-title-row">

                    <h2>{hotel.name}</h2>

                    <span className="hotel-rating">
                      <Star
                        size={12}
                        fill="currentColor"
                      />
                      {hotel.rating}
                    </span>

                  </div>

                  <p className="hotel-location">
                    <MapPin size={14} />
                    {hotel.location}
                  </p>

                  <p className="hotel-reviews">
                    {hotel.reviews.toLocaleString("en-IN")}{" "}
                    reviews
                  </p>

                  <div className="hotel-features">
                    {hotel.features.map((feature) => (
                      <span key={feature}>
                        {feature}
                      </span>
                    ))}
                  </div>

                </div>

                <div className="hotel-price-box">

                  <span>1 night</span>

                  <del>
                    ₹{hotel.oldPrice.toLocaleString("en-IN")}
                  </del>

                  <strong>
                    ₹{hotel.price.toLocaleString("en-IN")}
                  </strong>

                  <small>
                    + taxes & fees
                  </small>

                  <button
                    type="button"
                    onClick={() =>
                      alert(`${hotel.name} selected`)
                    }
                  >
                    VIEW ROOM
                  </button>

                </div>

              </div>
            ))}

          </main>
        </div>

      </div>
    </div>
  );
}

export default HotelResults;