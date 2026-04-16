import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useSettingsStore from '../../store/settingsStore';

const DashboardLayout = () => {
  const { theme } = useSettingsStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0D0F14]' : 'bg-gray-50'
    }`}>
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
