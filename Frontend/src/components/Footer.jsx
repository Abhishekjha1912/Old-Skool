import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

// Import images
import gallery1 from '../assets/oldcafe.jpg';
import gallery2 from '../assets/oldtab.jpg';
import gallery3 from '../assets/oldroom.jpg';
import gallery4 from '../assets/oldgirl.jpg';

const Footer = () => {
  const galleryImages = [gallery1, gallery2, gallery3, gallery4];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              OLD <span className="text-orange-500">SKOOL</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Experience the finest coffee and cuisine in a nostalgic atmosphere. 
              Our cafe brings together classic flavors and modern sophistication.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FiFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FiInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FiTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="hover:text-orange-500 transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/book-table" className="hover:text-orange-500 transition-colors">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-orange-500 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
            <div className="flex items-start space-x-3">
              <FiMapPin className="w-5 h-5 text-orange-500 mt-1" />
              <p className="text-sm">SP-40 Old Skool, RIICO, Kukas 302028</p>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="w-5 h-5 text-orange-500" />
              <p className="text-sm">+91 9123190262</p>
            </div>
            <div className="flex items-center space-x-3">
              <FiMail className="w-5 h-5 text-orange-500" />
              <p className="text-sm">abhi@oldskool.com</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiClock className="w-5 h-5 text-orange-500 mt-1" />
              <div className="text-sm">
                <p>Mon-Fri: 8:00 AM - 10:00 PM</p>
                <p>Sat-Sun: 9:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Gallery</h4>
            <div className="grid grid-cols-2 gap-2">
              {galleryImages.map((img, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-24 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <FiInstagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Old Skool Cafe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
