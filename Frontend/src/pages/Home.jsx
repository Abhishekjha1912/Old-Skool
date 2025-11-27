import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import oldEve from "../assets/oldtab.jpg";
import oldcafe from "../assets/oldcafe.jpg";
import oldroom from "../assets/oldroom.jpg";
import Story from "../pages/Story";
import Menu from "./Menu";
import BookTable from "./BookTable";

const Home = () => {
  const navigate = useNavigate();
  const images = [oldEve, oldcafe, oldroom];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleMenuClick = () => {
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-screen">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.6)",
            }}
          ></div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-orange-500">OLD SKOOL</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">Brewed with Love</p>
          <button
            onClick={handleMenuClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg"
          >
            LOOK MENU
          </button>
        </div>
      </div>
      <Story />
      <Menu />
      <BookTable />
    </div>
  );
};

export default Home;