// SearchBox.jsx
import React from 'react';
import { LuSearch } from "react-icons/lu";

function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="w-full">
      <div className="relative">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchBox;
