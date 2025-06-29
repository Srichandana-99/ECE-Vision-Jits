import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminNotifications() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('id, full_name, email');
    if (!error && data) setUsers(data);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('id, user_id, title, description, created_at, profiles(full_name, email)')
      .order('created_at', { ascending: false });
    if (!error && data) setNotifications(data);
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({ title: 'Error', description: 'Title and message are required.', variant: 'destructive' });
      return;
    }
    setSending(true);
    let error = null;
    if (selectedUser === 'all') {
      // Broadcast: insert a single notification with user_id null
      const { error: insertError } = await supabase.from('notifications').insert({
        user_id: null,
        title,
        description,
        priority: 'low',
        type: 'announcement'
      });
      error = insertError;
    } else {
      const { error: insertError } = await supabase.from('notifications').insert({
        user_id: selectedUser,
        title,
        description,
        priority: 'low',
        type: 'announcement'
      });
      error = insertError;
    }
    if (!error) {
      toast({ title: 'Notification Sent', description: selectedUser === 'all' ? 'Broadcast sent to all users.' : 'Notification sent to user.' });
      setTitle('');
      setDescription('');
      setSelectedUser('all');
      fetchNotifications();
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to send notification.', variant: 'destructive' });
    }
    setSending(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Notification Deleted', description: 'The notification was deleted successfully.' });
      fetchNotifications();
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to delete notification.', variant: 'destructive' });
    }
    setDeletingId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Send Notifications</h2>
      <form onSubmit={handleSend} className="max-w-lg space-y-4 bg-white rounded-lg shadow p-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="all">All Users (Broadcast)</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[80px]"
            required
          />
        </div>
        <Button type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send Notification'}</Button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Sent Notifications</h3>
      {loading ? (
        <div className="text-center py-8">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-500">No notifications sent yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td className="px-4 py-2 text-gray-700">
                    {n.profiles?.full_name
                      ? `${n.profiles.full_name} (${n.profiles.email})`
                      : 'User'}
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">{n.title}</td>
                  <td className="px-4 py-2 text-gray-700">{n.description}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{new Date(n.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(n.id)}
                      disabled={deletingId === n.id}
                    >
                      {deletingId === n.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 