import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './lib/supabaseClient';
import { LandingPage } from './components/auth/LandingPage';
import { EmployeeLogin } from './components/auth/EmployeeLogin';
import { PublicLogin } from './components/auth/PublicLogin';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { FRAAtlas } from './components/fra-atlas/FRAAtlas';
import { DocumentUpload } from './components/documents/DocumentUpload';
import { TerrainAnalysis } from './components/terrain/TerrainAnalysis';
import { GovernmentSchemes } from './components/schemes/GovernmentSchemes';
import { AdminPanel } from './components/admin/AdminPanel';
import { MyClaims } from './components/public/MyClaims';
import { ClaimSubmission } from './components/public/ClaimSubmission';

const MainApp: React.FC = () => {
  const { currentUser, loading, userType } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const [showPublicLogin, setShowPublicLogin] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Reset login states when user logs in
  useEffect(() => {
    if (currentUser) {
      setShowEmployeeLogin(false);
      setShowPublicLogin(false);
    } else {
      // When user logs out, reset to landing page
      setShowEmployeeLogin(false);
      setShowPublicLogin(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-sky flex items-center justify-center">
        <div className="text-center">
          <div className="forest-spinner mx-auto"></div>
          <p className="text-forest-medium mt-4 text-lg font-medium">Loading Forest Atlas...</p>
        </div>
      </div>
    );
  }

  // Show landing page if no user and not in login flow
  if (!currentUser && !showEmployeeLogin && !showPublicLogin) {
    return <LandingPage onEmployeeLogin={() => setShowEmployeeLogin(true)} onPublicLogin={() => setShowPublicLogin(true)} />;
  }

  // Show employee login
  if (showEmployeeLogin && !currentUser) {
    return (
      <div className="auth-container min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-forest-dark">Employee Login</h2>
            <button 
              onClick={() => setShowEmployeeLogin(false)}
              className="text-forest-medium hover:text-forest-dark"
            >
              Back
            </button>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'rgb(34 197 94)',
                  color: 'white',
                },
                anchor: {
                  color: 'rgb(34 197 94)',
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    );
  }

  // Show public login
  if (showPublicLogin && !currentUser) {
    return (
      <div className="auth-container min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-forest-dark">Public Login</h2>
            <button 
              onClick={() => setShowPublicLogin(false)}
              className="text-forest-medium hover:text-forest-dark"
            >
              Back
            </button>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'rgb(34 197 94)',
                  color: 'white',
                },
                anchor: {
                  color: 'rgb(34 197 94)',
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return userType === 'employee' ? <AdminPanel /> : <MyClaims />;
      case 'submit-claim':
        return <ClaimSubmission />;
      case 'fra-atlas':
        return <FRAAtlas />;
      case 'documents':
        return <DocumentUpload />;
      case 'asset-mapping':
        return <TerrainAnalysis />;
      case 'schemes':
        return <GovernmentSchemes />;
      default:
        return userType === 'employee' ? <AdminPanel /> : <MyClaims />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      <Navbar onSectionChange={setActiveSection} activeSection={activeSection} />
      <div className="pt-16"> {/* Add top padding to account for fixed navbar */}
        <div className="relative min-h-[calc(100vh-64px)]">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
            userType={userType || 'public'} 
            isMinimized={isSidebarMinimized}
            onMinimizeToggle={() => setIsSidebarMinimized(!isSidebarMinimized)}
          />
          <main 
            className={`transition-all duration-300 ease-in-out ${
              isSidebarMinimized ? 'ml-16' : 'ml-64'
            }`}
          >
            <div className="p-6">
              <div className="animate-forest-fade-in transition-all duration-500 ease-in-out">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;