import { Link, useNavigate } from 'react-router-dom';
import { Lightbulb, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/submit-idea');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">ECE-Vision Hub</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Share your innovative ideas, connect with mentors, and turn your vision into reality. 
            Join our community of ECE innovators and entrepreneurs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold px-8 py-3"
              onClick={handleGetStarted}
            >
                Get Started
              </Button>
            <Link to="/ideas">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Explore Ideas
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovative Ideas</h3>
              <p className="text-blue-100 text-sm">Share your creative solutions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
              <p className="text-blue-100 text-sm">Connect with industry experts</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Recognition</h3>
              <p className="text-blue-100 text-sm">Get recognized for your work</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Growth</h3>
              <p className="text-blue-100 text-sm">Accelerate your career</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
