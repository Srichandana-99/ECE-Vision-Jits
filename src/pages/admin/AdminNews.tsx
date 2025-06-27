import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export default function AdminNews() {
  const [news, setNews] = useState<Database['public']['Tables']['news']['Row'][]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<'news', Database['public']['Tables']['news']['Row']>('news')
      .select('id, title, content, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setNews(data);
    setLoading(false);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Error', description: 'Title and content are required.', variant: 'destructive' });
      return;
    }
    setPosting(true);
    const { error } = await supabase.from<'news', Database['public']['Tables']['news']['Row']>('news').insert({ title, content });
    if (!error) {
      toast({ title: 'News/Job Posted', description: 'Your post has been published.' });
      setTitle('');
      setContent('');
      fetchNews();
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to post news/job.', variant: 'destructive' });
    }
    setPosting(false);
  };

  const handleEdit = (n: any) => {
    setEditingId(n.id);
    setEditTitle(n.title);
    setEditContent(n.content);
  };

  const handleEditSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast({ title: 'Error', description: 'Title and content are required.', variant: 'destructive' });
      return;
    }
    setEditLoading(true);
    const { error } = await supabase.from<'news', Database['public']['Tables']['news']['Row']>('news').update({ title: editTitle, content: editContent }).eq('id', editingId!);
    if (!error) {
      toast({ title: 'News/Job Updated', description: 'The post has been updated.' });
      setNews(prev => prev.map(n => n.id === editingId ? { ...n, title: editTitle, content: editContent } : n));
      setEditingId(null);
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to update post.', variant: 'destructive' });
    }
    setEditLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from<'news', Database['public']['Tables']['news']['Row']>('news').delete().eq('id', id);
    if (!error) {
      toast({ title: 'News/Job Deleted', description: 'The post has been deleted.' });
      setNews(prev => prev.filter(n => n.id !== id));
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to delete post.', variant: 'destructive' });
    }
    setDeletingId(null);
    setConfirmDelete(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">News & Jobs Management</h2>
      <form onSubmit={handlePost} className="max-w-lg space-y-4 bg-white rounded-lg shadow p-6 mb-8">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[80px]"
            required
          />
        </div>
        <Button type="submit" disabled={posting}>{posting ? 'Posting...' : 'Post News/Job'}</Button>
      </form>

      <h3 className="text-xl font-semibold mb-4">All News & Jobs</h3>
      {loading ? (
        <div className="text-center py-8">Loading news/jobs...</div>
      ) : news.length === 0 ? (
        <div className="text-gray-500">No news or jobs posted yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Posted At</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n.id}>
                  <td className="px-4 py-2 font-medium text-gray-900">{n.title}</td>
                  <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{n.content}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{new Date(n.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(n)} disabled={editingId === n.id || deletingId === n.id}>Edit</Button>
                    <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete(n.id)} disabled={editingId === n.id || deletingId === n.id}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Edit News/Job</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[80px]"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingId(null)} disabled={editLoading}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleEditSave} disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Delete News/Job?</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)} disabled={deletingId === confirmDelete}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(confirmDelete!)} disabled={deletingId === confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 