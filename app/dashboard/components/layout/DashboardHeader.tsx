"use client";
import React from "react";
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header className="md:hidden sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          PayFlow
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onOpenSidebar}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Abrir Menú</span>
      </Button>
    </header>
  );
};

export default DashboardHeader;
