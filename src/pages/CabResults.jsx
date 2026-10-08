import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Car,
  MapPin,
  CalendarDays,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  Star,
  ChevronDown,
} from "lucide-react";

import "./CabResults.css";

const cabList = [
  {
    id: 1,
    name: "Sedan",
    vehicle: "Dzire / Etios",
    seats: 4,
    rating: 4.7,
    price: 1499,
    features: ["AC", "4 Seats", "Driver Included"],
  },
  {
    id: 2,
    name: "SUV",
    vehicle: "Ertiga / Innova",
    seats: 6,
    rating: 4.8,
    price: 2199,
    features: ["AC", "6 Seats", "Driver Included"],
  },
  {
    id: 3,
    name: "Premium SUV",
    vehicle: "Innova Crysta",
    seats: 6,
    rating: 4.9,
    price: 2999,
    features: ["AC", "6 Seats", "Premium"],
  },
  {
    id: 4,
    name: "Tempo Traveller",
    vehicle: "12 Seater",
    seats: 12,
    rating: 4.8,
    price: 4999,
    features: ["AC", "12 Seats", "Group Travel"],
  },
];

function CabResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type") || "Outstation";
  const initialFrom = searchParams.get("from") || "";
  const initialTo = searchParams.get("to") || "";
  const initialDate = searchParams.get("date") || "";
  const initialTime = searchParams.get("time") || "10:00";
  const initialTravellers = searchParams.get("travellers") || "1";

  const handleSearch = () => {
    if (!initialFrom) {
      alert("Please enter pickup location");
      return;
    }

    if (type !== "Rental" && !initialTo) {
      alert("Please enter destination");
      return;
    }

    setSearchParams({
      type,
      from: initialFrom,
      to: initialTo,
      date: initialDate,
      time: initialTime,
      travellers: initialTravellers,
    });
  };

  const handleModifySearch = () => {
    navigate(
      `/?service=cab&type=${encodeURIComponent(
        type
      )}&from=${encodeURIComponent(
        initialFrom
      )}&to=${encodeURIComponent(
        initialTo
      )}&date=${encodeURIComponent(
        initialDate
      )}&time=${encodeURIComponent(
        initialTime
      )}&travellers=${encodeURIComponent(
        initialTravellers
      )}`
    );
  };

  return (
    <div className="cab-results-page">
      <div className="cab-results-container">

        {/* BACK */}
        <button
          type="button"
          className="cab-back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* ================= SEARCH BOX ================= */}
        <div className="cab-search-box">

          {/* Trip Type */}
          <div className="cab-search-field trip-type-field">
            <label>TRIP TYPE</label>

            <div className="cab-field-value">
              <Car size={18} />

              <select
                value={type}
                onChange={(e) =>
                  setSearchParams({
                    type: e.target.value,
                    from: initialFrom,
                    to: initialTo,
                    date: initialDate,
                    time: initialTime,
                    travellers: initialTravellers,
                  })
                }
              >
                <option value="Outstation">Outstation</option>
                <option value="Airport">Airport</option>
                <option value="Rental">Rental</option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>

          {/* From */}
          <div className="cab-search-field">
            <label>FROM</label>

            <div className="cab-field-value">
              <MapPin size={17} />

              <input
                value={initialFrom}
                placeholder="Enter pickup location"
                onChange={(e) =>
                  setSearchParams({
                    type,
                    from: e.target.value,
                    to: initialTo,
                    date: initialDate,
                    time: initialTime,
                    travellers: initialTravellers,
                  })
                }
              />
            </div>
          </div>

          {/* To */}
          <div className="cab-search-field">
            <label>TO</label>

            <div className="cab-field-value">
              <MapPin size={17} />

              <input
                value={initialTo}
                placeholder="Enter destination"
                onChange={(e) =>
                  setSearchParams({
                    type,
                    from: initialFrom,
                    to: e.target.value,
                    date: initialDate,
                    time: initialTime,
                    travellers: initialTravellers,
                  })
                }
              />
            </div>
          </div>

          {/* Add Stops */}
          <button
            type="button"
            className="add-stops-btn"
            onClick={() => alert("Add Stops feature")}
          >
            <Plus size={16} />
            ADD STOPS
          </button>

          {/* Pickup Date */}
          <div className="cab-search-field">
            <label>PICK-UP DATE</label>

            <div className="cab-field-value">
              <CalendarDays size={17} />

              <input
                type="date"
                value={initialDate}
                onChange={(e) =>
                  setSearchParams({
                    type,
                    from: initialFrom,
                    to: initialTo,
                    date: e.target.value,
                    time: initialTime,
                    travellers: initialTravellers,
                  })
                }
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="cab-search-field">
            <label>PICK-UP TIME</label>

            <div className="cab-field-value">
              <Clock size={17} />

              <input
                type="time"
                value={initialTime}
                onChange={(e) =>
                  setSearchParams({
                    type,
                    from: initialFrom,
                    to: initialTo,
                    date: initialDate,
                    time: e.target.value,
                    travellers: initialTravellers,
                  })
                }
              />
            </div>
          </div>

          {/* Travellers */}
          <div className="cab-search-field">
            <label>TRAVELLERS</label>

            <div className="cab-field-value">
              <Users size={17} />

              <select
                value={initialTravellers}
                onChange={(e) =>
                  setSearchParams({
                    type,
                    from: initialFrom,
                    to: initialTo,
                    date: initialDate,
                    time: initialTime,
                    travellers: e.target.value,
                  })
                }
              >
                <option value="1">1 Traveller</option>
                <option value="2">2 Travellers</option>
                <option value="3">3 Travellers</option>
                <option value="4">4 Travellers</option>
                <option value="5">5 Travellers</option>
                <option value="6">6 Travellers</option>
                <option value="7">7 Travellers</option>
                <option value="8">8 Travellers</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <button
            type="button"
            className="cab-search-main-btn"
            onClick={handleSearch}
          >
            <Search size={18} />
            SEARCH
          </button>
        </div>

        {/* ================= RESULT HEADER ================= */}
        <div className="cab-result-top">

          <div>
            <h1>
              {initialFrom || "Pickup"}{" "}
              {initialTo ? `to ${initialTo}` : ""} Cabs
            </h1>

            <p>
              {type} • {initialDate || "Date not selected"} •{" "}
              {initialTime || "10:00"}
            </p>
          </div>

          <button
            type="button"
            className="modify-search-btn"
            onClick={handleModifySearch}
          >
            Modify Search
          </button>
        </div>

        {/* ================= RESULTS ================= */}
        <div className="cab-results-layout">

          {/* FILTER */}
          <aside className="cab-filter-box">
            <h3>Filters</h3>

            <div className="filter-section">
              <h4>Cab Type</h4>

              <label>
                <input type="checkbox" />
                Sedan
              </label>

              <label>
                <input type="checkbox" />
                SUV
              </label>

              <label>
                <input type="checkbox" />
                Premium
              </label>

              <label>
                <input type="checkbox" />
                Tempo Traveller
              </label>
            </div>

            <hr />

            <div className="filter-section">
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

            <hr />

            <div className="filter-section">
              <h4>Rating</h4>

              <label>
                <input type="checkbox" />
                4★ & above
              </label>

              <label>
                <input type="checkbox" />
                3★ & above
              </label>
            </div>
          </aside>

          {/* CAB LIST */}
          <main className="cab-list">

            <div className="cab-list-heading">
              <strong>{cabList.length} Cabs Available</strong>

              <button type="button">
                Sort by: Recommended
                <ChevronDown size={15} />
              </button>
            </div>

            {cabList.map((cab) => (
              <div className="cab-result-card" key={cab.id}>

                <div className="cab-result-icon">
                  <Car size={36} />
                </div>

                <div className="cab-result-info">

                  <div className="cab-name-row">
                    <h2>{cab.name}</h2>

                    <span className="cab-rating">
                      <Star size={12} fill="currentColor" />
                      {cab.rating}
                    </span>
                  </div>

                  <p className="cab-vehicle">
                    {cab.vehicle}
                  </p>

                  <div className="cab-route">
                    <MapPin size={14} />

                    <span>
                      {initialFrom || "Pickup"}
                    </span>

                    <ArrowRight size={14} />

                    <span>
                      {initialTo || "Destination"}
                    </span>
                  </div>

                  <div className="cab-features">
                    {cab.features.map((feature) => (
                      <span key={feature}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="cab-price-box">

                  <span>Starting from</span>

                  <strong>
                    ₹{cab.price.toLocaleString("en-IN")}
                  </strong>

                  <small>per trip</small>

                  <button
                    type="button"
                    onClick={() =>
                      alert(`${cab.name} selected`)
                    }
                  >
                    SELECT CAB
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

export default CabResults;