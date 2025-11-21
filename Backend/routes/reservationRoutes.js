import express from "express";
const router = express.Router();
import Reservation from "../models/Reservation.js";

router.post("/", async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json({ message: "Reservation Saved Successfully", reservation });
  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(400).json({ 
      message: "Failed to create reservation", 
      error: error.message 
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error('Reservation fetch error:', error);
    res.status(500).json({ 
      message: "Failed to fetch reservations", 
      error: error.message 
    });
  }
});

export default router;
