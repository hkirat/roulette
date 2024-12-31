import React from "react";
import { cn } from "@/lib/utils";

interface ChipProps {
  value: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ value, selected, onClick, className }) => {
  const getChipColor = (value: number) => {
    switch (value) {
      case 1:
        return "bg-chip-white border-chip-gray";
      case 10:
        return "bg-chip-blue text-white";
      case 100:
        return "bg-chip-gray text-white";
      case 500:
        return "bg-chip-gold text-black";
      default:
        return "bg-chip-white text-black";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative w-16 h-16 rounded-full cursor-pointer transition-transform hover:scale-105",
        "flex items-center justify-center text-lg font-bold shadow-lg",
        "border-4 select-none",
        getChipColor(value),
        selected && "ring-4 ring-white ring-opacity-50",
        className
      )}
    >
      {value}
    </div>
  );
};

export default Chip;