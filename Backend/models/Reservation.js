import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  people: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Reservation", ReservationSchema);
