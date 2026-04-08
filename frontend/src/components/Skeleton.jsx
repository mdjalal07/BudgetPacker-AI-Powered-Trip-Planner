import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClasses = "bg-slate-200 animate-pulse-slow rounded-md";
  
  const variants = {
    rect: "w-full h-full",
    circle: "rounded-full aspect-square",
    text: "h-4 w-full",
    title: "h-8 w-3/4 mb-4",
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
