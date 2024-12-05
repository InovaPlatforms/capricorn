'use client';
import React, { useState, useEffect } from "react";
import { RefreshCw, Server, Loader } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  taskArn: string;
  taskDefinitionArn: string;
  lastStatus: string;
  desiredStatus: string;
  cpu: string;
  memory: string;
  createdAt: string;
}

interface TaskGroup {
  name: string;
  instances: Task[];
}

interface Props {
  artistId: string;
  bucketName: string;
}

const FargateInstances: React.FC<Props> = ({ artistId, bucketName }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRunningTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/running-tasks');
      if (!response.ok) throw new Error('Failed to fetch running tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
      console.log(`Fetched tasks at: ${new Date().toISOString()}`);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load running tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRunningTasks();
    const interval = setInterval(fetchRunningTasks, 45000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'stopped':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const groupTasks = (tasks: Task[]): TaskGroup[] => {
    const groups: { [key: string]: Task[] } = {};
    
    tasks.forEach(task => {
      const taskDefParts = task.taskDefinitionArn.split('/');
      const taskDefName = taskDefParts[taskDefParts.length - 1].split(':')[0];
      if (!groups[taskDefName]) {
        groups[taskDefName] = [];
      }
      groups[taskDefName].push(task);
    });

    return Object.entries(groups).map(([name, instances]) => ({
      name,
      instances: instances || []  // Ensure instances is always an array
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader size={32} className="text-white/80" />
        </motion.div>
        <p className="text-white/60">Loading running tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 bg-red-500/10 py-3 px-4 rounded-lg inline-block">
          {error}
        </p>
      </div>
    );
  }

  const taskGroups = groupTasks(tasks);

  if (taskGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No running tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {taskGroups.map((group, groupIdx) => (
        <div 
          key={groupIdx}
          className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-lg font-medium text-white/90 mb-4">
            {group.name} ({group.instances?.length || 0} running)
          </h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {group.instances?.map((instance, idx) => (
              <span 
                key={idx} 
                className={`px-2 py-1 rounded-full text-xs sm:text-sm ${getStatusColor(instance.lastStatus)} bg-black-900/50`}
              >
                {instance.lastStatus}
                <span className="text-white/50 ml-2">
                  {new Date(instance.createdAt).toLocaleTimeString()}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FargateInstances; 