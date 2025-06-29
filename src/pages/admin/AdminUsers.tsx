import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Shield, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import UserDetail from './UserDetail';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('id, full_name, email, role, is_blocked');
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  const handleBlockToggle = async (userId: string, block: boolean) => {
    setUpdating(userId);
    const { error } = await supabase.from('profiles').update({ is_blocked: block }).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: block } : u));
      toast({ title: block ? 'User Blocked' : 'User Unblocked', description: `User has been ${block ? 'blocked' : 'unblocked'}.` });
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to update user.', variant: 'destructive' });
    }
    setUpdating(null);
  };

  const handleDelete = async (userId: string) => {
    setDeleting(userId);
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: 'User Deleted', description: 'User account has been deleted.' });
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to delete user.', variant: 'destructive' });
    }
    setDeleting(null);
    setConfirmDelete(null);
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Routes>
      <Route index element={
        <div>
          <h2 className="text-2xl font-bold mb-6">User Management</h2>
          <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full md:w-80"
            />
          </div>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-6 text-gray-500">No users found.</div>
              ) : filtered.map(u => (
                <div key={u.id} className={`bg-white rounded-xl shadow p-6 flex flex-col items-center relative border hover:shadow-lg transition ${u.is_blocked ? 'opacity-70' : ''}`}
                  onClick={() => navigate(`/admin/users/${u.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3">
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{u.full_name}</div>
                  <div className="text-sm text-gray-500 mb-1 flex items-center"><Mail className="h-4 w-4 mr-1" />{u.email || u.hall_ticket_number || '-'}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{u.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Joined {new Date(u.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {u.is_blocked ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold"><XCircle className="h-4 w-4" />Blocked</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold"><CheckCircle className="h-4 w-4" />Active</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    {u.is_blocked ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={e => { e.stopPropagation(); handleBlockToggle(u.id, false); }} disabled={updating === u.id}>Unblock</Button>
                    ) : (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={e => { e.stopPropagation(); handleBlockToggle(u.id, true); }} disabled={updating === u.id}>Block</Button>
                    )}
                    <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={e => { e.stopPropagation(); setConfirmDelete(u.id); }} disabled={deleting === u.id}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Confirmation Dialog */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Delete User?</h3>
                <p className="mb-6 text-gray-700">Are you sure you want to delete this user account? This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setConfirmDelete(null)} disabled={deleting === confirmDelete}>Cancel</Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(confirmDelete!)} disabled={deleting === confirmDelete}>Delete</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      } />
      <Route path=":id" element={<UserDetail />} />
    </Routes>
  );
} 