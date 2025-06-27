import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();

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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-500">No users found.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className={u.is_blocked ? 'bg-red-50' : ''}>
                  <td className="px-4 py-2 font-medium text-gray-900">{u.full_name}</td>
                  <td className="px-4 py-2 text-gray-700">{u.email}</td>
                  <td className="px-4 py-2 text-gray-700">{u.role || 'student'}</td>
                  <td className="px-4 py-2">
                    {u.is_blocked ? (
                      <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-semibold">Blocked</span>
                    ) : (
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {u.is_blocked ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBlockToggle(u.id, false)} disabled={updating === u.id}>Unblock</Button>
                    ) : (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleBlockToggle(u.id, true)} disabled={updating === u.id}>Block</Button>
                    )}
                    <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete(u.id)} disabled={deleting === u.id}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  );
} 