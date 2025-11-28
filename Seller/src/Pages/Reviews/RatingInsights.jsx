import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdStar, MdTrendingUp, MdTrendingDown, MdInfo, MdOutlineSentimentSatisfied, MdOutlineSentimentDissatisfied, MdCategory } from "react-icons/md";
import { FiCalendar, FiBarChart2, FiPieChart, FiArrowDown, FiArrowUp } from "react-icons/fi";

function RatingInsights() {
  const [insights, setInsights] = useState({
    currentRating: 0,
    ratingTrend: [],
    topRatedProducts: [],
    lowRatedProducts: [],
    commonPhrases: { positive: [], negative: [] },
    monthlyBreakdown: [],
    categoryRatings: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("6months");
  const stoken = localStorage.getItem("stoken");

  useEffect(() => {
    fetchInsights();
  }, [period]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // clear data slightly to trigger animation re-renders if needed
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller-panel/reviews/insights?period=${period}`, {
        headers: { stoken }
      });
      if (res.data.success) setInsights(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      // Small timeout to prevent flickering if api is too fast, gives smooth feel
      setTimeout(() => setLoading(false), 300);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MdStar key={i} className={`w-5 h-5 ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`} />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-600 bg-emerald-50";
    if (rating >= 3) return "text-amber-600 bg-amber-50";
    return "text-rose-600 bg-rose-50";
  };

  const maxMonthlyReviews = Math.max(...(insights.monthlyBreakdown?.map(m => m.count) || [1]));

  // --- Skeleton Component for Loading State ---
  const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rating Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor your product performance and customer sentiment.</p>
        </div>
        
        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-gray-700 transition-all cursor-pointer hover:border-gray-300 appearance-none"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {loading ? (
        // --- Loading State UI ---
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-40 col-span-1 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-64 col-span-1 md:col-span-4 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Main Rating Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg col-span-1 md:col-span-2 transform transition hover:-translate-y-1 duration-300">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-blue-100 font-medium mb-1">Overall Rating</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-5xl font-bold tracking-tighter">{insights.currentRating?.toFixed(1) || '0.0'}</h2>
                    <div className="flex text-yellow-300 text-xl">
                      {renderStars(insights.currentRating)}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-md ${insights.ratingChange >= 0 ? 'bg-white/20 text-white' : 'bg-red-500/30 text-white'}`}>
                    {insights.ratingChange >= 0 ? <FiArrowUp /> : <FiArrowDown />}
                    <span>{Math.abs(insights.ratingChange || 0).toFixed(2)}</span>
                </div>
              </div>
              <p className="relative z-10 mt-6 text-sm text-blue-100 opacity-90">
                Comparison vs previous {period}
              </p>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Total Reviews */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-2">{insights.totalReviews || 0}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FiBarChart2 className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-400">
                <span>In selected period</span>
              </div>
            </div>

            {/* 5-Star Rate */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">5-Star Excellence</p>
                  <h3 className="text-3xl font-bold text-emerald-600 mt-2">{insights.fiveStarRate || 0}%</h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FiPieChart className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-400">
                <span>Satisfaction rate</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rating Trend (Line/Bar Hybrid) */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MdTrendingUp className="text-blue-500" />
                  Rating Trend
                </h3>
              </div>
              
              <div className="h-64 flex items-end gap-4 relative">
                 {/* Background Grid */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-dashed border-gray-100 h-0"></div>)}
                </div>

                {insights.ratingTrend?.length === 0 ? (
                   <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No trend data available</div>
                ) : (
                  insights.ratingTrend?.map((point, i) => (
                    <div key={i} className="group relative flex-1 flex flex-col items-center h-full justify-end z-10">
                      {/* Tooltip */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                        {point.month}: {point.rating?.toFixed(1)} Stars
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full max-w-[40px] flex flex-col justify-end h-full relative">
                         <div 
                            className="w-full bg-gradient-to-t from-orange-400 to-yellow-400 rounded-t-lg transition-all duration-700 ease-out hover:opacity-90"
                            style={{ height: `${(point.rating / 5) * 100}%` }}
                          ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-3 font-medium">{point.month.slice(0,3)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Volume */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <FiBarChart2 className="text-indigo-500"/> Review Volume
              </h3>
              <div className="h-64 flex items-end gap-2">
                {insights.monthlyBreakdown?.map((month, i) => (
                  <div key={i} className="group relative flex-1 flex flex-col items-center h-full justify-end">
                     {/* Tooltip */}
                     <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none z-20">
                        {month.count} reviews
                      </div>

                    <div 
                      className="w-full bg-indigo-100 rounded-t-md hover:bg-indigo-500 transition-colors duration-300"
                      style={{ height: `${(month.count / maxMonthlyReviews) * 100}%`, minHeight: '4px' }}
                    ></div>
                    <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">{month.month.slice(0,3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Section: Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Rated */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                  Top Performers
                </h3>
              </div>
              <div className="divide-y divide-gray-50 flex-1">
                {insights.topRatedProducts?.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No data available</div>
                ) : (
                  insights.topRatedProducts?.map((product, i) => (
                    <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.reviewCount} verified reviews</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center gap-1">
                        {product.rating?.toFixed(1)} <MdStar className="w-3 h-3" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Low Rated */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
                  Needs Attention
                </h3>
              </div>
              <div className="divide-y divide-gray-50 flex-1">
                {insights.lowRatedProducts?.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">Great job! No low rated products.</div>
                ) : (
                  insights.lowRatedProducts?.map((product, i) => (
                    <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.reviewCount} verified reviews</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-sm flex items-center gap-1">
                        {product.rating?.toFixed(1)} <MdStar className="w-3 h-3" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sentiment & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Keywords */}
            <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <MdInfo className="text-blue-400" /> Sentiment Analysis
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
                    <MdOutlineSentimentSatisfied className="text-emerald-500 w-5 h-5"/> What customers love
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {insights.commonPhrases?.positive?.map((phrase, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100 hover:bg-emerald-100 transition-colors">
                        {phrase.word} <span className="opacity-60 ml-1 text-xs">x{phrase.count}</span>
                      </span>
                    ))}
                     {!insights.commonPhrases?.positive?.length && <span className="text-sm text-gray-400">No data available</span>}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100"></div>

                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
                    <MdOutlineSentimentDissatisfied className="text-rose-500 w-5 h-5"/> Pain points
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {insights.commonPhrases?.negative?.map((phrase, i) => (
                      <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium border border-rose-100 hover:bg-rose-100 transition-colors">
                        {phrase.word} <span className="opacity-60 ml-1 text-xs">x{phrase.count}</span>
                      </span>
                    ))}
                    {!insights.commonPhrases?.negative?.length && <span className="text-sm text-gray-400">No data available</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <MdCategory className="text-purple-400" /> By Category
              </h3>
              <div className="space-y-5">
                {insights.categoryRatings?.length > 0 ? insights.categoryRatings.map((cat, i) => {
                  const colorClass = getRatingColor(cat.rating);
                  return (
                    <div key={i} className="group">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700 truncate w-2/3">{cat.category}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${colorClass}`}>
                          {cat.rating?.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                             cat.rating >= 4 ? 'bg-emerald-500' : cat.rating >= 3 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${(cat.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }) : (
                   <div className="text-gray-400 text-sm italic">No category data</div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default RatingInsights;