"use client"

import React, { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils";

// ButtonProps ki jagah hum Button component ke actual props use karenge
interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  onLogout: () => Promise<void> | void;
  iconSize?: number;
  iconColor?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  onLogout, 
  className, 
  iconSize = 16, 
  iconColor = "red", 
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Taki form submit jaisi default cheezein na hon
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      disabled={isLoading || props.disabled}
      className={cn("flex items-center justify-center", className)}
      {...props} // Baaki saare props (id, title, etc.) yahan pass ho jayenge
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut 
          size={iconSize} 
          className="cursor-pointer" 
          stroke={iconColor} // color ki jagah stroke use karein Lucide icons ke liye
        />
      )}
    </Button>
  );
};

export default LogoutButton;