import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Bell, ArrowLeft } from 'lucide-react';

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

interface UnifiedItem {
  id: string;
  title: string;
  description: string;
  created_at: string;
  type: 'news' | 'notification';
  priority?: string;
}

const Updates = () => {
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'notification'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .in('type', ['news', 'announcement', 'update'])
        .order('created_at', { ascending: false });
      const { data: news, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (notifError) throw notifError;
      if (newsError) throw newsError;
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
      const merged = [...notifItems, ...newsItems].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setItems(merged);
    } catch (error) {
      console.error('Error fetching updates:', error);
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

  const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-blue-700 flex-1 text-center">All News & Updates</h1>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'news' ? 'default' : 'outline'}
            onClick={() => setFilter('news')}
          >
            News
          </Button>
          <Button
            variant={filter === 'notification' ? 'default' : 'outline'}
            onClick={() => setFilter('notification')}
          >
            Notifications
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-16">Loading updates...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No news or notifications yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredItems.map((item) => (
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
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
        )}
      </div>
    </div>
  );
};

export default Updates; 