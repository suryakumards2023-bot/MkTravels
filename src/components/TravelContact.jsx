import { useState } from "react";
import { createPortal } from "react-dom";
import { Phone, X } from "lucide-react";
import "./TravelContact.css";

function TravelContact({ destinationName }) {
  const [showCallbackPopup, setShowCallbackPopup] = useState(false);

  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackEmail, setCallbackEmail] = useState("");
  const [callbackTime, setCallbackTime] = useState("Anytime");

  const closePopup = () => {
    setShowCallbackPopup(false);

    setCallbackName("");
    setCallbackPhone("");
    setCallbackEmail("");
    setCallbackTime("Anytime");
  };

  const handleCallbackSubmit = (event) => {
    event.preventDefault();

    if (!callbackName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!callbackPhone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (callbackPhone.trim().length !== 10) {
      alert("Please enter a valid 10 digit phone number.");
      return;
    }

    alert(
      `Callback request submitted for ${destinationName}.`
    );

    closePopup();
  };

  return (
    <>
      {/* ============================= */}
      {/* CONTACT BUTTONS */}
      {/* ============================= */}

      <div className="destination-contact-actions">

        {/* CALL */}
        <a
          href="tel:+918051936436"
          className="destination-call-btn"
        >
          <Phone size={15} />
          <span>Call</span>
        </a>

        {/* REQUEST CALLBACK */}
        <button
          type="button"
          className="destination-callback-btn"
          onClick={() => setShowCallbackPopup(true)}
        >
          <Phone size={15} />
          <span>Request Callback</span>
        </button>

      </div>

      {/* ============================= */}
      {/* CALLBACK POPUP */}
      {/* ============================= */}

      {showCallbackPopup &&
  createPortal(
    <div
      className="callback-popup-overlay"
      onClick={closePopup}
    >
      <div
        className="callback-popup"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="callback-popup-close"
          onClick={closePopup}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="callback-popup-header">
          <div className="callback-popup-icon">
            <Phone size={23} />
          </div>

          <div>
            <span className="callback-popup-label">
              TRAVEL EXPERT
            </span>

            <h2>Request a Callback</h2>
          </div>
        </div>

        <p className="callback-popup-description">
          Get personalized help from our travel expert for{" "}
          <strong>{destinationName}</strong>.
        </p>

        <form
          className="callback-form"
          onSubmit={handleCallbackSubmit}
        >
          <div className="callback-field">
            <label htmlFor="callback-name">
              Full Name
            </label>

            <input
              id="callback-name"
              type="text"
              placeholder="Enter your full name"
              value={callbackName}
              onChange={(event) =>
                setCallbackName(event.target.value)
              }
            />
          </div>

          <div className="callback-field">
            <label htmlFor="callback-phone">
              Phone Number
            </label>

            <input
              id="callback-phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10 digit mobile number"
              value={callbackPhone}
              onChange={(event) =>
                setCallbackPhone(
                  event.target.value.replace(/\D/g, "")
                )
              }
            />
          </div>

          <div className="callback-field">
            <label htmlFor="callback-email">
              <span>Email Address</span>
              <span className="optional-text">
                Optional
              </span>
            </label>

            <input
              id="callback-email"
              type="email"
              placeholder="Enter your email address"
              value={callbackEmail}
              onChange={(event) =>
                setCallbackEmail(event.target.value)
              }
            />
          </div>

          <div className="callback-field">
            <label htmlFor="callback-time">
              Preferred Call Time
            </label>

            <select
              id="callback-time"
              value={callbackTime}
              onChange={(event) =>
                setCallbackTime(event.target.value)
              }
            >
              <option value="Anytime">Anytime</option>
              <option value="9 AM - 12 PM">
                9 AM - 12 PM
              </option>
              <option value="12 PM - 3 PM">
                12 PM - 3 PM
              </option>
              <option value="3 PM - 6 PM">
                3 PM - 6 PM
              </option>
              <option value="6 PM - 9 PM">
                6 PM - 9 PM
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="callback-submit-btn"
          >
            <Phone size={16} />
            <span>Request Callback</span>
          </button>
        </form>

        <div className="callback-popup-footer">
          <span className="callback-footer-dot" />
          <span>
            Our travel expert will contact you shortly.
          </span>
        </div>
      </div>
    </div>,
    document.body
  )}
      
       
    </>
  );
}

export default TravelContact;