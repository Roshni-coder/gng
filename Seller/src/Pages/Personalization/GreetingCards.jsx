import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdMail } from "react-icons/md";
import { FiImage, FiCheck } from "react-icons/fi";

function GreetingCards() {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    image: "",
    isActive: true
  });
  const stoken = localStorage.getItem("stoken");

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/greeting-cards`, {
        headers: { stoken }
      });
      if (res.data.success) {
        setCards(res.data.data.cards || []);
        setCategories(res.data.data.categories || ["Birthday", "Anniversary", "Thank You", "Congratulations", "Get Well", "Holiday"]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCard) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/greeting-cards/${editingCard._id}`, formData, {
          headers: { stoken }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/greeting-cards`, formData, {
          headers: { stoken }
        });
      }
      fetchCards();
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this greeting card?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/personalization/greeting-cards/${id}`, {
        headers: { stoken }
      });
      fetchCards();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const openEditModal = (card) => {
    setEditingCard(card);
    setFormData({
      name: card.name || "",
      category: card.category || "",
      price: card.price || 0,
      image: card.image || "",
      isActive: card.isActive !== false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCard(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      image: "",
      isActive: true
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Birthday": "bg-pink-100 text-pink-600",
      "Anniversary": "bg-red-100 text-red-600",
      "Thank You": "bg-blue-100 text-blue-600",
      "Congratulations": "bg-green-100 text-green-600",
      "Get Well": "bg-yellow-100 text-yellow-600",
      "Holiday": "bg-purple-100 text-purple-600"
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  const groupedCards = categories.reduce((acc, cat) => {
    acc[cat] = cards.filter(c => c.category === cat);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Greeting Cards</h1>
          <p className="text-sm text-gray-500">Offer greeting cards for special occasions</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd className="text-xl" /> Add Card
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <MdMail className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Greeting Cards</h3>
          <p className="text-gray-500 mt-2 mb-4">Add cards for birthdays, anniversaries, and more</p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Add First Card
          </button>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <a
                key={cat}
                href={`#${cat}`}
                className={`px-4 py-2 rounded-xl whitespace-nowrap ${getCategoryColor(cat)}`}
              >
                {cat} ({groupedCards[cat]?.length || 0})
              </a>
            ))}
          </div>

          {/* Cards by Category */}
          {categories.map(category => groupedCards[category]?.length > 0 && (
            <div key={category} id={category} className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedCards[category].map((card, i) => (
                  <div 
                    key={i} 
                    className={`bg-white border rounded-xl overflow-hidden transition-all ${
                      card.isActive ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Card Image */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 relative">
                      {card.image ? (
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MdMail className="text-5xl text-blue-300" />
                        </div>
                      )}
                      
                      {!card.isActive && (
                        <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
                          Inactive
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 truncate">{card.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(card.category)}`}>
                          {card.category}
                        </span>
                        <span className="font-semibold text-green-600">
                          {card.price > 0 ? formatINR(card.price) : 'Free'}
                        </span>
                      </div>

                      <div className="flex gap-1 mt-3">
                        <button 
                          onClick={() => openEditModal(card)}
                          className="flex-1 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 flex items-center justify-center gap-1"
                        >
                          <MdEdit className="text-sm" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(card._id)}
                          className="py-1.5 px-2 bg-red-50 rounded-lg text-sm text-red-600 hover:bg-red-100"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">💌 Greeting Card Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep a variety of cards for different occasions</li>
              <li>• Update seasonal cards for holidays</li>
              <li>• Use high-quality card images</li>
              <li>• Offer a range of price points</li>
            </ul>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCard ? 'Edit Greeting Card' : 'Add Greeting Card'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="Happy Birthday Wishes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                  min="0"
                />
              </div>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <span className="text-gray-700">Active</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  {editingCard ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GreetingCards;
