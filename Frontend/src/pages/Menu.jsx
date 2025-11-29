import React, { useState, useEffect, useContext } from "react";
import API from "../api/axiosConfig";
import { toast } from 'react-toastify';
import { FiShoppingCart, FiPlus, FiMinus, FiX } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const categories = [
  { title: "LUNCH", value: "LUNCH", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hhaGklMjBwYW5lZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600" },
  { title: "DINNER", value: "DINNER", img: "https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg" },
  { title: "DRINK", value: "DRINK", img: "https://images.unsplash.com/photo-1598908314732-07113901949e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlJTIwY3VwfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" },
  { title: "STARTERS", value: "STARTERS", img: "https://images.unsplash.com/photo-1606755456206-b25206cde27e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RhcnRlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600" },
  { title: "HAPPY HOUR", value: "HAPPY HOUR", img: "https://images.unsplash.com/photo-1532269748385-a458d8ee473e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGFwcHklMjBob3VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" },
  { title: "DESSERT", value: "DESSERT", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVzc2VydHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600" },
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const { user } = useContext(AuthContext);

  // Fetch all menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await API.get("/menu");
      
      // Handle different response structures
      const items = Array.isArray(response.data) 
        ? response.data 
        : response.data.items || response.data.data || [];
      
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to fetch menu items");
      setMenuItems([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  // Filter items by category
  const filteredItems = selectedCategory && Array.isArray(menuItems)
    ? menuItems.filter(item => item.category?.toUpperCase() === selectedCategory)
    : [];

  // Add item to cart
  const addToCart = (item) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    const existingItem = cart.find(c => c._id === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  // Update quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      const item = cart.find(c => c._id === itemId);
      if (item) {
        item.quantity = quantity;
        setCart([...cart]);
      }
    }
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c._id !== itemId));
    toast.info("Item removed from cart");
  };

  // Calculate total
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Place order
  const placeOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        menuItem: item._id,
        quantity: item.quantity,
      }));

      const response = await API.post("/orders", {
        items: orderItems,
        totalAmount,
        address: { street: address },
      });

      toast.success("Order placed successfully!");
      setCart([]);
      setAddress("");
      setShowCart(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="px-6 md:px-20 py-10 bg-[#faf7f2] min-h-screen">
      {/* Header */}
      <p className="text-center text-red-500 italic text-lg mb-2">Discover</p>
      <h2 className="text-center text-4xl font-bold tracking-wide mb-10">OUR MENU</h2>

      {/* Category Selection View */}
      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[260px]">
          {categories.map((category) => (
            <CategoryCard
              key={category.value}
              item={category}
              onClick={() => setSelectedCategory(category.value)}
              className={
                category.value === "LUNCH" || category.value === "DINNER"
                  ? "md:col-span-1 md:row-span-2"
                  : category.value === "HAPPY HOUR"
                    ? "md:col-span-2 md:h-[260px]"
                    : ""
              }
            />
          ))}
        </div>
      ) : (
        /* Menu Items View */
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            ← Back to Categories
          </button>

          <h3 className="text-3xl font-bold mb-6">{selectedCategory} Items</h3>

          {loading ? (
            <p className="text-center text-gray-600">Loading items...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-600">No items available in this category</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuItem
                  key={item._id}
                  item={item}
                  onAddToCart={addToCart}
                  inCart={cart.some(c => c._id === item._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition flex items-center space-x-2 text-lg font-semibold"
        >
          <FiShoppingCart className="text-2xl" />
          <span>{cart.length}</span>
        </button>
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FiPlus />
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Input */}
            <div className="p-6 border-t">
              <label className="block text-sm font-medium mb-2">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full border rounded-lg p-2 mb-4"
                rows="3"
              />
            </div>

            {/* Total & Checkout */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-orange-600">₹{totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={placeOrder}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryCard = ({ item, onClick, className }) => (
  <div
    onClick={onClick}
    className={`relative overflow-hidden rounded-lg group cursor-pointer ${className}`}
  >
    <img
      src={item.img}
      alt={item.title}
      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
    />
    <div className="absolute inset-0  bg-opacity-40 group-hover:bg-opacity-60 transition duration-300 flex items-center justify-center">
      <span className="bg-white text-gray-800 px-6 py-2 rounded-full text-lg font-semibold tracking-wide">
        {item.title}
      </span>
    </div>
  </div>
);

const MenuItem = ({ item, onAddToCart, inCart }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
    {item.imageUrl && (
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
        <button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            item.available
              ? inCart
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {!item.available ? "Unavailable" : inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  </div>
);

export default Menu;
