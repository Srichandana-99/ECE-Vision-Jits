import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ideas')
      .select('id, title, user_id, status, is_featured, created_at, category, skills, profiles(full_name)')
      .order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const handleFeatureToggle = async (projectId: string, feature: boolean, userId: string) => {
    setUpdating(projectId);
    const { error } = await supabase.from('ideas').update({ is_featured: feature }).eq('id', projectId);
    if (!error) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, is_featured: feature } : p));
      toast({ title: feature ? 'Project Featured' : 'Project Unfeatured', description: `Project has been ${feature ? 'featured' : 'unfeatured'}.` });
      // Send notification to user if featured
      if (feature && userId) {
        await supabase.from('notifications').insert({
          user_id: userId,
          title: 'Project Featured',
          description: 'Congratulations! Your project has been featured by the admin!',
          priority: 'low',
          type: 'announcement',
        });
      }
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to update project.', variant: 'destructive' });
    }
    setUpdating(null);
  };

  const handleApproveToggle = async (projectId: string, userId: string, approve: boolean) => {
    setUpdating(projectId);
    const newStatus = approve ? 'approved' : 'pending';
    const { error } = await supabase.from('ideas').update({ status: newStatus }).eq('id', projectId);
    if (!error) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      toast({ title: approve ? 'Project Approved' : 'Project Deapproved', description: `Project has been ${approve ? 'approved' : 'set to pending'}.` });
      // Send notification to user if approved
      if (approve && userId) {
        await supabase.from('notifications').insert({
          user_id: userId,
          title: 'Project Approved',
          description: 'Congratulations! Your project has been approved or featured by the admin.',
          priority: 'low',
          type: 'announcement',
        });
      }
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to update project.', variant: 'destructive' });
    }
    setUpdating(null);
  };

  const handleDelete = async (projectId: string) => {
    setDeleting(projectId);
    const { error } = await supabase.from('ideas').delete().eq('id', projectId);
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({ title: 'Project Deleted', description: 'Project has been deleted.' });
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to delete project.', variant: 'destructive' });
    }
    setDeleting(null);
    setConfirmDelete(null);
  };

  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Project Management</h2>
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full md:w-80"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Loading projects...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-500">No projects found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-2 font-medium text-gray-900">{p.title}</td>
                  <td className="px-4 py-2 text-gray-700">{p.profiles?.full_name || 'Unknown'}</td>
                  <td className="px-4 py-2 text-gray-700">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${p.status === 'approved' ? 'bg-green-100 text-green-800' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    {p.is_featured ? (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Featured</span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {p.status === 'approved' ? (
                      <Button size="sm" className="bg-gray-200 text-blue-700 hover:bg-blue-100" onClick={() => handleApproveToggle(p.id, p.user_id, false)} disabled={updating === p.id}>Deapprove</Button>
                    ) : (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApproveToggle(p.id, p.user_id, true)} disabled={updating === p.id}>Approve</Button>
                    )}
                    {p.is_featured ? (
                      <Button size="sm" className="bg-gray-200 text-blue-700 hover:bg-blue-100" onClick={() => handleFeatureToggle(p.id, false, p.user_id)} disabled={updating === p.id}>Unfeature</Button>
                    ) : (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleFeatureToggle(p.id, true, p.user_id)} disabled={updating === p.id}>Feature</Button>
                    )}
                    <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete(p.id)} disabled={deleting === p.id}>Delete</Button>
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
            <h3 className="text-lg font-bold mb-4 text-gray-900">Delete Project?</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this project? This action cannot be undone.</p>
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