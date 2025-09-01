import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-gray-100 card-shadow",
        hover && "transition-all duration-200 hover:card-shadow-hover hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;