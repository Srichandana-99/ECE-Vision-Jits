import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { User as UserIcon, ArrowLeft, Shield, Mail, Calendar } from 'lucide-react';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any>({ projects: [], notifications: [], suggestions: [], comments: [], upvotes: [], suggestion_upvotes: [], achievements: [], connections: [], queries: [], news: [] });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchAll = async () => {
      const [{ data: user }, { data: projects }, { data: notifications }, { data: suggestions }, { data: comments }, { data: upvotes }, { data: suggestion_upvotes }, { data: achievements }, { data: connections }, { data: queries }, { data: news }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('ideas').select('*').eq('user_id', id),
        supabase.from('notifications').select('*').or(`user_id.eq.${id},user_id.is.null`),
        supabase.from('suggestions').select('*').eq('user_id', id),
        supabase.from('comments').select('*').eq('user_id', id),
        supabase.from('upvotes').select('*').eq('user_id', id),
        supabase.from('suggestion_upvotes').select('*').eq('user_id', id),
        supabase.from('achievements').select('*').eq('user_id', id),
        supabase.from('connections').select('*').or(`follower_id.eq.${id},following_id.eq.${id}`),
        supabase.from('queries').select('*').eq('user_id', id),
        supabase.from('news').select('*').eq('user_id', id),
      ]);
      setUser(user);
      setLogs({ projects, notifications, suggestions, comments, upvotes, suggestion_upvotes, achievements, connections, queries, news });
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  if (loading) return <div className="p-8">Loading user details...</div>;
  if (!user) return <div className="p-8">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Button variant="outline" className="mb-6 flex items-center gap-2" onClick={() => navigate(-1)}><ArrowLeft />Back</Button>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-3">
            <UserIcon className="h-10 w-10 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{user.full_name}</div>
          <div className="text-sm text-gray-500 mb-1 flex items-center"><Mail className="h-4 w-4 mr-1" />{user.email || user.hall_ticket_number || '-'}</div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-gray-400" />
            <span className={`text-xs font-semibold px-2 py-1 rounded ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{user.role}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Joined {new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="font-semibold">Mobile:</span> {user.mobile || '-'}</div>
          <div><span className="font-semibold">Skills:</span> {user.skills?.join(', ') || '-'}</div>
          <div><span className="font-semibold">Status:</span> {user.is_blocked ? 'Blocked' : 'Active'}</div>
          <div><span className="font-semibold">Hall Ticket:</span> {user.hall_ticket_number || '-'}</div>
        </div>
      </div>
      {/* User Actions/Logs */}
      <div className="space-y-8">
        <Section title="Projects Submitted" items={logs.projects} render={p => <div><b>{p.title}</b> <span className="text-xs text-gray-500">({new Date(p.created_at).toLocaleDateString()})</span></div>} />
        <Section title="Notifications Received" items={logs.notifications} render={n => <div><b>{n.title}</b> <span className="text-xs text-gray-500">({new Date(n.created_at).toLocaleDateString()})</span></div>} />
        <Section title="Suggestions Made" items={logs.suggestions} render={s => <div>{s.content} <span className="text-xs text-gray-500">({new Date(s.created_at).toLocaleDateString()})</span></div>} />
        <Section title="Comments Made" items={logs.comments} render={c => <div>{c.content} <span className="text-xs text-gray-500">({new Date(c.created_at).toLocaleDateString()})</span></div>} />
        <Section title="Upvotes Given" items={logs.upvotes} render={u => <div>Upvoted idea {u.idea_id} <span className="text-xs text-gray-500">({new Date(u.created_at).toLocaleDateString()})</span></div>} />
        <Section title="Suggestion Upvotes" items={logs.suggestion_upvotes} render={u => <div>Upvoted suggestion {u.suggestion_id} <span className="text-xs text-gray-500">({new Date(u.created_at).toLocaleDateString()})</span></div>} />
        <Section title="Achievements" items={logs.achievements} render={a => <div>{a.title} - {a.badge_type} <span className="text-xs text-gray-500">({new Date(a.awarded_at).toLocaleDateString()})</span></div>} />
        <Section title="Connections" items={logs.connections} render={c => <div>{c.follower_id === id ? `Following ${c.following_id}` : `Followed by ${c.follower_id}`} <span className="text-xs text-gray-500">({new Date(c.created_at).toLocaleDateString()})</span></div>} />
        <Section title="Queries Submitted" items={logs.queries} render={q => <div>{q.subject} <span className="text-xs text-gray-500">({new Date(q.created_at).toLocaleDateString()})</span></div>} />
        <Section title="News Submitted" items={logs.news} render={n => <div>{n.title} <span className="text-xs text-gray-500">({new Date(n.created_at).toLocaleDateString()})</span></div>} />
      </div>
    </div>
  );
}

function Section({ title, items, render }: { title: string, items: any[], render: (item: any) => JSX.Element }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded p-2">{render(item)}</div>
        ))}
      </div>
    </div>
  );
} 