'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, DollarSign, Eye } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from '@/components/Header';

// Define the growth rate calculation function before using it
const calculateGrowthRate = (current: number, previous: number) => {
  return previous ? (((current - previous) / previous) * 100).toFixed(2) : "N/A";
};

// Update monthlyData with all months
const monthlyData = [
  {
    month: "March",
    views: 66768,
    watchTime: 1256,
    revenue: 94,
    viewsGrowth: "N/A",
    watchTimeGrowth: "N/A",
    revenueGrowth: "N/A",
  },
  {
    month: "April",
    views: 143781,
    watchTime: 3274,
    revenue: 193,
    viewsGrowth: calculateGrowthRate(143781, 66768),
    watchTimeGrowth: calculateGrowthRate(3274, 1256),
    revenueGrowth: calculateGrowthRate(193, 94),
  },
  {
    month: "May",
    views: 220000,
    watchTime: 5800,
    revenue: 487,
    viewsGrowth: calculateGrowthRate(220000, 143781),
    watchTimeGrowth: calculateGrowthRate(5800, 3274),
    revenueGrowth: calculateGrowthRate(487, 193),
  },
  {
    month: "June",
    views: 249000,
    watchTime: 12300,
    revenue: 670,
    viewsGrowth: calculateGrowthRate(249000, 220000),
    watchTimeGrowth: calculateGrowthRate(12300, 5800),
    revenueGrowth: calculateGrowthRate(670, 487),
  },
  {
    month: "July",
    views: 525000,
    watchTime: 33965,
    revenue: 1170,
    viewsGrowth: calculateGrowthRate(525000, 249000),
    watchTimeGrowth: calculateGrowthRate(33965, 12300),
    revenueGrowth: calculateGrowthRate(1170, 670),
  },
  {
    month: "August",
    views: 582600,
    watchTime: 61500,
    revenue: 1576,
    viewsGrowth: calculateGrowthRate(582600, 525000),
    watchTimeGrowth: calculateGrowthRate(61500, 33965),
    revenueGrowth: calculateGrowthRate(1576, 1170),
  },
  {
    month: "September",
    views: 1137100,
    watchTime: 434500,
    revenue: 2950,
    viewsGrowth: calculateGrowthRate(1137100, 582600),
    watchTimeGrowth: calculateGrowthRate(434500, 61500),
    revenueGrowth: calculateGrowthRate(2950, 1576),
  },
  {
    month: "October",
    views: 1698000,
    watchTime: 193860,
    revenue: 4956,
    viewsGrowth: calculateGrowthRate(1698000, 1137100),
    watchTimeGrowth: calculateGrowthRate(193860, 434500),
    revenueGrowth: calculateGrowthRate(4956, 2950),
  },
  {
    month: "November",
    views: 1850200,
    watchTime: 214378.2,
    revenue: 5422.96,
    viewsGrowth: calculateGrowthRate(1850200, 1698000),
    watchTimeGrowth: calculateGrowthRate(214378.2, 193860),
    revenueGrowth: calculateGrowthRate(5422.96, 4956),
  },
];

export default function Stats() {
  const [activeTab, setActiveTab] = useState<"views" | "watchTime" | "revenue">("revenue");

  const formatNumber = (num: number) => num.toLocaleString();
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  const formatRevenue = (value: number) => `$${value.toLocaleString()}`;

  const calculateAverageMonthlyGrowthRate = (dataKey: string) => {
    const growthRates = monthlyData
      .slice(1)
      .map((data) => parseFloat(data[`${dataKey}Growth` as keyof typeof data] as string))
      .filter((rate) => !isNaN(rate));

    const averageGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    return Math.round(averageGrowthRate);
  };

  // Update CustomTooltip to show growth rates
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const metricKey = activeTab;
      const growthKey = `${activeTab}Growth` as keyof typeof data;
      const value = data[metricKey];
      const formattedValue = activeTab === "revenue" ? formatRevenue(value) : formatNumber(value);
      const roundedGrowth = Math.round(parseFloat(data[growthKey] as string));

      return (
        <div className="bg-white backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg">
          <p className="text-black font-bold">{label}</p>
          <p className="text-gray-600">{formattedValue}</p>
          {!isNaN(roundedGrowth) && (
            <p className="text-emerald-600">Growth: {roundedGrowth}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-x-hidden pt-16">
        <div className="container mx-auto px-4 py-8 md:py-32">
          {/* Responsive title */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 md:mb-16 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>

          {/* Stats Grid - adjusted padding and text size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
            {[
              { number: formatNumber(monthlyData.reduce((sum, m) => sum + m.views, 0)), label: "Total Views" },
              { number: formatRevenue(monthlyData[monthlyData.length - 1].revenue), label: "Latest Revenue" },
              { number: formatNumber(monthlyData.reduce((sum, m) => sum + m.watchTime, 0)), label: "Watch Hours" }
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 md:p-8 border border-white/10 relative h-full text-center">
                  <div className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <p className="text-gray-400 text-base md:text-lg">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section - improved mobile layout */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/10 via-stone-500/10 to-neutral-500/10 rounded-2xl blur-2xl" />
            <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-white/10">
              {/* Tabs - fixed visibility and responsive layout */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
                {[
                  { key: "views", label: "Views" },
                  { key: "watchTime", label: "Watch Time" },
                  { key: "revenue", label: "Revenue" }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-4 md:px-6 py-2 rounded-full border transition-colors text-sm md:text-base
                      ${activeTab === tab.key 
                        ? "bg-white/20 md:bg-white/10 text-white border-white/20" 
                        : "bg-black/40 md:bg-white/[0.03] hover:bg-white/[0.06] text-white border-white/10"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Chart - adjusted height for mobile */}
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#ffffff50" />
                    <YAxis 
                      stroke="#ffffff50" 
                      tickFormatter={activeTab === "revenue" ? formatRevenue : formatYAxis}
                      domain={activeTab === "watchTime" ? [0, 450000] : ['auto', 'auto']}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey={activeTab}
                      stroke="#fff"
                      strokeWidth={2}
                      dot={{ fill: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                      label={({ x, y, value }) => (
                        <text
                          x={x}
                          y={y}
                          dy={-10}
                          fill="#fff"
                          fontSize={12}
                          textAnchor="middle"
                        >
                          {activeTab === "revenue" ? formatRevenue(value as number) : formatYAxis(value as number)}
                        </text>
                      )}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* New Average Growth Rate Section - improved mobile layout */}
              <div className="mt-4 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 px-2 md:px-0">
                {[
                  { key: "views", label: "Average Views Growth" },
                  { key: "watchTime", label: "Average Watch Time Growth" },
                  { key: "revenue", label: "Average Revenue Growth" }
                ].map((metric) => (
                  <div key={metric.key} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/10 relative h-full text-center">
                      <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        {calculateAverageMonthlyGrowthRate(metric.key)}%
                      </div>
                      <p className="text-gray-400 text-xs md:text-base">{metric.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 

//