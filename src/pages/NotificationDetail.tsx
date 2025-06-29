import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  created_at: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'news': return 'bg-blue-100 text-blue-800';
    case 'announcement': return 'bg-purple-100 text-purple-800';
    case 'update': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchNotification();
    // eslint-disable-next-line
  }, [id]);

  const fetchNotification = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) setNotification(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!notification) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Notification not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={getPriorityColor(notification.priority)}>{notification.priority?.toUpperCase()}</Badge>
          <Badge className={getTypeColor(notification.type)}>{notification.type?.toUpperCase()}</Badge>
          <Bell className="h-5 w-5 text-gray-400 ml-2" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-blue-700">{notification.title}</h1>
        <div className="flex items-center text-gray-500 mb-6">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(notification.created_at).toLocaleString()}
        </div>
        <div className="prose max-w-none text-lg text-gray-800 mb-4 whitespace-pre-line">
          {notification.description}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail; 