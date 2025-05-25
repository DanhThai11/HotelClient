import React, { useEffect, useState } from "react";
import BookingForm from "../booking/BookingForm";
import {
  FaUtensils,
  FaWifi,
  FaTv,
  FaWineGlassAlt,
  FaParking,
  FaCar,
  FaTshirt,
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import { getRoomById } from "../utils/ApiFunctions";
import RoomCarousel from "../common/RoomCarousel";

const Checkout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState({
    id: "",
    type: "",
    price: 0,
    description: "",
    capacity: 0,
    status: "",
    imagePath: "",
  });

  const { roomId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    getRoomById(roomId)
      .then((response) => {
        if (response.code === 0) {
          setRoomInfo(response.result);
        } else {
          setError(response.data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [roomId]);

  return (
    <div>
      <section className="container">
        <div className="row">
          <div className="col-md-4 mt-5 mb-5">
            {isLoading ? (
              <p>Loading room information...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <div className="room-info">
                <img
                  src={`data:image/png;base64,${roomInfo.photo}`}
                  alt="Room photo"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Loại phòng:</th>
                      <td>{roomInfo.type}</td>
                    </tr>
                    <tr>
                      <th>Giá phòng:</th>
                      <td>${roomInfo.price}</td>
                    </tr>
                    <tr>
                      <th>Sức chứa:</th>
                      <td>{roomInfo.capacity} người</td>
                    </tr>
                    <tr>
                      <th>Trạng thái:</th>
                      <td>{roomInfo.status}</td>
                    </tr>
                    <tr>
                      <th>Mô tả:</th>
                      <td>{roomInfo.description}</td>
                    </tr>
                    <tr>
                      <th>Tiện ích:</th>
                      <td>
                        <ul className="list-unstyled">
                          <li>
                            <FaWifi /> Wifi
                          </li>
                          <li>
                            <FaTv /> Netflix Premium
                          </li>
                          <li>
                            <FaUtensils /> Bữa sáng
                          </li>
                          <li>
                            <FaWineGlassAlt /> Mini bar
                          </li>
                          <li>
                            <FaCar /> Dịch vụ xe
                          </li>
                          <li>
                            <FaParking /> Bãi đỗ xe
                          </li>
                          <li>
                            <FaTshirt /> Giặt ủi
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>
      <div className="container">
        <RoomCarousel />
      </div>
    </div>
  );
};
export default Checkout;
