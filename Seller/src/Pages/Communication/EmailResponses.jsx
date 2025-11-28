import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmailResponses() {
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/communication/email-responses`)
      .then(res => setEmails(res.data.data))
      .catch(console.error);
  }, []);
  return (
    <div className="container card bg-white shadow-md rounded px-10">
      <h1 className="text-[18px] py-4 font-[600]">Email Responses</h1>
      <ul>
        {emails.map(e => (
          <li key={e.id}><b>{e.email}</b>: {e.subject} — {e.response}</li>
        ))}
      </ul>
    </div>
  );
}
export default EmailResponses;
