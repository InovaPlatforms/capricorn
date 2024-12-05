import { NextResponse } from 'next/server';
import { supabase } from '@/config/supabase';

const monthlyData = [
  {
    month: "March",
    views: 66768,
    watch_time: 1256,
    revenue: 94,
    views_growth: "N/A",
    watch_time_growth: "N/A",
    revenue_growth: "N/A",
  },
  {
    month: "April",
    views: 143781,
    watch_time: 3274,
    revenue: 193,
    views_growth: "115.35",
    watch_time_growth: "160.67",
    revenue_growth: "105.32",
  },
  {
    month: "May",
    views: 220000,
    watch_time: 5800,
    revenue: 487,
    views_growth: "53.00",
    watch_time_growth: "77.15",
    revenue_growth: "152.33",
  },
  {
    month: "June",
    views: 249000,
    watch_time: 12300,
    revenue: 670,
    views_growth: "13.18",
    watch_time_growth: "112.07",
    revenue_growth: "37.58",
  },
  {
    month: "July",
    views: 525000,
    watch_time: 33965,
    revenue: 1170,
    views_growth: "110.84",
    watch_time_growth: "176.14",
    revenue_growth: "74.63",
  },
  {
    month: "August",
    views: 582600,
    watch_time: 61500,
    revenue: 1576,
    views_growth: "10.97",
    watch_time_growth: "81.07",
    revenue_growth: "34.70",
  },
  {
    month: "September",
    views: 1137100,
    watch_time: 434500,
    revenue: 2950,
    views_growth: "95.18",
    watch_time_growth: "606.50",
    revenue_growth: "87.18",
  },
  {
    month: "October",
    views: 1698000,
    watch_time: 193860,
    revenue: 4956,
    views_growth: "49.33",
    watch_time_growth: "-55.38",
    revenue_growth: "67.99",
  }
];

export async function POST() {
  try {
    console.log('Starting to update monthly stats...');
    
    // Delete all existing records
    const { error: deleteError } = await supabase
      .from('monthly_stats')
      .delete()
      .gte('id', 0);

    if (deleteError) {
      console.error('Error deleting existing data:', deleteError);
      throw deleteError;
    }

    console.log('Existing data cleared successfully');
    
    // Insert new data
    const { data, error } = await supabase
      .from('monthly_stats')
      .insert(monthlyData)
      .select();

    if (error) {
      console.error('Error inserting new data:', error);
      throw error;
    }

    console.log('Data updated successfully:', data);
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Monthly stats updated successfully'
    });
  } catch (error: any) {
    console.error('Error in update operation:', error);
    return NextResponse.json({ 
      error: error.message,
      success: false 
    }, { 
      status: 500 
    });
  }
} 