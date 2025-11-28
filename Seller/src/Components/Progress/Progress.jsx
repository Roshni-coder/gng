import React from 'react'

function Progress(props) {
  // If used as loading spinner (no value prop)
  if (props.value === undefined) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Progress bar with value
  const colorClasses = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    default: 'bg-indigo-500'
  };

  const bgColor = colorClasses[props.type] || colorClasses.default;

  return (
    <div className='w-full max-w-[120px] h-2 bg-gray-100 overflow-hidden rounded-full'>
      <span
        className={`flex h-full transition-all duration-300 ${bgColor}`}
        style={{ width: `${Math.min(100, Math.max(0, props.value))}%` }}
      ></span>
    </div>
  );
}

export default Progress
