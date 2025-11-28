import React, { useEffect, useState } from 'react';
import { FiShoppingBag, FiDollarSign, FiTrendingUp, FiPackage } from "react-icons/fi";
import axios from 'axios';

export default function DashBordBox() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/dashboard-stats`, {
          headers: {
            stoken: localStorage.getItem("stoken")
          }
        });
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return "₹0";
    }

    const wholeValue = Math.round(parsed);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(wholeValue);
  };

  const cards = [
    {
      icon: FiShoppingBag,
      label: 'New Orders',
      amount: stats.totalOrders,
      trend: '+12%',
      trendUp: true,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      icon: FiDollarSign,
      label: 'Total Sales',
      amount: formatCurrency(stats.totalSales),
      trend: '+8.2%',
      trendUp: true,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: FiTrendingUp,
      label: 'Revenue',
      amount: formatCurrency(stats.totalRevenue),
      trend: '+15%',
      trendUp: true,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      icon: FiPackage,
      label: 'Products',
      amount: stats.totalProducts,
      trend: '+3',
      trendUp: true,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((item, index) => {
        const Icon = item.icon;
        return (
          <div 
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-soft
                      hover:shadow-card-hover hover:border-gray-300
                      transition-all duration-200 ease-out"
          >
            {/* Top row: Icon and Trend */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 ${item.iconBg} rounded-xl`}>
                <Icon className={`text-xl ${item.iconColor}`} />
              </div>
              <span className={`
                text-xs font-medium px-2 py-1 rounded-full
                ${item.trendUp 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-red-50 text-red-700'}
              `}>
                {item.trend}
              </span>
            </div>
            
            {/* Label */}
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              {item.label}
            </p>
            
            {/* Amount */}
            <h3 className="text-2xl font-bold text-gray-900">
              {item.amount}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
