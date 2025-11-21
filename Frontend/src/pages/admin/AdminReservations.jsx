import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    API.get("/reservation")
      .then(res => setReservations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Table Reservations</h2>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-3">Name</th>
            <th className="border p-3">Date</th>
            <th className="border p-3">Time</th>
            <th className="border p-3">People</th>
            <th className="border p-3">Phone</th>
            <th className="border p-3">Email</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border p-3">{r.name}</td>
              <td className="border p-3">{r.date}</td>
              <td className="border p-3">{r.time}</td>
              <td className="border p-3">{r.people}</td>
              <td className="border p-3">{r.phone}</td>
              <td className="border p-3">{r.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservations;
