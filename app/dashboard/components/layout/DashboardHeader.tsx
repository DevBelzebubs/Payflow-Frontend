"use client";
import React from "react";
import { Menu, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const isDemo = user?.rol === 'DEMO';

  return (
    <header className="md:hidden sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          PayFlow
        </span>
        {isDemo && (
          <span className="ml-2 text-[10px] font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full border border-orange-300 flex items-center gap-1">
            <Eye className="w-3 h-3" /> DEMO
          </span>
        )}
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
