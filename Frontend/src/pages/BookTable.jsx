import React, { useState } from "react";
import API from "../api/axiosConfig";
import { toast } from 'react-toastify';
import tableImg from "../assets/oldgirl.jpg";
import axios from 'axios'

const BookTable = () => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    people: "1 person",
    name: "",
    phone: "",
    email: "",
  });

  // using toast notifications instead of inline popup/alert

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://oldskool-backend.onrender.com/api/reservation", form);
      // show success toast
      toast.success('Reservation submitted. We will contact you soon!');

      // reset form
      setForm({
        date: "",
        time: "",
        people: "1 person",
        name: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative">
      {/* toasts used for feedback  */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Form */}
        <div className="w-full flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-red-600 italic text-sm mb-1">Reservation</h3>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Book a Table</h1>

            {/* date + time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="text-sm text-gray-600">Date</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Time</span>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </label>
            </div>

            <label className="block mb-4">
              <span className="text-sm text-gray-600">Guests</span>
              <select
                name="people"
                value={form.people}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              >
                <option>1 person</option>
                <option>2 people</option>
                <option>4 people</option>
                <option>6 people</option>
              </select>
            </label>

            {/* name + phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="text-sm text-gray-600">Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Your name"
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Phone</span>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  placeholder="Phone number"
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </label>
            </div>

            <label className="block mb-6">
              <span className="text-sm text-gray-600">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="you@email.com"
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </label>

            <button type="submit" className="w-full py-3 rounded bg-orange-600 text-white font-semibold shadow hover:bg-orange-700 transition">
              Book Table
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <img src={tableImg} alt="table" className="rounded-lg shadow-lg w-full object-cover max-h-[420px]" />
        </div>

      </section>
    </div>
  );
};

export default BookTable;
