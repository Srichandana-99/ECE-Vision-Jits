
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedIdeas from '@/components/FeaturedIdeas';
import NewsUpdates from '@/components/NewsUpdates';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedIdeas />
      <NewsUpdates />
      <Footer />
    </div>
  );
};

export default Index;
