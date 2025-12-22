import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: () => void;
  activeText: string;
  inactiveText: string;
  activeColor: string;
  inactiveColor: string;
  warningText?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isActive,
  onToggle,
  activeText,
  inactiveText,
  activeColor,
  inactiveColor,
  warningText
}) => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-14">
      <div
        className={clsx(
          'flex items-center min-w-[120px] w-full h-10 rounded-full cursor-pointer transition-colors bg-white/20 backdrop-blur-sm border-2 border-white/30',
        )}
        onClick={onToggle}
      >
        <div
          className={clsx(
            'w-1/2 h-full flex items-center justify-center text-white font-bold rounded-full transition-transform active:scale-80',
            isActive ? 'translate-x-0' : 'translate-x-full'
          )}
          style={{ backgroundColor: isActive ? activeColor : inactiveColor }}
        >
          {isActive ? activeText : inactiveText}
        </div>
      </div>
      <AnimatePresence>
        {isActive && warningText && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 font-semibold text-center text-sm px-1 overflow-hidden"
          >
            {warningText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};