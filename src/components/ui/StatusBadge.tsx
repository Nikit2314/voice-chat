import React from 'react';

type StatusType = 'disconnected' | 'connecting' | 'connected' | 'searching';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = ''
}) => {
  // Define status configurations
  const statusConfig = {
    disconnected: {
      label: 'Disconnected',
      bgColor: 'bg-neutral-200 dark:bg-neutral-700',
      textColor: 'text-neutral-700 dark:text-neutral-200',
      dotColor: 'bg-neutral-500',
    },
    connecting: {
      label: 'Connecting',
      bgColor: 'bg-warning-500/20 dark:bg-warning-500/30',
      textColor: 'text-warning-600 dark:text-warning-500',
      dotColor: 'bg-warning-500',
    },
    connected: {
      label: 'Connected',
      bgColor: 'bg-success-500/20 dark:bg-success-500/30',
      textColor: 'text-success-600 dark:text-success-500',
      dotColor: 'bg-success-500',
    },
    searching: {
      label: 'Searching',
      bgColor: 'bg-accent-500/20 dark:bg-accent-500/30',
      textColor: 'text-accent-600 dark:text-accent-500',
      dotColor: 'bg-accent-500',
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}>
      <span className={`mr-1.5 h-2 w-2 rounded-full ${config.dotColor} ${status === 'connecting' || status === 'searching' ? 'animate-pulse' : ''}`} />
      {config.label}
    </div>
  );
};