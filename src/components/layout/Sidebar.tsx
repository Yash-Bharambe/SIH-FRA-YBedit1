import React from 'react';
import { 
  Home, 
  FileText, 
  Map, 
  Brain, 
  Landmark, 
  Shield,
  ChevronRight,
  TreePine,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userType: 'employee' | 'public';
  isMinimized: boolean;
  onMinimizeToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  userType,
  isMinimized,
  onMinimizeToggle
}) => {
  
  const employeeMenuItems = [
    { id: 'dashboard', label: 'Admin Panel', icon: Shield },
    { id: 'fra-atlas', label: 'FRA Atlas', icon: Map },
    { id: 'documents', label: 'Document Review', icon: FileText },
    { id: 'asset-mapping', label: 'AI Asset Mapping', icon: Brain },
    { id: 'schemes', label: 'DSS Schemes', icon: Landmark },
  ];

  const publicMenuItems = [
    { id: 'dashboard', label: 'My Claims', icon: Home },
    { id: 'submit-claim', label: 'Submit Claim', icon: FileText },
    { id: 'fra-atlas', label: 'FRA Atlas', icon: Map },
    { id: 'asset-mapping', label: 'AI Asset Mapping', icon: Brain },
    { id: 'schemes', label: 'DSS Schemes', icon: Landmark },
  ];

  const menuItems = userType === 'employee' ? employeeMenuItems : publicMenuItems;

  return (
    <aside className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] bg-white/95 backdrop-blur-sm border-r border-gray-200/60 transition-all duration-300 ease-in-out z-10 ${
      isMinimized ? 'w-16' : 'w-64'
    }`}>
      <div className={`h-full flex flex-col ${isMinimized ? 'px-2' : 'px-4'}`}>
        {/* Minimize Button */}
        <button
          onClick={onMinimizeToggle}
          className="absolute right-0 -mr-2 top-6 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-gray-200/60 hover:bg-gray-50 transition-all duration-200 hover:scale-105 group z-50"
        >
          {isMinimized ? (
            <PanelLeftOpen className="h-3.5 w-3.5 text-gray-600" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5 text-gray-600" />
          )}
        </button>

        {/* Sidebar Header */}
        <div className={`flex items-center ${isMinimized ? 'justify-center' : 'space-x-3'} pt-6 pb-4`}>
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm">
            <TreePine className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Navigation</h2>
              <p className="text-xs text-gray-500">
                {userType === 'employee' ? 'Admin' : 'Portal'}
              </p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center ${isMinimized ? 'justify-center' : 'justify-start'} px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isMinimized ? item.label : undefined}
              >
                <div className={`flex items-center ${isMinimized ? 'justify-center' : 'space-x-3'} w-full`}>
                  <Icon className={`h-4 w-4 transition-colors duration-200 ${
                    isActive ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {!isMinimized && (
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-emerald-700' : 'text-gray-600 group-hover:text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                  )}
                </div>
                
                {isActive && !isMinimized && (
                  <div className="absolute right-3 w-1 h-1 bg-emerald-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!isMinimized && (
          <div className="mt-auto pb-6">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/60">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">System Status</span>
              </div>
              <p className="text-xs text-gray-500">
                All systems operational
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};