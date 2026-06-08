import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { 
  Users, 
  TrendingUp, 
  Download, 
  CheckCircle, 
  MoreVertical,
  Plus,
  Trash2,
  Play,
  Check,
  X,
  Bell,
  Search,
  Save,
  Trophy
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock or real API URL
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.fit24.global/api/v1/admin';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [bulkPoints, setBulkPoints] = useState(0);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
        const fetchJson = async (url: string) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        };

        if (activeTab === 'categories') {
            setCategories(await fetchJson(`${API_BASE}/categories`));
        } else if (activeTab === 'tutorials') {
            setTutorials(await fetchJson(`${API_BASE}/tutorials`));
        } else if (activeTab === 'feedback') {
            setFeedback(await fetchJson(`${API_BASE}/feedback`));
        } else if (activeTab === 'challenges') {
            setChallenges(await fetchJson(`${API_BASE}/challenges`));
        } else if (activeTab === 'referrals') {
            setReferrals(await fetchJson(`${API_BASE}/referrals`));
        } else if (activeTab === 'users') {
            setUsers(await fetchJson(`${API_BASE}/users${searchTerm ? `?search=${searchTerm}` : ''}`));
        } else if (activeTab === 'settings') {
            const data = await fetchJson(`${API_BASE}/config`);
            setConfig(Array.isArray(data) ? data.find((c:any) => c.key === 'spin_wheel')?.value || null : null);
        } else if (activeTab === 'logs') {
            setLogs(await fetchJson(`${API_BASE}/logs`));
        }
    } catch (e) {
        console.error("Fetch error, using mock data", e);
        // Fallback to mock data if backend not running
        if (activeTab === 'categories') setCategories([
            { id: '1', name: 'Walking', icon_name: 'directions_walk', is_active: true },
            { id: '2', name: 'Running', icon_name: 'directions_run', is_active: true },
            { id: '3', name: 'Cycling', icon_name: 'directions_bike', is_active: false },
        ]);
        if (activeTab === 'tutorials') setTutorials([
            { id: '1', title: 'Perfect Running Form', video_url: '#', upvotes: 120, downvotes: 5 },
            { id: '2', title: 'HIIT for Beginners', video_url: '#', upvotes: 85, downvotes: 2 },
        ]);
        if (activeTab === 'feedback') setFeedback([
            { id: '1', user_profiles: { name: 'Aditya Raj' }, message: 'The app is amazing!', is_approved: true },
            { id: '2', user_profiles: { name: 'Rahul K.' }, message: 'Need more cycling routes.', is_approved: false },
        ]);
        if (activeTab === 'challenges') setChallenges([
            { id: '1', title: 'Morning Walk', reward_coins: 500, requirement_type: 'steps', requirement_value: 5000 },
            { id: '2', title: 'Cycling Pro', reward_coins: 1200, requirement_type: 'distance', requirement_value: 10000 },
        ]);
        if (activeTab === 'referrals') setReferrals([
            { user_id: '1', name: 'Aditya Raj', code: 'ADITYA10', count: 15 },
            { user_id: '2', name: 'Priya Singh', code: 'PRIYA55', count: 8 },
        ]);
        if (activeTab === 'users') setUsers([
          { id: '1', name: 'Aditya Raj', email: 'aditya@example.com', points: 12450 },
          { id: '2', name: 'Priya Singh', email: 'priya@example.com', points: 8200 },
        ]);
        if (activeTab === 'settings') setConfig({
          prizes: [
            { label: "100 Coins", value: 100, chance: 40 },
            { label: "500 Coins", value: 500, chance: 20 },
          ],
          cooldown_hours: 24
        });
    }
  };

  const toggleApproval = async (id: string, current: boolean) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, is_approved: !current } : f));
    // Real API call: fetch(`${API_BASE}/feedback/${id}`, { method: 'PATCH', ... })
  };

  const stats = [
    { label: 'Total Users', value: '12,450', change: '+12%', icon: Users, color: 'var(--cyan)' },
    { label: 'Daily Active', value: '3,820', change: '+8%', icon: TrendingUp, color: 'var(--green)' },
    { label: 'App Downloads', value: '45.2K', change: '+24%', icon: Download, color: 'var(--purple)' },
    { label: 'Points Earned', value: '8.4M', change: '+15%', icon: CheckCircle, color: 'var(--amber)' },
  ];

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      fill: true, label: 'User Activity',
      data: [65, 78, 62, 85, 92, 110, 105],
      borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', tension: 0.4,
    }],
  };

  const barData = {
    labels: ['Walking', 'Running', 'Cycling', 'Others'],
    datasets: [{
      label: 'Category Popularity',
      data: [450, 620, 310, 150],
      backgroundColor: ['rgba(0, 229, 255, 0.6)', 'rgba(46, 204, 113, 0.6)', 'rgba(255, 0, 127, 0.6)', 'rgba(176, 38, 255, 0.6)'],
      borderRadius: 8,
    }],
  };

  const updateUserPoints = async (id: string, pts: number) => {
    try {
        await fetch(`${API_BASE}/users/${id}/points`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points: pts })
        });
        fetchData();
    } catch (e) { console.error(e); }
  };

  const updateConfig = async () => {
    try {
        await fetch(`${API_BASE}/config`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'spin_wheel', value: config })
        });
        alert("Config saved!");
    } catch (e) { console.error(e); }
  };

  const sendBroadcast = async () => {
    if (!broadcastMsg) return;
    try {
        await fetch(`${API_BASE}/broadcast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: broadcastMsg })
        });
        alert("Broadcast sent!");
        setBroadcastMsg('');
    } catch (e) { console.error(e); }
  };

  const handleBulkAction = async (type: 'points' | 'message') => {
    if (selectedUsers.length === 0) return;
    try {
        await fetch(`${API_BASE}/users/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_ids: selectedUsers,
                points: type === 'points' ? bulkPoints : undefined,
                message: type === 'message' ? broadcastMsg : undefined
            })
        });
        alert("Bulk action completed!");
        setSelectedUsers([]);
        fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="admin-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="content">
        <header className="main-header">
          <div>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p>Welcome back, Admin</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              />
            </div>
            <button className="add-btn">
              <Plus size={20} />
              <span>{activeTab === 'tutorials' ? 'Add Video' : activeTab === 'challenges' ? 'New Challenge' : 'Action'}</span>
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-view animate-fade">
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card glass">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}><stat.icon size={20} /></div>
                    <span className="stat-change">{stat.change}</span>
                  </div>
                  <div className="stat-body">
                    <span className="stat-label">{stat.label}</span>
                    <h3 className="stat-value">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="charts-row">
              <div className="chart-container glass large">
                <div className="chart-header"><h4>User Growth Activity</h4><button><MoreVertical size={18} /></button></div>
                <div className="chart-wrapper"><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }, x: { grid: { display: false } } } }} /></div>
              </div>
              <div className="chart-container glass small">
                <div className="chart-header"><h4>Activity Breakdown</h4><button><MoreVertical size={18} /></button></div>
                <div className="chart-wrapper"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
            <div className="categories-view animate-fade">
                <div className="chart-container glass full-width">
                    <div className="chart-header">
                        <h4>Activity Categories</h4>
                        <button className="add-small-btn"><Plus size={16} /> New Category</button>
                    </div>
                    <div className="grid-list">
                        {categories.map(cat => (
                            <div key={cat.id} className="item-card glass">
                                <div className={`status-dot ${cat.is_active ? 'on' : 'off'}`}></div>
                                <div className="item-icon"><TrendingUp size={24} color="var(--green)" /></div>
                                <h4>{cat.name}</h4>
                                <p>{cat.is_active ? 'Active' : 'Inactive'}</p>
                                <div className="item-actions">
                                    <button className="edit">Edit</button>
                                    <button className="delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'tutorials' && (
            <div className="tutorials-view animate-fade">
                <div className="chart-container glass full-width">
                    <div className="chart-header">
                        <h4>Tutorial Library</h4>
                    </div>
                    <div className="tutorial-list">
                        {tutorials.map(tut => (
                            <div key={tut.id} className="tutorial-row glass">
                                <div className="video-thumb">
                                    <Play size={24} color="white" />
                                </div>
                                <div className="tut-info">
                                    <h4>{tut.title}</h4>
                                    <p>Engagement: {tut.upvotes} Upvotes | {tut.downvotes} Downvotes</p>
                                </div>
                                <div className="tut-actions">
                                    <button className="btn-outline">Watch</button>
                                    <button className="btn-danger"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'feedback' && (
            <div className="feedback-view animate-fade">
                <div className="chart-container glass full-width">
                    <div className="chart-header">
                        <h4>User Feedback & Suggestions</h4>
                    </div>
                    <div className="feedback-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedback.map(f => (
                                    <tr key={f.id}>
                                        <td>{f.user_profiles?.name || 'User'}</td>
                                        <td className="message-cell">{f.message}</td>
                                        <td>27 Apr</td>
                                        <td><span className={`badge ${f.is_approved ? 'approved' : 'inactive'}`}>{f.is_approved ? 'Approved' : 'Pending'}</span></td>
                                        <td>
                                            <div className="action-btns">
                                                <button onClick={() => toggleApproval(f.id, f.is_approved)} className={f.is_approved ? 'btn-x' : 'btn-check'}>
                                                    {f.is_approved ? <X size={16} /> : <Check size={16} />}
                                                </button>
                                                <button className="btn-trash"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'challenges' && (
            <div className="challenges-view animate-fade">
                <div className="chart-container glass full-width">
                    <div className="chart-header">
                        <h4>Active Challenges</h4>
                    </div>
                    <div className="grid-list">
                        {challenges.map(chal => (
                            <div key={chal.id} className="item-card glass">
                                <div className="item-icon"><Trophy size={24} color="var(--amber)" /></div>
                                <h4>{chal.title}</h4>
                                <p>{chal.reward_coins} Coins</p>
                                <p className="sub-text">{chal.requirement_value} {chal.requirement_type}</p>
                                <div className="item-actions">
                                    <button className="edit">Edit</button>
                                    <button className="delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'referrals' && (
            <div className="referrals-view animate-fade">
                <div className="chart-container glass full-width">
                    <div className="chart-header">
                        <h4>Referral Leaderboard</h4>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Referral Code</th>
                                <th>Total Referrals</th>
                                <th>Points Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map((ref, i) => (
                                <tr key={i}>
                                    <td>{ref.name}</td>
                                    <td><code>{ref.code}</code></td>
                                    <td>{ref.count}</td>
                                    <td><span className="t-points">{ref.count * 10000}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
          <div className="users-view animate-fade">
            {selectedUsers.length > 0 && (
                <div className="bulk-bar glass animate-slide-up">
                    <span>{selectedUsers.length} users selected</span>
                    <div className="bulk-actions">
                        <input type="number" placeholder="Add Points" onChange={(e) => setBulkPoints(parseInt(e.target.value))} />
                        <button className="btn-check" onClick={() => handleBulkAction('points')}>Give Points</button>
                        <input type="text" placeholder="Direct Message" onChange={(e) => setBroadcastMsg(e.target.value)} />
                        <button className="btn-outline" onClick={() => handleBulkAction('message')}>Send Message</button>
                    </div>
                </div>
            )}
            <div className="chart-container glass full-width">
              <div className="chart-header"><h4>User Directory</h4></div>
              <table className="data-table">
                <thead>
                    <tr>
                        <th>
                            <input 
                                type="checkbox" 
                                onChange={(e) => setSelectedUsers(e.target.checked ? users.map(u => u.id) : [])}
                                checked={selectedUsers.length === users.length}
                            />
                        </th>
                        <th>User</th><th>Status</th><th>Activity</th><th>Points</th><th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={i}>
                      <td>
                        <input 
                            type="checkbox" 
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => setSelectedUsers(prev => e.target.checked ? [...prev, user.id] : prev.filter(id => id !== user.id))}
                        />
                      </td>
                      <td><div className="table-user"><div className="avatar-small">{user.name ? user.name[0] : 'U'}</div><div><p className="t-name">{user.name || 'Anonymous'}</p><p className="t-email">{user.email || user.phone}</p></div></div></td>
                      <td><span className="badge active">Active</span></td>
                      <td>High</td>
                      <td>
                        <input 
                            type="number" 
                            className="points-input" 
                            defaultValue={user.points} 
                            onBlur={(e) => updateUserPoints(user.id, parseInt(e.target.value))}
                        />
                      </td>
                      <td><button className="action-dots"><MoreVertical size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
            <div className="logs-view animate-fade">
                <div className="chart-container glass full-width">
                    <div className="chart-header">
                        <h4>Admin Activity Audit Trail</h4>
                    </div>
                    <div className="logs-list">
                        {logs.map((log, i) => (
                            <div key={i} className="log-item glass">
                                <div className="log-time">{new Date(log.created_at).toLocaleString()}</div>
                                <div className="log-action"><b>{log.action}</b></div>
                                <div className="log-target">{log.target}</div>
                                <div className="log-details">{JSON.stringify(log.details)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="settings-view animate-fade">
                <div className="charts-row">
                    <div className="chart-container glass large">
                        <div className="chart-header"><h4>Spin Wheel Prizes</h4><button onClick={updateConfig}><Save size={18} /></button></div>
                        <div className="config-list">
                            {config?.prizes.map((p: any, i: number) => (
                                <div key={i} className="config-item">
                                    <input type="text" value={p.label} onChange={(e) => {
                                        const newP = [...config.prizes];
                                        newP[i].label = e.target.value;
                                        setConfig({...config, prizes: newP});
                                    }} />
                                    <input type="number" value={p.value} onChange={(e) => {
                                        const newP = [...config.prizes];
                                        newP[i].value = parseInt(e.target.value);
                                        setConfig({...config, prizes: newP});
                                    }} />
                                    <input type="number" value={p.chance} onChange={(e) => {
                                        const newP = [...config.prizes];
                                        newP[i].chance = parseInt(e.target.value);
                                        setConfig({...config, prizes: newP});
                                    }} />
                                    <span>%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chart-container glass small">
                        <div className="chart-header"><h4>Broadcast Message</h4><button onClick={sendBroadcast}><Bell size={18} /></button></div>
                        <div className="broadcast-box">
                            <textarea 
                                placeholder="Type message for all users..." 
                                value={broadcastMsg}
                                onChange={(e) => setBroadcastMsg(e.target.value)}
                            />
                            <button className="send-btn" onClick={sendBroadcast}>
                                Send Push Notification
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;
