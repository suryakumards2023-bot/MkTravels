
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  LogOut,
  Mail,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";

import {
  getCurrentUser,
  logoutUser,
  updateCurrentUser,
} from "../utils/authStorage";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const updatedUser = updateCurrentUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });

    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setIsEditing(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const firstLetter =
    user.name?.charAt(0)?.toUpperCase() || "U";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Back */}
        <Link to="/my-trips" className="profile-back">
          <ArrowLeft size={17} />
          Back to My Trips
        </Link>

        {/* Header */}
        <div className="profile-header">
          <div>
            <span className="profile-label">
              ACCOUNT SETTINGS
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information and account details.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="profile-grid">

          {/* Left Card */}
          <div className="profile-main-card">

            <div className="profile-cover"></div>

            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {firstLetter}
              </div>
            </div>

            <div className="profile-basic-info">
              <h2>{user.name}</h2>

              <p>
                <Mail size={15} />
                {user.email}
              </p>

              {user.phone && (
                <p>
                  <Phone size={15} />
                  {user.phone}
                </p>
              )}

              <span className="profile-member">
                <CalendarDays size={14} />
                Member since {memberSince}
              </span>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button
                  className="profile-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="profile-save-btn"
                    onClick={handleSave}
                  >
                    <Save size={16} />
                    Save Changes
                  </button>

                  <button
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Card */}
          <div className="profile-details-card">

            <div className="profile-card-heading">
              <div>
                <h2>Personal Information</h2>
                <p>
                  Keep your account information up to date.
                </p>
              </div>

              <User size={21} />
            </div>

            <div className="profile-form">

              {/* Name */}
              <div className="profile-field">
                <label>Full Name</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.name || "Not provided"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="profile-field">
                <label>Email Address</label>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.email || "Not provided"}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="profile-field">
                <label>Phone Number</label>

                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.phone || "Not provided"}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="profile-account-card">

          <div>
            <h2>Account</h2>
            <p>
              Manage your MK TRAVELS account.
            </p>
          </div>

          <button
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;

