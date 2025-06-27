
import { useState, useEffect } from 'react';
import { Award, Trophy, Star, Medal, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_type: string;
  awarded_at: string;
}

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user?.id)
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'gold': return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 'silver': return <Medal className="h-8 w-8 text-gray-400" />;
      case 'bronze': return <Award className="h-8 w-8 text-orange-600" />;
      default: return <Star className="h-8 w-8 text-blue-500" />;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600">Please log in to view your achievements.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Achievements</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track your progress and celebrate your milestones in the ECE-Vision Hub community
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading achievements...</div>
            </div>
          ) : achievements.length === 0 ? (
            <Card className="text-center py-12 shadow-lg border-0">
              <CardContent>
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No Achievements Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start participating in the community to earn your first achievement!
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Submit your first innovative idea</p>
                  <p>• Get upvotes from the community</p>
                  <p>• Help other students with comments</p>
                  <p>• Complete your profile</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-white shadow-md">
                          {getBadgeIcon(achievement.badge_type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <Badge className={getBadgeColor(achievement.badge_type)}>
                            {achievement.badge_type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-gray-700 mb-4 leading-relaxed">
                      {achievement.description}
                    </CardDescription>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Earned on {new Date(achievement.awarded_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Achievement Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Achievement Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6 shadow-md border-0">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">For creative and innovative ideas</p>
              </Card>
              
              <Card className="text-center p-6 shadow-md border-0">
                <Star className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">For active community participation</p>
              </Card>
              
              <Card className="text-center p-6 shadow-md border-0">
                <Medal className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Leadership</h3>
                <p className="text-sm text-gray-600">For mentoring and helping others</p>
              </Card>
              
              <Card className="text-center p-6 shadow-md border-0">
                <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-sm text-gray-600">For outstanding contributions</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Achievements;
