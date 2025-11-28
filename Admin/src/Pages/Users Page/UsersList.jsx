import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBox from "../../Components/SearchBox/SearchBox.jsx";

function UsersList() {
  const [users, setUsers] = useState([]);
  const stoken=localStorage.getItem('stoken')||null
  const [searchTerm, setSearchTerm] = useState("");
const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    console.log(users);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/users-list`,{headers:{stoken}});
      if (res.data.success) {
        setUsers(res.data.users);
      } else {
        console.log("No users found");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  return (
    <div className="products shadow-md rounded-md py-2 !px-5 bg-white">
     <h2 className="text-xl md:text-2xl font-semibold py-2 sm:text-left text-center">Users List</h2>
      <div className="py-2">
             <div className="w-full ">
               <SearchBox
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search Users..." />
             </div>
           </div>

      <div className="relative pb-5 overflow-auto max-h-[550px] mt-5">
        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-500">
          <thead className="text-xs uppercase text-[12px] bg-gray-100 !text-[rgba(0,0,0,0.8)]">
            <tr>
              <th className="!px-6 py-4 ">Full Name</th>
              <th className="!px-6 py-4 whitespace-nowrap">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersList;