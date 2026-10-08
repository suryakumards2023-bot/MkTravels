import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetails from "./pages/TourDetails";

import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import BusResult from "./pages/BusResult";
import CabResults from "./pages/CabResults";
import HotelResults from "./pages/HotelResults";
import InsuranceResults from "./pages/InsuranceResults";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
            path="/booking/:id"
            element={<Booking />}
          />

          <Route
            path="/payment/:id"
            element={<Payment />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/my-trips"
            element={<MyBookings />}
          />

          <Route
            path="/booking-details/:id"
            element={<BookingDetails />}
          />

          <Route path="/bus-result" element={<BusResult />} />

          <Route path="/cab-results" element={<CabResults />} />
<Route path="/hotel-results" element={<HotelResults />} />
<Route path="/insurance-results" element={<InsuranceResults />} />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
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