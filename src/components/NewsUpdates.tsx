import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface News {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  created_at: string;
}

// Unified type for rendering
interface UnifiedItem {
  id: string;
  title: string;
  description: string;
  created_at: string;
  type: 'news' | 'notification';
  priority?: string;
}

const NewsUpdates = () => {
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestItems();
  }, []);

  const fetchLatestItems = async () => {
    setLoading(true);
    try {
      // Fetch notifications
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .in('type', ['news', 'announcement', 'update'])
        .order('created_at', { ascending: false })
        .limit(6);
      // Fetch news
      const { data: news, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      if (notifError) throw notifError;
      if (newsError) throw newsError;
      // Map and merge
      const notifItems: UnifiedItem[] = (notifications || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        created_at: n.created_at,
        type: 'notification',
        priority: n.priority,
      }));
      const newsItems: UnifiedItem[] = (news || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        description: n.content,
        created_at: n.created_at,
        type: 'news',
      }));
      // Merge and sort by date
      const merged = [...notifItems, ...newsItems].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setItems(merged.slice(0, 6));
    } catch (error) {
      console.error('Error fetching news/notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Loading latest announcements...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border shadow-sm h-48 animate-pulse">
                <div className="h-full bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest announcements, events, and important information 
            from ECE-Vision Hub community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {item.type === 'notification' && item.priority && (
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                  )}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Bell className="h-4 w-4 mr-1" />
                    {item.type === 'news' ? 'News' : 'Notification'}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(item.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <Link to={item.type === 'news' ? `/news/${item.id}` : `/notifications/${item.id}`}>
                  <Button variant="outline" className="w-full">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Link to="/updates">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View All Updates
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates;
