import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";

const EditMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
  const res = await API.get(`/menu/${id}`);
        setFormData({
          name: res.data.name,
          price: res.data.price,
          category: res.data.category,
        });
        setPreview(res.data.imageUrl || res.data.image);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("category", formData.category);
      if (image) form.append("image", image);

      await API.put(`/menu/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/manage-menu");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 mt-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Menu Item</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="border p-2 w-full rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            name="price"
            className="border p-2 w-full rounded"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            className="border p-2 w-full rounded"
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Starters">Starters</option>
            <option value="Main Course">Main Course</option>
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Image</label>
          <input type="file" onChange={handleImageChange} />
          {preview && <img src={preview} alt="" className="w-24 h-24 mt-2 rounded object-cover" />}
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditMenuItem;
