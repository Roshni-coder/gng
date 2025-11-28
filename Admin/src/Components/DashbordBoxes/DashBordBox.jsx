import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { GoGift } from "react-icons/go";
import { FaChartSimple } from "react-icons/fa6";
import { LiaChartPieSolid } from "react-icons/lia";
import { BsBank2 } from "react-icons/bs";
import { TbBrandProducthunt } from "react-icons/tb";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"; // <- for arrow icons
import { Navigation } from 'swiper/modules';
import axios from 'axios';

export default function DashBordBox() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalSellers: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`);
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  const cards = [
    {
      icon: <GoGift className='text-[35px] text-[#3872fa]' />,
      label: 'New Orders',
      amount: stats.totalOrders,
      chartColor: '#3872fa'
    },
    {
      icon: <LiaChartPieSolid className='text-[45px] text-[#10b981]' />,
      label: 'Sales',
      amount: stats.totalRevenue,
      chartColor: '#10b981'
    },
    {
      icon: <TbBrandProducthunt className='text-[45px] text-[#7928ca]' />,
      label: 'Total Products',
      amount: stats.totalProducts,
      chartColor: '#7928ca'
    },
    {
      icon: <BsBank2 className='text-[35px] text-[#f59e0b]' />,
      label: 'Sellers',
      amount: stats.totalSellers,
      chartColor: '#f59e0b'
    }
  ];

  return (
    <div className="relative">
      <Swiper
        navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
        modules={[Navigation]}
        spaceBetween={15}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
        className="dashboardBoxesSlider"
      >
        {cards.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white p-4 sm:p-5 cursor-pointer rounded-md border border-[rgba(0,0,0,0.1)] flex px-10  sm:flex-row items-center gap-4 h-full">
              {item.icon}
              <div className="info text-center sm:text-left w-full sm:w-[70%]">
                <h3 className="text-sm sm:text-base font-medium">{item.label}</h3>
                <b className="text-lg sm:text-xl">
                  {typeof item.amount === 'number' ? item.amount.toLocaleString('en-IN') : item.amount}
                </b>
              </div>
              <FaChartSimple className={`text-[40px] sm:text-[50px]`} style={{ color: item.chartColor }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Arrows */}
      <div className="custom-prev absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-gray-500/80 text-white w-5 h-12 flex items-center justify-center rounded- cursor-pointer shadow">
        <HiChevronLeft size={20} />
      </div>
      <div className="custom-next absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-gray-500/80 text-white w-5 h-12 flex items-center justify-center rounded cursor-pointer shadow">
        <HiChevronRight size={20} />
      </div>
    </div>
  );
}

