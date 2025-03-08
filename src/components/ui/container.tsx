
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div
      className={cn("w-full px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-7xl", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
