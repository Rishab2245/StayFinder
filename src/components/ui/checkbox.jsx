import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-primary border-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {checked && (
        <Check className="h-3 w-3 text-white" />
      )}
    </button>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };

