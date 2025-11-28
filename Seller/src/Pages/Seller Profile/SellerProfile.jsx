import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

function SellerProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const stoken = localStorage.getItem("stoken");

  const getProfile = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/profile`,
        { headers: { stoken: stoken } }
      );

      if (data.success) {
        setProfile(data.seller);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [e.target.name]: e.target.value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone", profile.phone);
    formData.append("email", profile.email);

    if (profile.address) {
      formData.append("street", profile.address.street);
      formData.append("city", profile.address.city);
      formData.append("state", profile.address.state);
      formData.append("pincode", profile.address.pincode);
    }

    if (imageFile) formData.append("image", imageFile);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/updateprofile`,
        formData,
        {
          headers: {
            stoken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setEditing(false);
        getProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <>
      {/* PROFILE CARD */}
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Profile Image */}
        <div className="flex items-center gap-6">
          <img
            src={
              imagePreview || profile.image || "https://via.placeholder.com/120"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600">{profile.phone || "No phone added"}</p>
            {profile.address && (
              <p className="text-gray-600">
                {profile.address.street}, {profile.address.city},{" "}
                {profile.address.state} - {profile.address.pincode}
              </p>
            )}
          </div>
        </div>

        <button
          className="mt-4 text-blue-600 border px-4 py-1 rounded"
          onClick={() => setEditing(true)}
        >
          Edit Profile
        </button>
      </div>

      {/* EDIT FORM */}
      {editing && (
        <div className="container mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold mb-4">Update Profile</h3>

            {/* IMAGE UPLOAD */}
            <label className="block mb-4">
              <span>Profile Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </label>

            {/* NAME & PHONE */}
            <div className="flex gap-4">
              <TextField
                name="name"
                label="Full Name"
                value={profile.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="phone"
                label="Phone"
                value={profile.phone || ""}
                onChange={handleChange}
                fullWidth
              />
            </div>

            {/* EMAIL */}
            <div className="mt-4">
              <TextField
                name="email"
                label="Email"
                value={profile.email}
                onChange={handleChange}
                fullWidth
              />
            </div>

            {/* ADDRESS */}
            <h3 className="mt-6 mb-2 font-semibold">Address</h3>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                name="street"
                label="Street"
                value={profile.address?.street || ""}
                onChange={handleAddressChange}
              />
              <TextField
                name="city"
                label="City"
                value={profile.address?.city || ""}
                onChange={handleAddressChange}
              />
              <TextField
                name="state"
                label="State"
                value={profile.address?.state || ""}
                onChange={handleAddressChange}
              />
              <TextField
                name="pincode"
                label="Pincode"
                value={profile.address?.pincode || ""}
                onChange={handleAddressChange}
              />
            </div>

            {/* SAVE BUTTON */}
            <div className="text-center mt-6">
              <Button
                type="submit"
                variant="contained"
                className="!bg-blue-600 !px-10 !py-2"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default SellerProfile;
