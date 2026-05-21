import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import OnboardingTour from '../OnboardingTour';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout() {
  const { i18n } = useTranslation();
  const isAuthenticated = !!localStorage.getItem('auth_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans transition-colors duration-300">
      <Sidebar />
      <OnboardingTour />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${i18n.language === 'ar' ? 'lg:mr-72' : 'lg:ml-72'}`}>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-5 sm:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
