import React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, value, onValueChange, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (Array.isArray(value)) {
      // For range sliders, we'll use a simple implementation
      onValueChange([value[0], newValue]);
    } else {
      onValueChange([newValue]);
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        ref={ref}
        type="range"
        min={0}
        max={max}
        step={step}
        value={Array.isArray(value) ? value[1] : value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        {...props}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
});

Slider.displayName = 'Slider';

export { Slider };

