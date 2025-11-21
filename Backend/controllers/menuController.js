import Menu from "../models/MenuItem.js";
import cloudinary from "../utils/cloudinary.js"; // we'll create this next

// ADD menu item (Admin only)
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let { category } = req.body;
    // Normalize category to values used by frontend
    const normalizeCategory = (raw) => {
      if (!raw) return "";
      const s = String(raw).trim().toUpperCase();
      const map = {
        LUNCH: "LUNCH",
        DINNER: "DINNER",
        DRINK: "DRINK",
        DRINKS: "DRINK",
        BEVERAGE: "DRINK",
        BEVERAGES: "DRINK",
        STARTER: "STARTERS",
        STARTERS: "STARTERS",
        SNACK: "STARTERS",
        SNACKS: "STARTERS",
        "HAPPY HOUR": "HAPPY HOUR",
        HAPPY: "HAPPY HOUR",
        DESSERT: "DESSERT",
        DESSERTS: "DESSERT",
        "MAIN COURSE": "DINNER",
        MAIN: "DINNER",
      };
      if (map[s]) return map[s];
      // try substring matches
      if (s.includes("DRINK" ) || s.includes("BEVERAGE")) return "DRINK";
      if (s.includes("START" ) || s.includes("SNACK")) return "STARTERS";
      if (s.includes("HAPPY")) return "HAPPY HOUR";
      if (s.includes("DESSERT")) return "DESSERT";
      if (s.includes("LUNCH")) return "LUNCH";
      if (s.includes("DINNER" ) || s.includes("MAIN")) return "DINNER";
      return s;
    };
    if (category) category = normalizeCategory(category);

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResult.secure_url;
    }

    const menu = new Menu({ name, description, price, category, imageUrl });
    await menu.save();

    res.status(201).json({ message: "Menu item added", menu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all menu items (public)
export const getMenuItems = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET single menu item (public)
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Menu.findById(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE menu item (Admin only)
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE menu item (Admin only)
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Normalize category if provided
    if (req.body.category) req.body.category = String(req.body.category).trim().toUpperCase();

    const updates = { ...req.body };
    // If an image file was uploaded, upload to cloudinary and set imageUrl
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      updates.imageUrl = uploadResult.secure_url;
    }

    // Normalize category if provided in updates
    if (updates.category) updates.category = normalizeCategory(updates.category);

    const updatedItem = await Menu.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
