import React,{ useState } from "react";
import { toast } from 'react-toastify';
import API from "../../api/axiosConfig";
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  "LUNCH",
  "DINNER",
  "DRINK",
  "STARTERS",
  "HAPPY HOUR",
  "DESSERT",
];

export default function AddMenuItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("image", image);

    try {
      await API.post("/menu/add", data);
      toast.success('Menu item added successfully');
      navigate('/admin/manage-menu');
    } catch (err) {
      console.log(err);
      toast.error('Failed to add menu item');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10">
      <h2 className="text-2xl font-bold mb-6">Add Menu Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Item Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="price" placeholder="Price" type="number" onChange={handleChange} className="w-full p-2 border rounded" required />

        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input type="file" onChange={(e)=>setImage(e.target.files[0])} className="w-full" />

        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800">
          Add Item
        </button>
      </form>
    </div>
  );
}
