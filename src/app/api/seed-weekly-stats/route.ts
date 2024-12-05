import { NextResponse } from 'next/server';
import { supabase } from '@/config/supabase';

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

export async function POST() {
  try {
    console.log('Starting to update weekly stats...');
    
    // Delete existing records
    const { error: deleteError } = await supabase
      .from('weekly_stats')
      .delete()
      .gte('id', 0);

    if (deleteError) throw deleteError;

    // Insert new data
    const { data, error } = await supabase
      .from('weekly_stats')
      .insert(weeklyData)
      .select();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Weekly stats updated successfully'
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
