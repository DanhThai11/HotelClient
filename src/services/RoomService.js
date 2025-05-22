const USE_MOCK_DATA = true;

const mockRooms = [
  { id: 1, type: "VIP", price: 100, status: "AVAILABLE" },
  { id: 2, type: "Đôi", price: 80, status: "BOOKED" },
  { id: 3, type: "Đơn", price: 60, status: "AVAILABLE" },
  { id: 4, type: "Gia đình", price: 120, status: "BOOKED" },
];

export async function getAllRooms() {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockRooms);
  }
  // Gọi API thật
  // import { getAllRooms as apiGetAllRooms } from '../components/utils/ApiFunctions';
  // return await apiGetAllRooms();
}

export async function deleteRoom(roomId) {
  if (USE_MOCK_DATA) {
    return Promise.resolve();
  }
  // Gọi API thật
} 