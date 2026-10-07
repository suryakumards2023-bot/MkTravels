import "./Tour.css";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";

import tours from "../data/tours";


function Tours() {

  const [searchParams] = useSearchParams();

  const destinationFilter =
    searchParams.get("destination");


  const filteredTours = destinationFilter
    ? tours.filter(
        (tour) =>
          tour.destination.toLowerCase() ===
          destinationFilter.toLowerCase()
      )
    : tours;


  return (
    <main className="tours-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <section className="tours-header">

        <div className="tours-header-container">

          <span className="tours-label">
            EXPLORE WITH MK TRAVELS
          </span>

          <h1>
            Popular Tour Packages
          </h1>

          <p>
            Discover amazing destinations, exciting
            experiences and carefully planned holiday
            packages.
          </p>

        </div>

      </section>


      {/* =========================================
          TOURS CONTENT
      ========================================= */}

      <section className="tours-section">

        <div className="tours-container">


          {/* FILTER RESULT */}

          <div className="tours-topbar">

            <div>

              <h2>
                {destinationFilter
                  ? `${destinationFilter} Tours`
                  : "All Tour Packages"}
              </h2>

              <p>
                {filteredTours.length} packages available
              </p>

            </div>

          </div>


          {/* =========================================
              TOUR GRID
          ========================================= */}

          {filteredTours.length > 0 ? (

            <div className="tours-grid">

              {filteredTours.map((tour) => (

                <Link
                  key={tour.id}
                  to={`/tours/${tour.id}`}
                  className="tour-card"
                >

                  {/* IMAGE */}

                  <div className="tour-card-image">

                    <img
                      src={tour.image}
                      alt={tour.name}
                    />


                    <span className="tour-country">
                      {tour.country}
                    </span>


                    <span className="tour-rating">

                      <Star
                        size={13}
                        fill="currentColor"
                      />

                      {tour.rating}

                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="tour-card-content">

                    <div className="tour-location">

                      <MapPin size={14} />

                      <span>
                        {tour.destination}
                      </span>

                    </div>


                    <h3>
                      {tour.name}
                    </h3>


                    <p className="tour-description">
                      {tour.description}
                    </p>


                    {/* DURATION */}

                    <div className="tour-duration">

                      <Clock size={15} />

                      <span>
                        {tour.duration}
                      </span>

                    </div>


                    {/* BOTTOM */}

                    <div className="tour-card-bottom">

                      <div>

                        <span className="starting-from">
                          Starting from
                        </span>

                        <div className="tour-price">

                          ₹{tour.price.toLocaleString("en-IN")}

                          <span>
                            ₹{tour.oldPrice.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                      </div>


                      <span className="tour-arrow">

                        <ArrowRight size={18} />

                      </span>

                    </div>


                    <div className="tour-reviews">

                      <Star
                        size={13}
                        fill="currentColor"
                      />

                      {tour.rating}

                      <span>
                        ({tour.reviews} reviews)
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          ) : (

            /* =========================================
                NO RESULT
            ========================================= */

            <div className="no-tours">

              <h3>
                No tours found
              </h3>

              <p>
                We couldn't find any tours for
                "{destinationFilter}".
              </p>

              <Link
                to="/tours"
                className="view-all-tours"
              >
                View All Tours
              </Link>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}


export default Tours;