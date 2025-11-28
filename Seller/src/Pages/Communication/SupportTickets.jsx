import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/communication/support-tickets`)
      .then(res => setTickets(res.data.data))
      .catch(console.error);
  }, []);
  return (
    <div className="container card bg-white shadow-md rounded px-10">
      <h1 className="text-[18px] py-4 font-[600]">Support Tickets</h1>
      <ul>
        {tickets.map(t => (
          <li key={t.id}><b>{t.user}</b>: {t.issue} <i>({t.status})</i></li>
        ))}
      </ul>
    </div>
  );
}
export default SupportTickets;
