'use client';
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Loader, AlertCircle, Plus, Minus, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from 'react-hot-toast';
import { getBucketStats, launchECSTask, getRunningTasks } from "@/utils/aws-services";

interface InstanceType {
  name: string;
  taskDefinition: string;
  maxInstances: number;
  schedule: string;
}

interface Props {
  artistId: string;
  artistName: string;
  bucketName: string;
}

interface LaunchProgress {
  launched: number;
  total: number;
  status: string;
  logs: string[];
}

interface LaunchStatus {
  id: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: string;
}

interface AWSError {
  code?: string;
  message?: string;
}

export default function ArtistLaunchInstances({ artistId, artistName, bucketName }: Props) {
  const [instanceCounts, setInstanceCounts] = useState<Record<string, number>>({});
  const [launchingStates, setLaunchingStates] = useState<Record<string, boolean>>({});
  const [launchResults, setLaunchResults] = useState<Record<string, string | null>>({});
  const [timeUntilNextLaunch, setTimeUntilNextLaunch] = useState<Record<string, string>>({});
  const [instanceTypes, setInstanceTypes] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, LaunchProgress>>({});
  const [launchStatuses, setLaunchStatuses] = useState<LaunchStatus[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const getInstanceTypes = useCallback(() => {
    return [
      {
        name: "Audio Mixing",
        taskDefinition: `Audio_Mixing_${bucketName}`,
        maxInstances: 100,
        schedule: "1:00 AM",
      },
      {
        name: "Video Mix",
        taskDefinition: `Video_Mix_${bucketName}`,
        maxInstances: 100,
        schedule: "2:00 AM",
      },
      {
        name: "YouTube Upload",
        taskDefinition: `YouTube_Upload_${bucketName}`,
        maxInstances: 1,
        schedule: "9:10 AM",
      },
    ];
  }, [bucketName]);

  useEffect(() => {
    setInstanceTypes(getInstanceTypes());
  }, [getInstanceTypes]);

  useEffect(() => {
    // Initialize states for each instance type
    const counts: Record<string, number> = {};
    const states: Record<string, boolean> = {};
    const results: Record<string, string | null> = {};
    const times: Record<string, string> = {};

    instanceTypes.forEach(type => {
      counts[type.taskDefinition] = 1;
      states[type.taskDefinition] = false;
      results[type.taskDefinition] = null;
      times[type.taskDefinition] = calculateTimeUntilNextLaunch(type.schedule);
    });

    setInstanceCounts(counts);
    setLaunchingStates(states);
    setLaunchResults(results);
    setTimeUntilNextLaunch(times);

    // Update times every minute
    const interval = setInterval(() => {
      const updatedTimes: Record<string, string> = {};
      instanceTypes.forEach(type => {
        updatedTimes[type.taskDefinition] = calculateTimeUntilNextLaunch(type.schedule);
      });
      setTimeUntilNextLaunch(updatedTimes);
    }, 60000);

    return () => clearInterval(interval);
  }, [instanceTypes]);

  function calculateTimeUntilNextLaunch(schedule: string): string {
    const [time, period] = schedule.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    let scheduleHours = hours;

    if (period === "PM" && hours !== 12) scheduleHours += 12;
    if (period === "AM" && hours === 12) scheduleHours = 0;

    let nextLaunch = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      scheduleHours,
      minutes
    );

    if (nextLaunch <= now) {
      nextLaunch.setDate(nextLaunch.getDate() + 1);
    }

    const diff = nextLaunch.getTime() - now.getTime();
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursUntil}h ${minutesUntil}m`;
  }

  const handleCountChange = (taskDefinition: string, value: string) => {
    // Update the input value directly
    setInputValues(prev => ({
      ...prev,
      [taskDefinition]: value
    }));

    // Only update instance count if it's a valid number
    if (value !== '') {
      const numValue = parseInt(value) || 1;
      const boundedValue = Math.max(numValue, 1);
      
      setInstanceCounts(prev => ({
        ...prev,
        [taskDefinition]: boundedValue
      }));
    }
  };

  const addLaunchStatus = (status: LaunchStatus) => {
    setLaunchStatuses(prev => [status, ...prev].slice(0, 50));
  };

  const launchWithRetry = async (taskDefinition: string, retries = 3) => {
    try {
      await launchECSTask(taskDefinition);
    } catch (error: any) {
      if (error?.code === 'ThrottlingException' && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return launchWithRetry(taskDefinition, retries - 1);
      }
      throw error;
    }
  };

  const handleLaunchInstance = async (instance: any) => {
    const count = instanceCounts[instance.taskDefinition] || 1;
    setLaunchingStates(prev => ({ ...prev, [instance.taskDefinition]: true }));
    
    try {
      const response = await fetch('/api/launch-ecs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDefinition: instance.taskDefinition,
          count
        })
      });

      if (!response.ok) throw new Error('Failed to start launch process');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        try {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(5));
                // Update progress based on the message
                setProgress(prev => ({
                  ...prev,
                  [instance.taskDefinition]: {
                    ...prev[instance.taskDefinition],
                    logs: [data.message, ...(prev[instance.taskDefinition]?.logs || [])]
                  }
                }));
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error reading stream:', error);
          break;
        }
      }
    } catch (error) {
      console.error('Launch error:', error);
      toast.error('Failed to launch instances. Please try again.');
    } finally {
      setLaunchingStates(prev => ({ ...prev, [instance.taskDefinition]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {instanceTypes.map((instance) => (
        <motion.div
          key={instance.taskDefinition}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/10 relative">
            <h3 className="text-2xl font-bold text-white/90 mb-4">
              {instance.name}
            </h3>
            
            <div className="flex items-center justify-between bg-black/20 rounded-lg p-3 mb-4">
              <button
                onClick={() => handleCountChange(
                  instance.taskDefinition, 
                  String(Math.max(1, (instanceCounts[instance.taskDefinition] || 1) - 1))
                )}
                className="p-1.5 rounded-md border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Minus size={14} className="text-white/80" />
              </button>
              
              <input
                type="number"
                value={inputValues[instance.taskDefinition] ?? (instanceCounts[instance.taskDefinition] || 1)}
                onChange={(e) => handleCountChange(instance.taskDefinition, e.target.value)}
                onBlur={(e) => {
                  // On blur, if empty or invalid, set to 1
                  const value = e.target.value === '' ? '1' : e.target.value;
                  handleCountChange(instance.taskDefinition, value);
                }}
                className="w-16 bg-black/30 border border-white/10 rounded-md px-2 py-1 
                         text-center text-lg font-medium [appearance:textfield] 
                         [&::-webkit-outer-spin-button]:appearance-none 
                         [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
              />
              
              <button
                onClick={() => handleCountChange(
                  instance.taskDefinition, 
                  String((instanceCounts[instance.taskDefinition] || 1) + 1)
                )}
                className="p-1.5 rounded-md border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Plus size={14} className="text-white/80" />
              </button>
            </div>

            <button
              onClick={() => handleLaunchInstance(instance)}
              disabled={launchingStates[instance.taskDefinition]}
              className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 
                        disabled:cursor-not-allowed text-white py-3 rounded-lg 
                        transition-colors flex items-center justify-center gap-2"
            >
              {launchingStates[instance.taskDefinition] ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>Launching...</span>
                </>
              ) : (
                <>
                  <PlayCircle size={18} />
                  <span>Launch {instanceCounts[instance.taskDefinition] || 1} Instance{instanceCounts[instance.taskDefinition] > 1 ? 's' : ''}</span>
                </>
              )}
            </button>

            {launchResults[instance.taskDefinition] && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                launchResults[instance.taskDefinition]?.includes('Error') 
                  ? 'bg-red-500/10 text-red-400' 
                  : 'bg-green-500/10 text-green-400'
              }`}>
                {launchResults[instance.taskDefinition]?.includes('Error') ? (
                  <AlertCircle className="inline-block mr-2" size={14} />
                ) : (
                  <PlayCircle className="inline-block mr-2" size={14} />
                )}
                {launchResults[instance.taskDefinition]}
              </div>
            )}

            {progress[instance.taskDefinition] && (
              <div className="mt-4">
                <div className="w-full bg-black/50 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-gold-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: `${(progress[instance.taskDefinition].launched / progress[instance.taskDefinition].total) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-center text-gold-400 mb-2">
                  {progress[instance.taskDefinition].status}
                </div>
                {/* Launch Logs */}
                <div className="mt-2 bg-black/30 rounded-lg p-2 max-h-32 overflow-y-auto text-xs font-mono">
                  {progress[instance.taskDefinition].logs.map((log, index) => (
                    <div key={index} className="text-gold-400">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Launch Status Feed */}
            {launchStatuses.filter(status => 
              status.message.includes(instance.taskDefinition)
            ).length > 0 && (
              <div className="mt-4 bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                <h4 className="text-sm font-medium mb-2 sticky top-0 bg-black/20 p-2 rounded-lg z-10">
                  Launch Status
                </h4>
                <div className="space-y-2">
                  {launchStatuses
                    .filter(status => status.message.includes(instance.taskDefinition))
                    .reverse() // Reverse the array to show newest first
                    .map((status) => (
                      <motion.div 
                        key={status.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 text-sm bg-black/20 rounded p-2"
                      >
                        {status.status === 'success' && (
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        )}
                        {status.status === 'error' && (
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        )}
                        {status.status === 'pending' && (
                          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white/90 break-words">{status.message}</p>
                          <p className="text-white/50 text-xs">{status.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
} 

//
