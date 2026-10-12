
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  Camera,
  Edit3,
  LogOut,
  Mail,
  Phone,
  Save,
  Ticket,
  User,
  X,
} from "lucide-react";

import { apiRequest } from "../api/api";
import "./Profile.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  state: "",
  city: "",
  pincode: "",
  townVillage: "",
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photo, setPhoto] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Success message automatically disappears after 3 seconds.
  useEffect(() => {
    if (!success) return;

    const timer = window.setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [success]);

  // Load profile from backend.
  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await apiRequest("/auth/me");
        const currentUser = response?.user || response;

        if (
          !currentUser?._id &&
          !currentUser?.id &&
          !currentUser?.email
        ) {
          throw new Error("Unable to load your account details.");
        }

        if (!active) return;

        setUser(currentUser);
        setPhoto(currentUser.profilePhoto || "");

        setFormData({
          ...EMPTY_FORM,
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          state: currentUser.state || "",
          city: currentUser.city || "",
          pincode: currentUser.pincode || "",
          townVillage: currentUser.townVillage || "",
        });
      } catch (err) {
        if (!active) return;

        if (err.status === 401) {
          navigate("/login", {
            replace: true,
            state: { from: "/profile" },
          });
          return;
        }

        setError(err.message || "Unable to load your profile.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Photo can only be selected in Edit Profile mode.
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!isEditing) {
      e.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP or GIF image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Photo size should be less than 2MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
      }
    };

    reader.onerror = () => {
      setError("Unable to read the selected photo. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (isSaving) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const pincode = formData.pincode.trim();

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone && !/^\+?[0-9\s()-]{7,20}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (pincode && !/^[0-9]{6}$/.test(pincode)) {
      setError("Pincode must contain exactly 6 digits.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name,
          email,
          phone,
          address: formData.address.trim(),
          state: formData.state.trim(),
          city: formData.city.trim(),
          pincode,
          townVillage: formData.townVillage.trim(),
          profilePhoto: photo,
        }),
      });

      const updatedUser = response?.user;

      if (!updatedUser) {
        throw new Error("Invalid profile update response.");
      }

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setFormData({
        ...EMPTY_FORM,
        name: updatedUser.name ?? name,
        email: updatedUser.email ?? email,
        phone: updatedUser.phone ?? phone,
        address: updatedUser.address ?? formData.address.trim(),
        state: updatedUser.state ?? formData.state.trim(),
        city: updatedUser.city ?? formData.city.trim(),
        pincode: updatedUser.pincode ?? pincode,
        townVillage:
          updatedUser.townVillage ?? formData.townVillage.trim(),
      });

      setPhoto(updatedUser.profilePhoto ?? photo);
      setIsEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...EMPTY_FORM,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      state: user?.state || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
      townVillage: user?.townVillage || "",
    });

    setPhoto(user?.profilePhoto || "");
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError("");

      await apiRequest("/auth/logout", {
        method: "POST",
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Logout request failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p role="alert">{error || "Unable to load your profile."}</p>

          <button type="button" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const firstLetter = user.name?.charAt(0)?.toUpperCase() || "U";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="profile-page">
      <div className="profile-container">
        {success && (
          <div className="profile-success-message" role="status">
            {success}
          </div>
        )}

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <div className="profile-grid">
          {/* Main Profile Card */}
          <div className="profile-main-card">
            <div className="profile-card-title">
              <h1>My Profile</h1>
            </div>

            <div className="profile-cover"></div>

            <div className="profile-avatar-wrapper">
              {photo ? (
                <img
                  src={photo}
                  alt={user.name || "Profile"}
                  className="profile-avatar-image"
                />
              ) : (
                <div className="profile-avatar">{firstLetter}</div>
              )}

              <label
                htmlFor="profile-photo"
                className={`profile-photo-btn ${
                  !isEditing ? "profile-photo-disabled" : ""
                }`}
                title={
                  isEditing
                    ? "Change Profile Photo"
                    : "Click Edit Profile to change photo"
                }
                aria-disabled={!isEditing}
              >
                <Camera size={15} />
              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handlePhotoChange}
                disabled={!isEditing || isSaving}
                hidden
              />
            </div>

            <div className="profile-basic-info">
              <h2>{user.name || "User"}</h2>

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
                  type="button"
                  className="profile-edit-btn"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setIsEditing(true);
                  }}
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="profile-save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="profile-details-card">
            <div className="profile-card-heading">
              <div>
                <h2>Personal Information</h2>
                <p>Manage your personal and contact details.</p>
              </div>

              <User size={21} />
            </div>

            <div className="profile-form">
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

              <div className="profile-field">
                <label>Pincode</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="6 digit pincode"
                  />
                ) : (
                  <div className="profile-field-value">
                    {user.pincode || "Not provided"}
                  </div>
                )}
              </div>

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
        <Link to="/my-trips" className="profile-bookings-card">
          <div className="profile-bookings-icon">
            <Ticket size={23} />
          </div>

          <div className="profile-bookings-content">
            <h2>My Bookings</h2>
            <p>View and manage all your tour bookings.</p>
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
            <p>Manage your MK TRAVELS account.</p>
          </div>

          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={17} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
