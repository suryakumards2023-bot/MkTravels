import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  MapPin,
  CalendarDays,
  Users,
  Search,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

import "./InsuranceResults.css";

const insurancePlans = [
  {
    id: 1,
    name: "Basic Travel Cover",
    price: 299,
    coverage: "₹5 Lakh",
    features: [
      "Medical Emergency",
      "Trip Cancellation",
      "Baggage Protection",
    ],
  },
  {
    id: 2,
    name: "Standard Travel Cover",
    price: 599,
    coverage: "₹15 Lakh",
    popular: true,
    features: [
      "Medical Emergency",
      "Trip Cancellation",
      "Baggage Protection",
      "Flight Delay",
    ],
  },
  {
    id: 3,
    name: "Premium Travel Cover",
    price: 999,
    coverage: "₹50 Lakh",
    features: [
      "Medical Emergency",
      "Trip Cancellation",
      "Baggage Protection",
      "Flight Delay",
      "Personal Accident",
    ],
  },
];

function InsuranceResults() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const type =
    searchParams.get("type") ||
    "Domestic Travel";

  const destination =
    searchParams.get("destination") || "";

  const startDate =
    searchParams.get("date") || "";

  const endDate =
    searchParams.get("endDate") || "";

  const travellers =
    searchParams.get("travellers") || "1";

  const handleSearch = () => {
    if (!destination) {
      alert("Please enter state / region");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select start and end date");
      return;
    }

    if (endDate < startDate) {
      alert("End date must be after start date");
      return;
    }

    setSearchParams({
      type,
      destination,
      date: startDate,
      endDate,
      travellers,
    });
  };

  const handleModifySearch = () => {
    navigate(
      `/?service=insurance&type=${encodeURIComponent(
        type
      )}&destination=${encodeURIComponent(
        destination
      )}&date=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(
        endDate
      )}&travellers=${encodeURIComponent(
        travellers
      )}`
    );
  };

  return (
    <div className="insurance-results-page">
      <div className="insurance-results-container">

        {/* BACK */}
        <button
          type="button"
          className="insurance-back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* ================= SEARCH BOX ================= */}
        <div className="insurance-search-box">

          {/* Travel Type */}
          <div className="insurance-search-field">
            <label>TRAVEL TYPE</label>

            <div className="insurance-field-value">
              <ShieldCheck size={17} />

              <select
                value={type}
                onChange={(e) =>
                  setSearchParams({
                    type: e.target.value,
                    destination,
                    date: startDate,
                    endDate,
                    travellers,
                  })
                }
              >
                <option value="Domestic Travel">
                  Domestic Travel
                </option>

                <option value="International Travel">
                  International Travel
                </option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>

          {/* State / Region */}
          <div className="insurance-search-field insurance-destination-field">
            <label>STATE / REGION</label>

            <div className="insurance-field-value">
              <MapPin size={17} />

              <input
                type="text"
                value={destination}
                placeholder="e.g. Mumbai"
                onChange={(e) =>
                  setSearchParams({
                    type,
                    destination: e.target.value,
                    date: startDate,
                    endDate,
                    travellers,
                  })
                }
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="insurance-search-field">
            <label>START DATE</label>

            <div className="insurance-field-value">
              <CalendarDays size={17} />

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setSearchParams({
                    type,
                    destination,
                    date: e.target.value,
                    endDate,
                    travellers,
                  })
                }
              />
            </div>
          </div>

          {/* End Date */}
          <div className="insurance-search-field">
            <label>END DATE</label>

            <div className="insurance-field-value">
              <CalendarDays size={17} />

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setSearchParams({
                    type,
                    destination,
                    date: startDate,
                    endDate: e.target.value,
                    travellers,
                  })
                }
              />
            </div>
          </div>

          {/* Travellers */}
          <div className="insurance-search-field">
            <label>NO. OF TRAVELLERS</label>

            <div className="insurance-field-value">
              <Users size={17} />

              <select
                value={travellers}
                onChange={(e) =>
                  setSearchParams({
                    type,
                    destination,
                    date: startDate,
                    endDate,
                    travellers: e.target.value,
                  })
                }
              >
                <option value="1">01 Traveller</option>
                <option value="2">02 Travellers</option>
                <option value="3">03 Travellers</option>
                <option value="4">04 Travellers</option>
                <option value="5">05 Travellers</option>
                <option value="6">06 Travellers</option>
                <option value="7">07 Travellers</option>
                <option value="8">08 Travellers</option>
                <option value="9">09 Travellers</option>
                <option value="10">10 Travellers</option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>

          {/* Search */}
          <button
            type="button"
            className="insurance-search-main-btn"
            onClick={handleSearch}
          >
            <Search size={18} />
            SEARCH
          </button>

        </div>

        {/* ================= MODIFY SEARCH ================= */}
        <div className="insurance-result-top">

          <div>
            <h1>
              Travel Insurance for{" "}
              {destination || "Your Destination"}
            </h1>

            <p>
              {type} •{" "}
              {startDate
                ? new Date(
                    startDate
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Start Date"}{" "}
              →{" "}
              {endDate
                ? new Date(
                    endDate
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "End Date"}{" "}
              • {String(travellers).padStart(2, "0")}{" "}
              Traveller
              {travellers !== "1" ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            className="insurance-modify-btn"
            onClick={handleModifySearch}
          >
            Modify Search
          </button>

        </div>

        {/* ================= INSURANCE RESULTS ================= */}
        <div className="insurance-results-layout">

          {/* FILTER */}
          <aside className="insurance-filter-box">

            <h3>Filters</h3>

            <div className="insurance-filter-section">
              <h4>Coverage</h4>

              <label>
                <input type="checkbox" />
                Medical Cover
              </label>

              <label>
                <input type="checkbox" />
                Trip Cancellation
              </label>

              <label>
                <input type="checkbox" />
                Baggage Cover
              </label>
            </div>

            <hr />

            <div className="insurance-filter-section">
              <h4>Plan Price</h4>

              <label>
                <input type="checkbox" />
                Under ₹500
              </label>

              <label>
                <input type="checkbox" />
                ₹500 - ₹1,000
              </label>

              <label>
                <input type="checkbox" />
                Above ₹1,000
              </label>
            </div>

          </aside>

          {/* PLANS */}
          <main className="insurance-list">

            <div className="insurance-list-heading">
              <strong>
                {insurancePlans.length} Plans Available
              </strong>

              <button type="button">
                Sort by: Recommended
                <ChevronDown size={15} />
              </button>
            </div>

            <div className="insurance-plans">

              {insurancePlans.map((plan) => (
                <div
                  className={
                    plan.popular
                      ? "insurance-plan-card popular"
                      : "insurance-plan-card"
                  }
                  key={plan.id}
                >

                  {plan.popular && (
                    <div className="insurance-popular">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="insurance-plan-icon">
                    <ShieldCheck size={32} />
                  </div>

                  <h2>{plan.name}</h2>

                  <p className="insurance-coverage">
                    Coverage up to{" "}
                    <strong>{plan.coverage}</strong>
                  </p>

                  <div className="insurance-price">
                    ₹{plan.price}
                    <small>
                      / traveller
                    </small>
                  </div>

                  <div className="insurance-features">

                    {plan.features.map(
                      (feature) => (
                        <div key={feature}>
                          <CheckCircle2 size={15} />
                          <span>{feature}</span>
                        </div>
                      )
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `${plan.name} selected`
                      )
                    }
                  >
                    SELECT PLAN
                  </button>

                </div>
              ))}

            </div>
          </main>
        </div>

      </div>
    </div>
  );
}

export default InsuranceResults;