const USE_MOCK_DATA = true;

const mockBookings = [
  { id: 1, roomId: 1, userId: 1, checkInDate: "2024-06-01", checkOutDate: "2024-06-03", status: "CONFIRMED" },
  { id: 2, roomId: 2, userId: 2, checkInDate: "2024-06-02", checkOutDate: "2024-06-04", status: "CANCELLED" },
  { id: 3, roomId: 3, userId: 3, checkInDate: "2024-06-05", checkOutDate: "2024-06-07", status: "CONFIRMED" },
];

export async function getAllBookings() {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockBookings);
  }
  // Gọi API thật
}

export async function deleteBooking(bookingId) {
  if (USE_MOCK_DATA) {
    return Promise.resolve();
  }
  // Gọi API thật
} 