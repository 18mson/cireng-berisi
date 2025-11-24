import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/Utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, clearable = true, value, onChange, ...props }, ref) => {
    const [val, setVal] = React.useState(value);

    const handleClear = () => {
      setVal('');
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.value = '';
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          value={val}
          onChange={handleChange}
          {...props}
        />
        {clearable && (
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 w-5 h-5 flex items-center justify-center"
            onClick={handleClear}
          >
            <X size={16} color="white" />
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
