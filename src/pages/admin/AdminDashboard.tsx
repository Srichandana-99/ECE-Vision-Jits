import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Users, FileText, Bell, Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, projects: 0, notifications: 0, news: 0 });
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [{ count: users }, { count: projects }, { count: notifications }, { count: news }] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('ideas').select('id', { count: 'exact', head: true }),
        supabase.from('notifications').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        users: users || 0,
        projects: projects || 0,
        notifications: notifications || 0,
        news: news || 0,
      });
      setLoading(false);
    };
    const fetchActivityAndUsers = async () => {
      // Fetch latest 5 from each table
      const [latestUsers, latestProjects, latestNotifications, latestNews] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role, created_at, hall_ticket_number').order('created_at', { ascending: false }).limit(5),
        supabase.from('ideas').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('notifications').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('news').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      // Merge and sort
      const logs = [
        ...(latestUsers.data || []).map(u => ({ type: 'User', title: u.full_name, date: u.created_at, extra: u.hall_ticket_number || u.role })),
        ...(latestProjects.data || []).map(p => ({ type: 'Project', title: p.title, date: p.created_at })),
        ...(latestNotifications.data || []).map(n => ({ type: 'Notification', title: n.title, date: n.created_at })),
        ...(latestNews.data || []).map(n => ({ type: 'News', title: n.title, date: n.created_at })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
      setActivity(logs);
      // Fetch all users for users table
      const { data: allUsers } = await supabase.from('profiles').select('id, full_name, role, created_at, hall_ticket_number');
      setUsersList(allUsers || []);
    };
    fetchStats();
    fetchActivityAndUsers();
  }, []);

  const cards = [
    {
      label: 'Users',
      value: stats.users,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: '/admin/users',
      color: 'bg-blue-50',
    },
    {
      label: 'Projects',
      value: stats.projects,
      icon: <FileText className="h-8 w-8 text-green-600" />,
      link: '/admin/projects',
      color: 'bg-green-50',
    },
    {
      label: 'Notifications',
      value: stats.notifications,
      icon: <Bell className="h-8 w-8 text-yellow-600" />,
      link: '/admin/notifications',
      color: 'bg-yellow-50',
    },
    {
      label: 'News',
      value: stats.news,
      icon: <Newspaper className="h-8 w-8 text-purple-600" />,
      link: '/admin/news',
      color: 'bg-purple-50',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      {loading ? (
        <div className="text-center py-16 text-lg">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map(card => (
            <Link to={card.link} key={card.label} className={`rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition ${card.color}`}>
              {card.icon}
              <div className="mt-4 text-3xl font-bold">{card.value}</div>
              <div className="mt-2 text-lg font-semibold text-gray-700">{card.label}</div>
              <span className="mt-2 text-blue-600 text-sm font-medium">View {card.label}</span>
            </Link>
          ))}
        </div>
      )}
      {/* Recent Activity Logs */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        {activity.length === 0 ? (
          <div className="text-gray-500">No recent activity.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Extra</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((log, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">
                      <Badge>{log.type}</Badge>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">{log.title}</td>
                    <td className="px-4 py-2 text-gray-700">{log.extra || '-'}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{new Date(log.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* All Users Table */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">All Users</h3>
        {usersList.length === 0 ? (
          <div className="text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hall Ticket</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-2 font-medium text-gray-900">{u.full_name}</td>
                    <td className="px-4 py-2 text-gray-700">{u.hall_ticket_number || '-'}</td>
                    <td className="px-4 py-2 text-gray-700">{u.role || 'student'}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <Link to="/admin/users" className="text-blue-600 hover:underline text-sm font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 