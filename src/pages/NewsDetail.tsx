import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';

interface News {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchNews();
    // eslint-disable-next-line
  }, [id]);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) setNews(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!news) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">News not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <h1 className="text-3xl font-bold mb-4 text-blue-700">{news.title}</h1>
        <div className="flex items-center text-gray-500 mb-6">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(news.created_at).toLocaleString()}
        </div>
        <div className="prose max-w-none text-lg text-gray-800 mb-4 whitespace-pre-line">
          {news.content}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail; 