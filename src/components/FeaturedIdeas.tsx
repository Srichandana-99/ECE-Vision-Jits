import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, User, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface IdeaData {
  id: string;
  title: string;
  description: string;
  skills: string[];
  upvotes: number;
  views: number;
  created_at: string;
  user_id: string;
}

interface Profile {
  id: string;
  full_name: string;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  skills: string[];
  upvotes: number;
  views: number;
  created_at: string;
  user_name: string;
}

const FeaturedIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedIdeas();
  }, []);

  const fetchFeaturedIdeas = async () => {
    try {
      // Fetch all approved ideas
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select(`
          id,
          title,
          description,
          skills,
          upvotes,
          views,
          created_at,
          user_id
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (ideasError) throw ideasError;

      if (!ideasData || ideasData.length === 0) {
        setIdeas([]);
        return;
      }

      // Get user IDs from ideas
      const userIds = ideasData.map((idea: IdeaData) => idea.user_id);

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedData = ideasData.map((idea: IdeaData) => {
        const profile = profilesData?.find((p: Profile) => p.id === idea.user_id);
        return {
          id: idea.id,
          title: idea.title,
          description: idea.description,
          skills: idea.skills,
          upvotes: idea.upvotes,
          views: idea.views,
          created_at: idea.created_at,
          user_name: profile?.full_name || 'Anonymous'
        };
      });

      setIdeas(combinedData);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Student Ideas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Loading innovative projects...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                <div className="h-full bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Ideas</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover innovative projects and ideas from our talented ECE students. 
            Get inspired and collaborate on groundbreaking solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {ideas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {idea.views}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
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
                  {idea.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {idea.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{idea.skills.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span className="truncate">{idea.user_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(idea.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <Link to={`/ideas`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {ideas.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No approved ideas yet.</p>
            <p className="text-gray-400 mt-2">Be the first to submit an innovative idea!</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/ideas">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View All Ideas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIdeas;
