import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSchedule, MdAdd, MdEdit, MdDelete, MdSave, MdClose } from "react-icons/md";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

function PickupSchedule() {
  const [data, setData] = useState({ 
    scheduledPickups: [], 
    pickupSettings: {
      defaultTime: "10:00",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPickup, setNewPickup] = useState({ date: "", time: "", courier: "" });
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/pickup-schedule`, {
        headers: { stoken }
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/pickup-schedule`, 
        data.pickupSettings,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setEditing(false);
        alert("Settings saved!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    }
  };

  const handleSchedulePickup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/shipping/schedule-pickup`,
        newPickup,
        { headers: { stoken } }
      );
      if (res.data.success) {
        setShowModal(false);
        setNewPickup({ date: "", time: "", courier: "" });
        fetchData();
        alert("Pickup scheduled!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to schedule pickup");
    }
  };

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day) => {
    setData(prev => {
      const days = prev.pickupSettings.workingDays || [];
      if (days.includes(day)) {
        return { ...prev, pickupSettings: { ...prev.pickupSettings, workingDays: days.filter(d => d !== day) } };
      } else {
        return { ...prev, pickupSettings: { ...prev.pickupSettings, workingDays: [...days, day] } };
      }
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Scheduled": return "bg-blue-100 text-blue-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pickup Schedule</h1>
          <p className="text-sm text-gray-500">Manage courier pickup times and schedules</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd /> Schedule Pickup
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Pickup Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiClock className="text-blue-500" /> Default Pickup Settings
              </h3>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                  >
                    <MdClose /> Cancel
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <MdSave /> Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                >
                  <MdEdit /> Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Pickup Time</label>
                <input
                  type="time"
                  value={data.pickupSettings?.defaultTime || "10:00"}
                  onChange={(e) => setData(prev => ({ 
                    ...prev, 
                    pickupSettings: { ...prev.pickupSettings, defaultTime: e.target.value } 
                  }))}
                  disabled={!editing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => editing && toggleDay(day)}
                      disabled={!editing}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        data.pickupSettings?.workingDays?.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      } ${!editing && 'cursor-not-allowed'}`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Pickups */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiCalendar className="text-green-500" /> Scheduled Pickups
              </h3>
            </div>

            {data.scheduledPickups?.length === 0 ? (
              <div className="p-12 text-center">
                <MdSchedule className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No Pickups Scheduled</h3>
                <p className="text-gray-500 mt-2">Schedule a pickup when you have orders ready to ship</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.scheduledPickups.map((pickup, i) => (
                  <div key={i} className="p-5 flex items-center gap-4 hover:bg-gray-50">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-xs text-blue-600">
                        {new Date(pickup.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {new Date(pickup.date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">{pickup.courier}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                          {pickup.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiClock /> {pickup.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin /> {pickup.address || "Default Address"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{pickup.packages} packages</p>
                      <p className="text-xs text-gray-500">AWB: {pickup.awbNumbers?.length || 0}</p>
                    </div>

                    {pickup.status === "Scheduled" && (
                      <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">
                        <MdDelete />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">📦 Pickup Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Schedule pickups at least 2 hours before the slot for guaranteed pickup</li>
              <li>• Have all packages labeled and ready before the courier arrives</li>
              <li>• Keep AWB numbers handy for handover verification</li>
              <li>• Same-day pickup is available before 2 PM in most cities</li>
            </ul>
          </div>
        </>
      )}

      {/* Schedule Pickup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Schedule New Pickup</h3>
            </div>
            
            <form onSubmit={handleSchedulePickup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={newPickup.date}
                  onChange={(e) => setNewPickup(prev => ({ ...prev, date: e.target.value }))}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                <select
                  value={newPickup.time}
                  onChange={(e) => setNewPickup(prev => ({ ...prev, time: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select time slot</option>
                  <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                  <option value="12:00-14:00">12:00 PM - 2:00 PM</option>
                  <option value="14:00-16:00">2:00 PM - 4:00 PM</option>
                  <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Courier Partner</label>
                <select
                  value={newPickup.courier}
                  onChange={(e) => setNewPickup(prev => ({ ...prev, courier: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select courier</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="BlueDart">BlueDart</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Shiprocket">Shiprocket</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PickupSchedule;
