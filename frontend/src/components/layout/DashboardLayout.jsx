import { Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { PanelLeftOpen } from 'lucide-react';
import Sidebar from './Sidebar';
import OnboardingTour from '../OnboardingTour';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('auth_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <OnboardingTour />
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className={`fixed top-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition hover:border-primary-300 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-200 ${i18n.language === 'ar' ? 'right-4' : 'left-4'}`}
          aria-label={t('sidebar.open')}
          title={t('sidebar.open')}
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? (i18n.language === 'ar' ? 'lg:mr-72' : 'lg:ml-72') : ''}`}>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-5 pt-20 sm:p-8 sm:pt-24 lg:p-10 lg:pt-24">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
