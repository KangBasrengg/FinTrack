import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Activity, CreditCard, Shield, X, Save } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const initialUsers: UserData[] = [
  { id: '1', name: 'Admin Nuril', email: 'admin.nuril@fintrack.com', role: 'SUPER ADMIN', status: 'Active' },
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'USER', status: 'Active' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'USER', status: 'Suspended' },
];

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 142,
    activeWallets: 384,
    totalTransactions: 12503,
    systemHealth: '100%',
  });

  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const handleEditClick = (user: UserData) => {
    setEditingUser({ ...user });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">System overview and management console.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Shield size={18} />
          Super Admin Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Active Wallets</p>
              <h3 className="text-2xl font-bold text-white">{stats.activeWallets}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Transactions</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalTransactions}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">System Health</p>
              <h3 className="text-2xl font-bold text-white">{stats.systemHealth}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <div className="mt-8">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700 pb-4">
            <CardTitle className="text-white">User Management</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">{user.name}</td>
                      <td className="px-6 py-4 text-slate-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${user.role === 'SUPER ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${user.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium px-2 py-1 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Edit User Account</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Name</label>
                  <p className="text-slate-300 font-medium px-3 py-2 bg-slate-800/50 rounded border border-slate-700">{editingUser.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Email</label>
                  <p className="text-slate-300 font-medium px-3 py-2 bg-slate-800/50 rounded border border-slate-700">{editingUser.email}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Role</label>
                  <select 
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="USER">USER</option>
                    <option value="SUPER ADMIN">SUPER ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Account Status</label>
                  <select 
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-400 hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-emerald-500/20"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
