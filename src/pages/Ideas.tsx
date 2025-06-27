import { useState, useEffect } from 'react';
import { Search, Filter, Plus, ThumbsUp, User, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Ideas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState<string | null>(null);
  const { user } = useAuth();

  const categories = ["all", "Technology", "Healthcare", "Education", "Environment"];

  useEffect(() => {
    const fetchIdeasAndProfiles = async () => {
      setLoading(true);
      const [{ data: ideasData, error: ideasError }, { data: profilesData, error: profilesError }] = await Promise.all([
        supabase.from('ideas').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name')
      ]);
      if (!ideasError && ideasData) {
        setIdeas(ideasData);
      } else {
        setIdeas([]);
      }
      if (!profilesError && profilesData) {
        // Map user_id to full_name
        const profileMap: Record<string, string> = {};
        profilesData.forEach((profile: any) => {
          profileMap[profile.id] = profile.full_name;
        });
        setProfiles(profileMap);
      } else {
        setProfiles({});
      }
      setLoading(false);
    };
    fetchIdeasAndProfiles();
  }, []);

  // Upvote logic
  const handleUpvote = async (ideaId: string) => {
    if (!user) return;
    setUpvoting(ideaId);
    // Check if already upvoted
    const { data: existing, error: checkError } = await supabase
      .from('upvotes')
      .select('id')
      .eq('idea_id', ideaId)
      .eq('user_id', user.id)
      .single();
    if (!existing && !checkError) {
      // Insert upvote
      const { error: upvoteError } = await supabase
        .from('upvotes')
        .insert({ idea_id: ideaId, user_id: user.id });
      if (!upvoteError) {
        // Update upvotes count in UI
        setIdeas(prev => prev.map(idea =>
          idea.id === ideaId ? { ...idea, upvotes: (idea.upvotes || 0) + 1 } : idea
        ));
      }
    }
    setUpvoting(null);
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (idea.skills || []).some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || idea.status === 'approved' && idea.skills && idea.skills.includes(selectedCategory) || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Innovation Ideas</h1>
            <p className="text-gray-600 mt-1">Discover and share innovative project ideas</p>
          </div>
          <Link to="/submit-idea">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Submit Idea
            </Button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search ideas, skills, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">Loading ideas...</div>
          ) : filteredIdeas.length > 0 ? (
            filteredIdeas.map((idea) => {
              const authorName = profiles[idea.user_id] || 'Unknown';
              return (
            <Card key={idea.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                        {idea.category || 'General'}
                  </Badge>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {idea.views}
                    </div>
                    <div className="flex items-center">
                          <span title={user ? 'Upvote' : 'Sign in to upvote'}>
                            <ThumbsUp className="h-4 w-4 mr-1 cursor-pointer"
                              onClick={() => handleUpvote(idea.id)}
                              style={{ color: user ? '#2563eb' : '#a1a1aa', pointerEvents: upvoting ? 'none' : 'auto' }}
                            />
                          </span>
                      {idea.upvotes}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {idea.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {idea.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                      {(idea.skills || []).slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                      {idea.skills && idea.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{idea.skills.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                        <span className="truncate">{authorName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                        {idea.created_at ? new Date(idea.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm" asChild>
                      <Link to={`/ideas/${idea.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No ideas found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Ideas;
