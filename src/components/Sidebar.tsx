import React from 'react';
import { LayoutDashboard, Users, Grid, PlayCircle, MessageSquare, LogOut, Activity } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'tutorials', label: 'Tutorials', icon: PlayCircle },
    { id: 'challenges', label: 'Challenges', icon: Activity },
    { id: 'referrals', label: 'Referrals', icon: MessageSquare },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: LogOut },
  ];

  return (
    <div className="sidebar">
      <div className="logo-section">
        <img src="/logo.png" alt="FIT24 Logo" className="logo-img" style={{ height: '40px' }} />
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {activeTab === item.id && <div className="indicator" />}
          </button>
        ))}
      </nav>

      <div className="bottom-section">
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
