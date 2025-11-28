import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/communication/admin-messages`)
      .then(res => setMessages(res.data.data))
      .catch(console.error);
  }, []);
  return (
    <div className="container card bg-white shadow-md rounded px-10">
      <h1 className="text-[18px] py-4 font-[600]">Admin Messages</h1>
      <ul>
        {messages.map(m => (
          <li key={m.id}><b>{m.subject}</b>: {m.body} <i>by {m.sender}</i></li>
        ))}
      </ul>
    </div>
  );
}
export default AdminMessages;
