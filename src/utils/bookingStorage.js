
const STORAGE_KEY = "mkBookings";

export function getBookings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to read bookings:", error);
    return [];
  }
}

export function addBooking(booking) {
  const bookings = getBookings();

  const newBooking = {
    ...booking,
    id:
      booking.id ||
      `MKT${Date.now()}${Math.floor(Math.random() * 1000)}`,
    createdAt: booking.createdAt || new Date().toISOString(),
    status: booking.status || "Upcoming",
    paymentStatus: booking.paymentStatus || "Paid",
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([newBooking, ...bookings])
  );

  return newBooking;
}

export function updateBooking(id, updates) {
  const bookings = getBookings();
  let updatedBooking = null;

  const updatedBookings = bookings.map((booking) => {
    if (String(booking.id) !== String(id)) {
      return booking;
    }

    updatedBooking = { ...booking, ...updates };
    return updatedBooking;
  });

  if (updatedBooking) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedBookings)
    );
  }

  return updatedBooking;
}

export function getBookingById(id) {
  return getBookings().find(
    (booking) => String(booking.id) === String(id)
  ) || null;
}
