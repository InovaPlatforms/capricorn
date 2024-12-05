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

type ChannelData = {
  name: string;
  revenue: number;
  growth: number;
};

const channelBreakdown: ChannelData[] = [
  { name: "Elara", revenue: 218.62, growth: -25 },
  { name: "Synth", revenue: 206.79, growth: 8 },
  { name: "Samurai", revenue: 151.45, growth: 246 },
  { name: "Lofi", revenue: 118.71, growth: 0 },
  { name: "House", revenue: 93.80, growth: -5 },
  { name: "Music Mixes", revenue: 85.17, growth: -33 },
  { name: "Panthera", revenue: 53.35, growth: -36 },
  { name: "CyberSound", revenue: 49.54, growth: 18 },
  { name: "AIA", revenue: 45.46, growth: -34 },
  { name: "Disco", revenue: 28.13, growth: -23 },
  { name: "SpaceRace", revenue: 11.61, growth: 0 },
  { name: "Kaz", revenue: 8.64, growth: 0 },
  { name: "California", revenue: 4.82, growth: 8 },
  { name: "Apollo", revenue: 2.02, growth: 0 },
];

const weeklyData = [
  {
    week: "Sep 30 - Oct 6",
    revenue: 837.32,
    revenueGrowth: "N/A",
  },
  {
    week: "Oct 7 - Oct 13",
    revenue: 1028.96,
    revenueGrowth: "22.89",
  },
  {
    week: "Oct 14 - Oct 20",
    revenue: 1189.34,
    revenueGrowth: "15.59",
  },
  {
    week: "Oct 21 - Oct 27",
    revenue: 1234.00,
    revenueGrowth: "3.76",
  },
  {
    week: "Oct 28 - Nov 3",
    revenue: 1293.50,
    revenueGrowth: "4.82",
  },
  {
    week: "Nov 4 - Nov 10",
    revenue: 1078.11,
    revenueGrowth: "-16.65",
  },
];

export default function WeeklyStats() {
  const [activeTab, setActiveTab] = useState<"revenue">("revenue");

  const formatNumber = (num: number) => num.toLocaleString();
  const formatRevenue = (value: number) => `$${value.toLocaleString()}`;
  
  const calculatePercentage = (revenue: number) => {
    const total = channelBreakdown.reduce((sum, channel) => sum + channel.revenue, 0);
    return ((revenue / total) * 100).toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = data.revenue;
      const growth = data.revenueGrowth;

      return (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <p className="text-white font-bold">{label}</p>
          <p className="text-gray-300">{formatRevenue(value)}</p>
          {growth !== "N/A" && (
            <p className="text-green-500">Growth: {Number(growth).toFixed(1)}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-32">
          <h1 className="text-6xl font-bold text-center mb-16 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Weekly Analytics
          </h1>

          {/* Weekly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/10 relative h-full">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Latest Week Revenue
                </h3>
                <div className="text-5xl font-bold mb-2">
                  {formatRevenue(weeklyData[weeklyData.length - 1].revenue)}
                </div>
                <p className="text-green-500">
                  +{weeklyData[weeklyData.length - 1].revenueGrowth}% from previous week
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/10 relative h-full">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Average Weekly Growth
                </h3>
                <div className="text-5xl font-bold mb-2">
                  {(weeklyData.reduce((sum, week) => 
                    sum + (week.revenueGrowth === "N/A" ? 0 : Number(week.revenueGrowth)), 
                    0) / (weeklyData.length - 1)).toFixed(1)}%
                </div>
                <p className="text-gray-400">Calculated from {weeklyData.length} weeks</p>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="relative mb-8 md:mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/10 via-stone-500/10 to-neutral-500/10 rounded-2xl blur-2xl" />
            <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Weekly Revenue Trend
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="#ffffff50" />
                    <YAxis 
                      stroke="#ffffff50" 
                      tickFormatter={formatRevenue}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#fff"
                      strokeWidth={2}
                      dot={{ fill: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* New Average Growth Rate Section - improved mobile layout */}
            <div className="mt-4 md:mt-8 px-2 md:px-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/10 relative h-full text-center">
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {(weeklyData.reduce((sum, week) => 
                      sum + (week.revenueGrowth === "N/A" ? 0 : Number(week.revenueGrowth)), 
                      0) / (weeklyData.length - 1)).toFixed(1)}%
                  </div>
                  <p className="text-gray-400 text-xs md:text-base">Average Weekly Revenue Growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Channel Breakdown */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/10 via-stone-500/10 to-neutral-500/10 rounded-2xl blur-2xl" />
            <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Channel Revenue Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {channelBreakdown.map((channel, index) => (
                  <div key={channel.name} className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white/80 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white/90">{channel.name}</h4>
                        <p className="text-2xl font-bold text-white/80">
                          {formatRevenue(channel.revenue)}
                          <span className="text-sm ml-2 text-white/60">
                            ({calculatePercentage(channel.revenue)}%)
                          </span>
                        </p>
                        <p className={`text-sm ${channel.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {channel.growth >= 0 ? '+' : ''}{channel.growth}% vs previous week
                        </p>
                      </div>
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

