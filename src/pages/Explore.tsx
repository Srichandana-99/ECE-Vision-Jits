import { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, Calendar, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<{ [key: string]: number }>({});
  const [activeIdeas, setActiveIdeas] = useState(0);
  const [activeInnovators, setActiveInnovators] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [profileIdeaCounts, setProfileIdeaCounts] = useState<{ [userId: string]: number }>({});
  const [connections, setConnections] = useState<any[]>([]);
  const [followerCounts, setFollowerCounts] = useState<{ [userId: string]: number }>({});
  const [connecting, setConnecting] = useState<string | null>(null);
  const [pendingDisconnect, setPendingDisconnect] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [{ data: ideasData, error: ideasError }, { data: profilesData, error: profilesError }, { data: connectionsData, error: connectionsError }, { data: achievementsData, error: achievementsError }] = await Promise.all([
        supabase.from('ideas').select('id, user_id, category'),
        supabase.from('profiles').select('id, full_name, role'),
        supabase.from('connections').select('follower_id, following_id'),
        supabase.from('achievements').select('id, user_id, title, description, badge_type, awarded_at')
      ]);
      if (!ideasError && ideasData) {
        setIdeas(ideasData);
        setActiveIdeas(ideasData.length);
        // Count unique user_ids for innovators
        const uniqueUsers = new Set(ideasData.map((idea: any) => idea.user_id));
        setActiveInnovators(uniqueUsers.size);
        // Count topics by category
        const topicCounts: { [key: string]: number } = {};
        ideasData.forEach((idea: any) => {
          const cat = idea.category || 'Other';
          topicCounts[cat] = (topicCounts[cat] || 0) + 1;
        });
        setTrendingTopics(topicCounts);
        // Count ideas per user
        const ideaCounts: { [userId: string]: number } = {};
        ideasData.forEach((idea: any) => {
          ideaCounts[idea.user_id] = (ideaCounts[idea.user_id] || 0) + 1;
        });
        setProfileIdeaCounts(ideaCounts);
      }
      if (!profilesError && profilesData) {
        setProfiles(profilesData);
      }
      if (!connectionsError && connectionsData) {
        setConnections(connectionsData);
        // Count followers for each user
        const counts: { [userId: string]: number } = {};
        connectionsData.forEach((conn: any) => {
          counts[conn.following_id] = (counts[conn.following_id] || 0) + 1;
        });
        setFollowerCounts(counts);
      }
      if (!achievementsError && achievementsData) {
        setAchievements(achievementsData);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-yellow-100 text-yellow-800';
      case 'community':
        return 'bg-green-100 text-green-800';
      case 'featured':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConnect = async (profileId: string) => {
    if (!user) return;
    setConnecting(profileId);
    // Check if already following
    const alreadyFollowing = connections.some(
      (conn: any) => conn.follower_id === user.id && conn.following_id === profileId
    );
    if (!alreadyFollowing) {
      const { error } = await supabase.from('connections').insert({
        follower_id: user.id,
        following_id: profileId
      });
      if (!error) {
        setConnections(prev => [...prev, { follower_id: user.id, following_id: profileId }]);
        setFollowerCounts(prev => ({
          ...prev,
          [profileId]: (prev[profileId] || 0) + 1
        }));
        toast({ title: 'Connected!', description: 'You are now following this user.' });
      } else {
        toast({ title: 'Error', description: error.message || 'Failed to connect.', variant: 'destructive' });
      }
    }
    setConnecting(null);
  };

  const handleDisconnect = async (profileId: string) => {
    if (!user) return;
    setConnecting(profileId);
    // Find the connection
    const connection = connections.find(
      (conn: any) => conn.follower_id === user.id && conn.following_id === profileId
    );
    if (!connection || !connection.id) {
      toast({ title: 'Error', description: 'Connection not found.', variant: 'destructive' });
      setConnecting(null);
      setPendingDisconnect(null);
      return;
    }
    const { error } = await supabase.from('connections').delete().eq('id', connection.id);
    if (!error) {
      setConnections(prev => prev.filter((conn: any) => conn.id !== connection.id));
      setFollowerCounts(prev => ({
        ...prev,
        [profileId]: Math.max((prev[profileId] || 1) - 1, 0)
      }));
      toast({ title: 'Disconnected', description: 'You have unfollowed this user.' });
    } else {
      toast({ title: 'Error', description: error.message || 'Failed to disconnect.', variant: 'destructive' });
    }
    setConnecting(null);
    setPendingDisconnect(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore Innovation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover trending topics, connect with innovators, and stay updated with the latest developments
          </p>
        </div>

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search topics, innovators, or ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg"
          />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="innovators">Innovators</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Trending Topics */}
          <TabsContent value="trending">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4">Trending Topics</h2>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(trendingTopics).map(([topic, count]) => (
                      <div key={topic} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{topic}</div>
                          <div className="text-sm text-gray-500">{count} active ideas</div>
                        </div>
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Explore</button>
                      </div>
                    ))}
                    {Object.keys(trendingTopics).length === 0 && <div className="text-gray-500">No topics found.</div>}
                  </div>
                )}
              </div>
              {/* Quick Stats */}
              <div>
                <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div className="text-gray-600">Active Ideas</div>
                    <div className="text-2xl font-bold text-blue-600">{activeIdeas}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div className="text-gray-600">Active Innovators</div>
                    <div className="text-2xl font-bold text-green-600">{activeInnovators}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Featured Innovators */}
          <TabsContent value="innovators">
            <div className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Innovators</h3>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                        {profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="font-semibold text-lg mb-1">{profile.full_name}</div>
                      <div className="text-gray-500 mb-2 capitalize">{profile.role}</div>
                      <div className="flex gap-8 mb-4">
                        <div className="text-center">
                          <div className="text-blue-600 font-bold text-xl">{profileIdeaCounts[profile.id] || 0}</div>
                          <div className="text-xs text-gray-500">Ideas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-600 font-bold text-xl">{followerCounts[profile.id] || 0}</div>
                          <div className="text-xs text-gray-500">Followers</div>
                        </div>
                      </div>
                      {connections.some((conn: any) => conn.follower_id === user?.id && conn.following_id === profile.id) ? (
                        <>
                          <button
                            className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded ${connecting === profile.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => setPendingDisconnect(profile.id)}
                            disabled={connecting === profile.id}
                          >
                            Connected (Disconnect)
                          </button>
                          {/* Custom Disconnect Modal */}
                          <Dialog open={pendingDisconnect === profile.id} onOpenChange={open => !open && setPendingDisconnect(null)}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Disconnect from this user?</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">Are you sure you want to disconnect from <span className="font-semibold">{profile.full_name}</span>?</div>
                              <DialogFooter>
                                <button
                                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
                                  onClick={() => setPendingDisconnect(null)}
                                >
                                  No
                                </button>
                                <button
                                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                  onClick={() => handleDisconnect(profile.id)}
                                  disabled={connecting === profile.id}
                                >
                                  Yes, Disconnect
                                </button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      ) : (
                        <button
                          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded ${connecting === profile.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleConnect(profile.id)}
                          disabled={connecting === profile.id}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                  {profiles.length === 0 && <div className="text-gray-500">No innovators found.</div>}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Recent Achievements */}
          <TabsContent value="achievements">
            <div className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h3>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-4">
                  {achievements.length === 0 && <div className="text-gray-500">No achievements found.</div>}
                  {achievements.map((ach) => {
                    const user = profiles.find((p: any) => p.id === ach.user_id);
                    return (
                      <div key={ach.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="bg-yellow-100 text-yellow-700 rounded-full p-2">
                            <Award className="h-6 w-6" />
                          </span>
                          <div>
                            <div className="font-semibold">{ach.title}</div>
                            <div className="text-sm text-gray-500">{user ? user.full_name : 'Unknown User'}</div>
                            <div className="text-xs text-gray-600 mt-1">{ach.description}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-xs px-2 py-1 rounded mb-2 ${ach.badge_type === 'milestone' ? 'bg-yellow-100 text-yellow-800' : ach.badge_type === 'community' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>{ach.badge_type}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="h-4 w-4 inline" /> {ach.awarded_at ? new Date(ach.awarded_at).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
