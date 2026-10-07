import { Link } from "react-router-dom";
import {
  Bus,
  Car,
  Hotel,
  Palmtree,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import destinations from "../data/destinations";

function Home() {
  const travelServices = [
    {
      id: 1,
      title: "Bus",
      icon: Bus,
      iconClass: "bus-icon",
      link: "/search?type=bus",
    },
    {
      id: 2,
      title: "Cabs",
      icon: Car,
      iconClass: "cab-icon",
      link: "/search?type=cab",
    },
    {
      id: 3,
      title: "Hotels",
      icon: Hotel,
      iconClass: "hotel-icon",
      link: "/search?type=hotel",
    },
    {
      id: 4,
      title: "Holiday Packages",
      icon: Palmtree,
      iconClass: "holiday-icon",
      link: "/tours",
    },
    {
      id: 5,
      title: "Travel Insurance",
      icon: ShieldCheck,
      iconClass: "insurance-icon",
      link: "/insurance",
    },
  ];

  return (
    <main className="home-page">
      {/* =========================================
          TRAVEL SERVICES
      ========================================= */}
      <div className="travel-services-container">
        <div className="travel-services">
          {travelServices.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.id}
                to={service.link}
                className="travel-service-card"
              >
                <div className={`travel-service-icon ${service.iconClass}`}>
                  <Icon size={30} strokeWidth={1.8} />
                </div>
                <h3>{service.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =========================================
          POPULAR DESTINATIONS
      ========================================= */}
      <section className="destinations-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-label">EXPLORE THE WORLD</span>
              <h2>Popular Destinations</h2>
            </div>
             {/* VIEW ALL */}
          <div className="destinations-footer">
            <Link to="/tours" className="view-all-button">
              View All Destinations
              <ArrowRight size={18} />
            </Link>
          </div>
          </div>

          <div className="destinations-grid">
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/tours?destination=${encodeURIComponent(
                  destination.name
                )}`}
                className="destination-card"
              >
                {/* IMAGE */}
                <div className="destination-image-wrapper">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="destination-image"
                  />
                  <div className="destination-image-overlay" />

                  <span className="destination-country">
                    {destination.country}
                  </span>

                  {/* RATING */}
                  {destination.rating && (
                    <span className="destination-rating">
                      ★ {destination.rating}
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="destination-content">
                  <div className="destination-info">
                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>

                    {/* DURATION */}
                    {destination.duration && (
                      <div className="destination-duration">
                        🕐 {destination.duration}
                      </div>
                    )}

                    {/* PRICE */}
                    {destination.price && (
                      <div className="destination-price">
                        <span className="destination-price-current">
                          ₹{destination.price.toLocaleString("en-IN")}
                        </span>
                        {destination.oldPrice && (
                          <span className="destination-price-old">
                            ₹{destination.oldPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* VIEW TOUR */}
                  <span className="destination-view-button">
                    View Tour
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;