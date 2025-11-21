import Order from "../models/Order.js";

// Create New Order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const newOrder = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      address,
    });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Orders of Logged-in User
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.menuItem"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menuItem");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status (Admin) — WITH SOCKET.IO EVENTS
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    await order.save();

    //Get Socket.io instance
    const io = req.app.get("io");

    // Notify the specific user about their order status update
    io.to(order._id.toString()).emit("order_status_updated", {
      orderId: order._id,
      status,
    });

    // Notify all admin dashboards to refresh order list
    io.emit("orderUpdated");

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Order (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const io = req.app.get("io");
    io.emit("orderUpdated");

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Order (Admin) - update fields like totalAmount, items, paymentStatus, address
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // allow partial updates

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow certain fields to be updated by admin
    const allowed = [
      "totalAmount",
      "items",
      "paymentStatus",
      "orderStatus",
      "address",
    ];
    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        order[field] = updates[field];
      }
    });

    await order.save();

    const io = req.app.get("io");
    // Notify user and admin dashboards
    io.to(order._id.toString()).emit("order_updated", {
      orderId: order._id,
      updates,
    });
    io.emit("orderUpdated");

    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
