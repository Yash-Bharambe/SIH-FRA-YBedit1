import React, { useState, useEffect } from 'react';
import { TreePine, LogOut, Menu, X, User, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-200"
        onClick={!isLoading ? onCancel : undefined}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center space-x-3 p-6 pb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 px-6 pb-6">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange }) => {
  const { signOut, userType } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show confirmation modal instead of directly logging out
  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  // Enhanced logout function with proper session clearing
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    
    try {
      console.log('Starting logout process...');
      
      // Call the signOut function
      const result = await signOut();
      
      console.log('SignOut result:', result);
      
      // Close the modal
      setShowLogoutConfirmation(false);
      
      // No need for page reload since we're properly clearing session
      console.log('Logout completed - user should be redirected to login');
      
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutCancel = () => {
    if (!isLoggingOut) {
      setShowLogoutConfirmation(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
            : 'bg-white'
        } border-b border-forest-sage/10 h-16`}
      >
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-full">
            {/* Logo and Website Name */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onSectionChange('dashboard')}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                scrolled ? 'bg-forest-sage/5' : ''
              }`}>
                <TreePine className="h-6 w-6 text-forest-deep" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-forest-deep">Forest Rights Act</h1>
                <span className="text-xs text-forest-medium">Digital Management System</span>
              </div>
            </div>

            {/* Navigation Status */}
            <div className="hidden md:block">
              <span className="text-sm text-forest-medium capitalize">
                {activeSection.replace('-', ' ')}
              </span>
            </div>

            {/* Profile and Logout */}
            <div className="flex items-center">
              {/* Desktop View */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-3 py-1.5 bg-forest-sage/5 rounded-full">
                  <User className="h-4 w-4 text-forest-deep" />
                  <span className="text-sm font-medium text-forest-deep">
                    {userType === 'employee' ? 'Administrator' : 'Public User'}
                  </span>
                </div>
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 px-3 py-1.5 text-forest-medium hover:text-forest-deep hover:bg-forest-sage/5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-forest-medium hover:text-forest-deep hover:bg-forest-sage/5 rounded-full transition-all duration-300"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 right-0 w-64 bg-white/95 backdrop-blur-sm z-50 border-l border-b border-forest-sage/10 rounded-bl-2xl shadow-lg">
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3 px-3 py-2 bg-forest-sage/5 rounded-xl">
                <User className="h-4 w-4 text-forest-deep" />
                <span className="text-sm font-medium text-forest-deep">
                  {userType === 'employee' ? 'Administrator' : 'Public User'}
                </span>
              </div>
              <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 w-full px-3 py-2 text-forest-medium hover:text-forest-deep hover:bg-forest-sage/5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirmation}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access the system."
        isLoading={isLoggingOut}
      />
    </>
  );
};
