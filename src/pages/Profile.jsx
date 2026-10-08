import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Edit3,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Ticket,
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
    address: "",
    state: "",
    city: "",
    pincode: "",
    townVillage: "",
  });

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login", {
        state: {
          from: "/profile",
        },
      });
      return;
    }

    setUser(currentUser);

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      state: currentUser.state || "",
      city: currentUser.city || "",
      pincode: currentUser.pincode || "",
      townVillage: currentUser.townVillage || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Profile Photo
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedUser = updateCurrentUser({
        photo: reader.result,
      });

      setUser(updatedUser);
    };

    reader.readAsDataURL(file);
  };

  // Save Profile
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const updatedUser = updateCurrentUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode,
      townVillage: formData.townVillage,
    });

    setUser(updatedUser);
    setIsEditing(false);
  };

  // Cancel Editing
  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      state: user?.state || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
      townVillage: user?.townVillage || "",
    });

    setIsEditing(false);
  };

  // Logout
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

        {/* Main Profile Grid */}
        <div className="profile-grid">

          {/* Left Profile Card */}
          <div className="profile-main-card">

            <div className="profile-card-title">
               <h1>My Profile</h1>
                </div>
            <div className="profile-cover"></div>

            {/* Profile Photo */}
            <div className="profile-avatar-wrapper">

              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="profile-avatar-image"
                />
              ) : (
                <div className="profile-avatar">
                  {firstLetter}
                </div>
              )}

              {/* Camera Button */}
              <label
                htmlFor="profile-photo"
                className="profile-photo-btn"
                title="Change Profile Photo"
              >
                <Camera size={15} />
              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </div>

            {/* Basic Info */}
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

            {/* Buttons */}
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

          {/* Right Details Card */}
          <div className="profile-details-card">

            <div className="profile-card-heading">

              <div>
                <h2>Personal Information</h2>

                <p>
                  Manage your personal and contact details.
                </p>
              </div>

              <User size={21} />

            </div>

            <div className="profile-form">

              {/* Full Name */}
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

              {/* Address */}
              <div className="profile-field profile-full">

                <label>Address</label>

                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House No, Street, Area"
                    rows="3"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.address || "Not provided"}
                  </div>
                )}

              </div>

              {/* State */}
              <div className="profile-field">

                <label>State</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.state || "Not provided"}
                  </div>
                )}

              </div>

              {/* City */}
              <div className="profile-field">

                <label>City</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.city || "Not provided"}
                  </div>
                )}

              </div>

              {/* Pincode */}
              <div className="profile-field">

                <label>Pincode</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    placeholder="6 digit pincode"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.pincode || "Not provided"}
                  </div>
                )}

              </div>

              {/* Town / Village */}
              <div className="profile-field">

                <label>Town / Village</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="townVillage"
                    value={formData.townVillage}
                    onChange={handleChange}
                    placeholder="Enter town or village"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.townVillage || "Not provided"}
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>

        {/* My Bookings */}
        <Link
          to="/my-trips"
          className="profile-bookings-card"
        >
          <div className="profile-bookings-icon">
            <Ticket size={23} />
          </div>

          <div className="profile-bookings-content">
            <h2>My Bookings</h2>

            <p>
              View and manage all your tour bookings.
            </p>
          </div>

          <div className="profile-bookings-right">
            <span>View All</span>
            <ArrowRight size={19} />
          </div>
        </Link>

        {/* Account */}
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