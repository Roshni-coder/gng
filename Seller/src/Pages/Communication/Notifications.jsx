import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/communication/notifications`)
      .then(res => setNotifications(res.data.data))
      .catch(console.error);
  }, []);
  return (
    <div className="container card bg-white shadow-md rounded px-10">
      <h1 className="text-[18px] py-4 font-[600]">Notifications</h1>
      <ul>
        {notifications.map(n => (
          <li key={n.id}><b>{n.title}</b> {n.read ? '(Read)' : '(Unread)'}</li>
        ))}
      </ul>
    </div>
  );
}
export default Notifications;
