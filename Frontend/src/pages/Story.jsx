import React from "react";
import Navbar from "../components/Navbar";
import foodImg from "../assets/oldgrp.jpg"; // replace with your image

const Story = () => {
  return (
    <div className=" bg-gray-50">
      <Navbar />

      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 md:px-12 py-10 gap-5">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-red-600 italic text-xl md:text-2xl font-medium mb-2">
            Best Restaurant
          </h3>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            WELCOME
          </h1>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0">
            At Old Skool Café & Restaurant, every flavor carries a touch of
            nostalgia and comfort. Enjoy freshly brewed coffee, sizzling grills,
            and dishes crafted with passion and care. Step in, slow down, and
            savor the timeless taste of togetherness.
          </p>
          <button className="text-gray-800 uppercase tracking-wider font-medium hover:text-red-600 transition">
            OUR STORY →
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={foodImg}
            alt="Delicious Food"
            className="rounded-lg shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default Story;
