import React from "react";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

const Header: React.FC = () => {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => window.location.href = "/"}>
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-xl font-semibold text-neutral-900">HealthTriage</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {location === "/er-dashboard" && (
            <span className="text-sm text-neutral-600">Welcome, Medical Staff</span>
          )}
          {(location === "/patient-dashboard" || location === "/connect-watch") && (
            <span className="text-sm text-neutral-600">Patient Portal</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
