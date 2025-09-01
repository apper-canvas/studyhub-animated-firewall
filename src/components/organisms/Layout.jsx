import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";

const Layout = ({ children, title = "Dashboard", courses = [], onAddAssignment }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={title}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            courses={courses}
            onAddAssignment={onAddAssignment}
          />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;