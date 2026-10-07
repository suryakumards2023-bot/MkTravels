import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetails from "./pages/TourDetails";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyTrips from "./pages/MyTrips";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/tours" element={<Tours />} />

          <Route
            path="/tours/:id"
            element={<TourDetails />}
          />

          <Route
            path="/search"
            element={<Search />}
          />

          <Route
            path="/booking/:id"
            element={<Booking />}
          />

          <Route
            path="/payment/:id"
            element={<Payment />}
          />

          <Route path="/my-bookings" element={<MyBookings />} />

          <Route
  path="/my-trips"
  element={<MyBookings />}
/>

          <Route
  path="/booking-details/:id"
  element={<BookingDetails />}
/>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
  path="/signup"
  element={<Signup />}
/>

          <Route
            path="/my-trips"
            element={<MyTrips />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;