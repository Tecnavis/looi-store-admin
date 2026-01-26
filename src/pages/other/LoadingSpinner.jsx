// src/components/LoadingSpinner.jsx
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-12 h-12 animate-spin text-primary" />
        <span className="text-gray-600 text-sm">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;