import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { signupUser } from "../utils/authStorage";

import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    const result = signupUser({
      name,
      email,
      phone,
      password,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/my-trips", {
      replace: true,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT */}
        <div className="auth-brand-panel">

          <div className="auth-brand-content">

            <div className="auth-logo">
              MK
            </div>

            <span className="auth-label">
              MK TRAVELS
            </span>

            <h1>
              Travel more.
              <br />
              Remember more.
            </h1>

            <p>
              Create your account and keep
              all your journeys together.
            </p>

            <div className="auth-benefits">

              <div>
                <ShieldCheck size={19} />

                <span>
                  Safe & secure account
                </span>
              </div>

              <div>
                <UserRound size={19} />

                <span>
                  Manage traveller details
                </span>
              </div>

              <div>
                <ArrowRight size={19} />

                <span>
                  Track all your bookings
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="auth-form-panel">

          <div className="auth-form-wrapper">

            <div className="auth-mobile-logo">

              <div className="auth-logo">
                MK
              </div>

              <strong>
                MK TRAVELS
              </strong>

            </div>

            <div className="auth-heading">

              <span>
                JOIN MK TRAVELS
              </span>

              <h2>
                Create your account
              </h2>

              <p>
                Start planning your next
                unforgettable journey.
              </p>

            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              {/* NAME */}
              <div className="auth-field">

                <label>
                  Full Name
                </label>

                <div className="auth-input">

                  <UserRound size={18} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* EMAIL */}
              <div className="auth-field">

                <label>
                  Email Address
                </label>

                <div className="auth-input">

                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* PHONE */}
              <div className="auth-field">

                <label>
                  Mobile Number
                </label>

                <div className="auth-input">

                  <Phone size={18} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div className="auth-field">

                <label>
                  Password
                </label>

                <div className="auth-input">

                  <Lock size={18} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}
              <div className="auth-field">

                <label>
                  Confirm Password
                </label>

                <div className="auth-input">

                  <Lock size={18} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="auth-submit"
              >
                Create Account
                <ArrowRight size={18} />
              </button>

            </form>

            <div className="auth-divider">
              <span>
                Already have an account?
              </span>
            </div>

            <Link
              to="/login"
              className="auth-secondary-btn"
            >
              Sign In
            </Link>

            <Link
              to="/"
              className="auth-home-link"
            >
              ← Back to Home
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Signup;