import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";

const CATEGORIES = ["LUNCH","DINNER","DRINK","STARTERS","HAPPY HOUR","DESSERT"];

const ManageMenu = () => {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editAvailable, setEditAvailable] = useState(true);

  const fetchMenu = async () => {
    try {
  const res = await API.get("/menu");
      setMenu(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
  await API.delete(`/menu/${id}`);
      fetchMenu(); // refresh after deleting
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditPrice(item.price);
    setEditAvailable(item.available ?? true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice(0);
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/menu/${id}`, { price: Number(editPrice), available: editAvailable });
      setEditingId(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filtered = menu.filter(item => {
    const q = search.trim().toLowerCase();
    if (filter && item.category !== filter) return false;
    if (!q) return true;
    return (item.name || "").toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q);
  });

  return (
    <div className="mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Manage Menu</h2>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="border p-2 rounded w-64"
          />
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border p-2 rounded">
            <option value="">All Categories</option>
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <Link
            to="/admin/add-menu"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            + Add New Item
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">
                  {editingId === item._id ? (
                    <div className="flex items-center gap-2">
                      <input type="number" value={editPrice} onChange={(e)=>setEditPrice(e.target.value)} className="w-20 p-1 border rounded" />
                      <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={editAvailable} onChange={(e)=>setEditAvailable(e.target.checked)} /> Available</label>
                    </div>
                  ) : (
                    <div>₹ {item.price}</div>
                  )}
                </td>
                <td className="p-3">{item.category}</td>
                <td className="p-3 flex gap-3 items-center">
                  {editingId === item._id ? (
                    <>
                      <button onClick={()=>saveEdit(item._id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                      <button onClick={cancelEdit} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <Link to={`/admin/menu/edit/${item._id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</Link>
                      <button onClick={()=>startEdit(item)} className="px-3 py-1 bg-yellow-400 text-black rounded">Quick Edit</button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ManageMenu;
