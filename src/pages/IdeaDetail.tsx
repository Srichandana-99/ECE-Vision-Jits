import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import React from 'react';

// Helper to generate a color from a string (user_id)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', skills: [] as string[], links: [] as string[] });
  const [newSkill, setNewSkill] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any>({});
  const [suggestionUpvotes, setSuggestionUpvotes] = useState<{ [suggestionId: string]: number }>({});
  const [userSuggestionUpvotes, setUserSuggestionUpvotes] = useState<{ [suggestionId: string]: boolean }>({});
  const [upvoters, setUpvoters] = useState<{ [suggestionId: string]: string[] }>({});
  const [showUpvoters, setShowUpvoters] = useState<string | null>(null);
  const [newSuggestion, setNewSuggestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [popId, setPopId] = useState(null);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: ideaData }, { data: suggData }, { data: profilesData }, { data: upvotesData }] = await Promise.all([
        supabase.from('ideas').select('*').eq('id', id).single(),
        supabase.from('suggestions').select('*').eq('idea_id', id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email'),
        supabase.from('suggestion_upvotes').select('suggestion_id, user_id')
      ]);
      setIdea(ideaData);
      setForm({
        title: ideaData.title,
        description: ideaData.description,
        category: ideaData.category,
        skills: ideaData.skills || [],
        links: ideaData.links || [],
      });
      setSuggestions(suggData || []);
      // Map user_id to profile info
      const profileMap: Record<string, { full_name: string; email?: string }> = {};
      (profilesData || []).forEach((profile: any) => {
        profileMap[profile.id] = { full_name: profile.full_name, email: profile.email };
      });
      setProfiles(profileMap);
      // Upvotes
      const upvoteCounts: { [suggestionId: string]: number } = {};
      const userUpvotes: { [suggestionId: string]: boolean } = {};
      const upvotersMap: { [suggestionId: string]: string[] } = {};
      (upvotesData || []).forEach((u: any) => {
        upvoteCounts[u.suggestion_id] = (upvoteCounts[u.suggestion_id] || 0) + 1;
        if (u.user_id === user?.id) userUpvotes[u.suggestion_id] = true;
        if (!upvotersMap[u.suggestion_id]) upvotersMap[u.suggestion_id] = [];
        upvotersMap[u.suggestion_id].push(profileMap[u.user_id]?.full_name || 'Unknown');
      });
      setSuggestionUpvotes(upvoteCounts);
      setUserSuggestionUpvotes(userUpvotes);
      setUpvoters(upvotersMap);
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  // Edit project handlers
  const handleEdit = () => setEditMode(true);
  const handleFormChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async () => {
    setSaving(true);
    await supabase.from('ideas').update(form).eq('id', id);
    setIdea({ ...idea, ...form });
    setEditMode(false);
    setSaving(false);
  };

  // Suggestion handlers
  const handleSuggestionSubmit = async (e: any) => {
    e.preventDefault();
    if (!newSuggestion.trim()) return;
    setSuggesting(true);
    const { data, error } = await supabase.from('suggestions').insert({
      idea_id: id,
      user_id: user.id,
      content: newSuggestion,
    }).select().single();
    if (!error && data) {
      setSuggestions([data, ...suggestions]);
      setNewSuggestion('');
    }
    setSuggesting(false);
  };

  // Suggestion upvote/un-upvote handler
  const handleSuggestionUpvote = async (suggestionId: string) => {
    if (!user) return;
    if (userSuggestionUpvotes[suggestionId]) {
      // Un-upvote
      await supabase.from('suggestion_upvotes').delete().eq('suggestion_id', suggestionId).eq('user_id', user.id);
      setSuggestionUpvotes(prev => ({ ...prev, [suggestionId]: Math.max((prev[suggestionId] || 1) - 1, 0) }));
      setUserSuggestionUpvotes(prev => ({ ...prev, [suggestionId]: false }));
      setUpvoters(prev => ({
        ...prev,
        [suggestionId]: (prev[suggestionId] || []).filter(name => name !== (profiles[user.id]?.full_name || 'Unknown'))
      }));
    } else {
      // Upvote
      await supabase.from('suggestion_upvotes').insert({ suggestion_id: suggestionId, user_id: user.id });
      setSuggestionUpvotes(prev => ({ ...prev, [suggestionId]: (prev[suggestionId] || 0) + 1 }));
      setUserSuggestionUpvotes(prev => ({ ...prev, [suggestionId]: true }));
      setUpvoters(prev => ({
        ...prev,
        [suggestionId]: [...(prev[suggestionId] || []), profiles[user.id]?.full_name || 'Unknown']
      }));
    }
    setPopId(suggestionId);
    setTimeout(() => setPopId(null), 300);
  };

  if (loading) return <div>Loading...</div>;
  if (!idea) return <div>Idea not found.</div>;

  const author = profiles[idea.user_id];

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.25);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 2rem;
          border: 1.5px solid rgba(255,255,255,0.18);
        }
        .vibrant-gradient {
          background: linear-gradient(90deg, #ff6a00 0%, #ee0979 100%);
          color: white;
        }
        .pop {
          animation: pop 0.3s cubic-bezier(.36,1.56,.64,1) 1;
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-yellow-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center justify-center overflow-auto p-6">
        <div className="glass-card w-full max-w-3xl p-10 mb-10 mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blue-600 hover:underline flex items-center gap-2 text-base font-medium"
          >
            <span className="material-icons">arrow_back</span> Back
          </button>
          {editMode ? (
            <form className="space-y-6 w-full" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg font-bold mb-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.skills.map((skill, idx) => (
                    <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="material-icons text-base">bolt</span> {skill}
                      <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => setForm({ ...form, skills: form.skills.filter((_, i) => i !== idx) })}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                      if (newSkill && newSkill.trim() && !form.skills.includes(newSkill.trim())) {
                        setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
                        setNewSkill('');
                      }
                    }}
                  >Add</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Links</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.links.map((link, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">{link}</a>
                      <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => setForm({ ...form, links: form.links.filter((_, i) => i !== idx) })}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Add link (https://...)"
                    value={newLink}
                    onChange={e => setNewLink(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                      if (newLink && /^https?:\/\//.test(newLink) && !form.links.includes(newLink)) {
                        setForm({ ...form, links: [...form.links, newLink] });
                        setNewLink('');
                      }
                    }}
                  >Add</button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter a valid URL starting with http:// or https://</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={saving}>Save</Button>
                <Button variant="outline" type="button" onClick={() => setEditMode(false)} disabled={saving}>Cancel</Button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-gray-900 dark:text-white">{idea?.title}</h1>
              <div className="flex items-center text-sm text-gray-400 mb-6 gap-2">
                <span className="font-semibold mr-1">By:</span>
                <span className="mr-2 text-gray-700 dark:text-gray-200">{author ? author.full_name : 'Unknown'}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center gap-1"><span className="material-icons text-base">calendar_today</span> {idea.created_at ? new Date(idea.created_at).toLocaleDateString() : ''}</span>
              </div>
              <p className="mb-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{idea?.description}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <span className="material-icons text-base">local_offer</span> {idea?.category}
                </span>
                {idea?.skills && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                    <span className="material-icons text-base">bolt</span> Skills: {idea.skills.join(', ')}
                  </span>
                )}
              </div>
              {idea?.links && idea.links.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Links</label>
                  <div className="flex flex-wrap gap-2">
                    {idea.links.map((link: string, idx: number) => (
                      <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold underline hover:text-blue-900">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {user && user.id === idea.user_id && !editMode && (
            <Button onClick={handleEdit} className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition font-semibold text-base">Edit</Button>
          )}
        </div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <span className="material-icons text-yellow-500">emoji_objects</span> Suggestions
          </h2>
          {user && user.id === idea.user_id ? (
            <div className="mb-4 text-sm text-gray-500">Project owners cannot submit suggestions on their own project.</div>
          ) : user && (
            <form onSubmit={handleSuggestionSubmit} className="mb-4 flex flex-col gap-2">
              <textarea
                value={newSuggestion}
                onChange={e => setNewSuggestion(e.target.value)}
                placeholder="Give a suggestion..."
                required
                className="border px-2 py-1 w-full min-h-[60px] rounded"
              />
              <Button type="submit" disabled={suggesting}>Submit Suggestion</Button>
            </form>
          )}
          <div className="space-y-5">
            {suggestions.map((s, idx) => (
              <div key={s.id} className="glass-card p-5 flex flex-col gap-2 shadow relative">
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-gradient-to-br from-pink-400 to-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-sm">
                    {author ? author.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-base">{author ? author.full_name : 'Unknown'}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><span className="material-icons text-sm">schedule</span> {new Date(s.created_at).toLocaleString()}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <Button
                      size="icon"
                      variant={userSuggestionUpvotes[s.id] ? 'secondary' : 'outline'}
                      className="ml-2 h-7 w-7"
                      onClick={() => handleSuggestionUpvote(s.id)}
                      title={userSuggestionUpvotes[s.id] ? 'Remove upvote' : 'Upvote'}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-6 0v4M5 15h14l-1.405-1.405A2.032 2.032 0 0117 12.158V11a5 5 0 00-10 0v1.159c0 .538-.214 1.055-.595 1.436L5 15z" /></svg>
                    </Button>
                    <span className={`vibrant-gradient rounded-full px-3 py-0.5 text-xs font-bold ml-2 shadow ${popId === s.id ? 'pop' : ''}`}>
                      {suggestionUpvotes[s.id] || 0}
                    </span>
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-base pl-2 border-l-4 border-pink-200 dark:border-pink-800">
                  {s.content}
                </div>
                {idx < suggestions.length - 1 && <div className="border-t border-gray-200 dark:border-gray-800 mt-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default IdeaDetail; 