import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FilePlus, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';


const SidebarNav = ({ activeTab, onTabChange, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'staff', icon: <Users size={20} />, label: 'Staff Management' },
    { id: 'add', icon: <FilePlus size={20} />, label: 'Add New Staff' }
  ];

  return (
    <div className={`bg-[#052880] text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-blue-700">
        {sidebarOpen ? (
          <div className="flex items-center">
            <img src="/gurudevs.png" alt="GuruDevs" className="h-8 mr-2" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        ) : (
          <img src={gurudevsLogo} alt="GuruDevs" className="h-8 mx-auto" />
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-blue-200 hover:text-white"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 mt-6">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center w-full p-3 ${activeTab === item.id ? 'bg-blue-700' : 'hover:bg-blue-600'} transition-colors`}
          >
            <span className={sidebarOpen ? "mr-3" : "mx-auto"}>{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
          }}
          className="flex items-center text-blue-200 hover:text-white w-full"
        >
          <LogOut size={20} className={sidebarOpen ? "mr-3" : "mx-auto"} />
          {sidebarOpen && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;